'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { type Table } from '@tanstack/react-table'
import { Settings2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

import { useDataTableLocale } from './contexts/data-table-locale-context'

interface DataTableViewOptionsProps<TData> {
  isLoading?: boolean
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  isLoading,
  table,
}: DataTableViewOptionsProps<TData>) {
  'use no memo'
  const locale = useDataTableLocale()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isLoading} asChild>
        <Button variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex'>
          <Settings2 />
          {locale.viewOptions.view}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[150px]'>
        <DropdownMenuLabel>{locale.viewOptions.toggleColumns}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) => typeof column.accessorFn !== 'undefined' && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
