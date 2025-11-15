/**
 * DATOS DE DEMOSTRACIÓN: DemoData
 * Propósito: Datos preconfigurados para mostrar la app en todo su esplendor
 * Usado en: Demo y testing de la aplicación completa
 */

import { GameState } from '../models/GameState';
import { Mission } from '../models/Mission';
import { Pet } from '../models/Pet';
import { UserPreferences } from '../models/UserPreferences';

export class DemoData {
  
  // 🎭 PERFIL DE USUARIO DEMO COMPLETO
  static getDemoUserPreferences() {
    const prefs = new UserPreferences({});
    
    // Simular onboarding completado con respuestas típicas
    prefs.wellnessGoal = 'estres'; // Reducir estrés
    prefs.dailyAvailability = 'media'; // 15-30 minutos
    prefs.preferredIntensity = 'normal'; // Intensidad normal
    prefs.missionStyle = 'reflexiva'; // Estilo reflexivo
    
    return prefs;
  }

  // 🎮 ESTADO DE JUEGO DEMO AVANZADO
  static getDemoGameState() {
    const demoPrefs = this.getDemoUserPreferences();
    
    // Mascota con historia
    const demoPet = new Pet({
      name: 'Zen',
      mood: 'feliz',
      lastFed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Alimentado hace 2 horas
      energy: 85,
      happiness: 90,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // Creado hace 5 días
    });

    // Estado del juego con progreso impresionante
    const demoGameState = new GameState({
      coins: 500, // 🎰 MONEDAS PARA PROBAR EL CASINO
      pet: demoPet,
      userPreferences: demoPrefs,
      dailyMissions: this.getDemoMissions(),
      currentDate: new Date().toDateString(),
      daysCompleted: 7, // Una semana de streak impresionante
      totalMissionsCompleted: 28, // 4 misiones por día durante 7 días
      hasCompletedOnboarding: true,
      lastNotificationDate: null
    });

    return demoGameState;
  }

  // 🎯 MISIONES DEMO VARIADAS Y ATRACTIVAS
  static getDemoMissions() {
    return [
      new Mission({
        id: 'demo_1',
        title: 'Respiración consciente',
        description: 'Toma 5 respiraciones profundas y siente cómo se libera la tensión de tu cuerpo',
        duration: 3,
        category: 'estres',
        intensity: 'suave',
        completed: true, // Completada para mostrar progreso
        completedAt: new Date(Date.now() - 60 * 60 * 1000), // Completada hace 1 hora
        createdAt: new Date()
      }),
      
      new Mission({
        id: 'demo_2', 
        title: 'Caminata reflexiva',
        description: 'Camina 10 minutos prestando atención a tus pasos y al entorno',
        duration: 10,
        category: 'movimiento',
        intensity: 'normal',
        completed: true, // Segunda misión completada (2/3)
        completedAt: new Date(Date.now() - 30 * 60 * 1000), // Completada hace 30 min
        createdAt: new Date()
      }),
      
      new Mission({
        id: 'demo_3',
        title: 'Momento de gratitud',
        description: 'Escribe 3 cosas por las que te sientes agradecido en este momento',
        duration: 5,
        category: 'estres', 
        intensity: 'suave',
        completed: false, // Una pendiente para mantener motivación
        completedAt: null,
        createdAt: new Date()
      })
    ];
  }

  // 🌟 ESTADO PARA DIFERENTES ESCENARIOS DE DEMO
  static getDemoScenarios() {
    return {
      // Usuario nuevo (primer día)
      newUser: {
        coins: 0,
        daysCompleted: 0,
        totalMissionsCompleted: 0,
        pet: new Pet({ mood: 'neutro' }),
        completionPercentage: 0
      },
      
      // Usuario en progreso (día típico)
      activeUser: {
        coins: 200,
        daysCompleted: 3,
        totalMissionsCompleted: 15,
        pet: new Pet({ mood: 'feliz' }),
        completionPercentage: 66 // 2 de 3 misiones completadas
      },
      
      // Usuario champion (racha larga)
      championUser: {
        coins: 1500,
        daysCompleted: 15,
        totalMissionsCompleted: 60,
        pet: new Pet({ mood: 'feliz', energy: 100, happiness: 100 }),
        completionPercentage: 100
      },
      
      // Usuario que necesita motivación
      strugglingUser: {
        coins: 30,
        daysCompleted: 1,
        totalMissionsCompleted: 3,
        pet: new Pet({ mood: 'triste' }),
        completionPercentage: 0
      }
    };
  }

  // 📱 MENSAJES DE NOTIFICACIÓN DEMO
  static getDemoNotificationMessages() {
    return [
      "🌱 ¡Tu día de bienestar te espera! Tu mascota Zen está lista para acompañarte.",
      "🔥 ¡7 días consecutivos! Eres imparable, sigue así.",
      "💫 Incluso 3 minutos de respiración pueden cambiar tu día completo.",
      "🎯 Tu mascota te extraña. ¿Qué tal una misión rápida de gratitud?",
      "👑 ¡Casi terminas el día! Una misión más y serás un campeón del bienestar."
    ];
  }

  // 🎨 DATOS PARA ONBOARDING DEMO
  static getDemoOnboardingFlow() {
    return {
      step1: {
        question: "¿Cuál es tu principal objetivo de bienestar?",
        selectedOption: "Reducir estrés y ansiedad",
        reasoning: "Opción más común y relatable para audiencia"
      },
      step2: {
        question: "¿Cuánto tiempo tienes disponible al día?",
        selectedOption: "15-30 minutos",
        reasoning: "Tiempo realista para la mayoría de personas"
      },
      step3: {
        question: "¿Qué intensidad prefieres?",
        selectedOption: "Intensidad normal",
        reasoning: "Balance perfecto para demostrar variedad"
      },
      step4: {
        question: "¿Qué estilo de actividades te atrae más?",
        selectedOption: "Reflexivas y contemplativas",
        reasoning: "Complementa el objetivo de reducir estrés"
      }
    };
  }

  // 🏆 ESTADÍSTICAS IMPRESIONANTES PARA DEMO
  static getDemoStats() {
    return {
      totalDays: 15,
      completionRate: 89, // % muy alto para impresionar
      favoriteCategory: 'Reducir estrés',
      longestStreak: 10,
      totalMinutesOfWellness: 180, // 3 horas total
      petHappinessAverage: 85,
      missionsPerDay: 3.2,
      weeklyImprovement: '+15%'
    };
  }

  // 🎪 MÉTODO PARA RESETEAR A DATOS DEMO
  static async applyDemoData(StorageService) {
    try {
      const demoGameState = this.getDemoGameState();
      const demoPrefs = this.getDemoUserPreferences();
      
      // Guardar datos demo
      await StorageService.saveGameState(demoGameState);
      await StorageService.saveUserPreferences(demoPrefs);
      await StorageService.setOnboardingCompleted(true);
      
      console.log('🎭 DATOS DEMO APLICADOS EXITOSAMENTE');
      console.log('📊 Estado:', {
        coins: demoGameState.coins,
        days: demoGameState.daysCompleted,
        missions: demoGameState.totalMissionsCompleted,
        petMood: demoGameState.pet.mood
      });
      
      return demoGameState;
      
    } catch (error) {
      console.error('❌ Error aplicando datos demo:', error);
      throw error;
    }
  }

  // 🧪 MÉTODO PARA LIMPIAR Y RESETEAR
  static async resetToFresh(StorageService) {
    try {
      await StorageService.clearAllData();
      console.log('🗑️ Datos reseteados para experiencia fresca');
    } catch (error) {
      console.error('❌ Error reseteando datos:', error);
    }
  }

  // 📋 SCRIPT DE DEMOSTRACIÓN SUGERIDO
  static getDemoScript() {
    return {
      title: "WELLNESS QUEST - GUIÓN DE DEMO",
      duration: "5-7 minutos",
      steps: [
        {
          step: 1,
          title: "Introducción del problema",
          content: "Mostrar estadísticas de estrés y necesidad de bienestar digital",
          duration: "30 segundos"
        },
        {
          step: 2, 
          title: "Onboarding personalizado",
          content: "Demostrar las 4 preguntas que personalizan completamente la experiencia",
          duration: "1 minuto"
        },
        {
          step: 3,
          title: "Pantalla principal - Mascota emocional",
          content: "Mostrar cómo la mascota refleja tu estado y motivar cuidado",
          duration: "1 minuto"
        },
        {
          step: 4,
          title: "Sistema de misiones inteligente", 
          content: "Explicar cómo se generan misiones basadas en preferencias",
          duration: "2 minutos"
        },
        {
          step: 5,
          title: "Economía simple y progreso",
          content: "Demo de completar misión, ganar corazón, alimentar mascota",
          duration: "1.5 minutos"
        },
        {
          step: 6,
          title: "Notificaciones inteligentes",
          content: "Mostrar cómo cambian los mensajes según tu progreso",
          duration: "1 minuto"
        }
      ]
    };
  }
}

export default DemoData;
