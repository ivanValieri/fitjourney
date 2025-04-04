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
      host: true
    },
    define: {
      'process.env': {
        ...env,
        VITE_OPENROUTER_API_KEY: JSON.stringify(env.VITE_OPENROUTER_API_KEY)
      }
    }
  };
});