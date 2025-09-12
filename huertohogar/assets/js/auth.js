let currentUser = null;

function login(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (email && password) {
    currentUser = { email, name: email.split('@')[0] };
    updateAuthUI();
    showNotification('¡Bienvenido a HuertoHogar!');
    showSection('home');
  } else {
    alert('Por favor completa todos los campos');
  }
}

function register(event) {
  event.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const phone = document.getElementById('registerPhone').value;
  const address = document.getElementById('registerAddress').value;
  const password = document.getElementById('registerPassword').value;

  if (name && email && phone && address && password) {
    currentUser = { name, email, phone, address };
    updateAuthUI();
    showNotification('¡Cuenta creada exitosamente!');
    showSection('home');
  } else {
    alert('Por favor completa todos los campos');
  }
}

function logout() {
  currentUser = null;
  cart = [];
  updateCartCount();
  updateAuthUI();
  showNotification('Sesión cerrada');
  showSection('home');
}

function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');

  if (currentUser) {
    loginBtn.textContent = `Hola, ${currentUser.name}`;
    loginBtn.onclick = null;
    registerBtn.textContent = 'Cerrar Sesión';
    registerBtn.onclick = logout;
  } else {
    loginBtn.textContent = 'Iniciar Sesión';
    loginBtn.onclick = () => showSection('login');
    registerBtn.textContent = 'Registrarse';
    registerBtn.onclick = () => showSection('register');
  }
}