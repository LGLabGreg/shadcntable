import { defaultDataTableLocale } from '@/registry/components/shadcntable/config/locale'
import { DataTable } from '@/registry/components/shadcntable/data-table'
import { DataTableColumnHeader } from '@/registry/components/shadcntable/data-table-column-header'
import { render } from '@/vitest.utils'
import { type ColumnDef } from '@tanstack/react-table'
import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

type TestUser = {
  id: string
  name: string
  email: string
  age: number
}

const testData: TestUser[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 40 },
]

const columns: ColumnDef<TestUser>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
  },
  {
    accessorKey: 'age',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Age' />,
  },
]

describe('DataTable', () => {
  it('renders with data', () => {
    render(<DataTable columns={columns} data={testData} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(<DataTable columns={columns} data={testData} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
  })

  it('renders all data cells', () => {
    render(<DataTable columns={columns} data={testData} />)

    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()

    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('40')).toBeInTheDocument()
  })

  it('renders empty state when no data provided', () => {
    render(<DataTable columns={columns} data={[]} />)

    expect(screen.getByText(defaultDataTableLocale.body.noResults)).toBeInTheDocument()
  })

  it('renders custom empty state', () => {
    render(
      <DataTable columns={columns} data={[]} emptyState={<div>No users found</div>} />,
    )

    expect(screen.getByText('No users found')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    render(<DataTable columns={columns} data={[]} isLoading />)

    // Should show skeleton rows instead of "No results"
    expect(
      screen.queryByText(defaultDataTableLocale.body.noResults),
    ).not.toBeInTheDocument()
  })

  it('calls onRowClick when row is clicked', async () => {
    const handleRowClick = vi.fn()

    const { user } = render(
      <DataTable columns={columns} data={testData} onRowClick={handleRowClick} />,
    )

    const row = screen.getByText('John Doe').closest('tr')
    if (row) {
      await user.click(row)
    }

    expect(handleRowClick).toHaveBeenCalledWith(testData[0])
  })
})

describe('DataTable with isFetching', () => {
  it('shows overlay with spinner when isFetching is true', () => {
    render(<DataTable columns={columns} data={testData} isFetching />)

    // Spinner should be present (has role="status" and aria-label="Loading")
    const spinner = screen.getByRole('status', { name: 'Loading' })
    expect(spinner).toBeInTheDocument()
  })

  it('keeps existing rows visible when isFetching is true', () => {
    render(<DataTable columns={columns} data={testData} isFetching />)

    // Existing rows should still be visible
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
  })

  it('does not show overlay when isFetching is false', () => {
    render(<DataTable columns={columns} data={testData} isFetching={false} />)

    // Overlay should not be present
    const overlay = document.querySelector('.absolute.inset-0.top-10')
    expect(overlay).not.toBeInTheDocument()
  })

  it('shows skeleton rows when isLoading is true, even with isFetching', () => {
    render(<DataTable columns={columns} data={[]} isLoading isFetching />)

    // Should show skeleton rows (isLoading takes precedence for empty data)
    expect(
      screen.queryByText(defaultDataTableLocale.body.noResults),
    ).not.toBeInTheDocument()

    // Should not show actual data rows
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })

  it('isLoading takes precedence over isFetching - shows skeletons when isLoading is true', () => {
    render(<DataTable columns={columns} data={testData} isLoading isFetching />)

    // Should show skeleton rows (isLoading returns early)
    expect(
      screen.queryByText(defaultDataTableLocale.body.noResults),
    ).not.toBeInTheDocument()

    // Should not show actual data rows
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()

    // Overlay should not be present because isLoading returns early
    const overlay = document.querySelector('.absolute.inset-0.top-10')
    expect(overlay).not.toBeInTheDocument()
  })
})

describe('DataTable with pagination', () => {
  const manyUsers: TestUser[] = Array.from({ length: 25 }, (_, i) => ({
    id: String(i + 1),
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + i,
  }))

  it('renders pagination controls', () => {
    render(<DataTable columns={columns} data={manyUsers} pagination={{ pageSize: 10 }} />)

    // Should show pagination text
    expect(screen.getByText(/Page 1 of/)).toBeInTheDocument()
  })

  it('shows correct number of rows per page', () => {
    render(<DataTable columns={columns} data={manyUsers} pagination={{ pageSize: 5 }} />)

    // Should only show 5 rows
    const rows = screen.getAllByRole('row')
    // Header row + 5 data rows
    expect(rows).toHaveLength(6)
  })

  it('navigates to next page', async () => {
    const { user } = render(
      <DataTable columns={columns} data={manyUsers} pagination={{ pageSize: 10 }} />,
    )

    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.queryByText('User 11')).not.toBeInTheDocument()

    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)

    expect(screen.queryByText('User 1')).not.toBeInTheDocument()
    expect(screen.getByText('User 11')).toBeInTheDocument()
  })

  it('changes page size when selecting from dropdown', async () => {
    const { user } = render(
      <DataTable
        columns={columns}
        data={manyUsers}
        pagination={{ pageSize: 10, pageSizeOptions: [10, 25, 50] }}
      />,
    )

    // Initially should show 10 rows
    let rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(11) // Header + 10 data rows

    // Click the page size select trigger
    const selectTrigger = screen.getByRole('combobox')
    await user.click(selectTrigger)

    // Select 25 rows per page
    const option25 = screen.getByRole('option', { name: '25' })
    await user.click(option25)

    // Should now show 25 rows
    rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(26) // Header + 25 data rows
  })

  it('navigates to first page when clicking first page button', async () => {
    const { user } = render(
      <DataTable columns={columns} data={manyUsers} pagination={{ pageSize: 10 }} />,
    )

    // Go to page 2 first
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)

    expect(screen.getByText('User 11')).toBeInTheDocument()
    expect(screen.queryByText('User 1')).not.toBeInTheDocument()

    // Click first page button
    const firstPageButton = screen.getByRole('button', {
      name: defaultDataTableLocale.pagination.goToFirstPage,
    })
    await user.click(firstPageButton)

    // Should be back on first page
    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.queryByText('User 11')).not.toBeInTheDocument()
  })

  it('navigates to last page when clicking last page button', async () => {
    const { user } = render(
      <DataTable columns={columns} data={manyUsers} pagination={{ pageSize: 10 }} />,
    )

    // Initially on first page
    expect(screen.getByText('User 1')).toBeInTheDocument()

    // Click last page button
    const lastPageButton = screen.getByRole('button', {
      name: defaultDataTableLocale.pagination.goToLastPage,
    })
    await user.click(lastPageButton)

    // Should be on last page (users 21-25)
    expect(screen.getByText('User 21')).toBeInTheDocument()
    expect(screen.queryByText('User 1')).not.toBeInTheDocument()
  })

  it('navigates to previous page when clicking previous page button', async () => {
    const { user } = render(
      <DataTable columns={columns} data={manyUsers} pagination={{ pageSize: 10 }} />,
    )

    // Go to page 2 first
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)

    expect(screen.getByText('User 11')).toBeInTheDocument()

    // Click previous page button
    const prevButton = screen.getByRole('button', {
      name: defaultDataTableLocale.pagination.goToPreviousPage,
    })
    await user.click(prevButton)

    // Should be back on first page
    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.queryByText('User 11')).not.toBeInTheDocument()
  })

  it('supports manual/server-side pagination with onPaginationChange', async () => {
    const handlePaginationChange = vi.fn()

    const { user, rerender } = render(
      <DataTable
        columns={columns}
        data={manyUsers.slice(0, 10)}
        pagination={{
          manual: true,
          pageIndex: 0,
          pageSize: 10,
          rowCount: manyUsers.length,
          onPaginationChange: handlePaginationChange,
        }}
      />,
    )

    // Initially on first page
    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.queryByText('User 11')).not.toBeInTheDocument()

    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)

    expect(handlePaginationChange).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 10 })

    // Simulate consumer updating external state and providing new page data
    rerender(
      <DataTable
        columns={columns}
        data={manyUsers.slice(10, 20)}
        pagination={{
          manual: true,
          pageIndex: 1,
          pageSize: 10,
          rowCount: manyUsers.length,
          onPaginationChange: handlePaginationChange,
        }}
      />,
    )

    expect(screen.getByText('User 11')).toBeInTheDocument()
    expect(screen.queryByText('User 1')).not.toBeInTheDocument()
  })
})

describe('DataTable with row selection', () => {
  it('renders selection checkboxes', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection={{ onRowSelectionChange: vi.fn() }}
      />,
    )

    const checkboxes = screen.getAllByRole('checkbox')
    // Header checkbox + 3 row checkboxes
    expect(checkboxes).toHaveLength(4)
  })

  it('selects a single row', async () => {
    const handleSelectionChange = vi.fn()

    const { user } = render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection={{
          onRowSelectionChange: handleSelectionChange,
        }}
      />,
    )

    const checkboxes = screen.getAllByRole('checkbox')
    // Click the first row's checkbox (index 1, as 0 is the header)
    await user.click(checkboxes[1])

    expect(handleSelectionChange).toHaveBeenCalledWith([testData[0]])
  })

  it('selects all rows via header checkbox', async () => {
    const handleSelectionChange = vi.fn()

    const { user } = render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection={{
          onRowSelectionChange: handleSelectionChange,
        }}
      />,
    )

    const headerCheckbox = screen.getAllByRole('checkbox')[0]
    await user.click(headerCheckbox)

    expect(handleSelectionChange).toHaveBeenCalledWith(testData)
  })
})

describe('DataTable localization', () => {
  it('uses custom locale strings', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        locale={{
          body: {
            noResults: 'Keine Ergebnisse',
          },
        }}
      />,
    )

    expect(screen.getByText('Keine Ergebnisse')).toBeInTheDocument()
  })
})

describe('DataTable Toolbar', () => {
  it('filters data globally when typing in search input', async () => {
    const { user } = render(<DataTable columns={columns} data={testData} />)

    // All users should be visible initially
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()

    // Find the search input by placeholder
    const searchInput = screen.getByPlaceholderText(
      defaultDataTableLocale.toolbar.searchPlaceholder,
    )
    await user.type(searchInput, 'John')

    // Only John Doe and Bob Johnson should be visible (both contain "John")
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('shows no results when global search matches nothing', async () => {
    const { user } = render(<DataTable columns={columns} data={testData} />)

    const searchInput = screen.getByPlaceholderText(
      defaultDataTableLocale.toolbar.searchPlaceholder,
    )
    await user.type(searchInput, 'XYZ123')

    expect(screen.getByText(defaultDataTableLocale.body.noResults)).toBeInTheDocument()
  })

  it('clears global search and shows all data', async () => {
    const { user } = render(<DataTable columns={columns} data={testData} />)

    const searchInput = screen.getByPlaceholderText(
      defaultDataTableLocale.toolbar.searchPlaceholder,
    )
    await user.type(searchInput, 'John')

    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()

    await user.clear(searchInput)

    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
  })
})

describe('DataTable View Options', () => {
  it('toggles column visibility via view options dropdown', async () => {
    const { user } = render(<DataTable columns={columns} data={testData} />)

    // Email column should be visible initially
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()

    // Open view options dropdown
    const viewButton = screen.getByRole('button', {
      name: defaultDataTableLocale.viewOptions.view,
    })
    await user.click(viewButton)

    // Find the email checkbox and uncheck it
    const emailCheckbox = screen.getByRole('menuitemcheckbox', { name: /email/i })
    await user.click(emailCheckbox)

    // Email column should now be hidden
    expect(screen.queryByText('Email')).not.toBeInTheDocument()
    expect(screen.queryByText('john@example.com')).not.toBeInTheDocument()

    // Other columns should still be visible
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
  })

  it('shows column again when checkbox is re-checked', async () => {
    const { user } = render(<DataTable columns={columns} data={testData} />)

    // Open view options dropdown and hide email column
    const viewButton = screen.getByRole('button', {
      name: defaultDataTableLocale.viewOptions.view,
    })
    await user.click(viewButton)

    const emailCheckbox = screen.getByRole('menuitemcheckbox', { name: /email/i })
    await user.click(emailCheckbox)

    // Email should be hidden
    expect(screen.queryByText('Email')).not.toBeInTheDocument()

    // Re-open dropdown and re-check email
    await user.click(viewButton)
    const emailCheckboxAgain = screen.getByRole('menuitemcheckbox', { name: /email/i })
    await user.click(emailCheckboxAgain)

    // Email column should be visible again
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
})

describe('DataTable Column Header', () => {
  // Columns with sorting disabled and no filter
  const columnsWithoutSortAndFilter: ColumnDef<TestUser>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
      enableSorting: false,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    },
  ]

  it('renders just title text when column cannot sort and has no filter', () => {
    render(<DataTable columns={columnsWithoutSortAndFilter} data={testData} />)

    // The Name column header should just be plain text without sorting controls
    const nameHeader = screen.getByText('Name').closest('th')
    // Should not have sort button in name column (since enableSorting: false and no filter)
    expect(
      within(nameHeader!).queryByRole('button', {
        name: defaultDataTableLocale.columnHeader.sortMenuLabel,
      }),
    ).not.toBeInTheDocument()
  })

  it('sorts ascending when clicking sort ascending menu item', async () => {
    const { user } = render(<DataTable columns={columns} data={testData} />)

    // Open sort dropdown for Name column
    const nameHeader = screen.getByText('Name').closest('th')
    const sortButton = within(nameHeader!).getByRole('button', {
      name: defaultDataTableLocale.columnHeader.sortMenuLabel,
    })
    await user.click(sortButton)

    // Click sort ascending
    const sortAscItem = screen.getByRole('menuitem', {
      name: defaultDataTableLocale.columnHeader.sortAscending,
    })
    await user.click(sortAscItem)

    // Check data is sorted ascending (Bob, Jane, John)
    const rows = screen.getAllByRole('row')
    expect(within(rows[1]).getByText('Bob Johnson')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Jane Smith')).toBeInTheDocument()
    expect(within(rows[3]).getByText('John Doe')).toBeInTheDocument()
  })

  it('sorts descending when clicking sort descending menu item', async () => {
    const { user } = render(<DataTable columns={columns} data={testData} />)

    // Open sort dropdown for Name column
    const nameHeader = screen.getByText('Name').closest('th')
    const sortButton = within(nameHeader!).getByRole('button', {
      name: defaultDataTableLocale.columnHeader.sortMenuLabel,
    })
    await user.click(sortButton)

    // Click sort descending
    const sortDescItem = screen.getByRole('menuitem', {
      name: defaultDataTableLocale.columnHeader.sortDescending,
    })
    await user.click(sortDescItem)

    // Check data is sorted descending (John, Jane, Bob)
    const rows = screen.getAllByRole('row')
    expect(within(rows[1]).getByText('John Doe')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Jane Smith')).toBeInTheDocument()
    expect(within(rows[3]).getByText('Bob Johnson')).toBeInTheDocument()
  })

  it('clears sorting when clicking clear sorting menu item', async () => {
    const { user } = render(<DataTable columns={columns} data={testData} />)

    // First, sort ascending
    const nameHeader = screen.getByText('Name').closest('th')
    const sortButton = within(nameHeader!).getByRole('button', {
      name: defaultDataTableLocale.columnHeader.sortMenuLabel,
    })
    await user.click(sortButton)

    const sortAscItem = screen.getByRole('menuitem', {
      name: defaultDataTableLocale.columnHeader.sortAscending,
    })
    await user.click(sortAscItem)

    // Verify sorted
    let rows = screen.getAllByRole('row')
    expect(within(rows[1]).getByText('Bob Johnson')).toBeInTheDocument()

    // Open dropdown again and clear sorting
    await user.click(sortButton)
    const clearSortItem = screen.getByRole('menuitem', {
      name: defaultDataTableLocale.columnHeader.clearSorting,
    })
    await user.click(clearSortItem)

    // Data should be back to original order
    rows = screen.getAllByRole('row')
    expect(within(rows[1]).getByText('John Doe')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Jane Smith')).toBeInTheDocument()
    expect(within(rows[3]).getByText('Bob Johnson')).toBeInTheDocument()
  })

  it('hides column when clicking hide column menu item', async () => {
    const { user } = render(<DataTable columns={columns} data={testData} />)

    // Verify Email column is visible
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()

    // Open sort dropdown for Email column
    const emailHeader = screen.getByText('Email').closest('th')
    const sortButton = within(emailHeader!).getByRole('button', {
      name: defaultDataTableLocale.columnHeader.sortMenuLabel,
    })
    await user.click(sortButton)

    // Click hide column
    const hideColumnItem = screen.getByRole('menuitem', {
      name: defaultDataTableLocale.columnHeader.hideColumn,
    })
    await user.click(hideColumnItem)

    // Email column should now be hidden
    expect(screen.queryByText('Email')).not.toBeInTheDocument()
    expect(screen.queryByText('john@example.com')).not.toBeInTheDocument()
  })
})
