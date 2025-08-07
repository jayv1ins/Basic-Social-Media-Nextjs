import axios from 'axios'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const fetchAPI = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export const setHeadersAuth = (token?: string) => {
  fetchAPI.defaults.headers.Authorization = token ? `Bearer ${token}` : ''
}