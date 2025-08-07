import ProfilePosts from '@/components/post/ProfilePost'
import ProfileEvents from '@/components/event/ProfileEvent'
import ProfileBlogs from '@/components/blog/ProfileBlog'

import SidebarUserInfo from '@/components/SideBarUserInfo'

export default function ProfilePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8 text-center">Profile</h1>

      {/* Sidebar and Content */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Sidebar */}
        <div className="w-full md:w-1/4">
          <SidebarUserInfo />
        </div>

        {/* Right: Posts */}
        <div className="flex-1">
          <ProfilePosts />
          <ProfileEvents />
          <ProfileBlogs />

          
        </div>

      
      </div>
    </main>
  )
}
