import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Filter, Search } from 'lucide-react';
import { BASE_EXERCISES } from '../data/exercises';

const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  
  // Filtragem dos exercícios
  const filteredExercises = BASE_EXERCISES.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                          (filter === 'beginner' && exercise.difficulty === 'beginner') ||
                          (filter === 'intermediate' && exercise.difficulty === 'intermediate') ||
                          (filter === 'advanced' && exercise.difficulty === 'advanced');
    
    return matchesSearch && matchesFilter;
  });
  
  // Organizar exercícios por grupos musculares
  const exercisesByMuscleGroup = filteredExercises.reduce((acc, exercise) => {
    if (!acc[exercise.muscleGroup]) {
      acc[exercise.muscleGroup] = [];
    }
    acc[exercise.muscleGroup].push(exercise);
    return acc;
  }, {} as Record<string, typeof BASE_EXERCISES>);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Treinos Disponíveis
      </h1>
      
      {/* Barra de pesquisa e filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar exercícios..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <select
            className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos os níveis</option>
            <option value="beginner">Iniciante</option>
            <option value="intermediate">Intermediário</option>
            <option value="advanced">Avançado</option>
          </select>
        </div>
      </div>
      
      {/* Lista de exercícios por grupo muscular */}
      {Object.keys(exercisesByMuscleGroup).length > 0 ? (
        Object.entries(exercisesByMuscleGroup).map(([muscleGroup, exercises]) => (
          <div key={muscleGroup} className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 capitalize">
              {muscleGroup.replace('_', ' ')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((exercise) => (
                <div 
                  key={exercise.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/workout/${exercise.id}`)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                      <Dumbbell className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {exercise.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {exercise.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                        {exercise.duration} min
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {exercise.caloriesBurned} kcal
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {exercise.difficulty === 'beginner' ? 'Iniciante' :
                       exercise.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10">
          <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Nenhum exercício encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Tente ajustar seus filtros ou termos de busca.
          </p>
        </div>
      )}
    </div>
  );
};

export default Workouts; 