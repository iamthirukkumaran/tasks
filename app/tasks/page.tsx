'use client'

import { useState, useEffect } from 'react'

interface Task {
  _id: string
  title: string
  status: 'pending' | 'done'
  createdAt: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError('Unable to load tasks. Please check your database connection.')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Add new task
  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    setSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskTitle }),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      setNewTaskTitle('')
      await fetchTasks() // Refresh the list
    } catch (err) {
      setError('Unable to create task. Please check your database connection.')
      console.error('Error creating task:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Mark task as done
  const handleMarkAsDone = async (taskId: string) => {
    setError('')
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      await fetchTasks() // Refresh the list
    } catch (err) {
      setError('Unable to update task. Please try again.')
      console.error('Error updating task:', err)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Team Tasks Board</h1>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting || !newTaskTitle.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No tasks yet. Add your first task above!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className={`p-6 ${
                    task.status === 'done' ? 'bg-gray-50 opacity-75' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-medium ${
                          task.status === 'done'
                            ? 'text-gray-500 line-through'
                            : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Created: {formatDate(task.createdAt)}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                          task.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {task.status === 'pending' ? 'Pending' : 'Completed'}
                      </span>
                    </div>
                    {task.status === 'pending' && (
                      <button
                        onClick={() => handleMarkAsDone(task._id)}
                        className="ml-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                      >
                        Mark as Done
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}