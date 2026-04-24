import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import templanzaData from "../data/templanzaData";
import "../design/templanza.css";

import fondoCastilloImg from "../assets/templanza/fondocastillo.png";
import castilloSpritesImg from "../assets/templanza/castillo.png";
import anuncioDescansoImg from "../assets/templanza/anuncio_descanso.png";
import anuncioLadrillosImg from "../assets/templanza/anuncio_ladrillos.png";
import anuncioAmigosImg from "../assets/templanza/anuncio_amigos.png";
import anuncioSkinImg from "../assets/templanza/anuncio_skin.png";
import anuncioPremioImg from "../assets/templanza/anuncio_premio.png";
import anuncioVideoImg from "../assets/templanza/anuncio_video.png";
import anuncioRuletaImg from "../assets/templanza/anuncio_ruleta.png";

const ADS_IMAGES = {
  descanso: anuncioDescansoImg,
  ladrillos: anuncioLadrillosImg,
  chat: anuncioAmigosImg,
  skins: anuncioSkinImg,
  premio: anuncioPremioImg,
  video: anuncioVideoImg,
  ruleta: anuncioRuletaImg
};

/* ═══════════════ UTILIDADES ═══════════════ */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Un tramo de enfoque equivale a una ronda. Duración: 15 segundos.
const RONDAS = 6;
const METODO_DURACION_SEG = 15;

/* ═══════════════ COMPONENTE PRINCIPAL ═══════════════ */
export default function Templanza2() {
  const navigate = useNavigate();

  /* ── Estado de Fase ── */
  const [fase, setFase] = useState("seleccion");
  const [fadeOut, setFadeOut] = useState(false);

  /* ── Selección ── */
  const [paginaIntro, setPaginaIntro] = useState(0);

  /* ── Preparación ── */
  const [escudo, setEscudo] = useState(null);
  const [nombreCastillo, setNombreCastillo] = useState("");

  /* ── Estado del Juego de Enfoque ── */
  const [ronda, setRonda] = useState(0); // Tramos completados
  const [ladrillos, setLadrillos] = useState(0); // Puntos base
  
  // Stats para resultado final
  const [resistidas, setResistidas] = useState(0);
  const [cedidas, setCedidas] = useState(0);
  const [mejorRacha, setMejorRacha] = useState(0);
  const [rachaActual, setRachaActual] = useState(0);

  /* ── Estado de la Ronda Actual (Timer y Popups) ── */
  const [tiempoRestante, setTiempoRestante] = useState(METODO_DURACION_SEG);
  const [jugando, setJugando] = useState(false);
  const [popupsActivos, setPopupsActivos] = useState([]); // Array de anuncios en pantalla
  const [mensajeFb, setMensajeFb] = useState(null); // Feedback temporal (+1, -1)
  const [mostrarLevelUp, setMostrarLevelUp] = useState(false);

  // Refs para intervalos
  const timerRef = useRef(null);
  const popupRef = useRef(null);
  const nivelPrevioRef = useRef(1);
  const [anunciosPool, setAnunciosPool] = useState([]);

  /* ── Resultado ── */
  const [reflexion, setReflexion] = useState("");

  /* ═══════════ INICIALIZACIÓN ═══════════ */
  useEffect(() => {
    setAnunciosPool(shuffle(templanzaData.anuncios));
  }, []);

  /* ═══════════ ESTADO DERIVADO ═══════════ */
  const nivelCastillo = useMemo(() => {
    const niveles = templanzaData.nivelesCastillo;
    let nivel = niveles[0];
    for (const n of niveles) {
      if (ladrillos >= n.ladrillosMin) nivel = n;
    }
    return nivel;
  }, [ladrillos]);

  const porcentajeNivel = useMemo(() => {
    const niveles = templanzaData.nivelesCastillo;
    const idx = niveles.findIndex((n) => n.nivel === nivelCastillo.nivel);
    const sig = niveles[idx + 1];
    if (!sig) return 100;
    const rango = sig.ladrillosMin - nivelCastillo.ladrillosMin;
    const progreso = ladrillos - nivelCastillo.ladrillosMin;
    return Math.min(100, Math.round((progreso / rango) * 100));
  }, [ladrillos, nivelCastillo]);

  /* ═══════════ TRANSICIONES DE FASE ═══════════ */
  const cambiarFase = useCallback((nueva) => {
    setFadeOut(true);
    setTimeout(() => {
      setFase(nueva);
      setFadeOut(false);
    }, 500);
  }, []);

  /* ═══════════ MOTOR DEL JUEGO (TIMERS Y POPUPS) ═══════════ */
  const iniciarRonda = () => {
    setTiempoRestante(METODO_DURACION_SEG);
    setPopupsActivos([]);
    setJugando(true);
    nivelPrevioRef.current = nivelCastillo.nivel;
  };

  useEffect(() => {
    if (fase === "aventura" && jugando) {
      // 1. Timer de cuenta regresiva
      timerRef.current = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            resolverRondaExito();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 2. Generador aleatorio de popups (anuncios falsos)
      popupRef.current = setInterval(() => {
        // Probabilidad de que aparezca un anuncio nuevo cada segundo (ej: 40%)
        if (Math.random() < 0.4 && popupsActivos.length < 3) {
          crearPopup();
        }
      }, 1200);
    }

    return () => {
      clearInterval(timerRef.current);
      clearInterval(popupRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, jugando]);

  const crearPopup = () => {
    // Tomamos un anuncio aleatorio
    const anuncioBase = pick(anunciosPool.length > 0 ? anunciosPool : templanzaData.anuncios);
    
    // Posición aleatoria en pantalla (evitando bordes extremos)
    const top = Math.max(10, Math.floor(Math.random() * 60));
    const left = Math.max(5, Math.floor(Math.random() * 70));
    
    // Duración extendida entre 12s y 20s
    const duracionMs = 12000 + Math.floor(Math.random() * 8000);
    
    const nuevoPopup = {
      ...anuncioBase,
      instanciaId: Date.now() + Math.random(),
      style: { top: `${top}%`, left: `${left}%` },
      duracionMs
    };
    
    setPopupsActivos((prev) => [...prev, nuevoPopup]);

    // Auto-eliminar el popup después de unos segundos (simula que desaparece)
    setTimeout(() => {
      setPopupsActivos((prev) => prev.filter((p) => p.instanciaId !== nuevoPopup.instanciaId));
    }, duracionMs);
  };

  /* ═══════════ RESOLUCIÓN DE RONDAS O FALLOS ═══════════ */
  const mostrarFeedback = (tipo, mensaje, deltaLadrillos) => {
    setMensajeFb({ tipo, texto: mensaje, delta: deltaLadrillos });
    setTimeout(() => setMensajeFb(null), 2500);
  };

  const resolverRondaExito = () => {
    setJugando(false);
    setPopupsActivos([]);
    
    // El jugador aguantó todo el tiempo sin tocar Popups
    const ladrillosGanados = 3; // +3 por completar un tramo entero
    setLadrillos((l) => l + ladrillosGanados);
    setRonda((r) => r + 1);
    
    const nuevaRacha = rachaActual + 1;
    setRachaActual(nuevaRacha);
    if (nuevaRacha > mejorRacha) setMejorRacha(nuevaRacha);
    
    mostrarFeedback("ok", pick(templanzaData.mensajesResistencia), ladrillosGanados);

    evaluarFinJuegoOLevelUp();
  };

  // Cuando el usuario HACE CLIC en un anuncio (CEDE A LA TENTACIÓN)
  const handleTocarPopup = (id) => {
    // Quitar popups
    setPopupsActivos([]);
    
    // Penalización CRÍTICA: Game Over, volver a cero
    setLadrillos(0);
    setRonda(0);
    setCedidas((c) => c + 1);
    setRachaActual(0);
    nivelPrevioRef.current = 1;
    
    mostrarFeedback("ko", pick(templanzaData.mensajesCaida), -100);
  };

  const evaluarFinJuegoOLevelUp = () => {
    setTimeout(() => {
      // Revisar si subió de nivel
      if (nivelCastillo.nivel > nivelPrevioRef.current) {
        setMostrarLevelUp(true);
        setTimeout(() => {
          setMostrarLevelUp(false);
          avanzeGlobal();
        }, 2200);
      } else {
        avanzeGlobal();
      }
    }, 2500); // Esperar que termine el feedback
  };

  const avanzeGlobal = () => {
    if (ronda + 1 >= RONDAS) {
      guardarProgreso();
      setReflexion(pick(templanzaData.resultado.reflexiones));
      cambiarFase("resultado");
    } else {
      iniciarRonda(); // Iniciar siguiente tramo automáticamente o con botón (lo hacemos automático)
    }
  };

  // Resiste pasivamente: No hace nada mientras el timer corre (eso es bueno).

  /* ═══════════ PERSISTENCIA ═══════════ */
  const guardarProgreso = () => {
    try {
      const raw = localStorage.getItem("virtudes-completadas") || "[]";
      const completadas = JSON.parse(raw);
      if (!completadas.includes("templanza")) {
        completadas.push("templanza");
        localStorage.setItem("virtudes-completadas", JSON.stringify(completadas));
        window.dispatchEvent(new Event("storage"));
      }
    } catch (e) {
      console.error("Error guardando progreso:", e);
    }
  };

  const getTier = () => {
    if (ladrillos >= 18) return "legendario";
    if (ladrillos >= 14) return "alto";
    if (ladrillos >= 8)  return "medio";
    return "bajo";
  };

  const reiniciar = () => {
    setRonda(0);
    setLadrillos(0);
    setResistidas(0);
    setCedidas(0);
    setRachaActual(0);
    setMejorRacha(0);
    setPaginaIntro(0);
    setEscudo(null);
    setNombreCastillo("");
    setAnunciosPool(shuffle(templanzaData.anuncios));
    nivelPrevioRef.current = 1;
    cambiarFase("seleccion");
  };

  // Al iniciar la fase de aventura, arranca la primera ronda automáticamente
  useEffect(() => {
    if (fase === "aventura" && ronda === 0 && !jugando && !mensajeFb) {
      iniciarRonda();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase]);

  /* ╔══════════════════════════════════════════╗
     ║            RENDERS POR FASE             ║
     ╚══════════════════════════════════════════╝ */

  /* ── SELECCIÓN ── */
  const renderSeleccion = () => {
    const { introduccion } = templanzaData;
    const paginas = introduccion.historia;
    const esUltima = paginaIntro === paginas.length - 1;

    return (
      <div className={`tmp-fase tmp-seleccion ${fadeOut ? "tmp-fade-out" : "tmp-fade-in"}`}>
        <div className="tmp-seleccion-header">
          <div className="tmp-castillo-icono-grande">🏰</div>
          <h1 className="tmp-titulo-principal">{introduccion.titulo}</h1>
          <p className="tmp-subtitulo">La virtud de la Templanza</p>
        </div>

        <div className="tmp-historia-card">
          <div className="tmp-historia-contenido" key={paginaIntro}>
            <p>{paginas[paginaIntro]}</p>
          </div>

          <div className="tmp-historia-dots">
            {paginas.map((_, i) => (
              <span
                key={i}
                className={`tmp-dot ${i === paginaIntro ? "active" : ""} ${i < paginaIntro ? "visited" : ""}`}
                onClick={() => setPaginaIntro(i)}
              />
            ))}
          </div>

          <div className="tmp-historia-nav">
            {paginaIntro > 0 && (
              <button className="tmp-btn tmp-btn-sec" onClick={() => setPaginaIntro((p) => p - 1)}>
                ← Anterior
              </button>
            )}
            {!esUltima ? (
              <button className="tmp-btn tmp-btn-pri" onClick={() => setPaginaIntro((p) => p + 1)}>
                Siguiente →
              </button>
            ) : (
              <button className="tmp-btn tmp-btn-pri tmp-btn-comenzar" onClick={() => cambiarFase("preparacion")}>
                ⚔️ ¡Comenzar!
              </button>
            )}
          </div>
        </div>

        {esUltima && (
          <div className="tmp-personaje">
            <div className="tmp-personaje-avatar">{introduccion.personaje.avatar}</div>
            <div className="tmp-personaje-burbuja">
              <strong>{introduccion.personaje.nombre}</strong>
              <p>{introduccion.personaje.dialogo}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ── PREPARACIÓN ── */
  const renderPreparacion = () => {
    const { preparacion } = templanzaData;
    const listo = escudo && nombreCastillo.trim().length >= 2;

    return (
      <div className={`tmp-fase tmp-preparacion ${fadeOut ? "tmp-fade-out" : "tmp-fade-in"}`}>
        <h2 className="tmp-prep-titulo">⚒️ {preparacion.titulo}</h2>

        <div className="tmp-prep-seccion">
          <label className="tmp-prep-label">Nombra tu castillo:</label>
          <input
            type="text"
            className="tmp-input"
            value={nombreCastillo}
            onChange={(e) => setNombreCastillo(e.target.value)}
            placeholder="Ej: Castillo de la Voluntad"
            maxLength={30}
          />
        </div>

        <div className="tmp-prep-seccion">
          <label className="tmp-prep-label">Elige tu escudo:</label>
          <div className="tmp-escudos-grid">
            {preparacion.escudos.map((e) => (
              <button
                key={e.id}
                className={`tmp-escudo-btn ${escudo?.id === e.id ? "selected" : ""}`}
                onClick={() => setEscudo(e)}
              >
                <span className="tmp-escudo-emoji">{e.emoji}</span>
                <span className="tmp-escudo-nombre">{e.nombre}</span>
                <span className="tmp-escudo-lema">«{e.lema}»</span>
              </button>
            ))}
          </div>
        </div>

        <div className="tmp-prep-seccion">
          <label className="tmp-prep-label">📜 Cómo jugar:</label>
          <ul className="tmp-instrucciones">
            {preparacion.instrucciones.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        </div>

        <button
          className={`tmp-btn tmp-btn-construir ${listo ? "" : "disabled"}`}
          onClick={() => listo && cambiarFase("aventura")}
          disabled={!listo}
        >
          🏗️ ¡Comenzar Construcción!
        </button>
      </div>
    );
  };

  /* ── AVENTURA (NUEVA MECÁNICA DE POPUPS/TIMER) ── */
  const renderAventura = () => (
    <div 
      className={`tmp-fase tmp-aventura ${fadeOut ? "tmp-fade-out" : "tmp-fade-in"}`}
      style={{
        backgroundImage: `url(${fondoCastilloImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        padding: '1.5rem',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        boxSizing: 'border-box'
      }}
    >
      <div className="tmp-aventura-layout">
        {/* Zona del castillo */}
        <div className="tmp-aventura-castillo">
          <CastilloVisual
            nivel={nivelCastillo.nivel}
            ladrillos={ladrillos}
            escudo={escudo}
            nombre={nombreCastillo}
            nivelInfo={nivelCastillo}
            porcentaje={porcentajeNivel}
            compacto={false}
          />
        </div>

        {/* HUD Lateral */}
        <div className="tmp-hud-lateral">
          <div className="tmp-hud-item">
            <span className="tmp-hud-label">Tramo</span>
            <span className="tmp-hud-value">{Math.min(ronda + 1, RONDAS)}/{RONDAS}</span>
          </div>
          <div className="tmp-hud-item">
            <span className="tmp-hud-label">Ladrillos</span>
            <span className="tmp-hud-value">🧱 {ladrillos}</span>
          </div>
          <div className="tmp-hud-item">
            <span className="tmp-hud-label">Nivel</span>
            <span className="tmp-hud-value">{nivelCastillo.nombre}</span>
          </div>
          <div className="tmp-hud-item">
            <span className="tmp-hud-label">Atención</span>
            <span className="tmp-hud-value">🔥 {rachaActual}</span>
          </div>
        </div>
      </div>

      {/* Barra de progreso TRAMO ACTUAL (El Timer) ABAJO */}
      <div className="tmp-progreso-global tmp-progreso-abajo">
        <div className="tmp-progreso-barra">
          <div
            className="tmp-progreso-fill"
            style={{ 
              width: `${(1 - tiempoRestante / METODO_DURACION_SEG) * 100}%`,
              transition: "width 1s linear"
            }}
          />
        </div>
        <span className="tmp-progreso-texto">{jugando ? `${tiempoRestante}s` : "Pausa"}</span>
      </div>
      {/* Feedback Central */}
      {mensajeFb && (
        <div className={`tmp-feedback-flotante fb-${mensajeFb.tipo}`}>
          <div className="fb-icono">{mensajeFb.tipo === 'ok' ? '🛡️' : '💨'}</div>
          <div className="fb-texto">{mensajeFb.texto}</div>
          <div className="fb-delta">{mensajeFb.delta > 0 ? `+${mensajeFb.delta} 🧱` : `${mensajeFb.delta} 🧱`}</div>
        </div>
      )}

      {/* Popups (Los Anuncios / Tentaciones) */}
      {jugando && popupsActivos.map((popup) => (
        <div 
          key={popup.instanciaId} 
          className="tmp-ad-popup tmp-pop-in"
          style={popup.style}
        >
          <div className="tmp-ad-header">
            <span className="tmp-ad-alerta">ANUNCIO</span>
            <button className="tmp-ad-close" onClick={() => handleTocarPopup(popup.instanciaId)}>×</button>
          </div>
          <div className="tmp-ad-content" onClick={() => handleTocarPopup(popup.instanciaId)}>
            <img src={ADS_IMAGES[popup.key]} alt="Ad Emoji" className="tmp-ad-img" />
            <div className="tmp-ad-info">
              <strong>{popup.titulo}</strong>
              <p>{popup.texto}</p>
            </div>
          </div>
          <button className="tmp-ad-btn" onClick={() => handleTocarPopup(popup.instanciaId)}>
            {popup.boton}
          </button>
          {/* Barra de tiempo límite */}
          <div className="tmp-ad-progress-bg">
            <div 
              className="tmp-ad-progress-fill" 
              style={{ animation: `shrinkWidth ${popup.duracionMs}ms linear forwards` }} 
            />
          </div>
        </div>
      ))}

      {/* Level Up overlay */}
      {mostrarLevelUp && (
        <div className="tmp-levelup-overlay">
          <div className="tmp-levelup-card">
            <div className="tmp-levelup-emoji">{nivelCastillo.emoji}</div>
            <h3>¡NIVEL SUPERIOR!</h3>
            <p>{nivelCastillo.descripcion}</p>
            <p className="tmp-levelup-nombre">{nivelCastillo.nombre}</p>
          </div>
        </div>
      )}
    </div>
  );

  /* ── RESULTADO ── */
  const renderResultado = () => {
    const tier = getTier();
    const { resultado } = templanzaData;

    return (
      <div className={`tmp-fase tmp-resultado ${fadeOut ? "tmp-fade-out" : "tmp-fade-in"}`}>
        <div className="tmp-resultado-header">
          <h1 className="tmp-resultado-titulo">🏰 Construcción Completada</h1>
          <div className={`tmp-resultado-tier tmp-tier-${tier}`}>
            <span className="tmp-tier-emoji">{nivelCastillo.emoji}</span>
            <h2>{resultado.titulos[tier]}</h2>
          </div>
        </div>

        <div className="tmp-resultado-castillo">
          <CastilloVisual
            nivel={nivelCastillo.nivel}
            ladrillos={ladrillos}
            escudo={escudo}
            nombre={nombreCastillo}
            nivelInfo={nivelCastillo}
            porcentaje={100}
            compacto={false}
          />
        </div>

        <div className="tmp-resultado-stats">
          <div className="tmp-stat">
            <span className="tmp-stat-icono">🧱</span>
            <span className="tmp-stat-valor">{ladrillos}</span>
            <span className="tmp-stat-label">Ladrillos</span>
          </div>
          <div className="tmp-stat">
            <span className="tmp-stat-icono">⏱️</span>
            <span className="tmp-stat-valor">{RONDAS * METODO_DURACION_SEG}s</span>
            <span className="tmp-stat-label">Enfocado</span>
          </div>
          <div className="tmp-stat">
            <span className="tmp-stat-icono">❌</span>
            <span className="tmp-stat-valor">{cedidas}</span>
            <span className="tmp-stat-label">Distracciones</span>
          </div>
          <div className="tmp-stat">
            <span className="tmp-stat-icono">🔥</span>
            <span className="tmp-stat-valor">{mejorRacha}</span>
            <span className="tmp-stat-label">Mejor racha</span>
          </div>
        </div>

        <div className="tmp-resultado-mensaje">
          <p>{resultado.mensajesFinales[tier]}</p>
        </div>

        <div className="tmp-resultado-reflexion">
          <span className="tmp-reflexion-icono">💭</span>
          <p><em>{reflexion}</em></p>
        </div>

        <div className="tmp-resultado-botones">
          <button className="tmp-btn tmp-btn-pri" onClick={reiniciar}>
            🔄 Intentar de Nuevo
          </button>
          <button className="tmp-btn tmp-btn-sec" onClick={() => navigate("/")}>
            🏠 Volver al Menú
          </button>
        </div>
      </div>
    );
  };

  /* ╔══════════════════════════════════════════╗
     ║           RENDER PRINCIPAL              ║
     ╚══════════════════════════════════════════╝ */
  return (
    <div className="tmp-container">
      <div className="tmp-fondo-decorativo" />
      {fase === "seleccion"   && renderSeleccion()}
      {fase === "preparacion" && renderPreparacion()}
      {fase === "aventura"    && renderAventura()}
      {fase === "resultado"   && renderResultado()}
    </div>
  );
}

/* ╔══════════════════════════════════════════╗
   ║       COMPONENTE: CASTILLO VISUAL       ║
   ╚══════════════════════════════════════════╝ */
function CastilloVisual({ nivel, ladrillos, escudo, nombre, nivelInfo, porcentaje, compacto }) {
  // Mapeo del nivel (1 al 6) a la posición del sprite (3 columnas x 2 filas)
  const getSpritePosition = (lvl) => {
    switch(lvl) {
      case 1: return "0% 0%";
      case 2: return "50% 0%";
      case 3: return "100% 0%";
      case 4: return "0% 100%";
      case 5: return "50% 100%";
      case 6: return "100% 100%";
      default: return "0% 0%";
    }
  };

  return (
    <div className={`tmp-castillo-nuevo ${compacto ? "compacto" : "grande"}`}>
      <div className="tmp-castillo-fondo">
         <div 
           className="tmp-castillo-sprite"
           style={{ 
             backgroundImage: `url(${castilloSpritesImg})`,
             backgroundPosition: getSpritePosition(nivel)
           }}
         />
      </div>

      {/* Nombre del castillo */}
      {nombre && (
        <div className="tmp-castillo-nombre">
          <span className="tmp-nombre-escudo">{escudo?.emoji || "🏰"}</span>
          <span className="tmp-nombre-texto">{nombre}</span>
        </div>
      )}

      {/* Barra de progreso hacia el siguiente nivel */}
      {porcentaje < 100 && (
        <div className="tmp-nivel-progreso">
          <div className="tmp-nivel-barra">
            <div
              className="tmp-nivel-fill"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <span className="tmp-nivel-label">
            {nivelInfo?.nombre} · {porcentaje}%
          </span>
        </div>
      )}
    </div>
  );
}
