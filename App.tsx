import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HabitProvider } from './src/context/HabitContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <HabitProvider>
        <AppNavigator />
      </HabitProvider>
    </SafeAreaProvider>
  );
}

export default App;
