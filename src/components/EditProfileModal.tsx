import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onClose: () => void;
}

export default function EditProfileModal({ profile, onSave, onClose }: EditProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>({
    name: profile.name || '',
    age: profile.age || 0,
    height: profile.height || 0,
    weight: profile.weight || 0,
    goal: profile.goal || { type: 'weight-loss' },
    fitnessLevel: profile.fitnessLevel || 'beginner',
    preferredDuration: profile.preferredDuration || 30,
    imc: profile.imc || 0,
    favorites: profile.favorites || [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: profile.name || '',
      age: profile.age || 0,
      height: profile.height || 0,
      weight: profile.weight || 0,
      goal: profile.goal || { type: 'weight-loss' },
      fitnessLevel: profile.fitnessLevel || 'beginner',
      preferredDuration: profile.preferredDuration || 30,
      imc: profile.imc || 0,
      favorites: profile.favorites || [],
    });
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'goal') {
      setFormData({ ...formData, goal: { type: value as 'weight-loss' | 'fitness-maintenance' } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedProfile: UserProfile = {
      name: formData.name,
      age: Number(formData.age),
      height: Number(formData.height),
      weight: Number(formData.weight),
      goal: formData.goal,
      fitnessLevel: formData.fitnessLevel,
      preferredDuration: Number(formData.preferredDuration),
      imc: Number(formData.weight) / (Number(formData.height) * Number(formData.height)),
      favorites: formData.favorites || [],
    };

    onSave(updatedProfile);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Editar Perfil</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
              <select
                name="goal"
                value={formData.goal?.type || 'weight-loss'}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              >
                <option value="weight-loss">Perda de Peso</option>
                <option value="fitness-maintenance">Manter Forma</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Condicionamento</label>
              <select
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              >
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração do Treino (minutos)</label>
              <input
                type="number"
                name="preferredDuration"
                value={formData.preferredDuration}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                'Salvando...'
              ) : (
                <>
                  <span>Salvar Alterações</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}