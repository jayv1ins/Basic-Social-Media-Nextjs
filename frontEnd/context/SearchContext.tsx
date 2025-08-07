// context/SearchContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface SearchResult {
  posts: any[]
  blogs: any[]
  events: any[]
}

interface SearchContextType {
  results: SearchResult | null
  setResults: (r: SearchResult | null) => void
  query: string
  setQuery: (q: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [results, setResults] = useState<SearchResult | null>(null)
  const [query, setQuery] = useState('')

  return (
    <SearchContext.Provider value={{ results, setResults, query, setQuery }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) throw new Error('useSearch must be used inside SearchProvider')
  return context
}
