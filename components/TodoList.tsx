'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Task, getTasks, saveTasks, addTask, updateTask, deleteTask } from '@/lib/storage'
import { TaskCard } from './TaskCard'
import { TaskEditor } from './TaskEditor'
import { SearchBar } from './SearchBar'
import { AnimatedContainer, GlowCard, fadeInVariants, slideUpVariants, staggerVariants } from './AnimationComponents'

export function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'dueDate' | 'status' | 'created'>('dueDate')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)

  // Load tasks on mount
  useEffect(() => {
    const loadedTasks = getTasks()
    setTasks(loadedTasks)
    setIsLoading(false)
  }, [])

  // Filter and sort tasks
  useEffect(() => {
    let filtered = tasks

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus)
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'status':
          if (a.status === b.status) return 0
          return a.status === 'pending' ? -1 : 1
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    setFilteredTasks(filtered)
  }, [tasks, searchQuery, sortBy, filterStatus])

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask = addTask(taskData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>)
    setTasks(prev => [...prev, newTask])
    setIsCreating(false)
    setLastAddedId(newTask.id)
    setTimeout(() => setLastAddedId(null), 1200)
  }

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    const updatedTask = updateTask(id, updates)
    if (updatedTask) {
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task))
    }
  }

  const handleDeleteTask = (id: string) => {
    const success = deleteTask(id)
    if (success) {
      setTasks(prev => prev.filter(task => task.id !== id))
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => 
      t.status === 'pending' && new Date(t.dueDate) < new Date()
    ).length,
  }

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
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text">Task Manager</h1>
        <p className="text-gray-400 text-lg">Organize your creative workflow with CMF elegance</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={fadeInVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <GlowCard className="p-4 sm:p-6 text-center group hover:scale-105 transition-transform">
          <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-cmf-orange transition-colors">
            {stats.total}
          </div>
          <div className="text-sm text-gray-400 mt-1">Total Tasks</div>
        </GlowCard>
        
        <GlowCard className="p-4 sm:p-6 text-center group hover:scale-105 transition-transform">
          <div className="text-2xl sm:text-3xl font-bold text-cmf-orange group-hover:scale-110 transition-transform">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-400 mt-1">Pending</div>
        </GlowCard>
        
        <GlowCard className="p-4 sm:p-6 text-center group hover:scale-105 transition-transform">
          <div className="text-2xl sm:text-3xl font-bold text-cmf-green group-hover:scale-110 transition-transform">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-400 mt-1">Completed</div>
        </GlowCard>
        
        <GlowCard className="p-4 sm:p-6 text-center group hover:scale-105 transition-transform">
          <div className="text-2xl sm:text-3xl font-bold text-red-400 group-hover:scale-110 transition-transform">
            {stats.overdue}
          </div>
          <div className="text-sm text-gray-400 mt-1">Overdue</div>
        </GlowCard>
      </motion.div>

      {/* Controls */}
      <motion.div
        variants={slideUpVariants}
        className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between"
      >
        <div className="flex-1 max-w-md">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* Filter Dropdown */}
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="glass px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-2xl 
                      focus:border-cmf-orange/50 focus:ring-2 focus:ring-cmf-orange/20 
                      text-white backdrop-blur-xl transition-all duration-300"
          >
            <option value="all" className="bg-cmf-black text-white">All Tasks</option>
            <option value="pending" className="bg-cmf-black text-white">Pending</option>
            <option value="completed" className="bg-cmf-black text-white">Completed</option>
          </motion.select>

          {/* Sort Dropdown */}
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="glass px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-2xl 
                      focus:border-cmf-orange/50 focus:ring-2 focus:ring-cmf-orange/20 
                      text-white backdrop-blur-xl transition-all duration-300"
          >
            <option value="dueDate" className="bg-cmf-black text-white">Due Date</option>
            <option value="status" className="bg-cmf-black text-white">Status</option>
            <option value="created" className="bg-cmf-black text-white">Created</option>
          </motion.select>

          {/* Create Button */}
          <motion.button
            onClick={() => setIsCreating(true)}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-6 py-3 bg-gradient-to-r from-cmf-orange to-cmf-green 
                      text-white font-medium rounded-2xl shadow-glow-orange 
                      hover:shadow-neon-orange transition-all duration-300 
                      whitespace-nowrap overflow-hidden group"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
            </div>
            <span className="relative flex items-center gap-2">
              <span className="text-lg">✨</span>
              New Task
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Task Creator */}
      <AnimatePresence>
        {isCreating && (
          <TaskEditor
            onSave={handleCreateTask}
            onCancel={() => setIsCreating(false)}
          />
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <motion.div variants={fadeInVariants} className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <GlowCard className="p-8 sm:p-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="text-6xl sm:text-8xl mb-4 animate-float">🎨</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                  {searchQuery || filterStatus !== 'all' 
                    ? 'No tasks found' 
                    : 'Ready to create?'}
                </h3>
                <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start organizing your creative projects by adding your first task.'}
                </p>
                {!searchQuery && filterStatus === 'all' && (
                  <motion.button
                    onClick={() => setIsCreating(true)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-8 py-4 bg-gradient-to-r from-cmf-orange to-cmf-green 
                              text-white font-medium rounded-2xl shadow-glow-orange 
                              hover:shadow-neon-orange transition-all duration-300 
                              mt-6 overflow-hidden group"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
                    </div>
                    <span className="relative flex items-center gap-2">
                      <span className="text-xl">✨</span>
                      Create Your First Task
                    </span>
                  </motion.button>
                )}
              </motion.div>
            </GlowCard>
          ) : (
            <motion.div 
              variants={staggerVariants}
              className="grid gap-4 sm:gap-6"
            >
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  variants={slideUpVariants}
                  custom={index}
                  layout
                >
                  <TaskCard
                    task={task}
                    onEdit={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    justAdded={task.id === lastAddedId}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatedContainer>
  )
}
