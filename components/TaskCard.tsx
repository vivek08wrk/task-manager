'use client'

import React, { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Task } from '@/lib/storage'
import { TaskEditor } from './TaskEditor'
import { GlowCard, PulseGlow } from './AnimationComponents'

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
  const [isHovered, setIsHovered] = useState(false)

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

  const isOverdue = task.status === 'pending' && new Date(task.dueDate) < new Date()
  const isCompleted = task.status === 'completed'

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
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden transition-all duration-300 group
        ${isCompleted ? 'opacity-75' : ''}
        ${isOverdue ? 'border-red-500/30 shadow-red-500/20' : ''}
        ${justAdded ? 'shadow-glow-orange animate-glow-pulse' : ''}
        ${className}
      `}
    >
      <GlowCard
        glowColor={isOverdue ? 'orange' : 'green'}
        className="h-full"
      >
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            {/* Status Toggle & Title */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <motion.button
                onClick={handleToggleStatus}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`
                  relative w-6 h-6 rounded-full border-2 flex items-center justify-center 
                  transition-all duration-300 mt-1 flex-shrink-0
                  ${isCompleted
                    ? 'bg-cmf-green border-cmf-green text-cmf-black shadow-glow-green'
                    : 'border-cmf-orange hover:border-cmf-green hover:shadow-glow-orange'
                  }
                `}
              >
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm font-bold"
                  >
                    ✓
                  </motion.div>
                )}
                {!isCompleted && isHovered && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 rounded-full bg-cmf-orange/20 animate-ping"
                  />
                )}
              </motion.button>
              
              <div className="flex-1 min-w-0">
                <h3 className={`
                  text-lg sm:text-xl font-semibold transition-all duration-300
                  ${isCompleted 
                    ? 'line-through text-gray-400' 
                    : 'text-white group-hover:text-cmf-orange'
                  }
                `}>
                  {task.title}
                </h3>
                
                {/* Due Date */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs">📅</span>
                  <span className={`
                    text-xs font-medium
                    ${isOverdue ? 'text-red-400' : 
                      formatDate(task.dueDate) === 'Today' ? 'text-cmf-orange' :
                      'text-gray-400'
                    }
                  `}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <motion.button
                onClick={handleEdit}
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl bg-white/5 border border-white/10 
                          hover:bg-cmf-orange/20 hover:border-cmf-orange/30 
                          text-gray-400 hover:text-cmf-orange transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </motion.button>
              
              <motion.button
                onClick={handleDelete}
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  p-2 rounded-xl border transition-all duration-200
                  ${showDeleteConfirm 
                    ? 'bg-red-500/20 border-red-500/30 text-red-400 shadow-glow-red' 
                    : 'bg-white/5 border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-gray-400 hover:text-red-400'
                  }
                `}
              >
                {showDeleteConfirm ? (
                  <span className="text-xs font-bold px-1">?</span>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className={`
              text-sm leading-relaxed
              ${isCompleted ? 'text-gray-500' : 'text-gray-300'}
            `}>
              {task.description}
            </p>
          )}

          {/* Notes */}
          {task.notes && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Notes:</p>
              <p className="text-sm text-gray-300">{task.notes}</p>
            </div>
          )}

          {/* Completion Glow Effect */}
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute inset-0 rounded-2xl bg-cmf-green/10 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Just Added Pulse */}
          {justAdded && (
            <PulseGlow color="orange" className="absolute inset-0 rounded-2xl">
              <div />
            </PulseGlow>
          )}
        </div>
      </GlowCard>
    </motion.div>
  )
})

TaskCard.displayName = 'TaskCard'
