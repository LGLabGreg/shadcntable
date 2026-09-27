'use client'

import type { RowData, Table } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'

import type { DataTableFeatures } from './lib/features'
import { useDataTableLocale } from './lib/locale'
import type { DataTableColumnDef, DataTableRow } from './lib/types'

export const SELECTION_COLUMN_ID = 'select'

function SelectAllCheckbox<TData extends RowData>({
  table,
}: {
  table: Table<DataTableFeatures, TData>
}) {
  'use no memo'
  const locale = useDataTableLocale()
  const allSelected = table.getIsAllPageRowsSelected()
  const someSelected = table.getIsSomePageRowsSelected()

  return (
    <Checkbox
      checked={allSelected || (someSelected && 'indeterminate')}
      onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
      aria-label={locale.selection.selectAll}
    />
  )
}

function SelectRowCheckbox<TData extends RowData>({ row }: { row: DataTableRow<TData> }) {
  'use no memo'
  const locale = useDataTableLocale()

  return (
    <Checkbox
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onCheckedChange={(checked) => row.toggleSelected(checked === true)}
      aria-label={locale.selection.selectRow}
    />
  )
}

/**
 * A checkbox column for row selection. Put it first in your column list.
 * Which rows can be selected is controlled by the `enableRowSelection` option.
 */
export function createSelectionColumn<
  TData extends RowData,
>(): DataTableColumnDef<TData> {
  return {
    id: SELECTION_COLUMN_ID,
    header: ({ table }) => <SelectAllCheckbox table={table} />,
    cell: ({ row }) => <SelectRowCheckbox row={row} />,
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
    enableColumnFilter: false,
  }
}
