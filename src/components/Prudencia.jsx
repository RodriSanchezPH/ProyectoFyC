import React, { useState } from "react";
import aventurasData from "../data/prudencia.json";
import "../design/prudencia.css";

// Importar imágenes de aventuras
import montanaImg from "../assets/prudencia/montana.png";
import bosqueImg from "../assets/prudencia/bosque.png";
import playaImg from "../assets/prudencia/playa.png";
import ciudadImg from "../assets/prudencia/ciudad.png";

// Importar imágenes de desafíos - Montaña
import nocheImg from "../assets/prudencia/noche.png";
import frioImg from "../assets/prudencia/frio.png";
import precipicioImg from "../assets/prudencia/precipicio.png";
import sedImg from "../assets/prudencia/sed.png";

// Importar imágenes de desafíos - Bosque
import perdidoImg from "../assets/prudencia/perdido.png";
import soloImg from "../assets/prudencia/solo.png";
import heridaImg from "../assets/prudencia/herida.png";
import hambreImg from "../assets/prudencia/hambre.png";

// Importar imágenes de desafíos - Playa
import solImg from "../assets/prudencia/sol.png";
import cortadaImg from "../assets/prudencia/cortada.png";
import lejosImg from "../assets/prudencia/lejos.png";
import sedPlayaImg from "../assets/prudencia/sed_playa.png";

// Importar imágenes de desafíos - Ciudad
import callesImg from "../assets/prudencia/calles.png";
import lluviaImg from "../assets/prudencia/lluvia.png";
import almuerzoImg from "../assets/prudencia/almuerzo.png";
import caidaImg from "../assets/prudencia/caida.png";

const CAPACIDAD_MOCHILA = 5;

// Mapeo de imágenes de aventuras
const imagenesAventuras = {
    montana: montanaImg,
    bosque: bosqueImg,
    playa: playaImg,
    ciudad: ciudadImg,
};

// Mapeo de imágenes de desafíos
const imagenesDesafios = {
    noche: nocheImg,
    frio: frioImg,
    precipicio: precipicioImg,
    sed: sedImg,
    perdido: perdidoImg,
    solo: soloImg,
    herida: heridaImg,
    hambre: hambreImg,
    sol: solImg,
    cortada: cortadaImg,
    lejos: lejosImg,
    sed_playa: sedPlayaImg,
    calles: callesImg,
    lluvia: lluviaImg,
    almuerzo: almuerzoImg,
    caida: caidaImg,
};

export default function Prudencia() {
    // Estados del juego
    const [fase, setFase] = useState("seleccion-aventura");
    const [aventuraActual, setAventuraActual] = useState(null);
    const [mochila, setMochila] = useState([]);
    const [desafioActual, setDesafioActual] = useState(0);
    const [resultados, setResultados] = useState([]);
    const [puntosTotales, setPuntosTotales] = useState(0);
    const [mostrandoResultado, setMostrandoResultado] = useState(false);
    const [animacion, setAnimacion] = useState("");
    const [aventurasCompletadas, setAventurasCompletadas] = useState(() => {
        const guardado = localStorage.getItem("prudencia-progreso");
        return guardado ? JSON.parse(guardado) : [];
    });
    const [mostrandoFelicitacion, setMostrandoFelicitacion] = useState(false);

    // Guardar en localStorage cuando cambia
    React.useEffect(() => {
        localStorage.setItem("prudencia-progreso", JSON.stringify(aventurasCompletadas));
    }, [aventurasCompletadas]);

    // Reiniciar juego
    const reiniciarJuego = () => {
        setFase("seleccion-aventura");
        setAventuraActual(null);
        setMochila([]);
        setDesafioActual(0);
        setResultados([]);
        setPuntosTotales(0);
        setMostrandoResultado(false);
    };

    // Seleccionar aventura
    const seleccionarAventura = (aventura) => {
        setAnimacion("fade-out");
        setTimeout(() => {
            setAventuraActual(aventura);
            setFase("preparacion");
            setAnimacion("fade-in");
        }, 300);
    };

    // Función para marcar la isla completa
    const verificarIslaCompletada = (nuevasCompletadas) => {
        if (nuevasCompletadas.length === 4) {
            const ID_PRUDENCIA = 3;
            const virtudesCompletadas = JSON.parse(localStorage.getItem("virtudes-completadas") || "[]");

            if (!virtudesCompletadas.includes(ID_PRUDENCIA)) {
                const nuevasVirtudes = [...virtudesCompletadas, ID_PRUDENCIA];
                localStorage.setItem("virtudes-completadas", JSON.stringify(nuevasVirtudes));
                window.dispatchEvent(new Event("storage"));

                setTimeout(() => {
                    setMostrandoFelicitacion(true);
                }, 500);
            }
        }
    };

    // Agregar/quitar objeto de la mochila
    const toggleObjeto = (objeto) => {
        if (mochila.find((o) => o.id === objeto.id)) {
            setMochila(mochila.filter((o) => o.id !== objeto.id));
        } else if (mochila.length < CAPACIDAD_MOCHILA) {
            setMochila([...mochila, objeto]);
        }
    };

    // Iniciar aventura
    const iniciarAventura = () => {
        if (mochila.length === 0) {
            alert("¡Debes llevar al menos un objeto!");
            return;
        }
        setAnimacion("fade-out");
        setTimeout(() => {
            setFase("aventura");
            setDesafioActual(0);
            setAnimacion("fade-in");
        }, 300);
    };

    // Verificar si tenemos objeto útil para el desafío
    const tieneObjetoUtil = (desafio) => {
        return desafio.objetosUtiles.some((objId) =>
            mochila.some((obj) => obj.id === objId)
        );
    };

    // Obtener el objeto útil que tenemos
    const obtenerObjetoUsado = (desafio) => {
        const objetoId = desafio.objetosUtiles.find((objId) =>
            mochila.some((obj) => obj.id === objId)
        );
        return aventurasData.objetos.find((obj) => obj.id === objetoId);
    };

    // Enfrentar desafío
    const enfrentarDesafio = () => {
        const desafio = aventuraActual.desafios[desafioActual];
        const exito = tieneObjetoUtil(desafio);
        const objetoUsado = exito ? obtenerObjetoUsado(desafio) : null;

        const resultado = {
            desafio: desafio,
            exito: exito,
            objetoUsado: objetoUsado,
            puntos: exito ? desafio.puntos : 0,
        };

        setResultados([...resultados, resultado]);
        setPuntosTotales((prev) => prev + resultado.puntos);
        setMostrandoResultado(true);
    };

    // Siguiente desafío
    const siguienteDesafio = () => {
        setMostrandoResultado(false);
        if (desafioActual + 1 >= aventuraActual.desafios.length) {
            setAnimacion("fade-out");
            setTimeout(() => {
                setFase("resultado");
                setAnimacion("fade-in");
            }, 300);
        } else {
            setAnimacion("slide-left");
            setTimeout(() => {
                setDesafioActual(desafioActual + 1);
                setAnimacion("slide-right");
            }, 300);
        }
    };

    // Calcular calificación
    const calcularCalificacion = () => {
        const maxPuntos = aventuraActual.desafios.reduce(
            (sum, d) => sum + d.puntos,
            0
        );
        const porcentaje = (puntosTotales / maxPuntos) * 100;

        if (porcentaje >= 90) return { emoji: "🏆", texto: "¡EXPLORADOR LEGENDARIO!", clase: "legendario" };
        if (porcentaje >= 70) return { emoji: "🥇", texto: "¡Muy bien preparado!", clase: "oro" };
        if (porcentaje >= 50) return { emoji: "🥈", texto: "Buena preparación", clase: "plata" };
        if (porcentaje >= 25) return { emoji: "🥉", texto: "Puedes mejorar", clase: "bronce" };
        return { emoji: "📚", texto: "¡Sigue aprendiendo!", clase: "aprendiz" };
    };

    // Obtener frase de prudencia aleatoria
    const obtenerFrasePrudencia = () => {
        const frases = aventurasData.frasesPrudencia;
        return frases[Math.floor(Math.random() * frases.length)];
    };

    // ==================== RENDERIZADO ====================

    // Modal de felicitación global (se muestra sobre cualquier fase)
    if (mostrandoFelicitacion) {
        return (
            <div className="modal-overlay">
                <div className="modal-felicitacion">
                    <div className="modal-contenido">
                        <h1>🏆 ¡ISLA COMPLETADA! 🏆</h1>
                        <div className="trofeo-animado">🏝️✨</div>
                        <p>¡Has demostrado gran sabiduría y prudencia!</p>
                        <p>Tu progreso ha sido registrado en tu mapa de virtudes.</p>
                        <button
                            className="btn-continuar"
                            onClick={() => {
                                setMostrandoFelicitacion(false);
                                reiniciarJuego();
                            }}
                        >
                            Continuar mi viaje 🚀
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // FASE 1: Selección de Aventura
    if (fase === "seleccion-aventura") {
        return (
            <div className={`mochila-container ${animacion}`}>
                <div className="mochila-header">
                    <h1>🎒 Mochila del Explorador</h1>
                    <p className="subtitulo">Elige tu próxima aventura</p>
                </div>

                <div className="aventuras-grid">
                    {aventurasData.aventuras.map((aventura) => (
                        <div
                            key={aventura.id}
                            className={`aventura-card ${aventurasCompletadas.includes(aventura.id) ? "completada" : ""}`}
                            onClick={() => seleccionarAventura(aventura)}
                        >
                            <div className="aventura-icono">{aventura.icono}</div>
                            <img
                                src={imagenesAventuras[aventura.imagen]}
                                alt={aventura.nombre}
                                className="aventura-imagen"
                            />
                            <h3>{aventura.nombre}</h3>
                            <p>{aventura.descripcion}</p>
                            <div className="card-footer">
                                <span className="aventura-desafios">
                                    {aventura.desafios.length} desafíos
                                </span>
                                {aventurasCompletadas.includes(aventura.id) && (
                                    <span className="badge-completado">✅ Completado</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="frase-prudencia">
                    <p>💡 "{obtenerFrasePrudencia()}"</p>
                </div>
            </div>
        );
    }

    // FASE 2: Preparación de Mochila
    if (fase === "preparacion") {
        return (
            <div className={`mochila-container ${animacion}`}>
                <div className="mochila-header">
                    <button className="btn-volver" onClick={reiniciarJuego}>
                        ← Volver
                    </button>
                    <h1>
                        {aventuraActual.icono} {aventuraActual.nombre}
                    </h1>
                    <p className="subtitulo">¿Qué llevarás en tu mochila?</p>
                </div>

                <div className="capacidad-mochila">
                    <div className="capacidad-barra">
                        <div
                            className="capacidad-lleno"
                            style={{ width: `${(mochila.length / CAPACIDAD_MOCHILA) * 100}%` }}
                        ></div>
                    </div>
                    <span>
                        {mochila.length} / {CAPACIDAD_MOCHILA} objetos
                    </span>
                </div>

                <div className="objetos-grid">
                    {aventurasData.objetos.map((objeto) => {
                        const enMochila = mochila.find((o) => o.id === objeto.id);
                        const mochilaLlena = mochila.length >= CAPACIDAD_MOCHILA;

                        return (
                            <div
                                key={objeto.id}
                                className={`objeto-card ${enMochila ? "seleccionado" : ""} ${!enMochila && mochilaLlena ? "deshabilitado" : ""
                                    }`}
                                onClick={() => toggleObjeto(objeto)}
                            >
                                <span className="objeto-icono">{objeto.icono}</span>
                                <span className="objeto-nombre">{objeto.nombre}</span>
                                {enMochila && <span className="check">✓</span>}
                            </div>
                        );
                    })}
                </div>

                <div className="mochila-visual">
                    <h3>🎒 Tu Mochila:</h3>
                    <div className="mochila-contenido">
                        {mochila.length === 0 ? (
                            <p className="mochila-vacia">Selecciona objetos arriba</p>
                        ) : (
                            mochila.map((obj) => (
                                <span key={obj.id} className="objeto-en-mochila" title={obj.nombre}>
                                    {obj.icono}
                                </span>
                            ))
                        )}
                    </div>
                </div>

                <button
                    className={`btn-iniciar ${mochila.length > 0 ? "activo" : ""}`}
                    onClick={iniciarAventura}
                    disabled={mochila.length === 0}
                >
                    🚀 ¡Comenzar Aventura!
                </button>
                <p className="pista">
                    💡 Pista: Piensa qué podrías necesitar en{" "}
                    {aventuraActual.nombre.toLowerCase()}...
                </p>
            </div>
        );
    }

    // FASE 3: Aventura (Desafíos)
    if (fase === "aventura") {
        const desafio = aventuraActual.desafios[desafioActual];

        return (
            <div className={`mochila-container ${animacion}`}>
                <div className="mochila-header">
                    <h1>
                        {aventuraActual.icono} {aventuraActual.nombre}
                    </h1>
                    <div className="progreso-aventura">
                        <span>
                            Desafío {desafioActual + 1} de {aventuraActual.desafios.length}
                        </span>
                        <div className="progreso-barra">
                            <div
                                className="progreso-lleno"
                                style={{
                                    width: `${((desafioActual + 1) / aventuraActual.desafios.length) * 100}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="puntos-display">
                    ⭐ {puntosTotales} puntos
                </div>

                <div className="desafio-card">
                    {desafio.imagen && (
                        <img
                            src={imagenesDesafios[desafio.imagen]}
                            alt={desafio.titulo}
                            className="desafio-imagen"
                        />
                    )}
                    <h2 className="desafio-titulo">⚠️ {desafio.titulo}</h2>
                    <p className="desafio-descripcion">{desafio.descripcion}</p>

                    <div className="tu-mochila">
                        <h4>🎒 Tu mochila:</h4>
                        <div className="mochila-objetos">
                            {mochila.map((obj) => (
                                <span key={obj.id} className="objeto-mini" title={obj.nombre}>
                                    {obj.icono}
                                </span>
                            ))}
                        </div>
                    </div>

                    {!mostrandoResultado ? (
                        <button className="btn-enfrentar" onClick={enfrentarDesafio}>
                            🔍 ¿Qué tengo para esto?
                        </button>
                    ) : (
                        <div
                            className={`resultado-desafio ${resultados[resultados.length - 1].exito ? "exito" : "fallo"
                                }`}
                        >
                            {resultados[resultados.length - 1].exito ? (
                                <>
                                    <div className="resultado-icono">✅</div>
                                    <h3>¡Bien preparado!</h3>
                                    {resultados[resultados.length - 1].objetoUsado && (
                                        <p className="objeto-usado">
                                            Usaste:{" "}
                                            {resultados[resultados.length - 1].objetoUsado.icono}{" "}
                                            {resultados[resultados.length - 1].objetoUsado.nombre}
                                        </p>
                                    )}
                                    <p>{desafio.mensajeExito}</p>
                                    <p className="puntos-ganados">+{desafio.puntos} puntos ⭐</p>
                                </>
                            ) : (
                                <>
                                    <div className="resultado-icono">😅</div>
                                    <h3>No tenías lo necesario</h3>
                                    <p>{desafio.mensajeFallo}</p>
                                    <p className="objeto-necesario">
                                        Necesitabas:{" "}
                                        {desafio.objetosUtiles
                                            .map((id) => {
                                                const obj = aventurasData.objetos.find((o) => o.id === id);
                                                return obj ? `${obj.icono} ${obj.nombre}` : id;
                                            })
                                            .join(" o ")}
                                    </p>
                                </>
                            )}

                            <button className="btn-siguiente" onClick={siguienteDesafio}>
                                {desafioActual + 1 >= aventuraActual.desafios.length
                                    ? "Ver Resultado Final 🏁"
                                    : "Siguiente Desafío →"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // FASE 4: Resultado Final
    if (fase === "resultado") {
        const calificacion = calcularCalificacion();
        const maxPuntos = aventuraActual.desafios.reduce(
            (sum, d) => sum + d.puntos,
            0
        );
        const aciertos = resultados.filter((r) => r.exito).length;

        return (
            <div className={`mochila-container ${animacion}`}>
                <div className="resultado-final">
                    <div className={`calificacion-badge ${calificacion.clase}`}>
                        <span className="calificacion-emoji">{calificacion.emoji}</span>
                        <h2>{calificacion.texto}</h2>
                    </div>

                    <div className="estadisticas">
                        <div className="stat">
                            <span className="stat-numero">{puntosTotales}</span>
                            <span className="stat-label">de {maxPuntos} puntos</span>
                        </div>
                        <div className="stat">
                            <span className="stat-numero">{aciertos}</span>
                            <span className="stat-label">
                                de {aventuraActual.desafios.length} desafíos superados
                            </span>
                        </div>
                    </div>

                    <div className="resumen-desafios">
                        <h3>📋 Resumen:</h3>
                        {resultados.map((res, idx) => (
                            <div
                                key={idx}
                                className={`resumen-item ${res.exito ? "exito" : "fallo"}`}
                            >
                                <span className="resumen-icono">
                                    {res.exito ? "✅" : "❌"}
                                </span>
                                <span className="resumen-titulo">{res.desafio.titulo}</span>
                                {res.exito && res.objetoUsado && (
                                    <span className="resumen-objeto">
                                        {res.objetoUsado.icono}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="lo-que-llevaste">
                        <h3>🎒 Llevaste:</h3>
                        <div className="objetos-llevados">
                            {mochila.map((obj) => (
                                <span key={obj.id} className="objeto-llevado">
                                    {obj.icono} {obj.nombre}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mensaje-final">
                        <p>💡 {aventuraActual.mensajeFinal}</p>
                    </div>

                    <div className="botones-finales">
                        <button
                            className="btn-reintentar"
                            onClick={() => {
                                setMochila([]);
                                setResultados([]);
                                setPuntosTotales(0);
                                setDesafioActual(0);
                                setFase("preparacion");
                            }}
                        >
                            🔄 Intentar de nuevo
                        </button>
                        <button className="btn-nueva-aventura" onClick={() => {
                            const exitoTotal = resultados.filter(r => r.exito).length === aventuraActual.desafios.length;

                            if (exitoTotal && !aventurasCompletadas.includes(aventuraActual.id)) {
                                const nuevas = [...aventurasCompletadas, aventuraActual.id];
                                setAventurasCompletadas(nuevas);
                                verificarIslaCompletada(nuevas);
                            }
                            reiniciarJuego();
                        }}>
                            🗺️ Nueva aventura
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
