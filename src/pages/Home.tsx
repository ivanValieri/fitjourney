import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container, Grid } from '@mui/material';
import { FitnessCenter, DirectionsRun, TrendingUp, EmojiEvents } from '@mui/icons-material';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features: Feature[] = [
    {
      icon: <FitnessCenter sx={{ fontSize: 40 }} />,
      title: 'Exercícios Personalizados',
      description: 'Acesse uma biblioteca completa de exercícios adaptados para sua condição física.'
    },
    {
      icon: <DirectionsRun sx={{ fontSize: 40 }} />,
      title: 'Acompanhamento de Progresso',
      description: 'Monitore seu desenvolvimento e conquiste suas metas de forma eficiente.'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Estatísticas Detalhadas',
      description: 'Visualize gráficos e relatórios do seu desempenho ao longo do tempo.'
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      title: 'Conquistas e Recompensas',
      description: 'Desbloqueie conquistas e seja recompensado por seu esforço e dedicação.'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 8
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Bem-vindo ao FitJourney
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Sua jornada para uma vida mais saudável começa aqui
        </Typography>
        <Box sx={{ mt: 4, mb: 8 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/workouts')}
            sx={{ mr: 2 }}
          >
            Começar Treino
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/progress')}
          >
            Ver Progresso
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <Box sx={{ mb: 2, color: 'primary.main' }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 