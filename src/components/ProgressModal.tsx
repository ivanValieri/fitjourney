import { X, Flame, Clock, Dumbbell } from 'lucide-react';
import { Progress, WorkoutHistory } from '../types';

interface ProgressModalProps {
  progress: Progress;
  workoutHistory: WorkoutHistory[];
  onClose: () => void;
}

export default function ProgressModal({ progress, workoutHistory, onClose }: ProgressModalProps) {
  console.log('Renderizando ProgressModal:', { progress, workoutHistory });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Seu Progresso</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                <Flame className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Calorias Queimadas</p>
                  <p className="text-xl font-bold text-gray-900">
                    {progress?.totalCaloriesBurned || 0} kcal
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Minutos Ativos</p>
                  <p className="text-xl font-bold text-gray-900">
                    {(progress?.workoutsCompleted || 0) * 30} minutos
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                <Dumbbell className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Treinos Realizados</p>
                  <p className="text-xl font-bold text-gray-900">
                    {progress?.workoutsCompleted || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Histórico de Treinos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Histórico de Treinos</h3>
              {workoutHistory && workoutHistory.length > 0 ? (
                <ul className="space-y-3">
                  {workoutHistory.map((entry, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-sm text-gray-600">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                      <p className="font-medium">{entry.exerciseName}</p>
                      <p className="text-sm text-gray-600">
                        Calorias: {entry.caloriesBurned} kcal
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Nenhum treino registrado ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}