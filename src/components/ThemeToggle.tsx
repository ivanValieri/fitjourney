import React, { useState } from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { HexColorPicker } from 'react-colorful';

const ThemeToggle: React.FC = () => {
  const { theme, gradient, toggleTheme, setGradient, saveThemePreference } = useTheme();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme();
    saveThemePreference(newTheme, gradient);
  };

  const handleStartColorChange = (color: string) => {
    setGradient(color, gradient.endColor);
    saveThemePreference(theme, { startColor: color, endColor: gradient.endColor });
  };

  const handleEndColorChange = (color: string) => {
    setGradient(gradient.startColor, color);
    saveThemePreference(theme, { startColor: gradient.startColor, endColor: color });
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          onClick={handleToggle}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-500" />
          )}
        </button>
        <button
          onClick={() => setShowStartPicker(!showStartPicker)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Escolher cor inicial do gradiente"
        >
          <Palette className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={() => setShowEndPicker(!showEndPicker)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Escolher cor final do gradiente"
        >
          <Palette className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {showStartPicker && (
        <div className="absolute right-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
          <HexColorPicker color={gradient.startColor} onChange={handleStartColorChange} />
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Cor inicial do gradiente
          </div>
        </div>
      )}
      {showEndPicker && (
        <div className="absolute right-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
          <HexColorPicker color={gradient.endColor} onChange={handleEndColorChange} />
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Cor final do gradiente
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;