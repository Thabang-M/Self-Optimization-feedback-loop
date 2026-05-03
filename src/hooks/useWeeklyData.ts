import { useState, useEffect, useCallback } from 'react'
import { startOfWeek, endOfWeek, format, eachDayOfInterval } from 'date-fns'
import { supabase } from '../lib/supabase'
import type { DailyLog, Task } from '../lib/types'
import { useAuth } from './useAuth'

export interface WeeklyStats {
  logs: DailyLog[]
  days: string[]
  avgHP: number
  avgXP: number
  avgTotal: number
  bestDay: DailyLog | null
  worstDay: DailyLog | null
  taskCompletionRate: number
  totalTasks: number
  completedTasks: number
}

export function useWeeklyData(weekDate: Date) {
  const { user } = useAuth()
  const [stats, setStats] = useState<WeeklyStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 })
    const startStr = format(weekStart, 'yyyy-MM-dd')
    const endStr = format(weekEnd, 'yyyy-MM-dd')
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd }).map(d => format(d, 'yyyy-MM-dd'))

    const [logsResult, tasksResult] = await Promise.all([
      supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('log_date', startStr)
        .lte('log_date', endStr)
        .order('log_date'),
      supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .gte('target_date', startStr)
        .lte('target_date', endStr),
    ])

    const logs = (logsResult.data as DailyLog[]) ?? []
    const tasks = (tasksResult.data as Task[]) ?? []

    const loggedDays = logs.filter(l => l.total_score != null)
    const avgHP = loggedDays.length ? loggedDays.reduce((s, l) => s + (l.hp_score ?? 0), 0) / loggedDays.length : 0
    const avgXP = loggedDays.length ? loggedDays.reduce((s, l) => s + (l.xp_score ?? 0), 0) / loggedDays.length : 0
    const avgTotal = loggedDays.length ? loggedDays.reduce((s, l) => s + (l.total_score ?? 0), 0) / loggedDays.length : 0

    const bestDay = loggedDays.length ? loggedDays.reduce((a, b) => (a.total_score ?? 0) >= (b.total_score ?? 0) ? a : b) : null
    const worstDay = loggedDays.length ? loggedDays.reduce((a, b) => (a.total_score ?? 0) <= (b.total_score ?? 0) ? a : b) : null

    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const totalTasks = tasks.length
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    setStats({
      logs,
      days,
      avgHP,
      avgXP,
      avgTotal,
      bestDay,
      worstDay,
      taskCompletionRate,
      totalTasks,
      completedTasks,
    })
    setLoading(false)
  }, [user, weekDate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { stats, loading }
}
