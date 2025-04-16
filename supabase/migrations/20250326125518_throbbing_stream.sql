/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp with timezone)
      - `name` (text)
      - `age` (integer)
      - `height` (integer)
      - `weight` (integer)
      - `goal` (jsonb)
      - `fitnessLevel` (text)
      - `preferredDuration` (integer)
      - `imc` (numeric)
      - `recommendedPlan` (jsonb)
      - `progress` (jsonb)
      - `achievements` (jsonb)
      - `workoutHistory` (jsonb)

  2. Security
    - Enable RLS on profiles table
    - Add policies for:
      - Users can read their own profile
      - Users can update their own profile
      - Users can insert their own profile
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  age integer NOT NULL,
  height integer NOT NULL,
  weight integer NOT NULL,
  goal jsonb NOT NULL,
  "fitnessLevel" text NOT NULL,
  "preferredDuration" integer NOT NULL,
  imc numeric,
  "recommendedPlan" jsonb,
  progress jsonb DEFAULT '{"workoutsCompleted": 0, "totalCaloriesBurned": 0, "currentStreak": 0, "longestStreak": 0, "exercisesMastered": []}'::jsonb,
  achievements jsonb DEFAULT '[]'::jsonb,
  "workoutHistory" jsonb DEFAULT '[]'::jsonb,

  CONSTRAINT fitness_level_check CHECK ("fitnessLevel" IN ('beginner', 'intermediate', 'advanced'))
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);

-- Set up secure defaults
ALTER TABLE public.profiles ALTER COLUMN progress SET DEFAULT '{"workoutsCompleted": 0, "totalCaloriesBurned": 0, "currentStreak": 0, "longestStreak": 0, "exercisesMastered": []}'::jsonb;
ALTER TABLE public.profiles ALTER COLUMN achievements SET DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ALTER COLUMN "workoutHistory" SET DEFAULT '[]'::jsonb;