'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
interface User {
  id: number
  username: string
  email: string
  avatar: string
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const perPage = 5

  const fetchUsers = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${apiUrl}/people`, {
     
        params: {
          page,
          per_page: perPage,
        },
      })

      const fetched: User[] = response.data.data.map((user: any) => ({
        ...user,
      }))
         setUsers(prev => {
        const existingIds = new Set(prev.map(p => p.id))
        const unique = fetched.filter(p => !existingIds.has(p.id))
        return [...prev, ...unique]
      })

      if (fetched.length < perPage) {
        setHasMore(false)
      } else {
        setPage(prev => prev + 1)
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message

        toast.error(`Failed to load people: ${message}`)
        console.error('Fetch people error:', {
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        toast.error('Unexpected error occurred while loading people.')
        console.error('Unexpected error:', error)
      }

    } finally {
      setLoading(false)
    }
  }, [page, users, loading, hasMore])

  useEffect(() => {
    fetchUsers()
  }, [])

  

  // scroll observer to fetch next page
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchUsers()
        }
      },
      { threshold: 1 }
    )

    const node = loaderRef.current
    if (node) observer.observe(node)
    return () => node && observer.unobserve(node)
  }, [fetchUsers, hasMore, loading])

  


  const toggleReadMore = (id: number) =>
    setExpandedUserId(prev => (prev === id ? null : id))

  const getFileUrl = (path?: string | null) =>
    !path || path === 'mysteries_profile.png'
      ? '/mysteries_profile.png'
      : path.startsWith('http')
      ? path
      : `http://localhost:8000/storage/${path}`

  const isImage = (filename: string) =>
    /\.(jpe?g|png|gif|bmp|webp)$/i.test(filename)

  return (
    <div className="flex flex-wrap -mx-2">
  {users.map((user) => (
    <div
      key={`user-${user.id}`}
      className="w-full sm:w-1/2 px-2 mb-4"
    >
      <div className="border p-4 rounded shadow bg-white h-full text-center">
        <img
          src={getFileUrl(user.avatar || 'mysteries_profile.png')}
          alt="Avatar"
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <h2 className="font-bold text-lg">{user.username}</h2>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
    </div>
  ))}

      {hasMore && (
        <div ref={loaderRef} className="text-center py-4 text-gray-500">
          {loading ? 'Loading more...' : 'Scroll to load more'}
        </div>
      )}
    </div>
  )
}
