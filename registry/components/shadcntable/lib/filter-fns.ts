import {
  constructFilterFn,
  filterFn_equals,
  filterFn_inNumberRange,
  filterFn_includesString,
} from '@tanstack/react-table'
import { endOfDay, startOfDay } from 'date-fns'

import type { DateRangeFilterValue, MultiSelectFilterValue } from './types'

function toTimestamp(value: unknown): number {
  if (value instanceof Date) return value.getTime()
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value !== '') return new Date(value).getTime()
  return Number.NaN
}

/**
 * Matches rows whose value is one of the selected options. Array cell values
 * (e.g. tags) match when they contain at least one selected option.
 */
const multiSelect = constructFilterFn({
  filter: (dataValue: unknown, filterValue: MultiSelectFilterValue) =>
    Array.isArray(dataValue)
      ? dataValue.some((value) => filterValue.includes(value))
      : filterValue.includes(dataValue as string | number),
  autoRemove: (value: MultiSelectFilterValue | undefined) => !value?.length,
})

/**
 * Matches rows whose date falls inside the selected range. Both ends are
 * inclusive at day granularity, and a missing end leaves that side open.
 */
const dateRange = constructFilterFn({
  filter: (dataValue: number, [from, to]: [number, number]) =>
    !Number.isNaN(dataValue) && dataValue >= from && dataValue <= to,
  resolveFilterValue: (value: DateRangeFilterValue): [number, number] => [
    value.from ? startOfDay(value.from).getTime() : -Infinity,
    value.to ? endOfDay(value.to).getTime() : Infinity,
  ],
  resolveDataValue: toTimestamp,
  autoRemove: (value: DateRangeFilterValue | undefined) => !value?.from && !value?.to,
})

/**
 * Filter functions keyed by filter variant. `useDataTable` assigns the one
 * matching `meta.filter.variant` to any column that has no `filterFn` of its own.
 */
export const variantFilterFns = {
  text: filterFn_includesString,
  select: filterFn_equals,
  multiSelect,
  dateRange,
  numberRange: filterFn_inNumberRange,
}
