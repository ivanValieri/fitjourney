import React from 'react';
import { useState } from 'react';
import { X, BarChart, Calendar, ArrowUpCircle } from 'lucide-react';
import { WorkoutHistory } from '../types';
import { ProgressModalProps } from './types';

const ProgressModal: React.FC<ProgressModalProps> = ({ progress, workoutHistory, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden">
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

          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-4">
              <button
                className={`pb-4 px-1 ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-purple-600 text-purple-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Visão Geral
              </button>
              <button
                className={`pb-4 px-1 ${
                  activeTab === 'history'
                    ? 'border-b-2 border-purple-600 text-purple-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('history')}
              >
                Histórico de Treinos
              </button>
            </div>
          </div>

          {activeTab === 'overview' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <BarChart className="h-8 w-8 text-orange-500 mr-3" />
                  <h3 className="text-xl font-semibold">Calorias Queimadas</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {progress.totalCaloriesBurned.toLocaleString('pt-BR')} kcal
                </p>
                <p className="text-gray-500 mt-2">Total acumulado</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <Calendar className="h-8 w-8 text-green-500 mr-3" />
                  <h3 className="text-xl font-semibold">Treinos Concluídos</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {progress.workoutsCompleted}
                </p>
                <p className="text-gray-500 mt-2">Total de treinos</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {workoutHistory.length > 0 ? (
                workoutHistory.map((workout, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg">{workout.exerciseName}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(workout.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ArrowUpCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>{workout.caloriesBurned} kcal queimadas</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum treino registrado ainda.</p>
                  <p className="text-sm mt-2">
                    Complete alguns treinos para ver seu histórico aqui.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;