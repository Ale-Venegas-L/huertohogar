// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA1uuBpcPsVXF17I5CxQV7AfIYO0n3hQBA",
    authDomain: "huertohogar-4fe45.firebaseapp.com",
    projectId: "huertohogar-4fe45",
  };

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productosOferta = [];

// Helpers de precio con descuento (desde Firebase)
function getPrecioUnitario(producto) {
    const base = Number(producto?.precio) || 0;
    // Si existe descuento estructurado
    const d = producto?.descuento;
    if (d && d.activo) {
        if (d.tipo === 'percent') {
            const pct = Math.min(Math.max(Number(d.valor) || 0, 0), 100);
            return Math.max(0, Math.round(base * (1 - pct / 100)));
        }
        if (d.tipo === 'fixed') {
            const val = Math.max(Number(d.valor) || 0, 0);
            return Math.max(0, Math.round(base - val));
        }
    }
    // Si viene precioAnterior, asumimos que precio ya es el valor con oferta
    if (producto?.precioAnterior) return Math.max(0, Math.round(base));
    return Math.max(0, Math.round(base));
}

function getSubtotal(producto) {
    const qty = Number(producto?.cantidad) || 1;
    return getPrecioUnitario(producto) * qty;
}

function getDiscountMeta(producto) {
    const base = Number(producto?.precio) || 0;
    const d = producto?.descuento;
    if (d && d.activo) {
        const current = getPrecioUnitario(producto);
        const original = Math.max(0, Math.round(base));
        const pct = original > 0 ? Math.round((1 - current / original) * 100) : 0;
        return { has: current < original, original, current, pct: Math.max(0, pct) };
    }
    if (producto?.precioAnterior) {
        const original = Math.max(0, Math.round(Number(producto.precioAnterior) || 0));
        const current = Math.max(0, Math.round(Number(producto.precio) || 0));
        const pct = original > 0 ? Math.round((1 - current / original) * 100) : 0;
        return { has: current < original, original, current, pct: Math.max(0, pct) };
    }
    const p = Math.max(0, Math.round(base));
    return { has: false, original: p, current: p, pct: 0 };
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarCarrito();
    cargarProductosOferta();
    configurarEventos();
});

/**
 * Inicializa la interfaz del carrito
 */
function inicializarCarrito() {
    actualizarCarritoHeader();
    renderizarCarrito();
    calcularTotal();
}

/**
 * Carga productos en oferta desde Firestore
 */
async function cargarProductosOferta() {
    try {
        const snapshot = await db.collection("producto").get();
        productosOferta = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Filtrar productos con oferta: precioAnterior o descuento activo
        const productosConOferta = productosOferta.filter(p => (p?.descuento && p.descuento.activo) || p?.precioAnterior);
        renderizarProductosOferta(productosConOferta);
    } catch (error) {
        console.error("Error cargando productos en oferta:", error);
    }
}

/**
 * Renderiza los productos en oferta
 */
function renderizarProductosOferta(productos) {
    const contenedor = document.getElementById('productosOferta');
    
    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No hay productos en oferta en este momento.</p>';
        return;
    }

    contenedor.innerHTML = productos.map(producto => {
        const m = getDiscountMeta(producto);
        return `
        <div class="producto-card">
            <img src="${producto.imagen}" 
                 alt="${producto.nombre}" 
                 class="producto-imagen"
                 onerror="this.src='https://via.placeholder.com/400x300/cccccc/969696?text=Imagen+No+Disponible'">
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <div class="precios-oferta">
                    ${m.has ? `<span class=\"precio-anterior\">$${m.original.toLocaleString('es-CL')}</span>` : ''}
                    <span class="precio-actual">$${m.current.toLocaleString('es-CL')}</span>
                    ${m.has ? `<span style=\"margin-left:8px; background:#e53935; color:#fff; border-radius:12px; padding:2px 8px; font-size:12px;\">-${m.pct}%</span>` : ''}
                </div>
                <p class="stock-disponible">Stock: ${producto.stock || 10}</p>
                <button class="btn-agregar-oferta" data-id="${producto.id}">
                    Añadir
                </button>
            </div>
        </div>
    `}).join('');

    // Agregar eventos a los botones de añadir
    document.querySelectorAll('.btn-agregar-oferta').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            agregarProductoAlCarrito(productId);
        });
    });
}

/**
 * Renderiza los productos en el carrito
 */
function renderizarCarrito() {
    const tbody = document.getElementById('tablaCarritoBody');
    
    if (carrito.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="carrito-vacio">
                    <div class="icono">🛒</div>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega algunos productos para continuar</p>
                    <a href="catalogo.html" class="btn-ir-catalogo">Ir al Catálogo</a>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = carrito.map((producto, index) => {
        const m = getDiscountMeta(producto);
        return `
        <tr>
            <td>
                <img src="${producto.imagen}" 
                     alt="${producto.nombre}" 
                     class="imagen-tabla"
                     onerror="this.src='https://via.placeholder.com/100x100/cccccc/969696?text=Imagen'">
            </td>
            <td>${producto.nombre}</td>
            <td>
                <div>
                    <span style="font-weight:600; color:#0a7b18;">$${m.current.toLocaleString('es-CL')}</span>
                    ${m.has ? `<span style="margin-left:8px; text-decoration: line-through; color:#777;">$${m.original.toLocaleString('es-CL')}</span>` : ''}
                    ${m.has ? `<span style="margin-left:8px; background:#e53935; color:#fff; border-radius:12px; padding:2px 8px; font-size:12px;">-${m.pct}%</span>` : ''}
                </div>
            </td>
            <td>
                <div class="controles-cantidad">
                    <button class="btn-cantidad" onclick="disminuirCantidad(${index})">-</button>
                    <span class="cantidad-actual">${producto.cantidad || 1}</span>
                    <button class="btn-cantidad" onclick="aumentarCantidad(${index})">+</button>
                </div>
            </td>
            <td>$${getSubtotal(producto).toLocaleString('es-CL')}</td>
            <td>
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">
                    Eliminar
                </button>
            </td>
        </tr>
    `}).join('');
}

/**
 * Agrega un producto al carrito
 */
function agregarProductoAlCarrito(productId) {
    const producto = productosOferta.find(p => p.id === productId);
    
    if (producto) {
        // Verificar stock antes de agregar
        if (producto.stock <= 0) {
            mostrarNotificacion('Producto sin stock disponible', 'error');
            return;
        }
        
        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.id === productId);
        
        if (productoExistente) {
            productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        
        // ACTUALIZAR STOCK EN FIREBASE - AGREGAR ESTA LÍNEA
        actualizarStockFirebase(productId, 1);
        
        mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);
    }
}

/**
 * Actualizar stock en Firebase cuando se agrega al carrito
 */
async function actualizarStockFirebase(productId, cantidad) {
    try {
        const productoRef = db.collection("producto").doc(productId);
        const productoDoc = await productoRef.get();
        
        if (productoDoc.exists) {
            const stockActual = productoDoc.data().stock;
            const nuevoStock = stockActual - cantidad;
            
            await productoRef.update({
                stock: nuevoStock
            });
            
            console.log(`Stock actualizado: ${productoDoc.data().nombre} - Nuevo stock: ${nuevoStock}`);
        }
    } catch (error) {
        console.error("Error actualizando stock en Firebase:", error);
    }
}

/**
 * Restaurar stock cuando se elimina del carrito
 */
async function restaurarStockFirebase(productId, cantidad) {
    try {
        const productoRef = db.collection("producto").doc(productId);
        const productoDoc = await productoRef.get();
        
        if (productoDoc.exists) {
            const stockActual = productoDoc.data().stock;
            const nuevoStock = stockActual + cantidad;
            
            await productoRef.update({
                stock: nuevoStock
            });
            
            console.log(`Stock restaurado: ${productoDoc.data().nombre} - Nuevo stock: ${nuevoStock}`);
        }
    } catch (error) {
        console.error("Error restaurando stock en Firebase:", error);
    }
}


/**
 * Aumenta la cantidad de un producto en el carrito
 */
function aumentarCantidad(index) {
    const producto = carrito[index];
    
    // Verificar stock antes de aumentar
    if (producto.stock <= producto.cantidad) {
        mostrarNotificacion('No hay suficiente stock disponible', 'error');
        return;
    }
    
    carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
    guardarCarrito();
    renderizarCarrito();
    calcularTotal();
    
    // Actualizar stock en Firebase
    actualizarStockFirebase(producto.id, 1);
}


/**
 * Disminuye la cantidad de un producto en el carrito
 */
function disminuirCantidad(index) {
    const producto = carrito[index];
    
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        
        // Restaurar stock en Firebase
        restaurarStockFirebase(producto.id, 1);
    }
}

/**
 * Elimina un producto del carrito
 */
function eliminarDelCarrito(index) {
    const producto = carrito[index];
    const cantidadEliminada = producto.cantidad || 1;
    
    carrito.splice(index, 1);
    guardarCarrito();
    renderizarCarrito();
    calcularTotal();
    mostrarNotificacion(`"${producto.nombre}" eliminado del carrito`);

    // Llamar a esta función para restaurar stock - CORREGIDO
    restaurarStockFirebase(producto.id, cantidadEliminada);
}

/**
 * Calcula el total del carrito
 */
function calcularTotal() {
    const total = carrito.reduce((sum, producto) => {
        return sum + getSubtotal(producto);
    }, 0);
    
    document.getElementById('totalCarrito').textContent = total.toLocaleString('es-CL');
    actualizarCarritoHeader();
}

/**
 * Actualiza el header del carrito
 */
function actualizarCarritoHeader() {
    const total = carrito.reduce((sum, producto) => {
        return sum + getSubtotal(producto);
    }, 0);
    
    document.querySelector('.carrito-total').textContent = total.toLocaleString('es-CL');
}

/**
 * Guarda el carrito en localStorage
 */
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

/**
 * Limpia todo el carrito
 */
function limpiarCarrito() {
    if (carrito.length === 0) {
        alert('El carrito ya está vacío');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres limpiar todo el carrito?')) {
        carrito = [];
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        mostrarNotificacion('Carrito limpiado correctamente');
    }
}

/**
 * Redirige al checkout
 */
function irAlCheckout() {
    if (carrito.length === 0) {
        alert('Agrega productos al carrito antes de continuar');
        return;
    }
    
    window.location.href = 'checkout.html';
}

/**
 * Muestra una notificación temporal
 */
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        font-weight: 600;
    `;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

/**
 * Configura los eventos de la página
 */
function configurarEventos() {
    document.getElementById('btnLimpiarCarrito').addEventListener('click', limpiarCarrito);
    document.getElementById('btnComprarAhora').addEventListener('click', irAlCheckout);
}

// Hacer funciones disponibles globalmente
window.aumentarCantidad = aumentarCantidad;
window.disminuirCantidad = disminuirCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;