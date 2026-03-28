"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const NODES = [
  { id: "root",     fx: 0.50, fy: 0.86, label: "Finance Tracker", icon: "/svg/logo.svg", isRoot: true },
  { id: "j1L",      fx: 0.32, fy: 0.66, isJunction: true },
  { id: "j1R",      fx: 0.68, fy: 0.66, isJunction: true },
  { id: "j2LL",     fx: 0.15, fy: 0.47, isJunction: true },
  { id: "j2LR",     fx: 0.43, fy: 0.43, isJunction: true },
  { id: "j2RL",     fx: 0.57, fy: 0.43, isJunction: true },
  { id: "j2RR",     fx: 0.85, fy: 0.47, isJunction: true },
  { id: "nextjs",   fx: 0.06, fy: 0.25, label: "Next.js",   icon: "/icons/Nextjs.png" },
  { id: "openai",   fx: 0.17, fy: 0.13, label: "OpenAI",    icon: "/icons/OpenAI.jpg" },
  { id: "tailwind", fx: 0.28, fy: 0.25, label: "Tailwind",  icon: "/icons/TailwindCss.png" },
  { id: "shadcn",   fx: 0.37, fy: 0.13, label: "Shadcn",    icon: "/icons/Shadcn.png" },
  { id: "framer",   fx: 0.46, fy: 0.23, label: "Framer",    icon: "/icons/FramerMotion.png" },
  { id: "r3f",      fx: 0.54, fy: 0.23, label: "R3F",       icon: "/icons/ReactThreeFiber.png" },
  { id: "recharts", fx: 0.63, fy: 0.13, label: "Recharts",  icon: "/icons/Rechart.jpeg" },
  { id: "nextauth", fx: 0.72, fy: 0.25, label: "NextAuth",  icon: "/icons/NextAuth.png" },
  { id: "intl",     fx: 0.05, fy: 0.50, label: "next-intl", icon: "/icons/NextIntl.png" },
  { id: "prisma",   fx: 0.94, fy: 0.25, label: "Prisma",    icon: "/icons/Prisma.png" },
  { id: "mongodb",  fx: 0.83, fy: 0.13, label: "MongoDB",   icon: "/icons/Mongodb.png" },
  { id: "vercel",   fx: 0.95, fy: 0.50, label: "Vercel",    icon: "/icons/Vercel.png" },
];

const EDGES: [string, string][] = [
  ["j1L", "root"], ["j1R", "root"],
  ["j2LL", "j1L"], ["j2LR", "j1L"], ["j2RL", "j1R"], ["j2RR", "j1R"],
  ["nextjs", "j2LL"], ["openai", "j2LL"], ["tailwind", "j2LL"],
  ["shadcn", "j2LR"], ["framer", "j2LR"],
  ["r3f", "j2RL"], ["recharts", "j2RL"],
  ["nextauth", "j2RR"], ["mongodb", "j2RR"], ["prisma", "j2RR"],
  ["intl", "j1L"], ["vercel", "j1R"],
];

function elbowPath(ax: number, ay: number, bx: number, by: number) {
  const midY = ay + (by - ay) * 0.5;
  return `M ${ax} ${ay} C ${ax} ${midY}, ${bx} ${midY}, ${bx} ${by}`;
}

export default function TechCircuit() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => {
      if (ref.current) setSize({ w: ref.current.offsetWidth, h: ref.current.offsetHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const { w: W, h: H } = size;
  const ready = W > 0 && H > 0;

  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));
  const cx = (n: typeof NODES[0]) => n.fx * W;
  const cy = (n: typeof NODES[0]) => n.fy * H;

  // Node box size in px
  const BOX = Math.max(36, Math.min(48, W * 0.055));
  const ROOT_BOX = BOX * 1.7;

  return (
    <div ref={ref} className="relative w-full select-none" style={{ height: "min(620px, 96vw)" }}>
      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <pattern id="dotgrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" className="fill-neutral-300 dark:fill-neutral-700" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
      </svg>

      {ready && (
        <svg
          className="absolute inset-0"
          width={W} height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="nodeglow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ── Edges ── */}
          {EDGES.map(([childId, parentId], i) => {
            const child = nodeMap[childId];
            const parent = nodeMap[parentId];
            const d = elbowPath(cx(child), cy(child), cx(parent), cy(parent));
            return (
              <g key={i}>
                <motion.path
                  d={d} fill="none"
                  stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round"
                  opacity={0.5}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: i * 0.04, ease: "easeOut" }}
                />
                <circle r="3.5" fill="var(--app-accent)" filter="url(#glow)">
                  <animateMotion
                    dur={`${1.6 + (i % 5) * 0.35}s`}
                    begin={`${i * 0.2}s`}
                    repeatCount="indefinite"
                    path={d}
                  />
                </circle>
              </g>
            );
          })}

          {/* ── Junction dots ── */}
          {NODES.filter(n => n.isJunction).map(n => (
            <motion.circle
              key={n.id}
              cx={cx(n)} cy={cy(n)} r={5}
              fill="var(--app-accent)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.85 }}
              transition={{ delay: 0.4 }}
              style={{ transformOrigin: `${cx(n)}px ${cy(n)}px` }}
            />
          ))}

          {/* ── Root node ── */}
          {(() => {
            const root = nodeMap["root"];
            const x = cx(root) - ROOT_BOX / 2;
            const y = cy(root) - ROOT_BOX / 2;
            return (
              <motion.g
                key="root"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 160 }}
                style={{ transformOrigin: `${cx(root)}px ${cy(root)}px` }}
              >
                {/* Glow ring */}
                <rect
                  x={x - 5} y={y - 5}
                  width={ROOT_BOX + 10} height={ROOT_BOX + 10}
                  rx={18} ry={18}
                  fill="none"
                  stroke="var(--app-accent)"
                  strokeWidth="1"
                  opacity={0.25}
                  filter="url(#nodeglow)"
                />
                {/* Box */}
                <rect
                  x={x} y={y}
                  width={ROOT_BOX} height={ROOT_BOX}
                  rx={14} ry={14}
                  fill="#ffffff"
                  stroke="var(--app-accent)"
                  strokeWidth="2"
                />
                <foreignObject x={x + 4} y={y + 4} width={ROOT_BOX - 8} height={ROOT_BOX - 8}>
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Image src="/svg/logo.svg" alt="App" width={ROOT_BOX - 16} height={ROOT_BOX - 16} style={{ objectFit: "contain", borderRadius: 10 }} />
                  </div>
                </foreignObject>
                {/* Label */}
                <text
                  x={cx(root)} y={cy(root) + ROOT_BOX / 2 + 14}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight="700"
                  fill="var(--app-accent)"
                >
                  Finance Tracker
                </text>
              </motion.g>
            );
          })()}

          {/* ── Leaf nodes ── */}
          {NODES.filter(n => !n.isJunction && !n.isRoot).map((node, i) => {
            const x = cx(node) - BOX / 2;
            const y = cy(node) - BOX / 2;
            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.04, type: "spring", stiffness: 220 }}
                style={{ transformOrigin: `${cx(node)}px ${cy(node)}px`, cursor: "pointer" }}
              >
                <rect
                  x={x} y={y}
                  width={BOX} height={BOX}
                  rx={10} ry={10}
                  fill="#ffffff"
                  stroke="var(--app-accent)"
                  strokeWidth="1.5"
                  strokeOpacity={0.55}
                />
                <foreignObject x={x + 4} y={y + 4} width={BOX - 8} height={BOX - 8}>
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {node.icon && (
                      <Image src={node.icon} alt={node.label ?? ""} width={BOX - 12} height={BOX - 12} style={{ objectFit: "contain", borderRadius: 6 }} />
                    )}
                  </div>
                </foreignObject>
                <text
                  x={cx(node)} y={y + BOX + 12}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight="600"
                  fill="currentColor"
                  className="fill-neutral-500 dark:fill-neutral-400"
                >
                  {node.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
