import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
// import { ORDERS_API_URL } from '../utils/api-constant';
import { setCartItems } from '../redux/slices/cartReducer';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    customerName: user?.displayName || 'John Doe',
    customerEmail: user?.email || 'johndoe@example.com',
    customerPhone: '9876543210',
    shippingAddress: '221B Baker Street, Apt 4B',
    city: 'Indore',
    state: 'Madhya Pradesh',
    pincode: '452001',
    paymentMethod: 'online' // 'online' or 'cod'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let err = {};
    if (!formData.customerName) err.customerName = "Name is required";
    if (!formData.customerEmail) err.customerEmail = "Email is required";
    if (!formData.customerPhone) err.customerPhone = "Phone is required";
    if (!formData.shippingAddress) err.shippingAddress = "Address is required";
    if (!formData.city) err.city = "City is required";
    if (!formData.pincode) err.pincode = "Pincode is required";
    return err;
  };

  const calculateTotal = () => {
    return cart.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  };

  // Handle Place Order
  const handlePlaceOrder = async () => {
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    setIsLoading(true);

    // Determine payment status based on method
    const paymentStatus = formData.paymentMethod === 'cod' ? 'pending' : 'paid';
    console.log("user......",user)
    // Create order object
    const orderData = {
      orderId: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString(),
      userId: user?.uid,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,

      orderStatus: 'pending',
      paymentStatus: paymentStatus,
      paymentMethod: formData.paymentMethod,

      items: cart.items.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.images?.[0] || ''
      })),

      totalAmount: calculateTotal(),
      shippingAddress: `${formData.shippingAddress}, ${formData.city}, ${formData.state} - ${formData.pincode}`,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_DATABASEURL}/main-database/orders.json`, orderData);
      
      // Clear cart
      localStorage.removeItem('cart');
      dispatch(setCartItems({ items: [], total: 0 }));
      
      // Show success message
      const message = formData.paymentMethod === 'cod' 
        ? "Order placed successfully! You can pay on delivery." 
        : "Order placed successfully! Payment confirmed.";
      
      alert(message);
      
      // Navigate to success page
      navigate(`/order-success/${response.data.name}`);
    } catch (err) {
      alert("Failed to place order. Please try again.");
      console.error("Error placing order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h3>Your cart is empty!</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Checkout</h2>

      <div className="row">
        {/* Shipping Details */}
        <div className="col-md-7">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <strong>Shipping Details</strong>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Full Name*</label>
                <input
                  type="text"
                  className="form-control"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                />
                <span className="text-danger small">{errors.customerName}</span>
              </div>

              <div className="mb-3">
                <label className="form-label">Email*</label>
                <input
                  type="email"
                  className="form-control"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                />
                <span className="text-danger small">{errors.customerEmail}</span>
              </div>

              <div className="mb-3">
                <label className="form-label">Phone*</label>
                <input
                  type="text"
                  className="form-control"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                />
                <span className="text-danger small">{errors.customerPhone}</span>
              </div>

              <div className="mb-3">
                <label className="form-label">Address*</label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                ></textarea>
                <span className="text-danger small">{errors.shippingAddress}</span>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">City*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  <span className="text-danger small">{errors.city}</span>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Pincode*</label>
                <input
                  type="text"
                  className="form-control"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
                <span className="text-danger small">{errors.pincode}</span>
              </div>

              {/* Payment Method */}
              <div className="mb-3">
                <label className="form-label">Payment Method*</label>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="online"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="online">
                    💳 Online Payment (Card/UPI)
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    💵 Cash on Delivery
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-5">
          <div className="card sticky-top" style={{top: '20px'}}>
            <div className="card-header bg-primary text-white">
              <strong>Order Summary</strong>
            </div>
            <div className="card-body">
              {cart.items?.map((item, index) => (
                <div key={index} className="d-flex justify-content-between mb-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <strong>Subtotal:</strong>
                <strong>₹{calculateTotal()}</strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <h5>Total:</h5>
                <h5>₹{calculateTotal()}</h5>
              </div>

              <button
                className="btn btn-primary w-100 btn-lg"
                onClick={handlePlaceOrder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>

              <small className="text-muted d-block mt-2 text-center">
                {formData.paymentMethod === 'online' 
                  ? '🔒 Secure payment' 
                  : '💵 Pay on delivery'}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
