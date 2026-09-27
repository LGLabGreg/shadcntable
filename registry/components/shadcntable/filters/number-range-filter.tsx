'use client'

import { Input } from '@/components/ui/input'

import { useDataTableLocale } from '../lib/locale'
import type { FilterComponentProps, NumberRangeFilterValue } from '../lib/types'

export function NumberRangeFilter({
  value = [],
  onChange,
}: FilterComponentProps<NumberRangeFilterValue>) {
  const locale = useDataTableLocale()
  const [min, max] = value

  const update = (next: NumberRangeFilterValue) =>
    onChange(next[0] === undefined && next[1] === undefined ? undefined : next)

  const parse = (input: string) => (input === '' ? undefined : Number(input))

  return (
    <div className='flex items-center gap-2'>
      <Input
        type='number'
        inputMode='decimal'
        placeholder={locale.filters.min}
        aria-label={locale.filters.min}
        value={min ?? ''}
        onChange={(event) => update([parse(event.target.value), max])}
        className='h-8'
      />
      <span className='text-muted-foreground'>–</span>
      <Input
        type='number'
        inputMode='decimal'
        placeholder={locale.filters.max}
        aria-label={locale.filters.max}
        value={max ?? ''}
        onChange={(event) => update([min, parse(event.target.value)])}
        className='h-8'
      />
    </div>
  )
}
