'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import axios from 'axios'
import toast from 'react-hot-toast'
import ThemeToggle from '@/components/ThemeToggle'



import { useSearch } from '@/context/SearchContext'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

interface User {
  id: number
  email: string
  username: string
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const { setResults, setQuery, query, results } = useSearch()
  const [suggestions, setSuggestions] = useState<any[]>([])
  const searchRef = useRef<HTMLDivElement | null>(null)
  const debouncedQuery = useDebounce(query, 2000)


  
useEffect(() => {
  const controller = new AbortController()
  setHasMounted(true)

  const fetchUser = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      setUser(null)
      return
    }

    try {
      const response = await axios.get(`${apiUrl}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })

      const userData: User = response.data
      setUser(userData)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message

        toast.error(`Error fetching user: ${message}`)
        console.error('Fetch user error:', {
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        toast.error('Unexpected error occurred while fetching user.')
        console.error('Unexpected error:', error)
      }

      setUser(null)
    }
  }

  fetchUser()

  return () => {
    controller.abort()
  }
}, [])


 

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
        setSuggestions([])
      }
  }

  document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  
  const handleLogout = async () => {
    const token = localStorage.getItem('token')
  
    if (!token) {
      setUser(null)
      router.push('/login')
      return
    }
  
    try {
      await axios.post(`${apiUrl}/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message
  
        toast.error(`Error logging out: ${message}`)
        console.error('Logout error:', {
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        toast.error('Unexpected error occurred during logout.')
        console.error('Unexpected logout error:', error)
      }
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      router.push('/login')
    }
  }
  

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

useEffect(() => {
  const fetchSuggestions = async () => {
    if (!debouncedQuery.trim()) {
      setSuggestions([])
      return
    }

    try {
      const res = await axios.get(`${apiUrl}/content/search`, {
        params: { q: debouncedQuery },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const all = [
        ...(res.data.posts || []),
        ...(res.data.blogs || []),
        ...(res.data.events || []),
        ...(res.data.users || []),
      ]

      setSuggestions(all)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message

        toast.error(`Failed to fetch suggestions: ${message}`)
        console.error('Suggestions error:', {
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        toast.error('Unexpected error occurred while fetching suggestions.')
        console.error('Unexpected suggestion error:', error)
      }
    }
  }

  fetchSuggestions()
}, [debouncedQuery])

useEffect(() => {
  const handleSearch = async () => {
    if (!debouncedQuery.trim()) {
      setResults(null)
      setShowResults(false)
      return
    }

    try {
      const res = await axios.get(`${apiUrl}/content/search`, {
        params: { q: debouncedQuery },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      setResults(res.data)
      setShowResults(true)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message

        toast.error(`Failed to search: ${message}`)
        console.error('Search error:', {
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        toast.error('Unexpected error occurred while searching.')
        console.error('Unexpected search error:', error)
      }
    }
  }

  handleSearch()
}, [debouncedQuery])




const handleSearchRedirect = (query: string) => {
  if (!query.trim()) return
    router.push(`/feed?q=${encodeURIComponent(query)}`)
}

  if (!hasMounted) return null

  return (
    <nav className="w-full sticky top-0 z-50 py-4 px-6 border-b border-gray-600 bg-white dark:bg-gray-900 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-[#800000] ">
          {user ? user.username : 'Incognitor'}
        </Link>

        {/*   Show search bar only on /feed */}
       <div
          ref={searchRef}
          className={clsx(
            'flex-1 mx-6 relative',
            pathname !== '/feed' && 'invisible pointer-events-none'
          )}
        >
          {pathname === '/feed' && (
            <>
              <input
                type="text"
                placeholder="Search posts, blogs, events..."
                className="w-full border rounded px-3 py-2 text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchRedirect(query)
                    setShowResults(false)
                  }
                }}
                onFocus={() => query && setShowResults(true)}
              />

              {showResults && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 bg-white border mt-1 z-10 rounded shadow max-h-60 overflow-y-auto">
                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        const label = item.title || item.username || ''
                        setQuery(label)
                        setSuggestions([])
                        setShowResults(false)
                        handleSearch(label)
                      }}
                    >
                      {item.title || item.username}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>






      <div className="space-x-6 flex items-center">
        <Link
          href="/feed"
          className={clsx(
            'transition-colors duration-200 border-b-2 pb-1',
            pathname === '/feed'
              ? 'text-[#800000] border-[#800000]'
              : 'text-black border-transparent hover:text-[#800000] hover:border-[#800000] dark:text-white'
          )}
        >
          Home
        </Link>

        {user ? (
          <>
            <Link
              href="/profile"
              className={clsx(
                'transition-colors duration-200 border-b-2 pb-1',
                pathname === '/profile'
                  ? 'text-[#800000] border-[#800000]'
                  : 'text-black border-transparent hover:text-[#800000] hover:border-[#800000] dark:text-white'
              )}
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="text-black hover:text-[#800000] transition-colors duration-200 border-b-2  border-transparent pb-1 hover:border-[#800000] dark:text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className={clsx(
                'transition-colors duration-200 border-b-2 pb-1',
                pathname === '/login'
                  ? 'text-[#800000] border-[#800000]'
                  : 'text-black border-transparent hover:text-[#800000] hover:border-[#800000]'
              )}
            >
              Login
            </Link>

            <Link
              href="/register"
              className={clsx(
                'transition-colors duration-200 border-b-2 pb-1',
                pathname === '/register'
                  ? 'text-[#800000] border-[#800000]'
                  : 'text-black border-transparent hover:text-[#800000] hover:border-[#800000]'
              )}
            >
              Register
            </Link>
          </>
          )}
        </div>
        
        <ThemeToggle />
      </div>
    </nav>
  )
}
