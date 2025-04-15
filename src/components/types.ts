import { UserProfile, Exercise, WorkoutHistory, Progress } from '../types';

export interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => Promise<void>;
}

export interface EditProfileModalProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => Promise<void>;
  onClose: () => void;
}

export interface CreateWorkoutModalProps {
  onCreate: (workout: Exercise) => void;
  onClose: () => void;
}

export interface ProgressModalProps {
  progress: Progress;
  workoutHistory: WorkoutHistory[];
  onClose: () => void;
}

export interface ChatbotProps {
  onWorkoutComplete: (exercise: Exercise) => Promise<void>;
} 