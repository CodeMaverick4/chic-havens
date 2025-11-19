import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("auth")) || null;

const AuthReducer = createSlice({
    name: "auth",
    initialState: savedUser,
    reducers: {
        login: (state, action) => {
            const userData = {
                uid: action.payload.uid,
                email: action.payload.email,
                name: action.payload.name || "",
                photo: action.payload.photo || "",
                token: action.payload.token,
                chatId: action.payload.chatId || null,
            };

            localStorage.setItem("auth", JSON.stringify(userData));
            return userData;
        },

        updateChatId: (state, action) => {
            if (!state) return state;
            const updatedUser = { ...state, chatId: action.payload };
            localStorage.setItem("auth", JSON.stringify(updatedUser));
            return updatedUser;
        },

        logout: () => {
            localStorage.removeItem("auth");
            return null;
        },
    },
});

export default AuthReducer.reducer;
export const { login, logout,updateChatId } = AuthReducer.actions;
