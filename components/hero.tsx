import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa6'

import { Button } from '@/components/ui/button'

import { Badge } from './ui/badge'

export function Hero() {
  return (
    <section className='flex flex-col items-center gap-8 py-8 text-center md:py-16'>
      <div className='flex flex-col items-center gap-4'>
        <Link
          href='/docs/getting-started/installation'
          className='mx-auto mb-3 inline-flex items-center gap-3 rounded-full border px-2 py-1 text-sm'
        >
          <Badge>beta</Badge>
          Introducing shadcn/table
          <span className='bg-muted flex size-7 items-center justify-center rounded-full'>
            <FaArrowRight />
          </span>
        </Link>
        <h1 className='text-primary leading-tighter text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter max-w-4xl'>
          Beautiful Data Tables Built with Shadcn UI
        </h1>
        <p className='text-foreground max-w-3xl text-base text-balance sm:text-lg'>
          A powerful, accessible, and fully customizable data table component for your
          React application. Open source and ready to drop into your project.
        </p>
      </div>
      <div className='flex gap-4'>
        <Button size='lg' asChild>
          <Link href='/docs/getting-started/installation'>Get Started</Link>
        </Button>
        <Button variant='outline' size='lg' asChild>
          <Link href='/docs/components/data-table'>Components</Link>
        </Button>
      </div>
    </section>
  )
}
