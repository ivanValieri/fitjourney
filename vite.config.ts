import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: 5174,
      strictPort: true,
      cors: true
    },
    define: {
      'process.env.VITE_MISTRAL_API_KEY': JSON.stringify(env.VITE_MISTRAL_API_KEY)
    }
  };
});