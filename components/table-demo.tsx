'use client'

import { faker } from '@faker-js/faker'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'

import { type Person, makeData } from '@/lib/makeData'

import { DataTable } from '@/registry/components/shadcntable/data-table'
import { DataTableColumnHeader } from '@/registry/components/shadcntable/data-table-column-header'
import { DataTablePagination } from '@/registry/components/shadcntable/data-table-pagination'
import { createSelectionColumn } from '@/registry/components/shadcntable/data-table-selection-column'
import { DataTableToolbar } from '@/registry/components/shadcntable/data-table-toolbar'
import { createDataTableColumnHelper } from '@/registry/components/shadcntable/lib/features'
import { useDataTable } from '@/registry/components/shadcntable/use-data-table'

faker.seed(123)
const data = makeData(100)

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

const columnHelper = createDataTableColumnHelper<Person>()

const columns = columnHelper.columns([
  createSelectionColumn<Person>(),
  columnHelper.accessor('firstName', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    meta: {
      label: 'First name',
      filter: { variant: 'text', placeholder: 'Filter first names...' },
    },
  }),
  columnHelper.accessor('lastName', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    meta: {
      label: 'Last name',
      filter: { variant: 'text', placeholder: 'Filter last names...' },
    },
  }),
  columnHelper.accessor('age', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    filterFn: (row, columnId, adultsOnly: boolean) =>
      !adultsOnly || row.getValue<number>(columnId) >= 18,
    meta: {
      label: 'Age',
      filter: {
        variant: 'custom',
        title: 'Age',
        component: ({ value, onChange }) => (
          <div className='flex items-center gap-2'>
            <Checkbox
              id='adults-only'
              checked={value === true}
              onCheckedChange={(checked) => onChange(checked === true || undefined)}
            />
            <Label htmlFor='adults-only' className='font-normal'>
              Adults only (18+)
            </Label>
          </div>
        ),
      },
    },
  }),
  columnHelper.accessor('dob', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ getValue }) => dateFormat.format(getValue()),
    meta: {
      label: 'Date of birth',
      filter: { variant: 'dateRange', title: 'Date of birth' },
    },
  }),
  columnHelper.accessor('email', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    meta: { label: 'Email', filter: { variant: 'text' } },
  }),
  columnHelper.accessor('progress', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ getValue }) => `${getValue()}%`,
    meta: {
      label: 'Progress',
      filter: { variant: 'numberRange', title: 'Progress (%)' },
    },
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ getValue }) => <span className='capitalize'>{getValue()}</span>,
    meta: {
      label: 'Status',
      filter: {
        variant: 'multiSelect',
        title: 'Status',
        options: [
          { label: 'Relationship', value: 'relationship' },
          { label: 'Complicated', value: 'complicated' },
          { label: 'Single', value: 'single' },
        ],
      },
    },
  }),
  columnHelper.accessor('salary', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ getValue }) => currency.format(getValue()),
    meta: {
      label: 'Salary',
      filter: { variant: 'numberRange', title: 'Salary' },
    },
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon-sm'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => void navigator.clipboard.writeText(row.original.email)}
          >
            Copy email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View person</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
])

export function TableDemo() {
  const table = useDataTable({ columns, data })

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} />
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}
