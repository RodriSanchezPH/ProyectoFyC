import React, { useState } from "react";
import fondoMapa from "../assets/fondomapa.jpg";
import IslaPrudencia from "../assets/IslaPrudencia.png";
import IslaTemplanza from "../assets/IslaTemplanza.png";
import IslaJusticia from "../assets/IslaJusticia.png";
import IslaFortaleza from "../assets/IslaFortaleza.png";
import virtudesData from "../data/virtudes";
import { useNavigate } from "react-router-dom";
import '../design/mapa-virtudes.css';

export default function MapaVirtudes() {
  const [islaSeleccionada, setIslaSeleccionada] = useState(null);

  const imagenes = {
    1: IslaFortaleza,
    2: IslaJusticia,
    3: IslaPrudencia,
    4: IslaTemplanza,
  };

  const islas = virtudesData.map((virtud) => ({
    ...virtud,
    imagen: imagenes[virtud.id],
  }));

  const navigate = useNavigate();

  return (
    <div
      className="mapa-fondo"
      style={{ backgroundImage: `url(${fondoMapa})` }}
    >
      <div className="mapa-contenido">
        <h1 className="mapa-titulo">
          Mapa <br />
          de <br />
          Virtudes
        </h1>
      </div>

      {islas.map((isla) => (
        <div
          key={isla.id}
          className={`isla-contenedor isla-${isla.id}`}
          onClick={() => setIslaSeleccionada(isla)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1) translateY(-10px)";
            e.currentTarget.style.filter =
              "drop-shadow(0 10px 20px rgba(224, 188, 4, 0.6))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.filter =
              "drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3))";
          }}
        >
          <img
            src={isla.imagen}
            alt={isla.nombre}
            className="isla-imagen"
          />
        </div>
      ))}

      {islaSeleccionada && (
        <div
          className="modal-overlay"
          onClick={() => setIslaSeleccionada(null)}
        >
          <div
            className="modal-contenedor"
            style={{
              background: "linear-gradient(135deg, rgba(139, 93, 15, 0.95), rgba(101, 67, 33, 0.95))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-titulo">
              {islaSeleccionada.nombre}
            </h2>

            <img
              src={islaSeleccionada.imagen}
              alt={islaSeleccionada.nombre}
              className="modal-imagen"
            />

            <p className="modal-descripcion">
              {islaSeleccionada.descripcion}
            </p>

            <div className="modal-botones">
              <button
                className="modal-boton modal-boton-desafio"
                onClick={() => {
                  const rutas = {
                    1: "/fortaleza",
                    2: "/justicia",
                    3: "/prudencia",
                    4: "/templanza"
                  };
                  navigate(rutas[islaSeleccionada.id]);
                }}
                style={{
                  background: islaSeleccionada.colorBoton,
                  boxShadow: `0 4px 8px ${islaSeleccionada.colorBoton}60`,
                }}
              >
                Iniciar Desafío 
              </button>
              <button
                onClick={() => setIslaSeleccionada(null)}
                className="modal-boton modal-boton-cerrar"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}