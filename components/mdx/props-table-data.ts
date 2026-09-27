import type { PropDefinition } from './props-table'

export const propsTables = {
  dataTable: [
    {
      name: 'columns',
      type: 'ColumnDef<TData, TValue>[]',
      default: 'Required',
      description: "Column definitions using TanStack Table's ColumnDef",
    },
    {
      name: 'data',
      type: 'TData[]',
      default: 'Required',
      description: 'Array of data to display',
    },
    {
      name: 'emptyState',
      type: 'React.ReactNode',
      description: 'Custom empty state when no data',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      default: 'false',
      description: 'Shows loading skeleton when true',
    },
    {
      name: 'isFetching',
      type: 'boolean',
      default: 'false',
      description: 'Shows overlay with spinner over existing rows when fetching data',
    },
    {
      name: 'locale',
      type: 'Partial<DataTableLocale>',
      description: 'Override default text strings for internationalization',
    },
    {
      name: 'onRowClick',
      type: '(row: TData) => void',
      description: 'Callback when a row is clicked',
    },
    {
      name: 'pagination',
      type: 'DataTablePaginationConfig',
      description: 'Pagination configuration',
    },
    {
      name: 'rowSelection',
      type: 'DataTableRowSelectionConfig',
      description: 'Row selection configuration',
    },
    {
      name: 'toolbar',
      type: 'DataTableToolbarConfig',
      description: 'Toolbar configuration',
    },
  ],
  pagination: [
    {
      name: 'enabled',
      type: 'boolean',
      default: 'true',
      description: 'Enable/disable pagination',
    },
    { name: 'pageSize', type: 'number', default: '10', description: 'Initial page size' },
    {
      name: 'pageSizeOptions',
      type: 'number[]',
      default: '[10, 25, 50]',
      description: 'Available page size options',
    },
    {
      name: 'manual',
      type: 'boolean',
      description:
        'Enable manual/server-side pagination. When true, pagination state and data are controlled externally.',
    },
    {
      name: 'pageIndex',
      type: 'number',
      description:
        'Externally controlled current page index (0-based) when using manual pagination.',
    },
    {
      name: 'rowCount',
      type: 'number',
      description:
        'Total number of rows across all pages when using manual pagination. Used with `pageSize` to compute the total page count.',
    },
    {
      name: 'onPaginationChange',
      type: '({ pageIndex: number; pageSize: number }) => void',
      description:
        'Single callback fired whenever pagination state changes (page index or page size) in manual mode.',
    },
  ],
  rowSelection: [
    {
      name: 'enableRowSelection',
      type: '((row: Row<TData>) => boolean)',
      description: 'Enable selection globally or per-row',
    },
    {
      name: 'onRowSelectionChange',
      type: '(selectedRows: TData[]) => void',
      description: 'Callback when selection changes',
    },
  ],
  toolbar: [
    {
      name: 'search',
      type: 'boolean',
      default: 'true',
      description: 'Show global search input',
    },
    {
      name: 'viewOptions',
      type: 'boolean',
      default: 'true',
      description: 'Show column visibility toggle',
    },
  ],
  filterConfig: [
    {
      name: 'variant',
      type: 'FilterVariant',
      default: 'Required',
      description: 'Type of filter (text, select, date-range, etc.)',
    },
    { name: 'title', type: 'string', description: 'Title shown in filter popover' },
    {
      name: 'description',
      type: 'string',
      description: 'Description shown in filter popover',
    },
    { name: 'placeholder', type: 'string', description: 'Placeholder text' },
    {
      name: 'options',
      type: 'Array<{label, value}>',
      description: 'Options for select filters',
    },
    { name: 'debounceMs', type: 'number', description: 'Debounce delay in milliseconds' },
    {
      name: 'caseSensitive',
      type: 'boolean',
      default: 'false',
      description: 'Case-sensitive text matching',
    },
    {
      name: 'component',
      type: 'React.ComponentType',
      description: 'Custom filter component',
    },
  ],
  filterVariants: [
    { name: 'text', type: 'string', description: 'Free text input' },
    { name: 'select', type: 'string', description: 'Single select dropdown' },
    { name: 'multi-select', type: 'string', description: 'Multi-select dropdown' },
    { name: 'date-range', type: 'string', description: 'Date range picker' },
    { name: 'number-range', type: 'string', description: 'Min/max number inputs' },
    { name: 'custom', type: 'string', description: 'Custom filter component' },
  ],
} satisfies Record<string, PropDefinition[]>

export type PropsTableId = keyof typeof propsTables
