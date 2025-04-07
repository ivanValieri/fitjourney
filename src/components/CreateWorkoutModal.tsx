// teste para git
// santos the best
// neymar
// gol


import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { Exercise } from '../types';
import toast from 'react-hot-toast';

interface CreateWorkoutModalProps {
  onClose: () => void;
  onCreate: (workout: Exercise) => void;
}

const CreateWorkoutModal: React.FC<CreateWorkoutModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState<number>(10);
  const [calories, setCalories] = useState<number>(100);
  const [steps, setSteps] = useState<string[]>(['']);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name || !duration || !calories || steps.some(step => !step.trim())) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newWorkout = {
      id: `custom-${Date.now()}`,
      name,
      description: steps.join('\n'),
      duration,
      calories,
      steps,
      tips: [] as string[],
      commonMistakes: [] as string[],
      targetMuscles: [] as string[],
      secondaryMuscles: [] as string[],
      nutrition: {
        preTreino: [] as string[],
        posTreino: [] as string[]
      },
      imageUrl: '',
      difficulty: 'beginner',
      muscleGroup: '',
      suitableFor: {
        imcRange: {
          min: 0,
          max: 100
        },
        ageRange: {
          min: 0,
          max: 100
        }
      },
      modifications: {
        easier: [] as string[],
        harder: [] as string[]
      }
    } satisfies Exercise;

    onCreate(newWorkout);
    toast.success('Treino criado com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Criar Novo Treino</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Treino *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Ex.: Cardio Intenso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duração (minutos) *</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Calorias Estimadas *</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Passos do Treino *</label>
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2 mt-1">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder={`Passo ${index + 1}`}
                />
                {steps.length > 1 && (
                  <button
                    onClick={() => handleRemoveStep(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddStep}
              className="mt-2 flex items-center text-purple-600 hover:text-purple-700"
            >
              <Plus className="h-5 w-5 mr-1" /> Adicionar Passo
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL do Vídeo (Opcional)</label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Ex.: https://youtube.com/watch?v=..."
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Criar Treino
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkoutModal;