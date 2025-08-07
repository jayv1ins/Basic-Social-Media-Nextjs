'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function CommentForm({ postId }: { postId: number }) {
  const [content, setContent] = useState('')
  const [hasMounted, setHasMounted] = useState(false)
  const [storedUserId, setStoredUserId] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)


  useEffect(() => {
    setHasMounted(true)

    const token = localStorage.getItem('token')
    const storedUserId = localStorage.getItem('user_id')

    setIsLoggedIn(!!token)
    if (storedUserId) setStoredUserId(storedUserId)
  }, [])

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
  
    if (!content.trim()) {
      toast.error('Comment cannot be empty.')
      return
    }
  
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('user_id')
  
    if (!token || !userId) {
      toast.error('You must be logged in to comment.')
      return
    }
  
    try {
      const response = await axios.post(
        `${apiUrl}/posts/${postId}/comments`,
        {
          content,
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
  
      toast.success('Comment added!')
      setContent('')
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message
  
        toast.error(`Failed to send comment: ${message}`)
        console.error('Comment save error:', {
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        toast.error('Unexpected error occurred while sending comment.')
        console.error('Unexpected error:', error)
      }
    }
  }
  

  if (!hasMounted) return null //    prevents hydration mismatch

  return (
    <form onSubmit={handleComment} className="ml-4 mt-2 flex items-center gap-2">
      <input
        className="flex-1 border p-2 rounded bg-white text-black"
        placeholder="Add comment... "
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 whitespace-nowrap"
      >
        Post
      </button>
    </form>
  )
}
