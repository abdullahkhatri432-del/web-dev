"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import type { CSSProperties, MouseEvent, ReactNode } from "react"

export function TiltCard({
  children,
  className,
  style,
  maxTilt = 8,
  glare = true,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  maxTilt?: number
  glare?: boolean
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 220,
    damping: 22,
    mass: 0.6,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 220,
    damping: 22,
    mass: 0.6,
  })
  const glareX = useTransform(x, [-0.5, 0.5], ["20%", "80%"])
  const glareY = useTransform(y, [-0.5, 0.5], ["20%", "80%"])
  const glareBg = useTransform([glareX, glareY], ([gx, gy]) =>
    `radial-gradient(circle at ${gx} ${gy}, rgba(245, 158, 11, 0.16), transparent 55%)`
  )

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
        ...style,
      }}
      className={className}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBg, mixBlendMode: "multiply" }}
        />
      )}
    </motion.div>
  )
}