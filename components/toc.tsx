'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

interface TocProps {
  items: {
    level: number
    text: string
    id: string
  }[]
}

export function DashboardTableOfContents({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(items?.[0]?.id ?? null)
  const visibleHeadings = useRef<Set<string>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleHeadings.current.add(entry.target.id)
          } else {
            visibleHeadings.current.delete(entry.target.id)
          }
        })

        // Find the first visible heading based on document order
        const sortedItems = items.filter((item) => visibleHeadings.current.has(item.id))

        if (sortedItems.length > 0) {
          setActiveId(sortedItems[0].id)
        } else if (visibleHeadings.current.size === 0) {
          // If no headings are visible, find the one closest to the top
          let closestId = items[0]?.id
          let closestDistance = Infinity

          items.forEach((item) => {
            const element = document.getElementById(item.id)
            if (element) {
              const rect = element.getBoundingClientRect()
              const distance = Math.abs(rect.top)
              // Prefer headings above the viewport
              if (rect.top <= 100 && distance < closestDistance) {
                closestDistance = distance
                closestId = item.id
              }
            }
          })

          if (closestId) {
            setActiveId(closestId)
          }
        }
      },
      {
        rootMargin: '-80px 0% -70% 0%',
        threshold: 0,
      },
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      visibleHeadings.current.clear()
      items.forEach((item) => {
        const element = document.getElementById(item.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [items])

  if (!items?.length) {
    return null
  }

  return (
    <div className='space-y-2'>
      <p className='font-medium text-sm'>On This Page</p>
      <ul className='m-0 list-none'>
        {items.map((item) => (
          <li key={item.id} className='mt-0 pt-2'>
            <Link
              href={`#${item.id}`}
              className={cn(
                'inline-block no-underline transition-colors hover:text-foreground text-sm',
                item.level === 3 ? 'pl-4' : '',
                item.id === activeId
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
