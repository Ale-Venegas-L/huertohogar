const products = [
  { id: 'FR001', name: 'Manzanas Fuji', price: 1200, stock: 150, description: '...', category: 'frutas', icon: '🍎' },
  { id: 'FR002', name: 'Naranjas Valencia', price: 1000, stock: 200, description: '...', category: 'frutas', icon: '🍊' },
  { id: 'VE001', name: 'Zanahorias Orgánicas', price: 800, stock: 100, description: '...', category: 'verduras', icon: '🥕' },
  { id: 'VE002', name: 'Lechuga Romana', price: 700, stock: 80, description: '...', category: 'verduras', icon: '🥬' },
  { id: 'OR001', name: 'Huevos de Campo', price: 3500, stock: 50, description: '...', category: 'organicos', icon: '🥚' },
  { id: 'OR002', name: 'Miel Pura de Abeja', price: 4500, stock: 30, description: '...', category: 'organicos', icon: '🍯' },
  { id: 'LA001', name: 'Leche Fresca', price: 1500, stock: 70, description: '...', category: 'lacteos', icon: '🥛' },
  { id: 'LA002', name: 'Yogurt Natural', price: 1200, stock: 60, description: '...', category: 'lacteos', icon: '🍦' },
];
function loadProducts(filter = 'todos') {
  const grid = document.getElementById('productsGrid');
  const filteredProducts = filter === 'todos' ? products : products.filter(p => p.category === filter);
  
  grid.innerHTML = filteredProducts.map(product => `
    <div class="product-card">
      <div class="product-image">${product.icon}</div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">${product.price.toLocaleString()} CLP/kg</div>
        <div class="product-stock">Stock: ${product.stock} kg disponibles</div>
        <p class="product-description">${product.description}</p>
        <button class="add-to-cart" onclick="addToCart('${product.id}')">
          <i class="fas fa-cart-plus"></i> Agregar al Carrito
        </button>
      </div>
    </div>
  `).join('');

}