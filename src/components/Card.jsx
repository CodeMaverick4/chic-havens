import { useState } from "react";
import { useDispatch } from 'react-redux';
import { addToCart } from "../redux/slices/cartReducer";
import { Navigate, useNavigate } from "react-router";

const Card = ({ product }) => {
    const [images, setImages] = useState(product.images?.length ? [...product.images] : []);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    console.log(product);
    const handleAdd = () => {
        dispatch(addToCart({ product: product, quantity: 1 }));
        //   dispatch(addToCart({ product: product, quantity: 1 }));
    };

    const handleNextImage = () => {
        setSelectedImage(prev => (prev + 1) % images.length);
    };

    const handlePrevImage = () => {
        setSelectedImage(prev => (prev - 1 + images.length) % images.length);
    };

    const handleQuickView = () => {
        
        navigate(`/product/${product.id}`)
    };

    const handleWishlistToggle = () => {
        setIsWishlisted(!isWishlisted);
        // Dispatch to wishlist redux if needed
    };

    return (
        <div className="product-card">
            <div className="position-relative product-card-image-container">
                <div className="product-card-img-wrapper">
                    {images.length === 0 ? (
                        <div className="no-image-text">No images</div>
                    ) : (
                        <img src={images[selectedImage]} alt={product.name} />
                    )}
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <i
                            className="bi bi-chevron-left product-card-icon product-card-icon-left"
                            onClick={handlePrevImage}
                        ></i>
                        <i
                            className="bi bi-chevron-right product-card-icon product-card-icon-right"
                            onClick={handleNextImage}
                        ></i>
                    </>
                )}

                {/* Wishlist Heart Icon */}
                <div 
                    className="wishlist-icon"
                    onClick={handleWishlistToggle}
                >
                    <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                </div>

                {/* Quick View Button */}
                <button 
                    className="quick-view-btn"
                    onClick={handleQuickView}
                >
                    QUICK VIEW
                </button>
            </div>

            <div className="product-card-content">
                <h5 className="mt-3 brand-name">{product.brand}</h5>
                <p className="fw-semibold truncate product-name">{product.name}</p>

                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex flex-column">
                        <span className="current-price">
                            ₹{product ? (Number(product.price) - (Number(product.price) * Number(product.discount)) / 100).toFixed(2) : 0}
                        </span>
                        <div className="d-flex gap-2 align-items-center">
                            <span className="actual-price">₹{product.price}</span>
                            <span className="discount-tag">{product?.discount}% OFF</span>
                        </div>
                    </div>
                    <button className="add-to-cart-btn" onClick={handleAdd}>
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
