export type Exercise = {
  id: string;
  name: string;
  description: string;
  equipment?: string[];
  tips?: string[];
  commonMistakes?: string[];
  targetMuscles?: string[];
  secondaryMuscles?: string[];
  nutrition?: {
    preTreino?: string[];
    posTreino?: string[];
  };
  duration?: number;
  calories?: number;
  steps?: string[];
  imageUrl?: string;
  difficulty?: string;
  muscleGroup?: string;
  suitableFor?: {
    imcRange?: {
      min?: number;
      max?: number;
    };
    ageRange?: {
      min?: number;
      max?: number;
    };
  };
  modifications?: {
    easier?: string[];
    harder?: string[];
  };
};

export type UserProfile = {
  user_id?: string;
  created_at?: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  goal: Goal;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  preferredDuration: number;
  imc: number;
  progress?: Progress;
  workoutHistory?: WorkoutHistory[];
  achievements?: Achievement[];
  customWorkouts?: Exercise[];
  favorites: string[];
  themePreferences?: ThemePreferences;
  chatHistory?: ChatHistory;
};

export type Goal = {
  type: "weight-loss" | "fitness-maintenance";
  intensity?: string;
};

export type RecommendedPlan = {
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  mealPlan: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  workoutPlan: {
    daysPerWeek: number;
    sessionsPerDay: number;
    recommendedExercises: string[];
  };
};

export type Progress = {
  totalCaloriesBurned: number;
  workoutsCompleted: number;
};

export type WorkoutHistory = {
  date: string;
  exerciseName: string;
  caloriesBurned: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon?: string;
};

export type ThemePreferences = {
  darkMode: boolean;
  primaryColor: string;
  secondaryColor: string;
};

export type ChatHistory = {
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
};

// Função de validação para garantir que um objeto é um UserProfile válido
export function isValidUserProfile(profile: any): profile is UserProfile {
  return (
    typeof profile === 'object' &&
    typeof profile.name === 'string' &&
    typeof profile.age === 'number' &&
    typeof profile.height === 'number' &&
    typeof profile.weight === 'number' &&
    typeof profile.goal === 'object' &&
    typeof profile.fitnessLevel === 'string' &&
    ['beginner', 'intermediate', 'advanced'].includes(profile.fitnessLevel) &&
    typeof profile.preferredDuration === 'number' &&
    typeof profile.imc === 'number' &&
    Array.isArray(profile.favorites)
  );
} 