import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartReducer';
import { useNavigate } from 'react-router';
// import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(state => state.cart);

  const handleQuantityChange = (index, type) => {
    const item = cart.items[index];
    const newQuantity = type === 'increment' ? item.quantity + 1 : item.quantity - 1;
    
    if (newQuantity > 0) {
      dispatch(updateQuantity({ index, quantity: newQuantity }));
    }
  };

  const handleRemove = (index) => {
    dispatch(removeFromCart({ index }));
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
  <>
    {/* Backdrop */}
    <div className="cart-backdrop" onClick={onClose}></div>
    
    {/* Cart Sidebar */}
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Header */}
      <div className="cart-header d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0 fw-bold">BAG</h4>
          <small className="text-muted">ITEMS: ({cart.items?.length || 0})</small>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="text-end">
            <small className="text-muted d-block">TOTAL:</small>
            <strong className="fs-5">₹{cart.total?.toFixed(2) || 0}</strong>
          </div>
          <button 
            className="btn-close" 
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {cart.items?.length > 0 ? (
          cart.items.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="d-flex gap-3">
                {/* Product Image */}
                <div className="cart-item-image">
                  <img
                    src={item.images?.[0] || '/assets/Image_Placeholder.svg'}
                    alt={item.name}
                    className="img-fluid"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="product-brand mb-1">{item.brand}</h6>
                      <p className="product-name mb-2">{item.name}</p>
                      {item.selectedSize && (
                        <p className="product-size mb-2 text-muted">
                          Size: <span className="fw-semibold">{item.selectedSize}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-end">
                      <h6 className="product-price mb-0">₹{item.price}</h6>
                    </div>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(index, 'decrement')}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(index, 'increment')}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-link text-danger text-decoration-none p-0 fw-semibold"
                      onClick={() => handleRemove(index)}
                    >
                      <i className="bi bi-trash3 me-1"></i>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-cart text-center py-5">
            <i className="bi bi-bag-x fs-1 text-secondary opacity-50"></i>
            <h5 className="mt-3 fw-semibold text-secondary">Your bag is empty</h5>
            <p className="text-muted small">Add items to get started</p>
            <button className="btn btn-dark mt-3 px-4" onClick={onClose}>
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Checkout Button */}
      {cart.items?.length > 0 && (
        <div className="cart-footer">
          <button 
            className="btn btn-dark w-100 py-3 fw-bold text-uppercase" 
            onClick={handleCheckout}
          >
            <i className="bi bi-lock-fill me-2"></i>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  </>
);

};

export default CartSidebar;
