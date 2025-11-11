import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import "../../styles/profile.css";

const PerfilAdmin = () => {
  const { user } = useContext(UserContext); // Accedemos al usuario desde el contexto

  return (
    <div>
      <h2>Perfil Administrador</h2>
      <p>Bienvenido, {user?.nombre || "Administrador"}!</p>
    </div>
  );
};

export default PerfilAdmin;