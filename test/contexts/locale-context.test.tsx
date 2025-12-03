import { defaultDataTableLocale } from '@/registry/components/shadcntable/config/locale'
import { useDataTableLocale } from '@/registry/components/shadcntable/contexts/data-table-locale-context'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('useDataTableLocale', () => {
  it('returns defaultDataTableLocale when used outside of DataTableLocaleProvider', () => {
    // Render the hook without wrapping it in a provider
    const { result } = renderHook(() => useDataTableLocale())

    // Should return the default locale
    expect(result.current).toEqual(defaultDataTableLocale)
  })

  it('returns all default locale sections', () => {
    const { result } = renderHook(() => useDataTableLocale())

    // Verify all expected sections are present
    expect(result.current.body).toBeDefined()
    expect(result.current.pagination).toBeDefined()
    expect(result.current.toolbar).toBeDefined()
    expect(result.current.viewOptions).toBeDefined()
    expect(result.current.rowSelection).toBeDefined()
    expect(result.current.columnHeader).toBeDefined()
    expect(result.current.filters).toBeDefined()
  })

  it('returns correct default body locale', () => {
    const { result } = renderHook(() => useDataTableLocale())

    expect(result.current.body.noResults).toBe(defaultDataTableLocale.body.noResults)
  })

  it('returns correct default pagination locale', () => {
    const { result } = renderHook(() => useDataTableLocale())

    expect(result.current.pagination.rowsPerPage).toBe(
      defaultDataTableLocale.pagination.rowsPerPage,
    )
    expect(result.current.pagination.rowsSelected).toBe(
      defaultDataTableLocale.pagination.rowsSelected,
    )
    expect(result.current.pagination.page).toBe(defaultDataTableLocale.pagination.page)
    expect(result.current.pagination.of).toBe(defaultDataTableLocale.pagination.of)
  })
})
