export default function TaskItem({ task, onDelete, onMarkDone }) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${task._id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          onDelete(task._id)
        } else {
          alert('Failed to delete task')
        }
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  return (
    <div className="task-item">
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>Status: {task.status}</p>
      </div>
      <div className="task-buttons">
        <button onClick={onMarkDone} className="btn-done">Mark Done</button>
        <button onClick={handleDelete} className="btn-delete">Delete</button>
      </div>
    </div>
  )
}
