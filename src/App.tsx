import { Outlet, useNavigate } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import { Exercise, UserProfile, Workout, WorkoutHistory } from './types';
import { useState, useMemo, useEffect } from 'react';
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
import { Activity, Target, Flame, Clock, Dumbbell, Trophy, Scale, Pencil } from 'lucide-react';
import { BASE_EXERCISES } from './data/exercises';
import { ACHIEVEMENTS } from './data/achievements';
import { supabase } from './lib/supabase';
import toast from 'react-hot-toast';
import { useTheme } from './context/ThemeContext';
import { askMistral } from './api/mistral';

// Adicione ESTE console.log logo após os imports:
console.log("DEBUG: mistral.ts carregado?", typeof askMistral !== 'undefined');

function App() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | undefined>(undefined);
  const [showProgress, setShowProgress] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
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
        setUserProfile(undefined);
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
      setUserProfile(undefined);
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

    // Validar campos obrigatórios
    if (!updatedProfile.name || !updatedProfile.age || !updatedProfile.height || 
        !updatedProfile.weight || !updatedProfile.goal || !updatedProfile.fitnessLevel || 
        !updatedProfile.preferredDuration || !updatedProfile.imc) {
      toast.error('Todos os campos obrigatórios devem ser preenchidos.');
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

    // Atualizar o estado com o perfil validado
    setUserProfile(prev => {
      if (!prev) return updatedProfile;
      return {
        ...prev,
        name: updatedProfile.name,
        age: updatedProfile.age,
        height: updatedProfile.height,
        weight: updatedProfile.weight,
        goal: updatedProfile.goal,
        fitnessLevel: updatedProfile.fitnessLevel,
        preferredDuration: updatedProfile.preferredDuration,
        imc: updatedProfile.imc,
        favorites: updatedProfile.favorites || [],
        progress: prev.progress || { totalCaloriesBurned: 0, workoutsCompleted: 0 },
        workoutHistory: prev.workoutHistory || [],
        achievements: prev.achievements || [],
        customWorkouts: prev.customWorkouts || [],
        themePreferences: prev.themePreferences,
        chatHistory: prev.chatHistory
      } as UserProfile;
    });
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

      const isCompleted = achievement.requirements.some((req) => {
        if (req.type === 'calories') {
          return currentProgress.totalCaloriesBurned >= req.target;
        } else if (req.type === 'workouts') {
          return currentProgress.workoutsCompleted >= req.target;
        }
        return false;
      });

      if (isCompleted) {
        console.log(`Conquista ${achievement.id} concluída!`);
        toast.success(`Conquista desbloqueada: ${achievement.title}`);
      }

      return {
        ...achievement,
        completed: isCompleted,
      };
    });

    // Atualizar o banco de dados
    supabase
      .from('profiles')
      .update({ achievements: updatedAchievements })
      .eq('user_id', session.user.id)
      .then(({ error }) => {
        if (error) {
          console.error('Erro ao atualizar conquistas:', error);
          toast.error('Erro ao salvar conquistas.');
        }
      });

    return { achievements: updatedAchievements };
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

    const { achievements } = updateAchievements(currentProgress);

    const workoutHistory: WorkoutHistory = {
      date: new Date().toISOString(),
      exerciseName: exercise.name,
      caloriesBurned: exercise.caloriesBurned,
      exercise
    };

    const updatedProfile: UserProfile = {
      ...userProfile,
      progress: currentProgress,
      workoutHistory: [...(userProfile.workoutHistory || []), workoutHistory],
      achievements
    };

    setUserProfile(updatedProfile);
    setShowProgress(true);
    toast.success('Treino concluído com sucesso!');
  };

  const handleCreateWorkout = (workout: Exercise) => {
    if (!session?.user?.id || !userProfile) {
      toast.error('Erro: Usuário não autenticado.');
      return;
    }

    const updatedProfile = {
      ...userProfile,
      customWorkouts: [...(userProfile.customWorkouts || []), workout],
    };

    supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('user_id', session.user.id)
      .then(({ error }) => {
        if (error) {
          console.error('Erro ao salvar treino:', error.message);
          toast.error(`Erro ao salvar treino: ${error.message}`);
          return;
        }
        setUserProfile(updatedProfile);
        setShowCreateWorkout(false);
        toast.success('Treino personalizado criado com sucesso!');
      });
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

    const { error } = await supabase
      .from('profiles')
      .update({ favorites: updatedFavorites })
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Erro ao atualizar favoritos:', error.message);
      toast.error(`Erro ao atualizar favoritos: ${error.message}`);
      return;
    }

    setUserProfile(updatedProfile);
    toast.success(
      updatedFavorites.includes(exerciseId)
        ? 'Exercício adicionado aos favoritos!'
        : 'Exercício removido dos favoritos!'
    );
  };

  const getIMCStatus = (imc: number) => {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidade';
  };

  const handleProfileComplete = async (profile: UserProfile) => {
    if (!session?.user?.id) {
      toast.error('Erro: Usuário não autenticado.');
      return;
    }

    const imc = profile.weight / Math.pow(profile.height / 100, 2);
    const updatedProfile = {
      ...profile,
      user_id: session.user.id,
      imc,
      progress: { totalCaloriesBurned: 0, workoutsCompleted: 0 },
      workoutHistory: [],
      achievements: ACHIEVEMENTS,
      customWorkouts: [],
      favorites: [],
    };

    const { error } = await supabase.from('profiles').insert(updatedProfile);

    if (error) {
      console.error('Erro ao criar perfil:', error.message);
      toast.error(`Erro ao criar perfil: ${error.message}`);
      return;
    }

    setUserProfile(updatedProfile);
    setShowProfileSetup(false);
    toast.success('Perfil criado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      <Header isAuthenticated={!!session} onAuthClick={() => setShowAuth(true)} />
      
      <main className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => {
            setShowAuth(false);
            if (!userProfile) {
              setShowProfileSetup(true);
            }
          }}
        />
      )}

      {showProfileSetup && (
        <ProfileSetup
          onComplete={handleProfileComplete}
          onClose={() => setShowProfileSetup(false)}
        />
      )}

      {showEditProfile && userProfile && (
        <EditProfileModal
          profile={userProfile}
          onSave={handleProfileUpdate}
          onClose={() => setShowEditProfile(false)}
        />
      )}

      {showCreateWorkout && (
        <CreateWorkoutModal
          onSave={handleCreateWorkout}
          onClose={() => setShowCreateWorkout(false)}
        />
      )}

      {showProgress && userProfile && (
        <ProgressModal
          profile={userProfile}
          onClose={() => setShowProgress(false)}
        />
      )}

      {showAchievements && userProfile && (
        <AchievementsModal
          achievements={userProfile.achievements || ACHIEVEMENTS}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {selectedExercise && (
        <ExerciseTutorial
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(undefined)}
        />
      )}

      {session && userProfile && (
        <Chatbot
          userProfile={userProfile}
          onWorkoutComplete={handleWorkoutComplete}
        />
      )}
    </div>
  );
}

export default App;