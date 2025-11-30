import { Select } from '@/components/ui/select'
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { FilterComponentProps } from '../types/filters'

export function SelectFilter({ value, onChange, config }: FilterComponentProps) {
  return (
    <Select onValueChange={(val) => onChange(val)} value={value?.toString() ?? ''}>
      <SelectTrigger className='h-8 w-full'>
        <SelectValue placeholder={config.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {config.options?.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
