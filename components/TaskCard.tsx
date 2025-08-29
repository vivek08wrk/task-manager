'use client'

import React, { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Task } from '@/lib/storage'
import { TaskEditor } from './TaskEditor'

interface TaskCardProps {
  task: Task
  onEdit: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  justAdded?: boolean
  className?: string
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onEdit, onDelete, justAdded = false, className = '' }, ref) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleToggleStatus = () => {
    onEdit(task.id, {
      status: task.status === 'completed' ? 'pending' : 'completed'
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = (updates: Partial<Task>) => {
    onEdit(task.id, updates)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(task.id)
    } else {
      setShowDeleteConfirm(true)
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    
    if (days < 0) return 'Overdue'
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    return `${days} days`
  }

  const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'pending'

  if (isEditing) {
    return (
      <TaskEditor
        task={task}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  return (
  <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
  className={`card-interactive p-6 ${
        task.status === 'completed' 
          ? 'opacity-75 border-nothing-green/30' 
          : isOverdue 
            ? 'border-red-500/30 glow-red' 
    : 'border-nothing-orange/30'
  } ${justAdded ? 'glow-orange pulse-glow' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        {/* Task content */}
        <div className="flex-1 min-w-0">
          {/* Title and status */}
          <div className="flex items-center space-x-3 mb-3">
            <motion.button
              onClick={handleToggleStatus}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                task.status === 'completed'
                  ? 'bg-nothing-green border-nothing-green text-black'
                  : 'border-nothing-orange hover:border-nothing-green'
              }`}
            >
              {task.status === 'completed' && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
            
            <h3 className={`text-lg font-semibold truncate ${
              task.status === 'completed' 
                ? 'line-through text-gray-400' 
                : 'text-white'
            }`}>
              {task.title}
            </h3>
          </div>

          {/* Description */}
          {task.description && (
            <p className={`text-sm mb-3 ${
              task.status === 'completed' ? 'text-gray-500' : 'text-gray-300'
            }`}>
              {task.description}
            </p>
          )}

          {/* Due date */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xs text-gray-400">📅</span>
            <span className={`text-xs font-medium ${
              isOverdue 
                ? 'text-red-400' 
                : task.status === 'completed'
                  ? 'text-gray-500'
                  : 'text-nothing-orange'
            }`}>
              {formatDate(task.dueDate)}
            </span>
          </div>

          {/* Notes */}
          {task.notes && (
            <div className="mt-3 p-3 glass rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Notes:</p>
              <p className="text-sm text-gray-300">{task.notes}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col space-y-2 ml-4">
          <motion.button
            onClick={handleEdit}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-nothing-green hover:glow-green transition-all duration-300"
            title="Edit task"
          >
            ✏️
          </motion.button>
          
          <motion.button
            onClick={handleDelete}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-8 h-8 glass rounded-lg flex items-center justify-center transition-all duration-300 ${
              showDeleteConfirm 
                ? 'text-red-400 glow-red' 
                : 'text-gray-400 hover:text-red-400'
            }`}
            title={showDeleteConfirm ? 'Confirm delete' : 'Delete task'}
          >
            {showDeleteConfirm ? '⚠️' : '🗑️'}
          </motion.button>
        </div>
      </div>

      {/* Add glow effect when completed */}
      <AnimatePresence>
        {task.status === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 rounded-2xl bg-nothing-green/10 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
  }
)

TaskCard.displayName = 'TaskCard'
