import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Target, Flame, Clock, Dumbbell, Trophy, Scale } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Treinos Personalizados',
      description: 'Treinos adaptados ao seu nível de condicionamento físico e objetivos pessoais.',
      icon: <Dumbbell className="h-8 w-8 text-purple-500" />
    },
    {
      title: 'Acompanhamento de Progresso',
      description: 'Acompanhe suas conquistas, calorias queimadas e treinos realizados.',
      icon: <Activity className="h-8 w-8 text-green-500" />
    },
    {
      title: 'Definição de Objetivos',
      description: 'Estabeleça metas claras para perda de peso, tonificação ou manutenção da forma física.',
      icon: <Target className="h-8 w-8 text-orange-500" />
    },
    {
      title: 'Planos de Nutrição',
      description: 'Recomendações alimentares baseadas nos seus objetivos e necessidades calóricas.',
      icon: <Flame className="h-8 w-8 text-red-500" />
    },
    {
      title: 'Duração Flexível',
      description: 'Escolha a duração ideal dos seus treinos de acordo com sua disponibilidade.',
      icon: <Clock className="h-8 w-8 text-blue-500" />
    },
    {
      title: 'Sistema de Conquistas',
      description: 'Desbloqueie conquistas à medida que avança em sua jornada fitness.',
      icon: <Trophy className="h-8 w-8 text-yellow-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            FitJourney
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Sua jornada personalizada para uma vida mais saudável e ativa começa aqui.
            Transforme seus hábitos, alcance seus objetivos e acompanhe seu progresso.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/workouts')}
              className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Explorar Treinos
            </button>
            <button 
              onClick={() => navigate('/progress')}
              className="px-6 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Ver Progresso
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Transforme sua rotina fitness
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Pronto para começar sua jornada?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Crie seu perfil, estabeleça seus objetivos e comece hoje mesmo. 
            Uma vida mais saudável e ativa está a apenas um clique de distância.
          </p>
          <button 
            onClick={() => navigate('/profile')}
            className="px-6 py-3 rounded-lg bg-white text-purple-600 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 transition-colors"
          >
            Criar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 