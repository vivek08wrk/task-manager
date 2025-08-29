'use client'

import React from 'react'
import { motion, AnimatePresence, MotionProps, Variants } from 'framer-motion'

// Animation Variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
}

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4 }
  }
}

export const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

// Reusable Animation Components
interface AnimatedContainerProps extends MotionProps {
  children: React.ReactNode
  className?: string
  variant?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'stagger'
  delay?: number
}

export function AnimatedContainer({ 
  children, 
  className = '', 
  variant = 'fadeIn',
  delay = 0,
  ...props 
}: AnimatedContainerProps) {
  const variants = {
    fadeIn: fadeInVariants,
    slideUp: slideUpVariants,
    scaleIn: scaleInVariants,
    stagger: staggerVariants
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants[variant]}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  intensity?: 'subtle' | 'normal' | 'strong'
}

export function FloatingElement({ 
  children, 
  className = '', 
  intensity = 'normal' 
}: FloatingElementProps) {
  const intensityMap = {
    subtle: { y: [-2, 2, -2], duration: 4 },
    normal: { y: [-5, 5, -5], duration: 6 },
    strong: { y: [-10, 10, -10], duration: 8 }
  }

  const config = intensityMap[intensity]

  return (
    <motion.div
      animate={{ y: config.y }}
      transition={{
        duration: config.duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: 'orange' | 'green' | 'blue' | 'purple'
  hover?: boolean
}

export function GlowCard({ 
  children, 
  className = '', 
  glowColor = 'orange',
  hover = true 
}: GlowCardProps) {
  const glowClasses = {
    orange: 'hover:shadow-glow-orange hover:border-cmf-orange/30',
    green: 'hover:shadow-glow-green hover:border-cmf-green/30',
    blue: 'hover:shadow-glow-blue hover:border-cmf-blue-glow/30',
    purple: 'hover:shadow-glow-purple hover:border-cmf-purple-glow/30'
  }

  return (
    <motion.div
      whileHover={hover ? { 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      className={`glass-card ${glowClasses[glowColor]} transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  )
}

interface PulseGlowProps {
  children: React.ReactNode
  className?: string
  color?: 'orange' | 'green' | 'blue'
}

export function PulseGlow({ 
  children, 
  className = '', 
  color = 'orange' 
}: PulseGlowProps) {
  const colors = {
    orange: '#FF7A1A',
    green: '#37FF8B',
    blue: '#00D4FF'
  }

  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 5px ${colors[color]}40`,
          `0 0 20px ${colors[color]}80`,
          `0 0 5px ${colors[color]}40`
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

interface ShimmerProps {
  className?: string
}

export function Shimmer({ className = '' }: ShimmerProps) {
  return (
    <div className={`shimmer ${className}`}>
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60" />
    </div>
  )
}

// Smooth Scroll Hook
export function useSmoothScroll() {
  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return { scrollToSection }
}
