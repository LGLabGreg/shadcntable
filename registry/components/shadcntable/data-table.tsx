'use client'

import type { RowData } from '@tanstack/react-table'
import { Inbox } from 'lucide-react'
import type { ComponentProps, KeyboardEvent, MouseEvent, ReactNode } from 'react'

import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { cn } from '@/lib/utils'

import { useDataTableLocale } from './lib/locale'
import type { DataTableInstance, DataTableRow } from './lib/types'

// Clicks on these elements inside a row never trigger `onRowClick`.
const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, [role="checkbox"], [role="menuitem"], [role="option"]'

export interface DataTableProps<TData extends RowData> extends ComponentProps<'div'> {
  table: DataTableInstance<TData>
  /** Renders skeleton rows instead of data, for the initial load. */
  isLoading?: boolean
  /** Overlays a spinner on the current rows, for background refetches. */
  isFetching?: boolean
  /** Replaces the default "no results" message. */
  emptyState?: ReactNode
  onRowClick?: (row: DataTableRow<TData>) => void
  skeletonRowCount?: number
}

export function DataTable<TData extends RowData>({
  table,
  isLoading = false,
  isFetching = false,
  emptyState,
  onRowClick,
  skeletonRowCount = 5,
  className,
  ...props
}: DataTableProps<TData>) {
  'use no memo'
  const locale = useDataTableLocale()
  const rows = table.getRowModel().rows
  const columnCount = table.getVisibleLeafColumns().length

  const handleRowClick = (event: MouseEvent<HTMLElement>, row: DataTableRow<TData>) => {
    if ((event.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return
    onRowClick?.(row)
  }

  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    row: DataTableRow<TData>,
  ) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onRowClick?.(row)
    }
  }

  return (
    <div
      className={cn('relative overflow-hidden rounded-md border', className)}
      aria-busy={isLoading || isFetching}
      {...props}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: skeletonRowCount }, (_, rowIndex) => (
              <TableRow key={rowIndex} data-slot='data-table-skeleton-row'>
                {Array.from({ length: columnCount }, (_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className='h-4 w-full' />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                className={cn(onRowClick && 'cursor-pointer')}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={onRowClick ? (event) => handleRowClick(event, row) : undefined}
                onKeyDown={
                  onRowClick ? (event) => handleRowKeyDown(event, row) : undefined
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnCount} className='h-24'>
                {emptyState ?? (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant='icon'>
                        <Inbox />
                      </EmptyMedia>
                      <EmptyTitle>{locale.body.noResults}</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isFetching && !isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-background/50'>
          <Spinner />
        </div>
      )}
    </div>
  )
}
