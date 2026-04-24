const templanzaData = {
  virtud: "Templanza",
  id: "templanza",
  titulo: "El Castillo del Autodominio",
  icono: "🏰",

  introduccion: {
    titulo: "El Castillo del Autodominio",
    historia: [
      "En las tierras del Reino de las Virtudes, existe una antigua tradición: cada joven debe construir su propio castillo, ladrillo a ladrillo, como símbolo de su fortaleza interior.",
      "Pero construir un castillo no es solo cuestión de fuerza… Es cuestión de TEMPLANZA: la virtud del autodominio, de saber decir «no» a las distracciones y «sí» al esfuerzo constante.",
      "Muchos han intentado levantar su fortaleza, pero las tentaciones del camino los desviaron. Sus castillos quedaron a medias, olvidados entre la hierba.",
      "Hoy es tu turno. El Maestro Constructor Aurelio te espera. ¿Podrás resistir las tentaciones y construir el castillo más imponente del reino?"
    ],
    personaje: {
      nombre: "Maestro Constructor Aurelio",
      avatar: "👷",
      dialogo:
        "Bienvenido, joven constructor. Recuerda: la templanza es el cimiento invisible de toda gran obra. Cada ladrillo que coloques representará una pequeña victoria sobre ti mismo. ¡Manos a la obra!"
    }
  },

  preparacion: {
    titulo: "Prepara tu Construcción",
    escudos: [
      { id: "leon",     emoji: "🦁", nombre: "León Dorado",       lema: "Fuerza con mesura" },
      { id: "aguila",   emoji: "🦅", nombre: "Águila Serena",      lema: "Visión y paciencia" },
      { id: "roble",    emoji: "🌳", nombre: "Roble Firme",        lema: "Raíces profundas" },
      { id: "estrella", emoji: "⭐", nombre: "Estrella Constante", lema: "Luz que no titila" }
    ],
    instrucciones: [
      "La construcción requiere TRAMOS DE ENFOQUE ininterrumpido ⏳",
      "Espera con paciencia hasta que la barra se llene para ganar 1 ladrillo 🧱",
      "¡CUIDADO! Aparecerán ANUNCIOS ENGAÑOSOS en tu pantalla ⚡",
      "Tu objetivo: ¡NO TOCARLOS! Ignóralos por completo.",
      "Si tocas un anuncio → cedes a la tentación y pierdes 1 ladrillo 💨",
      "Si resistes todo el tiempo → tu fortaleza crecerá fuerte ✨"
    ]
  },

  nivelesCastillo: [
    { nivel: 1, nombre: "Cimientos",  ladrillosMin: 0,  emoji: "🏗️", descripcion: "Los primeros cimientos emergen de la tierra" },
    { nivel: 2, nombre: "Cabaña",     ladrillosMin: 4,  emoji: "🏠", descripcion: "Una humilde cabaña toma forma" },
    { nivel: 3, nombre: "Casa",       ladrillosMin: 8,  emoji: "🏡", descripcion: "Una casa sólida con jardín" },
    { nivel: 4, nombre: "Torre",      ladrillosMin: 12, emoji: "🗼", descripcion: "Una torre vigía se alza al cielo" },
    { nivel: 5, nombre: "Castillo",   ladrillosMin: 16, emoji: "🏰", descripcion: "¡Un castillo magnífico!" },
    { nivel: 6, nombre: "Fortaleza",  ladrillosMin: 18, emoji: "🏯", descripcion: "¡Una fortaleza legendaria e inexpugnable!" }
  ],

  anuncios: [
    { id: 1, key: "descanso", titulo: "¡Un Respiro!", texto: "Tómate un descanso y recupera tus energías.", boton: "💤 Dormir" },
    { id: 2, key: "ladrillos", titulo: "¡Oferta Especial!", texto: "Gana 10 ladrillos extra al instante.", boton: "🧱 Reclamar" },
    { id: 3, key: "chat", titulo: "¡Chat de Amigos!", texto: "Tus amigos te están esperando.", boton: "💬 Abrir" },
    { id: 4, key: "skins", titulo: "¡Nuevas Skins!", texto: "Personaliza tu constructor ahora.", boton: "🧥 Equipar" },
    { id: 5, key: "premio", titulo: "¡Premio Diario!", texto: "Haz clic para recoger tus gemas.", boton: "💎 Recoger" },
    { id: 6, key: "video", titulo: "¡Video Viral!", texto: "No creerás lo que hizo el Rey...", boton: "▶️ Ver" },
    { id: 7, key: "ruleta", titulo: "¡Ruleta Suerte!", texto: "Gira la ruleta y gana materiales gratis.", boton: "🎡 Girar" }
  ],

  mensajesResistencia: [
    "¡Increíble! Tu atención es inquebrantable 💪",
    "¡Así se hace! Ignoraste el ruido 🏆",
    "¡La tentación no pudo contigo! 🛡️",
    "¡Paciencia de acero! Tu castillo se fortalece ✨",
    "¡Esa es la templanza en acción! ⚔️"
  ],

  mensajesCaida: [
    "¡La tentación derribó tu progreso! A empezar de nuevo.",
    "Todo esfuerzo se desmoronó por una distracción. ¡Vuelve a intentarlo!",
    "El atajo te costó el castillo entero. ¡Paciencia la próxima vez!",
    "No cedas al impulso. ¡Tus verdaderos cimientos son de voluntad!"
  ],

  resultado: {
    titulos: {
      bajo:       "Aprendiz de Constructor",
      medio:      "Constructor Prometedor",
      alto:       "Maestro Constructor",
      legendario: "Arquitecto Legendario"
    },
    mensajesFinales: {
      bajo:       "Tu castillo es pequeño, pero cada gran fortaleza comenzó con un solo ladrillo. La templanza se practica día a día. ¡No te rindas!",
      medio:      "Has construido algo sólido. Resististe varias tentaciones y tu castillo lo demuestra. ¡Sigue cultivando tu autodominio!",
      alto:       "¡Impresionante! Tu castillo es una maravilla del reino. Tu autodominio ha dado frutos magníficos. ¡Eres ejemplo de templanza!",
      legendario: "¡LEGENDARIO! Tu fortaleza es inexpugnable, igual que tu voluntad. Has demostrado que la templanza es la base de toda grandeza. ¡El reino entero te aclama!"
    },
    reflexiones: [
      "La templanza no es privarse de todo, sino disfrutar con medida.",
      "Cada vez que dices «no» a una tentación, dices «sí» a algo mejor.",
      "El autodominio es la libertad más grande: ser dueño de ti mismo.",
      "Los castillos más fuertes se construyen ladrillo a ladrillo, con paciencia.",
      "La persona templada no es la que no siente deseos, sino la que los gobierna.",
      "Pequeñas victorias diarias construyen grandes fortalezas de carácter."
    ]
  }
};

export default templanzaData;
