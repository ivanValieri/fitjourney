import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: 'https://openrouter.ai',
          changeOrigin: true,
          secure: false,
          headers: {
            'Origin': 'https://fitjourney-app-git-main-ivans-projects-65cdd8ca.vercel.app'
          }
        }
      }
    },
    define: {
      'process.env': env
    }
  };
});