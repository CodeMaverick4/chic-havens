import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existingIndex = state.items.findIndex(item => item.id === product.id);
      
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      
      // Calculate total
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    removeFromCart: (state, action) => {
      const { index } = action.payload;
      state.items.splice(index, 1);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    updateQuantity: (state, action) => {
      const { index, quantity } = action.payload;
      state.items[index].quantity = quantity;
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem('cart');
    },
    
    setCartItems: (state, action) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
