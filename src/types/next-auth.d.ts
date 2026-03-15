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
    }
  }
  interface User {
    role?: string
    emailVerified?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    emailVerified: boolean
  }
}
