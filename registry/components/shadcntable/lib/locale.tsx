'use client'

import { type ReactNode, createContext, useContext, useMemo } from 'react'

export interface DataTableLocale {
  body: {
    noResults: string
  }
  toolbar: {
    searchPlaceholder: string
    reset: string
  }
  viewOptions: {
    view: string
    toggleColumns: string
  }
  pagination: {
    rowsSelected: (selected: number, total: number) => string
    rowsPerPage: string
    pageOf: (page: number, pageCount: number) => string
    goToFirstPage: string
    goToPreviousPage: string
    goToNextPage: string
    goToLastPage: string
  }
  selection: {
    selectAll: string
    selectRow: string
  }
  columnHeader: {
    sortAscending: string
    sortDescending: string
    clearSorting: string
    hideColumn: string
    filterColumn: (title: string) => string
    clearFilter: string
  }
  filters: {
    search: string
    noResults: string
    selected: (count: number) => string
    min: string
    max: string
    pickDateRange: string
  }
}

export const defaultDataTableLocale: DataTableLocale = {
  body: {
    noResults: 'No results.',
  },
  toolbar: {
    searchPlaceholder: 'Search...',
    reset: 'Reset',
  },
  viewOptions: {
    view: 'View',
    toggleColumns: 'Toggle columns',
  },
  pagination: {
    rowsSelected: (selected, total) => `${selected} of ${total} row(s) selected.`,
    rowsPerPage: 'Rows per page',
    pageOf: (page, pageCount) => `Page ${page} of ${pageCount}`,
    goToFirstPage: 'Go to first page',
    goToPreviousPage: 'Go to previous page',
    goToNextPage: 'Go to next page',
    goToLastPage: 'Go to last page',
  },
  selection: {
    selectAll: 'Select all',
    selectRow: 'Select row',
  },
  columnHeader: {
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
    clearSorting: 'Clear sorting',
    hideColumn: 'Hide column',
    filterColumn: (title) => `Filter ${title}`,
    clearFilter: 'Clear filter',
  },
  filters: {
    search: 'Search...',
    noResults: 'No results found.',
    selected: (count) => `${count} selected`,
    min: 'Min',
    max: 'Max',
    pickDateRange: 'Pick a date range',
  },
}

export type DataTableLocaleOverrides = {
  [K in keyof DataTableLocale]?: Partial<DataTableLocale[K]>
}

const DataTableLocaleContext = createContext<DataTableLocale>(defaultDataTableLocale)

export function DataTableLocaleProvider({
  locale,
  children,
}: {
  locale: DataTableLocaleOverrides
  children: ReactNode
}) {
  const value = useMemo(() => {
    const merged = { ...defaultDataTableLocale }
    for (const key of Object.keys(locale) as Array<keyof DataTableLocale>) {
      merged[key] = { ...defaultDataTableLocale[key], ...locale[key] } as never
    }
    return merged
  }, [locale])

  return <DataTableLocaleContext value={value}>{children}</DataTableLocaleContext>
}

export function useDataTableLocale(): DataTableLocale {
  return useContext(DataTableLocaleContext)
}
