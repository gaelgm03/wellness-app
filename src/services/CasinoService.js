/**
 * SERVICIO: CasinoService (¡EL CASINO MÁS ÉPICO!)
 * Propósito: Manejar la ruleta, apuestas y premios de decoraciones
 * Funcionalidades: Girar ruleta, gestionar inventario, aplicar decoraciones
 */

import { AVAILABLE_DECORATIONS, getRandomDecoration } from '../models/Decoration';

export class CasinoService {
  
  // Costo de una tirada en la ruleta
  static SPIN_COST = 50// 50 monedas por giro
  
  // 🎰 GIRAR LA RULETA
  static spinRoulette(playerCoins) {
    if (playerCoins < this.SPIN_COST) {
      return {
        success: false,
        error: 'No tienes suficientes monedas',
        coinsNeeded: this.SPIN_COST - playerCoins
      };
    }

    // Generar premio aleatorio
    const prize = getRandomDecoration();
    prize.unlock(); // Desbloquear automáticamente

    return {
      success: true,
      prize: prize,
      coinsSpent: this.SPIN_COST,
      message: this.getWinMessage(prize.rarity)
    };
  }

  // 🎊 MENSAJES DE VICTORIA SEGÚN RAREZA
  static getWinMessage(rarity) {
    const messages = {
      common: [
        '¡Genial! Una nueva decoración para tu colección',
        '¡Bien hecho! Cada pequeño premio cuenta',
        '¡Perfecto! Tu mascota se ve mejor cada día'
      ],
      rare: [
        '¡Increíble! Has conseguido algo especial',
        '¡Qué suerte! Una decoración poco común',
        '¡Excelente! Tu estilo mejora notablemente'
      ],
      epic: [
        '¡ÉPICO! Has desbloqueado algo extraordinario',
        '¡IMPRESIONANTE! Decoración de nivel épico',
        '¡WOW! Tu mascota será la envidia de todos'
      ],
      legendary: [
        '🌟 ¡LEGENDARIO! ¡Este es el premio máximo! 🌟',
        '👑 ¡INCREÍBLE! Has conseguido lo imposible 👑',
        '⚡ ¡BRUTAL! Decoración ultra rara desbloqueada ⚡'
      ]
    };

    const rarityMessages = messages[rarity] || messages.common;
    return rarityMessages[Math.floor(Math.random() * rarityMessages.length)];
  }

  // 🎨 APLICAR DECORACIÓN A MASCOTA
  static applyDecorationToPet(pet, decoration, inventory) {
    if (!decoration.isUnlocked) {
      return {
        success: false,
        error: 'Decoración no desbloqueada'
      };
    }

    // Desequipar otras decoraciones del mismo tipo
    inventory.forEach(item => {
      if (item.type === decoration.type && item.isEquipped) {
        item.unequip();
      }
    });

    // Equipar la nueva decoración
    decoration.equip();

    return {
      success: true,
      message: `${decoration.name} equipado correctamente`,
      petDisplay: this.getPetDisplayWithDecorations(pet, inventory)
    };
  }

  // 🎭 OBTENER DISPLAY DE MASCOTA CON DECORACIONES
  static getPetDisplayWithDecorations(pet, inventory) {
    let display = pet.getMoodEmoji();
    let effects = [];
    let background = '';

    // Aplicar decoraciones equipadas
    inventory.forEach(decoration => {
      if (decoration.isEquipped) {
        switch (decoration.type) {
          case 'hat':
            display = decoration.emoji + display;
            break;
          case 'accessory':
            display = display + decoration.emoji;
            break;
          case 'background':
            background = decoration.emoji;
            break;
          case 'effect':
            effects.push(decoration.emoji);
            break;
        }
      }
    });

    return {
      mainDisplay: display,
      background: background,
      effects: effects,
      fullDisplay: background + display + effects.join('')
    };
  }

  // 📊 ESTADÍSTICAS DEL CASINO
  static getCasinoStats(inventory) {
    const stats = {
      totalDecorations: inventory.length,
      unlockedDecorations: inventory.filter(d => d.isUnlocked).length,
      equippedDecorations: inventory.filter(d => d.isEquipped).length,
      rarityBreakdown: {
        common: inventory.filter(d => d.rarity === 'common' && d.isUnlocked).length,
        rare: inventory.filter(d => d.rarity === 'rare' && d.isUnlocked).length,
        epic: inventory.filter(d => d.rarity === 'epic' && d.isUnlocked).length,
        legendary: inventory.filter(d => d.rarity === 'legendary' && d.isUnlocked).length
      },
      completionPercentage: Math.round((inventory.filter(d => d.isUnlocked).length / AVAILABLE_DECORATIONS.length) * 100)
    };

    return stats;
  }

  // 🎁 GENERAR INVENTARIO INICIAL VACÍO
  static generateInitialInventory() {
    return AVAILABLE_DECORATIONS.map(decoration => 
      new (decoration.constructor)(decoration)
    );
  }

  // 🎮 SIMULADOR DE MULTIPLE SPINS (para testing)
  static simulateMultipleSpins(count = 10) {
    const results = {
      prizes: [],
      rarityCount: { common: 0, rare: 0, epic: 0, legendary: 0 },
      totalCost: count * this.SPIN_COST
    };

    for (let i = 0; i < count; i++) {
      const prize = getRandomDecoration();
      results.prizes.push(prize);
      results.rarityCount[prize.rarity]++;
    }

    return results;
  }

  // 💎 OBTENER PRÓXIMO OBJETIVO DE COLECCIÓN
  static getCollectionGoal(inventory) {
    const unlockedLegendary = inventory.filter(d => d.rarity === 'legendary' && d.isUnlocked).length;
    const totalLegendary = inventory.filter(d => d.rarity === 'legendary').length;

    if (unlockedLegendary === totalLegendary) {
      return {
        title: '🏆 ¡COLECCIÓN COMPLETA!',
        description: 'Has desbloqueado todas las decoraciones legendarias',
        progress: 100,
        isComplete: true
      };
    }

    return {
      title: '💎 Decoraciones Legendarias',
      description: `${unlockedLegendary}/${totalLegendary} desbloqueadas`,
      progress: Math.round((unlockedLegendary / totalLegendary) * 100),
      isComplete: false
    };
  }
}

export default CasinoService;
