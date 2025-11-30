import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Mock pointer capture APIs for Radix UI components
HTMLElement.prototype.hasPointerCapture = vi.fn(() => false)
HTMLElement.prototype.setPointerCapture = vi.fn()
HTMLElement.prototype.releasePointerCapture = vi.fn()

// Mock scrollIntoView (also missing in jsdom)
Element.prototype.scrollIntoView = vi.fn()

// Mock ResizeObserver as a proper class
class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

global.ResizeObserver = ResizeObserverMock

beforeAll(() => {
  vi.stubGlobal('jest', {
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
  })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.clearAllMocks()
})
