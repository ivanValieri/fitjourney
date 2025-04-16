import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

// Componente wrapper para garantir que o CSS seja carregado
const AppWithCSSLoader = () => {
  useEffect(() => {
    // Tenta carregar o CSS diretamente se necessário
    try {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/styles.css'; // Nome genérico que será resolvido pelo hash
      link.id = 'dynamic-css';
      
      // Só adiciona se ainda não existir
      if (!document.getElementById('dynamic-css')) {
        document.head.appendChild(link);
      }
      
      console.log('CSS dinâmico adicionado:', link.href);
    } catch (error) {
      console.error('Erro ao carregar CSS dinâmico:', error);
    }
  }, []);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithCSSLoader />
  </StrictMode>
);