import Navigator from './src/routes';
import AppProvider from './src/hooks';

export default function App() {
  return (
    <AppProvider>
      <Navigator />
    </AppProvider>
  );
}
