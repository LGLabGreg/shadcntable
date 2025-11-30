'use client'

import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

interface NavigationSectionItem {
  title: string
  items: NavigationItem[]
}

interface NavigationItem {
  title: string
  href: string
  target?: string
}

const navigation: NavigationSectionItem[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Installation', href: '/docs/getting-started/installation' },
      { title: 'Quick Start', href: '/docs/getting-started/quick-start' },
    ],
  },
  {
    title: 'Components',
    items: [{ title: 'DataTable', href: '/docs/components/data-table' }],
  },
  {
    title: 'Help',
    items: [
      {
        title: 'Report issues',
        href: 'https://github.com/LGLabGreg/shadcntable/issues',
        target: '_blank',
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar className='top-(--header-height) h-[calc(100svh-var(--header-height))]! border-r'>
      <SidebarContent className='bg-background p-2'>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={
                        item.href === '/docs'
                          ? pathname === item.href
                          : pathname.startsWith(item.href)
                      }
                      asChild
                    >
                      <Link href={item.href} target={item.target}>
                        <span>{item.title}</span>
                        {item.target === '_blank' && <ExternalLink />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
