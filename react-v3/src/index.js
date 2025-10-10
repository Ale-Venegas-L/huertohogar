import { addUser } from "./services/firestoreService";
import {runValidator, validarCorreo, bdayValidator} from "./utils/script"

document.addEventListener("DOMContentLoaded", () =>{
    const form = document.getElementById("formUsuario");
    const runInput = document.getElementById("run");
    const nombreInput = document-getElementById("nombre");
    const correoInput = document-getElementById("correo");
    const claveInput = document-getElementById("clave");
    const fechaInput = document-getElementById("fecha");
    const mensaje = document.getElementById("mensaje");

    if(!form) return console.log("No se encontró el formulario");

    form.addEventListener("submit", async(e) => {
        e.preventDefault();
        mensaje.innerText = "";

        const run = runInput.value.trim().toUpperCase();
        const nombre = nombreInput.value.trim().toUpperCase();
        const correo = correoInput.value.trim().toUpperCase();
        const clave = claveInput.value;
        const fecha = fechaInput.value;

        if(!runValidator(run)) return mensaje.innerText = "RUN incorrecto";
        if(!validarCorreo(correo)) return mensaje.innerText = "Correo incorrecto";
        if(!nombre) return mensaje.innerText = "Nombre en blanco";
        if(!bdayValidator(fecha)) return mensaje.innerText = "Debe ser mayor de edad";

        try {
            await addUser({run, nombre, correo, clave, fecha});
            mensaje.innerText = "Formulario se envió correctamente";
            setTimeout(() => {
                window.location.href =
                correo.toLowerCase() === "admin@duoc.cl" 
                ? '/assets/page/perfilAdmin.html?nombre${encodeURIComponent(nombre)}'
                : '/assets/page/perfilCliente.html?nombre${encodeURIComponent(nombre)}';
            })
        } catch (error) {
            console.error("Error al guardar usuario: ", error);
            mensaje.innerText = "Error al guardar usuario en Firebase"
        }
    })
})