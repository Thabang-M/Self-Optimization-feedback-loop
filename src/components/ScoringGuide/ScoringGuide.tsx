import { HP_RUBRIC, XP_RUBRIC, getScoreInfo } from '../../lib/scoring'

const SCORE_LABELS = [
  { range: '17-20', label: 'Elite Day' },
  { range: '13-16', label: 'Strong Day' },
  { range: '9-12', label: 'Average Day' },
  { range: '5-8', label: 'Off Day' },
  { range: '0-4', label: 'Recovery Day' },
] as const

export default function ScoringGuide() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Scoring Guide</h2>

      {/* Score labels */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Score Labels</h3>
        <div className="space-y-2">
          {SCORE_LABELS.map(({ range, label }) => {
            const midpoint = parseInt(range.split('-')[0])
            const info = getScoreInfo(midpoint)
            return (
              <div key={range} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }} />
                <span className="text-sm text-gray-300 w-16">{range}</span>
                <span className="text-sm font-medium" style={{ color: info.color }}>{label}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* HP Rubric */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-hp mb-3">HP — Health Points (max 10)</h3>
        <div className="space-y-3">
          {HP_RUBRIC.map(item => (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-300">{item.category}</span>
                <span className="text-xs text-gray-500">max {item.max}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.options.map(opt => (
                  <span key={opt} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* XP Rubric */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-xp mb-3">XP — Experience Points (max 10)</h3>
        <div className="space-y-3">
          {XP_RUBRIC.map(item => (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-300">{item.category}</span>
                <span className="text-xs text-gray-500">max {item.max}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.options.map(opt => (
                  <span key={opt} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-sm text-gray-400 space-y-2">
        <p>Mood and energy ratings (1-5) are tracked but <strong className="text-gray-300">not</strong> included in the score.</p>
        <p>Food notes are for recall only — the food quality rating (1-5) drives the score.</p>
        <p>Maximum 3 priority tasks per day. Tasks carried over 3+ times must be resolved.</p>
      </section>
    </div>
  )
}
