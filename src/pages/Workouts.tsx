import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Exercise, Workout } from '../types';

const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newWorkout, setNewWorkout] = useState<Partial<Workout>>({
    name: '',
    description: '',
    duration: 0,
    difficulty: 'beginner',
    exercises: []
  });

  const handleCreateWorkout = () => {
    // TODO: Implementar criação de treino
    setOpenCreateDialog(false);
  };

  const handleStartWorkout = (workoutId: string) => {
    navigate(`/workout/${workoutId}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Meus Treinos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Criar Novo Treino
          </Button>
        </Box>

        <Grid container spacing={3}>
          {workouts.map((workout) => (
            <Grid item xs={12} sm={6} md={4} key={workout.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {workout.name}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {workout.description}
                  </Typography>
                  <Typography variant="body2">
                    Duração: {workout.duration} minutos
                  </Typography>
                  <Typography variant="body2">
                    Dificuldade: {workout.difficulty}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleStartWorkout(workout.id)}
                  >
                    Iniciar
                  </Button>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
          <DialogTitle>Criar Novo Treino</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome do Treino"
              fullWidth
              value={newWorkout.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewWorkout({ ...newWorkout, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Descrição"
              fullWidth
              multiline
              rows={4}
              value={newWorkout.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewWorkout({ ...newWorkout, description: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Duração (minutos)"
              type="number"
              fullWidth
              value={newWorkout.duration}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreateWorkout} variant="contained">
              Criar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Workouts; 