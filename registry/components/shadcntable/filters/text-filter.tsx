// components/filters/text-filter.tsx
import { useEffect, useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'

import { type FilterComponentProps } from '../types/filters'
import { debounce } from '../utils/debounce'

export function TextFilter({ value, onChange, config }: FilterComponentProps) {
  const [localValue, setLocalValue] = useState(value ?? '')

  const debouncedOnChange = useMemo(
    () => debounce((val: string) => onChange(val), config.debounceMs),
    [onChange, config.debounceMs],
  )

  useEffect(() => {
    return () => debouncedOnChange.cancel()
  }, [debouncedOnChange])

  return (
    <Input
      placeholder={config.placeholder}
      value={localValue?.toString() ?? ''}
      onChange={(e) => {
        setLocalValue(e.target.value)
        debouncedOnChange(e.target.value)
      }}
      className='h-8 w-full'
    />
  )
}
