import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { MSTProvider } from './src/schema/mobx/MobxContext';
import { MSTRoot } from './src/schema/mobx/MobxRoot';
// import { ThemeProvider } from './src/providers/ThemeProvider';
// import { LocalizationProvider } from './src/providers/LocalizationProvider';
// import { Ionicons } from '@expo/vector-icons'; // Uncomment if you want to use icons

export default function App() {
  return (
    <MSTProvider value={MSTRoot}>
      <AppNavigator />
    </MSTProvider>
  );
}
