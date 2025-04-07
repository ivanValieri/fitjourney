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
  name: string;
  age: number;
  height: number;
  weight: number;
  goal: Goal;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  preferredDuration: number;
  imc: number;
  favorites?: string[];
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