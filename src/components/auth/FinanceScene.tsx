'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles, Trail, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// ── Floating credit card ──────────────────────────────────────────────────────
function CreditCard() {
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  // Canvas texture for card face
  const cardTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512; canvas.height = 320
    const ctx = canvas.getContext('2d')!

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 320)
    grad.addColorStop(0, '#1e1b4b')
    grad.addColorStop(0.5, '#312e81')
    grad.addColorStop(1, '#4c1d95')
    ctx.fillStyle = grad
    ctx.roundRect(0, 0, 512, 320, 24)
    ctx.fill()

    // Shine overlay
    const shine = ctx.createLinearGradient(0, 0, 300, 200)
    shine.addColorStop(0, 'rgba(255,255,255,0.08)')
    shine.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = shine
    ctx.roundRect(0, 0, 512, 320, 24)
    ctx.fill()

    // Chip
    ctx.fillStyle = '#f59e0b'
    ctx.roundRect(48, 90, 72, 54, 6)
    ctx.fill()
    ctx.strokeStyle = '#d97706'
    ctx.lineWidth = 1.5
    for (let i = 1; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(48, 90 + i * 18); ctx.lineTo(120, 90 + i * 18); ctx.stroke()
    }
    ctx.beginPath(); ctx.moveTo(84, 90); ctx.lineTo(84, 144); ctx.stroke()

    // Card number dots
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ;[100, 180, 260, 340].forEach(gx => {
      ;[0, 14].forEach(dx => {
        ctx.beginPath(); ctx.arc(gx + dx, 210, 5, 0, Math.PI * 2); ctx.fill()
      })
    })

    // FINANCE text
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.font = 'bold 28px system-ui'
    ctx.fillText('FINANCE', 48, 280)

    // Contactless arcs
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.lineWidth = 2.5
    ;[22, 34, 46].forEach(r => {
      ctx.beginPath()
      ctx.arc(420, 120, r, -Math.PI * 0.4, Math.PI * 0.4)
      ctx.stroke()
    })

    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    // Smooth mouse tracking
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.4, 0.05)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -pointer.y * 0.25, 0.05)
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.12
  })

  const cardMats = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: '#312e81', roughness: 0.3, metalness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: '#312e81', roughness: 0.3, metalness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: '#4c1d95', roughness: 0.3, metalness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: '#4c1d95', roughness: 0.3, metalness: 0.4 }),
    new THREE.MeshStandardMaterial({ map: cardTexture, roughness: 0.15, metalness: 0.5 }),
    new THREE.MeshStandardMaterial({ color: '#1e1b4b', roughness: 0.4, metalness: 0.3 }),
  ], [cardTexture])

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <mesh geometry={new THREE.BoxGeometry(3.2, 2, 0.1)} material={cardMats} castShadow />
      {/* Gold chip */}
      <mesh position={[-0.9, 0.28, 0.06]}>
        <boxGeometry args={[0.45, 0.34, 0.04]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  )
}

// ── Orbiting torus ring ───────────────────────────────────────────────────────
function OrbitRing({ radius, tube, speed, tiltX, tiltZ, color }: {
  radius: number; tube: number; speed: number; tiltX: number; tiltZ: number; color: string
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * speed
  })
  return (
    <mesh ref={ref} rotation={[tiltX, 0, tiltZ]}>
      <torusGeometry args={[radius, tube, 16, 120]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} transparent opacity={0.7} />
    </mesh>
  )
}

// ── Floating coin sphere ──────────────────────────────────────────────────────
function Coin({ position, color, speed, delay }: {
  position: [number, number, number]; color: string; speed: number; delay: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + delay
    ref.current.rotation.y = t * speed
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.3
    ref.current.position.y = position[1] + Math.sin(t * 0.9) * 0.15
  })
  return (
    <mesh ref={ref} position={position} castShadow>
      <cylinderGeometry args={[0.22, 0.22, 0.06, 40]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.85} />
    </mesh>
  )
}

// ── Glowing core sphere ───────────────────────────────────────────────────────
function GlowSphere() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = state.clock.elapsedTime * 0.15
    ref.current.rotation.y = state.clock.elapsedTime * 0.22
  })
  return (
    <mesh ref={ref} position={[0, 0, -1.5]}>
      <sphereGeometry args={[1.1, 64, 64]} />
      <MeshDistortMaterial
        color="#6366f1"
        emissive="#4338ca"
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.3}
        distort={0.35}
        speed={1.5}
        transparent
        opacity={0.25}
      />
    </mesh>
  )
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={2.5} color="#ffffff" castShadow />
      <directionalLight position={[-4, -2, 3]} intensity={1.5} color="#a78bfa" />
      <pointLight position={[0, 0, 3]} intensity={2} color="#6366f1" distance={8} />
      <pointLight position={[3, 2, 1]} intensity={1} color="#38bdf8" distance={6} />

      <GlowSphere />

      {/* Orbit rings */}
      <OrbitRing radius={2.2} tube={0.025} speed={0.4}  tiltX={0.5}  tiltZ={0.1}  color="#a78bfa" />
      <OrbitRing radius={2.8} tube={0.018} speed={-0.28} tiltX={0.2}  tiltZ={0.55} color="#38bdf8" />
      <OrbitRing radius={3.3} tube={0.014} speed={0.18}  tiltX={1.1}  tiltZ={0.3}  color="#6366f1" />

      {/* Credit card with Float wrapper for extra bounce */}
      <Float speed={1.4} rotationIntensity={0} floatIntensity={0.3}>
        <CreditCard />
      </Float>

      {/* Floating coins */}
      <Coin position={[-2.6,  1.2,  0.3]} color="#f59e0b" speed={1.4} delay={0}   />
      <Coin position={[ 2.5,  0.8,  0.5]} color="#a78bfa" speed={0.9} delay={1.2} />
      <Coin position={[ 0.4,  2.4, -0.2]} color="#38bdf8" speed={1.7} delay={0.6} />
      <Coin position={[-1.8, -1.0,  0.7]} color="#34d399" speed={1.1} delay={2.0} />
      <Coin position={[ 2.0, -0.8,  0.4]} color="#f472b6" speed={0.7} delay={0.4} />

      {/* Sparkle particles from Drei */}
      <Sparkles
        count={120}
        scale={8}
        size={1.2}
        speed={0.3}
        opacity={0.6}
        color="#a78bfa"
      />
      <Sparkles
        count={60}
        scale={6}
        size={0.8}
        speed={0.5}
        opacity={0.4}
        color="#38bdf8"
      />
    </>
  )
}

// ── Export ────────────────────────────────────────────────────────────────────
export function FinanceScene() {
  return (
    <div className="relative w-full h-full bg-[#06040f]">

      {/* Grid lines matching hero */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%)',
        }}
      />

      {/* Accent glow */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, color-mix(in srgb, var(--app-accent) 22%, transparent) 0%, transparent 60%)' }}
      />

      <Canvas
        camera={{ position: [0, 0, 7], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Scene />
      </Canvas>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-9 pointer-events-none">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5"
        >
          <img src="/svg/logo.svg" alt="Finance" className="w-8 h-8 object-contain" />
          <span className="text-lg font-bold text-white tracking-tight">Finance</span>
        </motion.div>

        {/* Bottom */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--app-accent)' }}>
              AI-Powered Finance
            </p>
            <h2 className="text-2xl font-bold text-white leading-snug">
              Track, budget &<br />grow smarter.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-2"
          >
            {['📊 Analytics', '💳 Budgeting', '🔒 Secure', '⚡ Real-time'].map((f, i) => (
              <motion.span
                key={f}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.08 }}
                className="text-[11px] text-white/70 bg-white/8 border border-white/12 backdrop-blur-sm rounded-full px-3 py-1"
              >
                {f}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-white/30 text-[11px]"
          >
            Trusted by 50,000+ users worldwide
          </motion.p>
        </div>
      </div>
    </div>
  )
}
