import { Exercise } from '../types';

// Adicionando a propriedade caloriesBurned a todos os exercícios
const mapExercises = (exercises: any[]): Exercise[] => {
  return exercises.map(exercise => ({
    ...exercise,
    caloriesBurned: exercise.calories // Usando o valor da propriedade 'calories' existente
  }));
};

// Lista de exercícios base sem a tipagem Exercise
const BASE_EXERCISES_DATA = [
  // Exercícios para IMC Normal (18.5-24.9)
  {
    id: '1',
    name: 'Flexões',
    duration: 10,
    calories: 50,
    steps: [
      'Posicione-se em quatro apoios, com as mãos um pouco mais abertas que os ombros',
      'Mantenha as costas retas e o core contraído',
      'Flexione os cotovelos, descendo o peito em direção ao chão',
      'Empurre o corpo para cima, voltando à posição inicial',
      'Repita o movimento mantendo o controle'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Um exercício clássico para fortalecer o peitoral, ombros e tríceps.',
    difficulty: 'intermediate',
    muscleGroup: 'peito',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    illustrations: [
      {
        url: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Posição inicial: Braços estendidos, corpo alinhado'
      }
    ],
    tips: [
      'Mantenha o corpo em linha reta durante todo o movimento',
      'Respire de forma controlada: inspire na descida, expire na subida',
      'Mantenha o olhar fixo ligeiramente à frente',
      'Contraia o abdômen durante todo o exercício'
    ],
    commonMistakes: [
      'Arquear as costas',
      'Deixar o quadril cair',
      'Não descer o suficiente',
      'Movimento muito rápido sem controle'
    ],
    breathingPattern: 'Inspire ao descer, expire ao subir',
    targetMuscles: ['Peitoral', 'Tríceps', 'Deltóide anterior'],
    secondaryMuscles: ['Core', 'Serrátil', 'Antebraço'],
    nutrition: {
      preTreino: ['Banana', 'Aveia'],
      posTreino: ['Shake de proteína', 'Amêndoas'],
    },
    suitableFor: {
      imcRange: {
        min: 18.5,
        max: 24.9
      },
      ageRange: {
        min: 16,
        max: 50
      }
    },
    modifications: {
      easier: [
        'Flexões na parede',
        'Flexões com joelhos apoiados',
        'Flexões em plano inclinado'
      ],
      harder: [
        'Flexões com palma estreita',
        'Flexões com pés elevados',
        'Flexões com palmas diamante'
      ]
    },
    precautions: [
      'Evite se tiver lesões nos ombros ou punhos',
      'Não realize se sentir dor nas articulações',
      'Consulte um profissional se tiver problemas na coluna'
    ]
  },
  {
    id: '1b',
    name: 'Burpees Modificados',
    duration: 15,
    calories: 100,
    steps: [
      'Comece em pé com os pés na largura dos ombros',
      'Agache e coloque as mãos no chão',
      'Dê um passo para trás com cada perna',
      'Retorne os pés para a posição agachada',
      'Levante-se e dê um pequeno salto'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    description: 'Exercício completo que trabalha todo o corpo e melhora o condicionamento.',
    difficulty: 'intermediate',
    muscleGroup: 'full_body',
    videoUrl: 'https://www.youtube.com/embed/dZgVxmf6jkA',
    illustrations: [
      {
        url: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Sequência do movimento do burpee'
      }
    ],
    tips: [
      'Mantenha um ritmo constante',
      'Respire de forma controlada',
      'Mantenha o core sempre ativado',
      'Faça movimentos controlados'
    ],
    commonMistakes: [
      'Arquear as costas',
      'Prender a respiração',
      'Movimentos muito rápidos e descontrolados',
      'Não completar o movimento'
    ],
    breathingPattern: 'Expire ao subir, inspire ao descer',
    targetMuscles: ['Quadríceps', 'Peitoral', 'Core'],
    secondaryMuscles: ['Ombros', 'Tríceps', 'Glúteos'],
    nutrition: {
      preTreino: ['Banana', 'Mel'],
      posTreino: ['Batida de proteína', 'Frutas secas'],
    },
    suitableFor: {
      imcRange: {
        min: 18.5,
        max: 24.9
      },
      ageRange: {
        min: 18,
        max: 50
      }
    },
    modifications: {
      easier: [
        'Sem salto no final',
        'Passos alternados em vez de salto para trás',
        'Sem flexão'
      ],
      harder: [
        'Adicionar flexão',
        'Salto mais alto',
        'Burpee completo com flexão'
      ]
    },
    precautions: [
      'Evite se tiver problemas nos joelhos',
      'Não faça se sentir tontura',
      'Pare se sentir falta de ar excessiva'
    ]
  },
  {
    id: '1c',
    name: 'Mountain Climbers',
    duration: 12,
    calories: 80,
    steps: [
      'Comece na posição de prancha',
      'Traga um joelho em direção ao peito',
      'Alterne rapidamente as pernas',
      'Mantenha o quadril nivelado',
      'Continue alternando as pernas em um ritmo constante'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Exercício dinâmico que trabalha o core e melhora o condicionamento cardiovascular.',
    difficulty: 'intermediate',
    muscleGroup: 'core',
    videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM',
    illustrations: [
      {
        url: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Posição do mountain climber'
      }
    ],
    tips: [
      'Mantenha as costas retas',
      'Não balance o quadril',
      'Mantenha um ritmo constante',
      'Respire de forma controlada'
    ],
    commonMistakes: [
      'Quadril muito alto',
      'Movimento muito rápido',
      'Costas arqueadas',
      'Prender a respiração'
    ],
    breathingPattern: 'Respire de forma rítmica com o movimento',
    targetMuscles: ['Core', 'Quadríceps', 'Ombros'],
    secondaryMuscles: ['Glúteos', 'Panturrilhas'],
    nutrition: {
      preTreino: ['Maçã', 'Pasta de amendoim'],
      posTreino: ['Iogurte', 'Granola'],
    },
    suitableFor: {
      imcRange: {
        min: 18.5,
        max: 24.9
      },
      ageRange: {
        min: 16,
        max: 50
      }
    },
    modifications: {
      easier: [
        'Movimento mais lento',
        'Menor amplitude de movimento',
        'Pausas entre repetições'
      ],
      harder: [
        'Movimento mais rápido',
        'Adicionar pranchas entre séries',
        'Maior tempo de execução'
      ]
    },
    precautions: [
      'Evite se tiver problemas nos punhos',
      'Pare se sentir dor nas costas',
      'Mantenha o ritmo que consegue controlar'
    ]
  },
  // Exercícios para Sobrepeso (IMC 25-29.9)
  {
    id: '2',
    name: 'Agachamento Assistido',
    duration: 15,
    calories: 60,
    steps: [
      'Posicione uma cadeira firme atrás de você',
      'Afaste os pés na largura dos ombros',
      'Flexione os joelhos como se fosse sentar',
      'Toque levemente a cadeira e retorne à posição inicial',
      'Mantenha as costas retas durante todo o movimento'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    description: 'Versão adaptada do agachamento tradicional, ideal para fortalecimento inicial.',
    difficulty: 'beginner',
    muscleGroup: 'pernas',
    videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U',
    illustrations: [
      {
        url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Posição inicial: Em pé na frente da cadeira'
      }
    ],
    tips: [
      'Mantenha os joelhos alinhados com os dedos dos pés',
      'Respire naturalmente durante o exercício',
      'Use a cadeira apenas como referência',
      'Mantenha o abdômen contraído'
    ],
    commonMistakes: [
      'Joelhos para dentro',
      'Sentar completamente na cadeira',
      'Inclinar muito o tronco para frente',
      'Não controlar a descida'
    ],
    breathingPattern: 'Inspire ao descer, expire ao subir',
    targetMuscles: ['Quadríceps', 'Glúteos', 'Isquiotibiais'],
    secondaryMuscles: ['Core', 'Panturrilhas'],
    nutrition: {
      preTreino: ['Maçã', 'Água'],
      posTreino: ['Iogurte', 'Frutas'],
    },
    suitableFor: {
      imcRange: {
        min: 25,
        max: 29.9
      },
      ageRange: {
        min: 18,
        max: 65
      }
    },
    modifications: {
      easier: [
        'Agachamento parcial',
        'Agachamento na parede',
        'Agachamento com apoio frontal'
      ],
      harder: [
        'Agachamento livre',
        'Agachamento com peso corporal completo',
        'Agachamento com halteres leves'
      ]
    },
    precautions: [
      'Evite se tiver problemas nos joelhos',
      'Pare se sentir dor nas articulações',
      'Mantenha os movimentos controlados'
    ]
  },
  {
    id: '2b',
    name: 'Elevação de Pernas Deitado',
    duration: 10,
    calories: 45,
    steps: [
      'Deite-se de costas no chão',
      'Mantenha as pernas estendidas',
      'Levante as pernas até formar um ângulo de 90 graus',
      'Baixe as pernas lentamente',
      'Repita o movimento de forma controlada'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Exercício focado no fortalecimento do core e flexibilidade das pernas.',
    difficulty: 'beginner',
    muscleGroup: 'core',
    videoUrl: 'https://www.youtube.com/embed/l4kQd9eWclE',
    illustrations: [
      {
        url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Posição inicial deitado'
      }
    ],
    tips: [
      'Mantenha as costas pressionadas contra o chão',
      'Controle a descida das pernas',
      'Respire de forma constante',
      'Mantenha o core ativado'
    ],
    commonMistakes: [
      'Arquear as costas',
      'Movimento muito rápido',
      'Pernas flexionadas',
      'Prender a respiração'
    ],
    breathingPattern: 'Expire ao subir, inspire ao descer',
    targetMuscles: ['Abdômen inferior', 'Flexores do quadril'],
    secondaryMuscles: ['Oblíquos', 'Quadríceps'],
    nutrition: {
      preTreino: ['Banana', 'Chá verde'],
      posTreino: ['Ovo cozido', 'Torrada integral'],
    },
    suitableFor: {
      imcRange: {
        min: 25,
        max: 29.9
      },
      ageRange: {
        min: 18,
        max: 65
      }
    },
    modifications: {
      easier: [
        'Levantar uma perna de cada vez',
        'Flexionar levemente os joelhos',
        'Menor amplitude de movimento'
      ],
      harder: [
        'Manter as pernas elevadas por mais tempo',
        'Adicionar movimentos de tesoura',
        'Aumentar o número de repetições'
      ]
    },
    precautions: [
      'Evite se tiver problemas na lombar',
      'Pare se sentir desconforto no pescoço',
      'Mantenha a respiração constante'
    ]
  },
  {
    id: '2c',
    name: 'Remada em Pé com Elástico',
    duration: 12,
    calories: 50,
    steps: [
      'Prenda o elástico em um ponto fixo na altura do peito',
      'Segure as extremidades do elástico com as duas mãos',
      'Mantenha os cotovelos próximos ao corpo',
      'Puxe o elástico em direção ao abdômen',
      'Retorne lentamente à posição inicial'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-999f12c668c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Exercício para fortalecimento das costas com resistência variável.',
    difficulty: 'beginner',
    muscleGroup: 'costas',
    videoUrl: 'https://www.youtube.com/embed/xQNrFHEMhI4',
    illustrations: [
      {
        url: 'https://images.unsplash.com/photo-1598971639058-999f12c668c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Posição da remada com elástico'
      }
    ],
    tips: [
      'Mantenha as costas retas',
      'Aperte as escápulas ao puxar',
      'Mantenha os ombros baixos',
      'Controle o movimento de retorno'
    ],
    commonMistakes: [
      'Balançar o corpo',
      'Cotovelos muito abertos',
      'Ombros elevados',
      'Movimento muito rápido'
    ],
    breathingPattern: 'Expire ao puxar, inspire ao retornar',
    targetMuscles: ['Latíssimo do dorso', 'Romboides', 'Trapézio'],
    secondaryMuscles: ['Bíceps', 'Core'],
    nutrition: {
      preTreino: ['Pão integral', 'Queijo branco'],
      posTreino: ['Frango grelhado', 'Arroz integral'],
    },
    suitableFor: {
      imcRange: {
        min: 25,
        max: 29.9
      },
      ageRange: {
        min: 18,
        max: 65
      }
    },
    modifications: {
      easier: [
        'Usar elástico mais leve',
        'Menor amplitude de movimento',
        'Fazer sentado'
      ],
      harder: [
        'Usar elástico mais resistente',
        'Aumentar o número de repetições',
        'Adicionar pausa na contração'
      ]
    },
    precautions: [
      'Evite se tiver lesões nos ombros',
      'Mantenha o movimento controlado',
      'Não force além do confortável'
    ]
  },
  // Exercícios para Obesidade (IMC > 30)
  {
    id: '3',
    name: 'Caminhada Estacionária',
    duration: 20,
    calories: 80,
    steps: [
      'Fique em pé com os pés afastados na largura dos quadris',
      'Levante os joelhos alternadamente',
      'Mantenha um ritmo confortável',
      'Use os braços para auxiliar o movimento',
      'Respire naturalmente durante o exercício'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Exercício cardiovascular de baixo impacto, ideal para iniciantes.',
    difficulty: 'beginner',
    muscleGroup: 'full_body',
    videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
    illustrations: [
      {
        url: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Movimento de marcha estacionária'
      }
    ],
    tips: [
      'Mantenha uma postura ereta',
      'Respire regularmente',
      'Ajuste o ritmo conforme sua capacidade',
      'Use um apoio se necessário'
    ],
    commonMistakes: [
      'Prender a respiração',
      'Movimentos muito bruscos',
      'Postura incorreta',
      'Ritmo muito intenso'
    ],
    breathingPattern: 'Respire naturalmente, mantendo um ritmo constante',
    targetMuscles: ['Quadríceps', 'Panturrilhas', 'Core'],
    secondaryMuscles: ['Glúteos', 'Ombros', 'Braços'],
    nutrition: {
      preTreino: ['Água', 'Fruta leve'],
      posTreino: ['Proteína magra', 'Carboidrato complexo'],
    },
    suitableFor: {
      imcRange: {
        min: 30
      },
      ageRange: {
        min: 18,
        max: 80
      }
    },
    modifications: {
      easier: [
        'Realizar sentado',
        'Diminuir a altura do joelho',
        'Usar apoio constante'
      ],
      harder: [
        'Aumentar a velocidade',
        'Adicionar movimentos de braço',
        'Aumentar o tempo de exercício'
      ]
    },
    precautions: [
      'Comece devagar e aumente gradualmente',
      'Mantenha-se hidratado',
      'Pare se sentir falta de ar excessiva',
      'Use calçados apropriados'
    ]
  },
  {
    id: '3b',
    name: 'Alongamento Dinâmico Sentado',
    duration: 15,
    calories: 40,
    steps: [
      'Sente-se em uma cadeira firme',
      'Estique uma perna de cada vez',
      'Faça círculos com os tornozelos',
      'Gire suavemente o tronco para os lados',
      'Realize movimentos de flexão do pescoço'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Exercício suave para melhorar a flexibilidade e mobilidade.',
    difficulty: 'beginner',
    muscleGroup: 'full_body',
    videoUrl: 'https://www.youtube.com/embed/3kg0ZeOYtTo',
    illustrations: [
      {
        url: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Posição sentada para alongamento'
      }
    ],
    tips: [
      'Mantenha os movimentos suaves',
      'Respire profundamente',
      'Não force além do confortável',
      'Mantenha uma boa postura'
    ],
    commonMistakes: [
      'Movimentos bruscos',
      'Prender a respiração',
      'Forçar além do limite',
      'Postura incorreta'
    ],
    breathingPattern: 'Respiração lenta e profunda',
    targetMuscles: ['Isquiotibiais', 'Quadríceps', 'Lombar'],
    secondaryMuscles: ['Panturrilhas', 'Pescoço', 'Ombros'],
    nutrition: {
      preTreino: ['Água', 'Frutas'],
      posTreino: ['Chá verde', 'Castanhas'],
    },
    suitableFor: {
      imcRange: {
        min: 30
      },
      ageRange: {
        min: 18,
        max: 90
      }
    },
    modifications: {
      easier: [
        'Reduzir amplitude dos movimentos',
        'Fazer mais pausas',
        'Movimentos mais lentos'
      ],
      harder: [
        'Aumentar amplitude dos movimentos',
        'Adicionar mais repetições',
        'Incluir outros movimentos'
      ]
    },
    precautions: [
      'Evite movimentos bruscos',
      'Respeite seus limites',
      'Pare se sentir dor',
      'Mantenha-se hidratado'
    ]
  },
  {
    id: '3c',
    name: 'Exercícios de Respiração e Mobilidade',
    duration: 15,
    calories: 30,
    steps: [
      'Sente-se confortavelmente',
      'Inspire profundamente pelo nariz',
      'Expire lentamente pela boca',
      'Adicione movimentos suaves de braços',
      'Pratique respiração diafragmática'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Exercícios para melhorar a respiração e reduzir o estresse.',
    difficulty: 'beginner',
    muscleGroup: 'respiratorio',
    videoUrl: 'https://www.youtube.com/embed/8VwufJrUhic',
    illustrations: [
      {
        url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Posição para exercícios respiratórios'
      }
    ],
    tips: [
      'Mantenha os olhos fechados se possível',
      'Foque na respiração',
      'Mantenha uma postura confortável',
      'Evite distrações'
    ],
    commonMistakes: [
      'Respiração superficial',
      'Tensionar os ombros',
      'Prender a respiração',
      'Postura incorreta'
    ],
    breathingPattern: 'Inspiração 4s, retenção 4s, expiração 6s',
    targetMuscles: ['Diafragma', 'Músculos respiratórios'],
    secondaryMuscles: ['Core', 'Intercostais'],
    nutrition: {
      preTreino: ['Água', 'Chá de camomila'],
      posTreino: ['Água com limão', 'Frutas leves'],
    },
    suitableFor: {
      imcRange: {
        min: 30
      },
      ageRange: {
        min: 18,
        max: 90
      }
    },
    modifications: {
      easier: [
        'Reduzir tempo de retenção',
        'Respiração mais natural',
        'Posição mais confortável'
      ],
      harder: [
        'Aumentar tempo de retenção',
        'Adicionar visualização',
        'Incluir mantras'
      ]
    },
    precautions: [
      'Não force a respiração',
      'Mantenha-se hidratado',
      'Pare se sentir tontura',
      'Pratique em ambiente calmo'
    ]
  },
  // Exercícios para Baixo Peso (IMC < 18.5)
  {
    id: '4',
    name: 'Prancha com Apoio de Joelhos',
    duration: 10,
    calories: 40,
    steps: [
      'Apoie os joelhos e antebraços no chão',
      'Mantenha as costas retas',
      'Contraia o abdômen',
      'Mantenha a posição pelo tempo determinado',
      'Respire normalmente'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Versão modificada da prancha tradicional, focada no fortalecimento do core.',
    difficulty: 'beginner',
    muscleGroup: 'core',
    videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
    illustrations: [
      {
        url: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Posição correta da prancha com apoio'
      }
    ],
    tips: [
      'Mantenha o pescoço neutro',
      'Evite arquear as costas',
      'Respire normalmente',
      'Mantenha o core ativado'
    ],
    commonMistakes: [
      'Quadril muito alto ou baixo',
      'Ombros tensos',
      'Costas arqueadas',
      'Respiração presa'
    ],
    breathingPattern: 'Mantenha uma respiração constante e controlada',
    targetMuscles: ['Core', 'Ombros', 'Costas'],
    secondaryMuscles: ['Glúteos', 'Quadríceps'],
    nutrition: {
      preTreino: ['Banana com pasta de amendoim', 'Aveia'],
      posTreino: ['Whey protein', 'Carboidratos complexos'],
    },
    suitableFor: {
      imcRange: {
        max: 18.5
      },
      ageRange: {
        min: 16,
        max: 60
      }
    },
    modifications: {
      easier: [
        'Prancha na parede',
        'Prancha em plano inclinado',
        'Reduzir o tempo de sustentação'
      ],
      harder: [
        'Prancha tradicional',
        'Adicionar elevação de pernas',
        'Aumentar o tempo de sustentação'
      ]
    },
    precautions: [
      'Evite se tiver dores nas costas',
      'Mantenha a respiração constante',
      'Não force além do seu limite',
      'Pare se sentir desconforto excessivo'
    ]
  },
  // Exercícios para Idosos (60+ anos)
  {
    id: '5',
    name: 'Caminhada com Suporte',
    duration: 15,
    calories: 45,
    steps: [
      'Use uma superfície estável como apoio (mesa ou encosto de cadeira)',
      'Mantenha uma postura ereta',
      'Dê passos controlados no lugar',
      'Alterne as pernas suavemente',
      'Mantenha um ritmo confortável'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Exercício cardiovascular seguro e efetivo para idosos.',
    difficulty: 'beginner',
    muscleGroup: 'full_body',
    videoUrl: 'https://www.youtube.com/embed/JBLU9Q9lcwk',
    illustrations: [
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Caminhada com suporte'
      }
    ],
    tips: [
      'Mantenha sempre um ponto de apoio',
      'Respire naturalmente',
      'Mantenha o olhar à frente',
      'Use sapatos confortáveis e seguros'
    ],
    commonMistakes: [
      'Olhar para baixo',
      'Postura curvada',
      'Passos muito largos',
      'Movimentos bruscos'
    ],
    breathingPattern: 'Respiração natural e constante',
    targetMuscles: ['Quadríceps', 'Panturrilhas'],
    secondaryMuscles: ['Core', 'Glúteos'],
    nutrition: {
      preTreino: ['Água', 'Banana'],
      posTreino: ['Iogurte', 'Biscoitos integrais'],
    },
    suitableFor: {
      imcRange: {
        min: 18.5,
        max: 35
      },
      ageRange: {
        min: 60,
        max: 100
      }
    },
    modifications: {
      easier: [
        'Reduzir a duração',
        'Usar dois pontos de apoio',
        'Fazer pausas frequentes'
      ],
      harder: [
        'Aumentar a duração',
        'Reduzir o apoio',
        'Aumentar levemente a velocidade'
      ]
    },
    precautions: [
      'Mantenha sempre um ponto de apoio próximo',
      'Pare se sentir tontura ou fadiga',
      'Hidrate-se bem',
      'Use calçados antiderrapantes'
    ]
  },
  {
    id: '6',
    name: 'Exercícios de Equilíbrio',
    duration: 10,
    calories: 30,
    steps: [
      'Fique em pé próximo a uma parede ou cadeira para apoio',
      'Levante um pé alguns centímetros do chão',
      'Mantenha a posição por 10 segundos',
      'Alterne as pernas',
      'Repita o processo algumas vezes'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Exercícios para melhorar o equilíbrio e prevenir quedas.',
    difficulty: 'beginner',
    muscleGroup: 'equilibrio',
    videoUrl: 'https://www.youtube.com/embed/z-tUHuNPStw',
    illustrations: [
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Exercício de equilíbrio'
      }
    ],
    tips: [
      'Mantenha sempre um apoio próximo',
      'Olhe para um ponto fixo à frente',
      'Mantenha uma postura ereta',
      'Respire normalmente'
    ],
    commonMistakes: [
      'Olhar para baixo',
      'Prender a respiração',
      'Postura incorreta',
      'Movimentos bruscos'
    ],
    breathingPattern: 'Respiração calma e constante',
    targetMuscles: ['Tornozelos', 'Panturrilhas'],
    secondaryMuscles: ['Core', 'Quadríceps'],
    nutrition: {
      preTreino: ['Água', 'Frutas secas'],
      posTreino: ['Chá', 'Torrada integral'],
    },
    suitableFor: {
      imcRange: {
        min: 18.5,
        max: 35
      },
      ageRange: {
        min: 60,
        max: 100
      }
    },
    modifications: {
      easier: [
        'Manter apoio constante',
        'Reduzir tempo de sustentação',
        'Manter os dois pés no chão'
      ],
      harder: [
        'Reduzir o apoio',
        'Aumentar tempo de sustentação',
        'Fechar os olhos (com apoio próximo)'
      ]
    },
    precautions: [
      'Sempre tenha um apoio por perto',
      'Evite movimentos bruscos',
      'Pare se sentir tontura',
      'Pratique em superfície não escorregadia'
    ]
  },
  {
    id: '7',
    name: 'Alongamento Sentado',
    duration: 15,
    calories: 25,
    steps: [
      'Sente-se em uma cadeira firme',
      'Estique os braços acima da cabeça',
      'Gire suavemente o tronco para os lados',
      'Estique as pernas à frente',
      'Faça movimentos circulares com os tornozelos'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Alongamentos suaves para melhorar a flexibilidade e mobilidade.',
    difficulty: 'beginner',
    muscleGroup: 'full_body',
    videoUrl: 'https://www.youtube.com/embed/4Uzk6f2GnO8',
    illustrations: [
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Alongamento sentado'
      }
    ],
    tips: [
      'Mantenha os movimentos suaves',
      'Não force além do confortável',
      'Respire profundamente',
      'Mantenha uma boa postura'
    ],
    commonMistakes: [
      'Movimentos bruscos',
      'Alongar além do limite',
      'Prender a respiração',
      'Má postura'
    ],
    breathingPattern: 'Respiração lenta e profunda',
    targetMuscles: ['Costas', 'Ombros', 'Pernas'],
    secondaryMuscles: ['Pescoço', 'Braços'],
    nutrition: {
      preTreino: ['Água', 'Frutas'],
      posTreino: ['Chá de camomila', 'Biscoitos integrais'],
    },
    suitableFor: {
      imcRange: {
        min: 18.5,
        max: 35
      },
      ageRange: {
        min: 60,
        max: 100
      }
    },
    modifications: {
      easier: [
        'Reduzir amplitude dos movimentos',
        'Fazer mais pausas',
        'Alongar uma parte do corpo por vez'
      ],
      harder: [
        'Aumentar amplitude dos movimentos',
        'Manter alongamentos por mais tempo',
        'Combinar diferentes movimentos'
      ]
    },
    precautions: [
      'Não force articulações',
      'Evite movimentos bruscos',
      'Respeite seus limites',
      'Mantenha-se hidratado'
    ]
  }
];

// Exportando os exercícios com a propriedade caloriesBurned adicionada
export const BASE_EXERCISES: Exercise[] = mapExercises(BASE_EXERCISES_DATA);