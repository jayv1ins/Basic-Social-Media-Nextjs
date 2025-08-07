'use client'

import { use } from 'react'
import EditForm from "@/components/content/EditForm"
import { useSearchParams } from 'next/navigation'

export default function EditPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = use(props.params)
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  return (
    <main className="max-w-xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Update</h1>
      <EditForm slug={slug} type={type} />
    </main>
  )
}
