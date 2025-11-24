import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../redux/slices/cartReducer';

const QuickView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DATABASEURL}/main-database/products/${productId}.json`
      );
      setProduct(response.data);
    } catch (err) {
      console.error('Error loading product:', err);
    }
    setIsLoading(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    dispatch(addToCart({ product: product, quantity: quantity }));
    alert('Added to cart!');
  };

  const handleQuantityChange = (type) => {
    if (type === 'increment') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container my-5 text-center">
        <h3>Product not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  const discountedPrice = (Number(product.price) - (Number(product.price) * Number(product.discount)) / 100).toFixed(2);

  return (
    <div className="quick-view-page">
      <div className="container my-4">
        {/* Back Button */}
        <button className="btn btn-link text-dark ps-0 mb-3" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2"></i> Back
        </button>

        <div className="row">
          {/* Left Side - Images */}
          <div className="col-md-6">
            <div className="product-images">
              {/* Main Image */}
              <div className="main-image mb-3">
                <img
                  src={product.images?.[selectedImage] || '/assets/Image_Placeholder.svg'}
                  alt={product.name}
                  className="w-100"
                />
              </div>

              {/* Thumbnail Images */}
              {product.images?.length > 1 && (
                <div className="d-flex gap-2 overflow-auto">
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className={`thumbnail-img ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="col-md-6">
            <div className="product-details">
              {/* Brand */}
              <h6 className="text-uppercase text-muted mb-2">{product.brand}</h6>

              {/* Product Name */}
              <h3 className="product-title mb-3">{product.name}</h3>

              {/* Price */}
              <div className="price-section mb-4">
                <h4 className="current-price d-inline me-3">₹{discountedPrice}</h4>
                <span className="original-price text-decoration-line-through text-muted me-2">
                  ₹{product.price}
                </span>
                <span className="discount-badge">{product.discount}% OFF</span>
                <p className="text-muted small mt-1">(MRP incl. of all taxes)</p>
              </div>

              {/* Size Selection */}
              <div className="size-section mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Select Size</h6>
                  <button className="btn btn-link text-dark p-0 text-decoration-underline small">
                    <i className="bi bi-rulers me-1"></i> Size guide
                  </button>
                </div>
                <div className="size-options d-flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="quantity-section mb-4">
                <h6 className="mb-2">Select Quantity</h6>
                <div className="quantity-selector d-inline-flex align-items-center border">
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange('decrement')}
                  >
                    -
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange('increment')}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button className="btn btn-dark w-100 mb-3 py-3" onClick={handleAddToCart}>
                ADD TO CART
              </button>

              {/* Delivery Options */}
              <div className="delivery-section mb-4 p-3 border">
                <h6 className="mb-3">Delivery Options <i className="bi bi-info-circle"></i></h6>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Pincode"
                  />
                  <button className="btn btn-outline-dark">CHECK</button>
                </div>
                <small className="text-muted">
                  Please enter PIN code to check delivery time & Pay on Delivery Availability
                </small>

                <div className="mt-3">
                  <p className="mb-2">
                    <i className="bi bi-cash-coin me-2"></i>
                    <strong>Cash on Delivery (COD) available</strong>
                  </p>
                  <p className="mb-0">
                    <i className="bi bi-arrow-return-left me-2"></i>
                    <strong>Easy return & exchange</strong>
                  </p>
                </div>
              </div>

              {/* Offers */}
              <div className="offers-section mb-4">
                <h6 className="mb-3">2 Offers</h6>
                <div className="offer-item mb-2">
                  <i className="bi bi-tag-fill me-2"></i>
                  <span className="small">
                    BUY 2 OR MORE & Get additional 10% off with Code: BUY2OFUS
                  </span>
                </div>
                <div className="offer-item">
                  <i className="bi bi-tag-fill me-2"></i>
                  <span className="small">
                    Get Extra 5% off automatically at checkout on all prepaid orders
                  </span>
                </div>
              </div>

              {/* Product Tabs */}
              <div className="product-tabs">
                <div className="tabs-header border-bottom">
                  <button
                    className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab('description')}
                  >
                    Product Description
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shipping')}
                  >
                    Shipping & Return
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'care' ? 'active' : ''}`}
                    onClick={() => setActiveTab('care')}
                  >
                    Fabric and Care
                  </button>
                </div>

                <div className="tab-content mt-3">
                  {activeTab === 'description' && (
                    <div className="tab-pane">
                      <p>{product.description}</p>
                    </div>
                  )}
                  {activeTab === 'shipping' && (
                    <div className="tab-pane">
                      <p>Free shipping on orders above ₹999</p>
                      <p>Easy returns within 30 days</p>
                    </div>
                  )}
                  {activeTab === 'care' && (
                    <div className="tab-pane">
                      <p>Machine wash cold</p>
                      <p>Do not bleach</p>
                      <p>Tumble dry low</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Seller Info */}
              <div className="seller-info mt-4 p-3 bg-light">
                <p className="mb-0">
                  <strong>Seller:</strong> {product.brand || 'SAMARTH LIFESTYLE RETAILING PVT. LTD'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
