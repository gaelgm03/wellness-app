/**
 * MODELO DE DATOS: Pet (Mascota Emocional)
 * Propósito: Representar el estado emocional de la mascota
 * Usado en: HomeScreen, PetStatusBar, GameState
 */

export class Pet {
  constructor({
    name = 'Wellness',
    mood = 'triste', // 'feliz' | 'triste'
    lastFed = null,
    level = 1,
    experience = 0
  }) {
    this.name = name;
    this.mood = mood;
    this.lastFed = lastFed;
    this.level = level;
    this.experience = experience;
  }

  // Métodos según README
  isHappy() {
    return this.mood === 'feliz';
  }

  isSad() {
    return this.mood === 'triste';
  }

  feed() {
    this.mood = 'feliz';
    this.lastFed = new Date();
    this.experience += 10;
    
    // Subir de nivel cada 100 XP
    if (this.experience >= this.level * 100) {
      this.level++;
    }
  }

  // Lógica emocional: se pone triste si no lo alimentan
  updateMood(daysSinceLastFed = 0) {
    if (daysSinceLastFed > 1) {
      this.mood = 'triste';
    }
  }

  getMoodEmoji() {
    return this.isHappy() ? '😊' : '😢';
  }

  getStatusText() {
    return this.isHappy() ? 'Feliz y motivado' : 'Necesita atención';
  }
}

// Estado inicial por defecto
export const DEFAULT_PET = new Pet({
  name: 'Wellness',
  mood: 'triste'
});
