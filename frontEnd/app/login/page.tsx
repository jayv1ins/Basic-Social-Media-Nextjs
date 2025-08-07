'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import Link from 'next/link'
import axios from 'axios'
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function LoginPage() {
  const [identifier, setIdentifier] = useState('') // email or username
  const [password, setPassword] = useState('')

  const router = useRouter()


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        identifier,
        password,
      })
      // console.log('   Axios Response login:', response.data)

      // Example: save token or redirect
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      router.push('/feed') // if using router
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

    }
  }

  return (
    <main className="min-h-screen    text-white flex flex-col items-center justify-center px-6 py-12">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In to Incognitor</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Email or Username</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-2xl transition"
        >
          Log In
        </button>

        <p className="text-center text-sm text-neutral-400 mt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-purple-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  )
}
