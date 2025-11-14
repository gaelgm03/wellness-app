/**
 * SERVICIO: NotificationService (¡LO CABRÓN DE LAS NOTIFICACIONES!)
 * Propósito: Manejar notificaciones diarias motivacionales
 * Funcionalidades: Programar, cancelar y personalizar notificaciones según progreso
 */

// import * as Device from 'expo-device'; // No necesario para el MVP básico
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar comportamiento de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  
  // CONFIGURAR PERMISOS DE NOTIFICACIONES
  static async setupNotifications() {
    try {
      let token;

      // if (Device.isDevice) { // Simplificado para MVP
      if (true) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          console.warn('⚠️ No se obtuvieron permisos de notificación');
          return false;
        }
        
        // Configurar canal para Android
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('wellness-reminders', {
            name: 'Recordatorios de Bienestar',
            importance: Notifications.AndroidImportance.DEFAULT,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#4CAF50',
          });
        }
        
        console.log('✅ Notificaciones configuradas correctamente');
        return true;
        
      } else {
        console.warn('⚠️ Las notificaciones solo funcionan en dispositivos físicos');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error configurando notificaciones:', error);
      return false;
    }
  }

  // MENSAJES MOTIVACIONALES DINÁMICOS
  static getMotivationalMessages(gameState) {
    const { daysCompleted, hearts, pet } = gameState;
    const completionPercentage = gameState.getTodayCompletionPercentage();
    
    // Mensajes según el estado del usuario
    const messages = {
      newUser: [
        "🌱 ¡Tu día de bienestar te espera! Pequeños pasos, grandes cambios.",
        "💪 ¡Es hora de cuidarte! Tu mascota también te está esperando.",
        "✨ Un momento para ti mismo puede cambiar todo el día."
      ],
      
      onStreak: [
        `🔥 ¡${daysCompleted} días consecutivos! Eres imparable.`,
        `⭐ Tu racha de ${daysCompleted} días es inspiradora. ¡Sigue así!`,
        `💫 ${daysCompleted} días cuidándote. Tu mascota está súper orgullosa.`
      ],
      
      lowProgress: [
        "🎯 Tu mascota te extraña. ¿Qué tal una misión rápida?",
        "💝 Tienes misiones esperándote. Solo toma unos minutos.",
        "🌟 Incluso 2 minutos de autocuidado marcan la diferencia."
      ],
      
      highProgress: [
        "🚀 ¡Casi terminas el día! Una misión más y serás un campeón.",
        "👑 Tu progreso de hoy es increíble. ¡Termina con toda!",
        "🎉 Estás tan cerca de completar todas las misiones. ¡Tú puedes!"
      ],
      
      sadPet: [
        "😢 Tu mascota necesita atención. ¡Alimentala con tus logros!",
        "💔 Tu compañero de bienestar está triste. ¿Le das amor?",
        "🤗 Una misión completada alegrará a tu mascota."
      ],
      
      hasHearts: [
        `💝 Tienes ${hearts} corazones. ¡Perfecto para mimar a tu mascota!`,
        `⚡ Con ${hearts} corazones puedes hacer que tu mascota sea feliz.`,
        `🎁 ${hearts} corazones te esperan para cuidar a tu compañero.`
      ]
    };

    // ALGORITMO DE SELECCIÓN DE MENSAJE
    let selectedMessages = messages.newUser;
    
    if (daysCompleted >= 3) {
      selectedMessages = messages.onStreak;
    } else if (completionPercentage === 0) {
      selectedMessages = messages.lowProgress;
    } else if (completionPercentage >= 66) {
      selectedMessages = messages.highProgress;
    } else if (pet.mood === 'triste') {
      selectedMessages = messages.sadPet;
    } else if (hearts >= 2) {
      selectedMessages = messages.hasHearts;
    }

    // Seleccionar mensaje aleatorio de la categoría
    return selectedMessages[Math.floor(Math.random() * selectedMessages.length)];
  }

  // PROGRAMAR NOTIFICACIÓN DIARIA
  static async scheduleDailyNotification(gameState, preferredTime = { hour: 19, minute: 0 }) {
    try {
      // Cancelar notificaciones anteriores
      await this.cancelAllNotifications();
      
      const message = this.getMotivationalMessages(gameState);
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Wellness Quest 🌟",
          body: message,
          data: { 
            type: 'daily_reminder',
            gameState: {
              hearts: gameState.hearts,
              daysCompleted: gameState.daysCompleted,
              petMood: gameState.pet.mood
            }
          },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.DEFAULT,
          vibrate: [0, 250, 250, 250],
        },
        trigger: {
          hour: preferredTime.hour,
          minute: preferredTime.minute,
          repeats: true,
        },
      });
      
      console.log('✅ Notificación diaria programada:', notificationId);
      console.log('📅 Hora:', `${preferredTime.hour}:${preferredTime.minute.toString().padStart(2, '0')}`);
      console.log('💬 Mensaje:', message);
      
      return notificationId;
      
    } catch (error) {
      console.error('❌ Error programando notificación:', error);
      return null;
    }
  }

  // NOTIFICACIÓN INMEDIATA PARA TESTING
  static async sendTestNotification(gameState) {
    try {
      const message = this.getMotivationalMessages(gameState);
      
      await Notifications.presentNotificationAsync({
        title: "Wellness Quest 🧪 [TEST]",
        body: message,
        data: { type: 'test' },
      });
      
      console.log('🧪 Notificación de prueba enviada');
      
    } catch (error) {
      console.error('❌ Error enviando notificación de prueba:', error);
    }
  }

  // CANCELAR TODAS LAS NOTIFICACIONES
  static async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('🗑️ Todas las notificaciones canceladas');
    } catch (error) {
      console.error('❌ Error cancelando notificaciones:', error);
    }
  }

  // ESCUCHAR CUANDO SE TOCA UNA NOTIFICACIÓN
  static addNotificationListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // ESCUCHAR RESPUESTA A NOTIFICACIONES
  static addNotificationResponseListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // OBTENER CONFIGURACIÓN DE NOTIFICACIONES
  static async getNotificationSettings() {
    try {
      const settings = await Notifications.getPermissionsAsync();
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      
      return {
        permissions: settings,
        scheduledCount: scheduled.length,
        scheduled: scheduled
      };
      
    } catch (error) {
      console.error('❌ Error obteniendo configuración:', error);
      return null;
    }
  }

  // DEBUG: VER NOTIFICACIONES PROGRAMADAS
  static async debugScheduledNotifications() {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      
      console.log('🔍 DEBUG - Notificaciones programadas:', scheduled.length);
      scheduled.forEach((notification, i) => {
        console.log(`  ${i + 1}. ${notification.content.title}`);
        console.log(`     Body: ${notification.content.body}`);
        console.log(`     Trigger:`, notification.trigger);
      });
      
    } catch (error) {
      console.error('❌ Error en debug de notificaciones:', error);
    }
  }
}

export default NotificationService;
