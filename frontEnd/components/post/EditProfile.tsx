'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

interface User {
  id: number
  username: string
  email: string
  avatar?: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    axios
      .get(`${apiUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data))
      .catch(() => {
        toast.error('Failed to load user.')
        setUser(null)
      })
  }, [])

  const getFileUrl = (path: string) => {
    return path.startsWith('http') ? path : `${apiUrl?.replace('/api', '')}/storage/${path}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token || !user) return

    const formData = new FormData()
    formData.append('username', user.username)
    formData.append('email', user.email)
    if (avatarFile) formData.append('avatar', avatarFile)

    try {
      const res = await axios.post(`${apiUrl}/profile/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Profile updated!')
      setUser(res.data.user)
      // router.push('/profile')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Update failed'
      toast.error(msg)
    }
  }

  if (!user) return <div className="text-center mt-10">Loading profile...</div>

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-center">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <img
              src={
                avatarFile
                  ? URL.createObjectURL(avatarFile)
                  : user.avatar
                  ? getFileUrl(user.avatar)
                  : '/mysteries_profile.png'
              }
              alt="Avatar"
              className="w-28 h-28 rounded-full mx-auto object-cover mb-4 border-2 border-gray-300"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setAvatarFile(e.target.files[0])
                }
              }}
              className="block mx-auto"
            />
          </div>

          <input
            name="username"
            type="text"
            value={user.username}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg text-lg"
            placeholder="Username"
          />

          <input
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg text-lg"
            placeholder="Email"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 text-lg rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </main>
  )
}
