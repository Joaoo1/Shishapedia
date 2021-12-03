import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemeContextProps = {
  isDarkTheme: boolean | null;
  setDarkTheme: (isDark: boolean) => void;
};

const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

const ThemeProvider: React.FC = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkTheme, setDarkTheme] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const darkTheme = await AsyncStorage.getItem('@Shishapedia:darkTheme');

      if (darkTheme !== null) {
        setDarkTheme(darkTheme === 'true');
        return;
      }

      setDarkTheme(systemColorScheme === 'dark');
    })();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        setDarkTheme,
        isDarkTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within an ThemeProvider');
  }

  return context;
}

export { ThemeProvider, useTheme };
