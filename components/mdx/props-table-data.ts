import type { PropDefinition } from './props-table'

export const propsTables = {
  useDataTable: [
    {
      name: 'data',
      type: 'TData[]',
      default: 'Required',
      description: 'Rows to display. Keep the reference stable between renders.',
    },
    {
      name: 'columns',
      type: 'DataTableColumnDef<TData>[]',
      default: 'Required',
      description: 'Column definitions, usually built with createDataTableColumnHelper.',
    },
    {
      name: 'initialState',
      type: 'Partial<TableState>',
      description: 'Starting state, e.g. the page size or a default sort.',
    },
    {
      name: 'state',
      type: 'Partial<TableState>',
      description: 'Controlled state slices. Pair each one with its on[Slice]Change.',
    },
    {
      name: 'manualPagination / manualSorting / manualFiltering',
      type: 'boolean',
      default: 'false',
      description: 'Leave that step to your server and render data as given.',
    },
    {
      name: 'rowCount',
      type: 'number',
      description: 'Total rows on the server, used for the page count in manual mode.',
    },
    {
      name: 'enableRowSelection',
      type: 'boolean | (row) => boolean',
      default: 'true',
      description: 'Which rows can be selected.',
    },
    {
      name: 'getRowId',
      type: '(row, index) => string',
      description: 'Stable row ids, so selection survives data changes.',
    },
  ],
  dataTable: [
    {
      name: 'table',
      type: 'DataTableInstance<TData>',
      default: 'Required',
      description: 'The instance returned by useDataTable.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      default: 'false',
      description: 'Shows skeleton rows instead of data.',
    },
    {
      name: 'isFetching',
      type: 'boolean',
      default: 'false',
      description: 'Shows a spinner over the current rows.',
    },
    {
      name: 'emptyState',
      type: 'ReactNode',
      description: 'Replaces the default "No results." message.',
    },
    {
      name: 'onRowClick',
      type: '(row: DataTableRow<TData>) => void',
      description:
        'Makes rows clickable and focusable. Clicks on buttons, links and checkboxes are ignored.',
    },
    {
      name: 'skeletonRowCount',
      type: 'number',
      default: '5',
      description: 'Number of skeleton rows while loading.',
    },
  ],
  toolbar: [
    {
      name: 'table',
      type: 'DataTableInstance<TData>',
      default: 'Required',
      description: 'The instance returned by useDataTable.',
    },
    {
      name: 'showSearch',
      type: 'boolean',
      default: 'true',
      description: 'Shows the global search input.',
    },
    {
      name: 'showViewOptions',
      type: 'boolean',
      default: 'true',
      description: 'Shows the column visibility menu.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Extra filters or actions, placed after the search input.',
    },
  ],
  pagination: [
    {
      name: 'table',
      type: 'DataTableInstance<TData>',
      default: 'Required',
      description: 'The instance returned by useDataTable.',
    },
    {
      name: 'pageSizeOptions',
      type: 'number[]',
      default: '[10, 20, 30, 40, 50]',
      description: 'Choices in the rows-per-page menu.',
    },
    {
      name: 'showSelectedCount',
      type: 'boolean',
      default: 'true with a selection column',
      description: 'Shows how many rows are selected.',
    },
  ],
  columnHeader: [
    {
      name: 'column',
      type: 'DataTableColumn<TData>',
      default: 'Required',
      description: 'The column from the header context.',
    },
    {
      name: 'title',
      type: 'string',
      default: 'meta.label ?? column.id',
      description: 'Text shown in the header.',
    },
  ],
  columnMeta: [
    {
      name: 'label',
      type: 'string',
      description: 'Readable column name for the header and the view options menu.',
    },
    {
      name: 'filter',
      type: 'FilterConfig',
      description: 'Adds a filter popover to the column header.',
    },
  ],
  filterConfig: [
    {
      name: 'variant',
      type: 'FilterVariant',
      default: 'Required',
      description:
        'text, select, multiSelect, numberRange, dateRange or custom. Picks the input and the matching logic.',
    },
    {
      name: 'title',
      type: 'string',
      description: 'Heading at the top of the filter popover.',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text under the title.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder for text and select filters.',
    },
    {
      name: 'options',
      type: 'FilterOption[]',
      description: 'Choices for select and multiSelect: { label, value, icon? }.',
    },
    {
      name: 'debounceMs',
      type: 'number',
      default: '300',
      description: 'Delay before a text filter applies.',
    },
    {
      name: 'component',
      type: 'ComponentType<FilterComponentProps>',
      description: 'The input for the custom variant. Receives value and onChange.',
    },
  ],
} satisfies Record<string, PropDefinition[]>

export type PropsTableId = keyof typeof propsTables
