import { useShadcnTable } from '@/registry/components/shadcntable/hooks/use-shadcn-table'
import { type ColumnDef } from '@tanstack/react-table'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

type TestItem = {
  id: string
  name: string
  value: number
}

const testData: TestItem[] = [
  { id: '1', name: 'Item 1', value: 100 },
  { id: '2', name: 'Item 2', value: 200 },
  { id: '3', name: 'Item 3', value: 300 },
  { id: '4', name: 'Item 4', value: 400 },
  { id: '5', name: 'Item 5', value: 500 },
]

const columns: ColumnDef<TestItem>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'value', header: 'Value' },
]

describe('useShadcnTable', () => {
  it('initializes with provided data', () => {
    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
      }),
    )

    expect(result.current.getRowModel().rows).toHaveLength(5)
  })

  it('uses default page size of 10', () => {
    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
      }),
    )

    expect(result.current.getState().pagination.pageSize).toBe(10)
  })

  it('uses custom page size when provided', () => {
    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
        pageSize: 2,
      }),
    )

    expect(result.current.getState().pagination.pageSize).toBe(2)
    expect(result.current.getRowModel().rows).toHaveLength(2)
  })

  it('handles pagination changes', () => {
    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
        pageSize: 2,
      }),
    )

    expect(result.current.getState().pagination.pageIndex).toBe(0)

    act(() => {
      result.current.nextPage()
    })

    expect(result.current.getState().pagination.pageIndex).toBe(1)
  })

  it('handles sorting changes', () => {
    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
      }),
    )

    expect(result.current.getState().sorting).toHaveLength(0)

    act(() => {
      result.current.getColumn('value')?.toggleSorting(false)
    })

    expect(result.current.getState().sorting).toEqual([{ id: 'value', desc: false }])
  })

  it('handles descending sort', () => {
    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
      }),
    )

    act(() => {
      result.current.getColumn('value')?.toggleSorting(true)
    })

    expect(result.current.getState().sorting).toEqual([{ id: 'value', desc: true }])

    // First row should be the highest value
    const firstRow = result.current.getRowModel().rows[0]
    expect(firstRow.original.value).toBe(500)
  })

  it('handles column filters', () => {
    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
      }),
    )

    expect(result.current.getState().columnFilters).toHaveLength(0)

    act(() => {
      result.current.getColumn('name')?.setFilterValue('Item 1')
    })

    expect(result.current.getState().columnFilters).toEqual([
      { id: 'name', value: 'Item 1' },
    ])

    // Should filter to only matching rows
    expect(result.current.getFilteredRowModel().rows).toHaveLength(1)
  })

  it('handles global filter', () => {
    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
      }),
    )

    act(() => {
      result.current.setGlobalFilter('Item 3')
    })

    expect(result.current.getState().globalFilter).toBe('Item 3')
  })

  it('handles column visibility', () => {
    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
      }),
    )

    act(() => {
      result.current.getColumn('value')?.toggleVisibility(false)
    })

    expect(result.current.getState().columnVisibility).toEqual({
      value: false,
    })
    expect(result.current.getColumn('value')?.getIsVisible()).toBe(false)
  })

  it('handles row selection', () => {
    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
        rowSelectionConfig: {
          onRowSelectionChange: vi.fn(),
        },
      }),
    )

    expect(result.current.getState().rowSelection).toEqual({})

    act(() => {
      result.current.getRow('0').toggleSelected(true)
    })

    expect(result.current.getState().rowSelection).toEqual({ '0': true })
  })

  it('calls onRowSelectionChange callback', () => {
    const handleSelectionChange = vi.fn()

    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
        rowSelectionConfig: {
          onRowSelectionChange: handleSelectionChange,
        },
      }),
    )

    act(() => {
      result.current.getRow('0').toggleSelected(true)
    })

    expect(handleSelectionChange).toHaveBeenCalledWith([testData[0]])
  })

  it('selects multiple rows', () => {
    const handleSelectionChange = vi.fn()

    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
        rowSelectionConfig: {
          onRowSelectionChange: handleSelectionChange,
        },
      }),
    )

    act(() => {
      result.current.getRow('0').toggleSelected(true)
      result.current.getRow('1').toggleSelected(true)
    })

    expect(result.current.getSelectedRowModel().rows).toHaveLength(2)
    expect(handleSelectionChange).toHaveBeenLastCalledWith([testData[0], testData[1]])
  })

  it('toggles all rows selection', () => {
    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
        rowSelectionConfig: {
          onRowSelectionChange: vi.fn(),
        },
      }),
    )

    act(() => {
      result.current.toggleAllRowsSelected(true)
    })

    expect(result.current.getSelectedRowModel().rows).toHaveLength(5)

    act(() => {
      result.current.toggleAllRowsSelected(false)
    })

    expect(result.current.getSelectedRowModel().rows).toHaveLength(0)
  })

  it('returns correct page count', () => {
    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
        pageSize: 2,
      }),
    )

    expect(result.current.getPageCount()).toBe(3)
  })

  it('correctly identifies first and last page', () => {
    const { result } = renderHook(() =>
      useShadcnTable({
        data: testData,
        columns,
        pageSize: 2,
      }),
    )

    expect(result.current.getCanPreviousPage()).toBe(false)
    expect(result.current.getCanNextPage()).toBe(true)

    act(() => {
      result.current.lastPage()
    })

    expect(result.current.getCanPreviousPage()).toBe(true)
    expect(result.current.getCanNextPage()).toBe(false)
  })
})
