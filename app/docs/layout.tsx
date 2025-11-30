import { type ReactNode } from 'react'

import { AppSidebar } from '@/components/app-sidebar'
import { Navbar } from '@/components/navbar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex flex-col min-h-svh'>
      <Navbar className='border-b' />
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset>
          <main className='container mx-auto px-5 py-10 min-w-0'>
            <SidebarTrigger className='mb-4 md:hidden' />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
