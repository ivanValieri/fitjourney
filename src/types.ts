//agora vai

export interface Goal {
  type: 'weight-loss' | 'fitness-maintenance';
  targetCalories?: number;
  intensity?: string;
}

export interface Progress {
  totalCaloriesBurned: number;
  workoutsCompleted: number;
}

export interface WorkoutHistory {
  date: string;
  exerciseName: string;
  caloriesBurned: number;
  exercise?: Exercise;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  requirements: Array<{
    type: 'calories' | 'workouts';
    target: number;
  }>;
  title: string;
}

export interface SuitableFor {
  imcRange: {
    min?: number;
    max?: number;
  };
  ageRange: {
    min?: number;
    max?: number;
  };
}

export interface Modifications {
  easier: string[];
  harder: string[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  duration: number;
  calories: number;
  caloriesBurned: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroup: string;
  steps: string[];
  suitableFor: SuitableFor;
  modifications: Modifications;
  videoUrl?: string;
  illustrations?: Array<{ url: string; description: string }>;
  tips?: string[];
  commonMistakes?: string[];
  breathingPattern?: string;
  targetMuscles?: string[];
  secondaryMuscles?: string[];
  nutrition?: {
    preTreino: string[];
    posTreino: string[];
  };
  precautions?: string[];
  custom?: boolean;
}

export interface Macros {
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealPlan {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
}

export interface WorkoutPlan {
  daysPerWeek?: number;
  sessionsPerDay?: number;
  recommendedExercises: string[];
}

export interface RecommendedPlan {
  dailyCalories: number;
  macros: Macros;
  mealPlan: MealPlan;
  workoutPlan: WorkoutPlan;
}

export interface ThemePreferences {
  theme: 'light' | 'dark';
  gradient?: {
    startColor: string; // ex: '#FF5733'
    endColor: string;   // ex: '#C70039'
  };
  dashboardLayout?: {
    showProgress: boolean;
    showAchievements: boolean;
    showFavorites: boolean;
    showRecommended: boolean;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  timestamp: string;
  messages: ChatMessage[];
}

export interface ChatHistory {
  conversations: ChatConversation[];
  lastInteraction: string | null;
}

export interface UserProfile {
  user_id?: string;
  created_at?: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  imc?: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: Goal;
  preferredDuration: number;
  recommendedPlan?: RecommendedPlan;
  progress?: Progress;
  workoutHistory?: WorkoutHistory[];
  achievements?: Achievement[];
  customWorkouts?: Exercise[];
  favorites: string[];
  themePreferences?: ThemePreferences;
  chatHistory?: ChatHistory;
}

export interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => Promise<void>;
  onClose: () => void;
}

export interface EditProfileModalProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => Promise<void>;
  onClose: () => void;
}

export interface CreateWorkoutModalProps {
  onSave: (workout: Exercise) => void;
  onClose: () => void;
}

export interface ProgressModalProps {
  profile: UserProfile;
  onClose: () => void;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
}

export interface WorkoutHistory {
  date: string;
  exerciseName: string;
  caloriesBurned: number;
  exercise?: Exercise;
}