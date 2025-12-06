'use client'

import type React from 'react'

import { cn } from '@/lib/utils'

interface ComponentPreviewProps {
  title?: string
  description?: string
  className?: string
  children: React.ReactNode
}

export function ComponentPreview({
  title,
  description,
  className,
  children,
}: ComponentPreviewProps) {
  return (
    <section
      className={cn(
        'my-8 rounded-lg border border-border bg-background/40 shadow-sm',
        className,
      )}
    >
      {(title || description) && (
        <div className='border-b border-border px-4 py-3'>
          {title && <h3 className='text-sm font-semibold'>{title}</h3>}
          {description && (
            <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
          )}
        </div>
      )}
      <div className='p-4'>
        <div className='rounded-md border border-dashed border-border bg-card p-4'>
          {children}
        </div>
      </div>
    </section>
  )
}
