/**
 * MODELO DE DATOS: Mission
 * Propósito: Representar una misión diaria del usuario
 * Usado en: HomeScreen, MissionCard, GameState
 */

export class Mission {
  constructor({
    id,
    title,
    description,
    duration, // en minutos (2-10 min)
    status = 'pending', // 'pending' | 'completed'
    category, // 'energia' | 'estres' | 'movimiento'
    intensity, // 'suave' | 'normal' | 'activa'
    createdAt = new Date()
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.status = status;
    this.category = category;
    this.intensity = intensity;
    this.createdAt = createdAt;
  }

  // Métodos de utilidad
  isCompleted() {
    return this.status === 'completed';
  }

  complete() {
    this.status = 'completed';
  }

  getDurationText() {
    return `${this.duration} min`;
  }
}

// Datos mock para desarrollo (según README - Día 1)
export const MOCK_MISSIONS = [
  new Mission({
    id: '1',
    title: 'Respiración profunda',
    description: 'Toma 5 respiraciones profundas y lentas',
    duration: 2,
    category: 'estres',
    intensity: 'suave'
  }),
  new Mission({
    id: '2', 
    title: 'Caminar 5 minutos',
    description: 'Da una caminata corta por tu casa o jardín',
    duration: 5,
    category: 'movimiento',
    intensity: 'normal'
  }),
  new Mission({
    id: '3',
    title: 'Estiramiento de cuello',
    description: 'Gira suavemente tu cuello hacia ambos lados',
    duration: 3,
    category: 'energia',
    intensity: 'suave'
  })
];
