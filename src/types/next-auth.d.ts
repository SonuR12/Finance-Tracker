import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      emailVerified: boolean
      image?: string
      avatarColor?: string | null
    }
  }
  interface User {
    role?: string
    emailVerified?: boolean
    avatarColor?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    emailVerified: boolean
    avatarColor?: string | null
  }
}
