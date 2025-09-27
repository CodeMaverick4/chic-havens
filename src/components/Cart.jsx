import { useDispatch, useSelector } from "react-redux"
import { changeQuantity, removeItem, setCartItems } from "../redux/slices/cartReducer";
import { useEffect } from "react";
import { toggleModal } from "../redux/slices/modalReducer";
import axios from "axios";

const Cart = ({ products, total }) => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth)

    const handleQuantityChange = (index, quantity) => {
        dispatch(changeQuantity({ index: index, quantity: quantity }))
    }
    const handleRemoveProduct = (index) => {
        dispatch(removeItem({ index: index }))
    }
    const handleOrder = async () => {
        if (!auth) {
            dispatch(toggleModal("login"));
            return;
        }

        try {
            const order = {
                userId: auth.uid,
                email: auth.email,
                items: products,
                total: total,
                createdAt: new Date().toISOString(),
            };

            // POST order to Firebase
            const response = await axios.post(
                `${import.meta.env.VITE_DATABASEURL}/travel-db/orders.json`,
                order
            );

            console.log("Order placed successfully:", response.data);

            // Clear cart after successful order
            localStorage.removeItem("cart");
            dispatch(setCartItems({ items: [], total: 0 }));
            alert("Order placed successfully!");
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        }
    };
    useEffect(() => {
        const cartLocal = JSON.parse(localStorage.getItem('cart'));
        if (cartLocal) dispatch(setCartItems({ items: cartLocal.items, total: cartLocal.total }));
    }, [])
    return (

        <div className="cart">
            {products.map((product, index) => (
                <div className="d-flex justify-content-between align-items-center my-3">

                    <img src={product.images[0] || ''} alt="" height={'150px'} width={'150px'} />
                    <div>
                        <div className="d-flex justify-content-between align-items-center">
                            <h4>{product.name}</h4>
                            <h4>${product.price}</h4>
                        </div>
                        <p>{product.description}</p>
                        <div className="cart-quantity">
                            <span className="cursor-pointer" onClick={() => handleQuantityChange(index, product.quantity - 1)}><i className="bi bi-dash"></i></span>
                            <span>{product.quantity}</span>
                            <span className="cursor-pointer" onClick={() => handleQuantityChange(index, product.quantity + 1)}><i className="bi bi-plus"></i></span>
                        </div>
                        <button onClick={() => handleRemoveProduct(index)}>Remove</button>
                    </div>
                </div>
            ))}

            <div className="d-flex align-items-center justify-content-between border-top border-black mt-4 py-3">
                <span className="fw-semibold fs-4">$ {total}</span>
                <button onClick={handleOrder}>
                    Order Now
                </button>
            </div>
        </div>
    )
}
export default Cart