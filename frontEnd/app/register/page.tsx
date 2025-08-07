'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    try {
      const response = await axios.post(`${apiUrl}/register`, {
        email,
        username,
        password,
        password_confirmation: confirmPassword,
      })

      const token = response.data.token

      if (token) {
        localStorage.setItem('token', token) //    Save token
        localStorage.setItem('username', response.data.user.username) //    Save username
        localStorage.setItem('user_id', response.data.user.id) //    Save user ID
        toast.success('Registration successful!')
        router.push('/feed') //    Redirect
      } else {
        toast.error('Token not received. Please try logging in manually.')
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message

        toast.error(`Failed to register : ${message}`)
        console.error('failed to register error:', {
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        toast.error('Unexpected error occurred while loading page.')
        console.error('Unexpected error:', error)
      }

    }
  }

  return (
    <main className="min-h-screen    text-white flex flex-col items-center justify-center px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Your Incognitor Account</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Username (Alias)</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-2xl transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-neutral-400 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-400 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}
