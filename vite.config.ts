import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production';

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
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    define: {
      'process.env': {
        ...env,
        VITE_MISTRAL_API_KEY: JSON.stringify(env.VITE_MISTRAL_API_KEY),
        VITE_MISTRAL_API_URL: JSON.stringify(env.VITE_MISTRAL_API_URL),
        VITE_MISTRAL_MODEL: JSON.stringify(env.VITE_MISTRAL_MODEL)
      }
    }
  };
});