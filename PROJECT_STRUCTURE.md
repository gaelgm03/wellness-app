# Wellness Quest - Estructura del Proyecto

## 🏗️ Visión General de la Arquitectura

Wellness Quest sigue la **arquitectura MVVM** con **Jetpack Compose** para la UI, implementando una clara separación de responsabilidades:

```
app/src/main/java/com/wellnessquest/
├── MainActivity.kt                 # Punto de entrada principal
├── WellnessQuestApplication.kt     # Clase de aplicación Hilt
├── data/
│   └── models/
│       ├── GameState.kt           # Estado principal del juego
│       ├── Mission.kt             # Modelo de datos de misión
│       ├── Pet.kt                 # Modelo de datos de mascota
│       └── UserPreferences.kt     # Preferencias del usuario
├── ui/
│   ├── components/
│   │   ├── CreditsChip.kt         # Componente de visualización de créditos
│   │   ├── MissionCard.kt         # Componente de tarjeta de misión
│   │   ├── PetStatusBar.kt        # Componente de estado de mascota
│   │   └── ComponentPreviews.kt   # Previews de componentes
│   ├── navigation/
│   │   └── Navigation.kt          # Configuración de navegación
│   ├── screens/
│   │   ├── home/
│   │   │   ├── HomeScreen.kt      # UI de pantalla principal
│   │   │   ├── HomeViewModel.kt   # Lógica de pantalla principal
│   │   │   └── HomeScreenPreview.kt # Previews de pantalla principal
│   │   └── onboarding/
│   │       ├── OnboardingScreen.kt      # UI de onboarding
│   │       ├── OnboardingViewModel.kt   # Lógica de onboarding
│   │       └── OnboardingScreenPreview.kt # Previews de onboarding
│   └── theme/
│       ├── Color.kt               # Paleta de colores wellness
│       ├── Theme.kt               # Tema Material 3
│       └── Type.kt                # Definiciones de tipografía
```

## 🎨 Componentes de UI

### Pantallas Principales
- **OnboardingScreen**: Asistente de 4 pasos para preferencias del usuario
- **HomeScreen**: Panel principal con mascota, misiones y progreso

### Componentes Reutilizables
- **PetStatusBar**: Muestra estado de mascota, nivel y experiencia
- **CreditsChip**: Muestra créditos de corazones con animaciones
- **MissionCard**: Tarjetas de misión interactivas con estados de completion

## 🔄 Gestión de Estado

### ViewModels
- **OnboardingViewModel**: Gestiona el flujo de onboarding y preferencias del usuario
- **HomeViewModel**: Gestiona el estado del juego, misiones e interacciones con la mascota

### Estados de UI
- **OnboardingUiState**: Rastrea el progreso del onboarding y selecciones
- **HomeUiState**: Gestiona el estado del juego, carga y estados de error

## 🎯 Características Clave Implementadas

### ✅ Flujo de Onboarding
- Asistente de 4 pasos con indicador de progreso
- Selección de objetivo de bienestar
- Preferencia de disponibilidad diaria
- Elección de nivel de intensidad
- Preferencia de estilo de misión

### ✅ Panel Principal
- Visualización de estado de mascota con estados emocionales
- Sistema de créditos/corazones
- Lista de misiones diarias
- Seguimiento de progreso
- Funcionalidad de alimentar mascota

### ✅ Sistema de Componentes
- Tema Material Design 3
- Paleta de colores wellness (verdes/azules)
- Diseños responsivos
- Soporte de animaciones
- Consideraciones de accesibilidad

### ✅ Navegación
- Rutas tipadas
- Soporte de deep links
- Transiciones entre pantallas

### ✅ Gestión de Estado
- Patrón MVVM
- StateFlow para UI reactiva
- Datos mock para demostración
- Estados de carga y error

## 🚀 Primeros Pasos

1. **Abrir en Android Studio**
2. **Sincronizar dependencias Gradle**
3. **Ejecutar en emulador/dispositivo**
4. **Completar flujo de onboarding**
5. **Explorar panel principal****

## 🎨 Sistema de Diseño

### Colores
- **Primario**: Wellness Green (#4CAF50)
- **Secundario**: Wellness Blue (#2196F3)
- **Terciario**: Wellness Heart (#E91E63)
- **Fondo**: Fondo wellness suave (#F5F9F6)

### Tipografía
- Escala tipográfica Material 3
- Pesos personalizados para jerarquía
- Tamaños enfocados en accesibilidad

### Componentes
- Tarjetas con elevación
- Esquinas redondeadas (12dp estándar)
- Espaciado consistente (grid de 8dp)
- Objetivos táctiles (48dp mínimo)

## 📱 Flujo de Demostración

1. **Iniciar aplicación** → Pantalla de onboarding
2. **Completar 4 preguntas** → Navegar a Principal
3. **Ver estado de mascota** → Interactuar con mascota
4. **Completar misiones** → Ganar corazones
5. **Alimentar mascota** → Gastar corazones
6. **Seguir progreso** → Ver completion diaria

## 🧪 Estrategia de Pruebas

- **UI Previews**: Todos los componentes tienen funciones @Preview
- **Pruebas de ViewModel**: Pruebas unitarias para lógica de negocio
- **Pruebas de Navegación**: Verificación de deep links
- **Pruebas de Accesibilidad**: Descripciones de contenido y contraste