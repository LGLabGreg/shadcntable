import {
  type RenderOptions,
  type RenderResult,
  render as testingLibraryRender,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type ReactElement } from 'react'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  userOptions?: Parameters<typeof userEvent.setup>[0]
}

interface CustomRenderResult extends RenderResult {
  user: ReturnType<typeof userEvent.setup>
}

export function render(
  ui: ReactElement,
  options?: CustomRenderOptions,
): CustomRenderResult {
  const { userOptions, ...renderOptions } = options ?? {}
  const user = userEvent.setup({
    ...userOptions,
  })

  const renderResult = testingLibraryRender(ui, renderOptions)

  return {
    ...renderResult,
    user,
  }
}

export * from '@testing-library/react'
