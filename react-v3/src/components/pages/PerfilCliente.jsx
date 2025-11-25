import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { db } from "../../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../../styles/profile.css";

const PerfilCliente = () => {
  const { user } = useContext(UserContext);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      
      try {
        const q = query(
          collection(db, "compras"),
          where("correo", "==", user.email)
        );
        
        const querySnapshot = await getDocs(q);
        const purchasesData = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const timestamp = data.fecha;
          
          purchasesData.push({
            id: doc.id,
            ...data,
            // Store both timestamp and formatted date
            timestamp: timestamp?.toDate() || new Date(),
            fecha: timestamp?.toDate().toLocaleDateString('es-CL') || 'Fecha no disponible'
          });
        });
        
        // Ordenar por timestamp (más reciente primero)
        purchasesData.sort((a, b) => b.timestamp - a.timestamp);
        setPurchases(purchasesData);
      } catch (error) {
        console.error("Error al cargar las compras:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user?.uid]);

  // Función para formatear el monto a formato de moneda chilena
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <h2>Cargando historial de compras...</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Mi Perfil</h2>
        <p className="welcome-message">Bienvenido(a), {user?.nombre || 'Cliente'}</p>
      </div>

      <div className="purchase-history">
        <h3>Historial de Compras</h3>
        
        {purchases.length === 0 ? (
          <div className="no-purchases">
            <p>No hay compras registradas.</p>
          </div>
        ) : (
          <div className="purchases-list">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="purchase-card">
                <div className="purchase-header">
                  <span className="purchase-id">Compra #{purchase.id.substring(0, 8)}</span>
                  <span className="purchase-date">{purchase.fecha}</span>
                  <span className={`purchase-status ${purchase.estado?.toLowerCase() || 'completada'}`}>
                    {purchase.estado || 'Completada'}
                  </span>
                </div>
                
                <div className="purchase-details">
                  <div className="purchase-items">
                    {purchase.items?.map((item, index) => (
                      <div key={index} className="purchase-item">
                        <span className="item-name">{item.nombre} x {item.cantidad}</span>
                        <span className="item-price">{formatCurrency(item.precio * item.cantidad)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="purchase-total">
                    <span>Total:</span>
                    <span className="total-amount">{formatCurrency(purchase.total)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilCliente;