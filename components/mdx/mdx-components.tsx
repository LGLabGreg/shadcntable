import Image from 'next/image'
import { Children, isValidElement } from 'react'

import { CodeBlock } from '@/components/mdx/code-block'
import { PropsTable } from '@/components/mdx/props-table'
import { Tip } from '@/components/mdx/tip'

import { cn } from '@/lib/utils'

// Helper to extract code content and language from pre > code structure
function extractCodeFromChildren(children: React.ReactNode): {
  code: string
  language: string
} | null {
  const childArray = Children.toArray(children)

  // Find a child that looks like a code element (has className with 'language-' or is the code element)
  for (const child of childArray) {
    if (isValidElement(child)) {
      const props = child.props as {
        className?: string
        children?: React.ReactNode
      }

      // Check if this element has a language class (indicating it's a code block)
      const className = props.className || ''
      if (className.includes('language-') || child.type === 'code') {
        const language = className.replace(/.*language-(\w+).*/, '$1') || 'text'
        const code = typeof props.children === 'string' ? props.children.trim() : ''

        if (code) {
          return { code, language }
        }
      }
    }
  }

  return null
}

// Helper to get text content from children for slug generation
function getTextContent(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(getTextContent).join('')
  if (isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode }
    if (props.children) {
      return getTextContent(props.children)
    }
  }
  return ''
}

// Generate a slug from text - simple version without state
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export function createMdxComponents() {
  return {
    h1: ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const text = getTextContent(children)
      const id = generateSlug(text)
      return (
        <h1
          id={id}
          className={cn(
            'scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl mb-4',
            className,
          )}
          {...props}
        >
          {children}
        </h1>
      )
    },
    h2: ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const text = getTextContent(children)
      const id = generateSlug(text)
      return (
        <h2
          id={id}
          className={cn('text-xl font-semibold tracking-tight mt-6 mb-3', className)}
          {...props}
        >
          {children}
        </h2>
      )
    },
    h3: ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const text = getTextContent(children)
      const id = generateSlug(text)
      return (
        <h3
          id={id}
          className={cn('text-lg font-semibold tracking-tight mt-4 mb-2', className)}
          {...props}
        >
          {children}
        </h3>
      )
    },
    p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={cn('text-base leading-7 mb-4', className)} {...props} />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className={cn('list-disc list-inside mb-4 space-y-2', className)} {...props} />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol
        className={cn('list-decimal list-inside mb-4 space-y-2', className)}
        {...props}
      />
    ),
    li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className={cn('text-base leading-7', className)} {...props} />
    ),
    code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <code
        className={cn(
          'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
          className,
        )}
        {...props}
      />
    ),
    pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => {
      const extracted = extractCodeFromChildren(children)

      if (extracted) {
        return <CodeBlock code={extracted.code} language={extracted.language} />
      }

      // Fallback for non-code pre blocks
      return (
        <pre className='overflow-x-auto rounded-lg bg-muted p-4 mb-4'>{children}</pre>
      )
    },
    a: ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        className={cn('text-primary underline underline-offset-4', className)}
        {...props}
      />
    ),
    blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className={cn('border-l-4 border-muted-foreground pl-4 italic mb-4', className)}
        {...props}
      />
    ),
    table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className='my-6 w-full overflow-x-auto'>
        <table className={cn('w-full border-collapse text-sm', className)} {...props} />
      </div>
    ),
    thead: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className={cn('border-b bg-muted/50', className)} {...props} />
    ),
    tbody: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
    ),
    tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className={cn('border-b transition-colors hover:bg-muted/50', className)}
        {...props}
      />
    ),
    th: ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
      <th
        className={cn(
          'h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
          className,
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
      <td
        className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
        {...props}
      />
    ),
    img: ({ src, alt, className }: React.ImgHTMLAttributes<HTMLImageElement>) => {
      // Check if it's a full URL or local path
      if (!src || typeof src !== 'string') {
        return null
      }

      return (
        <div className={cn('my-8', className)}>
          <div className='relative w-full h-64 md:h-96 rounded-lg overflow-hidden'>
            <Image
              src={src}
              alt={alt || ''}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, 768px'
            />
          </div>
        </div>
      )
    },
    Tip: ({ className, ...props }: React.ComponentProps<typeof Tip>) => (
      <Tip className={className} {...props} />
    ),
    PropsTable,
  }
}
