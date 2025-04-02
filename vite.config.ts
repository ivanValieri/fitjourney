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
          rewrite: (path: string) => path,
          headers: {
            'Authorization': `Bearer ${env.VITE_MISTRAL_API_KEY}`,
            'HTTP-Referer': 'http://localhost:5174',
            'X-Title': 'FitJourney',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br'
          },
          configure: (proxy: any, _options: ProxyOptions) => {
            proxy.on('error', (err: Error, req: IncomingMessage, res: ServerResponse) => {
              console.log('[ERRO NO PROXY]', err);
              if (!res.headersSent) {
                res.writeHead(500, {
                  'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({ error: 'Erro no Proxy', detalhes: err.message }));
              }
            });

            proxy.on('proxyReq', (proxyReq: any, req: IncomingMessage, _res: ServerResponse) => {
              console.log('[ENVIANDO REQUISIÇÃO]', {
                url: req.url,
                method: req.method,
                headers: proxyReq.getHeaders()
              });

              // Copia os headers da configuração do proxy
              Object.entries(_options.headers || {}).forEach(([key, value]) => {
                proxyReq.setHeader(key, value as string);
              });

              // Trata o corpo da requisição
              if (req.method === 'POST') {
                const bodyData = (req as any)._body;
                if (bodyData) {
                  try {
                    // Garante que o body é um JSON válido
                    const jsonBody = JSON.parse(bodyData);
                    const stringifiedBody = JSON.stringify(jsonBody);
                    console.log('[CORPO DA REQUISIÇÃO]', stringifiedBody);
                    
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(stringifiedBody));
                    proxyReq.write(stringifiedBody);
                  } catch (error) {
                    console.error('[ERRO AO PROCESSAR BODY]', error);
                  }
                }
              }
            });

            proxy.on('proxyRes', async (proxyRes: any, req: IncomingMessage, res: ServerResponse) => {
              const chunks: Buffer[] = [];
              
              proxyRes.on('data', (chunk: Buffer) => {
                chunks.push(chunk);
              });

              proxyRes.on('end', async () => {
                const buffer = Buffer.concat(chunks);
                let responseBody = '';

                try {
                  // Trata a resposta comprimida
                  if (proxyRes.headers['content-encoding'] === 'br') {
                    const decompressed = await brotliDecompress(buffer);
                    responseBody = decompressed.toString('utf-8');
                  } else {
                    responseBody = buffer.toString('utf-8');
                  }

                  console.log('[RESPOSTA]', {
                    status: proxyRes.statusCode,
                    headers: proxyRes.headers,
                    body: responseBody.substring(0, 200) + '...' // Limita o log
                  });

                  // Remove o header de encoding já que vamos enviar descomprimido
                  delete proxyRes.headers['content-encoding'];

                  try {
                    // Tenta fazer o parse do JSON
                    const jsonResponse = JSON.parse(responseBody);
                    if (!res.headersSent) {
                      res.writeHead(proxyRes.statusCode, {
                        'Content-Type': 'application/json'
                      });
                      res.end(JSON.stringify(jsonResponse));
                    }
                  } catch (error) {
                    console.error('[RESPOSTA INVÁLIDA]', {
                      error,
                      bodyPreview: responseBody.substring(0, 200)
                    });
                    if (!res.headersSent) {
                      res.writeHead(502, {
                        'Content-Type': 'application/json'
                      });
                      res.end(JSON.stringify({
                        error: 'Resposta Inválida',
                        mensagem: 'A API retornou um formato de resposta inválido'
                      }));
                    }
                  }
                } catch (error) {
                  console.error('[ERRO AO PROCESSAR RESPOSTA]', error);
                  if (!res.headersSent) {
                    res.writeHead(500, {
                      'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({
                      error: 'Erro ao Processar Resposta',
                      mensagem: 'Não foi possível processar a resposta da API'
                    }));
                  }
                }
              });
            });
          }
        }
      }
    }
  };
});