import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from "../redux/slices/cartReducer";
const Card = ({ product }) => {
    const [images, setImages] = useState([...product.images] || []);
    const [selectedImage, setSelectedImage] = useState(0);
    const caart = useSelector(state => state.cart)
    console.log(caart)
    // console.log(product.images);
    const dispatch = useDispatch();

    const handleAdd = () => {
        dispatch(addToCart({ product: product, quantity: 1 }))
    }
    const handleNextImage = () => {
        setSelectedImage(prev => (prev + 1) % images.length);
    }

    const handlePrevImage = () => {
        setSelectedImage(prev => (prev - 1 + images.length) % images.length);
    }
    return (
        <div className="product-card">
            <div className="position-relative">
                <div className="product-card-img-wrapper">
                    <img src={images[selectedImage]} alt="" />
                </div>
                <i
                    className="bi bi-chevron-left product-card-icon product-card-icon-left"
                    onClick={handlePrevImage}
                ></i>
                <i
                    className="bi bi-chevron-right product-card-icon product-card-icon-right"
                    onClick={handleNextImage}
                ></i>
            </div>
            <h5 className="mt-3">{product.brand}</h5>
            <p className="fw-semibold fs-5">{product.name}</p>
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="fw-semibold"> $ {product.price}</h4>
                <button onClick={() => handleAdd(product)}>Add to cart</button>
            </div>
        </div>
    )
}

export default Card