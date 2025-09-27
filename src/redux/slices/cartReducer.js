import { createSlice } from "@reduxjs/toolkit";

const CartReducer = createSlice({
    name: 'cart',
    initialState: JSON.parse(localStorage.getItem("cart")) || { items: [], total: 0 },
    reducers: {
        setCartItems: (state, action) => {
            state.items = action.payload.items;
            state.total = action.payload.total;
            
        },
        addToCart: (state, action) => {
            state.items.push({ ...action.payload.product, quantity: action.payload.quantity });
            state.total += Number(action.payload.product.price) * Number(action.payload.quantity);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeItem: (state, action) => {
            state.total -= state.items[action.payload.index].price * state.items[action.payload.index].quantity;
            state.items.splice(action.payload.index, 1);             
            localStorage.setItem('cart', JSON.stringify(state));
        },
        changeQuantity: (state, action) => {
            if (action.payload.quantity >= 1) {
                state.items[action.payload.index].quantity = action.payload.quantity
                state.total = state.items[action.payload.index].quantity * state.items[action.payload.index].price
            }
            localStorage.setItem('cart', JSON.stringify(state));
        }
    }
})

export default CartReducer.reducer
export const { addToCart, removeItem, changeQuantity, setCartItems } = CartReducer.actions




// import { createSlice } from "@reduxjs/toolkit";

// // Initialize from localStorage or default
// const initialState = JSON.parse(localStorage.getItem("cart")) || {
//   items: [],
//   total: 0,
// };

// const CartReducer = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     setCartItems: (state, action) => {
//       state.items = action.payload.items || [];
//       state.total = action.payload.total || 0;
//       localStorage.setItem("cart", JSON.stringify(state));
//     },

//     addToCart: (state, action) => {
//       const qty = action.payload.quantity || 1;
//       const existingIndex = state.items.findIndex(
//         (item) => item.id === action.payload.id
//       );

//       if (existingIndex >= 0) {
//         // If item exists → increase quantity
//         state.items[existingIndex].quantity += qty;
//       } else {
//         // Else → add new item
//         state.items.push({ ...action.payload, quantity: qty });
//       }

//       // Recalculate total safely
//       state.total = state.items.reduce(
//         (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
//         0
//       );

//       localStorage.setItem("cart", JSON.stringify(state));
//     },

//     removeItem: (state, action) => {
//       const index = action.payload.index;
//       if (state.items[index]) {
//         state.items.splice(index, 1);
//         state.total = state.items.reduce(
//           (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
//           0
//         );
//         localStorage.setItem("cart", JSON.stringify(state));
//       }
//     },

//     changeQuantity: (state, action) => {
//       const { index, quantity } = action.payload;
//       if (state.items[index] && quantity >= 1) {
//         state.items[index].quantity = quantity;
//         state.total = state.items.reduce(
//           (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
//           0
//         );
//         localStorage.setItem("cart", JSON.stringify(state));
//       }
//     },
//   },
// });

// export default CartReducer.reducer;
// export const { addToCart, removeItem, changeQuantity, setCartItems } =
//   CartReducer.actions;
