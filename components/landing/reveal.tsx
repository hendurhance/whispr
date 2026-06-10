'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export function Reveal({
  children,
  className,
  y = 28,
  stagger = 0.09,
  start = 'top 82%',
}: {
  children: ReactNode
  className?: string
  y?: number
  stagger?: number
  start?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const el = ref.current
      if (!el || el.children.length === 0) return
      gsap.from(el.children, {
        opacity: 0,
        y,
        duration: 0.75,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: el, start },
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
