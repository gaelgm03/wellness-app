# Wellness Quest 🧭💚  
**Aplicación móvil gamificada de bienestar | Hackathon iOSLab 2025**

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.23-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Wellness Quest** transforma hábitos saludables en una experiencia gamificada mediante **micro-misiones diarias personalizadas** y **Diem**, una mascota emocional que refleja tu progreso.

### ✨ Demo Rápida

**Flujo completo:**  
Onboarding personalizado (4 preguntas) → Misiones diarias (2-15 min) → Sistema de recompensas → Cuidado de mascota → Casino y coleccionables

**Características destacadas:**
- 🎯 Generación inteligente de misiones basada en preferencias del usuario
- 💖 Sistema de economía dual (corazones acumulables + monedas)
- 🐾 Mascota emocional "Diem" con 4 estados visuales progresivos
- 🎰 Casino con ruleta animada y sistema de coleccionables por rareza
- 📊 Seguimiento de progreso con rachas diarias
- 💾 Persistencia completa con AsyncStorage

---

## 🎯 Objetivo del Proyecto

**Wellness Quest** busca resolver un problema común: mantener hábitos saludables de forma sostenible.

**Problema:**
- Las apps de bienestar tradicionales son complejas o abrumadoras
- La motivación decae con el tiempo
- Falta personalización real basada en necesidades individuales

**Solución:**
- Misiones diarias cortas (2-15 min) adaptadas a disponibilidad y objetivos
- Mascota emocional que crea accountability positivo
- Sistema de recompensas dual sin presión  

---

## ✨ Características Principales

1. **Onboarding (4 preguntas)**  
   - Objetivo de bienestar: `energía`, `estrés`, `movimiento`.  
   - Disponibilidad diaria: `baja` / `media` / `alta`.  
   - Intensidad preferida: `suave` / `normal` / `activa`.  
   - Estilo de misión: `reflexiva` / `activa` / `social` / `personal`.

2. **Misiones diarias automáticas**  
   - Generar **3 misiones pequeñas por día** (2–15 min).  
   - Estados de misión: `pendiente` / `completada`.  

3. **Economía doble** ⭐  
   - Completar misión = `+1` corazón + `+10` monedas.  
   - Cuidar mascota = `–1` corazón (máximo 3 cuidados por día).  
   - Corazones acumulables entre días.  
   - Sistema de monedas para casino y decoraciones.  

4. **Mascota emocional "Diem"** 🐾  
   - 4 estados visuales progresivos: `triste` → `neutral` → `feliz` → `máximo`.  
   - Estado se actualiza solo al presionar el botón "Cuidar".  
   - Límite diario de 3 cuidados fomenta hábito constante sin grinding.  
   - Botón de cuidado se desactiva automáticamente al alcanzar el máximo.  
   - Reset diario del estado visual.  

5. **Progreso básico**  
   - Días completados.  
   - Porcentaje de misiones completadas hoy.  

6. **Notificación diaria**  
   - Un recordatorio motivacional al día.  

7. **Persistencia local**  
   - Uso de **AsyncStorage** (React Native) para guardar estado del juego y preferencias.

8. **Casino y decoraciones** 🎰 ⭐  
   - Ruleta para gastar monedas y obtener decoraciones.  
   - Sistema de premios con decoraciones.  
   - Inventario de items coleccionables.  

---

## 🖥️ Stack Tecnológico

- **Framework:** React Native 0.81.5  
- **Runtime:** Expo ~54.0.23  
- **Lenguaje:** TypeScript + JavaScript  
- **UI:** React Native (StyleSheet API)  
- **Navegación:** Expo Router ~6.0.14 (file-based routing)  
- **Arquitectura:** Functional Components + React Hooks  
- **Persistencia local:** AsyncStorage (@react-native-async-storage/async-storage)  
- **Animaciones:** React Native Animated API  
- **Iconos:** @expo/vector-icons  
- **Herramientas:** Windsurf para acelerar desarrollo y refactors  

### Plataformas soportadas
- ✅ iOS (mediante Expo Go o build)  
- ✅ Android (mediante Expo Go o build)  
- ✅ Web (mediante Expo web)  

---

## 🎮 Características implementadas

### Sistema de mascota emocional
- **4 estados visuales progresivos** con imágenes únicas
- **Sistema de cuidado inteligente**: solo se actualiza al presionar botón "Cuidar"
- **Límite diario de 3 cuidados** para fomentar hábito sin grinding
- **Mensajes contextuales** específicos para cada estado
- **Indicador visual de progreso** (3 corazones) con estados lleno/vacío
- **Animaciones fluidas** de transición y feedback

### Generación de misiones
- **Motor de personalización** basado en 4 parámetros del onboarding
- **3 misiones diarias únicas** adaptadas a disponibilidad y objetivo
- **Categorías**: Energía, Estrés, Movimiento
- **Intensidades**: Suave, Normal, Activa
- **Duraciones ajustadas** según disponibilidad del usuario (2-30 min)

### Sistema de economía
- **Corazones**: Recurso acumulable, se gana completando misiones (+1 por misión)
- **Monedas**: Moneda del casino, se gana completando misiones (+10 por misión)
- **Límite de cuidados diarios**: Máximo 3 mejoras de estado por día
- **Persistencia completa**: Estado se guarda automáticamente

### Casino y coleccionables
- **Ruleta animada** con efectos visuales según rareza
- **4 niveles de rareza**: Común, Rara, Épica, Legendaria
- **Sistema de inventario** con decoraciones desbloqueables
- **Mecánica de equipar/desequipar** items
- **Estadísticas de colección** (completado, legendarias obtenidas)

### Progreso y estadísticas
- **Días consecutivos** (streak) con contador
- **Porcentaje de completado diario** con barra de progreso animada
- **Total de misiones completadas**
- **Reset diario automático** de misiones y estado de mascota

## 🚀 Cómo correr el proyecto

### Prerequisitos
- **Node.js** 16+ y **npm** instalados
- **Expo Go** app instalada en tu dispositivo móvil ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- Dispositivo móvil y PC en la **misma red Wi-Fi** (o usar modo Tunnel)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/gaelgm03/wellness-app.git
cd wellness-app

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run start
```

### Opciones de conexión

**Opción 1: LAN (recomendada, más rápida)**
```bash
npm run start
```
- Escanea el código QR con Expo Go
- Ambos dispositivos deben estar en la misma red Wi-Fi

**Opción 2: Tunnel (si LAN falla)**
```bash
npx expo start --tunnel
```
- Usa esta opción si tienes problemas de conectividad
- Más lento pero más confiable en redes complejas

**Opción 3: Web**
```bash
npm run web
```
- Abre automáticamente en el navegador
- Útil para pruebas rápidas sin dispositivo móvil

### Solución de problemas comunes

**❌ Error: "fetch failed" al iniciar**
- Verifica tu conexión a internet
- Desactiva VPN/Proxy temporalmente
- Reinicia el servidor: `Ctrl+C` y vuelve a ejecutar `npm run start`

**❌ Error: "requested timed out" en Expo Go**
- Confirma que ambos dispositivos están en la misma red
- Usa modo Tunnel: `npx expo start --tunnel`
- Verifica que el firewall no bloquee Expo (puerto 8081)

**❌ Warnings de dependencias/vulnerabilidades**
- Son normales en proyectos Expo
- No afectan la funcionalidad

### Limpiar datos de la app

Si necesitas resetear la app completamente:

```bash
# En Metro Bundler (terminal donde corre npm start)
# Presiona 'shift + d' para abrir Dev Menu
# Luego selecciona "Reload" o "Clear Cache"
```

O desde el código (más drástico):
```javascript
// Llamar esto en cualquier pantalla para borrar todo
import StorageService from './src/services/StorageService';
await StorageService.clearAllData();
```

---

## 🧱 Arquitectura de la App

### Estructura de carpetas
```
app/
  ├── (tabs)/          # Tabs principales (Home, Explore, Profile)
  ├── onboarding.tsx   # Pantalla de onboarding
  ├── casino.tsx       # Pantalla del casino 
  └── _layout.tsx      # Layout raíz

src/
  ├── models/          # Modelos de datos (GameState, Pet, Mission, etc.)
  ├── services/        # Servicios (StorageService, MissionGenerator, CasinoService)
  └── data/            # Datos mock y demo

assets/
  └── images/          # Imágenes de mascota, iconos, etc.
```

### Capas principales

- **UI (React Components + Hooks)**  
  - Pantallas construidas con functional components.  
  - Manejo de estado con `useState`, `useEffect`, `useFocusEffect`.  
  - Navegación mediante Expo Router (file-based).

- **Servicios (Business Logic)**  
  - `MissionGenerator`: Generación inteligente de misiones basada en preferencias.  
  - `StorageService`: Persistencia con AsyncStorage.  
  - `CasinoService`: Lógica de ruleta y premios.  
  - `NotificationService`: Recordatorios diarios (simplificado).

- **Modelos (Data Models)**  
  - `GameState`: Estado global del juego (corazones, monedas, misiones, progreso).  
  - `Pet`: Mascota emocional con estados feliz/triste.  
  - `Mission`: Misiones diarias con categorías e intensidades.  
  - `UserPreferences`: Preferencias del onboarding.  
  - `Decoration`: Items de decoración del casino.

- **Persistencia (AsyncStorage)**  
  - Estado del juego completo serializado a JSON.  
  - Preferencias de usuario.  
  - Inventario de decoraciones.  
  - Estado del onboarding.  

---

## 🧱 Pantallas del MVP

- **Onboarding**  
  - Flujo de 4 preguntas.  
  - Guardado de preferencias locales.  
  - Navegación a Home al finalizar.  

- **Home**  
  - **Mascota emocional "Diem"** con 4 estados visuales progresivos.  
  - **Indicador de estado** con 3 corazones (vacíos/llenos).  
  - Lista de **3 misiones diarias** personalizadas según onboarding.  
  - **Botón " Cuidar"** para mejorar estado de mascota (máx. 3 veces/día).  
  - **Sección de progreso** con estadísticas del día y racha.  
  - Visualización de **corazones** (acumulables) y **monedas** para casino.  

- **Casino**  
  - Ruleta animada para gastar monedas.  
  - Sistema de premios con decoraciones.  
  - Inventario de items coleccionables.  
  - Animaciones de giro y efectos visuales.

- **Progreso**  
  - Días completados (streak).  
  - Porcentaje de misiones completadas hoy.  
  - Estadísticas de misiones realizadas.  
  - Representación visual moderna con barras de progreso.  

---

## 🔁 Flujos principales

### Flujo 1: Primer uso

1. Usuario abre la app.  
2. Ve el **Onboarding** (4 preguntas).  
3. Se guardan preferencias en AsyncStorage.  
4. Se genera el set de **3 misiones diarias**.  
5. Se navega a **Home** con mascota + misiones.  

### Flujo 2: Completar una misión

1. Usuario ve misiones en Home.  
2. Marca una misión como **completada**.  
3. Se actualiza el estado de la misión (pendiente → completada).  
4. Se suma `+1` corazón y `+10` monedas.  
5. Se actualiza el **progreso del día**.  

### Flujo 3: Cuidar a la mascota

1. Usuario presiona botón " Cuidar".  
2. Se valida que tenga corazones disponibles y no haya alcanzado el límite diario (3).  
3. Se descuenta `–1` corazón.  
4. La mascota avanza 1 estado (triste → neutral → feliz → máximo).  
5. El indicador visual se actualiza (corazones llenos).  
6. El mensaje debajo de la mascota cambia según el nuevo estado.  
7. Si alcanza 3 cuidados, el botón se desactiva hasta el día siguiente.  

### Flujo 4: Progreso

1. En la pantalla de **Progreso**, el usuario ve:  
   - Días completados (streak).  
   - Porcentaje de misiones completadas hoy.  

### Flujo 5: Notificación diaria

1. Una vez al día se dispara una **notificación motivacional**.  
2. El tap en la notificación lleva a Home.  

---

## 📊 Métricas del Proyecto

- **Contexto:** Proyecto desarrollado durante hackathon iOSLab 2025 (3 días)
- **Líneas de código:** ~2,800+ (TypeScript + JavaScript)
- **Componentes:** 8 pantallas/modales
- **Modelos de datos:** 5 clases principales (`GameState`, `Pet`, `Mission`, `UserPreferences`, `Decoration`)
- **Servicios:** 4 servicios (`StorageService`, `MissionGenerator`, `CasinoService`, `NotificationService`)
- **Animaciones:** 15+ animaciones fluidas con React Native Animated API
- **Assets:** 4 estados de mascota (PNG) + iconos + efectos

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas para expandir el proyecto:

- 🔔 Implementar sistema completo de notificaciones push
- 🎨 Integración visual de decoraciones sobre la imagen de Diem
- 📱 Conectar con APIs de salud (Apple Health, Google Fit)
- 🌍 Sistema de comunidad y logros compartidos
- 🧪 Tests unitarios y de integración
- ♿ Mejoras de accesibilidad (WCAG compliance)

**Para contribuir:**
1. Fork el repositorio
2. Crea una rama con tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 👨‍💻 Autor

**Gael Guzmán**  
- GitHub: [@gaelgm03](https://github.com/gaelgm03)
- Proyecto: [Wellness Quest](https://github.com/gaelgm03/wellness-app)
- LinkedIn: [Tu LinkedIn](https://www.linkedin.com/in/gael-guzman-munguia-190b6b332/)

---

## 🙏 Agradecimientos

- **Desarrolladores de Expo y React Native** por las herramientas de desarrollo multiplataforma
- **Windsurf AI** por acelerar el desarrollo con pair programming
- **Comunidad open-source** por las librerías utilizadas

---

## 🧘‍♂️ Mensaje Final

> **"Pequeños hábitos, grandes cambios."**
> 
> Wellness Quest combina gamificación y bienestar para hacer el autocuidado accesible y sostenible. Misiones personalizadas, motivación emocional y progreso visible que te acompaña cada día.

**⭐ Si te gusta el proyecto, considera darle una estrella en GitHub!**

---

<p align="center">
  Desarrollado con 💚 durante el hackathon iOSLab 2025
</p>