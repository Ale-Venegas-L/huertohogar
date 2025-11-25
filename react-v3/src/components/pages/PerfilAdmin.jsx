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
  FiPlusCircle,
  FiMenu,
  FiX
} from 'react-icons/fi';

const PerfilAdmin = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const handleNavigation = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection 
          stats={stats} 
          loading={loading} 
          setActiveSection={setActiveSection}
          setSidebarOpen={setSidebarOpen}
        />;
      case 'orders':
        return <OrdersSection />;
      case 'products':
        return <ProductsSection />;
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
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-button" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSidebarOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-section">
          <section className="welcome-section">
            <h1 className="welcome-title">Panel de Administración</h1>
            <p className="welcome-subtitle">{user?.email || 'admin@huertohogar.cl'}</p>
          </section>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">Administración</h3>
          <ul className="sidebar-menu">
            <li className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleNavigation('dashboard')}>
                <FiHome className="menu-icon" />
                Dashboard
              </button>
            </li>
            <li className={`menu-item ${activeSection === 'orders' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleNavigation('orders')}>
                <FiShoppingCart className="menu-icon" />
                Órdenes
              </button>
            </li>
            <li className={`menu-item ${activeSection === 'products' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleNavigation('products')}>
                <FiPackage className="menu-icon" />
                Productos
              </button>
            </li>
            <li className={`menu-item ${activeSection === 'users' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleNavigation('users')}>
                <FiUsers className="menu-icon" />
                Usuarios
              </button>
            </li>
            <li className={`menu-item ${activeSection === 'reports' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleNavigation('reports')}>
                <FiBarChart2 className="menu-icon" />
                Reportes
              </button>
            </li>
          </ul>
        </div>

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

      <main className="admin-main">
        {renderSection()}
      </main>
    </div>
  );
};

const DashboardSection = ({ stats, loading, setActiveSection, setSidebarOpen }) => {
  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  return (
    <section id="dashboard">
      <div className="welcome-section">
        <h2 className="welcome-title">Resumen General</h2>
        <p className="welcome-subtitle">Bienvenido al panel de administración de Huerto Hogar</p>
      </div>
      
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

      <div className="navigation-grid">
        <div className="navigation-row">
          <button 
            className="menu-link" 
            onClick={() => {
              setActiveSection('dashboard');
              setSidebarOpen(false);
            }}
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
            className="menu-link" 
            onClick={() => {
              setActiveSection('orders');
              setSidebarOpen(false);
            }}
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
            className="menu-link" 
            onClick={() => {
              setActiveSection('products');
              setSidebarOpen(false);
            }}
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
            className="menu-link" 
            onClick={() => {
              setActiveSection('users');
              setSidebarOpen(false);
            }}
          >
            <div className="nav-icon">
              <FiUsers size={24} />
            </div>
            <h3 className="nav-title">Usuarios</h3>
            <p className="nav-description">
              Administrar las cuentas de usuario y sus permisos.
            </p>
          </button>
        </div>
      </div>
    </section>
  );
};

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

const ReportsSection = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    topProducts: [],
    recentOrders: [],
    userGrowth: []
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        // Simulate API calls to fetch report data
        // In a real app, you would fetch this from your backend
        const orders = await orderManager.getAll();
        const products = await productManager.getAll();
        
        // Calculate metrics
        const totalSales = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
        
        // Get top 5 products (mock implementation)
        const topProducts = [...products]
          .sort((a, b) => (b.ventas || 0) - (a.ventas || 0))
          .slice(0, 5);
        
        // Get recent orders
        const recentOrders = [...orders]
          .sort((a, b) => new Date(b.fecha?.toDate?.() || b.fecha) - new Date(a.fecha?.toDate?.() || a.fecha))
          .slice(0, 5);
        
        setReportData({
          totalSales,
          totalOrders,
          avgOrderValue,
          topProducts,
          recentOrders,
          userGrowth: [
            { month: 'Ene', users: 120 },
            { month: 'Feb', users: 150 },
            { month: 'Mar', users: 180 },
            { month: 'Abr', users: 200 },
            { month: 'May', users: 250 },
            { month: 'Jun', users: 300 }
          ]
        });
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [timeRange]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(value);
  };

  if (loading) {
    return (
      <section id="reports">
        <div className="welcome-section">
          <h2 className="welcome-title">Reportes y Análisis</h2>
          <p className="welcome-subtitle">Genera informes detallados del sistema</p>
        </div>
        <div className="loading">Cargando reportes...</div>
      </section>
    );
  }

  return (
    <section id="reports">
      <div className="welcome-section">
        <h2 className="welcome-title">Reportes y Análisis</h2>
        <div className="report-actions">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-selector"
          >
            <option value="day">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
          <button className="btn btn-primary">
            <FiRefreshCw className="icon" /> Actualizar
          </button>
        </div>
      </div>

      <div className="report-grid">
        {/* Summary Cards */}
        <div className="summary-card">
          <div className="summary-icon">
            <FiShoppingBag />
          </div>
          <div className="summary-content">
            <h3>Ventas Totales</h3>
            <p className="summary-value">{formatCurrency(reportData.totalSales)}</p>
            <span className="summary-change positive">+12% vs mes anterior</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <FiShoppingCart />
          </div>
          <div className="summary-content">
            <h3>Órdenes</h3>
            <p className="summary-value">{reportData.totalOrders}</p>
            <span className="summary-change positive">+8% vs mes anterior</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <FiUsers />
          </div>
          <div className="summary-content">
            <h3>Valor Promedio</h3>
            <p className="summary-value">{formatCurrency(reportData.avgOrderValue)}</p>
            <span className="summary-change negative">-2% vs mes anterior</span>
          </div>
        </div>

        {/* Top Products */}
        <div className="report-card">
          <div className="card-header">
            <h3>Productos más vendidos</h3>
            <button className="btn-text">Ver todos</button>
          </div>
          <div className="product-list">
            {reportData.topProducts.map((product, index) => (
              <div key={product.id} className="product-item">
                <span className="product-rank">{index + 1}</span>
                <div className="product-info">
                  <h4>{product.nombre}</h4>
                  <p>{product.categoria || 'Sin categoría'}</p>
                </div>
                <span className="product-sales">{product.ventas || 0} ventas</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="report-card">
          <div className="card-header">
            <h3>Órdenes recientes</h3>
            <button className="btn-text">Ver todas</button>
          </div>
          <div className="order-list">
            {reportData.recentOrders.map(order => {
              const orderDate = order.fecha?.toDate?.() || order.fecha || new Date();
              const formattedDate = orderDate.toLocaleDateString('es-CL', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              });
              
              return (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <h4>Orden #{order.id.slice(0, 8)}</h4>
                    <p>{formattedDate}</p>
                  </div>
                  <div className="order-amount">
                    {formatCurrency(order.total || 0)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Growth Chart (Placeholder) */}
        <div className="report-card chart-card">
          <div className="card-header">
            <h3>Crecimiento de usuarios</h3>
            <select className="chart-period">
              <option>Últimos 6 meses</option>
              <option>Último año</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#4F46E5'}}></span>
                Usuarios nuevos
              </span>
            </div>
            <div className="chart-bars">
              {reportData.userGrowth.map((item, index) => (
                <div key={index} className="chart-bar-container">
                  <div 
                    className="chart-bar" 
                    style={{
                      height: `${(item.users / 300) * 100}%`,
                      backgroundColor: '#4F46E5'
                    }}
                  ></div>
                  <span className="chart-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

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
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) : value 
    }));
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
            {column.type === 'select' ? (
              <select
                name={column.field}
                value={formData[column.field] || ''}
                onChange={handleInputChange}
                required={column.required}
              >
                <option value="">Seleccione una categoría</option>
                {column.options && column.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={column.type || 'text'}
                name={column.field}
                value={formData[column.field] || ''}
                onChange={handleInputChange}
                required={column.required}
              />
            )}
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
                <button onClick={() => handleEdit(item)} className='btn-adm'>Editar</button>
                <button onClick={() => handleDelete(item.id)} className='btn-adm'>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const userColumns = [
  { field: 'nombre', headerName: 'Nombre', required: true },
  { field: 'email', headerName: 'Email', type: 'email', required: true },
  { field: 'rol', headerName: 'Rol', required: true }
];

const productColumns = [
  { field: 'nombre', headerName: 'Nombre', required: true },
  { field: 'precio', headerName: 'Precio', type: 'number', required: true },
  { field: 'stock', headerName: 'Stock', type: 'number', required: true },
  { 
    field: 'categoria', 
    headerName: 'Categoría', 
    type: 'select',
    options: [
      { value: 'frutas-frescas', label: 'Frutas Frescas' },
      { value: 'verduras-organicas', label: 'Verduras Orgánicas' },
      { value: 'productos-organicos', label: 'Productos Orgánicos' },
      { value: 'productos-lacteos', label: 'Productos Lácteos' }
    ],
    required: true 
  }
];

const orderColumns = [
  { field: 'usuario', headerName: 'Usuario', required: true },
  { field: 'total', headerName: 'Total', type: 'number', required: true },
  { field: 'estado', headerName: 'Estado', required: true }
];

export default PerfilAdmin;