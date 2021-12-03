import { Theme, DefaultTheme } from '@react-navigation/native';

interface NavigatorThemes {
  dark: Theme;
  light: Theme;
}

const NavigatorTheme: NavigatorThemes = {
  dark: {
    colors: {
      ...DefaultTheme.colors,
      background: '#000000',
    },
    dark: true,
  },
  light: {
    colors: {
      ...DefaultTheme.colors,
      background: '#ffffff',
    },
    dark: false,
  },
};

export default NavigatorTheme;
