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

function bdayValidator(bday){
    const hoy = new Date();
    const fechaNac = new Date(bday);
    let edad = hoy.getFullYear()-fechaNac.getFullYear();
    const mes = hoy.getMonth()-fechaNac.getMonth();

    if (mes < 0 || (mes===0 && hoy.getDate()<fechaNac.getDate())) {
        edad--;
    }
    return edad >=18;
}