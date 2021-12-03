import {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';

import api from '../../services/api';

export type User = {
  id: string;
};

export type AuthProps = {
  user: User;
  authLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: (token: string) => Promise<void>;
};

const AuthContext = createContext<AuthProps>({} as AuthProps);

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>({} as User);
  const [authLoading, setLoading] = useState(true);

  async function loadStorageData() {
    try {
      const [token, userJson] = await AsyncStorage.multiGet([
        '@Shishapedia:userToken',
        '@Shishapedia:user',
      ]);

      if (token[1] && userJson[1]) {
        api.defaults.headers.common.authorization = `Bearer ${token[1]}`;

        const mUser = JSON.parse(userJson[1]);
        setUser(mUser);

        const fcmToken = await messaging().getToken();
        api.post('/fcmTokens', { fcmToken });
        await crashlytics().setUserId(mUser.id.toString());
      }
    } catch (err) {
      crashlytics().recordError(err as Error);
      ToastAndroid.show('Erro ao carregar usuário', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStorageData();
  }, []);

  const signIn = useCallback(async (token: string) => {
    api.defaults.headers.common.authorization = `Bearer ${token}`;

    try {
      const { data } = await api.get('/user');
      await AsyncStorage.multiSet([
        ['@Shishapedia:userToken', token],
        ['@Shishapedia:user', JSON.stringify(user)],
      ]);
      setUser(data);

      const fcmToken = await messaging().getToken();
      await api.post('/fcmTokens', { fcmToken });
      await crashlytics().setUserId(data.id.toString());
    } catch (err) {
      crashlytics().recordError(err as Error);
      ToastAndroid.show('Erro ao carregar usuário', ToastAndroid.SHORT);
    }
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([
      '@Shishapedia:user',
      '@Shishapedia:userToken',
    ]);

    const fcmToken = await messaging().getToken();
    api.delete(`/fcmTokens/${fcmToken}`);
    setUser({} as User);
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext<AuthProps>(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
