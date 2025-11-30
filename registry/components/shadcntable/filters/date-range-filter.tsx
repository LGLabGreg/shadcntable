import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { type DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { cn } from '@/lib/utils'

import type { FilterComponentProps } from '../types/filters'

export function DateRangeFilter({ value, onChange, config }: FilterComponentProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    value as DateRange | undefined,
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn(
            'h-8 w-full justify-start text-left font-normal',
            !dateRange && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'LLL dd, y')} -{' '}
                {format(dateRange.to, 'LLL dd, y')}
              </>
            ) : (
              format(dateRange.from, 'LLL dd, y')
            )
          ) : (
            <span>{config.placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='range'
          selected={dateRange}
          onSelect={(range) => {
            setDateRange(range)
            onChange(range)
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
