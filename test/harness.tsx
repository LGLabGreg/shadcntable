import type { RowData } from '@tanstack/react-table'

import {
  DataTable,
  type DataTableProps,
} from '@/registry/components/shadcntable/data-table'
import { DataTablePagination } from '@/registry/components/shadcntable/data-table-pagination'
import { DataTableToolbar } from '@/registry/components/shadcntable/data-table-toolbar'
import {
  DataTableLocaleProvider,
  type DataTableLocaleOverrides,
} from '@/registry/components/shadcntable/lib/locale'
import {
  type UseDataTableOptions,
  useDataTable,
} from '@/registry/components/shadcntable/use-data-table'

export type TestTableProps<TData extends RowData> = UseDataTableOptions<TData> & {
  tableProps?: Omit<DataTableProps<TData>, 'table'>
  locale?: DataTableLocaleOverrides
}

/** The toolbar, table and pagination composed the way the docs recommend. */
export function TestTable<TData extends RowData>({
  tableProps,
  locale = {},
  ...options
}: TestTableProps<TData>) {
  const table = useDataTable(options)

  return (
    <DataTableLocaleProvider locale={locale}>
      <DataTableToolbar table={table} />
      <DataTable table={table} {...tableProps} />
      <DataTablePagination table={table} />
    </DataTableLocaleProvider>
  )
}

export type Product = {
  id: string
  name: string
  category: string
  status: 'active' | 'inactive' | 'pending'
  price: number
  createdAt: Date
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro',
    category: 'Electronics',
    status: 'active',
    price: 1299,
    createdAt: new Date(2024, 0, 15),
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    category: 'Electronics',
    status: 'active',
    price: 49,
    createdAt: new Date(2024, 1, 20, 18, 30),
  },
  {
    id: '3',
    name: 'Office Chair',
    category: 'Furniture',
    status: 'inactive',
    price: 299,
    createdAt: new Date(2024, 2, 10),
  },
  {
    id: '4',
    name: 'Standing Desk',
    category: 'Furniture',
    status: 'pending',
    price: 599,
    createdAt: new Date(2024, 3, 5),
  },
  {
    id: '5',
    name: 'Monitor',
    category: 'Electronics',
    status: 'active',
    price: 449,
    createdAt: new Date(2024, 4, 1),
  },
]

/** Text of the `name` column for each rendered body row, in order. */
export function getRenderedNames(): string[] {
  const body = document.querySelector('tbody')
  if (!body) return []
  return Array.from(body.querySelectorAll('tr'))
    .map((row) => row.querySelector('[data-testid="name"]')?.textContent)
    .filter((name): name is string => name != null)
}
