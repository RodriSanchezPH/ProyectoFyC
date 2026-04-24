import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import virtudesData from "../data/virtudes";
import '../design/barra-progreso.css';

export default function BarraProgreso() {
  const [completadas, setCompletadas] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const actualizarProgreso = () => {
      const data = JSON.parse(localStorage.getItem("virtudes-completadas") || "[]");
      setCompletadas(data);
    };

    actualizarProgreso();

    // Escuchar cambios en localStorage
    window.addEventListener("storage", actualizarProgreso);
    // Revisar cada segundo (para capturar cambios en la misma pestaña)
    const interval = setInterval(actualizarProgreso, 1000);

    return () => {
      window.removeEventListener("storage", actualizarProgreso);
      clearInterval(interval);
    };
  }, []);

  const porcentaje = (completadas.length / virtudesData.length) * 100;

  if (location.pathname !== "/mapa") return null;
  return (
    <>
      <div className="barra-progreso-container">
        <div className="barra-progreso-header">
          <span className="barra-progreso-titulo">
            🏆 Progreso
          </span>
          <span className="barra-progreso-stats" >
            {completadas.length}/{virtudesData.length}
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="barra-progreso-background">
          <div className="barra-progreso-fill"
            style={{
              width: `${porcentaje}%`
            }}
          >
            {porcentaje > 0 && `${Math.round(porcentaje)}%`}
          </div>
        </div>

        {/*borrar progreso */}
        <button
          onClick={() => {
            localStorage.removeItem("virtudes-completadas");
            localStorage.removeItem("prudencia-progreso", "justicia-progreso", "templanza-progreso", "fortaleza-progreso"); // Borrar progreso de Prudencia
            setCompletadas([]);
            window.dispatchEvent(new Event("storage")); // Notificar cambios
          }}
          className="barra-progreso-reset">
          x
        </button>
      </div>
      {/* Mensaje de completitud */}
      {completadas.length === virtudesData.length && (
        <div className="barra-progreso-completitud">
          🌟El verdadero Héroe está dentro de ti🌟
        </div>
      )}

    </>
  );
}