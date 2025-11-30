import {
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type TableState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'

import { type DataTablePaginationConfig } from '../data-table-pagination'
import { type DataTableRowSelectionConfig } from '../data-table-row-selection'

interface UseDataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  initialState?: TableState
  pageSize?: DataTablePaginationConfig['pageSize']
  rowSelectionConfig?: DataTableRowSelectionConfig<TData>
}

export function useShadcnTable<TData, TValue>({
  data,
  columns,
  initialState,
  pageSize = 10,
  rowSelectionConfig,
}: UseDataTableProps<TData, TValue>) {
  'use no memo'
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState<string>('')

  /* eslint-disable-next-line react-hooks/incompatible-library */
  const table = useReactTable({
    data,
    columns,
    enableRowSelection: rowSelectionConfig?.enableRowSelection ?? true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  useEffect(() => {
    if (rowSelectionConfig?.onRowSelectionChange) {
      const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original)
      rowSelectionConfig?.onRowSelectionChange?.(selectedRows)
    }
  }, [rowSelection, rowSelectionConfig, table])

  return table
}
