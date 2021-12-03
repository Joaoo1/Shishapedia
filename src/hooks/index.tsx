import { AuthProvider } from './auth';
import { ThemeProvider } from './theme';
import FontProvider from './fonts';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ThemeProvider>
      <FontProvider>{children}</FontProvider>
    </ThemeProvider>
  </AuthProvider>
);

export default AppProvider;
