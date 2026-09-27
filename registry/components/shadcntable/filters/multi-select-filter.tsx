'use client'

import { Check } from 'lucide-react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import { cn } from '@/lib/utils'

import { useDataTableLocale } from '../lib/locale'
import type {
  FilterComponentProps,
  FilterOption,
  MultiSelectFilterValue,
} from '../lib/types'

interface MultiSelectFilterProps extends FilterComponentProps<MultiSelectFilterValue> {
  options: FilterOption[]
}

export function MultiSelectFilter({
  value = [],
  onChange,
  options,
}: MultiSelectFilterProps) {
  const locale = useDataTableLocale()

  const toggle = (optionValue: string | number) => {
    const next = value.includes(optionValue)
      ? value.filter((selected) => selected !== optionValue)
      : [...value, optionValue]
    onChange(next.length > 0 ? next : undefined)
  }

  return (
    <Command className='rounded-md border'>
      <CommandInput placeholder={locale.filters.search} />
      <CommandList>
        <CommandEmpty>{locale.filters.noResults}</CommandEmpty>
        <CommandGroup>
          {options.map((option) => {
            const isSelected = value.includes(option.value)
            return (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => toggle(option.value)}
                aria-selected={isSelected}
              >
                <div
                  className={cn(
                    'flex size-4 items-center justify-center rounded-sm border border-primary',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'opacity-50 [&_svg]:invisible',
                  )}
                >
                  <Check className='size-3 text-primary-foreground' />
                </div>
                {option.icon && <option.icon className='text-muted-foreground' />}
                {option.label}
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
