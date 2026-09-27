'use client'

import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { useDeferredValue, useState } from 'react'

import type { Person } from '@/lib/makeData'

import { DataTable } from '@/registry/components/shadcntable/data-table'
import { DataTableColumnHeader } from '@/registry/components/shadcntable/data-table-column-header'
import { DataTablePagination } from '@/registry/components/shadcntable/data-table-pagination'
import { DataTableToolbar } from '@/registry/components/shadcntable/data-table-toolbar'
import { createDataTableColumnHelper } from '@/registry/components/shadcntable/lib/features'
import { useDataTable } from '@/registry/components/shadcntable/use-data-table'

type UsersResponse = { rows: Person[]; rowCount: number }

const EMPTY_ROWS: Person[] = []

const columnHelper = createDataTableColumnHelper<Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    meta: { label: 'First name' },
  }),
  columnHelper.accessor('lastName', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    meta: { label: 'Last name' },
  }),
  columnHelper.accessor('email', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    meta: { label: 'Email' },
  }),
])

async function fetchUsers(
  pagination: PaginationState,
  sorting: SortingState,
  search: string,
): Promise<UsersResponse> {
  const params = new URLSearchParams({
    page: String(pagination.pageIndex + 1),
    pageSize: String(pagination.pageSize),
  })
  if (search) params.set('search', search)
  if (sorting[0]) {
    params.set('sort', sorting[0].id)
    params.set('desc', String(sorting[0].desc))
  }

  const response = await fetch(`/api/users?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch users')
  return (await response.json()) as UsersResponse
}

export function ServerSideDemo() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ServerSideTable />
    </QueryClientProvider>
  )
}

function ServerSideTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const search = useDeferredValue(globalFilter)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['users', pagination, sorting, search],
    queryFn: () => fetchUsers(pagination, sorting, search),
    placeholderData: keepPreviousData,
  })

  const table = useDataTable({
    columns,
    data: data?.rows ?? EMPTY_ROWS,
    rowCount: data?.rowCount,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    state: { pagination, sorting, globalFilter },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: (updater) => {
      setGlobalFilter(updater)
      setPagination((previous) => ({ ...previous, pageIndex: 0 }))
    },
  })

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} />
      <DataTable table={table} isLoading={isLoading} isFetching={isFetching} />
      <DataTablePagination table={table} />
    </div>
  )
}
