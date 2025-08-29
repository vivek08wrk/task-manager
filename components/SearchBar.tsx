'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Search tasks..." }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value) // Real-time search
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full"
    >
      <div className="relative group">
        <motion.input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-4 py-3 sm:py-4 text-white placeholder:text-gray-400 
            bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl
            transition-all duration-300 ease-out
            focus:border-cmf-orange/50 focus:ring-2 focus:ring-cmf-orange/20 
            focus:bg-white/10 focus:shadow-glow-orange
            hover:border-white/20 hover:bg-white/10
            ${isFocused ? 'shadow-glow-orange' : ''}
          `}
        />
        
        {/* Search icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <motion.div
            animate={{ 
              rotate: query ? 360 : 0,
              scale: isFocused ? 1.1 : 1,
              color: isFocused ? '#FF7A1A' : '#9CA3AF'
            }}
            transition={{ duration: 0.3 }}
            className="w-5 h-5"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.div>
        </div>

        {/* Clear button */}
        {query && (
          <motion.button
            type="button"
            onClick={() => {
              setQuery('')
              onSearch('')
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 
                      text-gray-400 hover:text-cmf-green transition-colors duration-200"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        )}

        {/* Focus Ring Animation */}
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cmf-orange/20 to-cmf-green/20 
                      opacity-20 blur-xl pointer-events-none"
          />
        )}
      </div>
    </motion.form>
  )
}
