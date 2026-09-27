import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { type Product, products } from './harness'

import { createDataTableColumnHelper } from '@/registry/components/shadcntable/lib/features'
import { variantFilterFns } from '@/registry/components/shadcntable/lib/filter-fns'
import { useDataTable } from '@/registry/components/shadcntable/use-data-table'

const columnHelper = createDataTableColumnHelper<Product>()
const customFilterFn = () => true

const columns = columnHelper.columns([
  columnHelper.group({
    id: 'details',
    header: 'Details',
    columns: columnHelper.columns([
      columnHelper.accessor('name', { meta: { filter: { variant: 'text' } } }),
      columnHelper.accessor('status', {
        meta: { filter: { variant: 'multiSelect', options: [] } },
      }),
    ]),
  }),
  columnHelper.accessor('price', {
    filterFn: customFilterFn,
    meta: { filter: { variant: 'numberRange' } },
  }),
  columnHelper.accessor('category', {}),
])

describe('useDataTable', () => {
  it('assigns the variant filter function, including in nested columns', () => {
    const { result } = renderHook(() => useDataTable({ columns, data: products }))
    const table = result.current

    expect(table.getColumn('name')?.getFilterFn()).toBe(variantFilterFns.text)
    expect(table.getColumn('status')?.getFilterFn()).toBe(variantFilterFns.multiSelect)
  })

  it('keeps a filterFn defined on the column', () => {
    const { result } = renderHook(() => useDataTable({ columns, data: products }))
    expect(result.current.getColumn('price')?.getFilterFn()).toBe(customFilterFn)
  })

  it('searches every column with includesString by default', () => {
    const { result } = renderHook(() => useDataTable({ columns, data: products }))
    expect(result.current.options.globalFilterFn).toBe('includesString')
  })

  it('lets options override the defaults', () => {
    const { result } = renderHook(() =>
      useDataTable({ columns, data: products, globalFilterFn: 'equalsString' }),
    )
    expect(result.current.options.globalFilterFn).toBe('equalsString')
  })

  it('keeps resolved columns stable across renders', () => {
    const { result, rerender } = renderHook(() =>
      useDataTable({ columns, data: products }),
    )
    const first = result.current.options.columns
    rerender()
    expect(result.current.options.columns).toBe(first)
  })
})
