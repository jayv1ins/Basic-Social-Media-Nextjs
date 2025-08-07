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
}

interface Comment {
  id: number
  body: string
  author: Author
}

interface Post {
  id: number
  user_id: number
  slug: string
  excerpt: string
  content: string
  tags: string
  author: Author
  comments?: Comment[]
  thumbnail?: string[] // Optional
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null)
  const type = 'blog'
  useEffect(() => {
  
    const fetchBlogs = async () => {
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
            type: 'blog',
          },
        })
  
        setPosts(response.data.data)
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
  
    fetchBlogs()
  
  
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
  
  const isImage = (filename: string | null | undefined): boolean => {
    if (!filename || typeof filename !== 'string') return false
    return /\.(jpe?g|png|gif|bmp|webp)$/i.test(filename)
  }

  const toggleReadMore = (postId: number) => {
    setExpandedPostId(prev => (prev === postId ? null : postId))
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
          type: 'blog',
        },
      })
  
      setPosts(prev => prev.filter(post => post.slug !== slug))
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
      {posts.map(post => {
        const isExpanded = expandedPostId === post.id
        const thumbnails = post.thumbnail || []
        const firstThumb = thumbnails[0]
        const remainingThumbs = thumbnails.slice(1)

        return (
          <div
            key={post.id}
            className="border p-3 mb-4 rounded bg-white shadow"
          >
            {/* Author Info */}
            <div className="flex items-center mb-2">
              <img
                src={getFileUrl(post.author.avatar || 'mysteries_profile.png')}
                alt={post.author.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <p className="font-semibold">{post.author.username}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold capitalize">{post.slug.replace(/-/g, ' ')}</h2>
 
                <div className="flex gap-4 text-sm">
                  <Link
                    href={`/blog/edit/${post.slug}?type=blog`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
 <h3 className="text-l font-bold capitalize">
                   {post.tags}
                  </h3>
            {/* First image if exists */}
         
           

            {/* Excerpt or full content */}
            {!isExpanded ? (
              <p className="italic text-sm text-gray-600">{post.excerpt}</p>
            ) : (
              <>
                {remainingThumbs.length > 0 && (
                  <div className="flex flex-col gap-4 mt-3">
                    {remainingThumbs.map((file, idx) => (
                      <div key={idx}>
                        {isImage(file) ? (
                          <img
                            src={getFileUrl(file)}
                            alt={`img-${idx}`}
                            className="w-full h-auto rounded"
                          />
                        ) : (
                          <a
                            href={getFileUrl(file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-gray-100 text-sm text-center py-4 rounded border"
                          >
                            📄 {file.split('/').pop()}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-4 text-base">{post.content}</p>
              </>
            )}

          
         
            
          </div>
        )
      })}
    </div>
  )
}
