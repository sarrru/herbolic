import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: []
};

const cartSlice = createSlice({
  name: "cartItem",
  initialState: initialState,
  reducers: {
    handleAddItemCart: (state, action) => {
      state.cart = [...action.payload];
    },
    clearCart: (state) => {
      state.cart = []; // ✅ This clears the cart on success
    }
  }
});

// ✅ Export both actions
export const { handleAddItemCart, clearCart } = cartSlice.actions;

// ✅ Default export of reducer
export default cartSlice.reducer;
