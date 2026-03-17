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

        if (!user.avatarColor) {
          const COLORS = [
            'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500',
            'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
          ]
          const avatarColor = COLORS[Math.floor(Math.random() * COLORS.length)]
          await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { avatarColor } }
          )
          user.avatarColor = avatarColor
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || 'User',
          role: user.role || 'user',
          emailVerified: true,
          avatarColor: user.avatarColor || null,
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
        token.avatarColor = (user as any).avatarColor || null
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
        session.user.avatarColor = token.avatarColor as string | null
      }
      return session
    },
  },
})
