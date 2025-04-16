import React from 'react';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { UserProfile, Goal } from '../types';
import { ChevronRight, User2, Scale, Ruler } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProfileSetupProps } from './types';

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [goal, setGoal] = useState<Goal>({
    type: "weight-loss",
    intensity: "moderate"
  });

  const calculateIMC = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const calculateDailyCalories = (
    weight: number,
    height: number,
    age: number,
    goalType: 'weight-loss' | 'fitness-maintenance'
  ): number => {
    // Fórmula de Harris-Benedict
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    const activityFactor = 1.375; // Considerando atividade leve a moderada
    let dailyCalories = bmr * activityFactor;

    if (goalType === 'weight-loss') {
      dailyCalories *= 0.85; // Déficit calórico de 15% para perda de peso
    }

    return Math.round(dailyCalories);
  };

  const generateRecommendedPlan = (profile: Partial<UserProfile>) => {
    if (!profile.weight || !profile.height || !profile.age || !profile.goal?.type) return undefined;

    const dailyCalories = calculateDailyCalories(
      profile.weight,
      profile.height,
      profile.age,
      profile.goal.type
    );

    const isWeightLoss = profile.goal.type === 'weight-loss';

    return {
      dailyCalories,
      macros: {
        protein: Math.round(profile.weight * (isWeightLoss ? 2.2 : 2)), // g/kg
        carbs: Math.round((dailyCalories * (isWeightLoss ? 0.4 : 0.5)) / 4), // 40-50% das calorias
        fats: Math.round((dailyCalories * (isWeightLoss ? 0.25 : 0.3)) / 9), // 25-30% das calorias
      },
      mealPlan: {
        breakfast: isWeightLoss
          ? [
              'Omelete de claras com espinafre',
              'Aveia com whey protein',
              'Café preto sem açúcar'
            ]
          : [
              'Pão integral com ovos mexidos',
              'Iogurte com granola',
              'Frutas frescas'
            ],
        lunch: isWeightLoss
          ? [
              'Peito de frango grelhado',
              'Salada de folhas variadas',
              'Arroz integral (porção controlada)'
            ]
          : [
              'Mix de proteínas magras',
              'Legumes no vapor',
              'Arroz integral ou batata doce'
            ],
        dinner: isWeightLoss
          ? [
              'Peixe assado com ervas',
              'Legumes grelhados',
              'Quinoa em pequena porção'
            ]
          : [
              'Carne magra ou peixe',
              'Vegetais variados',
              'Grãos integrais'
            ],
        snacks: isWeightLoss
          ? [
              'Whey protein com água',
              'Mix de oleaginosas (30g)',
              'Maçã ou pera'
            ]
          : [
              'Batida de frutas com whey',
              'Mix de castanhas (50g)',
              'Frutas variadas'
            ],
      },
      workoutPlan: {
        daysPerWeek: isWeightLoss ? 5 : 4,
        sessionsPerDay: isWeightLoss ? 2 : 1,
        recommendedExercises: isWeightLoss
          ? [
              'HIIT matinal em jejum (30 min)',
              'Treino com pesos à tarde (45 min)',
              'Cardio moderado entre refeições',
              'Yoga para recuperação'
            ]
          : [
              'Treino com pesos (60 min)',
              'Cardio moderado pós-treino',
              'Alongamento e mobilidade',
              'Atividades recreativas'
            ],
      },
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProfileComplete()) {
      const plan = generateRecommendedPlan(profile);
      
      const finalProfile: UserProfile = {
        ...profile as UserProfile,
        imc: calculateIMC(profile.weight!, profile.height!),
        recommendedPlan: plan,
      };
      
      onComplete(finalProfile);
    }
  };

  const isProfileComplete = () => {
    return (
      profile.name &&
      profile.age &&
      profile.height &&
      profile.weight &&
      profile.goal &&
      profile.fitnessLevel &&
      profile.preferredDuration
    );
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const handleGoalChange = (newGoal: "weight-loss" | "fitness-maintenance") => {
    setGoal({ ...goal, type: newGoal });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Bem-vindo! Vamos conhecer você</h3>
              <p className="mt-2 text-gray-600">Comece sua jornada fitness conosco</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Seu Nome</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg"
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Digite seu nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sua Idade</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                  placeholder="Digite sua idade"
                />
              </div>
            </div>
            <button
              onClick={nextStep}
              disabled={!profile.name || !profile.age}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo Passo
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Medidas Corporais</h3>
              <p className="mt-2 text-gray-600">Vamos calcular seu IMC</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <input
                    type="number"
                    className="block w-full rounded-xl border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 text-lg"
                    value={profile.height || ''}
                    onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) })}
                    placeholder="170"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Ruler className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <input
                    type="number"
                    className="block w-full rounded-xl border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 text-lg"
                    value={profile.weight || ''}
                    onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) })}
                    placeholder="70"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Scale className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={nextStep}
              disabled={!profile.height || !profile.weight}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo Passo
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Qual é seu objetivo?</h3>
              <p className="mt-2 text-gray-600">Escolha seu objetivo principal de fitness</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => {
                  handleGoalChange('weight-loss');
                  nextStep();
                }}
                className={`p-6 rounded-xl border-2 ${
                  goal.type === 'weight-loss'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                } transition-all duration-200`}
              >
                <h4 className="text-xl font-semibold">Perda de Peso</h4>
                <p className="text-gray-600 mt-2">Foco em queimar calorias e reduzir gordura corporal</p>
              </button>
              <button
                onClick={() => {
                  handleGoalChange('fitness-maintenance');
                  nextStep();
                }}
                className={`p-6 rounded-xl border-2 ${
                  goal.type === 'fitness-maintenance'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                } transition-all duration-200`}
              >
                <h4 className="text-xl font-semibold">Manter Forma</h4>
                <p className="text-gray-600 mt-2">Manter-se saudável e conservar o nível atual de condicionamento</p>
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Configuração Final</h3>
              <p className="mt-2 text-gray-600">Vamos personalizar sua experiência</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Seu Nível de Condicionamento</label>
                <select
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg"
                  value={profile.fitnessLevel || ''}
                  onChange={(e) => setProfile({ ...profile, fitnessLevel: e.target.value as any })}
                >
                  <option value="">Selecione seu nível</option>
                  <option value="beginner">Iniciante</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duração Preferida do Treino</label>
                <select
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg"
                  value={profile.preferredDuration || ''}
                  onChange={(e) => setProfile({ ...profile, preferredDuration: parseInt(e.target.value) })}
                >
                  <option value="">Selecione a duração</option>
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">60 minutos</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!isProfileComplete()}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Começar sua Jornada
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        );
      default:
        return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
            <User2 className="h-10 w-10 text-purple-600" />
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNumber ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-full h-1 ${
                  step > stepNumber ? 'bg-purple-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default ProfileSetup;