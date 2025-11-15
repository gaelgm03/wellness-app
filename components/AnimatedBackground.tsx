/**
 * COMPONENTE: Fondo Animado
 * Gradiente animado que cambia según la pantalla activa
 */

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface AnimatedBackgroundProps {
  screen: 'home' | 'casino' | 'onboarding';
  children: React.ReactNode;
}

const GRADIENT_CONFIGS = {
  home: {
    colors: ['#F9FAFB', '#FFFFFF', '#F3F4F6'] as const,
    locations: [0, 0.5, 1] as const,
  },
  casino: {
    colors: ['#FEF3C7', '#FDE68A', '#FCD34D'] as const,
    locations: [0, 0.5, 1] as const,
  },
  onboarding: {
    colors: ['#EDE9FE', '#DDD6FE', '#C4B5FD'] as const,
    locations: [0, 0.5, 1] as const,
  },
};

export default function AnimatedBackground({ screen, children }: AnimatedBackgroundProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const config = GRADIENT_CONFIGS[screen];

  return (
    <LinearGradient
      colors={config.colors}
      locations={config.locations}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
