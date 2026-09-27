import {
  type RowData,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/react-table'

import { variantFilterFns } from './filter-fns'
import type { DataTableColumnMeta } from './types'

/**
 * The TanStack Table features every data table is built with. Column
 * definitions and components are typed against this set.
 */
export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { ...filterFns, ...variantFilterFns },
  sortFns,
  columnMeta: metaHelper<DataTableColumnMeta>(),
})

export type DataTableFeatures = typeof dataTableFeatures

/**
 * Column helper bound to the data table features.
 *
 * @example
 * const columnHelper = createDataTableColumnHelper<Person>()
 * const columns = columnHelper.columns([
 *   columnHelper.accessor('name', { header: 'Name' }),
 * ])
 */
export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>()
}
