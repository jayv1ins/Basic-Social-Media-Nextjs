'use client'
import { useEffect } from 'react'

export function ReactDevToolsBridge() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'http://localhost:8097'
      document.body.appendChild(script)
    }
  }, [])

  return null
}
