// src/components/pages/PerfilAdmin.jsx
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { 
  userManager, 
  productManager, 
  orderManager, 
  categoryManager 
} from '../../services/crudManager';
import { useNavigate } from 'react-router-dom';
import '../../styles/perfilAdmin.css';

// Icons
import { 
  FiHome, 
  FiShoppingCart, 
  FiPackage, 
  FiUsers, 
  FiBarChart2, 
  FiUser, 
  FiLogOut,
  FiEdit, 
  FiTrash2,
  FiTag,
  FiShoppingBag,
  FiInfo,
  FiRefreshCw,
  FiPlusCircle
} from 'react-icons/fi';

const PerfilAdmin = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    categories: 0,
    newUsersThisMonth: 0,
    inventoryTotal: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        console.log('[PerfilAdmin] Starting to fetch stats...');
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [users, products, orders, categories] = await Promise.allSettled([
          userManager.getAll().catch(e => {
            console.error('[PerfilAdmin] User fetch error:', e);
            return []; // Return empty array on error
          }),
          productManager.getAll().catch(e => {
            console.error('[PerfilAdmin] Product fetch error:', e);
            return [];
          }),
          orderManager.getAll().catch(e => {
            console.error('[PerfilAdmin] Order fetch error:', e);
            return [];
          }),
          categoryManager.getAll().catch(e => {
            console.error('[PerfilAdmin] Category fetch error:', e);
            return [];
          })
        ]);

        if (!isMounted) {
          console.log('[PerfilAdmin] Component unmounted, stopping fetch');
          return;
        }

        // Extract values from Promise.allSettled results
        const usersData = users.status === 'fulfilled' ? users.value : [];
        const productsData = products.status === 'fulfilled' ? products.value : [];
        const ordersData = orders.status === 'fulfilled' ? orders.value : [];
        const categoriesData = categories.status === 'fulfilled' ? categories.value : [];

        console.log('[PerfilAdmin] Fetched data counts:', {
          users: usersData.length,
          products: productsData.length,
          orders: ordersData.length,
          categories: categoriesData.length
        });

        // Calculate additional stats
        const currentMonth = new Date().getMonth();
        const newUsersThisMonth = usersData.filter(user => {
          try {
            if (!user.createdAt) return false;
            const userDate = user.createdAt.toDate 
              ? user.createdAt.toDate() 
              : new Date(user.createdAt);
            return userDate.getMonth() === currentMonth;
          } catch (e) {
            console.warn('[PerfilAdmin] Error processing user date:', user, e);
            return false;
          }
        }).length;

        const inventoryTotal = productsData.reduce((sum, product) => {
          return sum + (parseInt(product.stock, 10) || 0);
        }, 0);

        const newStats = {
          users: usersData.length,
          products: productsData.length,
          orders: ordersData.length,
          categories: categoriesData.length,
          newUsersThisMonth,
          inventoryTotal
        };

        console.log('[PerfilAdmin] Setting stats:', newStats);
        setStats(newStats);

      } catch (error) {
        console.error('[PerfilAdmin] Unexpected error in fetchStats:', error);
        if (isMounted) {
          setError('Error loading dashboard data. Please try again later.');
        }
      } finally {
        if (isMounted) {
          console.log('[PerfilAdmin] Cleaning up...');
          setLoading(false);
        }
      }
    };

    console.log('[PerfilAdmin] Starting fetchStats...');
    fetchStats();

    return () => {
      console.log('[PerfilAdmin] Cleanup: unmounting component');
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    if (logout()) {
      navigate('/login');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection 
          stats={stats} 
          loading={loading} 
          setActiveSection={setActiveSection} 
        />;
      case 'orders':
        return <OrdersSection />;
      case 'products':
        return <ProductsSection />;
      case 'categories':
        return <CategoriesSection />;
      case 'users':
        return <UsersSection />;
      case 'reports':
        return <ReportsSection />;
      case 'profile':
        return <ProfileSection user={user} />;
      default:
        return <DashboardSection stats={stats} loading={loading} />;
    }
  };

  return (
    <div className="admin-container">
      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}
      {/* Header */}
      <header className="admin-header">
        <a href="#" className="logo">Huerto Hogar</a>
      </header>

      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Welcome Section */}
        <div className="sidebar-section">
          <section className="welcome-section">
            <h1 className="welcome-title">Panel de Administración</h1>
            <p className="welcome-subtitle">{user?.email || 'admin@huertohogar.cl'}</p>
          </section>
        </div>

        {/* Main Menu */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">Administración</h3>
          <ul className="sidebar-menu">
            <li className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => setActiveSection('dashboard')}>
                <FiHome className="menu-icon" />
                Dashboard
              </button>
            </li>
            <li className={`menu-item ${activeSection === 'orders' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => setActiveSection('orders')}>
                <FiShoppingCart className="menu-icon" />
                Órdenes
              </button>
            </li>
            <li className={`menu-item ${activeSection === 'products' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => setActiveSection('products')}>
                <FiPackage className="menu-icon" />
                Productos
              </button>
            </li>
            <li className={`menu-item ${activeSection === 'categories' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => setActiveSection('categories')}>
                <FiTag className="menu-icon" />
                Categorías
              </button>
            </li>
            <li className={`menu-item ${activeSection === 'users' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => setActiveSection('users')}>
                <FiUsers className="menu-icon" />
                Usuarios
              </button>
            </li>
            <li className={`menu-item ${activeSection === 'reports' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => setActiveSection('reports')}>
                <FiBarChart2 className="menu-icon" />
                Reportes
              </button>
            </li>
          </ul>
        </div>

        {/* Account Section */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">Cuenta</h3>
          <ul className="sidebar-menu">
            <li className={`menu-item ${activeSection === 'profile' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => setActiveSection('profile')}>
                <FiUser className="menu-icon" />
                Perfil
              </button>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="sidebar-section sidebar-actions">
          <button className="action-btn btn-store" onClick={() => navigate('/')}>
            <FiShoppingBag className="menu-icon" />
            Tienda
          </button>
          <a href="/docs/api-launcher.html" target="_blank" rel="noopener noreferrer" className="action-btn btn-info">
            <FiInfo className="menu-icon" />
            API Docs
          </a>
          <button className="action-btn btn-logout" onClick={handleLogout}>
            <FiLogOut className="menu-icon" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {renderSection()}
      </main>
    </div>
  );
};

// Dashboard Section Component
const DashboardSection = ({ stats, loading, setActiveSection }) => {
  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  return (
    <section id="dashboard">
      <div className="welcome-section">
        <h2 className="welcome-title">Resumen General</h2>
        <p className="welcome-subtitle">Bienvenido al panel de administración de Huerto Hogar</p>
      </div>
      
      {/* Summary Cards */}
      <div className="dashboard-cards-row">
        <div className="summary-card blue-card">
          <div className="card-content">
            <div className="card-icon">
              <FiShoppingCart size={24} />
            </div>
            <div className="card-info">
              <h3 className="card-title">Órdenes</h3>
              <p className="card-value">{stats.orders}</p>
              <p className="card-subtitle">
                Probabilidad de aumento: <span>15%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="summary-card green-card">
          <div className="card-content">
            <div className="card-icon">
              <FiPackage size={24} />
            </div>
            <div className="card-info">
              <h3 className="card-title">Productos</h3>
              <p className="card-value">{stats.products}</p>
              <p className="card-subtitle">
                Inventario Total: <span>{stats.inventoryTotal}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="summary-card yellow-card">
          <div className="card-content">
            <div className="card-icon">
              <FiUsers size={24} />
            </div>
            <div className="card-info">
              <h3 className="card-title">Usuarios</h3>
              <p className="card-value">{stats.users}</p>
              <p className="card-subtitle">
                Nuevos este mes: <span>{stats.newUsersThisMonth}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="navigation-grid">
        <div className="navigation-row">
          <button 
            className="nav-button" 
            onClick={() => setActiveSection('dashboard')}
          >
            <div className="nav-icon">
              <FiHome size={24} />
            </div>
            <h3 className="nav-title">Dashboard</h3>
            <p className="nav-description">
              Visión general de todas las métricas y estadísticas clave del sistema.
            </p>
          </button>

          <button 
            className="nav-button" 
            onClick={() => setActiveSection('orders')}
          >
            <div className="nav-icon">
              <FiShoppingCart size={24} />
            </div>
            <h3 className="nav-title">Órdenes</h3>
            <p className="nav-description">
              Gestión y seguimiento de todas las órdenes de compras realizadas.
            </p>
          </button>

          <button 
            className="nav-button" 
            onClick={() => setActiveSection('products')}
          >
            <div className="nav-icon">
              <FiPackage size={24} />
            </div>
            <h3 className="nav-title">Productos</h3>
            <p className="nav-description">
              Administrar inventario y detalles de los productos disponibles.
            </p>
          </button>

          <button 
            className="nav-button" 
            onClick={() => setActiveSection('categories')}
          >
            <div className="nav-icon">
              <FiTag size={24} />
            </div>
            <h3 className="nav-title">Categorías</h3>
            <p className="nav-description">
              Organizar productos en categorías para facilitar su navegación.
            </p>
          </button>
        </div>
      </div>
    </section>
  );
};

// Placeholder Components for Other Sections, now wired to CrudTable
const OrdersSection = () => (
  <section id="orders">
    <div className="welcome-section">
      <h2 className="welcome-title">Gestión de Órdenes</h2>
      <p className="welcome-subtitle">Administra y realiza seguimiento de todas las órdenes de compra</p>
    </div>
    <div className="crud-container">
      <div className="crud-header">
        <h3>Lista de Órdenes</h3>
        <div className="crud-actions">
          <select className="form-control">
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="procesando">Procesando</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
          <button className="btn btn-primary">
            <FiRefreshCw className="icon" /> Actualizar
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <CrudTable manager={orderManager} columns={orderColumns} />
      </div>
    </div>
  </section>
);

const ProductsSection = () => (
  <section id="products">
    <div className="welcome-section">
      <h2 className="welcome-title">Gestión de Productos</h2>
      <p className="welcome-subtitle">Administra el inventario y detalles de productos</p>
    </div>
    <div className="crud-container">
      <div className="crud-header">
        <h3>Lista de Productos</h3>
        <div className="crud-actions">
          <button className="btn btn-primary">
            <FiPlusCircle className="icon" /> Nuevo Producto
          </button>
          <button className="btn btn-secondary">
            <FiRefreshCw className="icon" /> Actualizar
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <CrudTable manager={productManager} columns={productColumns} />
      </div>
    </div>
  </section>
);

const CategoriesSection = () => (
  <section id="categories">
    <div className="welcome-section">
      <h2 className="welcome-title">Gestión de Categorías</h2>
      <p className="welcome-subtitle">Administra las categorías de productos</p>
    </div>
    <div className="crud-container">
      <div className="crud-header">
        <h3>Lista de Categorías</h3>
        <div className="crud-actions">
          <button className="btn btn-primary">
            <FiPlusCircle className="icon" /> Nueva Categoría
          </button>
          <button className="btn btn-secondary">
            <FiRefreshCw className="icon" /> Actualizar
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <CrudTable manager={categoryManager} columns={categoryColumns} />
      </div>
    </div>
  </section>
);

const UsersSection = () => (
  <section id="users">
    <div className="welcome-section">
      <h2 className="welcome-title">Gestión de Usuarios</h2>
      <p className="welcome-subtitle">Administra las cuentas de usuario</p>
    </div>
    <div className="crud-container">
      <div className="crud-header">
        <h3>Lista de Usuarios</h3>
        <div className="crud-actions">
          <button className="btn btn-primary">
            <FiPlusCircle className="icon" /> Nuevo Usuario
          </button>
          <button className="btn btn-secondary">
            <FiRefreshCw className="icon" /> Actualizar
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <CrudTable manager={userManager} columns={userColumns} />
      </div>
    </div>
  </section>
);

const ReportsSection = () => (
  <section id="reports">
    <div className="welcome-section">
      <h2 className="welcome-title">Reportes y Análisis</h2>
      <p className="welcome-subtitle">Genera informes detallados del sistema</p>
    </div>
    <div className="crud-container">
      <p>Sección de reportes en desarrollo</p>
    </div>
  </section>
);

const ProfileSection = ({ user }) => (
  <section id="profile">
    <div className="welcome-section">
      <h2 className="welcome-title">Mi Perfil</h2>
      <p className="welcome-subtitle">Administra tu información personal</p>
    </div>
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          <FiUser size={48} />
        </div>
        <div className="profile-info">
          <h3>{user?.nombre || 'Administrador'}</h3>
          <p><strong>Email:</strong> {user?.email || 'admin@huertohogar.cl'}</p>
          <p><strong>Rol:</strong> Administrador</p>
          <p><strong>Último acceso:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  </section>
);

// CRUD Table Component (Kept for future use in section components)
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

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="crud-form">
      <form onSubmit={handleSubmit}>
        {columns.map(column => (
          <div key={column.field} className="form-group">
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

// Column configurations (kept for future use)
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