import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../../styles/Checkout.css';

const Checkout = () => {
  const [carrito, setCarrito] = useState([]);
  const [formData, setFormData] = useState({
    cliente: {
      nombre: '',
      apellidos: '',
      correo: ''
    },
    direccion: {
      calle: '',
      departamento: '',
      region: '',
      comuna: '',
      indicaciones: ''
    }
  });
  const [procesando, setProcesando] = useState(false);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const navigate = useNavigate();

  // Cargar carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);

    if (carritoGuardado.length === 0) {
      navigate('/carrito');
    }
  }, [navigate]);

  // Datos de regiones y comunas (resumen de public/checkout.js)
  const regionesComunas = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
    "Metropolitana": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
    "O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
    "Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
    "Ñuble": ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ránquil", "Treguaco", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"],
    "Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualpén", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío", "Lebú", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa"],
    "Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
    "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
    "Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
    "Aysén": ["Coihaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
    "Magallanes": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
  };

  // Cargar regiones al iniciar
  useEffect(() => {
    const r = Object.keys(regionesComunas).sort();
    setRegiones(r);
  }, []);

  // Cuando cambia la región, cargar comunas y limpiar comuna seleccionada
  useEffect(() => {
    const region = formData.direccion.region;
    const lista = region ? [...(regionesComunas[region] || [])].sort() : [];
    setComunas(lista);
    if (!region) {
      setFormData((prev) => ({
        ...prev,
        direccion: { ...prev.direccion, comuna: '' }
      }));
    } else if (lista.length && !lista.includes(formData.direccion.comuna)) {
      setFormData((prev) => ({
        ...prev,
        direccion: { ...prev.direccion, comuna: '' }
      }));
    }
  }, [formData.direccion.region]);

  /**
   * Maneja cambios en los campos del formulario
   */
  const handleInputChange = (seccion, campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [seccion]: {
        ...prev[seccion],
        [campo]: valor
      }
    }));
  };

  /**
   * Valida todos los campos del formulario
   */
  const validarFormulario = () => {
    const { cliente, direccion } = formData;
    
    // Validar campos requeridos del cliente
    if (!cliente.nombre.trim() || !cliente.apellidos.trim() || !cliente.correo.trim()) {
      alert('Por favor completa todos los campos del cliente');
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cliente.correo)) {
      alert('Por favor ingresa un email válido');
      return false;
    }

    // Validar campos requeridos de dirección
    if (!direccion.calle.trim() || !direccion.region.trim() || !direccion.comuna.trim()) {
      alert('Por favor completa todos los campos obligatorios de la dirección');
      return false;
    }

    return true;
  };

  /**
   * Procesa el pago y guarda la compra en Firestore
   */
  const procesarPago = async () => {
    if (!validarFormulario()) return;

    setProcesando(true);

    try {
      const total = carrito.reduce((sum, producto) => sum + getSubtotal(producto), 0);

      // Crear objeto de compra
      const compra = {
        fecha: new Date(),
        fechaTimestamp: new Date(),
        cliente: formData.cliente,
        direccion: formData.direccion,
        productos: carrito,
        total: total,
        subtotal: total,
        estado: 'pendiente',
        numeroOrden: generarNumeroOrden(),
        metodoPago: 'tarjeta',
        estadoEntrega: 'pendiente'
      };

      console.log('Guardando compra en Firestore:', compra);

      //GUARDAR COMPRA EN FIRESTORE
      const docRef = await addDoc(collection(db, 'compras'), compra);
      console.log('Compra guardada con ID:', docRef.id);

      // Simular procesamiento de pago (80% éxito)
      const pagoExitoso = Math.random() > 0.2;
      
      if (pagoExitoso) {
        //PAGO EXITOSO - Actualizar estado en Firestore
        await updateDoc(doc(db, 'compras', docRef.id), {
          estado: 'completada',
          pagoExitoso: true,
          fechaCompletada: new Date()
        });

        // Limpiar carrito y redirigir a éxito
        localStorage.removeItem('carrito');
        localStorage.setItem('ultimaCompra', JSON.stringify({
          ...compra,
          id: docRef.id
        }));

        navigate(`/exito?orden=${compra.numeroOrden}&id=${docRef.id}`);
      } else {
        // PAGO FALLIDO - Actualizar estado en Firestore
        await updateDoc(doc(db, 'compras', docRef.id), {
          estado: 'fallida',
          pagoExitoso: false,
          errorPago: 'Fallo en el procesamiento del pago'
        });

        localStorage.setItem('ultimaCompra', JSON.stringify({
          ...compra,
          id: docRef.id
        }));

        navigate(`/error-pago?orden=${compra.numeroOrden}&id=${docRef.id}`);
      }

    } catch (error) {
      console.error('Error procesando la compra:', error);
      alert('Error al procesar la compra. Intenta nuevamente.');
    } finally {
      setProcesando(false);
    }
  };

  /**
   * Genera número de orden único
   */
  const generarNumeroOrden = () => {
    const fecha = new Date();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${fecha.getFullYear()}${(fecha.getMonth()+1).toString().padStart(2, '0')}${fecha.getDate().toString().padStart(2, '0')}${random}`;
  };

  /**
   * Calcula el total del carrito
   */
  const calcularTotal = () => {
    return carrito.reduce((total, producto) => {
      return total + getSubtotal(producto);
    }, 0);
  };

  // Helpers de precio con descuento (reutilizados de Carrito)
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

  if (carrito.length === 0) {
    return (
      <div className="carrito-vacio">
        <div className="icono">🛒</div>
        <h3>No hay productos en el carrito</h3>
        <button 
          className="btn-ir-catalogo"
          onClick={() => navigate('/carrito')}
        >
          Volver al Carrito
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      {/* Encabezado del Checkout */}
      <div className="checkout-header">
        <div className="checkout-titulos">
          <h1 className="checkout-titulo">Carrito de Compra</h1>
          <p className="checkout-subtitulo">Completa la siguiente información</p>
        </div>
        <div className="btn-total-pagar">
          Total a Pagar: ${calcularTotal().toLocaleString('es-CL')}
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="tabla-checkout-container">
        <table className="tabla-checkout">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio $</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((producto, index) => (
              <tr key={index}>
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
                <td>{(() => { const m = getDiscountMeta(producto); return (
                  <div>
                    <span style={{fontWeight:600, color:'#0a7b18'}}>${m.current.toLocaleString('es-CL')}</span>
                    {m.has && <span style={{marginLeft:8, textDecoration:'line-through', color:'#777'}}>${m.original.toLocaleString('es-CL')}</span>}
                    {m.has && <span style={{marginLeft:8, background:'#e53935', color:'#fff', borderRadius:12, padding:'2px 8px', fontSize:12}}>-{m.pct}%</span>}
                  </div>
                ); })()}</td>
                <td>{producto.cantidad || 1}</td>
                <td>
                  ${getSubtotal(producto).toLocaleString('es-CL')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Información del Cliente */}
      <section className="info-cliente">
        <h2 className="section-title">Información del Cliente</h2>
        <p className="section-subtitle">Completa la siguiente información</p>
        
        <div className="form-cliente">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                value={formData.cliente.nombre}
                onChange={(e) => handleInputChange('cliente', 'nombre', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellidos">Apellidos *</label>
              <input
                type="text"
                id="apellidos"
                value={formData.cliente.apellidos}
                onChange={(e) => handleInputChange('cliente', 'apellidos', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input
              type="email"
              id="correo"
              value={formData.cliente.correo}
              onChange={(e) => handleInputChange('cliente', 'correo', e.target.value)}
              required
            />
          </div>
        </div>
      </section>

      {/* Dirección de Entrega */}
      <section className="direccion-entrega">
        <h2 className="section-title">Dirección de entrega de los productos</h2>
        <p className="section-subtitle">Ingrese dirección de forma detallada</p>
        
        <div className="form-direccion">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="calle">Calle *</label>
              <input
                type="text"
                id="calle"
                value={formData.direccion.calle}
                onChange={(e) => handleInputChange('direccion', 'calle', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="departamento">Departamento (Opcional)</label>
              <input
                type="text"
                id="departamento"
                value={formData.direccion.departamento}
                onChange={(e) => handleInputChange('direccion', 'departamento', e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="region">Región *</label>
              <select
                id="region"
                value={formData.direccion.region}
                onChange={(e) => handleInputChange('direccion', 'region', e.target.value)}
                onBlur={(e) => { e.target.style.borderColor = e.target.value ? '#28a745' : '#dc3545'; }}
                required
              >
                <option value="">Selecciona una región</option>
                {regiones.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="comuna">Comuna *</label>
              <select
                id="comuna"
                value={formData.direccion.comuna}
                onChange={(e) => handleInputChange('direccion', 'comuna', e.target.value)}
                onBlur={(e) => { e.target.style.borderColor = e.target.value ? '#28a745' : '#dc3545'; }}
                disabled={!formData.direccion.region}
                required
              >
                <option value="">{formData.direccion.region ? 'Selecciona una comuna' : 'Primero selecciona una región'}</option>
                {comunas.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group full-width">
            <label htmlFor="indicaciones">Indicaciones para la entrega (Opcional)</label>
            <textarea
              id="indicaciones"
              rows="3"
              value={formData.direccion.indicaciones}
              onChange={(e) => handleInputChange('direccion', 'indicaciones', e.target.value)}
              placeholder="Ej: Timbre azul, dejar con conserje..."
            />
          </div>
        </div>
      </section>

      {/* Botón Final */}
      <div className="checkout-footer">
        <button 
          className="btn-pagar-ahora"
          onClick={procesarPago}
          disabled={procesando}
        >
          {procesando ? '⏳ Procesando pago...' : `Pagar Ahora: $${calcularTotal().toLocaleString('es-CL')}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;