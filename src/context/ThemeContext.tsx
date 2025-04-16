import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  gradient: { startColor: string; endColor: string };
  toggleTheme: () => void;
  setGradient: (startColor: string, endColor: string) => void;
  saveThemePreference: (theme: Theme, gradient: { startColor: string; endColor: string }) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [gradient, setGradientState] = useState<{ startColor: string; endColor: string }>({
    startColor: '#f3f4f6', // Cor inicial padrão (equivalente a bg-gray-100)
    endColor: '#d1d5db',   // Cor final padrão (equivalente a bg-gray-300)
  });

  useEffect(() => {
    // Carregar tema e gradiente salvos do localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedGradient = localStorage.getItem('gradient');
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
    
    if (savedGradient) {
      const parsedGradient = JSON.parse(savedGradient);
      setGradientState(parsedGradient);
      applyGradient(parsedGradient.startColor, parsedGradient.endColor);
    }

    // Carregar preferências do usuário do Supabase
    const loadUserPreference = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('themePreferences')
          .eq('user_id', session.user.id)
          .single();

        if (profile?.themePreferences) {
          if (profile.themePreferences.theme) {
            setTheme(profile.themePreferences.theme);
            document.documentElement.classList.toggle('dark', profile.themePreferences.theme === 'dark');
          }
          if (profile.themePreferences.gradient) {
            setGradientState(profile.themePreferences.gradient);
            applyGradient(profile.themePreferences.gradient.startColor, profile.themePreferences.gradient.endColor);
          }
        }
      }
    };

    loadUserPreference();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const setGradient = (startColor: string, endColor: string) => {
    const newGradient = { startColor, endColor };
    setGradientState(newGradient);
    localStorage.setItem('gradient', JSON.stringify(newGradient));
    applyGradient(startColor, endColor);
  };

  const applyGradient = (startColor: string, endColor: string) => {
    document.documentElement.style.background = `linear-gradient(to bottom, ${startColor}, ${endColor})`;
  };

  const saveThemePreference = async (selectedTheme: Theme, selectedGradient: { startColor: string; endColor: string }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      await supabase
        .from('profiles')
        .update({
          themePreferences: { 
            theme: selectedTheme,
            gradient: selectedGradient,
          }
        })
        .eq('user_id', session.user.id);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      gradient,
      toggleTheme, 
      setGradient,
      saveThemePreference 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};