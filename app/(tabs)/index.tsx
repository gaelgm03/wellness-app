/**
 * TAB PRINCIPAL: Home (Wellness Quest)
 * Propósito: Mostrar HomeScreen adaptado para Expo Router
 * Funcionalidades: Mascota, misiones, corazones, progreso
 */

import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Easing,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import DemoData from '../../src/data/DemoData';
import { GameState, createInitialGameState } from '../../src/models/GameState';

// 🖼️ IMÁGENES DE LA MASCOTA
const PET_IMAGES = {
  happy: require('../../assets/images/pet-happy.jpg'),
  sad: require('../../assets/images/pet-sad.jpg'),
};

import StorageService from '../../src/services/StorageService';

export default function HomeScreen() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🎨 ANIMACIONES SÚPER FLUIDAS
  const [petAnimation] = useState(new Animated.Value(1));
  const [feedingAnim] = useState(new Animated.Value(0));
  const [missionCompleteAnim] = useState(new Animated.Value(0));
  const [floatingAnimation] = useState(new Animated.Value(0));
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [glowAnimation] = useState(new Animated.Value(0));
  const [cardScale] = useState(new Animated.Value(1));
  const [cardRotation] = useState(new Animated.Value(0));
  
  // 🎯 ANIMACIONES PARA BOTONES
  const [feedButtonAnim] = useState(new Animated.Value(1));
  const [casinoButtonAnim] = useState(new Animated.Value(1));
  const [missionButtonAnims] = useState([new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]);
  
  // 🎆 SISTEMA DE PARTÍCULAS
  const [particleAnimations] = useState(
    Array(15).fill(null).map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0)
    }))
  );
  
  const { width: screenWidth } = Dimensions.get('window');

  // Cargar datos al montar el componente Y cuando regresa el foco
  useEffect(() => {
    loadGameData();
    setupNotifications();
  }, []);

  // 🔄 RECARGAR DATOS CUANDO LA PANTALLA REGRESA AL FOCO (desde casino)
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 HomeScreen en foco - recargando datos...');
      loadGameData();
    }, [])
  );

  // 📱 CONFIGURAR NOTIFICACIONES (DÍA 3) - Simplificado para evitar errores
  const setupNotifications = async () => {
    try {
      // Configuración simplificada para demo
      console.log('📱 Notificaciones habilitadas para demo');
    } catch (error) {
      console.error('❌ Error configurando notificaciones:', error);
    }
  };

  // 🎭 FUNCIÓN DEBUG: APLICAR DATOS DEMO (para presentación)
  const applyDemoData = async () => {
    try {
      Alert.alert(
        '🎭 Modo Demo',
        '¿Aplicar datos de demostración para presentación?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Aplicar Demo', 
            onPress: async () => {
              setIsLoading(true);
              const demoGameState = await DemoData.applyDemoData(StorageService);
              setGameState(demoGameState);
              setIsLoading(false);
              Alert.alert('🎉', 'Datos demo aplicados! Perfecto para presentación.');
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error aplicando datos demo:', error);
      Alert.alert('Error', 'No se pudieron aplicar los datos demo');
    }
  };

  const loadGameData = async () => {
    try {
      // Verificar si completó onboarding
      const hasOnboarding = await StorageService.hasCompletedOnboarding();
      
      if (!hasOnboarding) {
        // Si no completó onboarding, redirigir
        router.replace('/onboarding' as any);
        return;
      }

      // Cargar estado del juego
      const savedGameState = await StorageService.loadGameState();
      
      // NUEVO DÍA 2: Verificar si es nuevo día y actualizar misiones
      savedGameState.checkAndResetDailyMissions();
      
      setGameState(savedGameState);
      
      // Guardar cambios si hubo reset de día
      await StorageService.saveGameState(savedGameState);
      
      // 📱 NOTIFICACIONES HABILITADAS (simplificado para demo)
      console.log('📱 Sistema de notificaciones listo');
      
      console.log('✅ HomeScreen cargado - Corazones:', savedGameState.hearts);
      console.log('🪙 Monedas actuales:', savedGameState.coins);
      console.log('🗓️ Días completados:', savedGameState.daysCompleted);  
      console.log('🎯 Misiones de hoy:', savedGameState.dailyMissions.map(m => m.title));
      
    } catch (error) {
      console.error('❌ Error cargando datos del juego:', error);
      setGameState(createInitialGameState());
    } finally {
      setIsLoading(false);
    }
  };

  // 🎨 ANIMACIONES ÉPICAS DE MASCOTA (DÍA 3)
  const startPetAnimation = () => {
    const animatePet = () => {
      Animated.sequence([
        // Respiración suave
        Animated.timing(petAnimation, {
          toValue: 1.08,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(petAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(() => animatePet());
    };
    animatePet();
  };

  // 🎉 ANIMACIÓN DE MISIÓN COMPLETADA
  const animateMissionComplete = () => {
    Animated.sequence([
      Animated.timing(missionCompleteAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(missionCompleteAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 💖 ANIMACIÓN DE ALIMENTAR MASCOTA
  const animateFeeding = () => {
    // 🎯 Animación de alimentación con spring physics
    Animated.parallel([
      Animated.spring(feedingAnim, {
        toValue: 1,
        friction: 2,
        tension: 150,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.spring(cardScale, {
          toValue: 0.95,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      Animated.timing(feedingAnim, {
        toValue: 0,
        duration: 2000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    });

    // 🎯 Trigger particle burst
    triggerParticleBurst();

    // Pulso de mascota feliz
    Animated.sequence([
      Animated.timing(petAnimation, {
        toValue: 1.2,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(petAnimation, {
        toValue: 1,
        duration: 400,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 💗 ANIMACIÓN DE PULSO DE CORAZONES
  const startHeartPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    // 🌊 Animación de respiración con physics avanzados
    Animated.loop(
      Animated.sequence([
        Animated.spring(petAnimation, {
          toValue: 1.15,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(petAnimation, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 🌟 Animación de floating suave
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnimation, {
          toValue: -10,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnimation, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // ✨ Pulse effect para elementos importantes
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 💫 Glow effect animación
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0.3,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (gameState && gameState.hearts > 0) {
      startHeartPulse();
    }
  }, [gameState?.hearts]);

  const handleCompleteMission = async (missionId: string, index: number) => {
    if (!gameState) return;

    // 🎮 Animar botón de misión
    if (missionButtonAnims[index]) {
      animateButtonPress(missionButtonAnims[index]);
    }

    const updatedGameState = GameState.fromJSON(gameState.toJSON());
    updatedGameState.completeMission(missionId);
    setGameState(updatedGameState);
    
    // 🎉 ACTIVAR ANIMACIÓN DE MISIÓN COMPLETADA
    animateMissionComplete();
    
    // Guardar en persistencia
    await StorageService.saveGameState(updatedGameState);

    Alert.alert(
      '¡Misión completada! ✅',
      '🎉 Recompensas obtenidas:\n💝 +1 Corazón\n🪙 +10 Monedas',
      [{ text: '¡Genial!' }]
    );
  };

  // 🎆 SISTEMA DE PARTÍCULAS
  const triggerParticleBurst = () => {
    particleAnimations.forEach((particle, index) => {
      const angle = (Math.PI * 2 * index) / particleAnimations.length;
      const distance = 100 + Math.random() * 50;
      
      particle.opacity.setValue(1);
      particle.scale.setValue(0);
      particle.x.setValue(0);
      particle.y.setValue(0);
      
      Animated.parallel([
        Animated.timing(particle.x, {
          toValue: Math.cos(angle) * distance,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: Math.sin(angle) * distance,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.spring(particle.scale, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 1300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // 🎯 ANIMACIONES DE BOTONES INTERACTIVOS
  const animateButtonPress = (buttonAnim: Animated.Value) => {
    Animated.sequence([
      Animated.spring(buttonAnim, {
        toValue: 0.92,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleFeedPet = async () => {
    if (!gameState) return;
    
    // 🎮 Animar botón
    animateButtonPress(feedButtonAnim);
    
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Vibration.vibrate(10);
    }

    if (gameState.hearts === 0) {
      Alert.alert(
        'Sin corazones 💔',
        'Completa misiones para ganar corazones y alimentar a tu mascota',
        [{ text: 'Entendido' }]
      );
      return;
    }

    const updatedGameState = GameState.fromJSON(gameState.toJSON());
    const success = updatedGameState.feedPet();
    
    if (success) {
      setGameState(updatedGameState);
      
      // 💖 ACTIVAR ANIMACIÓN DE ALIMENTAR MASCOTA  
      animateFeeding();
      
      await StorageService.saveGameState(updatedGameState);
      
      Alert.alert(
        '¡Mascota alimentada! 😊',
        `${gameState.pet.name} está feliz y motivado`,
        [{ text: '¡Genial!' }]
      );
    }
  };

  // Pantalla de carga
  if (isLoading) {
    return (
      <LinearGradient
        colors={['#F9FAFB', '#FFFFFF', '#F3F4F6']}
        style={styles.gradientContainer}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Cargando Wellness Quest...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!gameState) {
    return (
      <LinearGradient
        colors={['#F9FAFB', '#FFFFFF', '#F3F4F6']}
        style={styles.gradientContainer}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error cargando los datos</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadGameData}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const petDisplay = {
    emoji: gameState.pet.getMoodEmoji(),
    name: gameState.pet.name,
    status: gameState.pet.getStatusText(),
    mood: gameState.pet.mood
  };
  
  const completionPercentage = gameState.getTodayCompletionPercentage();

  return (
    <LinearGradient
      colors={['#F9FAFB', '#FFFFFF', '#F3F4F6']}
      style={styles.gradientContainer}
    >
    <SafeAreaView style={styles.container}>
      {/* 🌌 HEADER GLASSMORPHISM */}
      <BlurView intensity={95} tint="light" style={styles.headerBlur}>
        <View style={styles.header}>
        <TouchableOpacity onLongPress={applyDemoData} delayLongPress={2000}>
          <Text style={styles.appTitle}>Wellness Quest</Text>
        </TouchableOpacity>
        
        <View style={styles.currencyContainer}>
          {/* Corazones */}
          <View style={styles.heartsContainer}>
            <Animated.Text 
              style={[
                styles.heartsIcon,
                gameState.hearts > 0 && { transform: [{ scale: pulseAnimation }] }
              ]}
            >
              ❤️
            </Animated.Text>
            <Text style={styles.heartsCount}>{gameState.hearts}</Text>
          </View>
          
          {/* 🍰 MONEDAS NUEVAS - Con botón secreto para añadir más */}
          <TouchableOpacity 
            style={styles.coinsContainer}
            onLongPress={async () => {
              if (!gameState) return;
              const updatedGameState = GameState.fromJSON(gameState.toJSON());
              updatedGameState.coins += 1000;
              setGameState(updatedGameState);
              await StorageService.saveGameState(updatedGameState);
              console.log('🪙 Monedas de testing aplicadas:', updatedGameState.coins);
              Alert.alert('🍰', '¡+1000 monedas añadidas para testing!');
            }}
            delayLongPress={3000}
          >
            <Text style={styles.coinsIcon}>🪙</Text>
            <Text style={styles.coinsCount}>{gameState.coins}</Text>
          </TouchableOpacity>
        </View>
      </View>
      </BlurView>

    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* 🎆 PARTÍCULAS FLOTANTES */}
      <View style={styles.particlesContainer} pointerEvents="none">
        {particleAnimations.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                opacity: particle.opacity,
                transform: [
                  { translateX: particle.x },
                  { translateY: particle.y },
                  { scale: particle.scale }
                ]
              }
            ]}
          >
            <Text style={styles.particleEmoji}>
              {['✨', '💖', '🌟', '✨', '💫'][index % 5]}
            </Text>
          </Animated.View>
        ))}
      </View>

      {/* 🎨 HERO SECTION CON GLASSMORPHISM */}
      <Animated.View style={[
        styles.heroSection,
        {
          transform: [
            { translateY: floatingAnimation },
            { scale: cardScale }
          ]
        }
      ]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(239,239,228,0.85)']}
          style={styles.heroGradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        >
        <BlurView intensity={80} tint="light" style={styles.heroBlur}>
        <View style={styles.heroCard}>
          {/* Header del Hero */}
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroTitle}>Diem</Text>
              <Text style={styles.heroSubtitle}>Actividades Diarias</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>{gameState.daysCompleted}</Text>
              <Text style={styles.streakLabelModern}>días</Text>
            </View>
          </View>

          {/* 🌠 MASCOTA CON EFECTOS AVANZADOS */}
          <View style={styles.petHeroContainer}>
            <Animated.View style={[
              styles.petBackground,
              {
                shadowOpacity: glowAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.1, 0.3]
                })
              }
            ]}>
              <Animated.View style={[
                styles.petImageContainer,
                { transform: [{ scale: petAnimation }] }
              ]}>
                <Image 
                  source={petDisplay.mood === 'feliz' ? PET_IMAGES.happy : PET_IMAGES.sad}
                  style={styles.petImage}
                  resizeMode="contain"
                />
              </Animated.View>
              
              {/* Efectos flotantes modernos */}
              <Animated.View style={[
                styles.floatingHearts,
                {
                  opacity: feedingAnim,
                  transform: [
                    { translateY: feedingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -40]
                    }) }
                  ]
                }
              ]}>
                <Text style={styles.floatingHeartsText}>💖💫✨</Text>
              </Animated.View>
              
              <Animated.View style={[
                styles.missionCompleteEffect,
                {
                  opacity: missionCompleteAnim,
                  transform: [{ scale: missionCompleteAnim }]
                }
              ]}>
                <Text style={styles.missionCompleteText}>¡Increíble! 🎉</Text>
              </Animated.View>
            </Animated.View>
            
            {/* 💬 MENSAJE CON EFECTO TYPEWRITER */}
            <Animated.Text style={[
              styles.petMessage,
              { opacity: pulseAnimation }
            ]}>
              {petDisplay.mood === 'feliz' ? '¡Estoy muy feliz contigo! 😊' : 'Necesito tu cuidado... 🥺'}
            </Animated.Text>
          </View>

          {/* Botones de acción modernos CON ANIMACIONES */}
          <View style={styles.heroButtons}>
            <Animated.View style={{ transform: [{ scale: feedButtonAnim }], flex: 1 }}>
              <TouchableOpacity
                style={[
                  styles.modernButton,
                  styles.feedButtonModern,
                  gameState.hearts === 0 && styles.modernButtonDisabled
                ]}
                onPress={handleFeedPet}
                disabled={gameState.hearts === 0}
                activeOpacity={0.8}
              >
                <Text style={styles.modernButtonText}>
                  💝 Alimentar
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View style={{ transform: [{ scale: casinoButtonAnim }], flex: 1 }}>
              <TouchableOpacity
                style={[styles.modernButton, styles.casinoButtonModern]}
                onPress={() => {
                  animateButtonPress(casinoButtonAnim);
                  setTimeout(() => router.push('/casino' as any), 100);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modernButtonText}>
                  🎰 Casino
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        </BlurView>
        </LinearGradient>
      </Animated.View>
      {/* Estilos para progreso moderno */}
      <Animated.View style={[
        styles.progressModernSection,
        {
          transform: [{ scale: pulseAnimation }]
        }
      ]}>
        <Text style={styles.progressModernTitle}>Tu Progreso Hoy</Text>
        
        <BlurView intensity={70} tint="light" style={styles.progressBlur}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(124,58,237,0.08)']}
          style={styles.progressGradient}
        >
        <View style={styles.progressModernCard}>
          {/* Stats principales */}
          <View style={styles.progressMainStats}>
            <View style={styles.progressStatBox}>
              <Text style={styles.progressStatLabel}>Completadas:</Text>
              <Text style={styles.progressStatValue}>
                {gameState.dailyMissions.filter(m => m.isCompleted()).length}/3
              </Text>
              <Text style={styles.progressStatPercentage}>{completionPercentage}%</Text>
            </View>
          </View>
          
          {/* Barra de progreso moderna */}
          <View style={styles.progressBarModern}>
            <View style={[
              styles.progressBarFill, 
              { width: `${completionPercentage}%` }
            ]} />
          </View>
          
          {/* Stats inferiores */}
          <View style={styles.progressBottomStats}>
            <View style={styles.progressBottomItem}>
              <Text style={styles.progressBottomNumber}>
                {gameState.dailyMissions.filter(m => m.isCompleted()).length}
              </Text>
              <Text style={styles.progressBottomLabel}>Realizadas</Text>
            </View>
            
            <View style={styles.progressBottomItem}>
              <Text style={styles.progressBottomNumber}>{gameState.daysCompleted}</Text>
              <Text style={styles.progressBottomLabel}>Consecutivos días</Text>
            </View>
          </View>
        </View>
        </LinearGradient>
        </BlurView>
      </Animated.View>

      {/* Misiones Diarias */}
      <View style={styles.missionsSection}>
        <Text style={styles.sectionTitle}>Misiones de Hoy (3)</Text>
        
        {gameState.dailyMissions.map((mission, index) => (
          <View key={mission.id} style={styles.missionCard}>
            <View style={styles.missionHeader}>
              <Text style={styles.missionTitle}>{mission.title}</Text>
              <Text style={styles.missionDuration}>{mission.getDurationText()}</Text>
            </View>
            
            <Text style={styles.missionDescription}>{mission.description}</Text>
            
            <View style={styles.missionFooter}>
              <View style={styles.missionMeta}>
                <Text style={styles.missionCategory}>
                  {mission.category === 'energia' ? '⚡' : 
                   mission.category === 'estres' ? '🧘' : '🏃'} 
                  {mission.category}
                </Text>
                <Text style={styles.missionIntensity}>
                  • {mission.intensity}
                </Text>
              </View>

              {mission.isCompleted() ? (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✅ Completada</Text>
                </View>
              ) : (
                <Animated.View style={{ transform: [{ scale: missionButtonAnims[index] || new Animated.Value(1) }] }}>
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => handleCompleteMission(mission.id, index)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.completeButtonText}>Completar</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Mensaje motivacional */}
      <View style={styles.motivationSection}>
        <Text style={styles.motivationText}>
          {completionPercentage === 100 
            ? "¡Increíble! Has completado todas las misiones de hoy 🎉"
            : completionPercentage > 0
            ? "¡Buen trabajo! Sigue así 💪"
            : "¡Comienza tu día con una pequeña misión! 🌱"
          }
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
  </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // 🎆 CONTENEDORES PRINCIPALES
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerBlur: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  heroGradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroBlur: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  progressBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
  },
  
  // 🎆 PARTÍCULAS
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  particle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  particleEmoji: {
    fontSize: 24,
  },
  
  // Estilos para glassmorphism que se removieron
  glassmorphismContainer: {
    marginVertical: 10,
  },
  glassmorphismBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  glassmorphismCard: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7C3AED',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: -0.5,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#EC4899',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  // 🎰 ESTILOS PARA MONEDAS
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  coinsIcon: {
    fontSize: 18,
    marginRight: 4,
    color: '#F59E0B',
  },
  coinsCount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F59E0B',
  },
  heartsIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  heartsCount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EC4899',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  petSection: {
    marginBottom: 24,
  },
  petCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  petCardHappy: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  petCardSad: {
    borderColor: '#FF9800',
    backgroundColor: '#FFF3E0',
  },
  petContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginBottom: 12,
  },
  petEmoji: {
    fontSize: 64,
  },
  // 🎨 ESTILOS PARA ANIMACIONES ÉPICAS (DÍA 3)
  floatingHearts: {
    position: 'absolute',
    top: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingHeartsText: {
    fontSize: 20,
    textAlign: 'center',
  },
  missionCompleteEffect: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  missionCompleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  petInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  petStatus: {
    fontSize: 14,
  },
  petStatusHappy: {
    color: '#4CAF50',
  },
  petStatusSad: {
    color: '#FF9800',
  },
  petButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },
  feedButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
  },
  // 🎰 ESTILOS PARA BOTÓN CASINO
  casinoButton: {
    backgroundColor: '#F39C12',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
  },
  casinoButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  feedButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  feedButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressMain: {
    alignItems: 'center',
    flex: 1,
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  streakContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  streakEmoji: {
    fontSize: 20,
  },
  streakNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 2,
  },
  streakLabelOld: {
    fontSize: 10,
    color: '#FF9800',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  progressBarOld: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFillOld: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  missionsSection: {
    marginBottom: 24,
    width: '100%',
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 5,
    borderLeftColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  missionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  missionDuration: {
    fontSize: 12,
    color: '#7C3AED',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    fontWeight: '600',
  },
  missionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionCategory: {
    fontSize: 12,
    color: '#4CAF50',
    textTransform: 'capitalize',
  },
  missionIntensity: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  completeButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  completedText: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 13,
  },
  motivationSection: {
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#E9D5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  motivationText: {
    fontSize: 15,
    color: '#7C3AED',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
  },

  // ESTILOS MODERNOS PARA EL NUEVO DISEÑO
  heroSection: {
    marginBottom: 24,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  streakBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  streakText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  streakLabelModern: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 2,
    fontWeight: '600',
  },
  petHeroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  petBackground: {
    width: 170,
    height: 130,
    borderRadius: 24,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#E9D5FF',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  petImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petImage: {
    width: 150,
    height: 110,
  },
  petMessage: {
    fontSize: 16,
    color: '#7C3AED',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  modernButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  feedButtonModern: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  casinoButtonModern: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
  },
  modernButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0.1,
  },
  modernButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ESTILOS PARA PROGRESO MODERNO
  progressModernSection: {
    marginBottom: 24,
    width: '100%',
  },
  progressModernTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  progressModernCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressMainStats: {
    marginBottom: 16,
  },
  progressStatBox: {
    alignItems: 'flex-start',
  },
  progressStatLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  progressStatValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  progressStatPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  progressBarModern: {
    height: 10,
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  progressBottomStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  progressBottomItem: {
    alignItems: 'center',
  },
  progressBottomNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#7C3AED',
  },
  progressBottomLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },

});
