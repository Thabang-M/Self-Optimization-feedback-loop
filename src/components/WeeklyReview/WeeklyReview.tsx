import { useState } from 'react'
import { format, subWeeks, addWeeks, startOfWeek, endOfWeek } from 'date-fns'
import { useWeeklyData } from '../../hooks/useWeeklyData'
import { getScoreInfo } from '../../lib/scoring'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

export default function WeeklyReview() {
  const [weekDate, setWeekDate] = useState(new Date())
  const { stats, loading } = useWeeklyData(weekDate)

  const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 })

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>
  }

  if (!stats || stats.logs.length === 0) {
    return (
      <div className="space-y-4">
        <WeekNav weekStart={weekStart} weekEnd={weekEnd} onPrev={() => setWeekDate(subWeeks(weekDate, 1))} onNext={() => setWeekDate(addWeeks(weekDate, 1))} />
        <div className="text-center py-12 text-gray-500">No data for this week.</div>
      </div>
    )
  }

  const dailyData = stats.days.map(day => {
    const log = stats.logs.find(l => l.log_date === day)
    return {
      day: format(new Date(day + 'T00:00:00'), 'EEE'),
      hp: log?.hp_score ?? 0,
      xp: log?.xp_score ?? 0,
      total: log?.total_score ?? 0,
      moodMorning: log?.mood_morning ?? null,
      moodEvening: log?.mood_evening ?? null,
      energyMorning: log?.energy_morning ?? null,
      energyEvening: log?.energy_evening ?? null,
    }
  })

  const moodData = dailyData.filter(d => d.moodMorning || d.moodEvening)
  const energyData = dailyData.filter(d => d.energyMorning || d.energyEvening)

  return (
    <div className="space-y-4">
      <WeekNav weekStart={weekStart} weekEnd={weekEnd} onPrev={() => setWeekDate(subWeeks(weekDate, 1))} onNext={() => setWeekDate(addWeeks(weekDate, 1))} />

      {/* Averages */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Avg HP" value={stats.avgHP.toFixed(1)} color="text-hp" />
        <StatCard label="Avg XP" value={stats.avgXP.toFixed(1)} color="text-xp" />
        <StatCard label="Avg Total" value={stats.avgTotal.toFixed(1)} color="text-total" />
      </div>

      {/* Best / Worst day */}
      <div className="grid grid-cols-2 gap-3">
        {stats.bestDay && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-3">
            <p className="text-xs text-gray-500 mb-1">Best Day</p>
            <p className="text-sm font-medium text-white">{format(new Date(stats.bestDay.log_date + 'T00:00:00'), 'EEEE')}</p>
            <p className={`text-lg font-bold ${getScoreInfo(stats.bestDay.total_score ?? 0).textClass}`}>
              {stats.bestDay.total_score?.toFixed(1)}
            </p>
          </div>
        )}
        {stats.worstDay && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-3">
            <p className="text-xs text-gray-500 mb-1">Worst Day</p>
            <p className="text-sm font-medium text-white">{format(new Date(stats.worstDay.log_date + 'T00:00:00'), 'EEEE')}</p>
            <p className={`text-lg font-bold ${getScoreInfo(stats.worstDay.total_score ?? 0).textClass}`}>
              {stats.worstDay.total_score?.toFixed(1)}
            </p>
          </div>
        )}
      </div>

      {/* HP vs XP bar chart */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">HP vs XP</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[0, 10]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="hp" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="xp" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mood trends */}
      {moodData.length > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Mood Trends</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[1, 5]} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }} />
              <Line type="monotone" dataKey="moodMorning" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} connectNulls name="Morning" />
              <Line type="monotone" dataKey="moodEvening" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} connectNulls name="Evening" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Energy trends */}
      {energyData.length > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Energy Trends</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[1, 5]} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }} />
              <Line type="monotone" dataKey="energyMorning" stroke="#14b8a6" strokeWidth={2} dot={{ fill: '#14b8a6', r: 3 }} connectNulls name="Morning" />
              <Line type="monotone" dataKey="energyEvening" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899', r: 3 }} connectNulls name="Evening" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Task completion */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Task Completion</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-total rounded-full transition-all"
              style={{ width: `${stats.taskCompletionRate}%` }}
            />
          </div>
          <span className="text-sm text-gray-300">
            {stats.completedTasks}/{stats.totalTasks} ({stats.taskCompletionRate.toFixed(0)}%)
          </span>
        </div>
      </div>
    </div>
  )
}

function WeekNav({ weekStart, weekEnd, onPrev, onNext }: { weekStart: Date; weekEnd: Date; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button onClick={onPrev} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
        &larr;
      </button>
      <span className="text-sm text-gray-300">
        {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
      </span>
      <button onClick={onNext} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
        &rarr;
      </button>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-3 text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
