import { defaultDataTableLocale } from '@/registry/components/shadcntable/config/locale'
import { DataTable } from '@/registry/components/shadcntable/data-table'
import { DataTableColumnHeader } from '@/registry/components/shadcntable/data-table-column-header'
import { render } from '@/vitest.utils'
import { type ColumnDef } from '@tanstack/react-table'
import { act, screen, waitFor, within } from '@testing-library/react'
import type userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type Product = {
  id: string
  name: string
  category: string
  status: 'active' | 'inactive' | 'pending'
  price: number
  stock: number
  createdAt: Date
}

const testProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro',
    category: 'Electronics',
    status: 'active',
    price: 1299,
    stock: 50,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    category: 'Electronics',
    status: 'active',
    price: 49,
    stock: 200,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Office Chair',
    category: 'Furniture',
    status: 'inactive',
    price: 299,
    stock: 0,
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    name: 'Standing Desk',
    category: 'Furniture',
    status: 'pending',
    price: 599,
    stock: 15,
    createdAt: new Date('2024-04-05'),
  },
  {
    id: '5',
    name: 'Monitor 27"',
    category: 'Electronics',
    status: 'active',
    price: 449,
    stock: 75,
    createdAt: new Date('2024-05-01'),
  },
]

const columnsWithTextFilter: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    meta: {
      filterConfig: {
        title: 'Filter by name',
        variant: 'text',
        placeholder: 'Search name...',
        debounceMs: 0, // No debounce for tests
      },
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Price' />,
  },
]

const columnsWithSelectFilter: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    meta: {
      filterConfig: {
        title: 'Filter by status',
        variant: 'select',
        placeholder: 'Select status...',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Pending', value: 'pending' },
        ],
      },
    },
  },
]

const columnsWithMultiSelectFilter: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
    meta: {
      filterConfig: {
        title: 'Filter by category',
        variant: 'multi-select',
        placeholder: 'Select categories...',
        options: [
          { label: 'Electronics', value: 'Electronics' },
          { label: 'Furniture', value: 'Furniture' },
        ],
      },
    },
  },
]

const columnsWithNumberRangeFilter: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Price' />,
    meta: {
      filterConfig: {
        title: 'Filter by price',
        variant: 'number-range',
      },
    },
    filterFn: (row, columnId, filterValue) => {
      const [min, max] = filterValue as [number?, number?]
      const value = row.getValue<number>(columnId)
      if (min !== undefined && value < min) return false
      if (max !== undefined && value > max) return false
      return true
    },
  },
]

// Helper to open filter popover for a column
async function openFilterPopover(
  user: ReturnType<typeof userEvent.setup>,
  columnTitle: string,
) {
  const header = screen.getByText(columnTitle).closest('th') as HTMLElement

  await user.click(
    within(header).getByRole('button', {
      name: defaultDataTableLocale.columnHeader.filterMenuLabel,
    }),
  )
}

describe('DataTable Text Filter Integration', () => {
  it('filters data by text input', async () => {
    const { user } = render(
      <DataTable columns={columnsWithTextFilter} data={testProducts} />,
    )

    // All products should be visible initially
    expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
    expect(screen.getByText('Wireless Mouse')).toBeInTheDocument()
    expect(screen.getByText('Office Chair')).toBeInTheDocument()

    // Open filter popover
    await openFilterPopover(user, 'Name')

    // Find and type in the filter input
    const filterInput = screen.getByPlaceholderText('Search name...')
    await user.type(filterInput, 'Laptop')

    // Should only show matching product
    await waitFor(() => {
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
      expect(screen.queryByText('Wireless Mouse')).not.toBeInTheDocument()
      expect(screen.queryByText('Office Chair')).not.toBeInTheDocument()
    })
  })

  it('shows all results when filter is cleared', async () => {
    const { user } = render(
      <DataTable columns={columnsWithTextFilter} data={testProducts} />,
    )

    await openFilterPopover(user, 'Name')

    const filterInput = screen.getByPlaceholderText('Search name...')
    await user.type(filterInput, 'Laptop')

    await waitFor(() => {
      expect(screen.queryByText('Wireless Mouse')).not.toBeInTheDocument()
    })

    // Clear the filter
    await user.clear(filterInput)

    await waitFor(() => {
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
      expect(screen.getByText('Wireless Mouse')).toBeInTheDocument()
      expect(screen.getByText('Office Chair')).toBeInTheDocument()
    })
  })

  it('performs case-insensitive filtering by default', async () => {
    const { user } = render(
      <DataTable columns={columnsWithTextFilter} data={testProducts} />,
    )

    await openFilterPopover(user, 'Name')

    const filterInput = screen.getByPlaceholderText('Search name...')
    await user.type(filterInput, 'laptop')

    await waitFor(() => {
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
    })
  })

  it('shows empty state when no results match filter', async () => {
    const { user } = render(
      <DataTable columns={columnsWithTextFilter} data={testProducts} />,
    )

    await openFilterPopover(user, 'Name')

    const filterInput = screen.getByPlaceholderText('Search name...')
    await user.type(filterInput, 'NonexistentProduct')

    expect(screen.getByText(defaultDataTableLocale.body.noResults)).toBeInTheDocument()
  })
})

describe('DataTable Text Filter with Debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces filter input', async () => {
    const columnsWithDebounce: ColumnDef<Product>[] = [
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
        meta: {
          filterConfig: {
            variant: 'text',
            placeholder: 'Search...',
            debounceMs: 300,
          },
        },
      },
    ]

    const { user } = render(
      <DataTable columns={columnsWithDebounce} data={testProducts} />,
      { userOptions: { advanceTimers: vi.advanceTimersByTime } },
    )

    await openFilterPopover(user, 'Name')

    const popover = screen.getByRole('dialog')

    const filterInput = within(popover).getByPlaceholderText('Search...')
    await user.type(filterInput, 'Lap')

    // Data should not be filtered yet (debounce hasn't completed)
    expect(screen.getByText('Wireless Mouse')).toBeInTheDocument()

    // Advance timers past debounce
    await act(async () => {
      vi.advanceTimersByTime(350)
    })

    await waitFor(() => {
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
      expect(screen.queryByText('Wireless Mouse')).not.toBeInTheDocument()
    })
  })
})

describe('DataTable Select Filter Integration', () => {
  it('filters data by selected option', async () => {
    const { user } = render(
      <DataTable columns={columnsWithSelectFilter} data={testProducts} />,
    )

    // All products visible initially
    expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
    expect(screen.getByText('Office Chair')).toBeInTheDocument()
    expect(screen.getByText('Standing Desk')).toBeInTheDocument()

    await openFilterPopover(user, 'Status')

    const popover = screen.getByRole('dialog')

    // Click the select trigger
    const selectTrigger = within(popover).getByRole('combobox')

    await user.click(selectTrigger)

    const activeOption = screen.getByRole('option', { name: 'Active' })
    await user.click(activeOption)

    await waitFor(() => {
      // Active products should be visible
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
      expect(screen.getByText('Wireless Mouse')).toBeInTheDocument()
      expect(screen.getByText('Monitor 27"')).toBeInTheDocument()
      // Inactive and pending should be hidden
      expect(screen.queryByText('Office Chair')).not.toBeInTheDocument()
      expect(screen.queryByText('Standing Desk')).not.toBeInTheDocument()
    })
  })

  it('filters to show only inactive items', async () => {
    const { user } = render(
      <DataTable columns={columnsWithSelectFilter} data={testProducts} />,
    )

    await openFilterPopover(user, 'Status')

    const popover = screen.getByRole('dialog')

    const selectTrigger = within(popover).getByRole('combobox')
    await user.click(selectTrigger)

    const inactiveOption = screen.getByRole('option', { name: 'Inactive' })
    await user.click(inactiveOption)

    await waitFor(() => {
      expect(screen.getByText('Office Chair')).toBeInTheDocument()
      expect(screen.queryByText('Laptop Pro')).not.toBeInTheDocument()
    })
  })
})

describe('DataTable Multi-Select Filter Integration', () => {
  it('filters data by multiple selected options', async () => {
    const { user } = render(
      <DataTable columns={columnsWithMultiSelectFilter} data={testProducts} />,
    )

    await openFilterPopover(user, 'Category')

    const popover = screen.getByRole('dialog')

    // Click the multi-select combobox
    const combobox = within(popover).getByRole('combobox')
    await user.click(combobox)

    // Select 'Electronics'
    const electronicsOption = screen.getByRole('option', { name: 'Electronics' })
    await user.click(electronicsOption)

    await waitFor(() => {
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
      expect(screen.getByText('Wireless Mouse')).toBeInTheDocument()
      expect(screen.getByText('Monitor 27"')).toBeInTheDocument()
      expect(screen.queryByText('Office Chair')).not.toBeInTheDocument()
      expect(screen.queryByText('Standing Desk')).not.toBeInTheDocument()
    })
  })

  it('allows selecting multiple categories', async () => {
    const { user } = render(
      <DataTable columns={columnsWithMultiSelectFilter} data={testProducts} />,
    )

    await openFilterPopover(user, 'Category')

    const popover = screen.getByRole('dialog')

    const combobox = within(popover).getByRole('combobox')
    await user.click(combobox)

    // Select both categories
    const electronicsOption = screen.getByRole('option', { name: 'Electronics' })
    await user.click(electronicsOption)

    const furnitureOption = screen.getByRole('option', { name: 'Furniture' })
    await user.click(furnitureOption)

    await waitFor(() => {
      // All products should be visible when both categories selected
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
      expect(screen.getByText('Office Chair')).toBeInTheDocument()
      expect(screen.getByText('Standing Desk')).toBeInTheDocument()
    })
  })

  it('deselects option when clicked again', async () => {
    const { user } = render(
      <DataTable columns={columnsWithMultiSelectFilter} data={testProducts} />,
    )

    await openFilterPopover(user, 'Category')

    const popover = screen.getByRole('dialog')

    const combobox = within(popover).getByRole('combobox')
    await user.click(combobox)

    // Select Electronics
    const electronicsOption = screen.getByRole('option', { name: 'Electronics' })
    await user.click(electronicsOption)

    await waitFor(() => {
      expect(screen.queryByText('Office Chair')).not.toBeInTheDocument()
    })

    const electronicsOption2 = screen.getByRole('option', { name: 'Electronics' })
    await user.click(electronicsOption2)

    await waitFor(() => {
      // All should be visible again
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
      expect(screen.getByText('Office Chair')).toBeInTheDocument()
    })
  })
})

describe('DataTable Number Range Filter Integration', () => {
  it('filters by minimum value', async () => {
    const { user } = render(
      <DataTable columns={columnsWithNumberRangeFilter} data={testProducts} />,
    )

    await openFilterPopover(user, 'Price')

    // Find min input
    const minInput = screen.getByPlaceholderText(
      defaultDataTableLocale.filters.numberRange.min,
    )
    await user.type(minInput, '500')

    await waitFor(() => {
      // Only products with price >= 500
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument() // 1299
      expect(screen.getByText('Standing Desk')).toBeInTheDocument() // 599
      expect(screen.queryByText('Wireless Mouse')).not.toBeInTheDocument() // 49
      expect(screen.queryByText('Office Chair')).not.toBeInTheDocument() // 299
      expect(screen.queryByText('Monitor 27"')).not.toBeInTheDocument() // 449
    })
  })

  it('filters by maximum value', async () => {
    const { user } = render(
      <DataTable columns={columnsWithNumberRangeFilter} data={testProducts} />,
    )

    await openFilterPopover(user, 'Price')

    const maxInput = screen.getByPlaceholderText(
      defaultDataTableLocale.filters.numberRange.max,
    )
    await user.type(maxInput, '100')

    await waitFor(() => {
      // Only products with price <= 100
      expect(screen.getByText('Wireless Mouse')).toBeInTheDocument() // 49
      expect(screen.queryByText('Laptop Pro')).not.toBeInTheDocument() // 1299
      expect(screen.queryByText('Office Chair')).not.toBeInTheDocument() // 299
    })
  })

  it('filters by price range (min and max)', async () => {
    const { user } = render(
      <DataTable columns={columnsWithNumberRangeFilter} data={testProducts} />,
    )

    await openFilterPopover(user, 'Price')

    const minInput = screen.getByPlaceholderText(
      defaultDataTableLocale.filters.numberRange.min,
    )
    const maxInput = screen.getByPlaceholderText(
      defaultDataTableLocale.filters.numberRange.max,
    )

    await user.type(minInput, '200')
    await user.type(maxInput, '500')

    await waitFor(() => {
      // Products between 200 and 500
      expect(screen.getByText('Office Chair')).toBeInTheDocument() // 299
      expect(screen.getByText('Monitor 27"')).toBeInTheDocument() // 449
      expect(screen.queryByText('Wireless Mouse')).not.toBeInTheDocument() // 49
      expect(screen.queryByText('Laptop Pro')).not.toBeInTheDocument() // 1299
      expect(screen.queryByText('Standing Desk')).not.toBeInTheDocument() // 599
    })
  })
})

describe('DataTable Filter Clear Button', () => {
  it('clears active filter when clear button is clicked', async () => {
    const { user } = render(
      <DataTable columns={columnsWithTextFilter} data={testProducts} />,
    )

    await openFilterPopover(user, 'Name')

    const filterInput = screen.getByPlaceholderText('Search name...')
    await user.type(filterInput, 'Laptop')

    await waitFor(() => {
      expect(screen.queryByText('Wireless Mouse')).not.toBeInTheDocument()
    })

    // Click clear filter button
    const clearButton = screen.getByRole('button', {
      name: defaultDataTableLocale.columnHeader.clearFilter,
    })
    await user.click(clearButton)

    await waitFor(() => {
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument()
      expect(screen.getByText('Wireless Mouse')).toBeInTheDocument()
      expect(screen.getByText('Office Chair')).toBeInTheDocument()
    })
  })
})

describe('DataTable Multiple Filters Combined', () => {
  const columnsWithMultipleFilters: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
      meta: {
        filterConfig: {
          variant: 'text',
          placeholder: 'Search name...',
          debounceMs: 0,
        },
      },
    },
    {
      accessorKey: 'category',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
      meta: {
        filterConfig: {
          variant: 'multi-select',
          placeholder: 'Select category...',
          options: [
            { label: 'Electronics', value: 'Electronics' },
            { label: 'Furniture', value: 'Furniture' },
          ],
        },
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Price' />,
    },
  ]

  it('combines multiple active filters', async () => {
    const { user } = render(
      <DataTable columns={columnsWithMultipleFilters} data={testProducts} />,
    )

    // First filter by category
    await openFilterPopover(user, 'Category')
    const popover = screen.getByRole('dialog')
    const combobox = within(popover).getByRole('combobox')
    await user.click(combobox)
    const electronicsOption = screen.getByRole('option', { name: 'Electronics' })
    await user.click(electronicsOption)

    await waitFor(() => {
      expect(screen.queryByText('Office Chair')).not.toBeInTheDocument()
    })

    // Close category popover by clicking outside or pressing escape
    await user.keyboard('{Escape}')

    // Now also filter by name
    await openFilterPopover(user, 'Name')
    const nameInput = screen.getByPlaceholderText('Search name...')
    await user.type(nameInput, 'Monitor')

    await waitFor(() => {
      // Should only show Monitor (Electronics + contains "Monitor")
      expect(screen.getByText('Monitor 27"')).toBeInTheDocument()
      expect(screen.queryByText('Laptop Pro')).not.toBeInTheDocument()
      expect(screen.queryByText('Wireless Mouse')).not.toBeInTheDocument()
    })
  })
})
