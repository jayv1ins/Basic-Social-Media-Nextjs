'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import CommentForm from '../CommentForm'
import Link from 'next/link'
import toast from 'react-hot-toast'

const apiUrl = process.env.NEXT_PUBLIC_API_URL


interface Author {
  id: number
  username: string
  email: string
  avatar?: string
  created_at?: string
  updated_at?: string
}

interface Comment {
  id: number
  body: string
  author: {
    id: number
    username: string
  }
}

interface Event {
  id: number
  user_id: number
  slug: string
  title: string
  from: string
  to: string
  location: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  type: 'event'
  index: number
  author: Author
  tags: string
  comments?: Comment[]
}

export default function EventList() {
  
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          toast.error('Authentication token not found.')
          return
        }
  
        const response = await axios.get('http://localhost:8000/api/me/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            type: 'event',
          },
        })
  
        setEvents(response.data.data)
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message
  
          toast.error(`Error loading events: ${message}`)
          console.error('Events fetch error:', {
            status: error.response?.status,
            data: error.response?.data,
          })
        } else {
          toast.error('Unexpected error occurred while loading events.')
          console.error('Unexpected error:', error)
        }
      }
    }
  
    fetchEvents()
  
   
  }, [])

  const getFileUrl = (path?: string | null): string => {
    if (!path || path === 'mysteries_profile.png') {
      return '/mysteries_profile.png' 
    }
  
    try {
      return path.startsWith('http')
        ? path
        : `http://localhost:8000/storage/${path}`
    } catch (err) {
      console.error('getFileUrl error:', err)
      return '/mysteries_profile.png'
    }
  }
  

  
const handleDelete = async (slug: string) => {
  const confirmed = window.confirm('Are you sure you want to delete this post?')
  if (!confirmed) return

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Authentication token not found.')
      return
    }

    await axios.delete(`${apiUrl}/content/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        type: 'event',
      },
    })

    setEvents(prev => prev.filter(post => post.slug !== slug))
    toast.success('Post deleted successfully!')
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message

      toast.error(`Error deleting post: ${message}`)
      console.error('Delete post error:', {
        status: error.response?.status,
        data: error.response?.data,
      })
    } else {
      toast.error('Unexpected error occurred while deleting post.')
      console.error('Unexpected error:', error)
    }
  }
}

  return (
    <div>
      {events.map(event => (
        <div key={event.id} className="border p-4 mb-4 rounded bg-white shadow">
          {/* Author */}
          <div className="flex items-center mb-2">
            <img
              src={getFileUrl(event.author.avatar)}
              alt={event.author.username}
              className="w-8 h-8 rounded-full mr-2"
            />
            <p className="font-semibold">{event.author.username}</p>
          </div>

          {/* Title */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold capitalize">{event.slug.replace(/-/g, ' ')}</h2>
              
                <div className="flex gap-4 text-sm">
                  <Link
                    href={`/event/edit/${event.slug}?type=event`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(event.slug)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
          </div>
              <h3 className="text-l font-bold capitalize">
                   {event.tags}
                  </h3>

          {/* Time */}
          <p className="text-sm text-gray-700 mb-1">
            <strong>From:</strong> {event.from}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>To:</strong> {event.to}
          </p>

          {/* Location */}
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

          {/* Comments */}
          
        </div>
      ))}
    </div>
  )
}
