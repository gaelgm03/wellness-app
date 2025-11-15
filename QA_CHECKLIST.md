# ✅ QA CHECKLIST - Wellness Quest MVP

**Branch:** `pruebas`  
**Fecha:** 14 Nov 2025  
**Objetivo:** Validar MVP completo antes de la demo del hackathon  
**Tiempo estimado:** 20 minutos

---

## 📋 INSTRUCCIONES

- [ ] App corriendo en Expo Go o web
- [ ] Comenzar con datos limpios (ver "Reset Completo" abajo)
- [ ] Marcar ✅ cuando funcione correctamente
- [ ] Marcar ❌ y anotar issue si falla
- [ ] Anotar tiempo que toma cada sección

---

## 🧪 SECCIÓN 1: Onboarding (3 min)

### Test 1.1: Primer inicio limpio
- [✅] ✅/❌ Al abrir la app, redirige automáticamente a `/onboarding`
- [✅] ✅/❌ Se muestra "Wellness Quest" en el header
- [✅] ✅/❌ Se muestra "Paso 1 de 4"
- [✅] ✅/❌ Los 4 puntos de progreso se muestran correctamente

**Issue #1.1:**

---

### Test 1.2: Pregunta 1 - Objetivo de bienestar
- [✅] ✅/❌ Se muestra "🎯 ¿Cuál es tu objetivo principal?"
- [✅] ✅/❌ Hay 3 opciones visibles: "Más energía", "Menos estrés", "Más movimiento"
- [✅] ✅/❌ Al tocar una opción, se marca visualmente (fondo/borde diferente)
- [✅] ✅/❌ Avanza automáticamente a la pregunta 2 después de 300ms

**Issue #1.2:**

---

### Test 1.3: Pregunta 2 - Disponibilidad diaria
- [✅] ✅/❌ Se muestra "⏰ ¿Cuánto tiempo tienes al día?"
- [✅] ✅/❌ Se muestra "Paso 2 de 4"
- [✅] ✅/❌ Hay 3 opciones: "5-15 min", "15-30 min", "30+ min"
- [✅] ✅/❌ Botón "← Atrás" aparece y funciona
- [✅] ✅/❌ Avanza automáticamente a la pregunta 3

**Issue #1.3:**
---

### Test 1.4: Pregunta 3 - Intensidad preferida
- [✅] ✅/❌ Se muestra "💪 ¿Qué intensidad prefieres?"
- [✅] ✅/❌ Se muestra "Paso 3 de 4"
- [✅] ✅/❌ Hay 3 opciones: "Suave", "Normal", "Activa"
- [✅] ✅/❌ Avanza automáticamente a la pregunta 4

**Issue #1.4:**

---

### Test 1.5: Pregunta 4 - Estilo de misión
- [✅] ✅/❌ Se muestra "🎨 ¿Qué estilo te atrae más?"
- [✅] ✅/❌ Se muestra "Paso 4 de 4"
- [✅] ✅/❌ Hay 3 opciones de estilo (Hay 4 opciones)
- [✅] ✅/❌ Al seleccionar, aparece alert "¡Perfecto! 🎉"
- [✅] ✅/❌ Al presionar "Comenzar", navega a la pantalla Home (tabs)

**Issue #1.5:** 

**✅ Log esperado en consola:**
```
✅ UserPreferences guardadas correctamente
✅ Estado de onboarding guardado: true
```

---

## 🏠 SECCIÓN 2: Pantalla Home - Primera carga (4 min)

### Test 2.1: Elementos visuales principales
- [✅] ✅/❌ Se muestra el título "Wellness Quest" en el header
- [-] ✅/❌ Se muestra la mascota (emoji 🐕 o similar)
- [✅] ✅/❌ Se muestra el contador de corazones (❤️ 0 inicialmente)
- [✅] ✅/❌ Se muestra el contador de monedas (🪙 500 - hack de testing)
- [-] ✅/❌ Botón "Alimentar mascota" visible
- [✅] ✅/❌ Botón "🎰 Casino" visible

**Issue #2.1:**
- Aparece mascota pero con fondo png
- El boton de alimenar esta apretado por el espaci
- El emoji casino no carga
- Esta otro emoji que no es el de corazon en el contador de corazones

---

### Test 2.2: Progreso inicial
- [✅] ✅/❌ Sección "Tu Progreso Hoy" visible
- [✅] ✅/❌ Muestra "0/3" misiones completadas
- [✅] ✅/❌ Muestra "0%" de progreso
- [✅] ✅/❌ Barra de progreso está vacía (0%)
- [✅] ✅/❌ Muestra "0 Consecutivos días"

**Issue #2.2:**
- No aparece la barra de progreso y esta todo apretado (mal distribuido)

---

### Test 2.3: Misiones generadas
- [✅] ✅/❌ Se muestran exactamente 3 misiones
- [✅] ✅/❌ Cada misión tiene título y descripción
- [✅] ✅/❌ Cada misión muestra duración (ej: "5 min")
- [✅] ✅/❌ Cada misión muestra categoría con emoji (⚡/🧘/🏃)
- [✅] ✅/❌ Cada misión muestra intensidad
- [❌] ✅/❌ Las misiones están relacionadas con las preferencias del onboarding
- [✅] ✅/❌ Cada misión tiene un botón "Completar"

**Issue #2.3:** 
- Creo elegi intensidad activa y salen intensidades suaves y normal. Elegi 30+min y las misiones son de 3, 5 y 2 min. No entiendo la relevancia de estilo de mision. Elegi movimiento y solo una mision es de movimiento. Yo supongo que tiene que ver por la colección limitada de misiones que hay o por sus etiquetas.

**✅ Log esperado en consola:**
```
✅ HomeScreen cargado - Corazones: 0
🪙 Monedas actuales: 500
🗓️ Días completados: 0
🎯 Misiones de hoy: [...]
```

---

## 🎯 SECCIÓN 3: Sistema de Misiones (3 min)

### Test 3.1: Completar primera misión
- [✅] ✅/❌ Al presionar "Completar" en una misión, cambia a "✅ Completada"
- [✅] ✅/❌ El botón cambia de estilo (verde/disabled)
- [✅] ✅/❌ Los corazones aumentan de 0 a 1 (❤️ 1)
- [✅] ✅/❌ Las monedas aumentan de 500 a 510 (🪙 510)
- [✅] ✅/❌ El progreso cambia a "1/3" y "33%"
- [✅] ✅/❌ La barra de progreso se llena al 33%
- [✅] ✅/❌ Aparece una animación o feedback visual

**Issue #3.1:** 

---

### Test 3.2: Completar segunda misión
- [✅] ✅/❌ Funciona igual que la primera misión
- [✅] ✅/❌ Corazones: ❤️ 2
- [✅] ✅/❌ Monedas: 🪙 520
- [✅] ✅/❌ Progreso: "2/3" y "66%"

**Issue #3.2:** 

---

### Test 3.3: Completar tercera misión (día completo)
- [✅] ✅/❌ Funciona igual que las anteriores
- [✅] ✅/❌ Corazones: ❤️ 3
- [✅] ✅/❌ Monedas: 🪙 530
- [✅] ✅/❌ Progreso: "3/3" y "100%"
- [✅] ✅/❌ Barra de progreso completamente llena
- [✅] ✅/❌ Todas las misiones muestran "✅ Completada"

**Issue #3.3:** 

**✅ Log esperado en consola (por cada misión):**
```
✅ GameState guardado correctamente
```

---

## 🐕 SECCIÓN 4: Mascota Emocional (3 min)

### Test 4.1: Estado inicial de la mascota
- [✅] ✅/❌ La mascota muestra emoji (🐕 o similar)
- [✅] ✅/❌ Debajo dice "Estado: Triste" (porque nunca la han alimentado)
- [✅] ✅/❌ El emoji puede estar diferente si está triste

**Issue #4.1:** 

---

### Test 4.2: Alimentar mascota (sin corazones)
- [✅] ✅/❌ Si tienes 0 corazones, al presionar "Alimentar mascota" aparece alert
- [✅] ✅/❌ Alert dice "Necesitas al menos 1 corazón"

**Issue #4.2:** 

---

### Test 4.3: Alimentar mascota (con corazones)
- [ ] ✅/❌ Completa al menos 1 misión para tener corazones
- [✅] ✅/❌ Al presionar "Alimentar mascota", los corazones disminuyen en 1
- [❌] ✅/❌ El estado de la mascota cambia de "Triste" a "Feliz"
- [✅] ✅/❌ El emoji de la mascota puede cambiar
- [✅] ✅/❌ Aparece feedback visual o animación

**Issue #4.3:** 
-Despues de alimentar el texto cambia a: "estoy esperando contigo...". No es adecuado
---

### Test 4.4: Alimentar múltiples veces
- [✅] ✅/❌ Puedes alimentar varias veces mientras tengas corazones
- [✅] ✅/❌ Los corazones se consumen correctamente (1 por vez)

**Issue #4.4:** 

---

## 🎰 SECCIÓN 5: Casino (3 min)

### Test 5.1: Acceder al casino
- [✅] ✅/❌ Al presionar botón "🎰 Casino" en Home, navega a pantalla de casino
- [✅] ✅/❌ Se muestra una ruleta visual
- [-] ✅/❌ Se muestra el contador de monedas actual
- [✅] ✅/❌ Se muestra un botón "Girar Ruleta" o similar
- [✅] ✅/❌ Se muestra el costo por giro (25 monedas)

**Issue #5.1:** 
- El header sale de la pantalla (el contador de monedas)
-

### Test 5.2: Girar la ruleta (con monedas)
- [❌] ✅/❌ Al presionar "Girar", las monedas disminuyen en 25
- [✅] ✅/❌ La ruleta gira con animación
- [✅] ✅/❌ Después de 2-3 segundos, se detiene
- [✅] ✅/❌ Aparece un mensaje mostrando el premio ganado (decoración)
- [✅] ✅/❌ El premio se añade al inventario

**Issue #5.2:** 
- No disminuyen las monedas
---

### Test 5.3: Girar sin monedas suficientes
- [✅] ✅/❌ Gasta todas tus monedas hasta tener menos de 25
- [✅] ✅/❌ Al intentar girar, aparece mensaje de error
- [✅] ✅/❌ Dice "No tienes suficientes monedas" o similar
- [✅] ✅/❌ La ruleta no gira

**Issue #5.3:**

---

### Test 5.4: Inventario de decoraciones
- [✅] ✅/❌ Se muestra una sección de "Inventario" o "Decoraciones"
- [✅] ✅/❌ Muestra las decoraciones que has ganado
- [✅] ✅/❌ Cada decoración tiene nombre e ícono

**Issue #5.4:**

---

### Test 5.5: Volver a Home
- [✅] ✅/❌ Hay un botón "Volver" o "← Atrás"
- [✅] ✅/❌ Al presionarlo, vuelve a la pantalla Home
- [✅] ✅/❌ El contador de monedas en Home refleja el gasto del casino

**Issue #5.5:** 

---

## 💾 SECCIÓN 6: Persistencia (2 min)

### Test 6.1: Cerrar y reabrir la app
- [✅] ✅/❌ Anota tus valores actuales: Corazones, Monedas, Días, Misiones completadas
- [✅] ✅/❌ Cierra completamente la app (no solo minimizar)
- [✅] ✅/❌ Reabre la app
- [✅] ✅/❌ NO muestra el onboarding (ya lo completaste)
- [✅] ✅/❌ Va directo a Home
- [✅] ✅/❌ Todos los valores se mantienen (corazones, monedas, días, progreso)
- [✅] ✅/❌ Las misiones completadas siguen marcadas como "✅ Completada"
- [✅] ✅/❌ Las misiones pendientes siguen pendientes
- [✅] ✅/❌ El estado de la mascota se mantiene

**Issue #6.1:**

**Valores antes de cerrar:**
- Corazones: ___
- Monedas: ___
- Días completados: ___
- Misiones completadas hoy: ___/3
- Estado mascota: ___

**Valores después de reabrir:**
- Corazones: ___
- Monedas: ___
- Días completados: ___
- Misiones completadas hoy: ___/3
- Estado mascota: ___

---

## 🎭 SECCIÓN 7: Atajos Secretos (2 min)

### Test 7.1: Long press en título (Datos demo)
- [✅] ✅/❌ Ve a la pantalla Home
- [✅] ✅/❌ Mantén presionado el título "Wellness Quest" por 2+ segundos
- [✅] ✅/❌ Aparece un alert o mensaje de confirmación
- [✅] ✅/❌ Los datos cambian a:
  - Corazones: 3
  - Monedas: 500
  - Días completados: 7
  - Misiones: 2/3 completadas (1 pendiente) ❌
- [✅] ✅/❌ La mascota está feliz

**Issue #7.1:** 

**✅ Log esperado en consola:**
```
🎭 DATOS DEMO APLICADOS EXITOSAMENTE
📊 Estado: {hearts: 3, coins: 500, days: 7, missions: 28, petMood: 'feliz'}
```

---

### Test 7.2: Long press en monedas
- [✅] ✅/❌ Mantén presionado el contador de monedas (🪙) por 3+ segundos
- [✅] ✅/❌ Las monedas aumentan en +1000
- [✅] ✅/❌ El contador se actualiza visualmente

**Issue #7.2:** 

**✅ Log esperado en consola:**
```
🪙 Monedas de testing aplicadas: [nuevo valor] ❌
```

---

## 🔄 SECCIÓN 8: Cambio de día (Avanzado - opcional)

### Test 8.1: Simulación de cambio de día
⚠️ **NOTA:** Este test requiere cambiar la fecha del sistema o esperar al día siguiente.

**Opción A: Esperar al día siguiente**
- [ ] ✅/❌ Completar al menos 1 misión hoy
- [ ] ✅/❌ Cerrar la app
- [ ] ✅/❌ Esperar hasta mañana
- [ ] ✅/❌ Abrir la app
- [ ] ✅/❌ Verificar que se generaron nuevas 3 misiones
- [ ] ✅/❌ Verificar que "Días completados" aumentó si completaste el día anterior

**Opción B: Modificar código temporalmente**
- [ ] ✅/❌ En `GameState.js`, modificar `checkAndResetDailyMissions()` para forzar cambio de día
- [ ] ✅/❌ Recargar la app
- [ ] ✅/❌ Verificar que se generan nuevas misiones

**Issue #8.1:** _[anotar si falla]_

---

## 🧹 SECCIÓN 9: Reset Completo (1 min)

### Test 9.1: Limpiar todos los datos
- [ ] ✅/❌ Abre el Dev Menu (agitar dispositivo o `Cmd+D`/`Ctrl+M`)
- [ ] ✅/❌ Selecciona "Reload"
- [ ] ✅/❌ O ejecuta código de reset desde consola/pantalla

**Código para reset (desde cualquier pantalla):**
```javascript
import StorageService from './src/services/StorageService';
await StorageService.clearAllData();
```

- [ ] ✅/❌ Al recargar/reabrir, vuelve al onboarding
- [ ] ✅/❌ Todos los valores vuelven a 0

**Issue #9.1:** _[anotar si falla]_

---

## 📱 SECCIÓN 10: Navegación y UX (2 min)

### Test 10.1: Navegación entre tabs
- [ ] ✅/❌ En la parte inferior hay tabs visibles
- [ ] ✅/❌ Al tocar cada tab, cambia de pantalla correctamente
- [ ] ✅/❌ La navegación es fluida, sin crashes

**Issue #10.1:** _[anotar si falla]_

---

### Test 10.2: Scroll y responsive
- [ ] ✅/❌ Toda la pantalla Home hace scroll correctamente
- [ ] ✅/❌ No hay elementos cortados o fuera de vista
- [ ] ✅/❌ Los botones son fáciles de presionar (área touch adecuada)

**Issue #10.2:** _[anotar si falla]_

---

### Test 10.3: Feedback visual
- [ ] ✅/❌ Al tocar botones, hay feedback visual (opacidad, color, etc.)
- [ ] ✅/❌ Los cambios de estado se reflejan inmediatamente
- [ ] ✅/❌ No hay delays perceptibles (< 300ms)

**Issue #10.3:** _[anotar si falla]_

---

## 🐛 RESUMEN DE ISSUES ENCONTRADOS

**Issues Críticos (bloquean demo):**
1. 
2. 
3. 

**Issues Medios (pueden afectar demo):**
1. 
2. 
3. 

**Issues Menores (nice to have):**
1. 
2. 
3. 

---

## ✅ VEREDICTO FINAL

**Estado del MVP:** ⬜ LISTO PARA DEMO / ⬜ NECESITA FIXES / ⬜ NO LISTO

**Confianza en demo (1-10):** ___/10

**Tiempo total de QA:** ___ minutos

**Siguiente acción recomendada:**
- [ ] Fixear issues críticos
- [ ] Practicar flujo de demo
- [ ] Preparar entorno de demo
- [ ] Todo listo, descansar antes de la presentación

---

## 🔄 COMANDOS ÚTILES PARA QA

### Reset completo desde código:
```javascript
import StorageService from './src/services/StorageService';
await StorageService.clearAllData();
// Luego recargar la app
```

### Ver todos los datos guardados (debug):
```javascript
import StorageService from './src/services/StorageService';
await StorageService.debugPrintAllData();
// Ver output en consola
```

### Aplicar datos demo desde código:
```javascript
import DemoData from './src/data/DemoData';
import StorageService from './src/services/StorageService';
await DemoData.applyDemoData(StorageService);
// Luego recargar la app
```

---

**Testeado por:** _______________  
**Fecha:** _______________  
**Dispositivo/Plataforma:** _______________
