import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Exito.css';

/**
 * Componente de Compra Exitosa
 * Muestra los detalles de la compra completada
 */
const CompraExitosa = () => {
  const [compra, setCompra] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ultimaCompra = JSON.parse(localStorage.getItem('ultimaCompra'));
    
    if (!ultimaCompra) {
      navigate('/carrito');
      return;
    }

    setCompra(ultimaCompra);
  }, [navigate]);

  const imprimirBoletaPDF = () => {
    if (!compra) return;
    try {
      const fecha = new Date().toLocaleDateString('es-CL');
      const contenidoBoleta = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Boleta de Compra - Orden ${compra.numeroOrden}</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .info-cliente { margin-bottom: 20px; }
            .tabla-productos { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .tabla-productos th, .tabla-productos td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .tabla-productos th { background-color: #f2f2f2; }
            .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BOLETA ELECTRÓNICA</h1>
            <p>Orden: ${compra.numeroOrden} | Fecha: ${fecha}</p>
          </div>
          <div class="info-cliente">
            <h3>Datos del Cliente</h3>
            <p><strong>Nombre:</strong> ${compra.cliente.nombre} ${compra.cliente.apellidos}</p>
            <p><strong>Email:</strong> ${compra.cliente.correo}</p>
            <p><strong>Dirección:</strong> ${compra.direccion.calle}, ${compra.direccion.departamento || ''}</p>
            <p><strong>Comuna:</strong> ${compra.direccion.comuna}, ${compra.direccion.region}</p>
            ${compra.direccion.indicaciones ? `<p><strong>Indicaciones:</strong> ${compra.direccion.indicaciones}</p>` : ''}
          </div>
          <table class="tabla-productos">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${compra.productos.map(p => `
                <tr>
                  <td>${p.nombre}</td>
                  <td>$${(p.precio || 0).toLocaleString('es-CL')}</td>
                  <td>${p.cantidad || 1}</td>
                  <td>$${(((p.precio || 0)) * (p.cantidad || 1)).toLocaleString('es-CL')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">TOTAL: $${compra.total.toLocaleString('es-CL')}</div>
          <div class="footer">
            <p>¡Gracias por su compra!</p>
            <p>Este documento es una boleta electrónica generada automáticamente</p>
          </div>
        </body>
        </html>
      `;
      const w = window.open('', '_blank');
      if (!w) return alert('No se pudo abrir la ventana de impresión');
      w.document.write(contenidoBoleta);
      w.document.close();
      w.onload = function() {
        w.print();
        setTimeout(() => w.close(), 500);
      };
    } catch (e) {
      console.error('Error al generar la boleta:', e);
      alert('Error al generar la boleta. Por favor, intente nuevamente.');
    }
  };

  const enviarBoletaEmail = () => {
    if (!compra) return;
    try {
      const email = compra.cliente.correo;
      const btn = document.getElementById('btnEnviarEmail');
      const original = btn ? btn.innerHTML : '';
      if (btn) { btn.innerHTML = 'Enviando...'; btn.disabled = true; }
      setTimeout(() => {
        if (btn) { btn.innerHTML = original || 'Enviar Boleta por Email'; btn.disabled = false; }
        alert(`La boleta ha sido enviada exitosamente a ${email}`);
      }, 1500);
    } catch (e) {
      alert('Error al enviar la boleta. Por favor, intente nuevamente.');
    }
  };

  if (!compra) {
    return (
      <div className="cargando">
        <div className="spinner">🔄</div>
        <p>Cargando detalles de la compra...</p>
      </div>
    );
  }

  return (
    <div className="exito-container">
      {/* Encabezado */}
      <div className="exito-header">
        <span className="codigo-orden">{compra.numeroOrden}</span>
        <div className="exito-titulo">
          <span className="icono-exito">✅</span>
          <h1>Se ha realizado la compra nro <span>{compra.numeroOrden}</span></h1>
        </div>
        <p className="exito-subtitulo">Completa la siguiente información</p>
      </div>

      {/* Información del Cliente */}
      <section className="info-cliente">
        <h2 className="section-title">Información del Cliente</h2>
        
        <div className="form-cliente readonly">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input 
                type="text" 
                value={compra.cliente.nombre} 
                readOnly 
              />
            </div>
            <div className="form-group">
              <label>Apellidos</label>
              <input 
                type="text" 
                value={compra.cliente.apellidos} 
                readOnly 
              />
            </div>
            <div className="form-group">
              <label>Correo</label>
              <input 
                type="email" 
                value={compra.cliente.correo} 
                readOnly 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dirección de Entrega */}
      <section className="direccion-entrega">
        <h2 className="section-title">Dirección de entrega de los productos</h2>
        
        <div className="form-direccion readonly">
          <div className="form-row">
            <div className="form-group">
              <label>Calle</label>
              <input 
                type="text" 
                value={compra.direccion.calle} 
                readOnly 
              />
            </div>
            <div className="form-group">
              <label>Departamento</label>
              <input 
                type="text" 
                value={compra.direccion.departamento || 'N/A'} 
                readOnly 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Región</label>
              <input 
                type="text" 
                value={compra.direccion.region} 
                readOnly 
              />
            </div>
            <div className="form-group">
              <label>Comuna</label>
              <input 
                type="text" 
                value={compra.direccion.comuna} 
                readOnly 
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label>Indicaciones</label>
            <textarea 
              value={compra.direccion.indicaciones || 'Ninguna'} 
              readOnly 
            />
          </div>
        </div>
      </section>

      {/* Tabla de Productos */}
      <div className="tabla-checkout-container">
        <table className="tabla-checkout">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio $</th>
              <th>Cantidad</th>
              <th>Subtotal $</th>
            </tr>
          </thead>
          <tbody>
            {compra.productos.map((producto, index) => (
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
                <td>${producto.precio?.toLocaleString('es-CL')}</td>
                <td>{producto.cantidad || 1}</td>
                <td>
                  ${((producto.precio || 0) * (producto.cantidad || 1)).toLocaleString('es-CL')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Pagado */}
      <div className="total-pagado-container">
        <div className="total-pagado">
          <span className="total-text">Total Pagado: $</span>
          <span className="total-precio">
            {compra.total.toLocaleString('es-CL')}
          </span>
        </div>
      </div>

      {/* Botones Finales */}
      <div className="exito-footer">
        <button 
          className="btn-imprimir-pdf"
          onClick={imprimirBoletaPDF}
        >
          Imprimir Boleta en PDF
        </button>
        <button 
          className="btn-enviar-email"
          id="btnEnviarEmail"
          onClick={enviarBoletaEmail}
        >
          Enviar Boleta por Email
        </button>
      </div>
    </div>
  );
};

export default CompraExitosa;