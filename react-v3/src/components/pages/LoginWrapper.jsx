import { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
// Componente que revisa si hay usuario logueado en localStorage y actualiza el contexto
const LoginWrapper = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Revisar si hay usuario logueado en localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
      setUser(usuario); // Actualizar contexto
      // Redirigir a la página correspondiente según el rol
      navigate(usuario.rol === "admin" ? "/perfil-admin" : "/perfil-cliente");
    }
  }, [setUser, navigate]); // Solo se ejecuta una vez al montar el componente

  return null; // No renderiza nada
};

export default LoginWrapper;
