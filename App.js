import React from 'react';
import { AuthProvider } from './AuthContext';        // Import AuthProvider correctly
import { ThemeProvider } from './ThemeContext';      // Your ThemeProvider import
import RootNavigator from './navigation/RootNavigator';  // Import RootNavigator
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
