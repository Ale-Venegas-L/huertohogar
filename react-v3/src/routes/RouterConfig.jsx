import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "../components/organisms/Header";
import Home from "../components/pages/Home";
import PerfilAdmin from "../components/pages/PerfilAdmin";
import PerfilCliente from "../components/pages/PerfilCliente";
import Catalogo from "../components/pages/Catalogo";
import Carrito from "../components/pages/Carrito";
import Checkout from "../components/pages/Checkout";
import Exito from "../components/pages/Exito";
import ErrorPago from "../components/pages/ErrorPago";
import LoginWrapper from "../components/pages/LoginWrapper";

/**
 * Redirige a una página HTML externa (assets/pages/...)
 */
const ExternalRedirect = ({ to }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  return null;
};

const RouterConfig = () => {
  return (
    <BrowserRouter>
      <Header />
      <LoginWrapper /> {/* si sigue siendo necesario para leer localStorage */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro/>} />
        <Route path="/perfil-admin" element={<PerfilAdmin />} />
        <Route path="/perfil-cliente" element={<PerfilCliente />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/exito" element={<Exito />} />
        <Route path="/error-pago" element={<ErrorPago />} />

        {/* Catch-all: puedes mostrar 404 o redirigir al Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterConfig;