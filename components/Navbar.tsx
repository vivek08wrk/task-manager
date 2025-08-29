'use client'

import React, { forwardRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface NavbarProps {
  className?: string
}

export const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
  ({ className = '' }, ref) => {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = [
      { href: '/', label: 'Tasks', icon: '◉', gradient: 'from-cmf-orange to-cmf-green' },
      { href: '/links', label: 'Links', icon: '⚡', gradient: 'from-cmf-green to-cmf-blue-glow' },
    ]

    return (
      <motion.nav
        ref={ref}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`
          backdrop-blur-xl bg-cmf-black/80 border-b border-white/10
          transition-all duration-300 ease-out
          ${isScrolled ? 'shadow-2xl bg-cmf-black/90' : 'shadow-lg'}
          ${className}
        `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cmf-orange to-cmf-green flex items-center justify-center shadow-lg group-hover:shadow-glow-orange transition-all duration-300">
                  <span className="text-cmf-black font-bold text-lg">◉</span>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cmf-orange to-cmf-green opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold gradient-text">
                  Task Manager
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  CMF by Nothing
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative px-6 py-3 rounded-2xl font-medium
                        transition-all duration-300 group overflow-hidden
                        ${isActive
                          ? 'text-white bg-white/10 shadow-glow-orange'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {/* Background Shimmer Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer" />
                      </div>
                      
                      <div className="relative flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeDesktop"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-cmf-orange to-cmf-green rounded-full"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group"
            >
              <div className="w-5 h-5 flex flex-col justify-center gap-1">
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-full bg-white/70 group-hover:bg-cmf-orange transition-colors"
                />
                <motion.span
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="block h-0.5 w-full bg-white/70 group-hover:bg-cmf-orange transition-colors"
                />
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-full bg-white/70 group-hover:bg-cmf-orange transition-colors"
                />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-cmf-black/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        onClick={() => setIsMobileMenuOpen(false)}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          relative flex items-center gap-3 px-4 py-3 rounded-2xl
                          transition-all duration-200
                          ${isActive
                            ? 'text-white bg-white/10 shadow-glow-orange'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeMobile"
                            className="absolute right-3 w-2 h-2 bg-gradient-to-r from-cmf-orange to-cmf-green rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    )
  }
)

Navbar.displayName = 'Navbar'
