# FitJourney - Assistente Virtual de Fitness

Um assistente virtual inteligente especializado em fitness e nutrição, construído com React, Vite e Mistral AI.

## 🚀 Funcionalidades

- Chat interativo com IA especializada em fitness
- Histórico de conversas persistente
- Interface moderna e responsiva
- Autenticação de usuários
- Temas claro/escuro

## 🛠️ Tecnologias Utilizadas

- React + Vite
- TypeScript
- TailwindCSS
- Supabase (Autenticação e Banco de Dados)
- Mistral AI (API de Chat)

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- Conta no Supabase
- Chave de API do Mistral AI

## 🔧 Configuração

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd fitjourney
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
VITE_MISTRAL_API_KEY=sua_chave_api_do_mistral
VITE_MISTRAL_API_URL=https://openrouter.ai/api/v1/chat/completions
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🗄️ Estrutura do Banco de Dados

O projeto utiliza o Supabase com as seguintes tabelas:

- `profiles`: Armazena informações dos usuários e histórico de chat
- `chatHistory`: JSONB column para armazenar o histórico de conversas

## 🔒 Segurança

- Todas as chaves de API devem ser mantidas em variáveis de ambiente
- Autenticação via Supabase
- Políticas de segurança (RLS) implementadas no Supabase

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- Seu Nome - [seu-email@exemplo.com]

## 🙏 Agradecimentos

- Mistral AI
- Supabase
- TailwindCSS 