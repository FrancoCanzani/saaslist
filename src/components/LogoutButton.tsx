'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    })
    
    if (response.ok) {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="border px-4 py-2 text-sm hover:bg-gray-50"
    >
      Logout
    </button>
  )
}

