'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'


interface Author {
  id: number
  username: string
  email: string
  avatar?: string
}

interface Event {
  id: number
  user_id: number
  slug: string
  title: string
  from: string
  to: string
  location: string
  tags: string
  type: 'event'
  author: Author
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const perPage = 5

  const getFileUrl = (path?: string | null) => {
    if (!path || path === 'mysteries_profile.png') {
      return '/mysteries_profile.png'
    }
    return path.startsWith('http')
      ? path
      : `http://localhost:8000/storage/${path}`
  }

  const fetchEvents = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${apiUrl}/contents`, {
        params: { type: 'event', page, per_page: perPage },
      })

      const newEvents = res.data.data
      setEvents(prev => {
        const existingIds = new Set(prev.map(e => e.id))
        const merged = [...prev, ...newEvents.filter(e => !existingIds.has(e.id))]
        return merged
      })

      if (newEvents.length < perPage) {
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

        toast.error(`Failed to load event: ${message}`)
        console.error('Fetch event error:', {
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        toast.error('Unexpected error occurred while loading event.')
        console.error('Unexpected error:', error)
      }

    } finally {
      setLoading(false)
    }
  }, [page, hasMore, loading])

  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchEvents()
      }
    }, { threshold: 1 })

    const el = loaderRef.current
    if (el) observer.observe(el)
    return () => el && observer.unobserve(el)
  }, [fetchEvents, hasMore, loading])

  return (
    <div>
      {events.map(event => (
        <div key={event.id} className="border p-4 mb-4 rounded bg-white shadow">
          <div className="flex items-center mb-2">
            <img
              src={getFileUrl(event.author.avatar)}
              alt={event.author.username}
              className="w-8 h-8 rounded-full mr-2"
            />
            <p className="font-semibold">{event.author.username}</p>
          </div>

          <h2 className="text-xl font-bold capitalize mb-2">
            {event.title || event.slug.replace(/-/g, ' ')}
          </h2>

          <h3 className="text-l font-bold capitalize">
              {event.tags}
            </h3>

          <p className="text-sm text-gray-700 mb-1">
            <strong>From:</strong> {event.from}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>To:</strong> {event.to}
          </p>

          <p className="text-sm text-gray-700 mb-2">
            <strong>Location:</strong>{' '}
            <a
              href={event.location}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {event.location}
            </a>
          </p>
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
