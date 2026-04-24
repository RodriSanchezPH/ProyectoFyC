import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MapaVirtudes from "./components/MapaVirtudes";
import HeroesArdientes from "./components/HeroesArdientes";
import ChatbotSabio from "./components/ChatbotSabio";
import BotonFlotanteSabio from "./components/BotonFlotanteSabio";
import BarraProgreso from "./components/BarraProgreso";
import Prudencia from "./components/Prudencia";
import Justicia from "./components/Justicia";
import Templanza from "./components/Templanza";
import Templanza1 from "./components/Templanza1";
import Templanza2 from "./components/Templanza2";
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
        <Route path="/prudencia" element={<Prudencia />} />
        <Route path="/justicia" element={<Justicia />} />
        <Route path="/templanza" element={<Templanza />} />
        <Route path="/templanza/1" element={<Templanza1 />} />
        <Route path="/templanza/2" element={<Templanza2 />} />
      </Routes>

      {/* Botón flotante del sabio */}
      <BotonFlotanteSabio onClick={() => setShowChatbot(!showChatbot)} />

      {showChatbot && (
        <div className="chatbot-wrapper">
          <div className="sabio-imagen">
            <img src={sabioImg} alt="El Sabio" />
          </div>

          <div className="chatbot-component-container">
            <ChatbotSabio />
          </div>
        </div>

      )}
    </Router>
  );
}