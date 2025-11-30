import { Hero } from '@/components/hero'
import { Navbar } from '@/components/navbar'
import { TableDemo } from '@/components/table-demo'

export default function Home() {
  return (
    <div className='container mx-auto px-5 flex flex-col min-h-svh pb-16'>
      <Navbar />
      <main className='flex-1'>
        <Hero />
        <TableDemo />
      </main>
    </div>
  )
}
