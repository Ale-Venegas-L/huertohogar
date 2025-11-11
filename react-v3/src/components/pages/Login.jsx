import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const email = correo.trim().toLowerCase();
    const pass = clave;

    if (!email || !pass) {
      setMensaje("Debes completar correo y clave");
      return;
    }

    setLoading(true);

    try {
      if (email === "admin@duoc.cl") {
        // Admin: autenticar con Firebase Auth
        await signInWithEmailAndPassword(auth, email, pass);
        const usuario = { nombre: "Administrador", correo: email, rol: "admin" };
        localStorage.setItem("usuario", JSON.stringify(usuario));
        setMensaje("Bienvenido Administrador, redirigiendo...");
        setTimeout(() => navigate("/perfil-admin"), 800);
        return;
      }

      // Cliente: validar en Firestore colección "usuario"
      const usuariosRef = collection(db, "usuario");
      const q = query(usuariosRef, where("correo", "==", email), where("clave", "==", pass));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const data = snap.docs[0].data();
        const nombre = data.nombre || email;
        const usuario = { nombre, correo: email, rol: "cliente" };
        localStorage.setItem("usuario", JSON.stringify(usuario));
        setMensaje("Bienvenido cliente, redirigiendo...");
        setTimeout(() => navigate("/perfil-cliente"), 800);
      } else {
        setMensaje("Correo o clave incorrectos");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setMensaje("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main" style={{ maxWidth: 420 }}>
      <h2 className="section-title">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <div className="form-group">
          <label htmlFor="correoLogin">Correo</label>
          <input
            id="correoLogin"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="claveLogin">Clave</label>
          <input
            id="claveLogin"
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
        </div>
        {mensaje && (
          <div id="mensajeLogin" style={{ color: mensaje.includes("Bienvenido") ? "green" : "red" }}>
            {mensaje}
          </div>
        )}
        <button className="btn-signup" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
};

export default Login;
