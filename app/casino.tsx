/**
 * PANTALLA: Casino (¡LA RULETA MÁS ÉPICA!)
 * Propósito: Ruleta para gastar monedas y obtener decoraciones
 * Funcionalidades: Girar ruleta, mostrar premios, gestionar inventario
 */

import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
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

  const handleSpinRoulette = async () => {
    if (!gameState || isSpinning) return;

    setIsSpinning(true);
    
    // Animación de giro
    Animated.timing(rouletteAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

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
        return;
      }

      // Actualizar estado del juego
      const updatedGameState = GameState.fromJSON(gameState.toJSON());
      updatedGameState.coins -= result.coinsSpent || 0;
      
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🎰 Cargando Casino...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!gameState) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error cargando el casino</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const stats = CasinoService.getCasinoStats(inventory);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header del Casino */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>🎰 CASINO WELLNESS</Text>
        
        <View style={styles.coinsDisplay}>
          <Text style={styles.coinsIcon}>🪙</Text>
          <Text style={styles.coinsCount}>{gameState.coins}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Sección de Ruleta */}
        <View style={styles.rouletteSection}>
          <Text style={styles.sectionTitle}>🎲 Ruleta de Decoraciones</Text>
          
          <View style={styles.rouletteContainer}>
            <Animated.View style={[
              styles.roulette,
              {
                transform: [{
                  rotate: rouletteAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '1440deg']
                  })
                }]
              }
            ]}>
              <Text style={styles.rouletteText}>🎰</Text>
            </Animated.View>
            
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

          <TouchableOpacity
            style={[
              styles.spinButton,
              (isSpinning || gameState.coins < CasinoService.SPIN_COST) && styles.spinButtonDisabled
            ]}
            onPress={handleSpinRoulette}
            disabled={isSpinning || gameState.coins < CasinoService.SPIN_COST}
          >
            <Text style={styles.spinButtonText}>
              {isSpinning ? '🌀 GIRANDO...' : `🎰 GIRAR (${CasinoService.SPIN_COST} 🪙)`}
            </Text>
          </TouchableOpacity>

          <Text style={styles.infoText}>
            💡 Completa misiones para ganar monedas y decorar tu mascota
          </Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 Tu Colección</Text>
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
          <Text style={styles.sectionTitle}>🎒 Inventario de Decoraciones</Text>
          <View style={styles.inventoryGrid}>
            {inventory.map(renderInventoryItem)}
          </View>
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
  },
  loadingText: {
    fontSize: 18,
    color: '#4CAF50',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
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
  backButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  coinsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F39C12',
  },
  coinsIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  coinsCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F39C12',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  rouletteSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  rouletteContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  roulette: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#F39C12',
  },
  rouletteText: {
    fontSize: 48,
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
    borderColor: '#4CAF50',
  },
  prizeEmoji: {
    fontSize: 24,
  },
  prizeName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  spinButton: {
    backgroundColor: '#F39C12',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 12,
  },
  spinButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  spinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  inventorySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inventoryItem: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
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
  },
  equipButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  equipButtonActive: {
    backgroundColor: '#2196F3',
  },
  equipButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
