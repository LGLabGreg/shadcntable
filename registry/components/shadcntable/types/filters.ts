import { type DateRange } from 'react-day-picker'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    filterConfig?: FilterConfig
    filterFn?: (row: TData, columnId: string, filterValue: FilterValue) => boolean
  }
}

export type FilterVariant =
  | 'text' // Free text input
  | 'select' // Dropdown single select
  | 'multi-select' // Dropdown multi-select
  | 'date-range' // Date range picker
  | 'number-range' // Min/max number inputs
  | 'custom' // Custom filter component

export interface FilterConfig {
  title?: string
  description?: string
  variant: FilterVariant
  placeholder?: string

  // For select/multi-select
  options?: Array<{ label: string; value: string | number }>

  // For custom filters
  component?: React.ComponentType<FilterComponentProps>

  // Behavior
  debounceMs?: number
  caseSensitive?: boolean
}

export type FilterValue =
  | string
  | number
  | (number | string | undefined)[]
  | DateRange
  | boolean
  | undefined

export interface FilterComponentProps {
  config: FilterConfig
  value: FilterValue
  onChange: (value: FilterValue) => void
  onClear: () => void
}

// Active filter representation
export interface ActiveFilter {
  columnId: string
  columnLabel: string
  value: FilterValue
  displayValue: string
}
