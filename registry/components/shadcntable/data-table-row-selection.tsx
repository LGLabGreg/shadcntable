import { type ColumnDef, type Row, type Table } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'

import { useDataTableLocale } from './contexts/data-table-locale-context'

export interface DataTableRowSelectionConfig<TData> {
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  onRowSelectionChange?: (selectedRows: TData[]) => void
}

function RowSelectionHeader<TData>({ table }: { table: Table<TData> }) {
  'use no memo'
  const locale = useDataTableLocale()

  return (
    <div className='flex items-center justify-center px-2'>
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={locale.rowSelection.selectAll}
      />
    </div>
  )
}

function RowSelectionCell<TData>({ row }: { row: Row<TData> }) {
  'use no memo'
  const locale = useDataTableLocale()

  return (
    <div className='flex items-center justify-center px-2'>
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={locale.rowSelection.selectRow}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

export function createRowSelectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    header: ({ table }) => <RowSelectionHeader table={table} />,
    cell: ({ row }) => <RowSelectionCell row={row} />,
  }
}
