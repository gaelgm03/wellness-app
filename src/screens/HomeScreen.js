/**
 * PANTALLA: HomeScreen 
 * Propósito: Panel principal con mascota, misiones y corazones (según README)
 * Funcionalidades: Ver mascota, completar misiones, alimentar mascota, ver progreso
 */

import { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { createInitialGameState } from '../models/GameState';

const HomeScreen = ({ gameState: initialGameState, onGameStateChange }) => {
  const [gameState, setGameState] = useState(initialGameState || createInitialGameState());
  const [petAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animar mascota suavemente
    const animatePet = () => {
      Animated.sequence([
        Animated.timing(petAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(petAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animatePet());
    };
    animatePet();
  }, []);

  const handleCompleteMission = (missionId) => {
    const updatedGameState = { ...gameState };
    updatedGameState.completeMission(missionId);
    setGameState(updatedGameState);
    onGameStateChange && onGameStateChange(updatedGameState);

    Alert.alert(
      '¡Misión completada! ✅',
      '+1 corazón ganado',
      [{ text: 'Genial!' }]
    );
  };

  const handleFeedPet = () => {
    if (gameState.hearts === 0) {
      Alert.alert(
        'Sin corazones 💔',
        'Completa misiones para ganar corazones y alimentar a tu mascota',
        [{ text: 'Entendido' }]
      );
      return;
    }

    const updatedGameState = { ...gameState };
    const success = updatedGameState.feedPet();
    
    if (success) {
      setGameState(updatedGameState);
      onGameStateChange && onGameStateChange(updatedGameState);
      
      Alert.alert(
        '¡Mascota alimentada! 😊',
        `${gameState.pet.name} está feliz y motivado`,
        [{ text: '¡Genial!' }]
      );
    }
  };

  const getPetDisplay = () => {
    const pet = gameState.pet;
    return {
      emoji: pet.getMoodEmoji(),
      name: pet.name,
      status: pet.getStatusText(),
      mood: pet.mood
    };
  };

  const petDisplay = getPetDisplay();
  const completionPercentage = gameState.getTodayCompletionPercentage();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con corazones */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Wellness Quest</Text>
        <View style={styles.heartsContainer}>
          <Text style={styles.heartsIcon}>💝</Text>
          <Text style={styles.heartsCount}>{gameState.hearts}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sección de Mascota Emocional */}
        <View style={styles.petSection}>
          <Text style={styles.sectionTitle}>Tu Compañero de Bienestar</Text>
          
          <View style={[
            styles.petCard,
            petDisplay.mood === 'feliz' ? styles.petCardHappy : styles.petCardSad
          ]}>
            <Animated.Text 
              style={[
                styles.petEmoji,
                { transform: [{ scale: petAnimation }] }
              ]}
            >
              {petDisplay.emoji}
            </Animated.Text>
            
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{petDisplay.name}</Text>
              <Text style={[
                styles.petStatus,
                petDisplay.mood === 'feliz' ? styles.petStatusHappy : styles.petStatusSad
              ]}>
                {petDisplay.status}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.feedButton,
                gameState.hearts === 0 && styles.feedButtonDisabled
              ]}
              onPress={handleFeedPet}
              disabled={gameState.hearts === 0}
            >
              <Text style={styles.feedButtonText}>
                Alimentar {gameState.hearts === 0 ? '💔' : '💝'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progreso del día */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progreso de Hoy</Text>
          <View style={styles.progressCard}>
            <Text style={styles.progressPercentage}>{completionPercentage}%</Text>
            <Text style={styles.progressLabel}>Misiones completadas</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressBarFill,
                  { width: `${completionPercentage}%` }
                ]}
              />
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F6',
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
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE0E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
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
  petEmoji: {
    fontSize: 64,
    marginBottom: 12,
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
  feedButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
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
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
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
});

export default HomeScreen;
