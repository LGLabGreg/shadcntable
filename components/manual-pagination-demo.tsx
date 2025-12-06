'use client'

import { DataTable } from '@/registry/components/shadcntable/data-table'
import { DataTableColumnHeader } from '@/registry/components/shadcntable/data-table-column-header'
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'

type Person = {
  firstName: string
  lastName: string
  email: string
}

type UsersApiResponse = {
  rows: Person[]
  rowCount: number
}

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='First Name' />,
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Last Name' />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
  },
]

export function ManualPaginationDemo() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ManualPaginationTable />
    </QueryClientProvider>
  )
}

function ManualPaginationTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, isFetching } = useQuery<UsersApiResponse>({
    queryKey: ['users', pagination],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(pagination.pageIndex + 1),
        pageSize: String(pagination.pageSize),
      })

      const res = await fetch(`/api/users?${params.toString()}`)
      if (!res.ok) {
        throw new Error('Failed to fetch users')
      }

      return await res.json()
    },
    placeholderData: keepPreviousData,
  })

  const rows = data?.rows ?? []
  const rowCount = data?.rowCount ?? 0

  return (
    <DataTable
      columns={columns}
      data={rows}
      isLoading={isLoading}
      isFetching={isFetching}
      pagination={{
        manual: true,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        rowCount,
        onPaginationChange: setPagination,
        pageSizeOptions: [5, 10, 25, 50],
      }}
      toolbar={{
        search: true,
        viewOptions: true,
      }}
    />
  )
}
