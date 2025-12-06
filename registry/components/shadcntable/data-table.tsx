'use client'

import { type ColumnDef, type FilterFnOption, type Row } from '@tanstack/react-table'
import { isAfter, isBefore, isDate, isSameDay } from 'date-fns'
import { useMemo } from 'react'

import { Table } from '@/components/ui/table'

import { defaultDataTableLocale } from './config/locale'
import { DataTableLocaleProvider } from './contexts/data-table-locale-context'
import { DataTableBody, type DataTableBodyProps } from './data-table-body'
import { DataTableHeader } from './data-table-header'
import {
  DataTablePagination,
  type DataTablePaginationConfig,
} from './data-table-pagination'
import {
  type DataTableRowSelectionConfig,
  createRowSelectionColumn,
} from './data-table-row-selection'
import { DataTableToolbar, type DataTableToolbarConfig } from './data-table-toolbar'
import { useShadcnTable } from './hooks/use-shadcn-table'
import { type FilterValue } from './types/filters'
import { type DataTableLocale } from './types/locale'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  emptyState?: DataTableBodyProps<TData>['emptyState']
  isLoading?: boolean
  locale?: Partial<DataTableLocale>
  onRowClick?: (row: TData) => void
  pagination?: DataTablePaginationConfig
  rowSelection?: DataTableRowSelectionConfig<TData>
  toolbar?: DataTableToolbarConfig
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyState,
  isLoading,
  locale,
  onRowClick,
  pagination,
  rowSelection,
  toolbar,
}: DataTableProps<TData, TValue>) {
  'use no memo'
  const mergedLocale = useMemo(() => {
    return {
      body: { ...defaultDataTableLocale.body, ...locale?.body },
      pagination: { ...defaultDataTableLocale.pagination, ...locale?.pagination },
      toolbar: { ...defaultDataTableLocale.toolbar, ...locale?.toolbar },
      viewOptions: { ...defaultDataTableLocale.viewOptions, ...locale?.viewOptions },
      rowSelection: { ...defaultDataTableLocale.rowSelection, ...locale?.rowSelection },
      columnHeader: { ...defaultDataTableLocale.columnHeader, ...locale?.columnHeader },
      filters: {
        multiSelect: {
          ...defaultDataTableLocale.filters.multiSelect,
          ...locale?.filters?.multiSelect,
        },
        numberRange: {
          ...defaultDataTableLocale.filters.numberRange,
          ...locale?.filters?.numberRange,
        },
      },
    }
  }, [locale])

  const prepareColumns = useMemo(() => {
    const tmpColumns = [...columns]
    if (rowSelection) {
      tmpColumns.unshift(createRowSelectionColumn<TData>())
    }
    return tmpColumns.map((column) => {
      if (column.meta?.filterConfig?.variant === 'multi-select') {
        return {
          ...column,
          filterFn: 'arrIncludesSome' as FilterFnOption<TData>,
        }
      } else if (column.meta?.filterConfig?.variant === 'select') {
        return {
          ...column,
          filterFn: 'equals' as FilterFnOption<TData>,
        }
      } else if (column.meta?.filterConfig?.variant === 'date-range') {
        return {
          ...column,
          filterFn: (row: Row<TData>, columnId: string, filterValue: FilterValue) => {
            const date = row.getValue<Date>(columnId)
            if (!isDate(date)) return false
            if (!filterValue) return true
            if (
              typeof filterValue === 'object' &&
              'from' in filterValue &&
              'to' in filterValue &&
              filterValue.from &&
              filterValue.to
            ) {
              return (
                (isSameDay(date, filterValue.from) || isAfter(date, filterValue.from)) &&
                (isSameDay(date, filterValue.to) || isBefore(date, filterValue.to))
              )
            }
            return true
          },
        }
      }
      return column
    })
  }, [columns, rowSelection])

  const table = useShadcnTable({
    data,
    columns: prepareColumns,
    pageSize: pagination?.pageSize,
    rowSelectionConfig: rowSelection,
  })

  return (
    <DataTableLocaleProvider locale={mergedLocale}>
      <div className='space-y-4'>
        <DataTableToolbar config={toolbar} isLoading={isLoading} table={table} />
        <div className='overflow-hidden rounded-md border'>
          <Table>
            <DataTableHeader table={table} />
            <DataTableBody
              emptyState={emptyState}
              isLoading={isLoading}
              onRowClick={onRowClick}
              table={table}
            />
          </Table>
        </div>
        <DataTablePagination
          config={pagination}
          rowSelection={rowSelection}
          table={table}
        />
      </div>
    </DataTableLocaleProvider>
  )
}
