import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import { RootStackParamList } from './types';

const { Screen, Navigator } = createNativeStackNavigator<RootStackParamList>();

// View to avoid a white blinking between screen changes when using dark theme
const AppWrapperViewStyles = { flex: 1, backgroundColor: '#000' };

const NavigatorScreenOptions = {
  headerShown: false,
};

export default function Routes() {
  return (
    <NavigationContainer>
      <View style={AppWrapperViewStyles}>
        <Navigator screenOptions={NavigatorScreenOptions}>
          <Screen name="Home" component={HomeScreen} />
        </Navigator>
        <StatusBar />
      </View>
    </NavigationContainer>
  );
}
