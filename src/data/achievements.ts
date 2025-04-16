import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-workout',
    name: 'Primeiro Treino',
    description: 'Conclua seu primeiro treino.',
    completed: false,
    requirements: [
      {
        type: 'workouts',
        target: 1
      }
    ],
    title: 'Iniciante'
  },
  {
    id: 'five-workouts',
    name: '5 Treinos Completos',
    description: 'Conclua 5 treinos.',
    completed: false,
    requirements: [
      {
        type: 'workouts',
        target: 5
      }
    ],
    title: 'Dedicado'
  },
  {
    id: 'burn-500-calories',
    name: 'Queimador de Calorias',
    description: 'Queime 500 calorias no total.',
    completed: false,
    requirements: [
      {
        type: 'calories',
        target: 500
      }
    ],
    title: 'Incinerador'
  },
];