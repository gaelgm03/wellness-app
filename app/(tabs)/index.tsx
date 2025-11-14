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
  Easing,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Tipos específicos para evitar conflictos
import DemoData from '../../src/data/DemoData';
import { GameState, createInitialGameState } from '../../src/models/GameState';

// 🖼️ IMÁGENES DE LA MASCOTA
const PET_IMAGES = {
  happy: require('../../assets/images/pet-happy.jpg'),
  sad: require('../../assets/images/pet-sad.jpg'),
};
// import NotificationService from '../../src/services/NotificationService'; // Comentado para evitar errores de build
import StorageService from '../../src/services/StorageService';

export default function HomeScreen() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🎨 ANIMACIONES CABRONES (DÍA 3)
  const [petAnimation] = useState(new Animated.Value(1));
  const [heartPulse] = useState(new Animated.Value(1));
  const [missionCompleteAnim] = useState(new Animated.Value(0));
  const [feedingAnim] = useState(new Animated.Value(0));

  // Cargar datos al montar el componente Y cuando regresa el foco
  useEffect(() => {
    loadGameData();
    startPetAnimation();
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
      
      // 🎰 HACK TEMPORAL: Dar monedas para testing casino
      if (savedGameState.coins < 100) {
        savedGameState.coins = 500; // Asegurar que siempre tengas monedas para probar
        console.log('🪙 Monedas de testing aplicadas:', savedGameState.coins);
      }
      
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
    // Animación de corazones flotantes
    Animated.sequence([
      Animated.timing(feedingAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(feedingAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

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
        Animated.timing(heartPulse, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(heartPulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Iniciar animación de corazones cuando hay hearts > 0
  useEffect(() => {
    if (gameState && gameState.hearts > 0) {
      startHeartPulse();
    }
  }, [gameState?.hearts]);

  const handleCompleteMission = async (missionId: string) => {
    if (!gameState) return;

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

  const handleFeedPet = async () => {
    if (!gameState) return;

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando Wellness Quest...</Text>
      </View>
    );
  }

  if (!gameState) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error cargando los datos</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadGameData}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
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
    <SafeAreaView style={styles.container}>
      {/* Header con corazones y MONEDAS ANIMADOS (DÍA 3) */}
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
                gameState.hearts > 0 && { transform: [{ scale: heartPulse }] }
              ]}
            >
              💝
            </Animated.Text>
            <Text style={styles.heartsCount}>{gameState.hearts}</Text>
          </View>
          
          {/* 🎰 MONEDAS NUEVAS - Con botón secreto para añadir más */}
          <TouchableOpacity 
            style={styles.coinsContainer}
            onLongPress={async () => {
              if (!gameState) return;
              const updatedGameState = GameState.fromJSON(gameState.toJSON());
              updatedGameState.coins += 1000;
              setGameState(updatedGameState);
              await StorageService.saveGameState(updatedGameState);
              Alert.alert('🎰', '¡+1000 monedas añadidas para testing!');
            }}
            delayLongPress={3000}
          >
            <Text style={styles.coinsIcon}>🪙</Text>
            <Text style={styles.coinsCount}>{gameState.coins}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 🎨 SECCIÓN DE MASCOTA MODERNA (como la imagen) */}
        <View style={styles.heroSection}>
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

            {/* Mascota en el centro con fondo suave */}
            <View style={styles.petHeroContainer}>
              <View style={styles.petBackground}>
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
              </View>
              
              {/* Mensaje de estado moderno */}
              <Text style={styles.petMessage}>
                {petDisplay.mood === 'feliz' ? 'estoy esperando contigo...' : 'necesito tu cuidado...'}
              </Text>
            </View>

            {/* Botones de acción modernos */}
            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={[
                  styles.modernButton,
                  styles.feedButtonModern,
                  gameState.hearts === 0 && styles.modernButtonDisabled
                ]}
                onPress={handleFeedPet}
                disabled={gameState.hearts === 0}
              >
                <Text style={styles.modernButtonText}>
                  💝 Alimentar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modernButton, styles.casinoButtonModern]}
                onPress={() => router.push('/casino' as any)}
              >
                <Text style={styles.modernButtonText}>
                  🎰 Casino
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 📊 PROGRESO MODERNO (como la imagen) */}
        <View style={styles.progressModernSection}>
          <Text style={styles.progressModernTitle}>Tu Progreso Hoy</Text>
          
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
        </View>

        {/* Misiones Diarias */}
        <View style={styles.missionsSection}>
          <Text style={styles.sectionTitle}>Misiones de Hoy (3)</Text>
          
          {gameState.dailyMissions.map((mission) => (
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
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => handleCompleteMission(mission.id)}
                  >
                    <Text style={styles.completeButtonText}>Completar</Text>
                  </TouchableOpacity>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9F6',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9F6',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE0E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  // 🎰 ESTILOS PARA MONEDAS
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fd9924',
  },
  coinsIcon: {
    fontSize: 18,
    marginRight: 4,
    color: '#fd9924',
  },
  coinsCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fd9924',
  },
  heartsIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  heartsCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
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
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  missionDuration: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  missionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
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
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  completedBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  motivationSection: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  motivationText: {
    fontSize: 14,
    color: '#1976D2',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // 🎨 ESTILOS MODERNOS PARA EL NUEVO DISEÑO
  heroSection: {
    marginBottom: 24,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#23314b',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#474950',
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: '#fd9924',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  streakLabelModern: {
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 2,
  },
  petHeroContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  petBackground: {
    width: 160,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#efefe4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  petImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petImage: {
    width: 140,
    height: 100,
  },
  petMessage: {
    fontSize: 16,
    color: '#474950',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modernButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedButtonModern: {
    backgroundColor: '#5fb294',
  },
  casinoButtonModern: {
    backgroundColor: '#fd9924',
  },
  modernButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  modernButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // 📊 ESTILOS PARA PROGRESO MODERNO
  progressModernSection: {
    marginBottom: 24,
  },
  progressModernTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#23314b',
    marginBottom: 12,
  },
  progressModernCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
    color: '#474950',
    marginBottom: 4,
  },
  progressStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#23314b',
    marginBottom: 2,
  },
  progressStatPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5fb294',
  },
  progressBarModern: {
    height: 8,
    backgroundColor: '#efefe4',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5fb294',
    borderRadius: 4,
  },
  progressBottomStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBottomItem: {
    alignItems: 'center',
  },
  progressBottomNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#23314b',
  },
  progressBottomLabel: {
    fontSize: 12,
    color: '#474950',
    marginTop: 4,
  },

});
