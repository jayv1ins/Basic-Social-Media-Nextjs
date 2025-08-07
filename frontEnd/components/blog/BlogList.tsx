'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import axios from 'axios'
import CommentForm from '../CommentForm'
import toast from 'react-hot-toast'


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
  author: Author
  tags: string,
  comments?: Comment[]
  thumbnail?: string[]
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const perPage = 5

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${apiUrl}/contents`, {
        params: {
          type: 'blog',
          page,
          per_page: perPage,
        },
      })

      const fetched: Post[] = response.data.data.map((post: any) => ({
        ...post,
        thumbnail: post.thumbnail
          ? post.thumbnail.split(',').map((t: string) => t.trim())
          : [],
      }))

      setPosts(prev => {
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

        toast.error(`Failed to load blog: ${message}`)
        console.error('Fetch blog error:', {
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        toast.error('Unexpected error occurred while loading blog.')
        console.error('Unexpected error:', error)
      }

    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Setup observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts()
        }
      },
      { threshold: 1 }
    )

    const node = loaderRef.current
    if (node) observer.observe(node)
    return () => node && observer.unobserve(node)
  }, [fetchPosts, hasMore, loading])

  const toggleReadMore = (id: number) =>
    setExpandedPostId(prev => (prev === id ? null : id))

  const getFileUrl = (path?: string | null) =>
    !path || path === 'mysteries_profile.png'
      ? '/mysteries_profile.png'
      : path.startsWith('http')
      ? path
      : `http://localhost:8000/storage/${path}`

  const isImage = (filename: string) =>
    /\.(jpe?g|png|gif|bmp|webp)$/i.test(filename)

  return (
    <div>
      {posts.map(post => {
        const isExpanded = expandedPostId === post.id
        const thumbnails = post.thumbnail || []
        const [firstThumb, ...remainingThumbs] = thumbnails

        return (
          <div key={`blog-${post.id}`} className="border p-3 mb-4 rounded bg-white shadow">
            <div className="flex items-center mb-2">
              <img
                src={getFileUrl(post.author.avatar)}
                alt={post.author.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <p className="font-semibold">{post.author.username}</p>
            </div>

            <h2 className="text-xl font-bold capitalize">
              {post.slug.replace(/-/g, ' ')}
            </h2>

            <h3 className="text-xl font-bold capitalize">
              {post.tags}
            </h3>

            {firstThumb && (
              <div className="my-2">
                {isImage(firstThumb) ? (
                  <img
                    src={getFileUrl(firstThumb)}
                    alt="Thumbnail"
                    className="w-full h-auto rounded"
                  />
                ) : (
                  <a
                    href={getFileUrl(firstThumb)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-100 text-sm text-center py-4 rounded border"
                  >
                    📄 {firstThumb.split('/').pop()}
                  </a>
                )}
              </div>
            )}

            {!isExpanded ? (
              <p className="italic text-sm text-gray-600">{post.excerpt}</p>
            ) : (
              <>
                {remainingThumbs.length > 0 && (
                  <div className="flex flex-col gap-4 mt-3">
                    {remainingThumbs.map((file, idx) => (
                      <div key={`${post.id}-${idx}`}>
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

            {(thumbnails.length > 1 || post.content.length > post.excerpt.length) && (
              <button
                onClick={() => toggleReadMore(post.id)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )
      })}

      {hasMore && (
        <div ref={loaderRef} className="text-center py-4 text-gray-500">
          {loading ? 'Loading more...' : 'Scroll to load more'}
        </div>
      )}
    </div>
  )
}
