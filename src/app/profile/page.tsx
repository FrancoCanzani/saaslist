import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'
import Header from '@/components/header'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="border p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-semibold">
                Profile
              </h1>
              <LogoutButton />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2">
                  Email
                </label>
                <div className="border p-3">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">
                  User ID
                </label>
                <div className="border p-3 font-mono text-sm">
                  {user.id}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">
                  Account Created
                </label>
                <div className="border p-3">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>

              <div className="pt-6 border-t">
                <h2 className="text-lg font-semibold mb-4">
                  Profile Settings
                </h2>
                <p className="text-sm mb-4">
                  Coming soon:
                </p>
                <ul className="space-y-2 text-sm">
                  <li>Display name and bio</li>
                  <li>Profile picture</li>
                  <li>Social media links</li>
                  <li>Notification preferences</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

