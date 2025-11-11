import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header>
           <nav className="nav-main">
            <Link to="/">
                <img src="/assets/pictures/logo.png" alt="HuertoHogar logo" id="logo"/>
            </Link>
            <div className="nav-center">
                <Link to="/">Home</Link>
                <Link to="/catalogo">Catalogo</Link>
                <Link to="/nosotros">Nosotros</Link>
                <Link to="/contacto">Contacto</Link>
            </div>
            <div className="nav-right">
                <Link to="/carrito"><i className="bi bi-cart3"></i>
                    Carrito(0)
                </Link>
                <Link to="/login" id="login" className="btn-login">
                    Login
                </Link>
                <Link to="/registro" id="reg" className="btn-login">
                    Crear Cuenta
                </Link>
            </div>
           </nav>
        </header>
    );
}
export default Header;