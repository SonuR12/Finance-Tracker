'use client'

import { signOut } from 'next-auth/react'
import { AppButton } from '@/components/ui/AppButton'

export default function SignOutButton() {
  return (
    <AppButton variant="danger" onClick={() => {
      try { localStorage.removeItem("ai_chat_history"); } catch {}
      signOut({ callbackUrl: '/' });
    }}>
      Sign out
    </AppButton>
  )
}
