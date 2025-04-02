import React, { useState } from 'react';
import { X, Mail, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
  showClose?: boolean;
}

export default function AuthModal({ onClose, onSuccess, showClose = true }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('Renderizando AuthModal', { email, password, isSignUp, loading, error });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        console.log('Tentando criar conta com:', { email, password });
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          console.error('Erro ao criar conta:', error.message);
          setError(error.message);
          toast.error(`Erro ao criar conta: ${error.message}`);
          setLoading(false);
          return;
        }

        if (data.user) {
          toast.success('Conta criada com sucesso! Verifique seu e-mail para confirmar.');
          onSuccess();
        }
      } else {
        console.log('Tentando fazer login com:', { email, password });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Erro ao fazer login:', error.message);
          setError(error.message);
          toast.error(`Erro ao fazer login: ${error.message}`);
          setLoading(false);
          return;
        }

        if (data.session) {
          toast.success('Login realizado com sucesso!');
          onSuccess();
        }
      }
    } catch (err: any) {
      console.error('Erro inesperado:', err.message);
      setError('Ocorreu um erro inesperado. Tente novamente.');
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          {showClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isSignUp ? 'Crie sua Conta' : 'Faça Login'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="••••••"
                  required
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                'Carregando...'
              ) : (
                <>
                  <span>{isSignUp ? 'Criar Conta' : 'Entrar'}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="ml-1 text-purple-600 hover:text-purple-700 font-medium"
              >
                {isSignUp ? 'Faça login' : 'Crie uma conta'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}