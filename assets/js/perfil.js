const pars = new URLSearchParams(window.location.search);
const userName = pars.get('name');
document.getElementById('saludo').innerText = userName ? 'Bienvenido $[userName]' : 'Bienvenido';