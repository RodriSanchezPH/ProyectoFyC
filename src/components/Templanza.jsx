import React from "react";
import { useNavigate } from "react-router-dom";
import "../design/templanza.css";

const NIVELES_TEMPLANZA = [
  {
    id: 1,
    titulo: "Semáforo de Impulsos",
    descripcion: "Aprende a frenar a tiempo y dominar tus reacciones inmediatas.",
    icono: "🚦",
    dificultad: "Fácil",
    ruta: "/templanza/1"
  },
  {
    id: 2,
    titulo: "Castillo de Concentración",
    descripcion: "Construye tu voluntad resistiendo las distracciones externas.",
    icono: "🏰",
    dificultad: "Media",
    ruta: "/templanza/2"
  },
  {
    id: 3,
    titulo: "El Bosque del Silencio",
    descripcion: "Próximamente: Escucha tu voz interior en medio del ruido.",
    icono: "🌲",
    dificultad: "Pro",
    bloqueado: true
  },
  {
    id: 4,
    titulo: "La Cima de la Calma",
    descripcion: "Próximamente: El dominio total de la mente sobre el deseo.",
    icono: "🏔️",
    dificultad: "Maestro",
    bloqueado: true
  }
];

export default function Templanza() {
  const navigate = useNavigate();

  return (
    <div className="tmp-menu-container">
      <div className="tmp-menu-header">
        <h1 className="tmp-menu-titulo">La Virtud de la Templanza</h1>
        <p className="tmp-menu-subtitulo">Domina tus impulsos, construye tu camino.</p>
      </div>

      <div className="tmp-niveles-grid">
        {NIVELES_TEMPLANZA.map((nivel) => (
          <div 
            key={nivel.id} 
            className={`tmp-nivel-card ${nivel.bloqueado ? 'bloqueado' : ''}`}
            onClick={() => !nivel.bloqueado && navigate(nivel.ruta)}
          >
            <div className="tmp-nivel-icono">{nivel.icono}</div>
            <div className="tmp-nivel-info">
              <h3>Nivel {nivel.id}: {nivel.titulo}</h3>
              <p>{nivel.descripcion}</p>
              <div className="tmp-nivel-footer">
                 <span className="tmp-nivel-diff">Dificultad: {nivel.dificultad}</span>
                 {nivel.bloqueado ? (
                   <span className="tmp-nivel-status">🔒 Bloqueado</span>
                 ) : (
                   <span className="tmp-nivel-status">▶️ Jugar</span>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="tmp-btn-volver" onClick={() => navigate("/")}>
        🏠 Volver al Mapa
      </button>
    </div>
  );
}
