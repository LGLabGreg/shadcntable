'use client'

import type { RowData } from '@tanstack/react-table'
import { X } from 'lucide-react'
import type { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'

import { DataTableViewOptions } from './data-table-view-options'
import { useDataTableLocale } from './lib/locale'
import type { DataTableInstance } from './lib/types'

interface DataTableToolbarProps<TData extends RowData> extends ComponentProps<'div'> {
  table: DataTableInstance<TData>
  /** Shows the global search input. Defaults to `true`. */
  showSearch?: boolean
  /** Shows the column visibility menu. Defaults to `true`. */
  showViewOptions?: boolean
}

/**
 * Global search, a reset button for active filters, and the view options menu.
 * `children` render between the search input and the view options, which is
 * the place for extra filters or actions.
 */
export function DataTableToolbar<TData extends RowData>({
  table,
  showSearch = true,
  showViewOptions = true,
  className,
  children,
  ...props
}: DataTableToolbarProps<TData>) {
  'use no memo'
  const locale = useDataTableLocale()
  const globalFilter = (table.state.globalFilter as string | undefined) ?? ''
  const isFiltered = globalFilter !== '' || table.state.columnFilters.length > 0

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)} {...props}>
      {showSearch && (
        <Input
          type='search'
          value={globalFilter}
          placeholder={locale.toolbar.searchPlaceholder}
          aria-label={locale.toolbar.searchPlaceholder}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className='h-8 w-40 lg:w-64'
        />
      )}
      {children}
      {isFiltered && (
        <Button
          variant='ghost'
          size='sm'
          className='h-8'
          onClick={() => {
            table.resetGlobalFilter(true)
            table.resetColumnFilters(true)
          }}
        >
          {locale.toolbar.reset}
          <X />
        </Button>
      )}
      {showViewOptions && (
        <div className='ml-auto'>
          <DataTableViewOptions table={table} />
        </div>
      )}
    </div>
  )
}
