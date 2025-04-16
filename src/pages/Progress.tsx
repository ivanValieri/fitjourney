import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Trophy, Flame, Clock, Dumbbell } from 'lucide-react';

const Progress: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Seu Progresso
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
            <Activity className="h-10 w-10 text-purple-600 dark:text-purple-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            É necessário fazer login
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Para visualizar e acompanhar seu progresso, faça login ou crie uma conta.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Fazer Login
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Voltar para Home
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
            Conquistas Desbloqueadas
          </h3>
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 opacity-50">
              <div className="flex items-center">
                <div className="rounded-full bg-gray-200 dark:bg-gray-600 p-2 mr-3">
                  <Flame className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Primeira Conquista</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complete seu primeiro treino</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 opacity-50">
              <div className="flex items-center">
                <div className="rounded-full bg-gray-200 dark:bg-gray-600 p-2 mr-3">
                  <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Constância</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complete 5 treinos em uma semana</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Dumbbell className="h-5 w-5 text-purple-500 mr-2" />
            Estatísticas de Treino
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Treinos Completados</span>
                <span className="font-semibold text-gray-900 dark:text-white">0</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Calorias Queimadas</span>
                <span className="font-semibold text-gray-900 dark:text-white">0 kcal</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Minutos Ativos</span>
                <span className="font-semibold text-gray-900 dark:text-white">0 min</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress; 