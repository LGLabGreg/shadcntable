import { debounce } from '@/registry/components/shadcntable/utils/debounce'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should delay function execution', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 300)

    debouncedFn('test')
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledWith('test')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should only execute once for multiple rapid calls', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 300)

    debouncedFn('first')
    debouncedFn('second')
    debouncedFn('third')

    vi.advanceTimersByTime(300)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('third')
  })

  it('should use default wait time of 300ms', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn)

    debouncedFn('test')

    vi.advanceTimersByTime(299)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledWith('test')
  })

  it('should reset timer on subsequent calls', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 300)

    debouncedFn('first')
    vi.advanceTimersByTime(200)

    debouncedFn('second')
    vi.advanceTimersByTime(200)

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith('second')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should allow function to be called again after wait period', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 300)

    debouncedFn('first')
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledWith('first')

    debouncedFn('second')
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledWith('second')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should cancel pending execution', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 300)

    debouncedFn('test')
    debouncedFn.cancel()

    vi.advanceTimersByTime(300)
    expect(fn).not.toHaveBeenCalled()
  })

  it('should handle functions with multiple arguments', () => {
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 300)

    debouncedFn('arg1', 'arg2', 'arg3')
    vi.advanceTimersByTime(300)

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
  })

  it('should preserve this context', () => {
    const obj = {
      value: 42,
      method: vi.fn(function (this: { value: number }) {
        return this.value
      }),
    }

    const debouncedMethod = debounce(obj.method.bind(obj), 300)
    debouncedMethod()

    vi.advanceTimersByTime(300)
    expect(obj.method).toHaveBeenCalled()
  })
})
