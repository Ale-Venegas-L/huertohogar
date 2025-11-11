import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../components/pages/Home";
import PerfilAdmin from "../components/pages/PerfilAdmin";
import PerfilCliente from "../components/pages/PerfilCliente";
import Catalogo from "../components/pages/Catalogo";
import Carrito from "../components/pages/Carrito";
import Checkout from "../components/pages/Checkout";
import Exito from "../components/pages/Exito";
import ErrorPago from "../components/pages/ErrorPago";
import LoginWrapper from "../components/pages/LoginWrapper";
import Registro from "../components/pages/Registro";
import Nosotros from "../components/pages/Nosotros";
import Contacto from "../components/pages/Contacto";
import Layout from "../components/organisms/Layout";
import Login from "../components/pages/Login";

const RouterConfig = () => {
  return (
    <>
      <LoginWrapper /> {/* si sigue siendo necesario para leer localStorage */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil-admin" element={<PerfilAdmin />} />
          <Route path="/perfil-cliente" element={<PerfilCliente />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/exito" element={<Exito />} />
          <Route path="/error-pago" element={<ErrorPago />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          {/* Catch-all: puedes mostrar 404 o redirigir al Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
};

export default RouterConfig;