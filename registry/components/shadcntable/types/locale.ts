export interface DataTableLocale {
  body: {
    noResults: string
  }
  pagination: {
    rowsSelected: string
    rowsPerPage: string
    page: string
    of: string
    goToFirstPage: string
    goToPreviousPage: string
    goToNextPage: string
    goToLastPage: string
  }
  toolbar: {
    searchPlaceholder: string
  }
  viewOptions: {
    view: string
    toggleColumns: string
  }
  rowSelection: {
    selectAll: string
    selectRow: string
  }
  columnHeader: {
    sortAscending: string
    sortDescending: string
    clearSorting: string
    hideColumn: string
    clearFilter: string
  }
  filters: {
    multiSelect: {
      search: string
      noResults: string
    }
    numberRange: {
      min: string
      max: string
    }
  }
}
