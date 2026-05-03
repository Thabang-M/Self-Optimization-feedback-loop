import type {
  DailyLog,
  SleepDuration,
  ExerciseRating,
  WaterRating,
  DeepWorkRating,
  LightWorkRating,
  LearningRating,
  ValueAddsRating,
  ScoreInfo,
} from './types'

const SLEEP_DURATION_POINTS: Record<SleepDuration, number> = {
  under_5: 0,
  '5': 0.5,
  '6': 1,
  '7_8': 1.5,
}

const EXERCISE_POINTS: Record<ExerciseRating, number> = {
  none: 0,
  light: 1,
  moderate: 2,
  intense: 3,
}

const WATER_POINTS: Record<WaterRating, number> = {
  under_1L: 0,
  '1_2L': 0.5,
  '2L_plus': 1,
}

const DEEP_WORK_POINTS: Record<DeepWorkRating, number> = {
  '0hrs': 0,
  under_1hr: 1,
  '1_2hrs': 2,
  '2_3hrs': 3,
  '3_plus': 4,
}

const LIGHT_WORK_POINTS: Record<LightWorkRating, number> = {
  nothing: 0,
  some: 1,
  full_load: 2,
}

const LEARNING_POINTS: Record<LearningRating, number> = {
  nothing: 0,
  passive: 1,
  active: 2,
}

const VALUE_ADDS_POINTS: Record<ValueAddsRating, number> = {
  nothing: 0,
  meaningful: 1,
  breakthrough: 2,
}

function wakeFeelingPoints(rating: number | null): number {
  if (!rating) return 0
  return (rating - 1) * 0.375
}

function foodPoints(rating: number | null): number {
  if (!rating) return 0
  return (rating - 1) * 0.5
}

export function calculateHP(log: Partial<DailyLog>): number {
  let hp = 0
  if (log.sleep_bedtime_hit) hp += 1
  if (log.sleep_duration) hp += SLEEP_DURATION_POINTS[log.sleep_duration]
  hp += wakeFeelingPoints(log.sleep_wake_feeling ?? null)
  if (log.exercise_rating) hp += EXERCISE_POINTS[log.exercise_rating]
  hp += foodPoints(log.food_rating ?? null)
  if (log.water_rating) hp += WATER_POINTS[log.water_rating]
  return Math.min(hp, 10)
}

export function calculateXP(log: Partial<DailyLog>): number {
  let xp = 0
  if (log.deep_work_rating) xp += DEEP_WORK_POINTS[log.deep_work_rating]
  if (log.light_work_rating) xp += LIGHT_WORK_POINTS[log.light_work_rating]
  if (log.learning_rating) xp += LEARNING_POINTS[log.learning_rating]
  if (log.value_adds_rating) xp += VALUE_ADDS_POINTS[log.value_adds_rating]
  return Math.min(xp, 10)
}

export function calculateTotal(log: Partial<DailyLog>): { hp: number; xp: number; total: number } {
  const hp = calculateHP(log)
  const xp = calculateXP(log)
  return { hp, xp, total: hp + xp }
}

export function getScoreInfo(total: number): ScoreInfo {
  if (total >= 17) return { label: 'Elite Day', color: '#22c55e', bgClass: 'bg-elite', textClass: 'text-elite' }
  if (total >= 13) return { label: 'Strong Day', color: '#86efac', bgClass: 'bg-strong', textClass: 'text-strong' }
  if (total >= 9) return { label: 'Average Day', color: '#eab308', bgClass: 'bg-average', textClass: 'text-average' }
  if (total >= 5) return { label: 'Off Day', color: '#f97316', bgClass: 'bg-off', textClass: 'text-off' }
  return { label: 'Recovery Day', color: '#ef4444', bgClass: 'bg-recovery', textClass: 'text-recovery' }
}

export const HP_RUBRIC = [
  { category: 'Sleep: Bedtime', options: ['Hit target = 1pt', 'Missed = 0pt'], max: 1 },
  { category: 'Sleep: Duration', options: ['Under 5h = 0', '5h = 0.5', '6h = 1', '7-8h = 1.5'], max: 1.5 },
  { category: 'Sleep: Wake Feeling', options: ['1 = 0', '2 = 0.375', '3 = 0.75', '4 = 1.125', '5 = 1.5'], max: 1.5 },
  { category: 'Exercise', options: ['None = 0', 'Light = 1', 'Moderate = 2', 'Intense = 3'], max: 3 },
  { category: 'Food Quality', options: ['1 = 0', '2 = 0.5', '3 = 1', '4 = 1.5', '5 = 2'], max: 2 },
  { category: 'Water Intake', options: ['Under 1L = 0', '1-2L = 0.5', '2L+ = 1'], max: 1 },
]

export const XP_RUBRIC = [
  { category: 'Deep Work', options: ['0hrs = 0', '<1hr = 1', '1-2hrs = 2', '2-3hrs = 3', '3+ = 4'], max: 4 },
  { category: 'Light Work', options: ['Nothing = 0', 'Some = 1', 'Full load = 2'], max: 2 },
  { category: 'Learning', options: ['Nothing = 0', 'Passive = 1', 'Active = 2'], max: 2 },
  { category: 'Value-adds', options: ['Nothing = 0', 'Meaningful = 1', 'Breakthrough = 2'], max: 2 },
]

export const SLEEP_DURATION_OPTIONS: { value: SleepDuration; label: string }[] = [
  { value: 'under_5', label: 'Under 5h' },
  { value: '5', label: '5 hours' },
  { value: '6', label: '6 hours' },
  { value: '7_8', label: '7-8 hours' },
]

export const EXERCISE_OPTIONS: { value: ExerciseRating; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'intense', label: 'Intense' },
]

export const WATER_OPTIONS: { value: WaterRating; label: string }[] = [
  { value: 'under_1L', label: 'Under 1L' },
  { value: '1_2L', label: '1-2L' },
  { value: '2L_plus', label: '2L+' },
]

export const DEEP_WORK_OPTIONS: { value: DeepWorkRating; label: string }[] = [
  { value: '0hrs', label: '0 hrs' },
  { value: 'under_1hr', label: '<1 hr' },
  { value: '1_2hrs', label: '1-2 hrs' },
  { value: '2_3hrs', label: '2-3 hrs' },
  { value: '3_plus', label: '3+ hrs' },
]

export const LIGHT_WORK_OPTIONS: { value: LightWorkRating; label: string }[] = [
  { value: 'nothing', label: 'Nothing' },
  { value: 'some', label: 'Some' },
  { value: 'full_load', label: 'Full Load' },
]

export const LEARNING_OPTIONS: { value: LearningRating; label: string }[] = [
  { value: 'nothing', label: 'Nothing' },
  { value: 'passive', label: 'Passive' },
  { value: 'active', label: 'Active' },
]

export const VALUE_ADDS_OPTIONS: { value: ValueAddsRating; label: string }[] = [
  { value: 'nothing', label: 'Nothing' },
  { value: 'meaningful', label: 'Meaningful' },
  { value: 'breakthrough', label: 'Breakthrough' },
]
