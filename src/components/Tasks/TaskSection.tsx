import { useState } from 'react'
import { format, addDays } from 'date-fns'
import { useTasks } from '../../hooks/useTasks'
import type { Task } from '../../lib/types'

interface Props {
  date: string
}

export default function TaskSection({ date }: Props) {
  const { tasks, loading, addTask, updateStatus, carryOver, activeCount } = useTasks(date)
  const [newTitle, setNewTitle] = useState('')
  const [resolveTask, setResolveTask] = useState<Task | null>(null)

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    await addTask(newTitle.trim())
    setNewTitle('')
  }

  const nextDate = format(addDays(new Date(date + 'T00:00:00'), 1), 'yyyy-MM-dd')

  const flaggedTasks = tasks.filter(t => t.status === 'active' && t.carry_over_count >= 3)
  const taskToResolve = resolveTask ?? flaggedTasks[0] ?? null

  if (loading) return null

  return (
    <section className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-total" />
          Tasks
          <span className="text-xs text-gray-600 font-normal">({activeCount}/3)</span>
        </h3>
      </div>

      {/* Flagged task resolution modal */}
      {taskToResolve && taskToResolve.carry_over_count >= 3 && (
        <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-3 space-y-2">
          <p className="text-sm text-orange-300">
            "{taskToResolve.title}" has been carried over {taskToResolve.carry_over_count} times. Choose an action:
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { updateStatus(taskToResolve.id, 'broken_down'); setResolveTask(null) }}
              className="px-3 py-1 text-xs rounded bg-yellow-600 text-white hover:bg-yellow-700"
            >
              Break Down
            </button>
            <button
              onClick={() => { updateStatus(taskToResolve.id, 'delegated'); setResolveTask(null) }}
              className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Delegate
            </button>
            <button
              onClick={() => { updateStatus(taskToResolve.id, 'deleted'); setResolveTask(null) }}
              className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      <ul className="space-y-2">
        {tasks.map(task => (
          <li
            key={task.id}
            className="flex items-center gap-2 group"
          >
            <button
              onClick={() => updateStatus(task.id, task.status === 'completed' ? 'active' : 'completed')}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                task.status === 'completed'
                  ? 'bg-hp border-hp text-white'
                  : 'border-gray-600 hover:border-gray-400'
              }`}
            >
              {task.status === 'completed' && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className={`flex-1 text-sm ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
              {task.title}
            </span>
            {task.carry_over_count > 0 && (
              <span className="text-xs text-orange-400" title="Carry-over count">
                +{task.carry_over_count}
              </span>
            )}
            {task.status === 'active' && (
              <button
                onClick={() => {
                  if (task.carry_over_count >= 2) {
                    setResolveTask({ ...task, carry_over_count: task.carry_over_count + 1 })
                  } else {
                    carryOver(task.id, nextDate)
                  }
                }}
                className="text-xs text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Carry over to tomorrow"
              >
                &rarr;
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Add task */}
      {activeCount < 3 && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Add a task..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleAdd}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </section>
  )
}
