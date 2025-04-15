import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { askMistral } from '../api/mistral';
import { ChatService } from '../api/chatService';
import { ChatMessage, Exercise } from '../types';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { ChatbotProps } from './types';

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ onWorkoutComplete }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user?.id) {
      loadChatHistory();
    }
  }, [isOpen, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const loadChatHistory = async () => {
    if (!user?.id) return;

    const history = await ChatService.loadChatHistory(user.id);
    if (history && history.conversations.length > 0) {
      const latestConversation = history.conversations[0];
      const formattedMessages: Message[] = latestConversation.messages.map(msg => ({
        text: msg.content,
        isUser: msg.role === 'user',
        timestamp: msg.timestamp
      }));
      setMessages(formattedMessages);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || !user?.id) return;

    const timestamp = new Date().toISOString();
    const userMessage: Message = { text: inputText, isUser: true, timestamp };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setStreamingText('');

    try {
      const fullResponse = await askMistral(inputText, (chunk) => {
        setStreamingText(prev => prev + chunk);
      });

      const assistantMessage: Message = {
        text: fullResponse,
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingText('');

      const chatMessages: ChatMessage[] = [
        {
          role: 'user',
          content: userMessage.text,
          timestamp: userMessage.timestamp!
        },
        {
          role: 'assistant',
          content: assistantMessage.text,
          timestamp: assistantMessage.timestamp!
        }
      ];
      await ChatService.saveConversation(user.id, chatMessages);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao processar sua mensagem. Tente novamente.');
      setMessages(prev => [...prev, {
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
        isUser: false,
        timestamp: new Date().toISOString()
      }]);
      setStreamingText('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <div className="w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col border border-gray-200 dark:border-gray-700">
          <div className="bg-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Assistente FitJourney</h3>
              <p className="text-sm text-white/80">Powered by Mistral AI</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
                <p>👋 Olá! Como posso ajudar você hoje?</p>
                <p className="text-sm mt-2">Você pode me perguntar sobre:</p>
                <ul className="text-sm mt-1">
                  <li>• Exercícios e treinos</li>
                  <li>• Dicas de nutrição</li>
                  <li>• Planos de treino</li>
                  <li>• Dúvidas sobre saúde e fitness</li>
                </ul>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.isUser ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isUser
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.timestamp && (
                    <p className={`text-xs mt-1 ${
                      msg.isUser ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {formatTimestamp(msg.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {streamingText && (
              <div className="mb-4 flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                  <p className="whitespace-pre-wrap">{streamingText}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={2}
                disabled={isLoading || !user}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputText.trim() || !user}
                className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              {user ?
                'Pressione Enter para enviar, Shift + Enter para nova linha' :
                'Faça login para usar o chat'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
