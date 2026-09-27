---
'shadcntable': minor
---

Rebuild on TanStack Table v9 with a composable API.

- `useDataTable` creates the table and accepts every TanStack Table option, so any state can be internal, seeded with `initialState` or controlled. Server-side mode uses `manualPagination`, `manualSorting`, `manualFiltering` and `rowCount`.
- `DataTable`, `DataTableToolbar` and `DataTablePagination` each take the `table` and are composed by you. They replace the all-in-one `DataTable` props.
- Columns are typed with `createDataTableColumnHelper`. `meta.label` names a column, and `meta.filter` (was `meta.filterConfig`) configures its filter. The variants are now `text`, `select`, `multiSelect`, `numberRange`, `dateRange` and `custom`.
- Row selection uses `createSelectionColumn()` instead of the `rowSelection` prop.
- Translations come from `DataTableLocaleProvider`, and strings that include numbers are now functions.
- Fixes: multi-select filters match whole values, and date ranges include the whole end day. Clicks on buttons and checkboxes inside a row no longer trigger `onRowClick`, and clickable rows work with the keyboard.
