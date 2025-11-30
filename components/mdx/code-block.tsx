import { codeToHtml } from 'shiki'

import { CopyButton } from './copy-button'

interface CodeBlockProps {
  code: string
  language: string
}

const languageLabels: Record<string, string> = {
  bash: 'bash',
  sh: 'shell',
  shell: 'shell',
  typescript: 'typescript',
  ts: 'typescript',
  javascript: 'javascript',
  js: 'javascript',
  tsx: 'tsx',
  jsx: 'jsx',
  json: 'json',
  css: 'css',
  html: 'html',
  yaml: 'yaml',
  yml: 'yaml',
  markdown: 'markdown',
  md: 'markdown',
  sql: 'sql',
  python: 'python',
  py: 'python',
  go: 'go',
  rust: 'rust',
  java: 'java',
}

export async function CodeBlock({ code, language }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language || 'text',
    theme: 'github-dark-default',
  })

  const label = languageLabels[language] || language

  return (
    <div className='group relative mb-8 rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden'>
      {/* Header with language label and copy button */}
      <div className='flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50'>
        <span className='text-xs font-medium text-zinc-400'>{label}</span>
        <CopyButton text={code} />
      </div>

      {/* Code content */}
      <div
        className='font-mono overflow-x-auto p-4 text-sm [&_pre]:bg-transparent! [&_pre]:p-0! [&_pre]:m-0! [&_code]:bg-transparent!'
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
