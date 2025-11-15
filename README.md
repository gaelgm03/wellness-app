# Wellness Quest 🧭💚  
Aplicación móvil gamificada de bienestar para el hackathon (3 días)

Wellness Quest es una app móvil que impulsa hábitos saludables mediante **micro-misiones diarias** y una **mascota emocional** que refleja el progreso del usuario.  
Este README está diseñado como **guía clara, ejecutable y enfocada 100% en el MVP** para que todo el equipo pueda avanzar rápido y en forma alineada.

---

## 🎯 Objetivo del Proyecto

- **Meta principal:** Entregar un **MVP estable, pulido y demo-ready** en 3 días de hackathon.  
- **Enfoque:**  
  - Simplicidad en la implementación.  
  - Claridad en la experiencia de usuario.  
  - Impacto visual y emocional (mascota + misiones).  
- **Criterio de éxito:**  
  - Onboarding completo.  
  - Misiones diarias funcionando.  
  - Mascota con estados emocionales.  
  - Progreso visible.  
  - Notificación diaria operando (o simulada para demo).  

---

## 🧩 Alcance del MVP (lo que SÍ vamos a construir)

> Esta sección define exactamente el MVP. No se implementará nada fuera de esta lista.

1. **Onboarding (4 preguntas)**  
   - Objetivo de bienestar: `energía`, `estrés`, `movimiento`.  
   - Disponibilidad diaria: `baja` / `media` / `alta`.  
   - Intensidad preferida: `suave` / `normal` / `activa`.  
   - Estilo de misión.  

2. **Misiones diarias automáticas**  
   - Generar **3 misiones pequeñas por día** (2–10 min).  
   - Estados de misión: `pendiente` / `completada`.  

3. **Economía doble** ⭐  
   - Completar misión = `+1` corazón + `+10` monedas.  
   - Alimentar mascota = `–1` corazón.  
   - Sistema de monedas para casino y decoraciones.  

4. **Mascota emocional**  
   - 2 estados: `feliz` y `triste`.  
   - Cambia de estado al alimentar o no alimentar.  

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

## 🚀 Cómo correr el proyecto

### Prerequisitos
- **Node.js** 16+ y **npm** instalados
- **Expo Go** app instalada en tu dispositivo móvil ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- Dispositivo móvil y PC en la **misma red Wi-Fi** (o usar modo Tunnel)

### Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd hackathon-ioslab

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

**Opción 3: Web (backup para demo)**
```bash
npm run web
```
- Abre automáticamente en el navegador
- Útil si Expo Go falla durante la presentación

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
- Son normales para un proyecto de hackathon
- No afectan la funcionalidad del MVP
- Puedes ignorarlos para la demo

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
  ├── casino.tsx       # Pantalla del casino 🎰
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
  - Sección de **mascota emocional** (estado feliz/triste).  
  - Lista de **3 misiones diarias** con estado.  
  - Visualización de **corazones** actuales.  
  - Acción para **alimentar mascota** (consume 1 corazón).  

- **Casino** 🎰 ⭐  
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

## 👥 Equipo y Responsabilidades

### Roles

- **Dev A — UI/Frontend**  
  - Pantallas en React Native.  
  - `Onboarding`, `Home`, `Casino`, `Progreso`.  
  - Estados visuales de la mascota (feliz/triste).  
  - Animaciones con Animated API.

- **Dev B — Lógica/Datos**  
  - Generación de misiones (MissionGenerator).  
  - Persistencia (AsyncStorage).  
  - Economía (corazones + monedas).  
  - Lógica del casino y ruleta.  
  - Notificación diaria.  
  - Servicios y modelos de datos.  

### Reparto sugerido por área

| Área                  | Responsable principal | Notas                                  |
|-----------------------|-----------------------|----------------------------------------|
| Onboarding UI         | Dev A                 | React component con hooks              |
| Home UI               | Dev A                 | Mascota + misiones + corazones + monedas |
| Casino UI             | Dev A                 | Ruleta animada + inventario            |
| Progreso UI           | Dev A                 | Estadísticas y barras de progreso      |
| Generador de misiones | Dev B                 | MissionGenerator service               |
| Persistencia          | Dev B                 | AsyncStorage (StorageService)          |
| Economía              | Dev B                 | Sistema doble: corazones + monedas     |
| Casino Service        | Dev B                 | Lógica de ruleta y premios             |
| Notificación diaria   | Dev B                 | Expo Notifications (simplificado)      |

---

## 📅 Plan de 3 días (alto nivel)

### Día 1 — Fundaciones

- **UI base: Onboarding + Home**  
  - Flujo completo de pantallas (aunque con datos mock).  

- **Persistencia inicial (AsyncStorage)**  
  - Guardar resultado de onboarding con StorageService.  

- **Modelo de mascota**  
  - Definir estados `feliz` / `triste`.  
  - Definir relación con corazones y alimentación.  

- **Mock de misiones**  
  - Misiones generadas hardcodeadas según preferencias del onboarding.  

### Día 2 — Lógica + Integraciones

- **Generador de misiones**  
  - Reemplazar mocks con generación automática simple basada en:  
    - Objetivo de bienestar.  
    - Disponibilidad diaria.  
    - Intensidad.  
    - Estilo de misión.  

- **Economía**  
  - Completar misión = `+1` corazón + `+10` monedas.  
  - Alimentar mascota = `–1` corazón.  

- **Alimentar mascota**  
  - Acción en Home que consume corazón y cambia estado.  

- **Notificación diaria**  
  - Un recordatorio motivacional al día (configuración simple).  

- **Progreso básico**  
  - Días completados.  
  - Porcentaje de misiones completadas hoy.  

### Día 3 — Pulido + Demo

- **Animaciones simples**  
  - Animaciones de la mascota (cambio de estado, pequeños movimientos).  

- **UX limpia**  
  - Ajuste de colores, tipografías, spacing.  
  - Textos claros y motivacionales.  

- **Datos para demo**  
  - Estado preconfigurado que permita mostrar:  
    - Misiones pre-generadas.  
    - Un día parcialmente completado.  
    - Ejemplo de mascota triste y feliz.  

- **QA**  
  - Flujo completo: instalación → onboarding → home → completar misión → alimentar mascota → revisar progreso.  
  - Pruebas rápidas en 1–2 dispositivos.  

---

## 🔁 Flujos principales del MVP

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

### Flujo 3: Alimentar a la mascota

1. Usuario presiona acción “Alimentar mascota”.  
2. Se descuenta `–1` corazón (si hay al menos 1).  
3. La mascota pasa a estado **feliz**.  

### Flujo 4: Progreso

1. En la pantalla de **Progreso**, el usuario ve:  
   - Días completados (streak).  
   - Porcentaje de misiones completadas hoy.  

### Flujo 5: Notificación diaria

1. Una vez al día se dispara una **notificación motivacional**.  
2. El tap en la notificación lleva a Home.  

---

## 🧪 Alcance técnico mínimo por módulo

- **Onboarding**  
  - React component con estado de preguntas.  
  - Persistencia de las respuestas con StorageService.  

- **Misiones diarias**  
  - Modelo de misión (id, título, duración, estado).  
  - Lógica simple para 3 misiones/día.  

- **Economía**  
  - Variable persistida de cantidad de corazones y monedas.  
  - Actualización al completar misión y alimentar mascota.  

- **Mascota**  
  - Estado emocional derivado de acciones recientes (alimentación y/o misiones).  

- **Progreso**  
  - Registro de día actual y contador de misiones completadas.  

- **Notificación**  
  - Programación diaria básica (aunque sea mock con disparo manual para demo).  

---

## 🎬 Guion de demo (1 minuto por Windsurf)

> Esta sección sirve como script para la presentación final.

1. **Onboarding**  
   - Mostrar cómo el usuario responde a las 4 preguntas:  
     - Objetivo (energía/estrés/movimiento).  
     - Disponibilidad diaria.  
     - Intensidad preferida.  
     - Estilo de misión.  
   - Explicar en una frase que esto personaliza las misiones.  

2. **Misiones generadas**  
   - Pasar a la pantalla Home.  
   - Mostrar las **3 misiones diarias** generadas automáticamente.  
   - Resaltar que son misiones cortas (2–10 min).  

3. **Completar misión**  
   - Marcar una misión como completada.  
   - Explicar: “Cada misión completada suma un corazón”.  

4. **Alimentar mascota**  
   - Usar un corazón para alimentar a la mascota.  
   - Explicar: “Al alimentar a la mascota, usamos un corazón y fortalecemos el vínculo emocional”.  

5. **Cambio de estado de la mascota**  
   - Mostrar transición de **triste → feliz**.  
   - Resaltar el impacto visual/emocional como motivación.  

6. **Progreso**  
   - Ir a la pantalla de Progreso.  
   - Mostrar:  
     - Días completados.  
     - Porcentaje de misiones completadas hoy.  

7. **Notificación**  
   - Mostrar (o simular) la **notificación diaria**.  
   - Explicar que cada día el usuario recibe un pequeño empujón motivacional para seguir con sus hábitos.  

Cierre hablado sugerido:  
> “En solo un minuto, Wellness Quest convierte pequeñas acciones en una experiencia emocional positiva. Misiones simples, una mascota que te acompaña y un progreso claro que motiva a volver cada día.”

---

## 🚀 Estrategia para la demo del hackathon

- **Priorizar fluidez sobre complejidad técnica.**  
- Asegurar que el flujo **Onboarding → Home → Completar misión → Alimentar mascota → Progreso** funcione sin errores.  
- Tener un estado de demo listo (por ejemplo, app preconfigurada en un dispositivo con un día casi completo).  

---

## 🎭 Tips para la Demo (¡IMPORTANTE!)

### Antes de presentar

**15 minutos antes de la demo:**
1. ✅ Abre el proyecto con `npm run start` (o `npx expo start --tunnel` si la red es problemática)
2. ✅ Escanea el QR con Expo Go y deja la app abierta
3. ✅ Mantén la app en primer plano para evitar recargas
4. ✅ Ten el navegador con `npm run web` listo como backup

**Preparación del estado:**
- Aplica datos demo para tener un estado ideal (ver atajos secretos abajo)
- O resetea completamente para mostrar onboarding desde cero
- Ten clara la historia: ¿usuario nuevo o usuario con progreso?

### Atajos secretos implementados

**🎭 Activar datos demo completos:**
- **Long press (2 segundos)** en el título "Wellness Quest" en Home
- Esto carga: 5 corazones, 150 monedas, 7 días de streak, 2/3 misiones completadas

**🪙 Añadir monedas para casino:**
- **Long press (3 segundos)** en el contador de monedas (🪙)
- Añade +1000 monedas instantáneamente para demostrar casino

**🗑️ Resetear todo (desde cualquier pantalla):**
```javascript
import StorageService from './src/services/StorageService';
await StorageService.clearAllData();
```

### Estado de features para mencionar

**✅ Completamente funcionales:**
- Onboarding (4 preguntas personalizadas)
- Generación inteligente de misiones basada en preferencias
- Economía doble (corazones + monedas)
- Mascota emocional (feliz/triste) con animaciones
- Progreso con días completados (streak)
- Casino con ruleta animada e inventario
- Persistencia completa con AsyncStorage

**⚠️ Simplificadas (mencionar honestamente):**
- **Notificaciones:** El sistema está implementado pero simplificado para la demo
  - Mencionar: "Las notificaciones están programadas para futuras iteraciones"
  - Mostrar el código del `NotificationService` si preguntan

### Plan B si algo falla

**Si Expo Go se cuelga:**
1. Usa `npm run web` → muestra en navegador
2. Explica: "Expo permite desarrollo multiplataforma, aquí está la versión web"

**Si la red falla:**
1. Cambia a modo Tunnel: `npx expo start --tunnel`
2. O usa hotspot de tu móvil como red compartida

**Si AsyncStorage da problemas:**
1. Abre Dev Menu (agita el dispositivo o `Cmd+D`/`Ctrl+M`)
2. Selecciona "Reload"
3. Si persiste: muestra el código y explica la arquitectura

### Discurso de cierre sugerido

> "Wellness Quest demuestra que la tecnología puede hacer el bienestar accesible y motivador. Con React Native y Expo, construimos una experiencia multiplataforma en 3 días que personaliza hábitos, gamifica el progreso y crea conexión emocional. El código está en GitHub, y el siguiente paso es incorporar integración con wearables y notificaciones inteligentes basadas en patrones de uso."

### Respuestas a preguntas frecuentes

**P: ¿Por qué React Native en vez de nativo?**
R: "Permite desarrollo rápido multiplataforma (iOS/Android/Web) con una sola codebase, ideal para MVPs y hackathons. Expo acelera aún más el desarrollo."

**P: ¿Cómo se personalizan las misiones?**
R: "El `MissionGenerator` usa un algoritmo que combina 4 parámetros del onboarding: objetivo de bienestar, disponibilidad, intensidad y estilo, generando misiones únicas cada día."

**P: ¿Qué pasa con los datos si cierro la app?**
R: "Todo se persiste localmente con AsyncStorage. El estado del juego, preferencias, inventario y progreso se guardan automáticamente y se restauran al reabrir."

**P: ¿Por qué una mascota emocional?**
R: "La investigación muestra que la conexión emocional aumenta la adherencia a hábitos. La mascota crea accountability sin presión, motivando de forma positiva."

---

## 🧘‍♂️ Mensaje final

> “Wellness Quest demuestra que pequeños hábitos pueden generar grandes cambios. Misiones simples, motivación emocional y bienestar accesible para todos.”