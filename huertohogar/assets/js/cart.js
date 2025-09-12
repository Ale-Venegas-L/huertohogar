let cart = [];

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    showNotification(`${product.name} ya está en tu carrito`);
    return;
  }

  cart.push({ ...product, quantity: 1 });
  updateCartCount();
  showNotification(`${product.name} agregado al carrito`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  updateCartDisplay();
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartCount();
      updateCartDisplay();
    }
  }
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Tu carrito está vacío</p>';
    cartTotal.textContent = '0';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="cart-item-price">${item.price.toLocaleString()} CLP</div>
      </div>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
        <span style="margin: 0 0.5rem;">${item.quantity}</span>
        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
        <button class="quantity-btn" onclick="removeFromCart('${item.id}')" style="background: #dc3545; margin-left: 0.5rem;">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total.toLocaleString();
}

function openCart() {
  updateCartDisplay();
  document.getElementById('cartModal').style.display = 'block';
}

function closeCart() {
  document.getElementById('cartModal').style.display = 'none';
}

function checkout() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  if (!currentUser) {
    alert('Debes iniciar sesión para realizar una compra');
    closeCart();
    showSection('login');
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  alert(`¡Compra realizada con éxito!\nTotal: ${total.toLocaleString()} CLP\nTus productos serán entregados en 2-3 días hábiles.`);

  cart = [];
  updateCartCount();
  closeCart();
}
