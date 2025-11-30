import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import logo from '@/images/logo.svg'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href='/' className={cn('flex items-center gap-1 text-xl font-bold', className)}>
      <Image
        src={logo}
        alt='shadcn/table'
        width={24}
        height={24}
        className='dark:invert'
      />
      shadcn/table
    </Link>
  )
}
