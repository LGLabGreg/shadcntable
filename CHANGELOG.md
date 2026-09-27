# shadcntable

## 0.4.0

### Minor Changes

- [#47](https://github.com/LGLabGreg/shadcntable/pull/47) [`e8f3328`](https://github.com/LGLabGreg/shadcntable/commit/e8f3328b980a15cda05bc034d10c1af44a569a23) Thanks [@LGLabGreg](https://github.com/LGLabGreg)! - Rebuild on TanStack Table v9 with a composable API.
  
  - `useDataTable` creates the table and accepts every TanStack Table option, so any state can be internal, seeded with `initialState` or controlled. Server-side mode uses `manualPagination`, `manualSorting`, `manualFiltering` and `rowCount`.
  - `DataTable`, `DataTableToolbar` and `DataTablePagination` each take the `table` and are composed by you. They replace the all-in-one `DataTable` props.
  - Columns are typed with `createDataTableColumnHelper`. `meta.label` names a column, and `meta.filter` (was `meta.filterConfig`) configures its filter. The variants are now `text`, `select`, `multiSelect`, `numberRange`, `dateRange` and `custom`.
  - Row selection uses `createSelectionColumn()` instead of the `rowSelection` prop.
  - Translations come from `DataTableLocaleProvider`, and strings that include numbers are now functions.
  - Fixes: multi-select filters match whole values, and date ranges include the whole end day. Clicks on buttons and checkboxes inside a row no longer trigger `onRowClick`, and clickable rows work with the keyboard.

### Patch Changes

- [#40](https://github.com/LGLabGreg/shadcntable/pull/40) [`97c42b8`](https://github.com/LGLabGreg/shadcntable/commit/97c42b8801f2ec27191117805ca60155b880b458) Thanks [@LGLabGreg](https://github.com/LGLabGreg)! - Update dependencies; filters no longer stringify non-primitive values, and the multi-select filter trigger now sets `aria-controls`.

## 0.3.0

### Minor Changes

- [#19](https://github.com/LGLabGreg/shadcntable/pull/19) [`2c50c24`](https://github.com/LGLabGreg/shadcntable/commit/2c50c241c840fee465c38febd62af351a87bcd6a) Thanks [@LGLabGreg](https://github.com/LGLabGreg)! - Add isFetching option

## 0.2.0

### Minor Changes

- [#17](https://github.com/LGLabGreg/shadcntable/pull/17) [`2d80390`](https://github.com/LGLabGreg/shadcntable/commit/2d80390cb6696d8be9bb9af53a849d2485ef9bf3) Thanks [@LGLabGreg](https://github.com/LGLabGreg)! - Feat: manual pagination

## 0.1.5

### Patch Changes

- [#15](https://github.com/LGLabGreg/shadcntable/pull/15) [`4382d52`](https://github.com/LGLabGreg/shadcntable/commit/4382d52971cc87e79dc462069df16f004c4c8133) Thanks [@LGLabGreg](https://github.com/LGLabGreg)! - Fix row selection showing without config

## 0.1.4

### Patch Changes

- [#11](https://github.com/LGLabGreg/shadcntable/pull/11) [`c0af20a`](https://github.com/LGLabGreg/shadcntable/commit/c0af20adad4849e45208708bde43bc5290e7186b) Thanks [@LGLabGreg](https://github.com/LGLabGreg)! - Fix: date range picker filterFn

## 0.1.3

### Patch Changes

- [#6](https://github.com/LGLabGreg/shadcntable/pull/6) [`7f3ae01`](https://github.com/LGLabGreg/shadcntable/commit/7f3ae0118341805f243fbf7bfca8f790f5c91433) Thanks [@LGLabGreg](https://github.com/LGLabGreg)! - fix select filter changing from uncontrolled to controlled

## 0.1.2

### Patch Changes

- [#4](https://github.com/LGLabGreg/shadcntable/pull/4) [`eb31b8b`](https://github.com/LGLabGreg/shadcntable/commit/eb31b8bb18e263f0ee15c8a6cc32ea58ad950364) Thanks [@LGLabGreg](https://github.com/LGLabGreg)! - Add aria-label for column header buttons. Fix select filter filterFn.

## 0.1.1

### Patch Changes

- [`b43f728`](https://github.com/LGLabGreg/shadcntable/commit/b43f728f219cc89fc88ee71ccc68cc232fd3a889) Thanks [@LGLabGreg](https://github.com/LGLabGreg)! - initial files
