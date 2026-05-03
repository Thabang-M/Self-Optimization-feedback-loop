interface Props {
  label: string
  value: number | null
  onChange: (value: number) => void
  max?: number
  accentClass?: string
}

export default function RatingSelector({
  label,
  value,
  onChange,
  max = 5,
  accentClass = 'bg-purple-600',
}: Props) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <div className="flex gap-1.5">
        {Array.from({ length: max }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              value === n
                ? `${accentClass} text-white`
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
