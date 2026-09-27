'use client'

import { useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'

import type { FilterComponentProps, TextFilterValue } from '../lib/types'

interface TextFilterProps extends FilterComponentProps<TextFilterValue> {
  placeholder?: string
  debounceMs?: number
}

export function TextFilter({
  value,
  onChange,
  placeholder,
  debounceMs = 300,
}: TextFilterProps) {
  const [draft, setDraft] = useState(value ?? '')
  const [committed, setCommitted] = useState(value)

  // Reset the draft when the value changes from outside, e.g. "Clear filter".
  if (value !== committed) {
    setCommitted(value)
    setDraft(value ?? '')
  }
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timeout.current), [])

  return (
    <Input
      value={draft}
      placeholder={placeholder}
      onChange={(event) => {
        const next = event.target.value
        setDraft(next)
        clearTimeout(timeout.current)
        timeout.current = setTimeout(() => onChange(next || undefined), debounceMs)
      }}
      className='h-8'
    />
  )
}
