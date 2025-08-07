import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SearchProvider } from '@/context/SearchContext'
import { ThemeProvider } from '@/context/ThemeContext'

export const metadata: Metadata = {
  title: 'Incognitor',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans text-gray-900 dark:text-gray-100 dark:bg-gray-900 bg-white transition-colors duration-300">
      <ThemeProvider>
          <SearchProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </SearchProvider>
      </ThemeProvider>
      </body>
    </html>
  )
}
