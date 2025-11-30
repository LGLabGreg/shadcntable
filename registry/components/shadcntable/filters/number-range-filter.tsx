import { Input } from '@/components/ui/input'

import { useDataTableLocale } from '../contexts/data-table-locale-context'
import type { FilterComponentProps } from '../types/filters'

export function NumberRangeFilter({ value, onChange }: FilterComponentProps) {
  const [min, max] = (value ?? [undefined, undefined]) as [number?, number?]
  const locale = useDataTableLocale()

  return (
    <div className='flex gap-2'>
      <Input
        type='number'
        placeholder={locale.filters.numberRange.min}
        value={min ?? ''}
        onChange={(e) => {
          const newMin = e.target.value ? Number(e.target.value) : undefined
          onChange([newMin, max])
        }}
      />
      <span className='flex items-center'>-</span>
      <Input
        type='number'
        placeholder={locale.filters.numberRange.max}
        value={max ?? ''}
        onChange={(e) => {
          const newMax = e.target.value ? Number(e.target.value) : undefined
          onChange([min, newMax])
        }}
      />
    </div>
  )
}
