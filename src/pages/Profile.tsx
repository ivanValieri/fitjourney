import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit, Dumbbell, Activity, Settings } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Seu Perfil
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
            <User className="h-10 w-10 text-purple-600 dark:text-purple-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            É necessário fazer login
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Para criar ou editar seu perfil, faça login ou crie uma conta.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 mr-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <User className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Informações Pessoais
            </h3>
          </div>
          <div className="space-y-3 opacity-50">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
              <p className="font-medium text-gray-900 dark:text-white">---</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Idade</p>
              <p className="font-medium text-gray-900 dark:text-white">---</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Altura</p>
              <p className="font-medium text-gray-900 dark:text-white">---</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Peso</p>
              <p className="font-medium text-gray-900 dark:text-white">---</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 mr-3 rounded-full bg-green-100 dark:bg-green-900">
              <Activity className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Objetivos Fitness
            </h3>
          </div>
          <div className="space-y-3 opacity-50">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Tipo de Objetivo</p>
              <p className="font-medium text-gray-900 dark:text-white">---</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Nível de Condicionamento</p>
              <p className="font-medium text-gray-900 dark:text-white">---</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Duração Preferida</p>
              <p className="font-medium text-gray-900 dark:text-white">---</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">IMC Atual</p>
              <p className="font-medium text-gray-900 dark:text-white">---</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 mr-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Settings className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Opções
            </h3>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg opacity-50">
              <span className="font-medium text-gray-900 dark:text-white">Editar perfil</span>
              <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg opacity-50">
              <span className="font-medium text-gray-900 dark:text-white">Meus treinos</span>
              <Dumbbell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg opacity-50">
              <span className="font-medium text-gray-900 dark:text-white">Preferências</span>
              <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 