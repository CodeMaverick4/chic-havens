import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal } from "../redux/slices/modalReducer";
import { logout } from "../redux/slices/authReducer";
import { useNavigate } from "react-router";
import CartSidebar from "./CartSidebar";

const Topbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const products = useSelector(state => state.cart.items)
    const total = useSelector(state => state.cart.total)
    const auth = useSelector(state => state.auth)

    const toggleCart = () => {
        if (products.length > 0) {
            setIsCartOpen(prev => !prev)
        }
    }
    return (
        <div className="topbar position-relative">
            <img src="/newLogo.svg" alt="" width='90px' onClick={() => navigate('/')} className="cursor-pointer" />
            <div className="d-flex align-items-center gap-2 position-relative">
                {/* <button className="button" onClick={toggleCart}>{products.length} Cart</button> */}
                {/* <img className="topbar-cart-icon" src="shopping-bag.png" alt="" onClick={toggleCart} height={25} /> */}
                
                <div className={`topbar-cart-icon ${products.length === 0 ? 'empty' : ''}`}>
                    <img

                        src="shopping-bag.png"
                        alt="Shopping Cart"
                        onClick={toggleCart}
                        height={25}
                        data-count={products.length} // Pass count here
                    />
                </div>
                {!auth && <>
                    {/* <button className="button" onClick={() => dispatch(toggleModal('login'))}>Login</button>
                    <button className="button" onClick={() => dispatch(toggleModal('signup'))}>SignUp</button> */}
                    <button className="button" onClick={() => dispatch(toggleModal('login'))}>Authenticate Yourself</button>
                </>}

                {auth &&
                    <>
                        <button className="button " onClick={() => navigate('/account')} ><i class="bi bi-person-circle me-2 "></i> {auth.name ? auth.name : "Account"}</button>
                        <button className="button bg-danger" onClick={() => dispatch(logout())}><i class="bi bi-box-arrow-left"></i>Logout</button>
                    </>}

                <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>

        </div>
    )
}

export default Topbar
