import { createHashRouter } from 'react-router-dom';
import App from './App';
import ResetPassword from './components/ResetPassword';

// Usando HashRouter em vez de BrowserRouter para melhor compatibilidade com hospedagem estática
export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
]); 