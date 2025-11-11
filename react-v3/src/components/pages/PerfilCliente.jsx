import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import "../../styles/profile.css";

const PerfilCliente = () => {
  const { user } = useContext(UserContext); // Accedemos al usuario desde el contexto

  return (
    <div>
      <h2>Perfil Cliente</h2>
      <p>Bienvenido, {user?.nombre || "Cliente"}!</p>
    </div>
  );
};

export default PerfilCliente;