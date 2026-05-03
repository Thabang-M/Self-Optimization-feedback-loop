import { useState } from 'react'
import { format, addDays, subDays } from 'date-fns'
import { useDailyLog } from '../../hooks/useDailyLog'
import ScoreDisplay from './ScoreDisplay'
import ToggleGroup from './ToggleGroup'
import RatingSelector from './RatingSelector'
import TaskSection from '../Tasks/TaskSection'
import {
  SLEEP_DURATION_OPTIONS,
  EXERCISE_OPTIONS,
  WATER_OPTIONS,
  DEEP_WORK_OPTIONS,
  LIGHT_WORK_OPTIONS,
  LEARNING_OPTIONS,
  VALUE_ADDS_OPTIONS,
} from '../../lib/scoring'
import type {
  SleepDuration,
  ExerciseRating,
  WaterRating,
  DeepWorkRating,
  LightWorkRating,
  LearningRating,
  ValueAddsRating,
} from '../../lib/types'

export default function DailyLogForm() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const { formData, loading, saving, scores, updateField, save } = useDailyLog(selectedDate)

  const navigateDate = (delta: number) => {
    const current = new Date(selectedDate + 'T00:00:00')
    const next = delta > 0 ? addDays(current, delta) : subDays(current, Math.abs(delta))
    setSelectedDate(format(next, 'yyyy-MM-dd'))
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>
  }

  return (
    <div className="space-y-4">
      {/* Date picker */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => navigateDate(-1)}
          className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
          &larr;
        </button>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={() => navigateDate(1)}
          className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
          &rarr;
        </button>
      </div>

      {/* Live score */}
      <ScoreDisplay hp={scores.hp} xp={scores.xp} total={scores.total} />

      {/* HP Section */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-hp flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-hp" />
          Health Points (HP)
        </h3>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Hit target bedtime?</label>
          <div className="flex gap-1.5">
            {[
              { val: true, label: 'Yes' },
              { val: false, label: 'No' },
            ].map(opt => (
              <button
                key={String(opt.val)}
                type="button"
                onClick={() => updateField('sleep_bedtime_hit', opt.val)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  formData.sleep_bedtime_hit === opt.val
                    ? 'bg-hp text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <ToggleGroup
          label="Sleep duration"
          options={SLEEP_DURATION_OPTIONS}
          value={formData.sleep_duration as SleepDuration | null}
          onChange={v => updateField('sleep_duration', v)}
          accentClass="bg-hp"
        />

        <RatingSelector
          label="Wake feeling (1-5)"
          value={formData.sleep_wake_feeling ?? null}
          onChange={v => updateField('sleep_wake_feeling', v)}
          accentClass="bg-hp"
        />

        <ToggleGroup
          label="Exercise"
          options={EXERCISE_OPTIONS}
          value={formData.exercise_rating as ExerciseRating | null}
          onChange={v => updateField('exercise_rating', v)}
          accentClass="bg-hp"
        />

        <RatingSelector
          label="Food quality (1-5)"
          value={formData.food_rating ?? null}
          onChange={v => updateField('food_rating', v)}
          accentClass="bg-hp"
        />

        <ToggleGroup
          label="Water intake"
          options={WATER_OPTIONS}
          value={formData.water_rating as WaterRating | null}
          onChange={v => updateField('water_rating', v)}
          accentClass="bg-hp"
        />
      </section>

      {/* XP Section */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-xp flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-xp" />
          Experience Points (XP)
        </h3>

        <ToggleGroup
          label="Deep work"
          options={DEEP_WORK_OPTIONS}
          value={formData.deep_work_rating as DeepWorkRating | null}
          onChange={v => updateField('deep_work_rating', v)}
          accentClass="bg-xp"
        />

        <ToggleGroup
          label="Light work"
          options={LIGHT_WORK_OPTIONS}
          value={formData.light_work_rating as LightWorkRating | null}
          onChange={v => updateField('light_work_rating', v)}
          accentClass="bg-xp"
        />

        <ToggleGroup
          label="Learning"
          options={LEARNING_OPTIONS}
          value={formData.learning_rating as LearningRating | null}
          onChange={v => updateField('learning_rating', v)}
          accentClass="bg-xp"
        />

        <ToggleGroup
          label="Value-adds"
          options={VALUE_ADDS_OPTIONS}
          value={formData.value_adds_rating as ValueAddsRating | null}
          onChange={v => updateField('value_adds_rating', v)}
          accentClass="bg-xp"
        />
      </section>

      {/* Mood & Energy (not scored) */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-500" />
          Mood & Energy
          <span className="text-xs text-gray-600 font-normal">(tracked, not scored)</span>
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <RatingSelector
            label="Morning mood"
            value={formData.mood_morning ?? null}
            onChange={v => updateField('mood_morning', v)}
          />
          <RatingSelector
            label="Evening mood"
            value={formData.mood_evening ?? null}
            onChange={v => updateField('mood_evening', v)}
          />
          <RatingSelector
            label="Morning energy"
            value={formData.energy_morning ?? null}
            onChange={v => updateField('energy_morning', v)}
          />
          <RatingSelector
            label="Evening energy"
            value={formData.energy_evening ?? null}
            onChange={v => updateField('energy_evening', v)}
          />
        </div>
      </section>

      {/* Food Notes */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-500" />
          Food Notes
        </h3>
        {(['breakfast_note', 'lunch_note', 'dinner_note'] as const).map(field => (
          <div key={field}>
            <label className="block text-xs text-gray-500 mb-1 capitalize">
              {field.replace('_note', '')}
            </label>
            <input
              type="text"
              value={(formData[field] as string) ?? ''}
              onChange={e => updateField(field, e.target.value || null)}
              placeholder="e.g. Eggs, toast, coffee"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>
        ))}
      </section>

      {/* Tasks */}
      <TaskSection date={selectedDate} />

      {/* Save button */}
      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl text-sm transition-colors"
      >
        {saving ? 'Saving...' : 'Save Day'}
      </button>
    </div>
  )
}
