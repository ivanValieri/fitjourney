import { defineConfig, loadEnv, ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
import { IncomingMessage, ServerResponse } from 'http';
import zlib from 'zlib';
import { promisify } from 'util';

const brotliDecompress = promisify(zlib.brotliDecompress);

export default defineConfig(({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [react()],
    server: {
      port: 5174,
      strictPort: true,
      proxy: {
        '/api/v1/chat/completions': {
          target: 'https://openrouter.ai',
          changeOrigin: true,
          secure: true,
          configure: (proxy: any, _options: ProxyOptions) => {
            proxy.on('error', (err: Error, _req: IncomingMessage, res: ServerResponse) => {
              console.error('[ERRO NO PROXY]', err);
              if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Erro no Proxy', detalhes: err.message }));
              }
            });

            proxy.on('proxyReq', (proxyReq: any, req: IncomingMessage, _res: ServerResponse) => {
              // Adiciona os headers necessários
              proxyReq.setHeader('Authorization', `Bearer ${env.VITE_MISTRAL_API_KEY}`);
              proxyReq.setHeader('HTTP-Referer', 'http://localhost:5174');
              proxyReq.setHeader('X-Title', 'FitJourney');
              proxyReq.setHeader('Content-Type', 'application/json');
              proxyReq.setHeader('Accept', 'application/json');

              // Log da requisição
              console.log('[ENVIANDO REQUISIÇÃO]', {
                url: req.url,
                method: req.method,
                headers: proxyReq.getHeaders()
              });

              // Trata o corpo da requisição POST
              if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {
                  body += chunk;
                });

                req.on('end', () => {
                  if (body) {
                    try {
                      const jsonBody = JSON.parse(body);
                      const stringifiedBody = JSON.stringify(jsonBody);
                      proxyReq.setHeader('Content-Length', Buffer.byteLength(stringifiedBody));
                      proxyReq.write(stringifiedBody);
                    } catch (error) {
                      console.error('[ERRO AO PROCESSAR BODY]', error);
                    }
                  }
                });
              }
            });

            proxy.on('proxyRes', (proxyRes: any, _req: IncomingMessage, res: ServerResponse) => {
              let body = '';
              proxyRes.on('data', (chunk: Buffer) => {
                body += chunk;
              });

              proxyRes.on('end', () => {
                try {
                  const jsonBody = JSON.parse(body);
                  res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(jsonBody));
                } catch (error) {
                  console.error('[ERRO NA RESPOSTA]', error);
                  res.writeHead(502, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ 
                    error: 'Resposta Inválida',
                    mensagem: 'A API retornou um formato de resposta inválido'
                  }));
                }
              });
            });
          }
        }
      }
    }
  };
});