import { createHashRouter } from 'react-router-dom';
import App from './App';
import ResetPassword from './components/ResetPassword';
import Home from './pages/Home';
import Workouts from './pages/Workouts';
import Progress from './pages/Progress';
import Profile from './pages/Profile';

// Usando HashRouter em vez de BrowserRouter para melhor compatibilidade com hospedagem estática
export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/workouts',
        element: <Workouts />
      },
      {
        path: '/progress',
        element: <Progress />
      },
      {
        path: '/profile',
        element: <Profile />
      }
    ]
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
]); 