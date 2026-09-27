'use client'

import {
  type ColumnDef,
  type RowData,
  type TableOptions,
  useTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'

import { type DataTableFeatures, dataTableFeatures } from './lib/features'
import type { DataTableInstance } from './lib/types'

export type UseDataTableOptions<TData extends RowData> = Omit<
  TableOptions<DataTableFeatures, TData>,
  'features'
>

type AnyColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>

/**
 * Gives every column with a `meta.filter` variant the matching filter function,
 * unless it already defines its own `filterFn`.
 */
function withVariantFilterFns<TData extends RowData>(
  columns: ReadonlyArray<AnyColumnDef<TData>>,
): Array<AnyColumnDef<TData>> {
  return columns.map((column) => {
    if ('columns' in column && column.columns) {
      return { ...column, columns: withVariantFilterFns(column.columns) }
    }
    const variant = column.meta?.filter?.variant
    if (!variant || variant === 'custom' || column.filterFn) return column
    return { ...column, filterFn: variant }
  })
}

/**
 * Creates a TanStack Table instance with the data table features registered.
 *
 * Accepts every TanStack Table option, so any slice of state can be left to
 * the table, seeded with `initialState`, or controlled with `state` and its
 * matching `on[Slice]Change` callback. Pass `manualPagination`,
 * `manualSorting` or `manualFiltering` with `rowCount` for server-side data.
 *
 * Keep `data` and `columns` referentially stable between renders.
 */
export function useDataTable<TData extends RowData>({
  columns,
  ...options
}: UseDataTableOptions<TData>): DataTableInstance<TData> {
  const resolvedColumns = useMemo(() => withVariantFilterFns(columns), [columns])

  return useTable({
    features: dataTableFeatures,
    globalFilterFn: 'includesString',
    ...options,
    columns: resolvedColumns,
  })
}
