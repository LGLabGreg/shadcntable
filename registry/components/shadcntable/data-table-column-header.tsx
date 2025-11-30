import { type Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff, ListFilter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { cn } from '@/lib/utils'

import { useDataTableLocale } from './contexts/data-table-locale-context'
import { DataTableColumnFilter } from './data-table-column-filter'

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  'use no memo'
  const filterConfig = column.columnDef.meta?.filterConfig
  const hasActiveFilter = column.getFilterValue() !== undefined
  const locale = useDataTableLocale()

  if (!column.getCanSort() && !filterConfig) {
    return <div>{title}</div>
  }

  const isSorted = column.getIsSorted()
  const isSortedDesc = isSorted === 'desc'
  const isSortedAsc = isSorted === 'asc'

  return (
    <div className='flex items-center space-x-2 justify-between'>
      <span>{title}</span>
      <div className='flex items-center space-x-0.1'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon-sm'
              className='data-[state=open]:bg-accent'
            >
              {isSortedDesc ? (
                <ArrowDown />
              ) : isSortedAsc ? (
                <ArrowUp />
              ) : (
                <ChevronsUpDown />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            {!isSortedAsc && (
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUp />
                {locale.columnHeader.sortAscending}
              </DropdownMenuItem>
            )}
            {!isSortedDesc && (
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDown />
                {locale.columnHeader.sortDescending}
              </DropdownMenuItem>
            )}
            {isSorted && (
              <DropdownMenuItem onClick={() => column.clearSorting()}>
                <ChevronsUpDown />
                {locale.columnHeader.clearSorting}
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff />
              {locale.columnHeader.hideColumn}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter popover */}
        {filterConfig && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='ghost'
                size='icon-sm'
                className={cn(hasActiveFilter && 'bg-accent text-accent-foreground')}
              >
                <ListFilter />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80' align='start'>
              <div className='space-y-4'>
                {(filterConfig.title || filterConfig.description) && (
                  <div className='space-y-2'>
                    {filterConfig.title && (
                      <h4 className='font-medium leading-none'>{filterConfig.title}</h4>
                    )}
                    {filterConfig.description && (
                      <p className='text-sm text-muted-foreground'>
                        {filterConfig.description}
                      </p>
                    )}
                  </div>
                )}
                <DataTableColumnFilter column={column} />
                {hasActiveFilter && (
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full'
                    onClick={() => column.setFilterValue(undefined)}
                  >
                    {locale.columnHeader.clearFilter}
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}
