'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const floatingParticles = [
  { size: 6,  x: '10%', delay: 0,    duration: 3.2 },
  { size: 4,  x: '20%', delay: 0.5,  duration: 2.8 },
  { size: 8,  x: '35%', delay: 1.1,  duration: 3.6 },
  { size: 5,  x: '55%', delay: 0.3,  duration: 2.5 },
  { size: 7,  x: '70%', delay: 0.8,  duration: 3.0 },
  { size: 4,  x: '82%', delay: 1.4,  duration: 2.7 },
  { size: 6,  x: '92%', delay: 0.2,  duration: 3.4 },
];

export default function NotFound() {
  const router = useRouter();
  const [backHovered, setBackHovered] = useState(false);
  const [homeHovered, setHomeHovered] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 overflow-hidden px-4">

      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: 'var(--app-accent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-[0.07] blur-3xl"
          style={{ background: 'var(--app-accent)' }} />
      </div>

      {/* Floating particles */}
      {floatingParticles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 rounded-full opacity-20 dark:opacity-10"
          style={{ width: p.size, height: p.size, left: p.x, background: 'var(--app-accent)' }}
          animate={{ y: [0, -120, -240], opacity: [0, 0.3, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        {/* 404 row with ghost */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-6">
          <motion.span
            className="text-[90px] md:text-[140px] font-black leading-none select-none"
            style={{ color: 'var(--app-accent)', opacity: 0.15 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 0.15, x: 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            4
          </motion.span>

          {/* Ghost with glow ring */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            {/* Glow ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 140, height: 140,
                background: 'radial-gradient(circle, var(--app-accent) 0%, transparent 70%)',
                opacity: 0.15,
              }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Ghost image */}
            <motion.div
              animate={{ y: [-8, 8] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              whileHover={{ scale: 1.12, rotate: [0, -6, 6, -6, 0], transition: { duration: 0.6 } }}
              className="cursor-pointer"
            >
              <Image
                src="/Group.png"
                alt="Ghost"
                width={160}
                height={160}
                className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] object-contain select-none drop-shadow-2xl"
                draggable="false"
                priority
              />
            </motion.div>
          </motion.div>

          <motion.span
            className="text-[90px] md:text-[140px] font-black leading-none select-none"
            style={{ color: 'var(--app-accent)', opacity: 0.15 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 0.15, x: 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            4
          </motion.span>
        </div>

        {/* Badge */}
        <motion.div
          className="mb-5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border"
          style={{ color: 'var(--app-accent)', borderColor: 'var(--app-accent)', background: 'color-mix(in srgb, var(--app-accent) 8%, transparent)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          Page Not Found
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-3 select-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          Boo! You&apos;re lost.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base md:text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-sm select-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          This page vanished into thin air — just like a ghost. Let&apos;s get you back on track.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <button
            onClick={() => router.back()}
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none"
          >
            <motion.span
              className="inline-flex"
              animate={{ x: backHovered ? -4 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.span>
            Go Back
          </button>
          <Link href="/">
            <button
              onMouseEnter={() => setHomeHovered(true)}
              onMouseLeave={() => setHomeHovered(false)}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white select-none cursor-pointer"
              style={{
                background: 'linear-gradient(to bottom, color-mix(in srgb, var(--app-accent) 80%, white), color-mix(in srgb, var(--app-accent) 72%, black))',
                boxShadow: '0 0 24px color-mix(in srgb, var(--app-accent) 33%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              Go Home
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}