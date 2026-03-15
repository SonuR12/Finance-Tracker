import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { getDb } from './mongodb'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const db = await getDb()
        const user = await db.collection('users').findOne({
          email: credentials.email,
          provider: 'credentials',
        })

        if (!user || !user.password) return null

        const valid = await bcrypt.compare(credentials.password as string, user.password)
        if (!valid) return null

        if (!user.emailVerified) return null

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || 'User',
          role: user.role || 'user',
          emailVerified: true,
        }
      },
    }),
  ],

  pages: { signIn: '/sign-in' },
  session: { strategy: 'jwt' },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        const db = await getDb()
        const existing = await db.collection('users').findOne({
          email: user.email,
          provider: 'google',
        })
        if (!existing) {
          await db.collection('users').insertOne({
            email: user.email,
            name: user.name,
            image: user.image,
            role: 'user',
            provider: 'google',
            emailVerified: true,
            createdAt: new Date(),
          })
        }
      }
      return true
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'user'
        token.emailVerified = account?.provider === 'google' ? true : Boolean((user as any).emailVerified)
      }
      if (trigger === 'update' && session?.user?.name) {
        token.name = session.user.name
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.emailVerified = token.emailVerified as boolean
        if (token.name) session.user.name = token.name as string
      }
      return session
    },
  },
})
