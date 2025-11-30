'use client'

import Link from 'next/link'

import { cn } from '@/lib/utils'

interface BetaBannerProps {
  className?: string
}

export function BetaBanner({ className }: BetaBannerProps) {
  return (
    <div className={cn('relative bg-primary px-4 py-2.5 text-center text-sm', className)}>
      <p className='text-primary-foreground'>
        <span className='font-medium'>🚧 Beta:</span> shadcntable is under active
        development. APIs may change.{' '}
        <Link
          href='https://github.com/LGLabGreg/shadcntable/issues'
          className='font-medium underline underline-offset-4 hover:no-underline'
          target='_blank'
        >
          Share feedback
        </Link>
      </p>
    </div>
  )
}
