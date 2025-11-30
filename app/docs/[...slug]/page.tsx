import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

import { createMdxComponents } from '@/components/mdx/mdx-components'
import { DashboardTableOfContents } from '@/components/toc'

import { siteConfig } from '@/lib/config'
import { getAllDocs, getDocBySlug } from '@/lib/docs'

const mdxComponents = createMdxComponents()

export async function generateStaticParams() {
  const docs = getAllDocs()
  return docs.map((doc) => ({
    slug: doc.slug.split('/'),
  }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const doc = getDocBySlug(params.slug)

  if (!doc) {
    return {}
  }

  return {
    title: doc.title,
    description: doc.description,
    alternates: {
      canonical: `/docs/${params.slug.join('/')}`,
    },
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: 'article',
      url: `/docs/${params.slug.join('/')}`,
      images: [
        {
          url: siteConfig.ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: [
        {
          url: siteConfig.ogImage,
        },
      ],
      creator: siteConfig.creator,
    },
  }
}

export default async function DocPage(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const doc = getDocBySlug(params.slug)

  if (!doc) {
    notFound()
  }

  return (
    <div className='flex gap-10 xl:gap-14'>
      <div className='min-w-0 flex-1'>
        <div className='mb-6 space-y-2'>
          <h1 className='scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl'>
            {doc.title}
          </h1>
          {doc.description && (
            <p className='text-lg text-muted-foreground'>{doc.description}</p>
          )}
        </div>
        <MDXRemote source={doc.content} components={mdxComponents} />
      </div>
      <div className='hidden xl:block w-64 shrink-0'>
        <div className='sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8'>
          <DashboardTableOfContents items={doc.toc} />
        </div>
      </div>
    </div>
  )
}
