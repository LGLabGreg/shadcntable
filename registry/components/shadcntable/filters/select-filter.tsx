'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { FilterComponentProps, FilterOption, SelectFilterValue } from '../lib/types'

interface SelectFilterProps extends FilterComponentProps<SelectFilterValue> {
  options: FilterOption[]
  placeholder?: string
}

export function SelectFilter({
  value,
  onChange,
  options,
  placeholder,
}: SelectFilterProps) {
  return (
    <Select
      value={value === undefined ? '' : String(value)}
      onValueChange={(next) =>
        onChange(options.find((option) => String(option.value) === next)?.value)
      }
    >
      <SelectTrigger size='sm' className='w-full'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.icon && <option.icon className='text-muted-foreground' />}
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
