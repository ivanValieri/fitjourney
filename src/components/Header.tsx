import React from 'react';
import { Dumbbell, User, Bell, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onAuthClick: () => void;
  isAuthenticated: boolean;
}

export default function Header({ onAuthClick, isAuthenticated }: HeaderProps) {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-4 px-6 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Dumbbell className="h-8 w-8" />
          <h1 className="text-2xl font-bold">FitJourney Pro</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <button className="p-2 hover:bg-white/10 rounded-full">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full">
                <User className="h-6 w-6" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </>
          ) : (
            <button
              onClick={onAuthClick}
              className="bg-white text-purple-600 px-4 py-2 rounded-xl hover:bg-white/90 transition-colors font-medium"
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}