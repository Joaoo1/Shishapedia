import { createContext, useState, useContext, useEffect } from 'react';
import { ToastAndroid } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';

import { useAuth } from '../auth';
import api from '../../services/api';

type NotificationContextProps = {
  unreadNotifications: number;
  setRead: (notificationId: string) => void;
  refreshNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextProps>(
  {} as NotificationContextProps,
);

const NotificationProvider: React.FC = ({ children }) => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const { user, authLoading } = useAuth();

  async function loadNotifications() {
    try {
      const response = await api.get('/notifications/unread');
      setUnreadNotifications(response.data.notifications);
    } catch (err) {
      crashlytics().recordError(err as Error);
      ToastAndroid.show(
        'Ocorreu um erro ao carregar notificações',
        ToastAndroid.LONG,
      );
    }
  }

  const refreshNotifications = () => {
    if (user.id) {
      loadNotifications();
    } else {
      setUnreadNotifications(0);
    }

    setTimeout(() => refreshNotifications(), 30000);
  };

  useEffect(() => {
    if (!authLoading) {
      refreshNotifications();
    }
  }, [authLoading]);

  const setRead = (notificationId: string) => {
    api.put('/notifications', { id: notificationId, read: true });
    setUnreadNotifications(unreadNotifications - 1);
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadNotifications,
        setRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotifications must be used within an NotificationProvider',
    );
  }

  return context;
}

export { NotificationProvider, useNotifications };
