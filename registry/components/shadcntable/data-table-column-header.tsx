'use client'

import type { RowData } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff, ListFilter, X } from 'lucide-react'

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

import { DataTableColumnFilter } from './data-table-column-filter'
import { useDataTableLocale } from './lib/locale'
import type { DataTableColumn } from './lib/types'

interface DataTableColumnHeaderProps<TData extends RowData, TValue> {
  column: DataTableColumn<TData, TValue>
  /** Defaults to `meta.label`, then the column id. */
  title?: string
  className?: string
}

export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title = column.columnDef.meta?.label ?? column.id,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  'use no memo'
  const locale = useDataTableLocale()
  const canSort = column.getCanSort()
  const canHide = column.getCanHide()
  const filter = column.columnDef.meta?.filter
  const canFilter = filter !== undefined && column.getCanFilter()

  if (!canSort && !canHide && !canFilter) {
    return <div className={className}>{title}</div>
  }

  const sorted = column.getIsSorted()
  const SortIcon =
    sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ChevronsUpDown

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {canSort || canHide ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='-ml-3 h-8 data-[state=open]:bg-accent'
            >
              {title}
              {canSort && <SortIcon className='text-muted-foreground' />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            {canSort && (
              <>
                <DropdownMenuItem onSelect={() => column.toggleSorting(false)}>
                  <ArrowUp />
                  {locale.columnHeader.sortAscending}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => column.toggleSorting(true)}>
                  <ArrowDown />
                  {locale.columnHeader.sortDescending}
                </DropdownMenuItem>
                {sorted && (
                  <DropdownMenuItem onSelect={() => column.clearSorting()}>
                    <X />
                    {locale.columnHeader.clearSorting}
                  </DropdownMenuItem>
                )}
              </>
            )}
            {canSort && canHide && <DropdownMenuSeparator />}
            {canHide && (
              <DropdownMenuItem onSelect={() => column.toggleVisibility(false)}>
                <EyeOff />
                {locale.columnHeader.hideColumn}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <span>{title}</span>
      )}

      {canFilter && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              size='icon-sm'
              aria-label={locale.columnHeader.filterColumn(title)}
              data-active={column.getIsFiltered() || undefined}
              className='text-muted-foreground data-active:bg-accent data-active:text-accent-foreground'
            >
              <ListFilter />
            </Button>
          </PopoverTrigger>
          <PopoverContent align='start' className='w-auto min-w-64 space-y-3'>
            {(filter.title || filter.description) && (
              <div className='space-y-1'>
                {filter.title && (
                  <h4 className='font-medium leading-none'>{filter.title}</h4>
                )}
                {filter.description && (
                  <p className='text-sm text-muted-foreground'>{filter.description}</p>
                )}
              </div>
            )}
            <DataTableColumnFilter column={column} />
            {column.getIsFiltered() && (
              <Button
                variant='outline'
                size='sm'
                className='w-full'
                onClick={() => column.setFilterValue(undefined)}
              >
                {locale.columnHeader.clearFilter}
              </Button>
            )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
