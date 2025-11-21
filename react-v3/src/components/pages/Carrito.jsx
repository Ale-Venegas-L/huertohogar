import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../../styles/Carrito.css';

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [productosOferta, setProductosOferta] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  // Helpers de precio y descuentos (alineados con public/carrito.js)
  const getPrecioUnitario = (producto) => {
    const base = Number(producto?.precio) || 0;
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
    if (producto?.precioAnterior) return Math.max(0, Math.round(base));
    return Math.max(0, Math.round(base));
  };

  const getSubtotal = (producto) => {
    const qty = Number(producto?.cantidad) || 1;
    return getPrecioUnitario(producto) * qty;
  };

  const getDiscountMeta = (producto) => {
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
  };

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
    cargarProductosOferta();
  }, []);

  const cargarProductosOferta = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'producto'));
      const productos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const productosConOferta = productos.filter(producto => (producto?.descuento && producto.descuento.activo) || producto?.precioAnterior);
      setProductosOferta(productosConOferta);
    } catch (error) {
      console.error('Error cargando productos en oferta:', error);
    } finally {
      setCargando(false);
    }
  };

  const agregarAlCarrito = async (producto) => {
    // Verificar stock antes
    if ((producto.stock ?? 0) <= 0) {
      alert('Producto sin stock disponible');
      return;
    }
    const productoExistente = carrito.find(item => item.id === producto.id);
    let nuevoCarrito;

    if (productoExistente) {
      // Verificar stock disponible para aumentar
      if ((producto.stock ?? 0) <= (productoExistente.cantidad || 1) ) {
        alert('No hay suficiente stock disponible');
        return;
      }
      nuevoCarrito = carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: (item.cantidad || 1) + 1 }
          : item
      );
    } else {
      nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
    }

    setCarrito(nuevoCarrito);
    guardarCarrito(nuevoCarrito);
    try {
      await actualizarStockFirebase(producto.id, 1);
    } catch (e) {
      console.error('No se pudo actualizar stock:', e);
    }
    mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);
  };

  const actualizarCantidad = async (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    const item = carrito[index];
    const delta = (nuevaCantidad - (item.cantidad || 1));
    let permitido = true;
    if (delta > 0) {
      // Validar stock remoto actual
      try {
        const ref = doc(db, 'producto', item.id);
        const snap = await getDoc(ref);
        const stockActual = snap.exists() ? (snap.data().stock ?? 0) : 0;
        if (stockActual < delta) permitido = false;
      } catch (e) { console.error(e); }
      if (!permitido) { alert('No hay suficiente stock disponible'); return; }
    }

    const nuevoCarrito = carrito.map((p, i) => i === index ? { ...p, cantidad: nuevaCantidad } : p);
    setCarrito(nuevoCarrito);
    guardarCarrito(nuevoCarrito);

    try {
      if (delta > 0) await actualizarStockFirebase(item.id, delta);
      else if (delta < 0) await restaurarStockFirebase(item.id, -delta);
    } catch (e) { console.error('Error sincronizando stock:', e); }
  };

  const eliminarDelCarrito = async (index) => {
    const producto = carrito[index];
    const cantidadEliminada = producto.cantidad || 1;
    const nuevoCarrito = carrito.filter((_, i) => i !== index);

    setCarrito(nuevoCarrito);
    guardarCarrito(nuevoCarrito);
    mostrarNotificacion(`"${producto.nombre}" eliminado del carrito`);
    try { await restaurarStockFirebase(producto.id, cantidadEliminada); } catch (e) { console.error(e); }
  };

  const guardarCarrito = (nuevoCarrito) => {
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const limpiarCarrito = () => {
    if (carrito.length === 0) {
      alert('El carrito ya está vacío');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres limpiar todo el carrito?')) {
      setCarrito([]);
      localStorage.removeItem('carrito');
      mostrarNotificacion('Carrito limpiado correctamente');
    }
  };

  const irAlCheckout = () => {
    if (carrito.length === 0) {
      alert('Agrega productos al carrito antes de continuar');
      return;
    }
    navigate('/checkout');
  };

  const mostrarNotificacion = (mensaje) => {
    alert(mensaje);
  };

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => {
      return total + getSubtotal(producto);
    }, 0);
  };

  // Actualizar stock en Firestore (disminuye stock al agregar/aumentar)
  const actualizarStockFirebase = async (productId, cantidad) => {
    const ref = doc(db, 'producto', productId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const stockActual = snap.data().stock ?? 0;
      await updateDoc(ref, { stock: stockActual - cantidad });
    }
  };

  // Restaurar stock en Firestore (al disminuir/eliminar)
  const restaurarStockFirebase = async (productId, cantidad) => {
    const ref = doc(db, 'producto', productId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const stockActual = snap.data().stock ?? 0;
      await updateDoc(ref, { stock: stockActual + cantidad });
    }
  };

  if (cargando) {
    return (
      <div className="cargando">
        <div className="spinner">🔄</div>
        <p>Cargando productos en oferta...</p>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      {/* Productos en Oferta */}
      <section className="ofertas-section">
        <h2 className="section-title">Productos en Oferta</h2>
        <div className="productos-grid">
          {productosOferta.length === 0 ? (
            <p className="sin-ofertas">No hay productos en oferta en este momento.</p>
          ) : (
            productosOferta.map(producto => (
              <div key={producto.id} className="producto-card">
                <img 
                  src={producto.imagen} 
                  alt={producto.nombre}
                  className="producto-imagen"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/cccccc/969696?text=Imagen+No+Disponible';
                  }}
                />
                <div className="producto-info">
                  <h3 className="producto-nombre">{producto.nombre}</h3>
                  <div className="precios-oferta">
                    <span className="precio-anterior">
                      ${producto.precioAnterior?.toLocaleString('es-CL')}
                    </span>
                    <span className="precio-actual">
                      ${producto.precio?.toLocaleString('es-CL')}
                    </span>
                  </div>
                  <p className="stock-disponible">
                    Stock: {producto.stock || 10}
                  </p>
                  <button 
                    className="btn-agregar-oferta"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    Añadir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="resumen-carrito">
        <h2 className="section-title">Resumen del Carrito</h2>
        
        <div className="tabla-carrito-container">
          <table className="tabla-carrito">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carrito.length === 0 ? (
                <tr>
                  <td colSpan="6" className="carrito-vacio">
                    <div className="icono">🛒</div>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega algunos productos para continuar</p>
                    <button 
                      className="btn-ir-catalogo"
                      onClick={() => navigate('/catalogo')}
                    >
                      Ir al Catálogo
                    </button>
                  </td>
                </tr>
              ) : (
                carrito.map((producto, index) => (
                  <tr key={`${producto.id}-${index}`}>
                    <td>
                      <img 
                        src={producto.imagen} 
                        alt={producto.nombre}
                        className="imagen-tabla"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100/cccccc/969696?text=Imagen';
                        }}
                      />
                    </td>
                    <td>{producto.nombre}</td>
                    <td>
                      {(() => { const m = getDiscountMeta(producto); return (
                        <div>
                          <span style={{fontWeight:600, color:'#0a7b18'}}>${'{'}m.current.toLocaleString('es-CL'){'}'}</span>
                          {m.has && <span style={{marginLeft:8, textDecoration:'line-through', color:'#777'}}>${'{'}m.original.toLocaleString('es-CL'){'}'}</span>}
                          {m.has && <span style={{marginLeft:8, background:'#e53935', color:'#fff', borderRadius:12, padding:'2px 8px', fontSize:12}}>-{ '{'}m.pct{'}'}%</span>}
                        </div>
                      ); })()}
                  </td>
                    <td>
                      <div className="controles-cantidad">
                        <button 
                          className="btn-cantidad"
                          onClick={() => actualizarCantidad(index, (producto.cantidad || 1) - 1)}
                        >
                          -
                        </button>
                        <span className="cantidad-actual">
                          {producto.cantidad || 1}
                        </span>
                        <button 
                          className="btn-cantidad"
                          onClick={() => actualizarCantidad(index, (producto.cantidad || 1) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      ${'{'}getSubtotal(producto).toLocaleString('es-CL'){'}'}
                    </td>
                    <td>
                      <button 
                        className="btn-eliminar"
                        onClick={() => eliminarDelCarrito(index)}
                      >
                       Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {carrito.length > 0 && (
          <div className="carrito-footer">
            <div className="total-container">
              <span className="total-text">Total: $</span>
              <span className="total-precio">
                {calcularTotal().toLocaleString('es-CL')}
              </span>
            </div>
            <div className="botones-carrito">
              <button 
                className="btn-limpiar"
                onClick={limpiarCarrito}
              >
                Limpiar Carrito
              </button>
              <button 
                className="btn-comprar-ahora"
                onClick={irAlCheckout}
              >
                Comprar Ahora
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Carrito;