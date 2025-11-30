import { type DataTableLocale } from '../types/locale'

export const defaultDataTableLocale: DataTableLocale = {
  body: {
    noResults: 'No results',
  },
  pagination: {
    rowsSelected: 'row(s) selected.',
    rowsPerPage: 'Rows per page',
    page: 'Page',
    of: 'of',
    goToFirstPage: 'Go to first page',
    goToPreviousPage: 'Go to previous page',
    goToNextPage: 'Go to next page',
    goToLastPage: 'Go to last page',
  },
  toolbar: {
    searchPlaceholder: 'Search...',
  },
  viewOptions: {
    view: 'View',
    toggleColumns: 'Toggle columns',
  },
  rowSelection: {
    selectAll: 'Select all',
    selectRow: 'Select row',
  },
  columnHeader: {
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
    clearSorting: 'Clear sorting',
    hideColumn: 'Hide column',
    clearFilter: 'Clear filter',
  },
  filters: {
    multiSelect: {
      search: 'Search...',
      noResults: 'No results found.',
    },
    numberRange: {
      min: 'Min',
      max: 'Max',
    },
  },
}
