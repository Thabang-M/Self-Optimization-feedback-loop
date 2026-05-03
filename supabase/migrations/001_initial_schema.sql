-- Profiles table (extends Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Daily logs table
create table if not exists daily_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  log_date date not null,
  sleep_bedtime_hit boolean,
  sleep_duration text check (sleep_duration in ('under_5', '5', '6', '7_8')),
  sleep_wake_feeling integer check (sleep_wake_feeling between 1 and 5),
  exercise_rating text check (exercise_rating in ('none', 'light', 'moderate', 'intense')),
  food_rating integer check (food_rating between 1 and 5),
  water_rating text check (water_rating in ('under_1L', '1_2L', '2L_plus')),
  deep_work_rating text check (deep_work_rating in ('0hrs', 'under_1hr', '1_2hrs', '2_3hrs', '3_plus')),
  light_work_rating text check (light_work_rating in ('nothing', 'some', 'full_load')),
  learning_rating text check (learning_rating in ('nothing', 'passive', 'active')),
  value_adds_rating text check (value_adds_rating in ('nothing', 'meaningful', 'breakthrough')),
  hp_score numeric,
  xp_score numeric,
  total_score numeric,
  mood_morning integer check (mood_morning between 1 and 5),
  mood_evening integer check (mood_evening between 1 and 5),
  energy_morning integer check (energy_morning between 1 and 5),
  energy_evening integer check (energy_evening between 1 and 5),
  breakfast_note text,
  lunch_note text,
  dinner_note text,
  created_at timestamptz default now(),
  unique (user_id, log_date)
);

alter table daily_logs enable row level security;

create policy "Users can view own logs"
  on daily_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own logs"
  on daily_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own logs"
  on daily_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own logs"
  on daily_logs for delete
  using (auth.uid() = user_id);

-- Tasks table
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  created_date date not null default current_date,
  target_date date not null,
  completed_date date,
  status text default 'active' check (status in ('active', 'completed', 'delegated', 'deleted', 'broken_down')),
  carry_over_count integer default 0,
  created_at timestamptz default now()
);

alter table tasks enable row level security;

create policy "Users can view own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on tasks for delete
  using (auth.uid() = user_id);
