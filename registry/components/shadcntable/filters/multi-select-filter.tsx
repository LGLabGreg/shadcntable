import { Check, ChevronsUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { cn } from '@/lib/utils'

import { useDataTableLocale } from '../contexts/data-table-locale-context'
import type { FilterComponentProps } from '../types/filters'

export function MultiSelectFilter({ value, onChange, config }: FilterComponentProps) {
  const locale = useDataTableLocale()
  const [open, setOpen] = useState(false)

  const options = config.options ?? []
  const currentValue = useMemo(() => (Array.isArray(value) ? value : []), [value])
  const selectedOptions = currentValue.map((v) =>
    options.find((option) => option.value === v),
  )

  const handleSelect = (selectedValue: string) => {
    const newValue = currentValue?.includes(selectedValue)
      ? currentValue.filter((v) => v !== selectedValue)
      : [...currentValue, selectedValue]
    onChange(newValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
        >
          {selectedOptions?.length > 0 ? (
            <div className='flex gap-1'>
              <Badge variant='secondary'>{selectedOptions[0]?.label}</Badge>
              {selectedOptions.slice(1).length > 0 && (
                <Badge variant='secondary'>+{selectedOptions.slice(1).length}</Badge>
              )}
            </div>
          ) : (
            config.placeholder
          )}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder={locale.filters.multiSelect.search} className='h-9' />
          <CommandList>
            <CommandEmpty>{locale.filters.multiSelect.noResults}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value.toString()}
                  onSelect={handleSelect}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      currentValue.includes(option.value.toString())
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
