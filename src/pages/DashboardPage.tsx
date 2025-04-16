import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { supabase } from '../lib/supabase';
import { UserProfile, Exercise } from '../types';
import { Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          console.error('Erro ao verificar sessão:', error?.message);
          setIsLoading(false);
          return;
        }
        setSession(session);
        fetchUserProfile(session.user.id);
      } catch (err) {
        console.error('Erro inesperado:', err);
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error.message);
        setIsLoading(false);
        return;
      }

      if (data) {
        setUserProfile({
          ...data,
          goal: data.goal ? (typeof data.goal === 'string' ? JSON.parse(data.goal) : data.goal) : { type: 'weight-loss' },
          progress: data.progress || { totalCaloriesBurned: 0, workoutsCompleted: 0 },
          workoutHistory: data.workoutHistory || [],
          achievements: data.achievements || [],
          customWorkouts: data.customWorkouts || [],
          favorites: data.favorites || [],
        });
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Erro inesperado ao buscar perfil:', err);
      setIsLoading(false);
    }
  };

  const handleWorkoutComplete = async (exercise: Exercise) => {
    if (!session?.user?.id || !userProfile) {
      toast.error('Erro: Usuário não autenticado.');
      return;
    }

    const currentProgress = {
      totalCaloriesBurned: (userProfile.progress?.totalCaloriesBurned || 0) + exercise.caloriesBurned,
      workoutsCompleted: (userProfile.progress?.workoutsCompleted || 0) + 1,
    };

    const workoutHistory = {
      date: new Date().toISOString(),
      exerciseName: exercise.name,
      caloriesBurned: exercise.caloriesBurned,
      exercise
    };

    const updatedProfile = {
      ...userProfile,
      progress: currentProgress,
      workoutHistory: [...(userProfile.workoutHistory || []), workoutHistory],
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Erro ao atualizar progresso:', error.message);
        toast.error('Erro ao salvar progresso.');
        return;
      }

      setUserProfile(updatedProfile);
      toast.success('Treino concluído com sucesso!');
    } catch (err) {
      console.error('Erro inesperado:', err);
      toast.error('Erro ao salvar progresso.');
    }
  };

  const handleSelectExercise = (exercise: Exercise) => {
    // Aqui você pode implementar a lógica para selecionar um exercício
    // Por exemplo, armazenar no estado local ou abrir um modal
    toast.success(`Exercício selecionado: ${exercise.name}`);
  };

  const handleToggleFavorite = async (exerciseId: string) => {
    if (!session?.user?.id || !userProfile) {
      toast.error('Erro: Usuário não autenticado.');
      return;
    }

    let updatedFavorites: string[];

    if (userProfile.favorites.includes(exerciseId)) {
      updatedFavorites = userProfile.favorites.filter((id) => id !== exerciseId);
    } else {
      updatedFavorites = [...userProfile.favorites, exerciseId];
    }

    const updatedProfile = {
      ...userProfile,
      favorites: updatedFavorites,
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ favorites: updatedFavorites })
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Erro ao atualizar favoritos:', error.message);
        toast.error('Erro ao atualizar favoritos.');
        return;
      }

      setUserProfile(updatedProfile);
      toast.success(
        updatedFavorites.includes(exerciseId)
          ? 'Exercício adicionado aos favoritos!'
          : 'Exercício removido dos favoritos!'
      );
    } catch (err) {
      console.error('Erro inesperado:', err);
      toast.error('Erro ao atualizar favoritos.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!userProfile || !session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
            <Activity className="h-10 w-10 text-purple-600 dark:text-purple-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            É necessário fazer login
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
            Para acessar seu dashboard personalizado, faça login ou crie uma conta.
          </p>
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
      </div>
    );
  }

  return (
    <Dashboard 
      userProfile={userProfile}
      onWorkoutComplete={handleWorkoutComplete}
      onSelectExercise={handleSelectExercise}
      onToggleFavorite={handleToggleFavorite}
    />
  );
};

export default DashboardPage; 