# Plan de Implementación: División de Templanza en 4 Niveles

## Propósito
El objetivo de este plan es dividir la virtud de la **Templanza** en 4 niveles jugables distintos (`Templanza1.jsx` a `Templanza4.jsx`). El archivo `Templanza.jsx` original se refactorizará para servir como el menú principal donde el usuario seleccionará qué nivel jugar.
Nos enfocaremos inicialmente en el Nivel 1 (Semáforo de Impulsos) y Nivel 2 (Castillo de Concentración).

## User Review Required
> [!IMPORTANT]
> El plan ha sido actualizado con tus respuestas. Si todo parece correcto, dame la orden para **comenzar a escribir el código** y crear los archivos.

## Proposed Changes

### Archivos de la Vertiente "Templanza"

#### [NEW] `src/components/Templanza1.jsx`
- Contendrá el código completo para el **"Semáforo de Impulsos"** (incluyendo el sistema de detección de *freeze*, game loop con hooks personalizados y canvas renderer).
- Se preparará para cargar y utilizar las imágenes sprite que vas a generar.

#### [NEW] `src/components/Templanza2.jsx`
- Contendrá el juego actual del "Castillo" contra los anuncios distractores.
- Se refactorizará para **sustituir el uso de emojis por imágenes de Pixel Art**, preparándolo para los nuevos assets visuales que crearás.

#### [MODIFY] `src/components/Templanza.jsx`
- Se refactorizará para convertirse en un **Menú Selector de Niveles**. 
- Mostrará una interfaz para elegir y navegar hacia `Templanza1`, `Templanza2`, `Templanza3` y `Templanza4`.

---

## 🎨 Prompts para IA de Imágenes (Pixel Art)

*(Copia y pega estos textos directamente en Midjourney, DALL-E 3, etc.)*

### 🚦 Nivel 1: Semáforo de Impulsos (Templanza1)
> **Estilo recomendado (Añadir al final de cada prompt):** `"16-bit pixel art style, crisp pixels, retro video game asset, isolated on white background"`

1. **Avatar del Niño (Spritesheet / Poses)**
   *Prompt:* `A 16-bit pixel art sprite sheet of a modern kid character. Needs multiple poses: standing idle breathing, walking with legs alternating in four directions, freezing in place with arms spread out balancing, falling down failing, jumping and celebrating. Crisp edges, clear retro pixel art style, solid white background.`
   *Prompt Aura Perfecta:* `16-bit pixel art glowing golden aura effect, holy bright glow, pixel perfect, transparent background style.`

2. **Semáforo**
   *Prompt:* `A 16-bit pixel art traffic light standing on a grey pole. Showing three distinct lights: red, yellow, green. Crisp pixel edges, top-down isometric retro video game style asset, solid white background.`

3. **Fondos y Escenarios**
   *Prompt Calles (Tiles)*: `32x32 pixel art seamless tile of a paved urban street and sidewalk, top-down view, retro style, seamless texture.`
   *Prompt Elementos de fondo*: `16-bit pixel art urban tree and city skyline buildings in the background, top-down view RPG style, solid white background.`

4. **UI y Efectos**
   *Prompt UI elements:* `16-bit pixel art UI icons: one glowing golden star, one red heart, one green leaf, and a dialogue bubble with a water wave inside signifying calmness. Crisp retro gaming UI.`

### 🏰 Nivel 2: Castillo de Concentración (Templanza2)
*(Estos assets reemplazarán a los emojis actuales del juego)*

> **Estilo recomendado (Añadir al final de cada prompt):** `"16-bit pixel art, medieval fantasy RPG style, clear pixel edges, isolated on white background"`

1. **Estructura del Castillo (Modular evolutiva)**
   *Prompt Base:* `16-bit pixel art stone medieval castle foundation, retro RPG town style, white background.`
   *Prompt Torres y Elementos:* `16-bit pixel art medieval castle components: a stone wall with small windows, a round tower with crenellations, a wooden door, and a red flag on a mast.`

2. **UI: Ventanas de Anuncios (Popups Distractores)**
   *Prompt:* `16-bit pixel art UI window resembling an annoying retro 90s computer popup error or advertisement window, bright warning yellow and red colors, retro OS style.`

3. **Escudos**
   *Prompt:* `Collection of three 16-bit pixel art medieval shields, different emblems like a wolf head, a tree of life, and a sword, bright colors, retro game icons.`

4. **Fondos Mágicos**
   *Prompt Cielo Nocturno:* `16-bit pixel art seamless night sky background, dark blue with twinkling magical pixel stars and a subtle nebula.`

---

## Verification Plan
1. Crear `Templanza1.jsx` pegando y adaptando el código del Semáforo de Impulsos.
2. Migrar el contenido de `Templanza.jsx` hacia `Templanza2.jsx` y refactorizarlo para que soporte cargar imágenes externas (`<img>` apuntando a la carpeta de assets) en vez de emojis.
3. Re-escribir `Templanza.jsx` con el nuevo código para la pantalla de menú de selección de los 4 niveles.
4. Asegurarse de que la aplicación y el React Router compilen bien con esta nueva división.
