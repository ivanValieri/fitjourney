import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ResetPassword from './components/ResetPassword';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
]); 