// import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate, useParams } from 'react-router';


const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_DATABASEURL}/${orderId}.json`);
        setOrder(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!order) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container my-5 text-center">
      <div className="card shadow-lg p-5">
        <i className="bi bi-check-circle-fill text-success" style={{fontSize: '80px'}}></i>
        <h2 className="mt-4">Order Placed Successfully!</h2>
        <p className="text-muted">Thank you for your order</p>
        
        <div className="mt-4">
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
          <p><strong>Delivery Address:</strong> {order.shippingAddress}</p>
        </div>

        <div className="mt-4">
          <button className="btn btn-primary me-2" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
          <button className="btn btn-outline-primary" onClick={() => navigate('/account/orders')}>
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
