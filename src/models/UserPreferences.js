/**
 * MODELO DE DATOS: UserPreferences 
 * Propósito: Almacenar respuestas del onboarding (4 preguntas del README)
 * Usado en: OnboardingScreen, MissionGenerator, GameState
 */

export class UserPreferences {
  constructor({
    // Pregunta 1: Objetivo de bienestar
    wellnessGoal = null, // 'energia' | 'estres' | 'movimiento'
    
    // Pregunta 2: Disponibilidad diaria  
    dailyAvailability = null, // 'baja' | 'media' | 'alta'
    
    // Pregunta 3: Intensidad preferida
    preferredIntensity = null, // 'suave' | 'normal' | 'activa'
    
    // Pregunta 4: Estilo de misión
    missionStyle = null, // 'reflexiva' | 'activa' | 'social' | 'personal'
    
    // Metadata
    completedOnboarding = false,
    createdAt = new Date()
  }) {
    this.wellnessGoal = wellnessGoal;
    this.dailyAvailability = dailyAvailability;
    this.preferredIntensity = preferredIntensity;  
    this.missionStyle = missionStyle;
    this.completedOnboarding = completedOnboarding;
    this.createdAt = createdAt;
  }

  // Métodos de utilidad
  isComplete() {
    return this.wellnessGoal && 
           this.dailyAvailability && 
           this.preferredIntensity && 
           this.missionStyle;
  }

  markAsCompleted() {
    this.completedOnboarding = true;
  }

  // Para debugging
  toDebugString() {
    return `Objetivo: ${this.wellnessGoal}, Disponibilidad: ${this.dailyAvailability}, Intensidad: ${this.preferredIntensity}, Estilo: ${this.missionStyle}`;
  }
}

// Opciones para las 4 preguntas del onboarding (según README)
export const ONBOARDING_OPTIONS = {
  wellnessGoal: [
    { key: 'energia', label: 'Más Energía', icon: '⚡', description: 'Sentirme más activo y vital' },
    { key: 'estres', label: 'Menos Estrés', icon: '🧘', description: 'Encontrar calma y equilibrio' },
    { key: 'movimiento', label: 'Más Movimiento', icon: '🏃', description: 'Incorporar actividad física' }
  ],
  dailyAvailability: [
    { key: 'baja', label: '5-15 min', icon: '⏰', description: 'Tengo poco tiempo libre' },
    { key: 'media', label: '15-30 min', icon: '⏱️', description: 'Tiempo moderado disponible' },
    { key: 'alta', label: '30+ min', icon: '⏳', description: 'Tengo tiempo suficiente' }
  ],
  preferredIntensity: [
    { key: 'suave', label: 'Suave', icon: '🌱', description: 'Actividades relajantes y gentiles' },
    { key: 'normal', label: 'Normal', icon: '🌿', description: 'Equilibrio entre calma y actividad' },
    { key: 'activa', label: 'Activa', icon: '🌳', description: 'Me gustan los desafíos' }
  ],
  missionStyle: [
    { key: 'reflexiva', label: 'Reflexiva', icon: '💭', description: 'Meditación y autoconocimiento' },
    { key: 'activa', label: 'Activa', icon: '💪', description: 'Ejercicio y movimiento' },
    { key: 'social', label: 'Social', icon: '👥', description: 'Conectar con otros' },
    { key: 'personal', label: 'Personal', icon: '🏠', description: 'Cuidado personal en casa' }
  ]
};
