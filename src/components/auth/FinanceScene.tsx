'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function FinanceScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current!
    const w = mount.clientWidth || 600
    const h = mount.clientHeight || 800

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    mount.appendChild(renderer.domElement)

    // ── Scene / Camera ──
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.set(0, 0, 7)

    // ── Lights — bright so colors show ──
    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    const d1 = new THREE.DirectionalLight(0xffffff, 2)
    d1.position.set(5, 8, 5)
    scene.add(d1)
    const d2 = new THREE.DirectionalLight(0xa78bfa, 1.2)
    d2.position.set(-5, -3, 3)
    scene.add(d2)
    const d3 = new THREE.DirectionalLight(0x38bdf8, 0.8)
    d3.position.set(0, -5, 4)
    scene.add(d3)

    // ── Material helpers ──
    const phong = (color: number, emissive = 0x000000, shininess = 80) =>
      new THREE.MeshPhongMaterial({ color, emissive, shininess })

    const basic = (color: number) => new THREE.MeshBasicMaterial({ color })

    // ── Canvas texture helper ──
    const canvasTex = (draw: (ctx: CanvasRenderingContext2D, s: number) => void, size = 256) => {
      const c = document.createElement('canvas')
      c.width = size; c.height = size
      const ctx = c.getContext('2d')!
      draw(ctx, size)
      return new THREE.CanvasTexture(c)
    }

    // ── Glow Sphere ──
    const sphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.3, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x6366f1, emissive: 0x4338ca, transparent: true, opacity: 0.22, shininess: 30 })
    )
    sphereMesh.position.set(0, 0.3, -1.2)
    scene.add(sphereMesh)

    // ── Orbit Rings ──
    const ringDefs = [
      { r: 1.7, tube: 0.045, color: 0xa78bfa, emissive: 0x7c3aed, opacity: 0.8, sx: 0.35, sz: 0.18 },
      { r: 2.15, tube: 0.03, color: 0x38bdf8, emissive: 0x0284c7, opacity: 0.7, sx: 0.12, sz: 0.28 },
    ]
    const rings = ringDefs.map(({ r, tube, color, emissive, opacity, sx, sz }) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(r, tube, 16, 100),
        new THREE.MeshPhongMaterial({ color, emissive, shininess: 100, transparent: true, opacity })
      )
      mesh.position.set(0, 0.3, -0.5)
      scene.add(mesh)
      return { mesh, sx, sz }
    })

    // ── Credit Card ──
    const cardGroup = new THREE.Group()
    scene.add(cardGroup)

    // Card front face — gradient canvas texture
    const cardFaceTex = canvasTex((ctx, s) => {
      const grad = ctx.createLinearGradient(0, 0, s, s)
      grad.addColorStop(0, '#312e81')
      grad.addColorStop(0.5, '#4f46e5')
      grad.addColorStop(1, '#7c3aed')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, s, s)
      // subtle shine
      const shine = ctx.createLinearGradient(0, 0, s * 0.6, s * 0.4)
      shine.addColorStop(0, 'rgba(255,255,255,0.12)')
      shine.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = shine
      ctx.fillRect(0, 0, s, s)
    })

    // Card back face — dark stripe
    const cardBackTex = canvasTex((ctx, s) => {
      ctx.fillStyle = '#1e1b4b'
      ctx.fillRect(0, 0, s, s)
      ctx.fillStyle = '#111827'
      ctx.fillRect(0, s * 0.3, s, s * 0.22)
    })

    // Per-face materials
    const cardMats = [
      new THREE.MeshPhongMaterial({ color: 0x4f46e5, emissive: 0x312e81, shininess: 60 }), // right
      new THREE.MeshPhongMaterial({ color: 0x4f46e5, emissive: 0x312e81, shininess: 60 }), // left
      new THREE.MeshPhongMaterial({ color: 0x6366f1, emissive: 0x4338ca, shininess: 60 }), // top
      new THREE.MeshPhongMaterial({ color: 0x6366f1, emissive: 0x4338ca, shininess: 60 }), // bottom
      new THREE.MeshPhongMaterial({ map: cardFaceTex, shininess: 80 }),                    // front
      new THREE.MeshPhongMaterial({ map: cardBackTex, shininess: 40 }),                    // back
    ]
    const cardBody = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.35, 0.08), cardMats)
    cardGroup.add(cardBody)

    // Gold chip
    const chip = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.28, 0.05),
      new THREE.MeshPhongMaterial({ color: 0xf59e0b, emissive: 0xb45309, shininess: 120 })
    )
    chip.position.set(-0.6, 0.2, 0.065)
    cardGroup.add(chip)

    // Chip grid lines
    ;[-0.07, 0, 0.07].forEach((y) => {
      const l = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.013, 0.01),
        new THREE.MeshPhongMaterial({ color: 0xd97706, emissive: 0x92400e })
      )
      l.position.set(-0.6, 0.2 + y, 0.095)
      cardGroup.add(l)
    })
    ;[-0.1, 0.1].forEach((x) => {
      const l = new THREE.Mesh(
        new THREE.BoxGeometry(0.013, 0.26, 0.01),
        new THREE.MeshPhongMaterial({ color: 0xd97706, emissive: 0x92400e })
      )
      l.position.set(-0.6 + x, 0.2, 0.095)
      cardGroup.add(l)
    })

    // Card number dots (4 groups of 4)
    const dotColors = [0xa5b4fc, 0x818cf8, 0xa5b4fc, 0x818cf8]
    ;[-0.72, -0.24, 0.24, 0.72].forEach((gx, gi) => {
      ;[-0.04, 0.04].forEach((dx) => {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.035, 8, 8),
          new THREE.MeshPhongMaterial({ color: dotColors[gi], emissive: 0x4338ca, shininess: 80 })
        )
        dot.position.set(gx + dx, -0.2, 0.065)
        cardGroup.add(dot)
      })
    })

    // Contactless arcs
    ;[0.17, 0.26, 0.35].forEach((r, i) => {
      const arc = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.014, 8, 24, Math.PI * 0.65),
        new THREE.MeshPhongMaterial({ color: 0x818cf8, emissive: 0x6366f1, shininess: 100, transparent: true, opacity: 0.9 - i * 0.2 })
      )
      arc.position.set(0.78, 0.2, 0.065)
      arc.rotation.z = -Math.PI * 0.18
      cardGroup.add(arc)
    })

    // ₹ on card front
    const rupeeCardTex = canvasTex((ctx, s) => {
      ctx.clearRect(0, 0, s, s)
      ctx.fillStyle = '#a5b4fc'
      ctx.font = `bold ${s * 0.7}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('₹', s / 2, s / 2)
    })
    const rupeeOnCard = new THREE.Mesh(
      new THREE.PlaneGeometry(0.35, 0.35),
      new THREE.MeshBasicMaterial({ map: rupeeCardTex, transparent: true })
    )
    rupeeOnCard.position.set(0.72, 0.22, 0.07)
    cardGroup.add(rupeeOnCard)

    cardGroup.position.set(0, 0.6, 0)

    // ── Rupee Coins ──
    const makeRupeeCoinTex = (coinColor: string) => canvasTex((ctx, s) => {
      // coin face gradient
      const grad = ctx.createRadialGradient(s * 0.4, s * 0.35, s * 0.05, s / 2, s / 2, s * 0.5)
      grad.addColorStop(0, '#ffffff')
      grad.addColorStop(0.4, coinColor)
      grad.addColorStop(1, '#00000066')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(s / 2, s / 2, s * 0.48, 0, Math.PI * 2)
      ctx.fill()
      // ₹ symbol
      ctx.fillStyle = '#ffffff'
      ctx.font = `bold ${s * 0.52}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('₹', s / 2, s / 2)
    })

    const coinConfigs = [
      { pos: [-2.0, 1.4, 0.2] as [number,number,number], speed: 1.3, color: 0x6366f1, hex: '#6366f1', delay: 0 },
      { pos: [2.0, 1.0, 0.4] as [number,number,number], speed: 0.9, color: 0xa78bfa, hex: '#a78bfa', delay: 1.2 },
      { pos: [0.3, 2.3, -0.3] as [number,number,number], speed: 1.6, color: 0x38bdf8, hex: '#38bdf8', delay: 0.6 },
      { pos: [-1.4, -0.5, 0.6] as [number,number,number], speed: 1.1, color: 0xfbbf24, hex: '#fbbf24', delay: 2.0 },
      { pos: [1.5, -0.3, 0.5] as [number,number,number], speed: 0.7, color: 0x34d399, hex: '#34d399', delay: 0.3 },
    ]

    const coins = coinConfigs.map(({ pos, speed, color, hex, delay }) => {
      const group = new THREE.Group()
      group.position.set(...pos)

      // Disc
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.08, 40),
        new THREE.MeshPhongMaterial({ color, emissive: new THREE.Color(color).multiplyScalar(0.4), shininess: 120 })
      )
      group.add(disc)

      // Gold rim
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.32, 0.028, 8, 40),
        new THREE.MeshPhongMaterial({ color: 0xfbbf24, emissive: 0xb45309, shininess: 150 })
      )
      rim.rotation.x = Math.PI / 2
      group.add(rim)

      // ₹ face (top)
      const face = new THREE.Mesh(
        new THREE.CircleGeometry(0.28, 32),
        new THREE.MeshBasicMaterial({ map: makeRupeeCoinTex(hex), transparent: true })
      )
      face.rotation.x = -Math.PI / 2
      face.position.y = 0.042
      group.add(face)

      // ₹ face (bottom mirror)
      const faceB = face.clone()
      faceB.rotation.x = Math.PI / 2
      faceB.position.y = -0.042
      group.add(faceB)

      scene.add(group)
      return { group, speed, delay, baseY: pos[1] }
    })

    // ── Bar Chart ──
    const barGroup = new THREE.Group()
    barGroup.position.set(0, -1.5, 0)
    scene.add(barGroup)

    const barDefs = [
      { h: 0.55, x: -1.1, color: 0x818cf8, emissive: 0x4338ca },
      { h: 0.95, x: -0.55, color: 0x6366f1, emissive: 0x4338ca },
      { h: 0.72, x: 0,    color: 0xa78bfa, emissive: 0x7c3aed },
      { h: 1.2,  x: 0.55, color: 0x38bdf8, emissive: 0x0284c7 },
      { h: 0.85, x: 1.1,  color: 0x34d399, emissive: 0x059669 },
    ]
    barDefs.forEach(({ h, x, color, emissive }) => {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, h, 0.3),
        new THREE.MeshPhongMaterial({ color, emissive, shininess: 60 })
      )
      bar.position.set(x, h / 2, 0)
      barGroup.add(bar)
    })

    // ── Floating particles ──
    const particleGeo = new THREE.BufferGeometry()
    const count = 80
    const positions = new Float32Array(count * 3)
    const pColors = new Float32Array(count * 3)
    const palette = [
      new THREE.Color(0x6366f1), new THREE.Color(0xa78bfa),
      new THREE.Color(0x38bdf8), new THREE.Color(0xfbbf24), new THREE.Color(0x34d399),
    ]
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
      const c = palette[Math.floor(Math.random() * palette.length)]
      pColors[i * 3] = c.r; pColors[i * 3 + 1] = c.g; pColors[i * 3 + 2] = c.b
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3))
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.8 })
    )
    scene.add(particles)

    // ── Resize ──
    const onResize = () => {
      const nw = mount.clientWidth, nh = mount.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    // ── Animation Loop ──
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      sphereMesh.rotation.x = t * 0.18
      sphereMesh.rotation.y = t * 0.25

      rings.forEach(({ mesh, sx, sz }) => {
        mesh.rotation.x = t * sx
        mesh.rotation.z = t * sz
      })

      cardGroup.rotation.y = t * 0.8
      cardGroup.position.y = Math.sin(t * 0.6) * 0.15 + 0.6

      coins.forEach(({ group, speed, delay, baseY }) => {
        const ct = t + delay
        group.rotation.y = ct * speed
        group.rotation.x = Math.sin(ct * 0.5) * 0.25
        group.position.y = baseY + Math.sin(ct * 1.2) * 0.18
      })

      barGroup.rotation.y = Math.sin(t * 0.25) * 0.18

      particles.rotation.y = t * 0.04
      particles.rotation.x = t * 0.02

      scene.rotation.y = Math.sin(t * 0.1) * 0.08

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="w-full h-full" />
}
