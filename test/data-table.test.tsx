import { defaultDataTableLocale } from '@/registry/components/shadcntable/config/locale'
import { DataTable } from '@/registry/components/shadcntable/data-table'
import { DataTableColumnHeader } from '@/registry/components/shadcntable/data-table-column-header'
import { render } from '@/vitest.utils'
import { type ColumnDef } from '@tanstack/react-table'
import { screen } from '@testing-library/react'
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
})

describe('DataTable with row selection', () => {
  it('renders selection checkboxes', () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        rowSelection={{ enableRowSelection: true }}
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
          enableRowSelection: true,
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
          enableRowSelection: true,
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
