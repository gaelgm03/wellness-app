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

3. **Economía simple**  
   - Completar misión = `+1` corazón.  
   - Alimentar mascota = `–1` corazón.  

4. **Mascota emocional**  
   - 2 estados: `feliz` y `triste`.  
   - Cambia de estado al alimentar o no alimentar.  

5. **Progreso básico**  
   - Días completados.  
   - Porcentaje de misiones completadas hoy.  

6. **Notificación diaria**  
   - Un recordatorio motivacional al día.  

7. **Persistencia local**  
   - Uso de **DataStore** o **Room** (definir uno como principal y el otro opcional si hay tiempo).  

---

## 🖥️ Stack Tecnológico

- **Plataforma:** Android.  
- **Lenguaje:** Kotlin.  
- **UI:** Jetpack Compose.  
- **Arquitectura:** MVVM.  
- **Persistencia local:** DataStore / Room.  
- **Herramientas de productividad:** Windsurf para acelerar desarrollo y refactors.  

---

## 🧱 Arquitectura de la App

### Capas principales

- **UI (Compose + ViewModels)**  
  - Pantallas y estados de UI.  
  - Observación de `StateFlow`/`LiveData` desde los ViewModels.  

- **Dominio (Casos de uso)**  
  - Lógica de generación de misiones.  
  - Lógica de economía (corazones, estados).  
  - Cálculo de progreso (días, porcentaje).  

- **Datos (Repositorios + DataStore/Room)**  
  - Persistencia de:  
    - Preferencias de onboarding.  
    - Misiones del día (estado pendiente/completada).  
    - Corazones y estado de mascota.  
    - Fechas de progreso.  

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

- **Detalle de misión (opcional)**  
  - Solo si el tiempo lo permite.  
  - Ver descripción ampliada de la misión y marcar como completada.  

- **Progreso**  
  - Días completados.  
  - Porcentaje de misiones completadas hoy.  
  - Representación simple (texto + barra/indicador).  

---

## 👥 Equipo y Responsabilidades

### Roles

- **Dev A — UI/Frontend**  
  - Pantallas en Compose.  
  - `Onboarding`, `Home`, `Progreso`.  
  - Estados visuales de la mascota (feliz/triste).  

- **Dev B — Lógica/Datos**  
  - Generación de misiones.  
  - Persistencia (DataStore/Room).  
  - Economía (corazones, estados).  
  - Notificación diaria.  
  - Casos de uso y repositorios.  

### Reparto sugerido por área

| Área                  | Responsable principal | Notas                                  |
|-----------------------|-----------------------|----------------------------------------|
| Onboarding UI         | Dev A                 | Integra con ViewModel de preferencias  |
| Home UI               | Dev A                 | Mascota + misiones + corazones         |
| Progreso UI           | Dev A                 | Reutiliza datos de casos de uso        |
| Generador de misiones | Dev B                 | Basado en preferencias de onboarding   |
| Persistencia          | Dev B                 | DataStore/Room                         |
| Economía              | Dev B                 | +1/-1 corazones                        |
| Notificación diaria   | Dev B                 | Implementación simple de recordatorio  |

---

## 📅 Plan de 3 días (alto nivel)

### Día 1 — Fundaciones

- **UI base: Onboarding + Home**  
  - Flujo completo de pantallas (aunque con datos mock).  

- **Persistencia inicial (DataStore)**  
  - Guardar resultado de onboarding.  

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
  - Completar misión = `+1` corazón.  
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
3. Se guardan preferencias en DataStore/Room.  
4. Se genera el set de **3 misiones diarias**.  
5. Se navega a **Home** con mascota + misiones.  

### Flujo 2: Completar una misión

1. Usuario ve misiones en Home.  
2. Marca una misión como **completada**.  
3. Se actualiza el estado de la misión (pendiente → completada).  
4. Se suma `+1` corazón.  
5. Se actualiza el **progreso del día**.  

### Flujo 3: Alimentar a la mascota

1. Usuario presiona acción “Alimentar mascota”.  
2. Se descuenta `–1` corazón (si hay al menos 1).  
3. La mascota pasa a estado **feliz**.  

### Flujo 4: Progreso

1. En la pantalla de **Progreso**, el usuario ve:  
   - Días completados (ej. streak o contador simple).  
   - Porcentaje de misiones completadas hoy.  

### Flujo 5: Notificación diaria

1. Una vez al día se dispara una **notificación motivacional**.  
2. El tap en la notificación lleva a Home.  

---

## 🧪 Alcance técnico mínimo por módulo

- **Onboarding**  
  - ViewModel con estado de preguntas.  
  - Persistencia de las respuestas.  

- **Misiones diarias**  
  - Modelo de misión (id, título, duración, estado).  
  - Lógica simple para 3 misiones/día.  

- **Economía**  
  - Variable persistida de cantidad de corazones.  
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

## 🧘‍♂️ Mensaje final

> “Wellness Quest demuestra que pequeños hábitos pueden generar grandes cambios. Misiones simples, motivación emocional y bienestar accesible para todos.”