/*valores a validar: run, nombre, apellido, correo, contraseña,
fecha de nacimiento ,seleccion de region y comuna*/


function runValidator(run){
    const regex = /^\d{7,8}[0-9K]$/i;
    return regex.test(run);
}

function validarCorreo(correo) {
    const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

document.querySelector('form').addEventListener("submit", function(e){
    e.preventDefault();
    let run = document.getElementById("run").value.trim();
    let name = document.getElementById("name").value.trim();
    let surname = document.getElementById("surname").value.trim();
    let email = document.getElementById("email").value.trim();
    let psswd = document.getElementById("psswd").value.trim();
    let psswd2 = document.getElementById("psswd2").value.trim();
    let message = "";
    const inputMail = document.getElementById("email");

    inputMail.setCustomValidity("");

    if(!runValidator(run)){
        message += "RUN invalido. ";
    } else if(!validarCorreo(email)){
        inputMail.setCustomValidity("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com");
        inputMail.reportValidity();
        return;
    }else if(name === ""){
        message += "Nombre es obligatorio. ";
    }else if(surname==""){
        message += "Apellido es obligatorio. ";
    }else if(psswd!==psswd2){
        message += "Contraseña no combina. ";
    }else{
        message = "Formulario enviado correctamente.";
    }

    document.getElementById("msj").innerText(message);

    let userName = name;
    const dest = email.toLowerCase() === "admin@duoc.cl" ?
        'perfil/perfilAdmin.html?name=$[encodeURIComponent(userName)]':
        'perfil/perfilCliente.html?name=$[encodeURIComponent(userName)]';
    message.innerText = 'Bienvenido $[userName]!'

    setTimeout(() => {
            window.location.href = destino;
        }, 1500);
})