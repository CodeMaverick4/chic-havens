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
                name: action.payload.displayName || "",
                photo: action.payload.photoURL || "",
                token: action.payload.token, 
            };

            localStorage.setItem("auth", JSON.stringify(userData));
            return userData;
        },

        logout: () => {
            localStorage.removeItem("auth");
            return null;
        },
    },
});

export default AuthReducer.reducer;
export const { login, logout } = AuthReducer.actions;
