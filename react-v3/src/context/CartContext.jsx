import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  useEffect(() => {
    if (!user) {
      setCart([]);
    }
  }, [user]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, cantidad: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + (item.cantidad || 1), 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.descuento?.activo
        ? getPrecioUnitario(item)
        : Number(item.precio) || 0;
      return total + (price * (item.cantidad || 1));
    }, 0);
  };

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
    return Math.max(0, Math.round(base));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        getPrecioUnitario
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
