import { createSlice } from "@reduxjs/toolkit";

const ModalReducer = createSlice({
    name: 'modal',
    initialState: null,
    reducers: {
        toggleModal: (state, action) => {
            return action.payload; // Replace state with payload ("login" / "signup" / null)
        },
        closeModal: () => {
            return null; // explicit close
        },
    }
})

export default ModalReducer.reducer
export const { toggleModal,closeModal } = ModalReducer.actions