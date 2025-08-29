'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Task, getTasks, saveTasks, addTask, updateTask, deleteTask } from '@/lib/storage'
import { TaskCard } from './TaskCard'
import { TaskEditor } from './TaskEditor'
import { SearchBar } from './SearchBar'

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
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-nothing-orange border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
  <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">Task Manager</h1>
        <p className="text-gray-400">Organize your creative workflow</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      >
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-gray-400">Total</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-nothing-orange">{stats.pending}</div>
          <div className="text-sm text-gray-400">Pending</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-nothing-green">{stats.completed}</div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.overdue}</div>
          <div className="text-sm text-gray-400">Overdue</div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
  className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between"
      >
        <SearchBar onSearch={handleSearch} />
        
        <div className="flex gap-2">
          {/* Filter buttons */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="input-glass px-3 py-2 text-sm"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          {/* Sort buttons */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-glass px-3 py-2 text-sm"
          >
            <option value="dueDate">Due Date</option>
            <option value="status">Status</option>
            <option value="created">Created</option>
          </select>

          {/* Create button */}
          <motion.button
            onClick={() => setIsCreating(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary whitespace-nowrap"
          >
            + New Task
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
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-12 text-center"
            >
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery || filterStatus !== 'all' 
                  ? 'No tasks found' 
                  : 'Ready to create?'}
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start organizing your creative projects by adding your first task.'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <motion.button
                  onClick={() => setIsCreating(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary mt-6"
                >
                  Create Your First Task
                </motion.button>
              )}
            </motion.div>
          ) : (
      filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleUpdateTask}
                onDelete={handleDeleteTask}
        justAdded={task.id === lastAddedId}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
