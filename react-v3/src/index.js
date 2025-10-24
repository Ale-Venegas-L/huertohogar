import { addUser } from './services/firestoreService';
import { bdayValidator, validarCorreo, runValidator } from './utils/script';

function esPaginaEstatica() {
  return window.location.pathname.includes('.html') || 
         window.location.pathname.includes('/assets/');
}

// Espera que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  

    const form = document.getElementById("formUsuario");
    const runInput = document.getElementById("run");
    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const claveInput = document.getElementById("clave");
    const fechaInput = document.getElementById("fecha");
    const mensaje = document.getElementById("mensaje");

    if (!form) return;// Si no estamos en la página de registro, salir

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        mensaje.innerText = "";

        const run = runInput.value.trim().toUpperCase();
        const nombre = nombreInput.value.trim();
        const correo = correoInput.value.trim();
        const clave = claveInput.value;
        const fecha = fechaInput.value;

        // Validaciones
        if (!runValidator(run)) return mensaje.innerText = "RUN incorrecto";
        if (!nombre) return mensaje.innerText = "Nombre vacío";
        if (!validarCorreo(correo)) return mensaje.innerText = "Correo incorrecto";
        if (!bdayValidator(fecha)) return mensaje.innerText = "Debe ser mayor a 18 años";

        try {
            await addUser({ run, nombre, correo, clave, fecha });
            mensaje.innerText = "Formulario enviado correctamente";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } catch (error) {
            console.error("Error al guardar usuario:", error);
            mensaje.innerText = "Error al guardar usuario en Firebase";
        }
    });
});
