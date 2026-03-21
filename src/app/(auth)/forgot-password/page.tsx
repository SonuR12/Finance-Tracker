'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppButton } from '@/components/ui/AppButton'
import { useT } from '@/lib/i18n-context'

export default function ForgotPasswordPage() {
  const t = useT()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 p-6">
      <div className="w-full max-w-md" style={{ animation: 'fade-in 0.6s ease-out' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg mx-auto mb-4">
            🔑
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {t('auth.forgotPassword')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {submitted ? t('auth.checkInbox') : t('auth.enterEmailReset')}
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700 dark:text-green-300">
                {t('auth.resetLinkSent')} <span className="font-semibold">{email}</span>
              </p>
            </div>
            <AppButton variant="primary" size="lg" className="w-full rounded-xl" onClick={() => router.push('/sign-in')}>
              {t('auth.backToSignInBtn')}
            </AppButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.enterEmail')}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
            <AppButton type="submit" variant="primary" size="lg" saving={loading} saveLabel={t('auth.sendResetLink')} savingLabel={t('auth.sendingLink')} className="w-full rounded-xl" />
            <AppButton type="button" variant="ghost" size="md" className="w-full" onClick={() => router.push('/sign-in')}>
              ← {t('auth.backToSignIn')}
            </AppButton>
          </form>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
