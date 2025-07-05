import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Compare AI Coding Agents Feature by Feature | Agent Comparison Hub',
  description: 'Compare AI coding agents like Cursor, Windsurf, Claude Dev, and more across features like MCP support, context windows, and planning capabilities. Find the perfect AI coding assistant for your needs.',
  keywords: ['AI coding agents', 'code assistant comparison', 'Cursor vs Windsurf', 'Claude Dev', 'MCP support', 'coding AI'],
  authors: [{ name: '4Geeks Academy' }],
  creator: '4Geeks Academy',
  publisher: '4Geeks Academy',
  openGraph: {
    title: 'Compare AI Coding Agents Feature by Feature',
    description: 'The ultimate comparison platform for AI coding agents. Compare features, capabilities, and find the perfect coding assistant.',
    url: 'https://agents.4geeks.com',
    siteName: 'AI Agent Comparison Hub',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Coding Agents Comparison'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare AI Coding Agents Feature by Feature',
    description: 'The ultimate comparison platform for AI coding agents.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-token',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "min-h-screen antialiased")}>
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b border-gray-600 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
            <div className="container flex h-14 items-center">
              <div className="mr-4 hidden md:flex">
                <a className="mr-6 flex items-center space-x-2" href="/">
                  <span className="hidden font-bold sm:inline-block">
                    AI Agent Comparison
                  </span>
                </a>
              </div>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <a href="/agent" className="transition-colors hover:text-white/80 text-white/60">
                  Agents
                </a>
                <a href="/feature" className="transition-colors hover:text-white/80 text-white/60">
                  Features
                </a>
                <a href="/compare" className="transition-colors hover:text-white/80 text-white/60">
                  Compare
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-600 py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <p className="text-center text-sm leading-loose text-gray-400 md:text-left">
                  Built by{" "}
                  <a
                    href="https://4geeks.com"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                    4Geeks LLC
                  </a>
                  . Data sourced from official documentation and community contributions.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 