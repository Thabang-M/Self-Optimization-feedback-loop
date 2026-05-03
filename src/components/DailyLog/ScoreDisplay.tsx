import { getScoreInfo } from '../../lib/scoring'

interface Props {
  hp: number
  xp: number
  total: number
}

export default function ScoreDisplay({ hp, xp, total }: Props) {
  const info = getScoreInfo(total)

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 sticky top-24 z-30">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-400">Today's Score</span>
        <span className={`text-sm font-bold ${info.textClass}`}>{info.label}</span>
      </div>
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>HP</span>
            <span className="text-hp">{hp.toFixed(1)}/10</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-hp rounded-full transition-all duration-300"
              style={{ width: `${(hp / 10) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>XP</span>
            <span className="text-xp">{xp.toFixed(1)}/10</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-xp rounded-full transition-all duration-300"
              style={{ width: `${(xp / 10) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-center min-w-[60px]">
          <div className="text-2xl font-bold" style={{ color: info.color }}>
            {total.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500">/20</div>
        </div>
      </div>
    </div>
  )
}
