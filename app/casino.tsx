/**
 * PANTALLA: Casino (¡LA RULETA MÁS ÉPICA!)
 * Propósito: Ruleta para gastar monedas y obtener decoraciones
 * Funcionalidades: Girar ruleta, mostrar premios, gestionar inventario
 */

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import { Decoration } from '../src/models/Decoration';
import { GameState } from '../src/models/GameState';
import CasinoService from '../src/services/CasinoService';
import StorageService from '../src/services/StorageService';

export default function CasinoScreen() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [inventory, setInventory] = useState<Decoration[]>([]);
  const [lastPrize, setLastPrize] = useState<Decoration | null>(null);

  // Animaciones
  const [rouletteAnim] = useState(new Animated.Value(0));
  const [prizeAnim] = useState(new Animated.Value(0));
  const [spinButtonAnim] = useState(new Animated.Value(1));
  const [backButtonAnim] = useState(new Animated.Value(1));
  const [rouletteGlow] = useState(new Animated.Value(0));
  const [colorToggle] = useState(new Animated.Value(0));

  // 🎨 Función para obtener colores según rareza (Color set 1)
  const getRarityColors = (rarity?: string): [string, string] => {
    switch (rarity) {
      case 'legendary':
        return ['#FFD700', '#FFA500']; // Amarillo dorado brillante
      case 'epic':
        return ['#9333EA', '#C084FC']; // Morado vibrante
      case 'rare':
        return ['#3B82F6', '#60A5FA']; // Azul brillante
      case 'common':
        return ['#6B7280', '#9CA3AF']; // Gris
      default:
        return ['#F59E0B', '#FBBF24']; // Dorado por defecto (sin premio aún)
    }
  };

  // 🎨 Colores alternos para el parpadeo (Color set 2)
  const getAlternateColors = (rarity?: string): [string, string] => {
    switch (rarity) {
      case 'legendary':
        return ['#FFA500', '#FFD700']; // Amarillo invertido
      case 'epic':
        return ['#C084FC', '#9333EA']; // Morado invertido
      case 'rare':
        return ['#60A5FA', '#3B82F6']; // Azul invertido
      case 'common':
        return ['#9CA3AF', '#6B7280']; // Gris invertido
      default:
        return ['#FBBF24', '#F59E0B']; // Dorado invertido
    }
  };

  // ⏱️ Función para obtener velocidad de parpadeo según rareza
  const getBlinkSpeed = (rarity?: string): number => {
    switch (rarity) {
      case 'legendary':
        return 200; // Muy rápido
      case 'epic':
        return 300; // Rápido
      case 'rare':
        return 400; // Medio
      case 'common':
        return 600; // Lento
      default:
        return 400; // Normal
    }
  };

  useEffect(() => {
    loadCasinoData();
  }, []);

  const loadCasinoData = async () => {
    try {
      const savedGameState = await StorageService.loadGameState();
      setGameState(savedGameState);
      
      console.log('🎰 Casino: Datos cargados - Monedas disponibles:', savedGameState.coins);

      // Generar inventario inicial si no existe
      let playerInventory = await StorageService.loadInventory();
      if (!playerInventory || playerInventory.length === 0) {
        playerInventory = CasinoService.generateInitialInventory();
        await StorageService.saveInventory(playerInventory);
      }
      setInventory(playerInventory);

    } catch (error) {
      console.error('❌ Error cargando casino:', error);
      Alert.alert('Error', 'No se pudo cargar el casino');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  // 🎮 Animación de botones
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

  const handleSpinRoulette = async () => {
    if (!gameState || isSpinning) return;

    // 🎮 Animar botón y haptic
    animateButtonPress(spinButtonAnim);
    if (Platform.OS !== 'web') {
      Vibration.vibrate(10);
    }

    setIsSpinning(true);
    
    // Animación de giro + parpadeo dinámico + alternancia de colores
    const blinkSpeed = getBlinkSpeed(lastPrize?.rarity);
    
    Animated.parallel([
      Animated.timing(rouletteAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rouletteGlow, {
            toValue: 1,
            duration: blinkSpeed,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rouletteGlow, {
            toValue: 0,
            duration: blinkSpeed,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
      // Alternancia de colores
      Animated.loop(
        Animated.sequence([
          Animated.timing(colorToggle, {
            toValue: 1,
            duration: blinkSpeed,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(colorToggle, {
            toValue: 0,
            duration: blinkSpeed,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      )
    ]).start();

    // Simular delay del giro
    setTimeout(async () => {
      const result = CasinoService.spinRoulette(gameState.coins);
      
      if (!result.success) {
        Alert.alert(
          'Sin suficientes monedas 🪙',
          `Necesitas ${CasinoService.SPIN_COST} monedas para girar.\nTe faltan ${result.coinsNeeded} monedas.\n\n¡Completa más misiones!`,
          [{ text: 'Entendido' }]
        );
        setIsSpinning(false);
        rouletteAnim.setValue(0);
        rouletteGlow.stopAnimation();
        rouletteGlow.setValue(0);
        colorToggle.stopAnimation();
        colorToggle.setValue(0);
        return;
      }

      // Actualizar estado del juego
      const updatedGameState = GameState.fromJSON(gameState.toJSON());
      updatedGameState.coins = updatedGameState.coins - CasinoService.SPIN_COST;
      
      // Actualizar inventario
      const updatedInventory = [...inventory];
      if (result.prize) {
        const existingItem = updatedInventory.find(item => item.id === result.prize!.id);
        if (existingItem) {
          existingItem.unlock();
        }
      }

      setGameState(updatedGameState);
      setInventory(updatedInventory);
      setLastPrize(result.prize || null);

      // Guardar cambios
      await StorageService.saveGameState(updatedGameState);
      await StorageService.saveInventory(updatedInventory);
      
      console.log('💰 Casino: Monedas gastadas:', CasinoService.SPIN_COST);
      console.log('💰 Casino: Estado guardado - Monedas restantes:', updatedGameState.coins);
      console.log('🎁 Decoración desbloqueada:', result.prize?.name);

      // Animación del premio
      Animated.sequence([
        Animated.timing(prizeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(prizeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Mostrar resultado
      if (result.prize) {
        Alert.alert(
          `${result.prize.rarity.toUpperCase()} 🎰`,
          `${result.message}\n\n🎁 ${result.prize.name}\n${result.prize.description}`,
          [{ text: '¡Increíble!' }]
        );
      }

      setIsSpinning(false);
      rouletteAnim.setValue(0);
      rouletteGlow.stopAnimation();
      rouletteGlow.setValue(0);
      colorToggle.stopAnimation();
      colorToggle.setValue(0);
    }, 2000);
  };

  const renderInventoryItem = (decoration: Decoration) => (
    <View key={decoration.id} style={[
      styles.inventoryItem,
      { borderColor: decoration.getRarityColor() },
      !decoration.isUnlocked && styles.inventoryItemLocked
    ]}>
      <Text style={styles.inventoryEmoji}>
        {decoration.isUnlocked ? decoration.emoji : '🔒'}
      </Text>
      <Text style={[styles.inventoryName, { color: decoration.getRarityColor() }]}>
        {decoration.isUnlocked ? decoration.name : '???'}
      </Text>
      {decoration.isUnlocked && (
        <TouchableOpacity
          style={[
            styles.equipButton,
            decoration.isEquipped && styles.equipButtonActive
          ]}
          onPress={() => handleEquipDecoration(decoration)}
        >
          <Text style={styles.equipButtonText}>
            {decoration.isEquipped ? 'Equipado' : 'Equipar'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const handleEquipDecoration = async (decoration: Decoration) => {
    if (!gameState) return;
    const result = CasinoService.applyDecorationToPet(gameState.pet, decoration, inventory);
    
    if (result.success) {
      setInventory([...inventory]); // Trigger re-render
      await StorageService.saveInventory(inventory);
      Alert.alert('✅', result.message);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#FEF3C7', '#FDE68A', '#FCD34D']}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>🎰 Cargando Casino...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!gameState) {
    return (
      <LinearGradient
        colors={['#FEF3C7', '#FDE68A', '#FCD34D']}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error cargando el casino</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const stats = CasinoService.getCasinoStats(inventory);

  return (
    <LinearGradient
      colors={['#FEF3C7', '#FDE68A', '#FCD34D']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Header del Casino */}
        <View style={styles.header}>
          <Animated.View style={{ transform: [{ scale: backButtonAnim }] }}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => {
                animateButtonPress(backButtonAnim);
                setTimeout(() => router.back(), 100);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>
          </Animated.View>
        
        <Text style={styles.title}>🎰 CASINO WELLNESS</Text>
        
        <View style={styles.coinsDisplay}>
          <Text style={styles.coinsIcon}>🪙</Text>
          <Text style={styles.coinsCount}>{gameState.coins}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Sección de Ruleta */}
        <View style={styles.rouletteSection}>
          <Text style={styles.sectionTitle}>🎲 Ruleta de Premios</Text>
          
          <View style={styles.rouletteContainer}>
            <Animated.View style={[
              styles.rouletteWrapper,
              {
                transform: [
                  {
                    rotate: rouletteAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '1440deg']
                    })
                  },
                  {
                    scale: rouletteGlow.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1]
                    })
                  }
                ],
                shadowOpacity: rouletteGlow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.6]
                })
              }
            ]}>
              {/* Gradiente que alterna entre dos sets de colores */}
              <Animated.View style={{ 
                width: '100%', 
                height: '100%', 
                position: 'absolute',
                opacity: colorToggle.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0]
                })
              }}>
                <LinearGradient
                  colors={getRarityColors(lastPrize?.rarity)}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.roulette}
                />
              </Animated.View>
              <Animated.View style={{ 
                width: '100%', 
                height: '100%', 
                position: 'absolute',
                opacity: colorToggle.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }}>
                <LinearGradient
                  colors={getAlternateColors(lastPrize?.rarity)}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.roulette}
                />
              </Animated.View>
            </Animated.View>
            
            {/* Indicador de rareza */}
            {lastPrize && (
              <Text style={[styles.rarityIndicator, { color: lastPrize.getRarityColor() }]}>
                {lastPrize.rarity.toUpperCase()}
              </Text>
            )}
            
            {/* Premio flotante */}
            {lastPrize && (
              <Animated.View style={[
                styles.prizeDisplay,
                {
                  opacity: prizeAnim,
                  transform: [{ scale: prizeAnim }]
                }
              ]}>
                <Text style={styles.prizeEmoji}>{lastPrize.emoji}</Text>
                <Text style={styles.prizeName}>{lastPrize.name}</Text>
              </Animated.View>
            )}
          </View>

          <Animated.View style={{ transform: [{ scale: spinButtonAnim }] }}>
            <TouchableOpacity
              style={[
                styles.spinButton,
                (isSpinning || gameState.coins < CasinoService.SPIN_COST) && styles.spinButtonDisabled
              ]}
              onPress={handleSpinRoulette}
              disabled={isSpinning || gameState.coins < CasinoService.SPIN_COST}
              activeOpacity={0.8}
            >
              <Text style={styles.spinButtonText}>
                {isSpinning ? '🌀 GIRANDO...' : `🎰 GIRAR (${CasinoService.SPIN_COST} 🪙)`}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.infoText}>
            💡 Completa misiones para ganar monedas y ganar recompensas
          </Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 Progreso</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.unlockedDecorations}</Text>
              <Text style={styles.statLabel}>Desbloqueadas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.completionPercentage}%</Text>
              <Text style={styles.statLabel}>Completado</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.rarityBreakdown.legendary}</Text>
              <Text style={styles.statLabel}>Legendarias</Text>
            </View>
          </View>
        </View>

        {/* Inventario */}
        <View style={styles.inventorySection}>
          <Text style={styles.sectionTitle}>📦 Tu Colección</Text>
          <View style={styles.inventoryGrid}>
            {inventory.map(renderInventoryItem)}
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    maxWidth: 390, // iPhone 13 width
    width: '100%',
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#1F2937',
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#474950',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: -0.5,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  coinsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
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
    fontSize: 16,
    marginRight: 3,
  },
  coinsCount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F59E0B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  rouletteSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 0,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 18,
    letterSpacing: -0.5,
  },
  rouletteContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    width: '100%',
  },
  rouletteWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 60,
    overflow: 'hidden',
  },
  roulette: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  rarityIndicator: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  prizeDisplay: {
    position: 'absolute',
    top: -50,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#5fb294',
  },
  prizeEmoji: {
    fontSize: 24,
  },
  prizeName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#23314b',
  },
  spinButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 180,
  },
  spinButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0.1,
  },
  spinButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 12,
    color: '#474950',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 0,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#7C3AED',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  inventorySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 0,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  inventoryItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  inventoryItemLocked: {
    opacity: 0.5,
  },
  inventoryEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  inventoryName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    width: '100%',
  },
  equipButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  equipButtonActive: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
  },
  equipButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
