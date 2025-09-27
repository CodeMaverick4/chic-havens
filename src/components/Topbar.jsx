import { useState } from "react";
import Cart from "./Cart";
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal } from "../redux/slices/modalReducer";
import { logout } from "../redux/slices/authReducer";

const Topbar = () => {
    const dispatch = useDispatch()
    const [showCart, setShowCart] = useState(false);
    const products = useSelector(state => state.cart.items)
    const total = useSelector(state => state.cart.total)
    const auth =  useSelector(state => state.auth)

    const toggleCart = () => {
        if (products.length > 0) {
            setShowCart(prev => !prev)
        }
    }
    return (
        <div className="topbar position-relative">
            <img src="/newLogo.svg" alt="" width='90px' />
            <div className="d-flex align-items-center gap-2 position-relative">
                {/* Link */}
                <i class="bi bi-cart d-md-none fs-5 me-2"></i>
                <i class="bi bi-person-circle d-md-none fs-5 me-2"></i>
                <i class="bi bi-box-arrow-left d-md-none fs-5"></i>

                <button className="button" onClick={toggleCart}>{products.length} Cart</button>
                
                {!auth && <button className="button" onClick={() => dispatch(toggleModal('login'))}>Login</button>}
                {!auth && <button className="button" onClick={() => dispatch(toggleModal('signup'))}>SignUp</button>}
                {auth && <button className="button " ><i class="bi bi-person-circle me-2 "></i> {auth.name ?  auth.name : "Account"}</button>}
                
                {auth && <button className="button bg-danger" onClick={() => dispatch(logout())}><i class="bi bi-box-arrow-left"></i>Logout</button>}
                {showCart && products.length > 0 && <Cart products={products} total={total} />}
            </div>

        </div>
    )
}

export default Topbar