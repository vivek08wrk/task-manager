'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, getLinks, addLink, deleteLink, isValidUrl, isYouTubeUrl } from '@/lib/storage'

export function SidebarLinks() {
  const [links, setLinks] = useState<Link[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newLinkTitle, setNewLinkTitle] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [newLinkType, setNewLinkType] = useState<'youtube' | 'website'>('website')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadedLinks = getLinks()
    setLinks(loadedLinks)
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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="card-interactive p-4 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            link.type === 'youtube' 
              ? 'bg-red-500/20 text-red-400' 
              : 'bg-nothing-green/20 text-nothing-green'
          }`}>
            {link.type === 'youtube' ? '📺' : '🌐'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate">{link.title}</h3>
            <p className="text-sm text-gray-400 truncate">{link.url}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-nothing-green hover:glow-green transition-all duration-300"
            title="Open link"
          >
            🔗
          </motion.a>
          <motion.button
            onClick={() => handleDelete(link.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-all duration-300"
            title="Delete link"
          >
            🗑️
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
  <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">Links</h1>
        <p className="text-gray-400">Curate your creative resources</p>
      </motion.div>

      {/* Add Link Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <motion.button
          onClick={() => setIsCreating(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary"
          disabled={links.length >= 10}
        >
          + Add Link
        </motion.button>
      </motion.div>

      {/* Link Creator */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold gradient-text mb-4">Add New Link</h3>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

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
                  className="input-glass w-full"
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
                  className="input-glass w-full"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
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
                  className="px-4 py-2 glass rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  Add Link
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <span>📺</span>
            <span>YouTube Channels</span>
          </h2>
          <span className="text-sm text-gray-400">{youtubeLinks.length}/5</span>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {youtubeLinks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-8 text-center"
              >
                <div className="text-4xl mb-3">📺</div>
                <p className="text-gray-400">No YouTube channels added yet</p>
              </motion.div>
            ) : (
              youtubeLinks.map((link) => (
                <LinkCard key={link.id} link={link} />
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Website Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <span>🌐</span>
            <span>Websites</span>
          </h2>
          <span className="text-sm text-gray-400">{websiteLinks.length}/5</span>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {websiteLinks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-8 text-center"
              >
                <div className="text-4xl mb-3">🌐</div>
                <p className="text-gray-400">No websites added yet</p>
              </motion.div>
            ) : (
              websiteLinks.map((link) => (
                <LinkCard key={link.id} link={link} />
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
