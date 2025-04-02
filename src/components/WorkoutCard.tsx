import React from 'react';
import { Exercise } from '../types';
import { Clock, Flame, Dumbbell, Heart } from 'lucide-react';

interface WorkoutCardProps {
  exercise: Exercise;
  onClick: () => void;
  onComplete: (exercise: Exercise) => void;
  favorites?: string[];
  onToggleFavorite?: (exerciseId: string) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  exercise,
  onClick,
  onComplete,
  favorites = [],
  onToggleFavorite,
}) => {
  const isFavorite = favorites.includes(exercise.id);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={exercise.imageUrl}
          alt={exercise.name}
          className="w-full h-48 object-cover"
        />
        {/* Botão de Favoritar */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(exercise.id);
            }}
            className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500 dark:text-gray-400'}`}
            />
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exercise.name}</h3>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
              exercise.difficulty === 'beginner'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : exercise.difficulty === 'intermediate'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {exercise.difficulty === 'beginner'
              ? 'Iniciante'
              : exercise.difficulty === 'intermediate'
              ? 'Intermediário'
              : 'Avançado'}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{exercise.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{exercise.duration} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Flame className="h-4 w-4" />
            <span>{exercise.calories} kcal</span>
          </div>
          <div className="flex items-center space-x-1">
            <Dumbbell className="h-4 w-4" />
            <span>{exercise.muscleGroup}</span>
          </div>
        </div>
        {/* Adaptações disponíveis */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adaptações disponíveis:</div>
          <div className="flex flex-wrap gap-2">
            {exercise.modifications.easier.length > 0 && (
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                Versão mais fácil disponível
              </span>
            )}
            {exercise.modifications.harder.length > 0 && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full text-xs">
                Versão mais difícil disponível
              </span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete(exercise);
          }}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Completar Treino
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;