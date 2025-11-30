import { Lightbulb } from 'lucide-react'

import { cn } from '@/lib/utils'

interface TipProps {
  children: React.ReactNode
  className?: string
}

export function Tip({ children, className }: TipProps) {
  return (
    <div
      className={cn(
        'my-6 rounded-lg border border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20 shadow-sm',
        className,
      )}
    >
      <div className='flex gap-3 p-4'>
        <div className='shrink-0 pt-0.5'>
          <Lightbulb
            className='h-5 w-5 text-green-600 dark:text-green-500'
            aria-hidden='true'
          />
        </div>
        <div className='flex-1 min-w-0 [&>p]:m-0 [&>p:not(:last-child)]:mb-2 text-sm leading-relaxed text-green-900 dark:text-green-100 prose prose-sm dark:prose-invert [&_strong]:font-semibold [&_strong]:text-green-950 dark:[&_strong]:text-green-50'>
          {children}
        </div>
      </div>
    </div>
  )
}
