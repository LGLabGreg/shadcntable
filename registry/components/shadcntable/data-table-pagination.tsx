'use client'

import type { RowData } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import type { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { cn } from '@/lib/utils'

import { SELECTION_COLUMN_ID } from './data-table-selection-column'
import { useDataTableLocale } from './lib/locale'
import type { DataTableInstance } from './lib/types'

interface DataTablePaginationProps<TData extends RowData> extends ComponentProps<'div'> {
  table: DataTableInstance<TData>
  pageSizeOptions?: number[]
  /**
   * Shows how many rows are selected. Defaults to `true` when the table has a
   * selection column.
   */
  showSelectedCount?: boolean
}

export function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showSelectedCount = table
    .getAllLeafColumns()
    .some((column) => column.id === SELECTION_COLUMN_ID),
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  'use no memo'
  const locale = useDataTableLocale()
  const { pageIndex, pageSize } = table.state.pagination
  const pageCount = Math.max(table.getPageCount(), 1)

  return (
    <div
      className={cn('flex flex-wrap items-center justify-between gap-4 px-2', className)}
      {...props}
    >
      <div className='flex-1 text-sm text-muted-foreground'>
        {showSelectedCount &&
          locale.pagination.rowsSelected(
            table.getFilteredSelectedRowModel().rows.length,
            table.getFilteredRowModel().rows.length,
          )}
      </div>
      <div className='flex flex-wrap items-center gap-4 lg:gap-8'>
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium'>{locale.pagination.rowsPerPage}</p>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger
              size='sm'
              className='w-[72px]'
              aria-label={locale.pagination.rowsPerPage}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='text-sm font-medium'>
          {locale.pagination.pageOf(pageIndex + 1, pageCount)}
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={locale.pagination.goToFirstPage}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={locale.pagination.goToPreviousPage}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label={locale.pagination.goToNextPage}
          >
            <ChevronRight />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() => table.lastPage()}
            disabled={!table.getCanLastPage()}
            aria-label={locale.pagination.goToLastPage}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
