import type {
  CellData,
  Column,
  ColumnDef,
  Header,
  ReactTable,
  Row,
  RowData,
} from '@tanstack/react-table'
import type { ComponentType } from 'react'

import type { DataTableFeatures } from './features'

export type DataTableInstance<TData extends RowData> = ReactTable<
  DataTableFeatures,
  TData
>
export type DataTableColumnDef<
  TData extends RowData,
  TValue extends CellData = unknown,
> = ColumnDef<DataTableFeatures, TData, TValue>
export type DataTableColumn<
  TData extends RowData,
  TValue extends CellData = unknown,
> = Column<DataTableFeatures, TData, TValue>
export type DataTableHeader<
  TData extends RowData,
  TValue extends CellData = unknown,
> = Header<DataTableFeatures, TData, TValue>
export type DataTableRow<TData extends RowData> = Row<DataTableFeatures, TData>

export interface FilterOption {
  label: string
  value: string | number
  icon?: ComponentType<{ className?: string }>
}

export type TextFilterValue = string
export type SelectFilterValue = string | number
export type MultiSelectFilterValue = Array<string | number>
export type DateRangeFilterValue = { from?: Date; to?: Date }
export type NumberRangeFilterValue = [min?: number, max?: number]

export interface FilterComponentProps<TValue> {
  value: TValue | undefined
  onChange: (value: TValue | undefined) => void
}

interface FilterConfigBase {
  /** Heading shown at the top of the filter popover. */
  title?: string
  /** Helper text shown under the title. */
  description?: string
  placeholder?: string
}

export type FilterConfig =
  | (FilterConfigBase & {
      variant: 'text'
      /** Delay before the typed value is applied. Defaults to 300ms. */
      debounceMs?: number
    })
  | (FilterConfigBase & { variant: 'select'; options: FilterOption[] })
  | (FilterConfigBase & { variant: 'multiSelect'; options: FilterOption[] })
  | (FilterConfigBase & { variant: 'dateRange' })
  | (FilterConfigBase & { variant: 'numberRange' })
  | (FilterConfigBase & {
      variant: 'custom'
      component: ComponentType<FilterComponentProps<unknown>>
    })

export type FilterVariant = FilterConfig['variant']

/**
 * Metadata read by the data table components. It is an interface so it can be
 * extended with declaration merging.
 */
export interface DataTableColumnMeta {
  /** Human-readable column name, used by the view options menu. */
  label?: string
  /** Enables the column filter popover in `DataTableColumnHeader`. */
  filter?: FilterConfig
}
