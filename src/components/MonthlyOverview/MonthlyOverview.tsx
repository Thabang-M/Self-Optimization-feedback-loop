import { useState, useEffect, useCallback } from 'react'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  subMonths, addMonths, getDay,
} from 'date-fns'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { supabase } from '../../lib/supabase'
import { getScoreInfo } from '../../lib/scoring'
import type { DailyLog } from '../../lib/types'
import { useAuth } from '../../hooks/useAuth'

export default function MonthlyOverview() {
  const { user } = useAuth()
  const [monthDate, setMonthDate] = useState(new Date())
  const [logs, setLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const start = format(startOfMonth(monthDate), 'yyyy-MM-dd')
    const end = format(endOfMonth(monthDate), 'yyyy-MM-dd')
    const { data } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('log_date', start)
      .lte('log_date', end)
      .order('log_date')
    setLogs((data as DailyLog[]) ?? [])
    setLoading(false)
  }, [user, monthDate])

  useEffect(() => { fetchData() }, [fetchData])

  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const logMap = new Map(logs.map(l => [l.log_date, l]))

  const loggedDays = logs.filter(l => l.total_score != null)
  const avgHP = loggedDays.length ? loggedDays.reduce((s, l) => s + (l.hp_score ?? 0), 0) / loggedDays.length : 0
  const avgXP = loggedDays.length ? loggedDays.reduce((s, l) => s + (l.xp_score ?? 0), 0) / loggedDays.length : 0

  const trendData = logs
    .filter(l => l.total_score != null)
    .map(l => ({
      day: format(new Date(l.log_date + 'T00:00:00'), 'd'),
      total: l.total_score ?? 0,
    }))

  const startPadding = (getDay(monthStart) + 6) % 7

  return (
    <div className="space-y-4">
      {/* Month nav */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setMonthDate(subMonths(monthDate, 1))}
          className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
          &larr;
        </button>
        <span className="text-sm text-gray-300 font-medium">
          {format(monthDate, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setMonthDate(addMonths(monthDate, 1))}
          className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
          &rarr;
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Averages */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Avg HP</p>
              <p className="text-xl font-bold text-hp">{avgHP.toFixed(1)}</p>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Avg XP</p>
              <p className="text-xl font-bold text-xp">{avgXP.toFixed(1)}</p>
            </div>
          </div>

          {/* Calendar heatmap */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Score Heatmap</h3>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="text-xs text-gray-600 py-1">{d}</div>
              ))}
              {Array.from({ length: startPadding }).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {days.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd')
                const log = logMap.get(dateStr)
                const score = log?.total_score ?? null
                const info = score != null ? getScoreInfo(score) : null
                return (
                  <div
                    key={dateStr}
                    className="aspect-square rounded-md flex items-center justify-center text-xs font-medium"
                    style={{
                      backgroundColor: info ? info.color + '30' : '#1f2937',
                      color: info ? info.color : '#4b5563',
                    }}
                    title={score != null ? `${format(day, 'MMM d')}: ${score.toFixed(1)}` : format(day, 'MMM d')}
                  >
                    {format(day, 'd')}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Trend line */}
          {trendData.length > 1 && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Score Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[0, 20]} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="total" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  )
}
