import Chatbot from './components/Chatbot';
import React, { useState, useMemo, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ProfileSetup from './components/ProfileSetup';
import WorkoutCard from './components/WorkoutCard';
import ExerciseTutorial from './components/ExerciseTutorial';
import ProgressModal from './components/ProgressModal';
import AchievementsModal from './components/AchievementsModal';
import AuthModal from './components/AuthModal';
import EditProfileModal from './components/EditProfileModal';
import CreateWorkoutModal from './components/CreateWorkoutModal';
import { Exercise, UserProfile } from './types';
import { Activity, Target, Flame, Clock, Dumbbell, Trophy, Scale, Pencil } from 'lucide-react';
import { BASE_EXERCISES } from './data/exercises';
import { ACHIEVEMENTS } from './data/achievements';
import { supabase } from './lib/supabase';
import toast from 'react-hot-toast';
import { useTheme } from './context/ThemeContext';
import { askMistral } from './api/mistral'; // Adicionei esta linha

// Adicione ESTE console.log logo após os imports:
console.log("DEBUG: mistral.ts carregado?", typeof askMistral !== 'undefined');

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const { gradient } = useTheme();

  useEffect(() => {
    console.log('Inicializando App.tsx - Verificando sessão...');
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Erro ao obter sessão:', error.message);
          toast.error('Erro ao verificar autenticação. Faça login novamente.');
          await supabase.auth.signOut();
          setSession(null);
          return;
        }
        console.log('Sessão obtida:', session);
        setSession(session);
        if (session) {
          fetchUserProfile(session.user.id);
        }
      } catch (err: any) {
        console.error('Erro inesperado ao inicializar sessão:', err.message);
        toast.error('Erro inesperado. Faça login novamente.');
        setSession(null);
      }
    };

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session);
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setShowProfileSetup(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro ao fazer logout:', error.message);
        toast.error('Erro ao fazer logout.');
        return;
      }
      setSession(null);
      setUserProfile(null);
      setShowProfileSetup(false);
      toast.success('Logout realizado com sucesso!');
    } catch (err: any) {
      console.error('Erro inesperado ao fazer logout:', err.message);
      toast.error('Erro inesperado ao fazer logout.');
    }
  };

  const fetchUserProfile = async (userId: string) => {
    console.log('Buscando perfil do usuário:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === '42P01') {
        console.error('Tabela "profiles" não existe no Supabase:', error.message);
        toast.error('Configuração do banco de dados pendente. Contate o suporte.');
      } else {
        console.error('Erro ao buscar perfil:', error.message);
        toast.error('Erro ao carregar perfil.');
      }
      setShowProfileSetup(true);
      return;
    }

    if (data) {
      console.log('Perfil encontrado:', data);
      const formattedProfile: UserProfile = {
        ...data,
        goal: data.goal ? (typeof data.goal === 'string' ? JSON.parse(data.goal) : data.goal) : { type: 'weight-loss' },
        progress: data.progress || { totalCaloriesBurned: 0, workoutsCompleted: 0 },
        workoutHistory: data.workoutHistory || [],
        achievements: data.achievements && data.achievements.length > 0 ? data.achievements : ACHIEVEMENTS,
        customWorkouts: data.customWorkouts || [],
        favorites: data.favorites || [],
      };
      console.log('Perfil formatado:', formattedProfile);
      setUserProfile(formattedProfile);
      setShowProfileSetup(false);
    } else {
      console.log('Nenhum perfil encontrado, mostrando ProfileSetup');
      setShowProfileSetup(true);
    }
  };

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    if (!session?.user?.id) {
      toast.error('Erro: Usuário não autenticado.');
      return;
    }

    console.log('Atualizando perfil:', updatedProfile);
    const { error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Erro ao atualizar perfil:', error.message);
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
      return;
    }

    setUserProfile({ ...userProfile, ...updatedProfile });
    setShowEditProfile(false);
    toast.success('Perfil atualizado com sucesso!');
  };

  const updateAchievements = (currentProgress: { totalCaloriesBurned: number; workoutsCompleted: number }) => {
    if (!userProfile || !session?.user?.id) {
      console.log('updateAchievements: userProfile ou session não disponível');
      return { achievements: userProfile?.achievements || ACHIEVEMENTS };
    }

    console.log('Verificando conquistas com progresso:', currentProgress);
    console.log('Conquistas atuais:', userProfile.achievements);

    const updatedAchievements = (userProfile.achievements || ACHIEVEMENTS).map((achievement) => {
      if (achievement.completed) {
        console.log(`Conquista ${achievement.id} já está concluída`);
        return achievement;
      }

      let updatedAchievement = { ...achievement };
      switch (achievement.id) {
        case 'first-workout':
          console.log(`Verificando first-workout: workoutsCompleted = ${currentProgress.workoutsCompleted}`);
          if (currentProgress.workoutsCompleted >= 1) {
            console.log('Desbloqueando conquista: Primeiro Treino');
            toast.success('Conquista desbloqueada: Primeiro Treino!');
            updatedAchievement = { ...achievement, completed: true };
          }
          break;
        case 'five-workouts':
          console.log(`Verificando five-workouts: workoutsCompleted = ${currentProgress.workoutsCompleted}`);
          if (currentProgress.workoutsCompleted >= 5) {
            console.log('Desbloqueando conquista: 5 Treinos Completos');
            toast.success('Conquista desbloqueada: 5 Treinos Completos!');
            updatedAchievement = { ...achievement, completed: true };
          }
          break;
        case 'burn-500-calories':
          console.log(`Verificando burn-500-calories: totalCaloriesBurned = ${currentProgress.totalCaloriesBurned}`);
          if (currentProgress.totalCaloriesBurned >= 500) {
            console.log('Desbloqueando conquista: Queimador de Calorias');
            toast.success('Conquista desbloqueada: Queimador de Calorias!');
            updatedAchievement = { ...achievement, completed: true };
          }
          break;
        default:
          console.log(`Conquista ${achievement.id} não reconhecida`);
          break;
      }
      return updatedAchievement;
    });

    console.log('Conquistas atualizadas:', updatedAchievements);
    return { achievements: updatedAchievements };
  };

  const handleWorkoutComplete = async (exercise: Exercise) => {
    if (!userProfile || !session?.user?.id) {
      console.log('handleWorkoutComplete: userProfile ou session não disponível');
      return;
    }

    console.log('Concluindo treino:', exercise);

    // Calcular o novo progresso
    const updatedProgress = {
      totalCaloriesBurned: (userProfile.progress?.totalCaloriesBurned || 0) + exercise.calories,
      workoutsCompleted: (userProfile.progress?.workoutsCompleted || 0) + 1,
    };

    console.log('Novo progresso:', updatedProgress);

    // Atualizar o histórico de treinos
    const updatedWorkoutHistory = [
      ...(userProfile.workoutHistory || []),
      {
        date: new Date().toISOString(),
        exerciseName: exercise.name,
        caloriesBurned: exercise.calories,
      },
    ];

    // Verificar e atualizar conquistas
    const { achievements: updatedAchievements } = updateAchievements(updatedProgress);

    // Atualizar o perfil no Supabase
    const { error } = await supabase
      .from('profiles')
      .update({
        progress: updatedProgress,
        workoutHistory: updatedWorkoutHistory,
        achievements: updatedAchievements,
      })
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Erro ao atualizar perfil:', error.message);
      toast.error('Erro ao salvar progresso e conquistas.');
      return;
    }

    // Atualizar o estado local
    const updatedProfile = {
      ...userProfile,
      progress: updatedProgress,
      workoutHistory: updatedWorkoutHistory,
      achievements: updatedAchievements,
    };

    console.log('Atualizando estado local com perfil:', updatedProfile);
    setUserProfile(updatedProfile);
  };

  const handleCreateWorkout = async (newWorkout: Exercise) => {
    if (!userProfile || !session?.user?.id) {
      toast.error('Erro: Usuário não autenticado.');
      return;
    }

    const updatedCustomWorkouts = [...(userProfile.customWorkouts || []), newWorkout];

    // Atualizar o perfil no Supabase
    const { error } = await supabase
      .from('profiles')
      .update({ customWorkouts: updatedCustomWorkouts })
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Erro ao salvar treino personalizado:', error.message);
      toast.error('Erro ao criar treino.');
      return;
    }

    // Atualizar o estado local
    setUserProfile({ ...userProfile, customWorkouts: updatedCustomWorkouts });
  };

  const handleToggleFavorite = async (exerciseId: string) => {
    if (!userProfile || !session?.user?.id) {
      toast.error('Erro: Usuário não autenticado.');
      return;
    }

    const currentFavorites = userProfile.favorites || [];
    const isCurrentlyFavorite = currentFavorites.includes(exerciseId);
    const updatedFavorites = isCurrentlyFavorite
      ? currentFavorites.filter((id) => id !== exerciseId)
      : [...currentFavorites, exerciseId];

    // Atualizar o perfil no Supabase
    const { error } = await supabase
      .from('profiles')
      .update({ favorites: updatedFavorites })
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Erro ao atualizar favoritos:', error.message);
      toast.error('Erro ao atualizar favoritos.');
      return;
    }

    // Atualizar o estado local
    setUserProfile({ ...userProfile, favorites: updatedFavorites });
    toast.success(
      isCurrentlyFavorite ? 'Removido dos favoritos!' : 'Adicionado aos favoritos!'
    );
  };

  const adjustedExercises = useMemo(() => {
    if (!userProfile) return BASE_EXERCISES;

    // Ajustar os treinos padrão (BASE_EXERCISES) com base no IMC, idade e duração preferida
    const adjustedBaseExercises = BASE_EXERCISES.filter(exercise => {
      const userIMC = userProfile.imc || 0;
      const userAge = userProfile.age;

      // Verificar se o exercício é adequado para o IMC do usuário
      const isIMCSuitable = exercise.suitableFor.imcRange.min !== undefined && 
                          exercise.suitableFor.imcRange.max !== undefined ? 
                          (userIMC >= exercise.suitableFor.imcRange.min && 
                           userIMC <= exercise.suitableFor.imcRange.max) :
                          exercise.suitableFor.imcRange.min !== undefined ?
                          userIMC >= exercise.suitableFor.imcRange.min :
                          exercise.suitableFor.imcRange.max !== undefined ?
                          userIMC <= exercise.suitableFor.imcRange.max :
                          true;

      // Verificar se o exercício é adequado para a idade do usuário
      const isAgeSuitable = exercise.suitableFor.ageRange.min !== undefined && 
                           exercise.suitableFor.ageRange.max !== undefined ?
                           (userAge >= exercise.suitableFor.ageRange.min && 
                            userAge <= exercise.suitableFor.ageRange.max) :
                           true;

      return isIMCSuitable && isAgeSuitable;
    }).map(exercise => {
      const durationRatio = userProfile.preferredDuration / exercise.duration;
      const adjustedSteps = exercise.steps.map(step => {
        return step.replace(/\d+\s+segundos/g, (match) => {
          const seconds = parseInt(match);
          const adjustedSeconds = Math.round(seconds * durationRatio);
          return `${adjustedSeconds} segundos`;
        });
      });

      return {
        ...exercise,
        duration: userProfile.preferredDuration,
        calories: Math.round(exercise.calories * durationRatio),
        steps: adjustedSteps,
      };
    });

    // Combinar os treinos padrão ajustados com os treinos personalizados
    const customWorkouts = userProfile.customWorkouts || [];
    return [...adjustedBaseExercises, ...customWorkouts];
  }, [userProfile]);

  const favoriteExercises = useMemo(() => {
    if (!userProfile?.favorites || userProfile.favorites.length === 0) return [];
    return adjustedExercises.filter((exercise) =>
      userProfile.favorites.includes(exercise.id)
    );
  }, [adjustedExercises, userProfile?.favorites]);

  const getIMCStatus = (imc: number) => {
    if (imc < 18.5) return { text: 'Abaixo do Peso', color: 'text-blue-600' };
    if (imc < 25) return { text: 'Peso Normal', color: 'text-green-600' };
    if (imc < 30) return { text: 'Sobrepeso', color: 'text-yellow-600' };
    return { text: 'Obesidade', color: 'text-red-600' };
  };

  const handleProfileComplete = async (profile: UserProfile) => {
    if (!session?.user?.id) {
      console.error('Nenhum usuário autenticado encontrado.');
      toast.error('Erro: Usuário não autenticado.');
      return;
    }

    const profileData = {
      ...profile,
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      progress: profile.progress || { totalCaloriesBurned: 0, workoutsCompleted: 0 },
      workoutHistory: profile.workoutHistory || [],
      achievements: profile.achievements && profile.achievements.length > 0 ? profile.achievements : ACHIEVEMENTS,
      favorites: profile.favorites || [],
    };

    console.log('Tentando inserir perfil:', profileData);

    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar perfil:', error.message);
      if (error.code === '42P01') {
        toast.error('Tabela "profiles" não existe. Contate o suporte.');
      } else {
        toast.error(`Erro ao salvar perfil: ${error.message}`);
      }
      return;
    }

    if (data) {
      console.log('Perfil salvo com sucesso:', data);
      setUserProfile(data);
      setShowProfileSetup(false);
      toast.success('Perfil configurado com sucesso!');
    }
  };

  console.log('Estado atual:', { session, userProfile, showProfileSetup, showEditProfile });

  if (!session) {
    console.log('Usuário não autenticado, renderizando AuthModal');
    return (
      <div 
        className="min-h-screen"
        style={{
          background: `linear-gradient(to bottom, ${gradient.startColor}, ${gradient.endColor})`,
        }}
      >
        <AuthModal
          onClose={() => {}}
          onSuccess={() => console.log('Autenticação bem-sucedida')}
          showClose={false}
        />
      </div>
    );
  }

  if (showProfileSetup) {
    console.log('Mostrando ProfileSetup');
    return (
      <div 
        className="min-h-screen"
        style={{
          background: `linear-gradient(to bottom, ${gradient.startColor}, ${gradient.endColor})`,
        }}
      >
        <ProfileSetup onComplete={handleProfileComplete} />
      </div>
    );
  }

  if (!userProfile) {
    console.log('Carregando perfil...');
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(to bottom, ${gradient.startColor}, ${gradient.endColor})`,
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  const imcStatus = getIMCStatus(userProfile.imc || 0);

  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom, ${gradient.startColor}, ${gradient.endColor})`,
      }}
    >
      <Toaster position="top-center" />
      <Header onAuthClick={handleLogout} isAuthenticated={true} />
      <main className="pt-20 px-4 max-w-7xl mx-auto pb-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-8 text-white mb-8 relative">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-3xl font-bold">Bem-vindo de volta, {userProfile.name}!</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowEditProfile(true)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <Pencil className="h-6 w-6" />
              </button>
            </div>
          </div>
          <p className="text-white/80 mb-6">Pronto para seu treino personalizado de hoje?</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4">
              <Activity className="h-8 w-8" />
              <div>
                <p className="text-sm opacity-80">Nível de Condicionamento</p>
                <p className="font-semibold capitalize">
                  {userProfile.fitnessLevel === 'beginner'
                    ? 'Iniciante'
                    : userProfile.fitnessLevel === 'intermediate'
                    ? 'Intermediário'
                    : 'Avançado'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4">
              <Target className="h-8 w-8" />
              <div>
                <p className="text-sm opacity-80">Objetivo</p>
                <p className="font-semibold capitalize">
                  {userProfile.goal?.type === 'weight-loss' ? 'Perda de Peso' : 'Manter Forma'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4">
              <Scale className="h-8 w-8" />
              <div>
                <p className="text-sm opacity-80">IMC</p>
                <p className={`font-semibold ${imcStatus.color}`}>
                  {userProfile.imc || 0} - {imcStatus.text}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4">
              <Clock className="h-8 w-8" />
              <div>
                <p className="text-sm opacity-80">Duração do Treino</p>
                <p className="font-semibold">{userProfile.preferredDuration} minutos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seu Plano Diário */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Seu Plano Diário</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">
                Meta Calórica: {userProfile.recommendedPlan?.dailyCalories || 0} kcal
              </h4>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h5 className="font-medium text-gray-900 mb-2">Macronutrientes Recomendados</h5>
                <ul className="space-y-2 text-gray-600">
                  <li>Proteínas: {userProfile.recommendedPlan?.macros.protein || 0}g</li>
                  <li>Carboidratos: {userProfile.recommendedPlan?.macros.carbs || 0}g</li>
                  <li>Gorduras: {userProfile.recommendedPlan?.macros.fats || 0}g</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Plano de Treino</h4>
              <div className="bg-gray-50 p-4 rounded-xl">
                <ul className="space-y-2 text-gray-600">
                  {userProfile.recommendedPlan?.workoutPlan.recommendedExercises.map(
                    (exercise, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>{exercise}</span>
                      </li>
                    )
                  ) || <li>Nenhum plano de treino disponível.</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Plano Alimentar Recomendado */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Plano Alimentar Recomendado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-700 mb-2">Café da Manhã</h4>
              <ul className="space-y-1 text-gray-600">
                {userProfile.recommendedPlan?.mealPlan.breakfast.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                )) || <li>Nenhum plano alimentar disponível.</li>}
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-700 mb-2">Almoço</h4>
              <ul className="space-y-1 text-gray-600">
                {userProfile.recommendedPlan?.mealPlan.lunch.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                )) || <li>Nenhum plano alimentar disponível.</li>}
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-700 mb-2">Jantar</h4>
              <ul className="space-y-1 text-gray-600">
                {userProfile.recommendedPlan?.mealPlan.dinner.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                )) || <li>Nenhum plano alimentar disponível.</li>}
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-700 mb-2">Lanches</h4>
              <ul className="space-y-1 text-gray-600">
                {userProfile.recommendedPlan?.mealPlan.snacks.map((item, index) => (
                  <li key={index} className="text-sm">{item}</li>
                )) || <li>Nenhum plano alimentar disponível.</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div
            className="bg-white p-6 rounded-2xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setShowProgress(true)}
          >
            <Flame className="h-8 w-8 text-orange-500 mb-2" />
            <p className="text-sm text-gray-600">Calorias Queimadas</p>
            <p className="text-2xl font-bold text-gray-900">
              {userProfile.progress?.totalCaloriesBurned || 0}
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-2xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setShowProgress(true)}
          >
            <Clock className="h-8 w-8 text-blue-500 mb-2" />
            <p className="text-sm text-gray-600">Minutos Ativos</p>
            <p className="text-2xl font-bold text-gray-900">
              {(userProfile.progress?.workoutsCompleted || 0) * (userProfile.preferredDuration || 0)}
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-2xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setShowProgress(true)}
          >
            <Dumbbell className="h-8 w-8 text-purple-500 mb-2" />
            <p className="text-sm text-gray-600">Treinos Realizados</p>
            <p className="text-2xl font-bold text-gray-900">
              {userProfile.progress?.workoutsCompleted || 0}
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-2xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setShowAchievements(true)}
          >
            <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
            <p className="text-sm text-gray-600">Conquistas</p>
            <p className="text-2xl font-bold text-gray-900">
              {userProfile.achievements?.filter((a) => a.completed).length || 0}
            </p>
          </div>
        </div>

        {/* Seção de Favoritos */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Seus Favoritos</h3>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Ver Todos
            </button>
          </div>
          {favoriteExercises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteExercises.map((exercise) => (
                <WorkoutCard
                  key={exercise.id}
                  exercise={exercise}
                  onClick={() => setSelectedExercise(exercise)}
                  onComplete={handleWorkoutComplete}
                  favorites={userProfile.favorites || []}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Você ainda não tem treinos favoritados. Adicione alguns clicando no coração!</p>
          )}
        </section>

        {/* Treinos Recomendados */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Treinos Recomendados para Hoje</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCreateWorkout(true)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Criar Novo Treino
              </button>
              <button className="text-purple-600 hover:text-purple-700 font-medium">Ver Todos</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adjustedExercises.map((exercise) => (
              <WorkoutCard
                key={exercise.id}
                exercise={exercise}
                onClick={() => setSelectedExercise(exercise)}
                onComplete={handleWorkoutComplete}
                favorites={userProfile.favorites || []}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>
      </main>

      {selectedExercise && (
        <ExerciseTutorial exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      )}
      {showProgress && (
        <ProgressModal
          progress={userProfile.progress || { totalCaloriesBurned: 0, workoutsCompleted: 0 }}
          workoutHistory={userProfile.workoutHistory || []}
          onClose={() => setShowProgress(false)}
        />
      )}
      {showAchievements && (
        <AchievementsModal
          achievements={userProfile.achievements || ACHIEVEMENTS}
          onClose={() => setShowAchievements(false)}
        />
      )}
      {showEditProfile && (
        <EditProfileModal
          profile={userProfile}
          onSave={handleProfileUpdate}
          onClose={() => setShowEditProfile(false)}
        />
      )}
      {showCreateWorkout && (
        <CreateWorkoutModal
          onClose={() => setShowCreateWorkout(false)}
          onCreate={handleCreateWorkout}
        />
      )}
       <Chatbot />
    </div>
  );
}

export default App;