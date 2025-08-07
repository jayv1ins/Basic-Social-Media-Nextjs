'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

interface Post {
  id: number
  slug: string
  excerpt: string
  content: string
}

interface User {
  id: number
  username: string
  email: string
  avatar?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])

   const [summary, setSummary] = useState<string | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)


 useEffect(() => {
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
      })

      const userData: User = response.data
      setUser(userData)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {

        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message

        toast.error(`Failed to load user: ${message}`)
        console.error('Fetch user error:', {
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        toast.error('Unexpected error occurred while loading user.')
        console.error('Unexpected error:', error)
      }

      setUser(null)
    }
  }

  fetchUser()

 
}, [])


      const getFileUrl = (path?: string | null) => {
  if (!path || path === 'mysteries_profile.png') {
    return '/mysteries_profile.png' // Fallback to default avatar
  }

  return path.startsWith('http')
    ? path
    : `http://localhost:8000/storage/${path}`
  }
  
  // const handleSummary = async () => {
  //   try {
  //     setLoadingSummary(true)
  //     const res = await axios.get(`${apiUrl}/me/posts/summary`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       }
  //     })

  //     setSummary(res.data.data.summary)
  //   } catch (error) {
  //     console.error('   Summary error:', error)
  //     setSummary('Failed to generate summary.')
  //   } finally {
  //     setLoadingSummary(false)
  //   }
  // }

  if (!user) return <div className="text-center mt-10">Loading profile...</div>

  return (
    <div className="flex flex-col px-6 ">
      {/* Left: Avatar + Info */}
      <div className="w-[250px] border p-4 rounded shadow bg-white">
        <img
            src={getFileUrl(user.avatar || 'mysteries_profile.png')}
          alt="Avatar"
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <h2 className="text-center font-bold text-lg">{user.username}</h2>
        <p className="text-center text-sm text-gray-600">{user.email}</p>

        <div className="mt-6 text-center">
          <Link
            href="/profile/edit/"
            className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Edit Profile
          </Link>
        </div>

        
      </div>
  {/*  Summary Button and Display */}
      {/* <div className="text-center mt-10">
        <button
          onClick={handleSummary}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          {loadingSummary ? 'Summarizing...' : 'Summarize My Activity'}
        </button>

        {summary && (
          <div className="border mt-6 bg-gray-100 p-4 rounded text-sm text-gray-800 text-left">
            <h4 className="font-bold mb-2">Your Summary:</h4>
            <p>{summary}</p>
          </div>
        )}
      </div> */}
    
    </div>
  )
}
