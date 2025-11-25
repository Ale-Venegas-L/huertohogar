import { BrowserRouter as Router } from 'react-router-dom';
import RouterConfig from './routes/RouterConfig';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <RouterConfig />
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
