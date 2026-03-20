'use client'

import { signOut } from 'next-auth/react'
import { AppButton } from '@/components/ui/AppButton'

export default function SignOutButton() {
  return (
    <AppButton variant="danger" onClick={() => signOut({ callbackUrl: '/' })}>
      Sign out
    </AppButton>
  )
}
