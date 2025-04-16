import { supabase } from '../lib/supabase';
import { ChatMessage, ChatConversation, ChatHistory } from '../types';

export class ChatService {
  /**
   * Salva uma nova conversa no histórico do usuário
   */
  static async saveConversation(userId: string, messages: ChatMessage[]): Promise<ChatHistory | null> {
    try {
      const conversation: ChatConversation = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        messages
      };

      const { data, error } = await supabase.rpc(
        'add_chat_conversation',
        {
          user_id: userId,
          conversation
        }
      );

      if (error) {
        console.error('Erro ao salvar conversa:', error);
        return null;
      }

      return data as ChatHistory;
    } catch (error) {
      console.error('Erro ao salvar conversa:', error);
      return null;
    }
  }

  /**
   * Carrega o histórico de conversas do usuário
   */
  static async loadChatHistory(userId: string): Promise<ChatHistory | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('chatHistory')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao carregar histórico:', error);
        return null;
      }

      return data?.chatHistory || null;
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return null;
    }
  }

  /**
   * Limpa todo o histórico de conversas do usuário
   */
  static async clearChatHistory(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          chatHistory: {
            conversations: [],
            lastInteraction: null
          }
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Erro ao limpar histórico:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      return false;
    }
  }

  /**
   * Deleta uma conversa específica do histórico
   */
  static async deleteConversation(userId: string, conversationId: string): Promise<boolean> {
    try {
      // Primeiro, carregamos o histórico atual
      const history = await this.loadChatHistory(userId);
      if (!history) return false;

      // Filtramos a conversa que queremos remover
      const updatedConversations = history.conversations.filter(
        conv => conv.id !== conversationId
      );

      // Atualizamos o histórico
      const { error } = await supabase
        .from('profiles')
        .update({
          chatHistory: {
            conversations: updatedConversations,
            lastInteraction: history.lastInteraction
          }
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Erro ao deletar conversa:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
      return false;
    }
  }
} 