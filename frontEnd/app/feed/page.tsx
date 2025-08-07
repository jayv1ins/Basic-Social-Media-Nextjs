'use client'

import { useSearch } from '@/context/SearchContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'


import PostForm from '@/components/post/PostForm'
import PostList from '@/components/post/PostList'
import BlogList from '@/components/blog/BlogList'
import EventList from '@/components/event/EventList'
import PeopleList from '@/components/PeopleList'
import CommentForm from '@/components/CommentForm'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

type TabType = 'all' | 'posts' | 'blogs' | 'events' | 'people'

interface User {
  id: number
  username: string
  email: string
  avatar?: string[]
}

export default function FeedPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { results, query, setQuery, setResults } = useSearch()

  const [tags, setTags] = useState<string[]>([])
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('all')

  // Load auth status
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'))
  }, [])

  // Fetch tags once
  useEffect(() => {
    axios
      .get(`${apiUrl}/tags`)
      .then(res => setTags(res.data.tags))
      .catch(err => toast.error(`Failed to fetch tags: ${err.response.data.error}` ))
  }, [])

  // Handle search from `?q=...`
  useEffect(() => {
    const q = searchParams.get('q') || ''
    if (!q) return

    const fetchSearch = async () => {
      try {
        const res = await axios.get(`${apiUrl}/content/search`, {
          params: { q },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        setQuery(q)
        setResults(res.data)
      }catch (err: any) {
        const response = err?.response;
        const errorMessage =
          response?.data?.error || 
          response?.data?.message || 
          err?.message || 
          'An unexpected error occurred while loading posts.';

        toast.error(errorMessage);
        setResults(null)
      }

      //  toast.error(`Error fetching posts: ${error.response.data.error}` )
    }

    fetchSearch()
  }, [searchParams, setQuery, setResults])

  // Tag click handler
  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null)
      setQuery('')
      router.push('/feed')
    } else {
      setActiveTag(tag)
      router.push(`/feed?q=${encodeURIComponent(tag)}`)
    }
  }

  const getFileUrl = (path?: string | null) =>
    !path || path === 'mysteries_profile.png'
      ? '/mysteries_profile.png'
      : path.startsWith('http')
      ? path
      : `http://localhost:8000/storage/${path}`

  return (
    <main className="w-full max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Incognitor</h1>

      {isAuthenticated && <PostForm />}
      {/* Tag Filter Section */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6 mb-6 justify-center">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1 rounded-full text-sm border shadow ${
                activeTag === tag
                  ? 'bg-[#800000] text-white border-[#800000]'
                  : 'border-[#800000] text-gray-600 hover:bg-[#800000] dark:text-white hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Search Results */}
      {results ? (
        <div className="mt-6">
          <h1 className="text-xl font-semibold mb-4">
            Search Results for: “{query}”
          </h1>

          {/* Users */}
          {results.users?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-md mb-2">Users</h3>
              {results.users.map((user: User) => (
                <div
                  key={`user-${user.id}`}
                  className="w-full border p-4 rounded shadow bg-white mb-3"
                >
                  <img
                    src={user.avatar || '/mysteries_profile.png'}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full mx-auto mb-2"
                  />
                  <h2 className="text-center font-bold text-lg">{user.username}</h2>
                  <p className="text-center text-sm text-gray-600">{user.email}</p>
                </div>
              ))}
            </div>
          )}

          {/* Posts */}
          {results.posts.map(post => (
            <div key={`post-${post.id}`} className="mb-4 p-4 border rounded bg-white">
              <img
                src={getFileUrl(post.author.avatar)}
                alt={post.author.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <p className="font-semibold">{post.author.username}</p>
              <h3 className="font-semibold">{post.title}</h3>
              <h2 className="font-semibold">{post.tags}</h2>
              <p className="text-sm text-gray-600">{post.content}</p>
              <CommentForm postId={post.id} />
            </div>
          ))}

          {/* Blogs */}
          {results.blogs.map(blog => (
            <div key={`blog-${blog.id}`} className="mb-4 p-4 border rounded bg-white">
              <h3 className="font-semibold">{blog.title}</h3>
              <p className="text-sm text-gray-600">{blog.content}</p>
            </div>
          ))}

          {/* Events */}
          {results.events.map(event => (
            <div key={`event-${event.id}`} className="mb-4 p-4 border rounded bg-white">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">
                From: {event.from} — To: {event.to}
              </p>
              <p className="text-sm text-gray-600">Location: {event.location}</p>
            </div>
          ))}

          {/* No matches */}
          {results.posts.length === 0 &&
            results.blogs.length === 0 &&
            results.events.length === 0 &&
            (!results.users || results.users.length === 0) && (
              <p className="text-gray-500 text-sm mt-4">No results found.</p>
            )}
        </div>
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="flex justify-center gap-6 mb-8 border-b">
            {['all', 'posts', 'blogs', 'events', 'people'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as TabType)}
                className={`px-4 py-2 border-b-2 transition ${
                  activeTab === tab
                    ? 'border-[#800000] text-[#800000] font-semibold'
                    : 'border-transparent text-gray-600 hover:text-[#800000] hover:border-[#800000]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'all' && (
            <>
              <PostList />
              <BlogList />
              <EventList />
              <PeopleList />
            </>
          )}
          {activeTab === 'posts' && <PostList />}
          {activeTab === 'blogs' && <BlogList />}
          {activeTab === 'events' && <EventList />}
          {activeTab === 'people' && <PeopleList />}
        </>
      )}
    </main>
  )
}
