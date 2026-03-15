'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

const FinanceScene = dynamic(() => import('@/components/auth/FinanceScene').then(m => m.FinanceScene), { ssr: false, loading: () => null })

type View = 'signin' | 'signup' | 'verify' | 'forgot' | 'reset'

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
)

const SubmitBtn = ({ loading, label, loadingLabel, disabled }: { loading: boolean; label: string; loadingLabel: string; disabled?: boolean }) => (
  <button type="submit" disabled={loading || disabled} className="w-full h-11 font-medium text-sm rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:from-blue-700 enabled:hover:to-purple-700 enabled:cursor-pointer">
    {loading && <Spinner />}
    {loading ? loadingLabel : label}
  </button>
)

function validatePassword(p: string) {
  return p.length >= 8 && /[a-zA-Z]/.test(p) && /\d/.test(p) && /[!@#$%^&*(),.?":{}|<>]/.test(p)
}

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
}

export default function SignInPage() {
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
  const { status } = useSession()
  const router = useRouter()
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowSkeleton(false), 1000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') router.push('/dashboard')
  }, [status, router])

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])


  if (status === 'authenticated') return null

  // ── Handlers ──────────────────────────────────────────────────────────────

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

      if (!exists) {
        toast.error('No account found. Please sign up first.')
        setView('signup')
        setIsLoading(false)
        return
      }

      if (!emailVerified) {
        toast.error('Please verify your email before signing in.')
        setIsLoading(false)
        return
      }

      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.ok) {
        toast.success(`Welcome back, ${dbName || 'back'}! 👋`)
        router.push('/dashboard')
      } else {
        toast.error('Incorrect password. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePassword(password)) {
      toast.error('Password must be 8+ chars with letters, numbers & special characters')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/authentication/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setView('verify')
        setResendTimer(60)
      } else {
        toast.error(data.error || 'Failed to create account')
      }
    } catch {
      toast.error('Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/authentication/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verifyCode, email }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Email verified! Signing you in...')
        const result = await signIn('credentials', { email, password, redirect: false })
        if (result?.ok) {
          router.push('/dashboard')
        } else {
          toast.success('Account created! Please sign in.')
          setView('signin')
        }
      } else {
        toast.error(data.error || 'Invalid verification code')
      }
    } catch {
      toast.error('Failed to verify code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/authentication/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Verification code sent to your email!')
        setView('reset')
        setResendTimer(60)
      } else {
        toast.error(data.error || 'Failed to send reset code')
      }
    } catch {
      toast.error('Failed to send reset code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePassword(newPassword)) {
      toast.error('Password must be 8+ chars with letters, numbers & special characters')
      return
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/authentication/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: resetCode, email, password: newPassword }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Password reset successfully!')
        setView('signin')
        setResetCode('')
        setNewPassword('')
        setConfirmNewPassword('')
        setResendTimer(0)
      } else {
        toast.error(data.error || 'Invalid verification code')
      }
    } catch {
      toast.error('Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  const goBack = () => {
    setView('signin')
    setResetCode('')
    setNewPassword('')
    setConfirmNewPassword('')
    setVerifyCode('')
    setResendTimer(0)
  }

  const resendCode = async (endpoint: string) => {
    setIsLoading(true)
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      toast.success('Code resent!')
      setResendTimer(60)
    } catch {
      toast.error('Failed to resend code')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Titles ─────────────────────────────────────────────────────────────────
  const titles: Record<View, { title: string; subtitle: string }> = {
    signin:  { title: 'Welcome Back!',     subtitle: 'Sign in to your Finance account' },
    signup:  { title: 'Create Account',    subtitle: 'Sign up to get started' },
    verify:  { title: 'Verify Email',      subtitle: 'Enter the code sent to your email' },
    forgot:  { title: 'Forgot Password',   subtitle: 'Enter your email to reset password' },
    reset:   { title: 'Reset Password',    subtitle: 'Enter code and new password' },
  }

  const ResendControl = ({ endpoint }: { endpoint: string }) => (
    resendTimer > 0
      ? <p className="text-xs text-gray-500 whitespace-nowrap">Resend in {resendTimer}s</p>
      : <button type="button" onClick={() => resendCode(endpoint)} className="text-xs text-blue-600 hover:underline whitespace-nowrap">Resend Code</button>
  )

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm scale-105" style={{ backgroundImage: "url('/Images/hero.jpeg')" }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0"><FinanceScene /></div>
        <div className="absolute inset-0 flex flex-col justify-between p-10 pointer-events-none z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-3">
            <img src="/Images/logo.png" alt="Finance" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold text-white tracking-tight">Finance</span>
          </motion.div>
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="flex gap-3">
              {[['Total Savings', '+$12,450', 'text-green-400'], ['Monthly Budget', '$3,200', 'text-blue-400'], ['Expenses', '-$1,840', 'text-rose-400']].map(([label, val, cls]) => (
                <div key={label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 shadow-xl">
                  <p className="text-xs text-white/70">{label}</p>
                  <p className={`text-lg font-bold ${cls}`}>{val}</p>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1 }} className="flex flex-wrap gap-2">
              {['📊 Analytics', '💳 Budgeting', '🔒 Secure', '⚡ Real-time'].map((f, i) => (
                <motion.span key={f} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 + i * 0.1 }} className="text-xs text-white/80 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-3 py-1">{f}</motion.span>
              ))}
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-white/50 text-xs">
              Join thousands managing their finances smarter every day.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-sm">
          {(showSkeleton || status === 'loading') ? (
            <div className="animate-pulse">
              <div className="h-7 bg-gray-200 rounded-lg w-36 mx-auto mb-2" />
              <div className="h-4 bg-gray-200 rounded w-52 mx-auto mb-6" />
              <div className="h-3.5 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-11 bg-gray-200 rounded-md mb-4" />
              <div className="flex justify-between items-center mb-2">
                <div className="h-3.5 bg-gray-200 rounded w-16" />
                <div className="h-3.5 bg-gray-200 rounded w-24" />
              </div>
              <div className="h-11 bg-gray-200 rounded-md mb-4" />
              <div className="h-11 bg-gray-200 rounded-md mb-5" />
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <div className="h-3 bg-gray-200 rounded w-28" />
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="h-11 bg-gray-200 rounded-md mb-4" />
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
            </div>
          ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={view} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.35, ease: 'easeOut' }}>

              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold mt-2">{titles[view].title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{titles[view].subtitle}</p>
              </div>

              {/* ── Sign In ── */}
              {view === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="h-11 text-sm" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Password</Label>
                      <button type="button" onClick={() => setView('forgot')} className="text-xs text-blue-600 hover:underline">Forgot Password?</button>
                    </div>
                    <div className="relative">
                      <Input id="password" autoComplete="off" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className="h-11 pr-10 text-sm" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <SubmitBtn loading={isLoading} label="Sign In" loadingLabel="Signing In..." disabled={!isValidEmail(email) || password.length < 1} />
                </form>
              )}

              {/* ── Sign Up ── */}
              {view === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} className="h-11 text-sm" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-email">Email address</Label>
                    <Input id="su-email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="h-11 text-sm" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-password">Password</Label>
                    <div className="relative">
                      <Input id="su-password" autoComplete="off" type={showPassword ? 'text' : 'password'} placeholder="8+ chars, letters, numbers, symbols" value={password} onChange={e => setPassword(e.target.value)} className="h-11 pr-10 text-sm" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <SubmitBtn loading={isLoading} label="Create Account" loadingLabel="Creating Account..." disabled={!name.trim() || !isValidEmail(email) || !validatePassword(password)} />
                </form>
              )}

              {/* ── Verify Email ── */}
              {view === 'verify' && (
                <form onSubmit={handleVerifyEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Verification Code</Label>
                    <div className="flex items-center justify-between gap-3">
                      <InputOTP maxLength={6} value={verifyCode} onChange={setVerifyCode}>
                        <InputOTPGroup>
                          {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
                        </InputOTPGroup>
                      </InputOTP>
                      <ResendControl endpoint="/api/authentication/send-verification" />
                    </div>
                  </div>
                  <SubmitBtn loading={isLoading} label="Verify Email" loadingLabel="Verifying..." disabled={verifyCode.length !== 6} />
                </form>
              )}

              {/* ── Forgot Password ── */}
              {view === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fp-email">Email address</Label>
                    <Input id="fp-email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="h-11 text-sm" required />
                  </div>
                  <SubmitBtn loading={isLoading} label="Send Code" loadingLabel="Sending..." disabled={!isValidEmail(email)} />
                </form>
              )}

              {/* ── Reset Password ── */}
              {view === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Verification Code</Label>
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
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input id="newPassword" autoComplete="off" type={showNewPassword ? 'text' : 'password'} placeholder="8+ chars, letters, numbers, symbols" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="h-11 pr-10 text-sm" required />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showNewPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="h-11 pr-10 text-sm" required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <SubmitBtn loading={isLoading} label="Reset Password" loadingLabel="Resetting..." disabled={resetCode.length !== 6 || !validatePassword(newPassword) || newPassword !== confirmNewPassword} />
                </form>
              )}

              {/* Back to Sign In */}
              {(view === 'forgot' || view === 'reset' || view === 'verify') && (
                <div className="text-center mt-4">
                  <Button type="button" onClick={goBack} className="text-primary hover:underline font-medium bg-transparent hover:bg-transparent p-0 cursor-pointer shadow-none">
                    Back to Sign In
                  </Button>
                </div>
              )}

              {/* Google + toggle signin/signup */}
              {(view === 'signin' || view === 'signup') && (
                <>
                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-3 text-muted-foreground font-medium">Or continue with</span>
                    </div>
                  </div>
                  <Button onClick={handleGoogleSignIn} variant="outline" className="w-full h-11 font-medium text-sm border-2 hover:bg-gray-50 cursor-pointer" disabled={isGoogleLoading}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {isGoogleLoading ? 'Signing In...' : 'Continue with Google'}
                  </Button>
                  <div className="text-center mt-4 text-sm text-muted-foreground">
                    {view === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <Button type="button" onClick={() => setView(view === 'signin' ? 'signup' : 'signin')} className="text-primary hover:underline font-medium bg-transparent hover:bg-transparent p-0 cursor-pointer shadow-none">
                      {view === 'signin' ? 'Sign up here' : 'Sign in here'}
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
