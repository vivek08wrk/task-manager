'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, getLinks, addLink, deleteLink, isValidUrl, isYouTubeUrl } from '@/lib/storage'
import { AnimatedContainer, GlowCard, fadeInVariants, slideUpVariants, staggerVariants } from './AnimationComponents'

export function SidebarLinks() {
  const [links, setLinks] = useState<Link[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newLinkTitle, setNewLinkTitle] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [newLinkType, setNewLinkType] = useState<'youtube' | 'website'>('website')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadedLinks = getLinks()
    setLinks(loadedLinks)
    setIsLoading(false)
  }, [])

  const youtubeLinks = links.filter(link => link.type === 'youtube')
  const websiteLinks = links.filter(link => link.type === 'website')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      setError('Please fill in all fields')
      return
    }

    if (!isValidUrl(newLinkUrl)) {
      setError('Please enter a valid URL')
      return
    }

    const type = isYouTubeUrl(newLinkUrl) ? 'youtube' : 'website'
    const typeLinks = links.filter(link => link.type === type)

    if (typeLinks.length >= 5) {
      setError(`Maximum 5 ${type} links allowed`)
      return
    }

    const newLink = addLink({
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim(),
      type,
    })

    setLinks(prev => [...prev, newLink])
    setNewLinkTitle('')
    setNewLinkUrl('')
    setIsCreating(false)
  }

  const handleDelete = (id: string) => {
    const success = deleteLink(id)
    if (success) {
      setLinks(prev => prev.filter(link => link.id !== id))
    }
  }

  const LinkCard = ({ link }: { link: Link }) => (
    <GlowCard
      glowColor={link.type === 'youtube' ? 'orange' : 'green'}
      className="group"
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="p-4"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center text-xl
              transition-all duration-300 group-hover:scale-110
              ${link.type === 'youtube' 
                ? 'bg-red-500/20 text-red-400 group-hover:shadow-glow-red' 
                : 'bg-cmf-green/20 text-cmf-green group-hover:shadow-glow-green'
              }
            `}>
              {link.type === 'youtube' ? '📺' : '🌐'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white group-hover:text-cmf-orange transition-colors truncate">
                {link.title}
              </h3>
              <p className="text-sm text-gray-400 truncate mt-1">{link.url}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 
                        hover:bg-cmf-green/20 hover:border-cmf-green/30 
                        text-gray-400 hover:text-cmf-green transition-all duration-200"
              title="Open link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
            <motion.button
              onClick={() => handleDelete(link.id)}
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 
                        hover:bg-red-500/20 hover:border-red-500/30 
                        text-gray-400 hover:text-red-400 transition-all duration-200"
              title="Delete link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </GlowCard>
  )

  if (isLoading) {
    return (
      <AnimatedContainer className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-cmf-orange border-t-transparent rounded-full"
        />
      </AnimatedContainer>
    )
  }

  return (
    <AnimatedContainer variants={staggerVariants} className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        variants={fadeInVariants}
        className="text-center space-y-3"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text">Links</h1>
        <p className="text-gray-400 text-lg">Curate your creative resources</p>
      </motion.div>

      {/* Stats & Add Button */}
      <motion.div
        variants={slideUpVariants}
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-sm text-gray-400">Total: </span>
            <span className="text-cmf-orange font-semibold">{links.length}/10</span>
          </div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-sm text-gray-400">YouTube: </span>
            <span className="text-red-400 font-semibold">{youtubeLinks.length}/5</span>
          </div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-sm text-gray-400">Web: </span>
            <span className="text-cmf-green font-semibold">{websiteLinks.length}/5</span>
          </div>
        </div>

        <motion.button
          onClick={() => setIsCreating(true)}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          disabled={links.length >= 10}
          className={`
            relative px-6 py-3 font-medium rounded-2xl transition-all duration-300 
            overflow-hidden group
            ${links.length >= 10
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cmf-orange to-cmf-green text-white shadow-glow-orange hover:shadow-neon-orange'
            }
          `}
        >
          {links.length < 10 && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
            </div>
          )}
          <span className="relative flex items-center gap-2">
            <span className="text-lg">✨</span>
            Add Link
          </span>
        </motion.button>
      </motion.div>

      {/* Link Creator */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <GlowCard className="overflow-hidden">
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-semibold gradient-text mb-4">Add New Link</h3>
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        placeholder="Enter link title..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl 
                                  text-white placeholder:text-gray-400 backdrop-blur-xl
                                  focus:border-cmf-orange/50 focus:ring-2 focus:ring-cmf-orange/20 
                                  transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                        URL
                      </label>
                      <input
                        id="url"
                        type="url"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl 
                                  text-white placeholder:text-gray-400 backdrop-blur-xl
                                  focus:border-cmf-orange/50 focus:ring-2 focus:ring-cmf-orange/20 
                                  transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setIsCreating(false)
                        setError('')
                        setNewLinkTitle('')
                        setNewLinkUrl('')
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl 
                                text-gray-400 hover:text-white hover:bg-white/10 
                                transition-all duration-200"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-cmf-orange to-cmf-green 
                                text-white font-medium rounded-2xl shadow-glow-orange 
                                hover:shadow-neon-orange transition-all duration-300"
                    >
                      Add Link
                    </motion.button>
                  </div>
                </form>
              </div>
            </GlowCard>
          </motion.div>
        )}
      </AnimatePresence>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube Links Section */}
      <motion.div variants={fadeInVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
            <span className="text-3xl">📺</span>
            <span>YouTube Channels</span>
          </h2>
          <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-xl">
            <span className="text-red-400 font-medium text-sm">{youtubeLinks.length}/5</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {youtubeLinks.length === 0 ? (
              <GlowCard className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-8 space-y-4"
                >
                  <div className="text-6xl animate-float">📺</div>
                  <p className="text-gray-400">No YouTube channels added yet</p>
                  <p className="text-sm text-gray-500">Add your favorite creators and tutorials</p>
                </motion.div>
              </GlowCard>
            ) : (
              <motion.div variants={staggerVariants} className="space-y-4">
                {youtubeLinks.map((link) => (
                  <motion.div key={link.id} variants={slideUpVariants} layout>
                    <LinkCard link={link} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Website Links Section */}
      <motion.div variants={fadeInVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
            <span className="text-3xl">🌐</span>
            <span>Websites</span>
          </h2>
          <div className="px-3 py-1 bg-cmf-green/20 border border-cmf-green/30 rounded-xl">
            <span className="text-cmf-green font-medium text-sm">{websiteLinks.length}/5</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {websiteLinks.length === 0 ? (
              <GlowCard className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-8 space-y-4"
                >
                  <div className="text-6xl animate-float">🌐</div>
                  <p className="text-gray-400">No websites added yet</p>
                  <p className="text-sm text-gray-500">Save your inspiration and references</p>
                </motion.div>
              </GlowCard>
            ) : (
              <motion.div variants={staggerVariants} className="space-y-4">
                {websiteLinks.map((link) => (
                  <motion.div key={link.id} variants={slideUpVariants} layout>
                    <LinkCard link={link} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatedContainer>
  )
}
