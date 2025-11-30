import { type Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useDataTableLocale } from './contexts/data-table-locale-context'

export interface DataTablePaginationConfig {
  enabled?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
}

interface DataTablePaginationProps<TData> {
  config?: DataTablePaginationConfig
  table: Table<TData>
}

export function DataTablePagination<TData>({
  config,
  table,
}: DataTablePaginationProps<TData>) {
  'use no memo'
  const { enabled = true, pageSizeOptions = [10, 25, 50] } = config ?? {}
  const locale = useDataTableLocale()

  if (!enabled) return null

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='text-muted-foreground flex-1 text-sm'>
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} {locale.pagination.rowsSelected}
      </div>
      <div className='flex items-center space-x-4'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>{locale.pagination.rowsPerPage}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          {locale.pagination.page} {table.getState().pagination.pageIndex + 1}{' '}
          {locale.pagination.of} {table.getPageCount()}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>{locale.pagination.goToFirstPage}</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>{locale.pagination.goToPreviousPage}</span>
            <ChevronLeft />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>{locale.pagination.goToNextPage}</span>
            <ChevronRight />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>{locale.pagination.goToLastPage}</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
