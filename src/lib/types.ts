export type SleepDuration = 'under_5' | '5' | '6' | '7_8'
export type ExerciseRating = 'none' | 'light' | 'moderate' | 'intense'
export type WaterRating = 'under_1L' | '1_2L' | '2L_plus'
export type DeepWorkRating = '0hrs' | 'under_1hr' | '1_2hrs' | '2_3hrs' | '3_plus'
export type LightWorkRating = 'nothing' | 'some' | 'full_load'
export type LearningRating = 'nothing' | 'passive' | 'active'
export type ValueAddsRating = 'nothing' | 'meaningful' | 'breakthrough'
export type TaskStatus = 'active' | 'completed' | 'delegated' | 'deleted' | 'broken_down'

export interface DailyLog {
  id?: string
  user_id: string
  log_date: string
  sleep_bedtime_hit: boolean | null
  sleep_duration: SleepDuration | null
  sleep_wake_feeling: number | null
  exercise_rating: ExerciseRating | null
  food_rating: number | null
  water_rating: WaterRating | null
  deep_work_rating: DeepWorkRating | null
  light_work_rating: LightWorkRating | null
  learning_rating: LearningRating | null
  value_adds_rating: ValueAddsRating | null
  hp_score: number | null
  xp_score: number | null
  total_score: number | null
  mood_morning: number | null
  mood_evening: number | null
  energy_morning: number | null
  energy_evening: number | null
  breakfast_note: string | null
  lunch_note: string | null
  dinner_note: string | null
  created_at?: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  created_date: string
  target_date: string
  completed_date: string | null
  status: TaskStatus
  carry_over_count: number
  created_at?: string
}

export interface Profile {
  id: string
  display_name: string | null
  created_at?: string
}

export type ScoreLabel = 'Elite Day' | 'Strong Day' | 'Average Day' | 'Off Day' | 'Recovery Day'

export interface ScoreInfo {
  label: ScoreLabel
  color: string
  bgClass: string
  textClass: string
}
