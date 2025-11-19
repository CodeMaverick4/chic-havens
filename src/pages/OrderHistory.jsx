import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import axios from 'axios';

const OrderHistory = () => {
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_DATABASEURL}/travel-db/orders.json`);
      let ordersArray = [];
      for (let key in response.data) {
        if (response.data[key].userId === auth.uid) {
          ordersArray.push({ ...response.data[key], id: key });
        }
      }
      ordersArray.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      console.log(response.data);
      setOrders(ordersArray);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'warning', text: 'Pending' },
      confirmed: { bg: 'info', text: 'Confirmed' },
      shipped: { bg: 'primary', text: 'Shipped' },
      delivered: { bg: 'success', text: 'Delivered' },
      cancelled: { bg: 'danger', text: 'Cancelled' }
    };
    return badges[status] || { bg: 'secondary', text: status };
  };

  return (
    <div className="orders-content">
      <h3 className="mb-4">My Orders</h3>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h6 className="mb-1">Order #{order.orderId}</h6>
                  <small className="text-muted">
                    Placed on {new Date(order.orderDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </small>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className={`badge bg-${getStatusBadge(order.orderStatus).bg}`}>
                    {getStatusBadge(order.orderStatus).text}
                  </span>
                  <h5 className="mb-0">₹{order.totalAmount.toFixed(2)}</h5>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img
                      src={item.image || '/assets/Image_Placeholder.svg'}
                      alt={item.productName}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div className="item-details">
                      <p className="mb-0">{item.productName}</p>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <p className="mb-0 fw-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-bag-x" style={{ fontSize: '60px', color: '#ccc' }}></i>
          <h5 className="mt-3">No orders yet</h5>
          <p className="text-muted">Start shopping to see your orders here!</p>
          <button className="btn btn-dark mt-3" onClick={() => navigate('/')}>
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
