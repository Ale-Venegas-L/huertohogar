import { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

// Lista de rutas públicas que no requieren autenticación
const publicRoutes = ['/', '/login', '/registro', '/catalogo', '/nosotros', '/contacto'];

const LoginWrapper = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    
    // Si hay un usuario en localStorage pero no en el contexto, actualizamos el contexto
    if (usuario && !user) {
      setUser(usuario);
      
      // Solo redirigir si venimos del login o registro
      if (location.pathname === '/login' || location.pathname === '/registro') {
        const redirectTo = localStorage.getItem('redirectAfterLogin') || 
                         (usuario.rol === "admin" ? "/perfil-admin" : "/catalogo");
        
        // Limpiar el redirectAfterLogin después de usarlo
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectTo);
      }
    }
    
    // Si no hay usuario en localStorage pero hay uno en el contexto, limpiar el contexto
    if (!usuario && user) {
      setUser(null);
    }
  }, [user, setUser, navigate, location.pathname]);

  return null; // No renderiza nada
};

export default LoginWrapper;
