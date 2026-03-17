'use client'

import { signOutAction } from '@/lib/actions'

export default function SignOutButton() {
  const handleSignOut = async () => {
    localStorage.clear()
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim()
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    })
    await signOutAction()
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-white dark:text-black"
    >
      Sign out
    </button>
  )
}
