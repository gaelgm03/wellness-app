/**
 * SERVICIO: MissionGenerator (¡LO CABRÓN DEL DÍA 2!)
 * Propósito: Generar misiones personalizadas basadas en preferencias del onboarding
 * Funcionalidades: Algoritmo inteligente que considera objetivo, disponibilidad, intensidad y estilo
 */

import { Mission } from '../models/Mission';

export class MissionGenerator {
  
  // BASE DE DATOS DE MISIONES POR CATEGORÍA Y CARACTERÍSTICAS
  static MISSION_TEMPLATES = {
    // OBJETIVOS DE BIENESTAR
    energia: {
      suave: [
        {
          title: "Agua revitalizante",
          description: "Bebe un vaso grande de agua fresca y siente la hidratación",
          duration: 2,
          style: ['personal', 'reflexiva']
        },
        {
          title: "Respiración energizante",
          description: "Haz 10 respiraciones profundas cerca de una ventana",
          duration: 3,
          style: ['personal', 'reflexiva']
        },
        {
          title: "Estiramiento matutino",
          description: "Estira brazos y piernas suavemente como un gato",
          duration: 5,
          style: ['personal', 'activa']
        }
      ],
      normal: [
        {
          title: "Caminar energético",
          description: "Camina 10 minutos con paso firme, dentro o fuera",
          duration: 10,
          style: ['activa', 'personal']
        },
        {
          title: "Snack saludable",
          description: "Come una fruta o frutos secos para energía natural",
          duration: 5,
          style: ['personal']
        },
        {
          title: "Música motivadora",
          description: "Escucha tu canción favorita y muévete al ritmo",
          duration: 4,
          style: ['personal', 'activa']
        }
      ],
      activa: [
        {
          title: "Mini workout",
          description: "Haz 20 jumping jacks o sentadillas en tu lugar",
          duration: 8,
          style: ['activa']
        },
        {
          title: "Escaleras energéticas",
          description: "Sube y baja escaleras 3 veces con energía",
          duration: 6,
          style: ['activa']
        },
        {
          title: "Baile libre",
          description: "Pon música y baila como si nadie te viera por 5 minutos",
          duration: 5,
          style: ['activa', 'personal']
        }
      ]
    },

    estres: {
      suave: [
        {
          title: "Respiración zen",
          description: "Respira lenta y profundamente: 4 segundos inhalar, 6 exhalar",
          duration: 5,
          style: ['reflexiva', 'personal']
        },
        {
          title: "Gratitud mental",
          description: "Piensa en 3 cosas por las que te sientes agradecido hoy",
          duration: 3,
          style: ['reflexiva', 'personal']
        },
        {
          title: "Pausa mindful",
          description: "Siéntate cómodamente y observa tus pensamientos sin juzgar",
          duration: 7,
          style: ['reflexiva']
        }
      ],
      normal: [
        {
          title: "Música relajante",
          description: "Escucha sonidos de la naturaleza o música calmante",
          duration: 8,
          style: ['reflexiva', 'personal']
        },
        {
          title: "Organizar espacio",
          description: "Ordena tu escritorio o un pequeño espacio personal",
          duration: 10,
          style: ['personal']
        },
        {
          title: "Llamada a un amigo",
          description: "Envía un mensaje o llama a alguien que te haga sonreír",
          duration: 5,
          style: ['social']
        }
      ],
      activa: [
        {
          title: "Caminar meditativo",
          description: "Camina lentamente prestando atención a cada paso",
          duration: 12,
          style: ['activa', 'reflexiva']
        },
        {
          title: "Escribir emociones",
          description: "Escribe cómo te sientes en este momento sin filtros",
          duration: 8,
          style: ['reflexiva', 'personal']
        },
        {
          title: "Yoga suave",
          description: "Haz 3-4 posturas de yoga sencillas para relajarte",
          duration: 10,
          style: ['activa', 'reflexiva']
        }
      ]
    },

    movimiento: {
      suave: [
        {
          title: "Estirar el cuello",
          description: "Mueve tu cuello suavemente en círculos, 10 hacia cada lado",
          duration: 3,
          style: ['personal', 'activa']
        },
        {
          title: "Caminar en casa",
          description: "Da una vuelta tranquila por tu casa o habitación",
          duration: 5,
          style: ['personal', 'activa']
        },
        {
          title: "Manos y muñecas",
          description: "Rota tus muñecas y estira dedos si trabajas con computadora",
          duration: 2,
          style: ['personal']
        }
      ],
      normal: [
        {
          title: "Subir escaleras",
          description: "Usa las escaleras en lugar del elevador si tienes oportunidad",
          duration: 5,
          style: ['activa']
        },
        {
          title: "Limpieza activa",
          description: "Limpia algo de tu casa moviéndote con energía",
          duration: 12,
          style: ['personal', 'activa']
        },
        {
          title: "Caminar rápido",
          description: "Sal a dar una caminata rápida por tu barrio",
          duration: 15,
          style: ['activa']
        }
      ],
      activa: [
        {
          title: "HIIT rápido",
          description: "2 minutos de ejercicio intenso: burpees, sentadillas, flexiones",
          duration: 8,
          style: ['activa']
        },
        {
          title: "Correr en el lugar",
          description: "Corre en tu lugar por 3 minutos con intensidad media",
          duration: 5,
          style: ['activa']
        },
        {
          title: "Reto de fuerza",
          description: "Haz tantas flexiones o sentadillas como puedas en 2 minutos",
          duration: 6,
          style: ['activa']
        }
      ]
    }
  };

  /**
   * ALGORITMO PRINCIPAL: Generar 3 misiones personalizadas
   * @param {UserPreferences} userPreferences - Preferencias del onboarding
   * @returns {Mission[]} - Array de 3 misiones personalizadas
   */
  static generateDailyMissions(userPreferences) {
    const missions = [];
    
    // Validar que tenga preferencias
    if (!userPreferences || !userPreferences.isComplete()) {
      console.warn('⚠️ Preferencias incompletas, usando misiones por defecto');
      return this.getDefaultMissions();
    }

    const { wellnessGoal, dailyAvailability, preferredIntensity, missionStyle } = userPreferences;

    console.log('🧠 Generando misiones para:', userPreferences.toDebugString());

    // Obtener template base según objetivo e intensidad
    const baseTemplates = this.MISSION_TEMPLATES[wellnessGoal]?.[preferredIntensity] || [];
    
    if (baseTemplates.length === 0) {
      console.warn('⚠️ No hay templates para', wellnessGoal, preferredIntensity);
      return this.getDefaultMissions();
    }

    // ALGORITMO DE SELECCIÓN INTELIGENTE MEJORADO
    
    // 1. Priorizar misiones que coincidan con el estilo Y objetivo
    const styleMatchedMissions = baseTemplates.filter(template => 
      template.style.includes(missionStyle)
    );
    
    // 2. Si hay suficientes con el estilo, usar esas; sino usar todas del objetivo
    const availableMissions = styleMatchedMissions.length >= 3 
      ? styleMatchedMissions 
      : baseTemplates;

    // 3. Ajustar duración según disponibilidad (CORREGIDO)
    const adjustedMissions = availableMissions.map(template => ({
      ...template,
      duration: this.adjustDurationByAvailability(template.duration, dailyAvailability),
      originalDuration: template.duration // Guardar original para debug
    }));

    // 4. Seleccionar 3 misiones variadas (priorizando wellnessGoal)
    const selectedMissions = this.selectVariedMissions(adjustedMissions, 3);

    // 4. Crear objetos Mission con IDs únicos
    selectedMissions.forEach((template, index) => {
      const mission = new Mission({
        id: `generated_${Date.now()}_${index}`,
        title: template.title,
        description: template.description,
        duration: template.duration,
        category: wellnessGoal,
        intensity: preferredIntensity,
        createdAt: new Date()
      });
      
      missions.push(mission);
    });

    console.log('✅ Misiones generadas:', missions.map(m => `${m.title} (${m.duration}min, ${m.intensity})`));
    console.log('📊 Preferencias aplicadas:', {
      objetivo: wellnessGoal,
      disponibilidad: dailyAvailability,
      intensidad: preferredIntensity,
      estilo: missionStyle
    });
    return missions;
  }

  /**
   * Ajustar duración según disponibilidad diaria
   */
  static adjustDurationByAvailability(baseDuration, availability) {
    const adjustments = {
      baja: { min: 2, max: 8 },    // 5-15 min disponibles → misiones cortas
      media: { min: 8, max: 20 },   // 15-30 min disponibles → misiones medianas
      alta: { min: 15, max: 30 }    // 30+ min disponibles → misiones largas
    };

    const range = adjustments[availability] || adjustments.media;
    
    // Escalar la duración base al rango apropiado
    const normalized = (baseDuration - 2) / (20 - 2); // Normalizar a 0-1
    const adjustedDuration = Math.round(range.min + (normalized * (range.max - range.min)));
    
    return Math.max(range.min, Math.min(range.max, adjustedDuration));
  }

  /**
   * Seleccionar misiones variadas (evitar duplicados de títulos similares)
   */
  static selectVariedMissions(missions, count) {
    if (missions.length <= count) {
      return missions;
    }

    const selected = [];
    const usedKeywords = new Set();

    // Seleccionar misiones evitando similitudes
    for (const mission of missions) {
      if (selected.length >= count) break;
      
      const keywords = mission.title.toLowerCase().split(' ');
      const hasConflict = keywords.some(keyword => usedKeywords.has(keyword));
      
      if (!hasConflict) {
        selected.push(mission);
        keywords.forEach(keyword => usedKeywords.add(keyword));
      }
    }

    // Si no tenemos suficientes, completar con las restantes
    while (selected.length < count && missions.length > selected.length) {
      const remaining = missions.filter(m => !selected.includes(m));
      if (remaining.length > 0) {
        selected.push(remaining[0]);
      } else {
        break;
      }
    }

    return selected;
  }

  /**
   * Misiones por defecto si algo falla
   */
  static getDefaultMissions() {
    return [
      new Mission({
        id: 'default_1',
        title: 'Respiración profunda',
        description: 'Toma 5 respiraciones profundas y lentas',
        duration: 3,
        category: 'estres',
        intensity: 'suave'
      }),
      new Mission({
        id: 'default_2',
        title: 'Caminar 5 minutos',
        description: 'Da una caminata corta por tu espacio',
        duration: 5,
        category: 'movimiento',
        intensity: 'normal'
      }),
      new Mission({
        id: 'default_3',
        title: 'Momento de gratitud',
        description: 'Piensa en algo positivo de tu día',
        duration: 2,
        category: 'estres',
        intensity: 'suave'
      })
    ];
  }

  /**
   * Debug: Ver todas las misiones disponibles para un perfil
   */
  static debugMissionsForProfile(userPreferences) {
    const { wellnessGoal, preferredIntensity } = userPreferences;
    const templates = this.MISSION_TEMPLATES[wellnessGoal]?.[preferredIntensity] || [];
    
    console.log(`🔍 DEBUG: Misiones disponibles para ${wellnessGoal}/${preferredIntensity}:`);
    templates.forEach((template, i) => {
      console.log(`  ${i + 1}. ${template.title} (${template.duration}min) - Estilos: ${template.style.join(', ')}`);
    });
  }
}

export default MissionGenerator;
