import { configureStore } from '@reduxjs/toolkit'
import cartReducer from "./slices/cartReducer";
import modalReducer from "./slices/modalReducer";
import authReducer from "./slices/authReducer";

const store = configureStore({
    reducer: {
        cart: cartReducer,
        modalForm: modalReducer,
        auth: authReducer
    }
})

export default store