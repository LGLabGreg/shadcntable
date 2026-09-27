'use client'

import type { RowData } from '@tanstack/react-table'

import { DateRangeFilter } from './filters/date-range-filter'
import { MultiSelectFilter } from './filters/multi-select-filter'
import { NumberRangeFilter } from './filters/number-range-filter'
import { SelectFilter } from './filters/select-filter'
import { TextFilter } from './filters/text-filter'
import type { DataTableColumn } from './lib/types'

interface DataTableColumnFilterProps<TData extends RowData, TValue> {
  column: DataTableColumn<TData, TValue>
}

/** Renders the filter input configured in `meta.filter` for a column. */
export function DataTableColumnFilter<TData extends RowData, TValue>({
  column,
}: DataTableColumnFilterProps<TData, TValue>) {
  'use no memo'
  const config = column.columnDef.meta?.filter
  if (!config) return null

  // The value's shape is fixed by the variant, so each input narrows it.
  const value = column.getFilterValue() as never
  const onChange = (next: unknown) => column.setFilterValue(next)
  const props = { value, onChange }

  switch (config.variant) {
    case 'text':
      return (
        <TextFilter
          {...props}
          placeholder={config.placeholder}
          debounceMs={config.debounceMs}
        />
      )
    case 'select':
      return (
        <SelectFilter
          {...props}
          options={config.options}
          placeholder={config.placeholder}
        />
      )
    case 'multiSelect':
      return <MultiSelectFilter {...props} options={config.options} />
    case 'dateRange':
      return <DateRangeFilter {...props} />
    case 'numberRange':
      return <NumberRangeFilter {...props} />
    case 'custom':
      return <config.component {...props} />
    default:
      return null
  }
}
