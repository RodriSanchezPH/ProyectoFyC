# 🔥 El Viaje Ardiente (FEYC)

**Proyecto interactivo sobre el camino hacia la felicidad a través de las virtudes.**

---

## 📖 Sobre el Proyecto

El Viaje Ardiente es una experiencia web interactiva que combina:

- 🗺️ **Mapa Interactivo de Virtudes**: Explora territorios que representan virtudes y supera minijuegos formativos.
- 🚦 **Desafíos de Virtud**: Supera pruebas prácticas (como el Semáforo de Impulsos o el Castillo de la Templanza) para dominar cada paso del camino.
- ⚔️ **Galería de Héroes Ardientes**: Descubre personas inspiradoras con tarjetas interactivas.

---

## 🚀 Tecnologías

### Frontend (React)
- React 18 con Vite
- React Router DOM
- CSS3 puro, utilidades de diseño y Canvas 2D
- Diseño responsive y mecánicas de interactividad

---

## 🤖 Inteligencia Artificial en el Desarrollo

Este proyecto ha sido desarrollado con la colaboración y asistencia de múltiples herramientas de Inteligencia Artificial de vanguardia:

- **Antigravity (Google Gemini)**: Asistente principal para la arquitectura, programación lógica, diseño de componentes React y CSS.
- **Claude Code**: Utilizado para flujos conversacionales enfocados en código, creación de planes de implementación y manejo de estructura.
- **Arena AI**: Empleado para realizar consultas rápidas en internet, validaciones y resolución de problemas durante el desarrollo.
- **Flow by Google Labs**: Motor de inteligencia artificial utilizado para generar los *assets* visuales (Pixel Art, fondos, sprites de avatares y elementos UI) que dan vida al proyecto.

---

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ y npm

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/FEYC.git
cd feyc
```

### 2. Instalar y Ejecutar
Desde la raíz del proyecto, ejecuta:
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo local
npm run dev
```

Tu aplicación estará disponible en: `http://localhost:5173`

---

## 📂 Estructura del Proyecto
```text
FEYC/
├── src/                        # Código fuente React
│   ├── components/             # Componentes, minijuegos y vistas
│   ├── data/                   # Información y configuración (JSON/JS)
│   ├── assets/                 # Imágenes, sprites generados y audios
│   ├── design/                 # Estilos CSS
│   ├── App.jsx                 # Entrada y ruteador principal
│   └── main.jsx                # Punto de anclaje de React
├── public/                     # Archivos estáticos base
├── index.html                  # Plantilla HTML
├── package.json                # Configuración del paquete y dependencias
├── vite.config.js              # Configuración del bundler
└── README.md                   # Este archivo
```

---

## 🎨 Características Destacadas

- ✨ **Videojuegos web incorporados**: Implementaciones desde cero de minijuegos usando Canvas API de HTML5 y Game Loops optimizados dentro de React.
- 🎯 **Arte Retro Generativo**: Utilización de *assets* visuales de estilo retro generados con IA para crear un ambiente lúdico.
- 🔄 **Progresiones Locales**: El avance del jugador se almacena de forma persistente a nivel de navegador utilizando `localStorage`.
- 🎭 **Animaciones CSS Complejas**: Transiciones de fases, fade in/out suaves y *keyframes* elaborados para pulido visual.

---

## 🌐 Deploy en Producción

Dada su arquitectura 100% frontend (sin un servidor backend requerido), desplegar el proyecto es sumamente rápido. 

### Deploy Automático con Vercel o Netlify
1. Crea una cuenta gratuita en Vercel o Netlify.
2. Vincula tu repositorio de GitHub.
3. El motor detectará automáticamente que es un proyecto **Vite**.
4. Haz clic en "Deploy". Se construirán los archivos estáticos listos para producción y tendrás un enlace global al instante.

### Build manual
Si prefieres hostearlo por tu cuenta:
```bash
npm run build
```
Obtendrás una carpeta `/dist` lista para cualquier servidor web (Apache, Nginx, GitHub Pages, Firebase Hosting, etc.).

---

## 🤝 Contribuciones

¿Quieres contribuir? ¡Genial!

1. Haz un Fork al proyecto
2. Crea tu propia rama (`git checkout -b feature/NuevaCaracteristica`)
3. Haz un commit detallando tus mejoras (`git commit -m 'feat: Agregar minijuego de justicia'`)
4. Sube los cambios a tu rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto se distribuye bajo la Licencia MIT. Consulta el archivo `LICENSE` (si existe) para más información.

---

## 👤 Autor

**Tu Nombre**
- GitHub: [Francisco235711](https://github.com/Francisco235711)

---

## 📊 Estado del Proyecto

![En Desarrollo](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)
![Desarrollado con IA](https://img.shields.io/badge/AI%20Assisted-Google_Gemini-orange?logo=google)