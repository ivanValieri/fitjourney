import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-workout',
    name: 'Primeiro Treino',
    description: 'Conclua seu primeiro treino.',
    completed: false,
  },
  {
    id: 'five-workouts',
    name: '5 Treinos Completos',
    description: 'Conclua 5 treinos.',
    completed: false,
  },
  {
    id: 'burn-500-calories',
    name: 'Queimador de Calorias',
    description: 'Queime 500 calorias no total.',
    completed: false,
  },
];