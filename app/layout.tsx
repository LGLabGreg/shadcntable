import type { Metadata } from 'next'
import { Geist_Mono, Inter } from 'next/font/google'
import Script from 'next/script'

import { BetaBanner } from '@/components/beta-banner'
import { ThemeProvider } from '@/components/theme-provider'

import { IS_PRODUCTION, siteConfig } from '@/lib/config'

import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400'],
})

export const metadata: Metadata = {
  title: siteConfig.name,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  description: siteConfig.description,
  keywords: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Components',
    'shadcn',
    'tanstack table',
    'data table',
    'shadcntable',
  ],
  creator: 'LGLab',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL!,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.variable} ${fontMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <BetaBanner />
          {children}
        </ThemeProvider>
        {IS_PRODUCTION && (
          <Script
            src='https://cloud.umami.is/script.js'
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
      </body>
    </html>
  )
}
