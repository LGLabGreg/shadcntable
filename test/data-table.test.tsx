import type { PaginationState } from '@tanstack/react-table'
import { screen, within } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { type Product, TestTable, getRenderedNames, products } from './harness'

import { DataTableColumnHeader } from '@/registry/components/shadcntable/data-table-column-header'
import { createSelectionColumn } from '@/registry/components/shadcntable/data-table-selection-column'
import { createDataTableColumnHelper } from '@/registry/components/shadcntable/lib/features'
import { render } from '@/vitest.utils'

const columnHelper = createDataTableColumnHelper<Product>()

const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ getValue }) => <span data-testid='name'>{getValue()}</span>,
    meta: { label: 'Name' },
  }),
  columnHelper.accessor('category', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    meta: { label: 'Category' },
  }),
  columnHelper.accessor('price', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    meta: { label: 'Price' },
  }),
])

const selectableColumns = columnHelper.columns([
  createSelectionColumn<Product>(),
  ...columns,
])

const manyProducts: Product[] = Array.from({ length: 25 }, (_, index) => ({
  ...products[index % products.length],
  id: String(index),
  name: `Product ${index + 1}`,
}))

function bodyRows() {
  return within(document.querySelector('tbody')!).getAllByRole('row')
}

describe('DataTable rendering', () => {
  it('renders headers and rows', () => {
    render(<TestTable columns={columns} data={products} />)

    expect(screen.getByRole('button', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Category' })).toBeInTheDocument()
    expect(getRenderedNames()).toEqual(products.map((product) => product.name))
  })

  it('renders the default empty state', () => {
    render(<TestTable columns={columns} data={[]} />)
    expect(screen.getByText('No results.')).toBeInTheDocument()
  })

  it('renders a custom empty state', () => {
    render(
      <TestTable
        columns={columns}
        data={[]}
        tableProps={{ emptyState: <p>Nothing here</p> }}
      />,
    )
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('renders skeleton rows while loading', () => {
    render(
      <TestTable
        columns={columns}
        data={products}
        tableProps={{ isLoading: true, skeletonRowCount: 3 }}
      />,
    )
    expect(getRenderedNames()).toEqual([])
    expect(bodyRows()).toHaveLength(3)
  })

  it('overlays a spinner on the current rows while fetching', () => {
    render(
      <TestTable columns={columns} data={products} tableProps={{ isFetching: true }} />,
    )
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(getRenderedNames()).toHaveLength(products.length)
  })

  it('shows skeletons rather than the spinner when loading and fetching', () => {
    render(
      <TestTable
        columns={columns}
        data={products}
        tableProps={{ isLoading: true, isFetching: true }}
      />,
    )
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('DataTable row clicks', () => {
  it('calls onRowClick with the row', async () => {
    const onRowClick = vi.fn()
    const { user } = render(
      <TestTable columns={columns} data={products} tableProps={{ onRowClick }} />,
    )

    await user.click(screen.getByText('Office Chair'))

    expect(onRowClick).toHaveBeenCalledOnce()
    expect(onRowClick.mock.calls[0][0].original).toBe(products[2])
  })

  it('supports Enter on a focused row', async () => {
    const onRowClick = vi.fn()
    const { user } = render(
      <TestTable columns={columns} data={products} tableProps={{ onRowClick }} />,
    )

    bodyRows()[0].focus()
    await user.keyboard('{Enter}')

    expect(onRowClick).toHaveBeenCalledOnce()
  })

  it('ignores clicks on interactive elements inside the row', async () => {
    const onRowClick = vi.fn()
    const { user } = render(
      <TestTable
        columns={selectableColumns}
        data={products}
        tableProps={{ onRowClick }}
      />,
    )

    await user.click(screen.getAllByRole('checkbox', { name: 'Select row' })[0])

    expect(onRowClick).not.toHaveBeenCalled()
  })
})

describe('DataTable pagination', () => {
  it('shows the first page and the page count', () => {
    render(<TestTable columns={columns} data={manyProducts} />)

    expect(getRenderedNames()).toHaveLength(10)
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
  })

  it('navigates between pages', async () => {
    const { user } = render(<TestTable columns={columns} data={manyProducts} />)

    await user.click(screen.getByRole('button', { name: 'Go to next page' }))
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument()
    expect(getRenderedNames()[0]).toBe('Product 11')

    await user.click(screen.getByRole('button', { name: 'Go to last page' }))
    expect(screen.getByText('Page 3 of 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Go to previous page' }))
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Go to first page' }))
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled()
  })

  it('changes the page size', async () => {
    const { user } = render(<TestTable columns={columns} data={manyProducts} />)

    await user.click(screen.getByRole('combobox', { name: 'Rows per page' }))
    await user.click(screen.getByRole('option', { name: '20' }))

    expect(getRenderedNames()).toHaveLength(20)
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
  })

  it('respects the initial page size', () => {
    render(
      <TestTable
        columns={columns}
        data={manyProducts}
        initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
      />,
    )
    expect(getRenderedNames()).toHaveLength(5)
  })

  it('supports server-side pagination with controlled state', async () => {
    const onPaginationChange = vi.fn()

    function ServerTable() {
      const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
      })
      return (
        <TestTable
          columns={columns}
          data={manyProducts.slice(0, 10)}
          manualPagination
          rowCount={95}
          state={{ pagination }}
          onPaginationChange={(updater) => {
            setPagination(updater)
            onPaginationChange(updater)
          }}
        />
      )
    }

    const { user } = render(<ServerTable />)
    expect(screen.getByText('Page 1 of 10')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Go to next page' }))

    expect(screen.getByText('Page 2 of 10')).toBeInTheDocument()
    expect(onPaginationChange).toHaveBeenCalledOnce()
    // Manual mode renders the data as given, without slicing it.
    expect(getRenderedNames()).toHaveLength(10)
  })
})

describe('DataTable row selection', () => {
  it('selects a single row', async () => {
    const { user } = render(<TestTable columns={selectableColumns} data={products} />)

    await user.click(screen.getAllByRole('checkbox', { name: 'Select row' })[0])

    expect(bodyRows()[0]).toHaveAttribute('data-state', 'selected')
    expect(screen.getByText('1 of 5 row(s) selected.')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute(
      'data-state',
      'indeterminate',
    )
  })

  it('selects every row on the page from the header', async () => {
    const { user } = render(<TestTable columns={selectableColumns} data={products} />)

    await user.click(screen.getByRole('checkbox', { name: 'Select all' }))

    expect(screen.getByText('5 of 5 row(s) selected.')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute(
      'data-state',
      'checked',
    )
  })

  it('disables rows that cannot be selected', () => {
    render(
      <TestTable
        columns={selectableColumns}
        data={products}
        enableRowSelection={(row) => row.original.status === 'active'}
      />,
    )

    const checkboxes = screen.getAllByRole('checkbox', { name: 'Select row' })
    expect(
      checkboxes.filter((checkbox) => checkbox.hasAttribute('disabled')),
    ).toHaveLength(2)
  })

  it('hides the selected count without a selection column', () => {
    render(<TestTable columns={columns} data={products} />)
    expect(screen.queryByText(/row\(s\) selected/)).not.toBeInTheDocument()
  })
})

describe('DataTable sorting', () => {
  it('sorts from the column header menu', async () => {
    const { user } = render(<TestTable columns={columns} data={products} />)

    await user.click(screen.getByRole('button', { name: 'Price' }))
    await user.click(screen.getByRole('menuitem', { name: 'Sort ascending' }))
    expect(getRenderedNames()).toEqual([
      'Wireless Mouse',
      'Office Chair',
      'Monitor',
      'Standing Desk',
      'Laptop Pro',
    ])

    await user.click(screen.getByRole('button', { name: 'Price' }))
    await user.click(screen.getByRole('menuitem', { name: 'Sort descending' }))
    expect(getRenderedNames()[0]).toBe('Laptop Pro')

    await user.click(screen.getByRole('button', { name: 'Price' }))
    await user.click(screen.getByRole('menuitem', { name: 'Clear sorting' }))
    expect(getRenderedNames()).toEqual(products.map((product) => product.name))
  })

  it('renders a plain title for columns that cannot sort, hide or filter', () => {
    const staticColumns = columnHelper.columns([
      columnHelper.accessor('name', {
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
        enableSorting: false,
        enableHiding: false,
      }),
    ])
    render(<TestTable columns={staticColumns} data={products} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Name' })).not.toBeInTheDocument()
  })
})

describe('DataTable column visibility', () => {
  it('hides a column from its header menu', async () => {
    const { user } = render(<TestTable columns={columns} data={products} />)

    await user.click(screen.getByRole('button', { name: 'Category' }))
    await user.click(screen.getByRole('menuitem', { name: 'Hide column' }))

    expect(screen.queryByRole('button', { name: 'Category' })).not.toBeInTheDocument()
  })

  it('toggles columns from the view options menu', async () => {
    const { user } = render(<TestTable columns={columns} data={products} />)

    await user.click(screen.getByRole('button', { name: 'View' }))
    const option = screen.getByRole('menuitemcheckbox', { name: 'Category' })
    expect(option).toHaveAttribute('data-state', 'checked')

    await user.click(option)
    expect(screen.queryByRole('button', { name: 'Category' })).not.toBeInTheDocument()

    // The menu stays open, so the column can be toggled straight back on.
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Category' }))
    await user.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'Category' })).toBeInTheDocument()
  })

  it('does not list the selection column in view options', async () => {
    const { user } = render(<TestTable columns={selectableColumns} data={products} />)

    await user.click(screen.getByRole('button', { name: 'View' }))

    expect(screen.getAllByRole('menuitemcheckbox')).toHaveLength(3)
  })
})

describe('DataTable global search', () => {
  it('filters rows and resets', async () => {
    const { user } = render(<TestTable columns={columns} data={products} />)

    await user.type(screen.getByRole('searchbox', { name: 'Search...' }), 'furn')
    expect(getRenderedNames()).toEqual(['Office Chair', 'Standing Desk'])

    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(getRenderedNames()).toHaveLength(products.length)
    expect(screen.getByRole('searchbox')).toHaveValue('')
  })

  it('shows the empty state when nothing matches', async () => {
    const { user } = render(<TestTable columns={columns} data={products} />)

    await user.type(screen.getByRole('searchbox'), 'zzz')

    expect(screen.getByText('No results.')).toBeInTheDocument()
  })
})

describe('DataTable locale', () => {
  it('merges overrides with the default strings', async () => {
    const { user } = render(
      <TestTable
        columns={selectableColumns}
        data={manyProducts}
        locale={{
          toolbar: { searchPlaceholder: 'Rechercher...' },
          pagination: { pageOf: (page, count) => `Page ${page} sur ${count}` },
        }}
      />,
    )

    expect(screen.getByPlaceholderText('Rechercher...')).toBeInTheDocument()
    expect(screen.getByText('Page 1 sur 3')).toBeInTheDocument()
    // Strings that were not overridden keep their defaults.
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox'), 'zzz')
    expect(screen.getByText('No results.')).toBeInTheDocument()
  })
})
