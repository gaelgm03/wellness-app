/**
 * MODELO DE DATOS: Decoration (Decoraciones para Mascota)
 * Propósito: Items cosméticos obtenibles en la ruleta casino
 * Funcionalidades: Personalización visual de la mascota
 */

export class Decoration {
  constructor({
    id,
    name,
    type, // 'hat', 'accessory', 'background', 'effect'
    emoji,
    rarity = 'common', // 'common', 'rare', 'epic', 'legendary'
    description,
    isUnlocked = false,
    isEquipped = false,
    obtainedAt = null
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.emoji = emoji;
    this.rarity = rarity;
    this.description = description;
    this.isUnlocked = isUnlocked;
    this.isEquipped = isEquipped;
    this.obtainedAt = obtainedAt;
  }

  // Desbloquear decoración
  unlock() {
    this.isUnlocked = true;
    this.obtainedAt = new Date().toISOString();
  }

  // Equipar/desequipar
  equip() {
    if (this.isUnlocked) {
      this.isEquipped = true;
    }
  }

  unequip() {
    this.isEquipped = false;
  }

  // Obtener color según rareza
  getRarityColor() {
    const colors = {
      common: '#95A5A6',     // Gris
      rare: '#3498DB',       // Azul
      epic: '#9B59B6',       // Morado
      legendary: '#F39C12'   // Dorado
    };
    return colors[this.rarity] || colors.common;
  }

  // Obtener probabilidad en la ruleta (%)
  static getRarityProbability(rarity) {
    const probabilities = {
      common: 60,      // 60%
      rare: 25,        // 25%
      epic: 12,        // 12%
      legendary: 3     // 3%
    };
    return probabilities[rarity] || 0;
  }
}

// 🎰 DECORACIONES DISPONIBLES EN EL CASINO
export const AVAILABLE_DECORATIONS = [
  // SOMBREROS (common)
  new Decoration({
    id: 'hat_cap',
    name: 'Gorra Cool',
    type: 'hat',
    emoji: '🧢',
    rarity: 'common',
    description: 'Una gorra deportiva para look casual'
  }),
  
  new Decoration({
    id: 'hat_crown',
    name: 'Corona Real',
    type: 'hat',
    emoji: '👑',
    rarity: 'legendary',
    description: 'Para verdaderos reyes del bienestar'
  }),

  new Decoration({
    id: 'hat_top',
    name: 'Sombrero de Copa',
    type: 'hat',
    emoji: '🎩',
    rarity: 'epic',
    description: 'Elegancia y distinción'
  }),

  new Decoration({
    id: 'hat_party',
    name: 'Gorro de Fiesta',
    type: 'hat',
    emoji: '🎉',
    rarity: 'rare',
    description: 'Perfecto para celebrar logros'
  }),

  // ACCESORIOS
  new Decoration({
    id: 'acc_sunglasses',
    name: 'Lentes de Sol',
    type: 'accessory',
    emoji: '🕶️',
    rarity: 'common',
    description: 'Look genial para cualquier ocasión'
  }),

  new Decoration({
    id: 'acc_bowtie',
    name: 'Corbatín Elegante',
    type: 'accessory',
    emoji: '🎀',
    rarity: 'rare',
    description: 'Para ocasiones especiales'
  }),

  new Decoration({
    id: 'acc_medal',
    name: 'Medalla de Oro',
    type: 'accessory',
    emoji: '🏅',
    rarity: 'epic',
    description: 'Premio por tu dedicación'
  }),

  new Decoration({
    id: 'acc_rainbow',
    name: 'Aura Arcoíris',
    type: 'effect',
    emoji: '🌈',
    rarity: 'legendary',
    description: 'Efecto mágico que te rodea'
  }),

  // BACKGROUNDS
  new Decoration({
    id: 'bg_nature',
    name: 'Fondo Natural',
    type: 'background',
    emoji: '🌿',
    rarity: 'common',
    description: 'Ambiente relajante de naturaleza'
  }),

  new Decoration({
    id: 'bg_space',
    name: 'Galaxia Estelar',
    type: 'background',
    emoji: '🌌',
    rarity: 'epic',
    description: 'Viaja entre las estrellas'
  }),

  new Decoration({
    id: 'bg_fire',
    name: 'Llamas Épicas',
    type: 'background',
    emoji: '🔥',
    rarity: 'rare',
    description: 'Para verdaderos guerreros'
  }),

  // EFECTOS ESPECIALES
  new Decoration({
    id: 'effect_sparkles',
    name: 'Destellos Mágicos',
    type: 'effect',
    emoji: '✨',
    rarity: 'rare',
    description: 'Partículas brillantes a tu alrededor'
  }),

  new Decoration({
    id: 'effect_hearts',
    name: 'Corazones Flotantes',
    type: 'effect',
    emoji: '💖',
    rarity: 'common',
    description: 'Muestra tu amor por el bienestar'
  }),

  new Decoration({
    id: 'effect_lightning',
    name: 'Rayos de Poder',
    type: 'effect',
    emoji: '⚡',
    rarity: 'legendary',
    description: 'Energía pura que te envuelve'
  })
];

// Obtener decoraciones por rareza
export const getDecorationsByRarity = (rarity) => {
  return AVAILABLE_DECORATIONS.filter(decoration => decoration.rarity === rarity);
};

// Obtener decoración aleatoria según probabilidades
export const getRandomDecoration = () => {
  const rand = Math.random() * 100;
  
  let rarity;
  if (rand <= 3) rarity = 'legendary';        // 3%
  else if (rand <= 15) rarity = 'epic';       // 12%
  else if (rand <= 40) rarity = 'rare';       // 25%
  else rarity = 'common';                     // 60%
  
  const decorationsOfRarity = getDecorationsByRarity(rarity);
  const randomIndex = Math.floor(Math.random() * decorationsOfRarity.length);
  
  // Crear nueva instancia para evitar modificar el original
  const selected = decorationsOfRarity[randomIndex];
  return new Decoration(selected);
};

export default Decoration;
