import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";

const Header = () => {
    const { user, logout } = useContext(UserContext);
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
            if (window.innerWidth >= 992) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header>
            <nav className="nav-main">
                <div className="nav-header">
                    <Link to="/" className="logo-link">
                        <img src="/assets/pictures/logo.png" alt="HuertoHogar logo" id="logo"/>
                    </Link>
                    <button 
                        className="menu-toggle" 
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                
                <div className={`nav-content ${isMenuOpen ? 'show' : ''}`}>
                    <div className="nav-center">
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link to="/catalogo" onClick={() => setIsMenuOpen(false)}>Catalogo</Link>
                        <Link to="/nosotros" onClick={() => setIsMenuOpen(false)}>Nosotros</Link>
                        <Link to="/contacto" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
                    </div>
                    <div className="nav-right">
                        <Link 
                            to="/carrito" 
                            className="btn-carrito"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <i className="bi bi-cart3"></i>
                            <span>Carrito ({getCartCount()})</span>
                        </Link>
                        {user ? (
                            <>
                                <Link 
                                    to={user.rol === 'admin' ? '/perfil-admin' : '/perfil-cliente'} 
                                    className="btn-login"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Perfil
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="btn-login"
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="btn-login"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/registro" 
                                    className="btn-login"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Crear Cuenta
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;