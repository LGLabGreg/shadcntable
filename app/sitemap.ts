import fs from 'fs'
import { type MetadataRoute } from 'next'
import path from 'path'

const BASE_URL = 'https://www.shadcntable.com'

// Get all MDX files recursively from a directory
function getMDXFiles(dir: string): string[] {
  const files: string[] = []

  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)

    if (item.isDirectory()) {
      files.push(...getMDXFiles(fullPath))
    } else if (item.isFile() && item.name.endsWith('.mdx')) {
      files.push(fullPath)
    }
  }

  return files
}

// Convert file path to URL slug
function pathToSlug(filePath: string, contentDir: string): string {
  const relativePath = path.relative(contentDir, filePath)
  const slug = relativePath
    .replace(/\.mdx$/, '')
    .replace(/\\/g, '/') // Handle Windows paths
    .replace(/\/index$/, '') // Remove /index from paths

  return slug || ''
}

export default function sitemap(): MetadataRoute.Sitemap {
  const contentDir = path.join(process.cwd(), 'content/docs')

  // Get all documentation pages
  const mdxFiles = getMDXFiles(contentDir)

  const docPages = mdxFiles.map((filePath) => {
    const slug = pathToSlug(filePath, contentDir)
    const stats = fs.statSync(filePath)

    return {
      url: `${BASE_URL}/docs/${slug}`,
      lastModified: stats.mtime,
      changeFrequency: 'weekly' as const,
      priority: slug === '' || slug === 'introduction' ? 1.0 : 0.8,
    }
  })

  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
  ]

  return [...staticPages, ...docPages]
}
