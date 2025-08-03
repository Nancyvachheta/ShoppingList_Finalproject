import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import 'react-native-gesture-handler';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}