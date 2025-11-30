'use client'

import { DataTable } from '@/registry/components/shadcntable/data-table'
import { DataTableColumnHeader } from '@/registry/components/shadcntable/data-table-column-header'
import { faker } from '@faker-js/faker'
import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { type Person, makeData } from '@/lib/makeData'

import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'

faker.seed(123)
const data = makeData(100)

export const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='First Name' />,
    meta: {
      filterConfig: {
        title: 'Filter by first name',
        description: 'Lorem ipsum dolor sit amet consectetur.',
        variant: 'text',
        placeholder: 'Filter by first name...',
        debounceMs: 300,
      },
    },
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Last Name' />,
    meta: {
      filterConfig: {
        title: 'Filter by last name',
        description: 'Lorem ipsum dolor sit amet consectetur.',
        variant: 'text',
        placeholder: 'Filter by last name...',
        debounceMs: 300,
      },
    },
  },
  {
    accessorKey: 'age',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Age' />,
    meta: {
      filterConfig: {
        variant: 'custom',
        title: 'Age Filter',
        component: ({ value, onChange }) => {
          const isChecked = value === true

          return (
            <div className='flex items-center gap-2'>
              <Checkbox
                id='adults-only'
                checked={isChecked}
                onCheckedChange={(checked) => {
                  onChange(checked === true)
                }}
              />
              <Label htmlFor='adults-only' className='text-sm font-normal cursor-pointer'>
                Adults only (18+)
              </Label>
            </div>
          )
        },
      },
    },
    filterFn: (row, columnId, filterValue) => {
      if (filterValue !== true) return true
      const age = row.getValue<number>(columnId)
      return age >= 18
    },
  },
  {
    accessorKey: 'dob',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date of Birth' />
    ),
    cell: ({ row }) => {
      const dob = new Date(row.getValue('dob'))
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }

      return dob.toLocaleDateString('en-US', options)
    },
    meta: {
      filterConfig: {
        title: 'Filter by date of birth',
        description: 'Lorem ipsum dolor sit amet consectetur.',
        variant: 'date-range',
        placeholder: 'Select date range...',
      },
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    meta: {
      filterConfig: {
        title: 'Filter by email',
        description: 'Lorem ipsum dolor sit amet consectetur.',
        variant: 'text',
        placeholder: 'Filter by email...',
        debounceMs: 300,
      },
    },
  },
  {
    accessorKey: 'progress',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Progress' />,
    meta: {
      filterConfig: {
        title: 'Filter by progress',
        description: 'Lorem ipsum dolor sit amet consectetur.',
        variant: 'number-range',
        placeholder: 'Min - Max',
      },
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    meta: {
      filterConfig: {
        title: 'Filter by status',
        description: 'Lorem ipsum dolor sit amet consectetur.',
        variant: 'multi-select',
        placeholder: 'Filter by status...',
        options: [
          { label: 'Relationship', value: 'relationship' },
          { label: 'Complicated', value: 'complicated' },
          { label: 'Single', value: 'single' },
        ],
      },
    },
  },
  {
    accessorKey: 'salary',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Salary' />,
    cell: ({ row }) => {
      const salary = parseFloat(row.getValue('salary'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(salary)

      return formatted
    },
    meta: {
      filterConfig: {
        title: 'Filter by salary',
        description: 'Lorem ipsum dolor sit amet consectetur.',
        variant: 'number-range',
        placeholder: 'Min - Max',
      },
    },
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' />,
    cell: ({ row }) => {
      const person = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(person.email)}>
              Copy email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View person</DropdownMenuItem>
            <DropdownMenuItem>View person details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const TableDemo = () => {
  return (
    <DataTable
      columns={columns}
      data={data}
      rowSelection={{
        onRowSelectionChange: (rowSelection) =>
          console.log('Row selection changed:', rowSelection),
      }}
    />
  )
}
