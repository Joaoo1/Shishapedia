import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_300Light,
  useFonts,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

/* 
  If the fonts are changed, 
  it's necessary to change the fonts file inside the themes folder
*/
const FontProvider: React.FC = ({ children }) => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_300Light,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <>{children}</>;
};

export default FontProvider;
