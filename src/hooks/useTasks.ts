import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Task, TaskStatus } from '../lib/types'
import { useAuth } from './useAuth'

export function useTasks(date: string) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('target_date', date)
      .in('status', ['active', 'completed'])
      .order('created_at', { ascending: true })

    setTasks((data as Task[]) ?? [])
    setLoading(false)
  }, [user, date])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = async (title: string) => {
    if (!user) return
    const activeTasks = tasks.filter(t => t.status === 'active')
    if (activeTasks.length >= 3) return

    await supabase.from('tasks').insert({
      user_id: user.id,
      title,
      created_date: date,
      target_date: date,
    })
    await fetchTasks()
  }

  const updateStatus = async (taskId: string, status: TaskStatus) => {
    const updates: Record<string, unknown> = { status }
    if (status === 'completed') updates.completed_date = date
    await supabase.from('tasks').update(updates).eq('id', taskId)
    await fetchTasks()
  }

  const carryOver = async (taskId: string, nextDate: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const newCount = task.carry_over_count + 1
    await supabase.from('tasks').update({
      target_date: nextDate,
      carry_over_count: newCount,
    }).eq('id', taskId)
    await fetchTasks()
  }

  const activeCount = tasks.filter(t => t.status === 'active').length

  return { tasks, loading, addTask, updateStatus, carryOver, activeCount }
}
