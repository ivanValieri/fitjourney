import { X, Trophy } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export default function AchievementsModal({ achievements, onClose }: AchievementsModalProps) {
  console.log('Renderizando AchievementsModal:', { achievements });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Suas Conquistas</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            {achievements && achievements.length > 0 ? (
              achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center space-x-3 p-4 rounded-xl ${
                    achievement.completed ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <Trophy
                    className={`h-8 w-8 ${
                      achievement.completed ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{achievement.name}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-sm font-semibold">
                      {achievement.completed ? 'Concluído!' : 'Em progresso...'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Nenhuma conquista disponível no momento.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}