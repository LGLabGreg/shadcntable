'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant='ghost'
      size='icon-sm'
      onClick={handleCopy}
      className={cn(
        'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 transition-colors',
        className,
      )}
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? (
        <Check className='size-4 text-emerald-400' />
      ) : (
        <Copy className='size-4' />
      )}
    </Button>
  )
}
