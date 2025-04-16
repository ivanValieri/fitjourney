import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, ChevronRight, ChevronLeft, AlertTriangle, CheckCircle2, Timer, Apple } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseTutorialProps {
  exercise: Exercise;
  onClose: () => void;
}

export default function ExerciseTutorial({ exercise, onClose }: ExerciseTutorialProps) {
  const [timeLeft, setTimeLeft] = useState(exercise.duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(exercise.duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextStep = () => {
    if (currentStep < exercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{exercise.name}</h2>
            <p className="text-gray-600">{exercise.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Seção Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda: Vídeo/Imagem e Timer */}
            <div className="space-y-6">
              {/* Toggle entre Vídeo e Imagem */}
              <div className="rounded-xl overflow-hidden bg-gray-100">
                {showVideo && exercise.videoUrl ? (
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={exercise.videoUrl}
                      title={`Tutorial de ${exercise.name}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <img
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    className="w-full h-64 object-cover"
                  />
                )}
              </div>
              
              {exercise.videoUrl && (
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className="w-full py-2 px-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  {showVideo ? 'Mostrar Imagem' : 'Mostrar Vídeo Tutorial'}
                </button>
              )}

              {/* Timer */}
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Timer className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold">Cronômetro</h3>
                </div>
                <div className="text-5xl font-bold mb-4 font-mono text-purple-600">
                  {formatTime(timeLeft)}
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={toggleTimer}
                    className={`px-6 py-3 rounded-xl flex items-center space-x-2 ${
                      isRunning
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white transition-colors`}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-5 w-5" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" />
                        <span>Iniciar</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center space-x-2 transition-colors"
                  >
                    <RotateCcw className="h-5 w-5" />
                    <span>Reiniciar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Instruções e Detalhes */}
            <div className="space-y-6">
              {/* Passo a Passo */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Passo a Passo</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={currentStep === exercise.steps.length - 1}
                      className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600">Passo {currentStep + 1} de {exercise.steps.length}</p>
                  <p className="text-lg">{exercise.steps[currentStep]}</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {exercise.steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 rounded-full ${
                        index === currentStep
                          ? 'bg-purple-600'
                          : index < currentStep
                          ? 'bg-purple-200'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Dicas e Erros Comuns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Dicas Importantes</h4>
                  </div>
                  <ul className="space-y-2">
                    {exercise.tips?.map((tip, index) => (
                      <li key={index} className="mb-2">{tip}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-800">Erros Comuns</h4>
                  </div>
                  <ul className="space-y-2">
                    {exercise.commonMistakes?.map((mistake, index) => (
                      <li key={index} className="mb-2">{mistake}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Músculos Trabalhados */}
              <div className="bg-purple-50 p-4 rounded-xl">
                <h4 className="font-semibold text-purple-800 mb-3">Músculos Trabalhados</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-purple-700 mb-2">Principais:</p>
                    <ul className="space-y-1">
                      {exercise.targetMuscles?.map((muscle, index) => (
                        <li key={index} className="mb-2">{muscle}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700 mb-2">Secundários:</p>
                    <ul className="space-y-1">
                      {exercise.secondaryMuscles?.map((muscle, index) => (
                        <li key={index} className="mb-2">{muscle}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dicas de Nutrição */}
          {exercise.nutrition && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Apple className="h-5 w-5 mr-2" />
                Nutrição
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Pré-treino:</h4>
                  <ul className="list-disc list-inside">
                    {exercise.nutrition.preTreino?.map((item: string, index: number) => (
                      <li key={index} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Pós-treino:</h4>
                  <ul className="list-disc list-inside">
                    {exercise.nutrition.posTreino?.map((item: string, index: number) => (
                      <li key={index} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}