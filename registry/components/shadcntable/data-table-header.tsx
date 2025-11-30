import { type Table, flexRender } from '@tanstack/react-table'

import { TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface DataTableHeaderProps<TData> {
  table: Table<TData>
}
export function DataTableHeader<TData>({ table }: DataTableHeaderProps<TData>) {
  'use no memo'
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  )
}
