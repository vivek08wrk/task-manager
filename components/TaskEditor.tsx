'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '@/lib/storage'

interface TaskEditorProps {
  task?: Task
  onSave: (taskData: Partial<Task>) => void
  onCancel: () => void
}

export function TaskEditor({ task, onSave, onCancel }: TaskEditorProps) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''
  )
  const [notes, setNotes] = useState(task?.notes || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
      notes: notes.trim(),
      status: task?.status || 'pending',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold gradient-text">
            {task ? 'Edit Task' : 'Create Task'}
          </h3>
          <div className="flex space-x-2">
            <motion.button
              type="button"
              onClick={onCancel}
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
              disabled={!title.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {task ? 'Update' : 'Create'}
            </motion.button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            className="input-glass w-full"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description..."
            rows={3}
            className="input-glass w-full resize-none"
          />
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-2">
            Due Date & Time
          </label>
          <input
            id="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-glass w-full"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes..."
            rows={3}
            className="input-glass w-full resize-none"
          />
        </div>

        {/* Status (only show when editing) */}
        {task && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="pending"
                  checked={task.status === 'pending'}
                  onChange={() => {/* Status change handled by parent */}}
                  className="w-4 h-4 text-nothing-orange focus:ring-nothing-orange focus:ring-2"
                />
                <span className="text-sm text-gray-300">Pending</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={task.status === 'completed'}
                  onChange={() => {/* Status change handled by parent */}}
                  className="w-4 h-4 text-nothing-green focus:ring-nothing-green focus:ring-2"
                />
                <span className="text-sm text-gray-300">Completed</span>
              </label>
            </div>
          </div>
        )}
      </form>
    </motion.div>
  )
}
