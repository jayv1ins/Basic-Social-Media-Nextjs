'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

type PostType = 'post' | 'blog' | 'event'

interface Post {
  type: PostType
  title: string
  content: string
  tags: string
  from?: string
  to?: string
  location?: string
}

export default function EditPostForm({
  slug,
  type,
}: {
  slug: string
  type: string | null
}) {
  const router = useRouter()
  const [post, setPost] = useState<Post>({
    title: '',
    type: type as PostType,
    content: '',
    tags: '',
  })

  const [postFiles, setPostFiles] = useState<File[]>([])
  const [existingThumbs, setExistingThumbs] = useState<string[]>([])

  useEffect(() => {
    const controller = new AbortController()

  
    const fetchPost = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Authentication token not found.')
        router.push('/profile')
        return
      }

      try {
        const res = await axios.get(`${apiUrl}/content/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { type },
          signal: controller.signal,
        })
        
        const { title, content, tags, thumbnail, from, to, location } =
          res.data.data
        
        setPost({
          title,
          content: content || '',
          tags: tags || '',
          type: type as PostType,
          from,
          to,
          location,
        })

        if (thumbnail) {
          const thumbs = thumbnail.split(',').map((t: string) => t.trim())
          setExistingThumbs(thumbs)
        }
      } catch (error: any) {
        toast.error(
          axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : 'Unexpected error loading post'
        )
        router.push('/profile')
      }
    }

    fetchPost()
    // return () => controller.abort()
  }, [slug, type, router])

  const handleChange =
    (field: keyof Post) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPost((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Authentication token not found.')
      return
    }

    if (!type) {
      toast.error('Post type is invalid.')
      return
    }

    const formData = new FormData()
    if (post.title) formData.append('title', post.title)
    if (type) formData.append('type', type)
    if (post.tags) formData.append('tags', post.tags)

    if (['post', 'blog'].includes(type) && post.content) {
      formData.append('content', post.content)
    }

    if (type === 'post' && postFiles.length > 0) {
      postFiles.forEach((file) => {
        formData.append('thumbnail[]', file)
      })
    }

    if (type === 'event') {
      if (post.from) formData.append('from', post.from)
      if (post.to) formData.append('to', post.to)
      if (post.location) formData.append('location', post.location)
    }

    try {
      await axios.post(`${apiUrl}/content/${slug}?_method=PATCH`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        params: { type },
      })

      toast.success('Post updated successfully!')
      router.push('/profile')
    } catch (error: any) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          error.response?.data?.error ||
          error.message
        : 'Unexpected error occurred while updating the post.'

      toast.error(`Error updating post: ${message}`)
      console.error('Update post error:', error)
    }
  }

  const getFileUrl = (path: string) =>
    path.startsWith('http')
      ? path
      : `${apiUrl?.replace('/api', '')}/storage/${path}`

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow-xl"
    >
      <input
        type="text"
        className="w-full border p-2 rounded text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Title"
        value={post.title}
        onChange={handleChange('title')}
        required
      />

      <input
        type="text"
        className="w-full border p-2 rounded text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Tags"
        value={post.tags}
        onChange={handleChange('tags')}
      />

      {existingThumbs.length > 0 && post.type === 'post' && (
        <div className="flex flex-wrap gap-4">
          {existingThumbs.map((path, idx) => (
            <img
              key={idx}
              src={getFileUrl(path)}
              alt={`thumb-${idx}`}
              className="w-24 h-24 object-cover rounded border"
            />
          ))}
        </div>
      )}

      {post.type === 'post' && (
        <input
          type="file"
          className="w-full border p-2 rounded text-sm"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setPostFiles(Array.from(e.target.files))
            }
          }}
        />
      )}

      {(post.type === 'post' || post.type === 'blog') && (
        <textarea
          className="w-full border p-2 rounded text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Content"
          value={post.content}
          onChange={handleChange('content')}
          required
        />
      )}

      {post.type === 'event' && (
        <>
          <input
            type="time"
            className="w-full border p-2 rounded text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={post.from || ''}
            onChange={handleChange('from')}
            required
          />
          <input
            type="time"
            className="w-full border p-2 rounded text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={post.to || ''}
            onChange={handleChange('to')}
            required
          />
          <input
            type="url"
            className="w-full border p-2 rounded text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Map link (Google Maps URL)"
            value={post.location || ''}
            onChange={handleChange('location')}
            required
          />
        </>
      )}

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Update Post
      </button>
    </form>
  )
}
