import { type Table } from '@tanstack/react-table'

import { Input } from '@/components/ui/input'

import { useDataTableLocale } from './contexts/data-table-locale-context'
import { DataTableViewOptions } from './data-table-view-options'

export interface DataTableToolbarConfig {
  search?: boolean
  viewOptions?: boolean
}

interface DataTableToolbarProps<TData> {
  config?: DataTableToolbarConfig
  isLoading?: boolean
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  config,
  isLoading,
  table,
}: DataTableToolbarProps<TData>) {
  'use no memo'
  const locale = useDataTableLocale()
  const { search = true, viewOptions = true } = config ?? {}

  return (
    <div className='flex items-center'>
      {search && (
        <Input
          disabled={isLoading}
          placeholder={locale.toolbar.searchPlaceholder}
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className='max-w-sm'
        />
      )}
      {viewOptions && <DataTableViewOptions isLoading={isLoading} table={table} />}
    </div>
  )
}
