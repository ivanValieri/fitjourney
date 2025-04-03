import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [react()],
    server: {
      port: 5174,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'https://openrouter.ai',
          changeOrigin: true,
          secure: true,
          headers: {
            'Authorization': `Bearer ${env.VITE_MISTRAL_API_KEY}`,
            'HTTP-Referer': 'https://fitjourney-app.vercel.app',
            'X-Title': 'FitJourney'
          }
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  };
});