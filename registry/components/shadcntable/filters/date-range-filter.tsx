'use client'

import { Calendar } from '@/components/ui/calendar'

import type { DateRangeFilterValue, FilterComponentProps } from '../lib/types'

export function DateRangeFilter({
  value,
  onChange,
}: FilterComponentProps<DateRangeFilterValue>) {
  return (
    <Calendar
      mode='range'
      selected={value?.from ? { from: value.from, to: value.to } : undefined}
      onSelect={(range) => onChange(range?.from || range?.to ? range : undefined)}
      defaultMonth={value?.from}
      captionLayout='dropdown'
      className='mx-auto p-0'
    />
  )
}
