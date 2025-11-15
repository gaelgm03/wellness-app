/**
 * MODELO DE DATOS: GameState (Estado Principal del Juego)
 * Propósito: Centralizar todo el estado de la aplicación
 * Usado en: Toda la aplicación como fuente única de verdad
 */

import MissionGenerator from '../services/MissionGenerator';
import { Mission } from './Mission';
import { DEFAULT_PET, Pet } from './Pet';
import { UserPreferences } from './UserPreferences';

export class GameState {
  constructor({
    // 🎰 ECONOMÍA CASINO (para ruleta y decoraciones)
    coins = 0, // Monedas obtenidas (+10 por misión completada)
    hearts = 3, // Corazones para alimentar mascota
    dailyHearts = 0, // Corazones ganados HOY (máximo 3)
    petVisualState = 0, // Estado visual de la mascota (0-3, se actualiza al cuidar)
    
    // Mascota emocional
    pet = DEFAULT_PET,
    
    // Preferencias del usuario (del onboarding)
    userPreferences = new UserPreferences({}),
    
    // Misiones diarias
    dailyMissions = [], // 3 misiones por día
    
    // Progreso básico
    currentDate = new Date().toDateString(),
    daysCompleted = 0,
    totalMissionsCompleted = 0,
    
    // Estados de UI
    hasCompletedOnboarding = false,
    lastNotificationDate = null
  }) {
    this.coins = coins;
    this.hearts = hearts;
    this.dailyHearts = dailyHearts;
    this.petVisualState = petVisualState;
    this.pet = pet;
    this.userPreferences = userPreferences;
    this.dailyMissions = dailyMissions;
    this.currentDate = currentDate;
    this.daysCompleted = daysCompleted;
    this.totalMissionsCompleted = totalMissionsCompleted;
    this.hasCompletedOnboarding = hasCompletedOnboarding;
    this.lastNotificationDate = lastNotificationDate;
  }

  // ECONOMÍA: Completar misión (+10 monedas + 1 corazón) 🎰
  completeMission(missionId) {
    const mission = this.dailyMissions.find(m => m.id === missionId);
    if (mission && !mission.isCompleted()) {
      mission.complete();
      this.coins += 10; // Monedas para el casino
      this.hearts += 1; // Corazón para alimentar mascota
      this.totalMissionsCompleted += 1;
    }
  }

  // ECONOMÍA: Alimentar mascota (cuesta 1 corazón)
  feedPet() {
    if (this.hearts > 0 && this.petVisualState < 3) {
      this.pet.feed();
      this.hearts -= 1;
      
      // Incrementar estado visual Y contador diario
      this.petVisualState += 1;
      this.dailyHearts += 1;
      
      return true;
    }
    return false;
  }

  // PROGRESO: Porcentaje de misiones completadas hoy
  getTodayCompletionPercentage() {
    if (this.dailyMissions.length === 0) return 0;
    const completed = this.dailyMissions.filter(m => m.isCompleted()).length;
    return Math.round((completed / this.dailyMissions.length) * 100);
  }

  // PROGRESO: ¿Se completó el día?
  isDayCompleted() {
    return this.getTodayCompletionPercentage() === 100;
  }

  // MISIONES: Generar nuevas misiones diarias ¡INTELIGENTE! (DÍA 2)
  generateDailyMissions() {
    if (this.userPreferences && this.userPreferences.isComplete()) {
      // Usar generador inteligente basado en preferencias
      console.log('🧠 Generando misiones inteligentes...');
      this.dailyMissions = MissionGenerator.generateDailyMissions(this.userPreferences);
    } else {
      // Fallback a misiones por defecto
      console.log('⚠️ Usando misiones por defecto');
      this.dailyMissions = MissionGenerator.getDefaultMissions();
    }
  }

  // NUEVO DÍA 2: Regenerar misiones si cambian las preferencias
  updateUserPreferences(newPreferences) {
    this.userPreferences = newPreferences;
    this.generateDailyMissions(); // Regenerar misiones con nuevas preferencias
  }

  // NUEVO DÍA 2: Verificar si es un nuevo día y resetear misiones
  checkAndResetDailyMissions() {
    const today = new Date().toDateString();
    
    if (this.currentDate !== today) {
      console.log('📅 Nuevo día detectado, reseteando misiones');
      
      // Si el día anterior estaba completo, sumar a días completados
      if (this.isDayCompleted()) {
        this.daysCompleted += 1;
        console.log('🎉 Día anterior completado! Total días:', this.daysCompleted);
      }
      
      // Actualizar fecha y regenerar misiones
      this.currentDate = today;
      this.generateDailyMissions();
      
      // 🔄 RESETEAR CORAZONES DIARIOS A 0 (nuevo día, mascota vuelve a estado triste)
      this.dailyHearts = 0;
      this.petVisualState = 0; // Resetear estado visual
      
      // Resetear estado de mascota si no la alimentaron ayer
      if (this.pet.mood === 'feliz') {
        // La mascota se pone triste si no la cuidan
        const daysSinceLastFed = this.getDaysSinceLastFed();
        if (daysSinceLastFed > 0) {
          this.pet.updateMood(daysSinceLastFed);
        }
      }
    }
  }

  // HELPER: Días desde última alimentación
  getDaysSinceLastFed() {
    if (!this.pet.lastFed) return 1;
    
    const today = new Date();
    const lastFed = new Date(this.pet.lastFed);
    const diffTime = Math.abs(today - lastFed);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  // Para persistencia
  toJSON() {
    return {
      coins: this.coins,
      hearts: this.hearts,
      dailyHearts: this.dailyHearts,
      petVisualState: this.petVisualState,
      pet: this.pet,
      userPreferences: this.userPreferences,
      dailyMissions: this.dailyMissions,
      currentDate: this.currentDate,
      daysCompleted: this.daysCompleted,
      totalMissionsCompleted: this.totalMissionsCompleted,
      hasCompletedOnboarding: this.hasCompletedOnboarding,
      lastNotificationDate: this.lastNotificationDate
    };
  }

  static fromJSON(data) {
    // Reconstruir objetos con sus métodos
    const gameState = new GameState({
      ...data,
      pet: new Pet(data.pet), // Reconstruir Pet con métodos
      userPreferences: new UserPreferences(data.userPreferences), // Reconstruir UserPreferences
      // Las misiones ya están como objetos simples, las reconstituimos después
    });
    
    // Reconstruir misiones como objetos Mission con métodos
    if (data.dailyMissions && Array.isArray(data.dailyMissions)) {
      gameState.dailyMissions = data.dailyMissions.map(missionData => {
        const mission = new Mission(missionData);
        return mission;
      });
    }
    
    return gameState;
  }
}

// Estado inicial por defecto
export const createInitialGameState = () => {
  const gameState = new GameState({});
  gameState.generateDailyMissions(); // Generar misiones mock
  return gameState;
};
