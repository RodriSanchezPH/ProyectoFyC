import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MapaVirtudes from "./components/MapaVirtudes";
import HeroesArdientes from "./components/HeroesArdientes";
import ChatbotSabio from "./components/ChatbotSabio";
import BotonFlotanteSabio from "./components/BotonFlotanteSabio";
import BarraProgreso from "./components/BarraProgreso";
import "./index.css";
import sabioImg from "./assets/sabio1.png";

export default function App() {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <Router>
      <Navbar />
      <BarraProgreso />

      <Routes>
        <Route path="/" element={<MapaVirtudes />} />
        <Route path="/mapa" element={<MapaVirtudes />} />
        <Route path="/heroes" element={<HeroesArdientes />} />
      </Routes>

      {/* Botón flotante del sabio */}
      <BotonFlotanteSabio onClick={() => setShowChatbot(!showChatbot)} />

      {showChatbot && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-end",
            gap: "15px",
            maxWidth: "95vw",
          }}
        >
           <div className="sabio-imagen">
            <img src={sabioImg} alt="El Sabio" />
          </div>
          {/* Imagen del Sabio */}
          <div
            style={{
              animation: "slideInLeft 0.5s ease-out",
            }}>
          </div>

          {/* Contenedor del Chat */}
          <div
            style={{
              position: "relative",
              background: "transparent",
              borderRadius: "15px",
              animation: "slideInRight 0.5s ease-out",
            }}
          >
            <ChatbotSabio />
          </div>
        </div>
      )}
    </Router>
  );
}