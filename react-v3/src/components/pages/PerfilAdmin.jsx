// src/components/pages/PerfilAdmin.jsx
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { 
  userManager, 
  productManager, 
  orderManager, 
  categoryManager 
} from '../../services/crudManager';
import '../../styles/profile.css';

const PerfilAdmin = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    categories: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, products, orders, categories] = await Promise.all([
          userManager.getAll(),
          productManager.getAll(),
          orderManager.getAll(),
          categoryManager.getAll()
        ]);

        setStats({
          users: users.length,
          products: products.length,
          orders: orders.length,
          categories: categories.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats stats={stats} />;
      case 'users':
        return <CrudTable manager={userManager} columns={userColumns} />;
      case 'products':
        return <CrudTable manager={productManager} columns={productColumns} />;
      case 'orders':
        return <CrudTable manager={orderManager} columns={orderColumns} />;
      case 'categories':
        return <CrudTable manager={categoryManager} columns={categoryColumns} />;
      default:
        return <div>Seleccione una opción</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Panel de Administración</h2>
      <p>Bienvenido, {user?.nombre || 'Administrador'}!</p>
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Usuarios
        </button>
        <button 
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Productos
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Órdenes
        </button>
        <button 
          className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categorías
        </button>
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

// Dashboard Stats Component
const DashboardStats = ({ stats }) => (
  <div className="dashboard-stats">
    <div className="stat-card">
      <h3>Usuarios</h3>
      <p>{stats.users}</p>
    </div>
    <div className="stat-card">
      <h3>Productos</h3>
      <p>{stats.products}</p>
    </div>
    <div className="stat-card">
      <h3>Órdenes</h3>
      <p>{stats.orders}</p>
    </div>
    <div className="stat-card">
      <h3>Categorías</h3>
      <p>{stats.categories}</p>
    </div>
  </div>
);

// CRUD Table Component
const CrudTable = ({ manager, columns }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await manager.getAll();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [manager]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await manager.update(editingId, formData);
      } else {
        await manager.create(formData);
      }
      setEditingId(null);
      setFormData({});
      // Refresh the list
      const data = await manager.getAll();
      setItems(data);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este elemento?')) {
      try {
        await manager.delete(id);
        const data = await manager.getAll();
        setItems(data);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {columns.map(column => (
          <div key={column.field}>
            <label>{column.headerName}</label>
            <input
              type={column.type || 'text'}
              name={column.field}
              value={formData[column.field] || ''}
              onChange={handleInputChange}
              required={column.required}
            />
          </div>
        ))}
        <button type="submit">
          {editingId ? 'Actualizar' : 'Crear'}
        </button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null);
            setFormData({});
          }}>
            Cancelar
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.field}>{column.headerName}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              {columns.map(column => (
                <td key={`${item.id}-${column.field}`}>
                  {item[column.field]}
                </td>
              ))}
              <td>
                <button onClick={() => handleEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Column configurations
const userColumns = [
  { field: 'nombre', headerName: 'Nombre', required: true },
  { field: 'email', headerName: 'Email', type: 'email', required: true },
  { field: 'rol', headerName: 'Rol', required: true }
];

const productColumns = [
  { field: 'nombre', headerName: 'Nombre', required: true },
  { field: 'precio', headerName: 'Precio', type: 'number', required: true },
  { field: 'stock', headerName: 'Stock', type: 'number', required: true }
];

const orderColumns = [
  { field: 'usuario', headerName: 'Usuario', required: true },
  { field: 'total', headerName: 'Total', type: 'number', required: true },
  { field: 'estado', headerName: 'Estado', required: true }
];

const categoryColumns = [
  { field: 'nombre', headerName: 'Nombre', required: true },
  { field: 'descripcion', headerName: 'Descripción' }
];

export default PerfilAdmin;