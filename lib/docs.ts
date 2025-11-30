import fs from 'fs'
import GithubSlugger from 'github-slugger'
import matter from 'gray-matter'
import path from 'path'

const contentDirectory = path.join(process.cwd(), 'content/docs')

export type Doc = {
  slug: string
  title: string
  description?: string
  content: string
  toc: {
    level: number
    text: string
    id: string
  }[]
}

export function getAllDocs(): Doc[] {
  const fileNames = getAllFiles(contentDirectory)
  return fileNames.map((fileName) => {
    const relativePath = path.relative(contentDirectory, fileName)
    const slug = relativePath
      .replace(/\.mdx?$/, '')
      .split(path.sep)
      .join('/')
    const fileContents = fs.readFileSync(fileName, 'utf8')
    const { data, content } = matter(fileContents)
    const toc = extractToc(content)

    return {
      slug,
      title: data.title || slug,
      description: data.description,
      content,
      toc,
    }
  })
}

export function getDocBySlug(slug: string[]): Doc | null {
  const realSlug = slug.join('/')
  const fullPath = path.join(contentDirectory, `${realSlug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const toc = extractToc(content)

  return {
    slug: realSlug,
    title: data.title || realSlug,
    description: data.description,
    content,
    toc,
  }
}

function getAllFiles(dir: string): string[] {
  let results: string[] = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath))
    } else {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        results.push(filePath)
      }
    }
  })
  return results
}

function extractToc(content: string) {
  const slugger = new GithubSlugger()
  const headingRegex = /^(#{2,4})\s+(.*)$/gm
  const toc = []
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2]
    const id = slugger.slug(text)
    toc.push({ level, text, id })
  }
  return toc
}
