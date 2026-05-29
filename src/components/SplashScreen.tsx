import React, { useEffect } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SPLASH_BG,
  SPLASH_DURATION_MS,
  SPLASH_QUOTE,
  SPLASH_TITLE,
} from '../constants/splash';

const appIcon = require('../assets/app-icon.png');

type SplashScreenProps = {
  onDone: () => void;
};

export function SplashScreen({ onDone }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={SPLASH_BG} />
      <Image
        source={appIcon}
        style={styles.icon}
        accessibilityLabel="DailyBit app icon"
      />
      <Text style={styles.title}>{SPLASH_TITLE}</Text>
      <Text style={styles.quote}>{SPLASH_QUOTE}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_BG,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  quote: {
    fontSize: 16,
    color: '#C4B5FD',
    textAlign: 'center',
    lineHeight: 22,
  },
});
