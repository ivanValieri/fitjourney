import { UserProfile, Exercise, WorkoutHistory, Progress } from '../types';

export interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => Promise<void>;
  onClose: () => void;
}

export interface EditProfileModalProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => Promise<void>;
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

export interface ChatbotProps {
  userProfile: UserProfile;
  onWorkoutComplete: (exercise: Exercise) => Promise<void>;
} 