import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, Exercise } from '../types';
import { BASE_EXERCISES } from '../data/exercises';
import { Flame, Clock, Dumbbell, Trophy, Target, Activity, Scale } from 'lucide-react';
import WorkoutCard from './WorkoutCard';

interface DashboardProps {
  userProfile: UserProfile;
  onWorkoutComplete: (exercise: Exercise) => Promise<void>;
  onSelectExercise: (exercise: Exercise) => void;
  onToggleFavorite: (exerciseId: string) => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  onWorkoutComplete,
  onSelectExercise,
  onToggleFavorite
}) => {
  const navigate = useNavigate();
  
  // Filtra exercícios recomendados com base no nível de condicionamento e IMC do usuário
  const recommendedExercises = BASE_EXERCISES.filter(exercise => {
    const isSuitableForIMC =
      exercise.suitableFor.imcRange.min === undefined ||
      exercise.suitableFor.imcRange.min <= (userProfile.imc || 0);
    
    const isSuitableForDifficulty = 
      (userProfile.fitnessLevel === 'beginner' && exercise.difficulty === 'beginner') ||
      (userProfile.fitnessLevel === 'intermediate' && 
        (exercise.difficulty === 'beginner' || exercise.difficulty === 'intermediate')) ||
      (userProfile.fitnessLevel === 'advanced');
    
    return isSuitableForIMC && isSuitableForDifficulty;
  }).slice(0, 5); // Limita a 5 exercícios recomendados
  
  // Calcula o plano diário
  const calculateDailyCalorieTarget = () => {
    // Cálculo básico de calorias baseado no peso, altura, idade e nível de atividade
    // Como não temos o sexo na interface UserProfile, vamos usar uma abordagem simplificada
    // baseada na fórmula de Harris-Benedict, assumindo sexo baseado na média de IMC
    const isLikelyMale = (userProfile.imc || 0) > 26 || userProfile.height > 175;
    
    const bmr = isLikelyMale
      ? 88.36 + (13.4 * userProfile.weight) + (4.8 * userProfile.height) - (5.7 * userProfile.age)
      : 447.6 + (9.2 * userProfile.weight) + (3.1 * userProfile.height) - (4.3 * userProfile.age);
    
    // Multiplicador baseado no nível de atividade
    const activityMultiplier = 
      userProfile.fitnessLevel === 'beginner' ? 1.2 :
      userProfile.fitnessLevel === 'intermediate' ? 1.55 : 1.9;
    
    // Calorias diárias = BMR * multiplicador
    const maintenanceCalories = bmr * activityMultiplier;
    
    // Se o objetivo for perda de peso, reduz em 15-20%
    return userProfile.goal.type === 'weight-loss'
      ? Math.round(maintenanceCalories * 0.85)
      : Math.round(maintenanceCalories);
  };

  const dailyCalories = calculateDailyCalorieTarget();
  
  // Plano alimentar sugerido
  const mealPlan = {
    breakfast: ['Ovos mexidos', 'Torrada integral', 'Abacate', 'Café preto'],
    lunch: ['Peito de frango grelhado', 'Arroz integral', 'Legumes no vapor', 'Salada verde'],
    dinner: ['Peixe assado', 'Batata doce', 'Brócolis', 'Azeite de oliva'],
    snacks: ['Iogurte grego com frutas', 'Amêndoas', 'Banana com pasta de amendoim']
  };

  return (
    <div className="dashboard">
      {/* Cabeçalho de boas-vindas */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Olá, {userProfile.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Bem-vindo de volta ao seu plano de fitness personalizado.
        </p>
      </section>

      {/* Status cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div className="flex items-center mb-2">
            <Scale className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">IMC</h2>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {userProfile.imc?.toFixed(1) || 'N/A'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {userProfile.imc ? 
              (userProfile.imc < 18.5 ? 'Abaixo do peso' : 
               userProfile.imc < 25 ? 'Peso normal' : 
               userProfile.imc < 30 ? 'Sobrepeso' : 'Obesidade')
             : 'Não calculado'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 text-green-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Condicionamento</h2>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {userProfile.fitnessLevel}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nível de preparo físico
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div className="flex items-center mb-2">
            <Target className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Objetivo</h2>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {userProfile.goal.type === 'weight-loss' ? 'Perda de Peso' : 'Manter Forma'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Objetivo principal
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Duração</h2>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {userProfile.preferredDuration} min
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Duração preferida de treino
          </p>
        </div>
      </section>

      {/* Plano diário */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Plano Diário
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-300">Meta de Calorias</span>
                <span className="font-semibold text-gray-900 dark:text-white">{dailyCalories} kcal</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, ((userProfile.progress?.totalCaloriesBurned || 0) / dailyCalories) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Plano de Treino</h3>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                  <Dumbbell className="h-4 w-4 mr-2 text-purple-500" />
                  {recommendedExercises[0]?.name || 'Cardio moderado'}
                </li>
                <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                  <Dumbbell className="h-4 w-4 mr-2 text-purple-500" />
                  {recommendedExercises[1]?.name || 'Treino de força'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Plano alimentar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Plano Alimentar Recomendado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Café da Manhã</h3>
              <ul className="space-y-1">
                {mealPlan.breakfast.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-300">• {item}</li>
                ))}
              </ul>
              
              <h3 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">Almoço</h3>
              <ul className="space-y-1">
                {mealPlan.lunch.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-300">• {item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Jantar</h3>
              <ul className="space-y-1">
                {mealPlan.dinner.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-300">• {item}</li>
                ))}
              </ul>
              
              <h3 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">Lanches</h3>
              <ul className="space-y-1">
                {mealPlan.snacks.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-300">• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div className="flex items-center mb-2">
            <Flame className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Calorias Queimadas</h2>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {userProfile.progress?.totalCaloriesBurned || 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total acumulado
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Minutos Ativos</h2>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {(userProfile.progress?.workoutsCompleted || 0) * userProfile.preferredDuration}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total de minutos
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div className="flex items-center mb-2">
            <Dumbbell className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Treinos Realizados</h2>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {userProfile.progress?.workoutsCompleted || 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total de treinos
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div className="flex items-center mb-2">
            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Conquistas</h2>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {userProfile.achievements?.filter(a => a.completed).length || 0}/{userProfile.achievements?.length || 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Desafios concluídos
          </p>
        </div>
      </section>

      {/* Recommended Workouts */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Treinos Recomendados para Hoje
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedExercises.map((exercise) => (
            <WorkoutCard
              key={exercise.id}
              exercise={exercise}
              onClick={() => onSelectExercise(exercise)}
              onComplete={onWorkoutComplete}
              favorites={userProfile.favorites || []}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 