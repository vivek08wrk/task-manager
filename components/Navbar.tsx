'use client'

import React, { forwardRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

interface NavbarProps {
  className?: string
}

export const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
  ({ className = '' }, ref) => {
    const pathname = usePathname()

    const navItems = [
      { href: '/', label: 'Todo List', icon: '◉' },
      { href: '/links', label: 'Links', icon: '⚡' },
    ]

    return (
      <motion.nav
        ref={ref}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className={`glass-card mx-4 mt-4 mb-8 ${className}`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-nothing-orange to-nothing-green flex items-center justify-center shadow-inner-soft">
                <span className="text-black font-bold text-sm">◉</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold gradient-text">Task Manager</h1>
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative px-3 sm:px-4 py-2 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'text-nothing-orange glow-orange'
                          : 'text-gray-400 hover:text-white hover:glow-green'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg">{item.icon}</span>
                        <span className="font-medium text-sm sm:text-base">{item.label}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-nothing-orange to-nothing-green rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </motion.nav>
    )
  }
)

Navbar.displayName = 'Navbar'
