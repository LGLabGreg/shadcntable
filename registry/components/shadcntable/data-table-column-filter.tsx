import { type Column } from '@tanstack/react-table'

import { DateRangeFilter } from './filters/date-range-filter'
import { MultiSelectFilter } from './filters/multi-select-filter'
import { NumberRangeFilter } from './filters/number-range-filter'
import { SelectFilter } from './filters/select-filter'
import { TextFilter } from './filters/text-filter'
import type { FilterComponentProps, FilterValue } from './types/filters'

interface DataTableColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>
}

export function DataTableColumnFilter<TData, TValue>({
  column,
}: DataTableColumnFilterProps<TData, TValue>) {
  'use no memo'
  const filterConfig = column.columnDef.meta?.filterConfig

  if (!filterConfig) return null

  const filterValue = column.getFilterValue() as FilterValue
  const setFilterValue = (value: FilterValue) => column.setFilterValue(value)
  const clearFilter = () => column.setFilterValue(undefined)

  const commonProps: FilterComponentProps = {
    config: filterConfig,
    value: filterValue,
    onChange: setFilterValue,
    onClear: clearFilter,
  }

  switch (filterConfig.variant) {
    case 'text':
      return <TextFilter {...commonProps} />

    case 'select':
      return <SelectFilter {...commonProps} />

    case 'multi-select':
      return <MultiSelectFilter {...commonProps} />

    case 'date-range':
      return <DateRangeFilter {...commonProps} />

    case 'number-range':
      return <NumberRangeFilter {...commonProps} />

    case 'custom':
      const CustomComponent = filterConfig.component
      return CustomComponent ? <CustomComponent {...commonProps} /> : null

    default:
      return null
  }
}
