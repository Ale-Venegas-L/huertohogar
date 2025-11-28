import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import "../../styles/catalogo.css";

import React, { useEffect, useMemo, useState } from "react";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState(() => JSON.parse(localStorage.getItem("carrito") || "[]"));
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "producto"));
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProductos(items);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const categorias = useMemo(() => {
    const set = new Set();
    productos.forEach((p) => p.categoria && set.add(p.categoria));
    return Array.from(set);
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    let lista = productos;
    if (categoriaActiva !== "todos") {
      lista = lista.filter((p) => p.categoria === categoriaActiva);
    }
    const term = busqueda.trim().toLowerCase();
    if (term) {
      lista = lista.filter(
        (p) =>
          p.nombre?.toLowerCase().includes(term) ||
          p.categoria?.toLowerCase().includes(term) ||
          p.descripcion?.toLowerCase().includes(term)
      );
    }
    return lista;
  }, [productos, categoriaActiva, busqueda]);

  const agregarAlCarrito = (idProducto) => {
    const producto = productos.find((p) => p.id === idProducto);
    if (!producto) return;
    setCarrito((prev) => {
      // Si el producto ya está, incrementa cantidad
      const idx = prev.findIndex((x) => x.id === producto.id);
      if (idx !== -1) {
        const nuevo = [...prev];
        const actual = nuevo[idx];
        nuevo[idx] = { ...actual, cantidad: (actual.cantidad || 1) + 1 };
        return nuevo;
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    alert(`"${producto.nombre}" agregado al carrito`);
  };

  // totalCarrito was removed because it wasn't used; compute it where needed.

  const onBuscar = () => {
    // No se requiere lógica extra: setBusqueda ya filtra en memo
    setBusqueda((v) => v.trim());
  };

  if (cargando) {
    return (
      <div className="main">
        <h2 className="section-title">Cargando productos...</h2>
      </div>
    );
  }

  return (
    <main className="main">
      <div className="header-top" >
        <div className="search-container">
          <input
            className="search-input"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onBuscar();
            }}
          />
          <button className="btn-buscar" onClick={onBuscar}>Buscar</button>
        </div>
      </div>

      {/* Categorías: dropdown y cards */}
      <section className="categorias-section">
        <h2 className="section-title">Categorías</h2>
        <div className="categorias-filtros">
          <div className="dropdown">
            <button className="btn-ver-todos">Seleccionar categoría ▾</button>
            <div className="dropdown-content" id="dropdownCategorias">
              {categorias.map((cat) => (
                <span key={cat} className="dropdown-item" onClick={() => setCategoriaActiva(cat)}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <button className="btn-ver-todos" onClick={() => { setCategoriaActiva("todos"); setBusqueda(""); }}>Ver todos</button>
        </div>

        <div className="categorias-grid" id="cardsCategorias">
          {categorias.map((cat) => (
            <div key={cat} className="categoria-card" onClick={() => setCategoriaActiva(cat)}>
              <div className="categoria-img">📦</div>
              <div className="categoria-nombre">{cat}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Productos */}
      <section className="productos-section">
        <h2 className="section-title" id="tituloProductos">
          {categoriaActiva === "todos"
            ? `Todos los productos (${productosFiltrados.length})`
            : `${categoriaActiva} (${productosFiltrados.length})`}
        </h2>

        {productosFiltrados.length === 0 ? (
          <div>
            <p >No se encontraron productos</p>
            <button className="btn-signup" onClick={() => { setCategoriaActiva("todos"); setBusqueda(""); }}>Ver todos los productos</button>
          </div>
        ) : (
          <div className="productos-grid" id="productosGrid">
            {productosFiltrados.map((p) => (
              <div className="producto-card" key={p.id}>
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="producto-imagen"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x300/cccccc/969696?text=Imagen+No+Disponible";
                  }}
                />
                <div className="producto-info">
                  <h3 className="producto-nombre">{p.nombre || "Sin nombre"}</h3>
                  <p className="producto-stock">Stock: {p.stock ?? 0}</p>
                  <p className="producto-precio">${(p.precio || 0).toLocaleString("es-CL")}</p>
                  <button className="btn-agregar" onClick={() => agregarAlCarrito(p.id)}>
                    🛒 Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Catalogo;
