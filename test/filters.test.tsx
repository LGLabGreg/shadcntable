import { act, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { type Product, TestTable, getRenderedNames, products } from './harness'

import { DataTableColumnHeader } from '@/registry/components/shadcntable/data-table-column-header'
import { createDataTableColumnHelper } from '@/registry/components/shadcntable/lib/features'
import { render } from '@/vitest.utils'

const columnHelper = createDataTableColumnHelper<Product>()

const nameColumn = columnHelper.accessor('name', {
  header: ({ column }) => <DataTableColumnHeader column={column} />,
  cell: ({ getValue }) => <span data-testid='name'>{getValue()}</span>,
  meta: { label: 'Name', filter: { variant: 'text', debounceMs: 0 } },
})

const columns = columnHelper.columns([
  nameColumn,
  columnHelper.accessor('category', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    meta: {
      label: 'Category',
      filter: {
        variant: 'select',
        title: 'Category',
        options: [
          { label: 'Electronics', value: 'Electronics' },
          { label: 'Furniture', value: 'Furniture' },
        ],
      },
    },
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    meta: {
      label: 'Status',
      filter: {
        variant: 'multiSelect',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Pending', value: 'pending' },
        ],
      },
    },
  }),
  columnHelper.accessor('price', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    meta: { label: 'Price', filter: { variant: 'numberRange' } },
  }),
  columnHelper.accessor('createdAt', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ getValue }) => getValue().toDateString(),
    meta: { label: 'Created', filter: { variant: 'dateRange' } },
  }),
])

async function openFilter(user: ReturnType<typeof render>['user'], title: string) {
  await user.click(screen.getByRole('button', { name: `Filter ${title}` }))
  return screen.getByRole('dialog')
}

describe('text filter', () => {
  it('filters case-insensitively and clears', async () => {
    const { user } = render(<TestTable columns={columns} data={products} />)

    const popover = await openFilter(user, 'Name')
    await user.type(within(popover).getByRole('textbox'), 'DESK')
    expect(getRenderedNames()).toEqual(['Standing Desk'])
    expect(
      screen.getByRole('button', { name: 'Filter Name', hidden: true }),
    ).toHaveAttribute('data-active', 'true')

    await user.click(within(popover).getByRole('button', { name: 'Clear filter' }))
    expect(getRenderedNames()).toHaveLength(products.length)
    expect(within(popover).getByRole('textbox')).toHaveValue('')
  })

  it('debounces typing', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const debouncedColumns = columnHelper.columns([
      columnHelper.accessor('name', {
        header: ({ column }) => <DataTableColumnHeader column={column} />,
        cell: ({ getValue }) => <span data-testid='name'>{getValue()}</span>,
        meta: { label: 'Name', filter: { variant: 'text', debounceMs: 500 } },
      }),
    ])
    const { user } = render(<TestTable columns={debouncedColumns} data={products} />, {
      userOptions: { advanceTimers: vi.advanceTimersByTime },
    })

    const popover = await openFilter(user, 'Name')
    await user.type(within(popover).getByRole('textbox'), 'mouse')
    expect(getRenderedNames()).toHaveLength(products.length)

    await act(async () => {
      vi.advanceTimersByTime(500)
    })
    expect(getRenderedNames()).toEqual(['Wireless Mouse'])
  })
})

describe('select filter', () => {
  it('keeps rows equal to the chosen option', async () => {
    const { user } = render(<TestTable columns={columns} data={products} />)

    const popover = await openFilter(user, 'Category')
    expect(within(popover).getByText('Category')).toBeInTheDocument()
    await user.click(within(popover).getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Furniture' }))

    expect(getRenderedNames()).toEqual(['Office Chair', 'Standing Desk'])
  })
})

describe('multi-select filter', () => {
  it('keeps rows matching any selected option and toggles options off', async () => {
    const { user } = render(<TestTable columns={columns} data={products} />)

    const popover = await openFilter(user, 'Status')
    await user.click(within(popover).getByRole('option', { name: 'Inactive' }))
    await user.click(within(popover).getByRole('option', { name: 'Pending' }))
    expect(getRenderedNames()).toEqual(['Office Chair', 'Standing Desk'])

    await user.click(within(popover).getByRole('option', { name: 'Inactive' }))
    expect(getRenderedNames()).toEqual(['Standing Desk'])

    await user.click(within(popover).getByRole('option', { name: 'Pending' }))
    expect(getRenderedNames()).toHaveLength(products.length)
  })

  it('matches array cell values that contain a selected option', () => {
    type Tagged = { name: string; tags: string[] }
    const helper = createDataTableColumnHelper<Tagged>()
    const taggedColumns = helper.columns([
      helper.accessor('name', {
        cell: ({ getValue }) => <span data-testid='name'>{getValue()}</span>,
      }),
      helper.accessor('tags', {
        meta: { filter: { variant: 'multiSelect', options: [] } },
      }),
    ])

    render(
      <TestTable
        columns={taggedColumns}
        data={[
          { name: 'Laptop Pro', tags: ['sale', 'new'] },
          { name: 'Monitor', tags: ['new'] },
          { name: 'Office Chair', tags: [] },
        ]}
        initialState={{ columnFilters: [{ id: 'tags', value: ['sale'] }] }}
      />,
    )

    expect(getRenderedNames()).toEqual(['Laptop Pro'])
  })
})

describe('number range filter', () => {
  it('filters by min, max and both', async () => {
    const { user } = render(<TestTable columns={columns} data={products} />)

    const popover = await openFilter(user, 'Price')
    const min = within(popover).getByRole('spinbutton', { name: 'Min' })
    const max = within(popover).getByRole('spinbutton', { name: 'Max' })

    await user.type(min, '400')
    expect(getRenderedNames()).toEqual(['Laptop Pro', 'Standing Desk', 'Monitor'])

    await user.type(max, '600')
    expect(getRenderedNames()).toEqual(['Standing Desk', 'Monitor'])

    await user.clear(min)
    expect(getRenderedNames()).toEqual([
      'Wireless Mouse',
      'Office Chair',
      'Standing Desk',
      'Monitor',
    ])

    await user.clear(max)
    expect(getRenderedNames()).toHaveLength(products.length)
  })
})

describe('date range filter', () => {
  it('includes whole days at both ends of the range', () => {
    render(
      <TestTable
        columns={columns}
        data={products}
        initialState={{
          columnFilters: [
            {
              id: 'createdAt',
              value: { from: new Date(2024, 1, 20), to: new Date(2024, 2, 10) },
            },
          ],
        }}
      />,
    )

    // Wireless Mouse was created at 18:30 on the first day of the range.
    expect(getRenderedNames()).toEqual(['Wireless Mouse', 'Office Chair'])
  })

  it('treats a missing end as open', () => {
    render(
      <TestTable
        columns={columns}
        data={products}
        initialState={{
          columnFilters: [{ id: 'createdAt', value: { from: new Date(2024, 3, 1) } }],
        }}
      />,
    )

    expect(getRenderedNames()).toEqual(['Standing Desk', 'Monitor'])
  })

  it('accepts timestamps and date strings as cell values', () => {
    type Event = { name: string; at: number | string | null }
    const helper = createDataTableColumnHelper<Event>()
    const eventColumns = helper.columns([
      helper.accessor('name', {
        cell: ({ getValue }) => <span data-testid='name'>{getValue()}</span>,
      }),
      helper.accessor('at', { meta: { filter: { variant: 'dateRange' } } }),
    ])

    render(
      <TestTable
        columns={eventColumns}
        data={[
          { name: 'Laptop Pro', at: new Date(2024, 5, 3).getTime() },
          { name: 'Monitor', at: '2024-06-04T12:00:00' },
          { name: 'Office Chair', at: '2024-07-01T12:00:00' },
          { name: 'Standing Desk', at: null },
        ]}
        initialState={{
          columnFilters: [
            {
              id: 'at',
              value: { from: new Date(2024, 5, 1), to: new Date(2024, 5, 30) },
            },
          ],
        }}
      />,
    )

    expect(getRenderedNames()).toEqual(['Laptop Pro', 'Monitor'])
  })

  it('picks a range with the calendar', async () => {
    const { user } = render(
      <TestTable
        columns={columns}
        data={products}
        initialState={{
          columnFilters: [{ id: 'createdAt', value: { from: new Date(2024, 2, 1) } }],
        }}
      />,
    )

    const popover = await openFilter(user, 'Created')
    // The calendar opens on the month of the current range start.
    await user.click(within(popover).getByRole('button', { name: /March 12th, 2024/ }))

    expect(getRenderedNames()).toEqual(['Office Chair'])
  })
})

describe('custom filter', () => {
  it('renders the component and filters with the column filterFn', async () => {
    const customColumns = columnHelper.columns([
      nameColumn,
      columnHelper.accessor('price', {
        header: ({ column }) => <DataTableColumnHeader column={column} />,
        filterFn: (row, columnId, premiumOnly: boolean) =>
          !premiumOnly || row.getValue<number>(columnId) > 500,
        meta: {
          label: 'Price',
          filter: {
            variant: 'custom',
            component: ({ value, onChange }) => (
              <button type='button' onClick={() => onChange(value ? undefined : true)}>
                Premium only
              </button>
            ),
          },
        },
      }),
    ])
    const { user } = render(<TestTable columns={customColumns} data={products} />)

    const popover = await openFilter(user, 'Price')
    await user.click(within(popover).getByRole('button', { name: 'Premium only' }))

    expect(getRenderedNames()).toEqual(['Laptop Pro', 'Standing Desk'])
  })
})

describe('combined filters', () => {
  it('applies every active filter', () => {
    render(
      <TestTable
        columns={columns}
        data={products}
        initialState={{
          columnFilters: [
            { id: 'category', value: 'Electronics' },
            { id: 'price', value: [100, undefined] },
          ],
        }}
      />,
    )
    expect(getRenderedNames()).toEqual(['Laptop Pro', 'Monitor'])
  })

  it('resets column filters from the toolbar', async () => {
    const { user } = render(
      <TestTable
        columns={columns}
        data={products}
        initialState={{ columnFilters: [{ id: 'category', value: 'Furniture' }] }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Reset' }))

    expect(getRenderedNames()).toHaveLength(products.length)
    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument()
  })
})
