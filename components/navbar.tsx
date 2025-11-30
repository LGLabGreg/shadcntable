'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa6'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { cn } from '@/lib/utils'

import { Logo } from './logo'
import { ModeToggle } from './mode-toggle'

interface MenuItem {
  title: string
  url: string
  description?: string
  icon?: React.ReactNode
  items?: MenuItem[]
}

const menu: MenuItem[] = [
  {
    title: 'Documentation',
    url: '/docs/getting-started/installation',
  },
]

export const Navbar = ({ className }: { className?: string }) => {
  return (
    <header className={cn('bg-background sticky top-0 z-50 w-full', className)}>
      <div className='px-5 py-4'>
        {/* Desktop Menu */}
        <nav className='hidden items-center justify-between lg:flex'>
          <div className='flex items-center gap-6'>
            <Logo />
            <div className='flex items-center'>
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => (
                    <MenuItem key={item.title} item={item} />
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='icon' asChild>
              <Link href='#' target='_blank'>
                <FaGithub className='h-4 w-4' />
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className='block lg:hidden'>
          <div className='flex items-center justify-between'>
            <Logo />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline' size='icon'>
                  <Menu className='size-4' />
                </Button>
              </SheetTrigger>
              <SheetContent className='overflow-y-auto'>
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className='flex flex-col gap-6 p-4'>
                  <Accordion
                    type='single'
                    collapsible
                    className='flex w-full flex-col gap-4'
                  >
                    {menu.map((item) => (
                      <MobileMenuItem key={item.title} item={item} />
                    ))}
                  </Accordion>

                  <div className='flex gap-2'>
                    <Button variant='ghost' size='icon' asChild>
                      <Link href='#' target='_blank'>
                        <FaGithub className='h-4 w-4' />
                      </Link>
                    </Button>
                    <ModeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

const MenuItem = ({ item }: { item: MenuItem }) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className='bg-popover text-popover-foreground'>
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className='w-80'>
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className='bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors'
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const MobileMenuItem = ({ item }: { item: MenuItem }) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className='border-b-0'>
        <AccordionTrigger className='text-md py-0 font-semibold hover:no-underline'>
          {item.title}
        </AccordionTrigger>
        <AccordionContent className='mt-2'>
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <a key={item.title} href={item.url} className='text-md font-semibold'>
      {item.title}
    </a>
  )
}

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className='hover:bg-muted hover:text-accent-foreground flex min-w-80 select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors'
      href={item.url}
    >
      <div className='text-foreground'>{item.icon}</div>
      <div>
        <div className='text-sm font-semibold'>{item.title}</div>
        {item.description && (
          <p className='text-muted-foreground text-sm leading-snug'>{item.description}</p>
        )}
      </div>
    </a>
  )
}
