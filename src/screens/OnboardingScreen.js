/**
 * PANTALLA: OnboardingScreen
 * Propósito: Flujo de 4 preguntas para personalizar la experiencia (según README)
 * Navegación: Inicial → Home (al completar)
 */

import { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ONBOARDING_OPTIONS, UserPreferences } from '../models/UserPreferences';

const OnboardingScreen = ({ navigation, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState(new UserPreferences({}));

  // Las 4 preguntas exactas del README
  const questions = [
    {
      id: 'wellnessGoal',
      title: '🎯 ¿Cuál es tu objetivo principal?',
      subtitle: 'Elige lo que más te interesa mejorar',
      options: ONBOARDING_OPTIONS.wellnessGoal
    },
    {
      id: 'dailyAvailability', 
      title: '⏰ ¿Cuánto tiempo tienes al día?',
      subtitle: 'Para dedicar a tu bienestar',
      options: ONBOARDING_OPTIONS.dailyAvailability
    },
    {
      id: 'preferredIntensity',
      title: '💪 ¿Qué intensidad prefieres?',
      subtitle: 'Según tu estado de ánimo habitual',
      options: ONBOARDING_OPTIONS.preferredIntensity
    },
    {
      id: 'missionStyle',
      title: '🎨 ¿Qué estilo te atrae más?',
      subtitle: 'Tipo de actividades que disfrutas',
      options: ONBOARDING_OPTIONS.missionStyle
    }
  ];

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleOptionSelect = (optionKey) => {
    const updatedPreferences = { ...preferences };
    updatedPreferences[currentQuestion.id] = optionKey;
    setPreferences(updatedPreferences);

    // Avanzar automáticamente después de selección
    setTimeout(() => {
      if (isLastStep) {
        completeOnboarding(updatedPreferences);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }, 300);
  };

  const completeOnboarding = (finalPreferences) => {
    const userPrefs = new UserPreferences(finalPreferences);
    userPrefs.markAsCompleted();

    Alert.alert(
      '¡Perfecto! 🎉',
      'Ya tienes tu plan personalizado de bienestar listo',
      [
        {
          text: 'Comenzar',
          onPress: () => onComplete(userPrefs)
        }
      ]
    );
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con progreso */}
      <View style={styles.header}>
        <Text style={styles.title}>Wellness Quest</Text>
        <View style={styles.progressContainer}>
          {questions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index <= currentStep && styles.progressDotActive
              ]}
            />
          ))}
        </View>
        <Text style={styles.stepText}>
          Paso {currentStep + 1} de {questions.length}
        </Text>
      </View>

      {/* Pregunta actual */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
        <Text style={styles.questionSubtitle}>{currentQuestion.subtitle}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => {
            const isSelected = preferences[currentQuestion.id] === option.key;
            
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected
                ]}
                onPress={() => handleOptionSelect(option.key)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    isSelected && styles.optionDescriptionSelected
                  ]}>
                    {option.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer con navegación */}
      <View style={styles.footer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>← Atrás</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F6', // Wellness background (del README)
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50', // Wellness Green
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#4CAF50',
  },
  stepText: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8,
  },
  questionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  optionCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: '#2E7D32',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  optionDescriptionSelected: {
    color: '#4CAF50',
  },
  footer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
});

export default OnboardingScreen;
