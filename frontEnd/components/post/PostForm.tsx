'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import axios from 'axios'
import toast from 'react-hot-toast'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

type Post = {
  title: string
  content: string
  type: 'post' | 'blog' | 'event'
  tags: string
  from?: string
  to?: string
  location?: string
}

export default function PostForm() {
  const router = useRouter()

  const [post, setPost] = useState<Post>({
    title: '',
    content: '',
    type: 'post',
    tags: ''
  })

  const [postFiles, setPostFiles] = useState<File[]>([])

  const handleChange = (field: keyof Post) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPost({ ...post, [field]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    const formData = new FormData()
    formData.append('title', post.title)
    formData.append('type', post.type)
    formData.append('tags', post.tags)
  
    if (post.type === 'post') {
      formData.append('content', post.content)
      postFiles.forEach((file) => {
        formData.append('thumbnail[]', file)
      })
    }
  
    if (post.type === 'blog') {
      formData.append('content', post.content)
    }
  
    if (post.type === 'event') {
      if (post.from) formData.append('from', post.from)
      if (post.to) formData.append('to', post.to)
      if (post.location) formData.append('location', post.location)
    }
  
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Authentication token not found.')
        return
      }
  
      await axios.post(`${apiUrl}/contents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
  
      toast.success('Post created successfully!')
      setPost({ title: '', content: '', type: 'post', tags: '' })
      setPostFiles([])
  
      setTimeout(() => {
        window.location.reload()
      }, 3000)
  
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message
  
        toast.error(`Failed to save the post: ${message}`)
        console.error('Create post error:', {
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        toast.error('Unexpected error occurred while saving the post.')
        console.error('Unexpected error:', error)
      }
    }
  }
  

  const typeOptions: Post['type'][] = ['post', 'blog', 'event']

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-xl">
      {/* Type selector */}
      <div className="flex gap-2 mb-2">
        {typeOptions.map((type) => (
          <button
            key={type}
            type="button"
            value={post.type}
            onClick={() => setPost((prev) => ({ ...prev, type }))}
            className={`px-4 py-1 rounded border text-sm font-medium ${
              post.type === type
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Common Fields */}
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

      {/* Post/Blog content field */}
      {(post.type === 'post' || post.type === 'blog') && (
        <textarea
          className="w-full border p-2 rounded text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Content"
          value={post.content}
          onChange={handleChange('content')}
          required
        />
      )}

      {/* File upload for post only */}
      {post.type === 'post' && (
        <input
          type="file"
          className="w-full border p-2 rounded dark:text-gray-900"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setPostFiles(Array.from(e.target.files))
            }
          }}
        />
      )}

      {/* Fields specific to Event */}
      {post.type === 'event' && (
        <>
          <input
            type="time"
            className="w-full border p-2 rounded text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-900"
            placeholder="Time From"
            value={post.from || ''}
            onChange={handleChange('from')}
            required
          />

          <input
            type="time"
            className="w-full border p-2 rounded text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-900"
            placeholder="Time To"
            value={post.to || ''}
            onChange={handleChange('to')}
            required
          />

          <input
            type="url"
            className="w-full border p-2 rounded text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 "
            placeholder="Map Link (Google Maps URL)"
            value={post.location || ''}
            onChange={handleChange('location')}
            required
          />
        </>
      )}

      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Create Post
      </button>
    </form>
  )
}
