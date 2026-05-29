import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './src/components/SplashScreen';
import { HabitProvider } from './src/context/HabitContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

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
