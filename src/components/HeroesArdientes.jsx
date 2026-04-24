import React, { useRef, useEffect, useState } from "react";
import heroes from "../data/heroes";
import '../design/heroes-ardientes.css';

export default function HeroesArdientes() {
  const scrollRef = useRef(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});

  // 🎯 NUEVO: Estado para el filtro
  const [filtroVirtud, setFiltroVirtud] = useState("Todos");

  // 🎯 NUEVO: Lista de virtudes únicas
  const virtudes = ["Todos", "Fortaleza", "Justicia", "Prudencia", "Templanza"];

  // 🎯 NUEVO: Héroes filtrados
  const heroesFiltrados = filtroVirtud === "Todos"
    ? heroes
    : heroes.filter(heroe => heroe.virtud === filtroVirtud);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cards = Array.from(container.children);
      const center = container.scrollLeft + container.clientWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(center - cardCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setFocusIndex(closestIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [heroesFiltrados]); // 🎯 Dependencia actualizada

  // 🎯 NUEVO: Resetear scroll y focus cuando cambia el filtro
  useEffect(() => {
    setFocusIndex(0);
    setFlippedCards({});
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [filtroVirtud]);

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <div className="texto-contenido">
        <h1 className="titulo-heroes">
          Héroes Ardientes
        </h1>
        <h2 className="subtitulo-heroes">
          Descubre las historias inspiradoras de aquellos que encarnaron las virtudes en los momentos más desafiantes
        </h2>
      </div>

      {/* 🎯 NUEVO: Filtros de virtudes */}
      <div className="filtros-container">
        {virtudes.map((virtud) => (
          <button
            key={virtud}
            className={`filtro-btn ${filtroVirtud === virtud ? "activo" : ""}`}
            onClick={() => setFiltroVirtud(virtud)}
          >
            {virtud === "Todos" && "🌟 "}
            {virtud === "Fortaleza" && "💪 "}
            {virtud === "Justicia" && "⚖️ "}
            {virtud === "Prudencia" && "🧠 "}
            {virtud === "Templanza" && "🛡️ "}
            {virtud}
          </button>
        ))}
      </div>

      {/* 🎯 NUEVO: Contador de resultados */}
      <p className="contador-heroes">
        Mostrando {heroesFiltrados.length} héroe{heroesFiltrados.length !== 1 ? "s" : ""}
        {filtroVirtud !== "Todos" && ` de ${filtroVirtud}`}
      </p>

      <div className="heroes-wrapper">
        <div className="heroes-scroll" ref={scrollRef}>
          {heroesFiltrados.length > 0 ? (
            heroesFiltrados.map((heroe, index) => (
              <div
                key={heroe.id}
                className={`hero-card ${index === focusIndex ? "focus" : ""} ${flippedCards[heroe.id] ? "is-flipped" : ""
                  }`}
                onClick={() => toggleFlip(heroe.id)}
              >
                <div className="card-inner">
                  {/* Cara frontal */}
                  <div
                    className="card-front"
                    style={{
                      backgroundImage: `url(${heroe.imagen})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <h3 className="card-title">{heroe.nombre}</h3>
                    <h4 className="card-subtitle">{heroe.virtud}</h4>
                  </div>

                  {/* Cara trasera */}
                  <div className="card-back">
                    <h3 className="card-title">{heroe.nombre}</h3>
                    <div className="card-content">
                      <p className="hero-description">{heroe.historia}</p>
                      {heroe.frase && <p className="hero-frase">{heroe.frase}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-heroes">
              <p>No hay héroes con esta virtud</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}