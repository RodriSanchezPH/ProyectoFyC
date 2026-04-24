import React, { useState, useEffect } from 'react';
import { gameData, recursosImg } from '../data/justiciaData';
import '../design/justicia.css';

// --- COMPONENTE: BARRA DE RECURSOS ---
const BarraRecursos = ({ recursos, onDragStart, onRecursoClick, recursoSeleccionado }) => {
    const [indice, setIndice] = useState(0);
    const itemsPorVista = 3;

    // Convertimos el objeto de recursos en un array para poder filtrarlo/recorrerlo
    const listaRecursos = Object.entries(recursos).filter(([_, cant]) => cant > 0);

    const siguiente = () => {
        if (indice + itemsPorVista < listaRecursos.length) setIndice(indice + 1);
    };

    const anterior = () => {
        if (indice > 0) setIndice(indice - 1);
    };

    return (
        <div className="top-right-bar" onClick={(e) => e.stopPropagation()}>
            <button className="flecha-btn" onClick={anterior} disabled={indice === 0}>▲</button>
            <div className="carrusel-viewport">
                {listaRecursos.slice(indice, indice + itemsPorVista).map(([tipo, cantidad]) => (
                    <div
                        key={tipo}
                        className={`recurso-item ${recursoSeleccionado === tipo ? 'seleccionado' : ''}`}
                        style={{ borderColor: recursoSeleccionado === tipo ? '#FFD700' : '#5d3a1a', transform: recursoSeleccionado === tipo ? 'scale(1.1)' : 'none', transition: 'all 0.2s' }}
                        draggable
                        onDragStart={(e) => onDragStart(e, tipo)}
                        onClick={() => onRecursoClick(tipo)}
                    >
                        <img src={recursosImg[tipo]} alt={tipo} />
                        <span className="badge">{cantidad}</span>
                    </div>
                ))}
            </div>
            <button className="flecha-btn" onClick={siguiente} disabled={indice + itemsPorVista >= listaRecursos.length}>▼</button>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function Justicia() {
    const [nivelIdx, setNivelIdx] = useState(0);
    const [showIntro, setShowIntro] = useState(true);
    const [infoFamilia, setInfoFamilia] = useState(null);
    const [recursosMano, setRecursosMano] = useState({});
    const [asignaciones, setAsignaciones] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [resultado, setResultado] = useState({ approved: false, score: 0, msg: '' });
    const [gameFinished, setGameFinished] = useState(false);
    const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);
    const [showWelcomeBack, setShowWelcomeBack] = useState(false);

    // Novedad para soporte táctil (click-to-select, click-to-drop)
    const [recursoSeleccionado, setRecursoSeleccionado] = useState(null);

    const nivel = gameData.niveles[nivelIdx];

    // --- EFECTO DE INICIALIZACIÓN ---
    useEffect(() => {
        const completed = localStorage.getItem('justicia-progreso') === 'true';
        if (completed) {
            setIsAlreadyCompleted(true);
            setShowWelcomeBack(true);
            setShowIntro(false);
            window.dispatchEvent(new Event('adventureCompleted'));
        }
    }, []);

    // --- EFECTO DE CARGA DE NIVEL ---
    useEffect(() => {
        if (!nivel) return;

        setShowResult(false);
        setInfoFamilia(null);

        if (isAlreadyCompleted) {
            // Modo Repaso: Mostrar recursos repartidos basados en necesidades
            const solucionVisual = {};
            nivel.familias.forEach(fam => {
                const recursosFamilia = {};
                Object.entries(fam.necesidades).forEach(([tipo, cant]) => {
                    if (cant > 0) recursosFamilia[tipo] = cant;
                });
                solucionVisual[fam.id] = recursosFamilia;
            });
            setAsignaciones(solucionVisual);
            setRecursosMano({});
            setShowIntro(false);
        } else {
            // Modo Juego: Tablero limpio
            setRecursosMano({ ...nivel.recursosDisponibles });
            setAsignaciones({});
            if (!showWelcomeBack) {
                setShowIntro(true);
            }
        }
    }, [nivelIdx, nivel, isAlreadyCompleted]);

    const handleDragStart = (e, tipo) => {
        // Bloquear arrastre si está en modo repaso (opcional)
        if (isAlreadyCompleted) return;
        e.dataTransfer.setData("tipo", tipo);
        setRecursoSeleccionado(tipo); // También lo seleccionamos para tap
    };

    const handleRecursoClick = (tipo) => {
        if (isAlreadyCompleted) return;
        // Alternar selección
        setRecursoSeleccionado(prev => prev === tipo ? null : tipo);
    };

    const handleDrop = (e, familiaId) => {
        if (isAlreadyCompleted) return; // Bloquear drop en modo repaso

        let tipo = null;
        if (e && e.dataTransfer) {
            tipo = e.dataTransfer.getData("tipo");
        } else {
            // Si no hay evento drag, intentamos usar el seleccionado por tap
            tipo = recursoSeleccionado;
        }

        if (tipo && recursosMano[tipo] > 0) {
            setRecursosMano(prev => ({ ...prev, [tipo]: prev[tipo] - 1 }));
            setAsignaciones(prev => ({
                ...prev,
                [familiaId]: { ...prev[familiaId], [tipo]: (prev[familiaId]?.[tipo] || 0) + 1 }
            }));

            // Opcional: Deseleccionar después de colocar, 
            // o mantener seleccionado si quedan más para poner varios rápidos.
            // setRecursoSeleccionado(null); 
        }
    };

    const handleCasaClick = (e, fam) => {
        e.stopPropagation(); // Evitar que el click llegue al contenedor y deseleccione
        if (recursoSeleccionado) {
            handleDrop(null, fam.id);
        } else {
            setInfoFamilia(fam);
        }
    };

    const handleRemoveResource = (e, familiaId, tipo) => {
        if (isAlreadyCompleted) return; // Bloquear quitar recursos en modo repaso

        e.stopPropagation();
        setAsignaciones(prev => {
            const currentFam = prev[familiaId] || {};
            if (!currentFam[tipo]) return prev;

            const newCount = currentFam[tipo] - 1;
            const newFam = { ...currentFam };

            if (newCount <= 0) {
                delete newFam[tipo];
            } else {
                newFam[tipo] = newCount;
            }

            return { ...prev, [familiaId]: newFam };
        });
        setRecursosMano(prev => ({ ...prev, [tipo]: (prev[tipo] || 0) + 1 }));
    };

    const verificarJusticia = () => {
        // Si estamos en modo repaso, no hacemos nada o mostramos mensaje
        if (isAlreadyCompleted) return;

        const recursosSobrantes = Object.values(recursosMano).reduce((a, b) => a + b, 0);
        if (recursosSobrantes > 0) {
            setResultado({
                approved: false,
                score: 0,
                msg: "¡Aún tienes recursos en la mano! Para que sea justo, debes repartir todo lo disponible."
            });
            setShowResult(true);
            return;
        }

        let aciertos = 0;
        let totalNecesario = 0;
        let errores = 0;

        nivel.familias.forEach(fam => {
            const necesidades = fam.necesidades || {};
            const entregado = asignaciones[fam.id] || {};
            const todosTipos = new Set([...Object.keys(necesidades), ...Object.keys(entregado)]);

            todosTipos.forEach(tipo => {
                const need = necesidades[tipo] || 0;
                const given = entregado[tipo] || 0;
                totalNecesario += need;

                if (given === need) {
                    aciertos += need;
                } else {
                    errores += Math.abs(given - need);
                }
            });
        });

        let score = 0;
        if (errores === 0 && aciertos === totalNecesario) {
            score = 100;
        } else {
            score = Math.max(0, Math.round(((aciertos - errores) / totalNecesario) * 100));
        }

        const approved = score > 70;
        let msg = approved ?
            "¡Excelente! Has repartido con sabiduría y justicia." :
            "La distribución no fue justa. Revisa quién recibió de más o de menos.";

        setResultado({ approved, score, msg });
        setShowResult(true);
    };

    const siguienteNivel = () => {
        if (nivelIdx < gameData.niveles.length - 1) {
            setNivelIdx(prev => prev + 1);
        } else {
            // ✅ CORRECCIÓN 2: Asegurar orden de eventos
            localStorage.setItem('justicia-progreso', 'true');

            // ✅ CORRECCIÓN 2B: Actualizar virtudes-completadas para sincronizar BarraProgreso
            const completadas = JSON.parse(localStorage.getItem('virtudes-completadas') || '[]');
            if (!completadas.includes(2)) { // 2 es el ID de Justicia
                completadas.push(2);
                localStorage.setItem('virtudes-completadas', JSON.stringify(completadas));
            }

            // Disparar evento para que BarraProgreso lo detecte
            window.dispatchEvent(new Event('adventureCompleted'));
            // Además disparamos un evento 'storage' manual por si acaso
            window.dispatchEvent(new Event('storage'));

            setShowResult(false);
            setGameFinished(true);
            setIsAlreadyCompleted(true);
        }
    };

    const reintentarNivel = () => {
        setRecursosMano({ ...nivel.recursosDisponibles });
        setAsignaciones({});
        setShowResult(false);
        setInfoFamilia(null);
    };



    const cambiarNivel = (index) => {
        setNivelIdx(index);
        // showIntro ya se maneja en el useEffect (será false porque isAlreadyCompleted es true)
    };

    if (!nivel) {
        return (
            <div className="juego-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                Cargando Aldea...
            </div>
        );
    }

    return (
        <div className="juego-container" onClick={() => setRecursoSeleccionado(null)}>


            {/* Selector de niveles (Modo Repaso) */}
            {isAlreadyCompleted && !gameFinished && (
                <div className="selector-niveles" onClick={e => e.stopPropagation()}>
                    <span>🏆 Modo Repaso: </span>
                    {gameData.niveles.map((n, i) => (
                        <button
                            key={n.id}
                            className={`btn-nivel-select ${i === nivelIdx ? 'activo' : ''}`}
                            onClick={() => cambiarNivel(i)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            <BarraRecursos
                recursos={recursosMano}
                onDragStart={handleDragStart}
                onRecursoClick={handleRecursoClick}
                recursoSeleccionado={recursoSeleccionado}
            />

            {/* Ocultar botón verificar si ya está completado */}
            {!isAlreadyCompleted && (
                <button className="btn-verificar" onClick={(e) => { e.stopPropagation(); verificarJusticia(); }}>
                    ⚖️ Terminar Reparto
                </button>
            )}

            <div className="aldea-mapa" style={{ backgroundImage: `url(${nivel.fondo})` }}>
                {nivel.familias.map(fam => (
                    <div
                        key={fam.id}
                        className="casa-wrapper"
                        style={{ left: `${fam.x}%`, top: `${fam.y}%`, cursor: isAlreadyCompleted ? 'default' : 'pointer' }}
                        onClick={(e) => handleCasaClick(e, fam)}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => handleDrop(e, fam.id)}
                    >
                        {/* Burbujas de recursos (Ahora se muestran rellenas en modo repaso) */}
                        <div className="burbuja-recursos" onClick={e => e.stopPropagation()}>
                            {asignaciones[fam.id] && Object.entries(asignaciones[fam.id]).map(([t, c]) => (
                                <span key={t} onClick={(e) => handleRemoveResource(e, fam.id, t)} title="Recurso asignado">
                                    <img src={recursosImg[t]} alt={t} />
                                    {c}
                                </span>
                            ))}
                        </div>
                        <div className="casa-visual">
                            <img src={fam.sprite} className="casa-sprite" alt={fam.nombre} />
                            {fam.personaje && (
                                <img src={fam.personaje} className="personaje-sprite" alt="Personaje" />
                            )}
                        </div>
                        <span className="casa-nombre">{fam.nombre}</span>
                    </div>
                ))}
            </div>

            {/* Modal Intro (Solo si NO está completado y NO estamos viendo bienvenida) */}
            {showIntro && !isAlreadyCompleted && !showWelcomeBack && (
                <div className="modal-overlay">
                    <div className="pergamino intro">
                        <h2>📜 {nivel.titulo}</h2>
                        <p>{nivel.descripcion}</p>
                        <button className="btn-start" onClick={() => setShowIntro(false)}>
                            ¡Comenzar Reparto!
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Bienvenida "Ya completado" */}
            {showWelcomeBack && (
                <div className="modal-overlay">
                    <div className="pergamino intro">
                        <h2>🏆 ¡Bienvenido, Alcalde Justo!</h2>
                        <p>Ya has completado tu labor en estas tierras. La paz y la justicia reinan en la aldea gracias a ti.</p>
                        <p>Puedes usar el <strong>menú superior</strong> para ver cómo quedó la aldea prospera.</p>
                        <button className="btn-start" onClick={() => setShowWelcomeBack(false)}>
                            Ver Aldeas
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Info Familia */}
            {infoFamilia && (
                <div className="modal-overlay" onClick={() => setInfoFamilia(null)}>
                    <div className="pergamino info-casa" onClick={e => e.stopPropagation()}>
                        <button className="btn-cerrar" onClick={() => setInfoFamilia(null)}>X</button>
                        <h3>🏠 {infoFamilia.nombre}</h3>
                        <div className="info-content">
                            {infoFamilia.personaje && <img src={infoFamilia.personaje} alt="Personaje" />}
                            <p><strong>Situación:</strong> {infoFamilia.situacion}</p>
                        </div>
                        {isAlreadyCompleted ? (
                            <p className="pista" style={{ color: 'green' }}>¡Gracias por tu ayuda!</p>
                        ) : (
                            <p className="pista">Necesitan tu ayuda justa...</p>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Resultado Normal */}
            {showResult && !gameFinished && (
                <div className="modal-overlay">
                    <div className="pergamino resultado">
                        <h2>{resultado.approved ? "✨ ¡Justicia Lograda!" : "⚠️ Inténtalo de nuevo"}</h2>
                        <div className="score-circle">{resultado.score}%</div>
                        <p>{resultado.msg}</p>

                        {resultado.approved ? (
                            <button className="btn-start" onClick={siguienteNivel}>
                                {nivelIdx < gameData.niveles.length - 1 ? "Siguiente Nivel ➡️" : "Ver Final 🏆"}
                            </button>
                        ) : (
                            <button className="btn-start" style={{ background: '#ff9800', borderColor: '#e65100' }} onClick={reintentarNivel}>
                                🔄 Reintentar
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Final del Juego */}
            {gameFinished && (
                <div className="modal-overlay">
                    <div className="pergamino resultado final-game">
                        <h1>🏰 ¡ALCALDE SUPREMO! 🏰</h1>
                        <div className="score-circle" style={{ borderColor: '#FFD700', color: '#FFD700', background: '#333' }}>
                            👑
                        </div>
                        <p>Has completado todos los desafíos.</p>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                            <button className="btn-start" onClick={() => {
                                setGameFinished(false);
                                setShowWelcomeBack(true);
                            }}>
                                Quedarme aquí
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}