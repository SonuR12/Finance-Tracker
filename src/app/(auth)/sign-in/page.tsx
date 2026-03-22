'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { AppButton } from '@/components/ui/AppButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { toast } from 'sonner'
import { useT } from '@/lib/i18n-context'
import dynamic from 'next/dynamic'

const FinanceScene = dynamic(() => import('@/components/auth/FinanceScene').then(m => m.FinanceScene), { ssr: false, loading: () => null })

type View = 'signin' | 'signup' | 'verify' | 'forgot' | 'reset'

const SubmitBtn = ({ loading, label, loadingLabel, disabled }: { loading: boolean; label: string; loadingLabel: string; disabled?: boolean }) => (
  <AppButton
    type="submit"
    variant="primary"
    saving={loading}
    saveLabel={label}
    savingLabel={loadingLabel}
    disabled={disabled}
    className="w-full h-11 rounded-md"
  />
)

function validatePassword(p: string) {
  return p.length >= 8 && /[a-zA-Z]/.test(p) && /\d/.test(p) && /[!@#$%^&*(),.?":{}|<>]/.test(p)
}

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
}

export default function SignInPage() {
  const t = useT()
  const [view, setView] = useState<View>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const { status } = useSession()

  useEffect(() => {
    const t = setTimeout(() => setShowSkeleton(false), 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') window.location.href = '/dashboard'
  }, [status])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  if (status === 'authenticated') return null
  if (status === 'loading' || showSkeleton) return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0"><FinanceScene /></div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-sm space-y-4 animate-pulse">
          <div className="text-center mb-6 space-y-2">
            <div className="h-7 w-40 bg-neutral-200 dark:bg-neutral-700 rounded-md mx-auto" />
            <div className="h-4 w-56 bg-neutral-200 dark:bg-neutral-700 rounded-md mx-auto" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
            <div className="h-11 w-full bg-neutral-200 dark:bg-neutral-700 rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
              <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
            </div>
            <div className="h-11 w-full bg-neutral-200 dark:bg-neutral-700 rounded-md" />
          </div>
          <div className="h-11 w-full bg-neutral-200 dark:bg-neutral-700 rounded-md" />
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          </div>
          <div className="h-11 w-full bg-neutral-200 dark:bg-neutral-700 rounded-md" />
          <div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-700 rounded-md mx-auto" />
        </div>
      </div>
    </div>
  )
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const check = await fetch('/api/authentication/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const { exists, emailVerified, name: dbName } = await check.json()
      if (!exists) { toast.error('No account found. Please sign up first.'); setView('signup'); setIsLoading(false); return }
      if (!emailVerified) { toast.error('Please verify your email before signing in.'); setIsLoading(false); return }
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.ok && !result?.error) { toast.success(`Welcome back, ${dbName || 'back'}! 👋`); window.location.href = '/dashboard' }
      else toast.error('Incorrect password. Please try again.')
    } catch { toast.error('Something went wrong. Please try again.') }
    finally { setIsLoading(false) }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePassword(password)) { toast.error('Password must be 8+ chars with letters, numbers & special characters'); return }
    setIsLoading(true)
    try {
      const res = await fetch('/api/authentication/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) })
      const data = await res.json()
      if (data.success) { toast.success(data.message); setView('verify'); setResendTimer(60) }
      else toast.error(data.error || 'Failed to create account')
    } catch { toast.error('Failed to create account') }
    finally { setIsLoading(false) }
  }

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/authentication/verify-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: verifyCode, email }) })
      const data = await res.json()
      if (data.success) {
        toast.success('Email verified! Signing you in...')
        const result = await signIn('credentials', { email, password, redirect: false })
        if (result?.ok) { window.location.href = '/dashboard' }
        else { toast.success('Account created! Please sign in.'); setView('signin') }
      } else toast.error(data.error || 'Invalid verification code')
    } catch { toast.error('Failed to verify code') }
    finally { setIsLoading(false) }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/authentication/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const data = await res.json()
      if (data.success) { toast.success('Verification code sent to your email!'); setView('reset'); setResendTimer(60) }
      else toast.error(data.error || 'Failed to send reset code')
    } catch { toast.error('Failed to send reset code') }
    finally { setIsLoading(false) }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePassword(newPassword)) { toast.error('Password must be 8+ chars with letters, numbers & special characters'); return }
    if (newPassword !== confirmNewPassword) { toast.error('Passwords do not match'); return }
    setIsLoading(true)
    try {
      const res = await fetch('/api/authentication/verify-reset-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: resetCode, email, password: newPassword }) })
      const data = await res.json()
      if (data.success) { toast.success('Password reset successfully!'); setView('signin'); setResetCode(''); setNewPassword(''); setConfirmNewPassword(''); setResendTimer(0) }
      else toast.error(data.error || 'Invalid verification code')
    } catch { toast.error('Failed to reset password') }
    finally { setIsLoading(false) }
  }

  const handleGoogleSignIn = async () => { setIsGoogleLoading(true); signIn('google', { callbackUrl: '/dashboard' }) }

  const goBack = () => { setView('signin'); setResetCode(''); setNewPassword(''); setConfirmNewPassword(''); setVerifyCode(''); setResendTimer(0) }

  const resendCode = async (endpoint: string) => {
    setIsLoading(true)
    try {
      await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      toast.success('Code resent!')
      setResendTimer(60)
    } catch { toast.error('Failed to resend code') }
    finally { setIsLoading(false) }
  }

  const titles: Record<View, { title: string; subtitle: string }> = {
    signin: { title: t('auth.welcomeBack'),    subtitle: t('auth.signInSubtitle') },
    signup: { title: t('auth.createAccount'),  subtitle: t('auth.signUpSubtitle') },
    verify: { title: t('auth.verifyEmail'),    subtitle: t('auth.verifySubtitle') },
    forgot: { title: t('auth.forgotPassword'), subtitle: t('auth.forgotSubtitle') },
    reset:  { title: t('auth.resetPassword'),  subtitle: t('auth.resetSubtitle') },
  }

  const ResendControl = ({ endpoint }: { endpoint: string }) => (
    resendTimer > 0
      ? <p className="text-xs text-gray-500 whitespace-nowrap">{t('auth.resendIn')} {resendTimer}s</p>
      : <button type="button" onClick={() => resendCode(endpoint)} className="text-xs text-blue-600 hover:underline whitespace-nowrap">{t('auth.resendCode')}</button>
  )

  const SignInSkeleton = () => (
    <div className="w-full max-w-sm space-y-4 animate-pulse">
      <div className="text-center mb-6 space-y-2">
        <div className="h-7 w-40 bg-neutral-200 dark:bg-neutral-700 rounded-md mx-auto" />
        <div className="h-4 w-56 bg-neutral-200 dark:bg-neutral-700 rounded-md mx-auto" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
        <div className="h-11 w-full bg-neutral-200 dark:bg-neutral-700 rounded-md" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
          <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
        </div>
        <div className="h-11 w-full bg-neutral-200 dark:bg-neutral-700 rounded-md" />
      </div>
      <div className="h-11 w-full bg-neutral-200 dark:bg-neutral-700 rounded-md" />
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
        <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
      </div>
      <div className="h-11 w-full bg-neutral-200 dark:bg-neutral-700 rounded-md" />
      <div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-700 rounded-md mx-auto" />
    </div>
  )

  return (
    <div className="min-h-screen flex">
     

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0"><FinanceScene /></div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-sm">
          {showSkeleton ? <SignInSkeleton /> : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={view} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.35, ease: 'easeOut' }}>

              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold mt-2">{titles[view].title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{titles[view].subtitle}</p>
              </div>

              {/* Sign In */}
              {view === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.emailAddress')}</Label>
                    <Input id="email" type="email" placeholder={t('auth.enterEmail')} value={email} onChange={e => setEmail(e.target.value)} className="h-11 text-sm" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">{t('auth.password')}</Label>
                      <button type="button" onClick={() => setView('forgot')} className="text-xs text-blue-600 hover:underline">{t('auth.forgotPasswordLink')}</button>
                    </div>
                    <div className="relative">
                      <Input id="password" autoComplete="off" type={showPassword ? 'text' : 'password'} placeholder={t('auth.enterPassword')} value={password} onChange={e => setPassword(e.target.value)} className="h-11 pr-10 text-sm" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <SubmitBtn loading={isLoading} label={t('auth.signIn')} loadingLabel={t('auth.signingIn')} disabled={!isValidEmail(email) || password.length < 1} />
                </form>
              )}

              {/* Sign Up */}
              {view === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('auth.fullName')}</Label>
                    <Input id="name" type="text" placeholder={t('auth.enterFullName')} value={name} onChange={e => setName(e.target.value)} className="h-11 text-sm" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-email">{t('auth.emailAddress')}</Label>
                    <Input id="su-email" type="email" placeholder={t('auth.enterEmail')} value={email} onChange={e => setEmail(e.target.value)} className="h-11 text-sm" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-password">{t('auth.password')}</Label>
                    <div className="relative">
                      <Input id="su-password" autoComplete="off" type={showPassword ? 'text' : 'password'} placeholder={t('auth.passwordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} className="h-11 pr-10 text-sm" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <SubmitBtn loading={isLoading} label={t('auth.createAccount')} loadingLabel={t('auth.creatingAccount')} disabled={!name.trim() || !isValidEmail(email) || !validatePassword(password)} />
                </form>
              )}

              {/* Verify Email */}
              {view === 'verify' && (
                <form onSubmit={handleVerifyEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('auth.verificationCode')}</Label>
                    <div className="flex items-center justify-between gap-3">
                      <InputOTP maxLength={6} value={verifyCode} onChange={setVerifyCode}>
                        <InputOTPGroup>
                          {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
                        </InputOTPGroup>
                      </InputOTP>
                      <ResendControl endpoint="/api/authentication/send-verification" />
                    </div>
                  </div>
                  <SubmitBtn loading={isLoading} label={t('auth.verifyEmailBtn')} loadingLabel={t('auth.verifying')} disabled={verifyCode.length !== 6} />
                </form>
              )}

              {/* Forgot Password */}
              {view === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fp-email">{t('auth.emailAddress')}</Label>
                    <Input id="fp-email" type="email" placeholder={t('auth.enterEmail')} value={email} onChange={e => setEmail(e.target.value)} className="h-11 text-sm" required />
                  </div>
                  <SubmitBtn loading={isLoading} label={t('auth.sendCode')} loadingLabel={t('auth.sending')} disabled={!isValidEmail(email)} />
                </form>
              )}

              {/* Reset Password */}
              {view === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('auth.verificationCode')}</Label>
                    <div className="flex items-center justify-between gap-3">
                      <InputOTP maxLength={6} value={resetCode} onChange={setResetCode}>
                        <InputOTPGroup>
                          {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
                        </InputOTPGroup>
                      </InputOTP>
                      <ResendControl endpoint="/api/authentication/forgot-password" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t('auth.newPassword')}</Label>
                    <div className="relative">
                      <Input id="newPassword" autoComplete="off" type={showNewPassword ? 'text' : 'password'} placeholder={t('auth.passwordPlaceholder')} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="h-11 pr-10 text-sm" required />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showNewPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                    <div className="relative">
                      <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder={t('auth.reEnterPassword')} value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="h-11 pr-10 text-sm" required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <SubmitBtn loading={isLoading} label={t('auth.resetPasswordBtn')} loadingLabel={t('auth.resetting')} disabled={resetCode.length !== 6 || !validatePassword(newPassword) || newPassword !== confirmNewPassword} />
                </form>
              )}

              {/* Back to Sign In */}
              {(view === 'forgot' || view === 'reset' || view === 'verify') && (
                <div className="text-center mt-4">
                  <Button type="button" onClick={goBack} className="text-primary hover:underline font-medium bg-transparent hover:bg-transparent p-0 cursor-pointer shadow-none">
                    {t('auth.backToSignIn')}
                  </Button>
                </div>
              )}

              {/* Google + toggle */}
              {(view === 'signin' || view === 'signup') && (
                <>
                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-3 text-muted-foreground font-medium">{t('auth.orContinueWith')}</span>
                    </div>
                  </div>
                  <Button onClick={handleGoogleSignIn} variant="outline" className="w-full h-11 font-medium text-sm border-2 hover:bg-gray-50 cursor-pointer" disabled={isGoogleLoading}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {isGoogleLoading ? t('auth.signingIn') : t('auth.continueWithGoogle')}
                  </Button>
                  <div className="text-center mt-4 text-sm text-muted-foreground">
                    {view === 'signin' ? t('auth.noAccount') : t('auth.alreadyHaveAccount')}{' '}
                    <Button type="button" onClick={() => setView(view === 'signin' ? 'signup' : 'signin')} className="text-primary hover:underline font-medium bg-transparent hover:bg-transparent p-0 cursor-pointer shadow-none">
                      {view === 'signin' ? t('auth.signUpHere') : t('auth.signInHere')}
                    </Button>
                  </div>
                </>
              )}

            </motion.div>
          </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
