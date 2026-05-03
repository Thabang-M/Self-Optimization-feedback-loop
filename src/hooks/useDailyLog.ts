import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { calculateTotal } from '../lib/scoring'
import type { DailyLog } from '../lib/types'
import { useAuth } from './useAuth'

const EMPTY_LOG: Omit<DailyLog, 'id' | 'user_id' | 'log_date' | 'created_at'> = {
  sleep_bedtime_hit: null,
  sleep_duration: null,
  sleep_wake_feeling: null,
  exercise_rating: null,
  food_rating: null,
  water_rating: null,
  deep_work_rating: null,
  light_work_rating: null,
  learning_rating: null,
  value_adds_rating: null,
  hp_score: null,
  xp_score: null,
  total_score: null,
  mood_morning: null,
  mood_evening: null,
  energy_morning: null,
  energy_evening: null,
  breakfast_note: null,
  lunch_note: null,
  dinner_note: null,
}

export function useDailyLog(date: string) {
  const { user } = useAuth()
  const [log, setLog] = useState<DailyLog | null>(null)
  const [formData, setFormData] = useState<Partial<DailyLog>>(EMPTY_LOG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchLog = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('log_date', date)
      .maybeSingle()

    if (data) {
      setLog(data as DailyLog)
      setFormData(data as DailyLog)
    } else {
      setLog(null)
      setFormData({ ...EMPTY_LOG })
    }
    setLoading(false)
  }, [user, date])

  useEffect(() => {
    fetchLog()
  }, [fetchLog])

  const updateField = <K extends keyof DailyLog>(field: K, value: DailyLog[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const scores = calculateTotal(formData)

  const save = async () => {
    if (!user) return
    setSaving(true)

    const payload = {
      ...formData,
      user_id: user.id,
      log_date: date,
      hp_score: scores.hp,
      xp_score: scores.xp,
      total_score: scores.total,
    }

    if (log?.id) {
      await supabase.from('daily_logs').update(payload).eq('id', log.id)
    } else {
      await supabase.from('daily_logs').insert(payload)
    }

    await fetchLog()
    setSaving(false)
  }

  return { log, formData, loading, saving, scores, updateField, save }
}
