import React, { useState, useEffect, useRef, useCallback } from 'react';
import ninoSprites from "../assets/templanza/niño_sprites.png";
import cieloImg from "../assets/templanza/cielo.png";
import ciudadImg from "../assets/templanza/ciudad.png";
import semaforoImg from "../assets/templanza/semáforo.png";
import icono1Img from "../assets/templanza/icono1.png";
import icono2Img from "../assets/templanza/icono2.png";
import icono3Img from "../assets/templanza/icono3.png";
import icono4Img from "../assets/templanza/icono4.png";

// ============================================
// CONSTANTES DE CONFIGURACIÓN
// ============================================
const CONFIG = {
  CANVAS_WIDTH: 1000,
  CANVAS_HEIGHT: 600,
  TILE_SIZE: 32,
  PLAYER_SPEED: 1.5,
  FPS: 60,

  // Tiempos de semáforo
  VERDE_MIN: 2000,
  VERDE_MAX: 4000,
  AMARILLO_DURATION: 1000,
  ROJO_MIN: 1500,
  ROJO_MAX: 2500,

  // Detección de freeze
  PERFECT_WINDOW: 300,

  // Pixel Art
  SPRITE_SIZE: 32, // Tamaño base del frame en la cuadrícula
  RENDER_SIZE: 160, // Aumentado aún más
};

// ============================================
// ESTADOS
// ============================================
const LIGHT_STATES = { VERDE: 'verde', AMARILLO: 'amarillo', ROJO: 'rojo' };
const PLAYER_STATES = {
  IDLE: 'idle',
  WALKING: 'walking',
  FROZEN: 'frozen',
  PERFECT_FREEZE: 'perfect_freeze',
  FAILING: 'failing',
  CELEBRATING: 'celebrating',
};

// ============================================
// HOOKS AUXILIARES
// ============================================
const useGameLoop = (callback) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const animate = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      callback(time - previousTimeRef.current);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);
};

const useKeyboard = () => {
  const keys = useRef({});
  useEffect(() => {
    const handleDown = (e) => {
      if (e.key === ' ' || e.code === 'Space') {
        keys.current[' '] = true;
        e.preventDefault();
      }
    };
    const handleUp = (e) => {
      if (e.key === ' ' || e.code === 'Space') {
        keys.current[' '] = false;
      }
    };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => { window.removeEventListener('keydown', handleDown); window.removeEventListener('keyup', handleUp); };
  }, []);
  return keys;
};

const useTrafficLight = () => {
  const [lightState, setLightState] = useState(LIGHT_STATES.VERDE);
  const timerRef = useRef();
  const startTimeRef = useRef(Date.now());

  const scheduleNext = useCallback((currentState) => {
    clearTimeout(timerRef.current);

    // Aumentar dificultad con el tiempo: Cada 10s es más rápido (hasta un 40% del tiempo original)
    const elapsed = Date.now() - startTimeRef.current;
    const multiplier = Math.max(0.4, 1 - (elapsed / 120000)); // Alcanza 0.4 a los 2 minutos max

    let duration = 0;
    if (currentState === LIGHT_STATES.VERDE) {
      duration = (Math.floor(Math.random() * (CONFIG.VERDE_MAX - CONFIG.VERDE_MIN)) + CONFIG.VERDE_MIN) * multiplier;
    } else if (currentState === LIGHT_STATES.AMARILLO) {
      duration = CONFIG.AMARILLO_DURATION;
    } else {
      duration = (Math.floor(Math.random() * (CONFIG.ROJO_MAX - CONFIG.ROJO_MIN)) + CONFIG.ROJO_MIN) * multiplier;
    }

    timerRef.current = setTimeout(() => {
      const next = currentState === LIGHT_STATES.VERDE ? LIGHT_STATES.AMARILLO : currentState === LIGHT_STATES.AMARILLO ? LIGHT_STATES.ROJO : LIGHT_STATES.VERDE;
      setLightState(next);
      scheduleNext(next);
    }, duration);
  }, []);
  useEffect(() => { scheduleNext(LIGHT_STATES.VERDE); return () => clearTimeout(timerRef.current); }, [scheduleNext]);
  return { lightState };
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const Templanza1 = () => {
  const canvasRef = useRef(null);

  // Referencias a las imágenes
  const spritesRef = useRef(null);
  const cieloRef = useRef(null);
  const ciudadRef = useRef(null);
  const semaforoRef = useRef(null);

  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const keys = useKeyboard();
  const { lightState } = useTrafficLight();

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [perfectCount, setPerfectCount] = useState(0);
  const [gamePhase, setGamePhase] = useState('playing');
  const [message, setMessage] = useState('');

  const playerRef = useRef({
    x: 50, y: 420,
    state: PLAYER_STATES.IDLE,
    direction: 'right',
    animFrame: 0,
    animTimer: 0,
    wasMoving: false,
    hasWon: false
  });

  const freezeDetect = useRef({ redStartTime: null, frozeAtTime: null, hasFrozen: false, movedInRed: false });
  const lightRef = useRef(lightState);

  // Carga de todos los assets
  useEffect(() => {
    let imagesLoaded = 0;
    const totalImages = 4;

    const checkLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        setAssetsLoaded(true);
      }
    };

    const imgSprites = new Image();
    imgSprites.src = ninoSprites;
    imgSprites.onload = () => { spritesRef.current = imgSprites; checkLoad(); };

    const imgCielo = new Image();
    imgCielo.src = cieloImg;
    imgCielo.onload = () => { cieloRef.current = imgCielo; checkLoad(); };

    const imgCiudad = new Image();
    imgCiudad.src = ciudadImg;
    imgCiudad.onload = () => { ciudadRef.current = imgCiudad; checkLoad(); };

    const imgSemaforo = new Image();
    imgSemaforo.src = semaforoImg;
    imgSemaforo.onload = () => { semaforoRef.current = imgSemaforo; checkLoad(); };
  }, []);

  useEffect(() => {
    lightRef.current = lightState;
    if (lightState === LIGHT_STATES.ROJO) {
      const isMovingNow = keys.current[' '] || keys.current['Button'];
      freezeDetect.current = {
        redStartTime: Date.now(),
        frozeAtTime: isMovingNow ? null : Date.now(),
        hasFrozen: !isMovingNow,
        movedInRed: false
      };
    }
    if (lightState === LIGHT_STATES.VERDE) evaluateFreeze();
  }, [lightState]);

  const evaluateFreeze = () => {
    const { redStartTime, frozeAtTime, hasFrozen, movedInRed } = freezeDetect.current;
    if (!redStartTime) return;
    const reactionTime = frozeAtTime - redStartTime;
    if (movedInRed || !hasFrozen) handleFail('¡Te moviste en rojo! 🔴');
    else if (reactionTime <= CONFIG.PERFECT_WINDOW) handlePerfect(reactionTime);
    else handleGood();
  };

  const handlePerfect = (time) => {
    setPerfectCount(p => p + 1); setScore(s => s + 100);
    setMessage(`⭐ ¡PERFECTO! ${time}ms`);
    playerRef.current.state = PLAYER_STATES.PERFECT_FREEZE;
    setTimeout(() => setMessage(''), 1500);
  };

  const handleGood = () => {
    setScore(s => s + 50); setMessage('✅ ¡Bien!');
    setTimeout(() => setMessage(''), 1000);
  };

  const handleFail = (msg) => {
    setLives(l => { if (l - 1 <= 0) setGamePhase('gameover'); return l - 1; });
    setMessage(msg); playerRef.current.state = PLAYER_STATES.FAILING;
    setTimeout(() => { setMessage(''); playerRef.current.state = PLAYER_STATES.IDLE; }, 1000);
  };

  useGameLoop(useCallback((dt) => {
    if (gamePhase !== 'playing' || !assetsLoaded) return;
    const p = playerRef.current;
    const light = lightRef.current;
    const moving = (keys.current[' '] || keys.current['Button']);

    if (light === LIGHT_STATES.VERDE && p.state !== PLAYER_STATES.FAILING && !p.hasWon) {
      if (moving) {
        p.x += CONFIG.PLAYER_SPEED;
        p.direction = 'right';
      }
    }

    if (light === LIGHT_STATES.ROJO) {
      if (moving) {
        if (Date.now() - freezeDetect.current.redStartTime > CONFIG.PERFECT_WINDOW) {
          freezeDetect.current.movedInRed = true;
        }
      } else if (!freezeDetect.current.hasFrozen && !freezeDetect.current.movedInRed) {
        freezeDetect.current.frozeAtTime = Date.now();
        freezeDetect.current.hasFrozen = true;
      }
    } else if (light === LIGHT_STATES.AMARILLO) {
      if (!moving && p.wasMoving && !freezeDetect.current.hasFrozen) {
        freezeDetect.current.frozeAtTime = Date.now();
        freezeDetect.current.hasFrozen = true;
      }
    }

    if (p.state !== PLAYER_STATES.FAILING && !p.hasWon) {
      if (moving) {
        p.state = PLAYER_STATES.WALKING;
      } else {
        if (p.state !== PLAYER_STATES.PERFECT_FREEZE || light !== LIGHT_STATES.ROJO) {
          p.state = light === LIGHT_STATES.ROJO ? PLAYER_STATES.FROZEN : PLAYER_STATES.IDLE;
        }
      }
    }

    p.wasMoving = moving;
    p.animTimer += dt;
    if (p.animTimer > 150) { p.animFrame = (p.animFrame + 1) % 4; p.animTimer = 0; }

    if (p.x > CONFIG.CANVAS_WIDTH - 120 && !p.hasWon) {
      p.hasWon = true;
      p.state = PLAYER_STATES.CELEBRATING;
      setTimeout(() => setGamePhase('win'), 0);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // 1. Dibujar Cielo
    if (cieloRef.current) {
      ctx.drawImage(cieloRef.current, 0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    } else {
      ctx.fillStyle = light === 'verde' ? '#87CEEB' : light === 'amarillo' ? '#FFE87A' : '#FFB3B3';
      ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    }

    // Filtro de color para el ambiente según semáforo
    if (light === 'amarillo') {
      ctx.fillStyle = 'rgba(255, 204, 0, 0.2)';
      ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    } else if (light === 'rojo') {
      ctx.fillStyle = 'rgba(255, 68, 68, 0.2)';
      ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    }

    // 2. Dibujar Ciudad (Fondo)
    if (ciudadRef.current) {
      ctx.drawImage(ciudadRef.current, 0, 200, CONFIG.CANVAS_WIDTH, 300);
    }

    // 3. Suelo / Calle
    ctx.fillStyle = '#7EC8A0'; ctx.fillRect(0, 500, CONFIG.CANVAS_WIDTH, 100);

    // 4. Semáforo
    if (semaforoRef.current) {
      const sWidth = Math.floor(semaforoRef.current.width / 3);
      const sHeight = semaforoRef.current.height;

      let spriteX = 0;
      if (light === 'rojo') spriteX = 0;
      if (light === 'amarillo') spriteX = sWidth;
      if (light === 'verde') spriteX = sWidth * 2;

      ctx.drawImage(
        semaforoRef.current,
        spriteX, 0, sWidth, sHeight,
        850, 70, 90, 200 // Semáforo más grande a la derecha
      );
    } else {
      // Semáforo fallback
      ctx.fillStyle = '#222'; ctx.fillRect(540, 40, 50, 120);
      const colors = { verde: '#44FF44', amarillo: '#FFCC00', rojo: '#FF4444' };
      ['rojo', 'amarillo', 'verde'].forEach((c, i) => {
        ctx.fillStyle = light === c ? colors[c] : '#444';
        ctx.beginPath(); ctx.arc(565, 65 + i * 35, 12, 0, Math.PI * 2); ctx.fill();
      });
    }

    // 5. Dibujar Jugador
    if (spritesRef.current) {
      const sw = spritesRef.current.width / 4;
      const sh = spritesRef.current.height / 2;

      let col = 0, row = 0;
      switch (p.state) {
        case PLAYER_STATES.WALKING: col = (p.animFrame % 3) + 1; row = 0; break;
        case PLAYER_STATES.FROZEN:
        case PLAYER_STATES.PERFECT_FREEZE: col = 0; row = 1; break;
        case PLAYER_STATES.FAILING: col = 1; row = 1; break;
        case PLAYER_STATES.CELEBRATING: col = 2; row = 1; break;
        default: col = 0; row = 0; // IDLE
      }

      ctx.save();
      const drawX = p.x - CONFIG.RENDER_SIZE / 2;
      const drawY = p.y - CONFIG.RENDER_SIZE / 2;

      if (p.direction === 'left') {
        ctx.translate(p.x, 0); ctx.scale(-1, 1); ctx.translate(-p.x, 0);
      }

      ctx.drawImage(
        spritesRef.current,
        col * sw, row * sh,
        sw, sh,
        drawX, drawY,
        CONFIG.RENDER_SIZE, CONFIG.RENDER_SIZE
      );
      ctx.restore();
    }
  }, [gamePhase, assetsLoaded]));

  return (
    <div style={styles.wrapper}>
      {/* Botón de salir y barra lateral izquierda */}
      <div style={styles.sidebar}>
        <button style={styles.exitBtn} onClick={() => window.location.href = '/'}>
          ← Salir
        </button>
        <div style={styles.hudSide}>
          <div style={styles.hudBox}>
            <span style={styles.hudLabel}>VIDAS (LIFE)</span>
            <div style={styles.iconsRow}>
              {Array.from({ length: lives }).map((_, i) => (
                <div key={i} style={{ ...styles.iconBadge, backgroundImage: `url(${icono2Img})` }} /> // life
              ))}
            </div>
          </div>
          <div style={styles.hudBox}>
            <span style={styles.hudLabel}>PUNTAJE (BONUS)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ ...styles.iconBadge, backgroundImage: `url(${icono1Img})` }} />
              <span style={styles.hudValue}>{score}</span>
            </div>
          </div>
          <div style={styles.hudBox}>
            <span style={styles.hudLabel}>PERFECTOS (NATURE)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ ...styles.iconBadge, backgroundImage: `url(${icono3Img})` }} />
              <span style={styles.hudValue}>{perfectCount}</span>
            </div>
          </div>
          <div style={styles.hudBox}>
            <span style={styles.hudLabel}>BINGO (CAL)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ ...styles.iconBadge, backgroundImage: `url(${icono4Img})` }} />
              <span style={styles.hudValue}>{Math.floor(score / 1000)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor del Canvas Principal */}
      <div style={styles.canvasContainer}>
        <canvas ref={canvasRef} width={CONFIG.CANVAS_WIDTH} height={CONFIG.CANVAS_HEIGHT} style={styles.canvas} />

        {/* BOTÓN MÓVIL / PANTALLA */}
        {gamePhase === 'playing' && (
          <button
            style={styles.actionBtn}
            onMouseDown={() => { keys.current['Button'] = true; }}
            onMouseUp={() => { keys.current['Button'] = false; }}
            onMouseLeave={() => { keys.current['Button'] = false; }}
            onTouchStart={(e) => { e.preventDefault(); keys.current['Button'] = true; }}
            onTouchEnd={(e) => { e.preventDefault(); keys.current['Button'] = false; }}
          >
            👣 AVANZAR (MANTENER ESPACIO)
          </button>
        )}

        {message && <div style={styles.msg}>{message}</div>}

        {gamePhase === 'gameover' && (
          <div style={styles.go}>
            <h2>GAME OVER</h2>
            <p>Puntaje Final: {score}</p>
            <button style={styles.reintentarBtn} onClick={() => window.location.reload()}>Reintentar</button>
          </div>
        )}

        {gamePhase === 'win' && (
          <div style={styles.go}>
            <h2 style={{ color: '#44FF44' }}>¡NIVEL SUPERADO!</h2>
            <p>Puntaje: {score} | Perfectos: {perfectCount}</p>
            <button style={styles.reintentarBtn} onClick={() => window.location.reload()}>Jugar de nuevo</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: '#1a1a2e',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: '"Press Start 2P", monospace',
    color: '#fff',
    gap: '20px',
    boxSizing: 'border-box'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    background: '#16213e',
    padding: '25px',
    borderRadius: '12px',
    border: '4px solid #0f3460',
    minWidth: '280px',
    height: '608px', // Para que coincida más o menos con la altura del canvas + border
    boxSizing: 'border-box'
  },
  exitBtn: {
    background: '#e94560',
    color: 'white',
    border: '2px solid #fff',
    padding: '10px 15px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  hudSide: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  hudBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    background: '#0f3460',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #533483'
  },
  hudLabel: {
    fontSize: '10px',
    color: '#a8d8ea',
    marginBottom: '8px',
    letterSpacing: '1px'
  },
  hudValue: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#FFD700',
    textShadow: '2px 2px 0px #000'
  },
  iconsRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  iconBadge: {
    width: '40px',
    height: '40px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
    border: '2px solid rgba(255,255,255,0.2)'
  },
  canvasContainer: {
    position: 'relative',
    border: '4px solid #533483',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
  },
  canvas: {
    display: 'block',
    background: '#000',
    imageRendering: 'pixelated', // Crucial para pixel art
  },
  actionBtn: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(255, 255, 255, 0.85)',
    border: '4px solid #0f3460',
    borderRadius: '50px',
    padding: '15px 30px',
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    color: '#0f3460',
    cursor: 'pointer',
    userSelect: 'none',
    boxShadow: '0 5px 0px #0f3460',
    zIndex: 10
  },
  msg: {
    position: 'absolute',
    top: '25%',
    width: '100%',
    textAlign: 'center',
    fontSize: '32px',
    color: '#FFD700',
    textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000',
    animation: 'popIn 0.3s ease-out forwards'
  },
  go: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px'
  },
  reintentarBtn: {
    background: '#44FF44',
    color: '#000',
    border: 'none',
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 0px #0f3460'
  }
};

export default Templanza1;
