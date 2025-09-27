import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authReducer";
import axios from "axios";
import { toggleModal } from "../redux/slices/modalReducer";

const LoginForm = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        let message = "";

        if (name === "email") {
            if (!value) message = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                message = "Invalid email format";
        }

        if (name === "password") {
            if (!value) message = "Password is required";
            else if (value.length < 6)
                message = "Password must be at least 6 characters";
        }

        setErrors((prev) => ({ ...prev, [name]: message }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // fresh validation
        const newErrors = {};
        if (!email) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            newErrors.email = "Invalid email format";

        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6)
            newErrors.password = "Password must be at least 6 characters";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const API_KEY = import.meta.env.VITE_APIKEY; // check .env spelling
            const res = await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
                { email, password, returnSecureToken: true }
            );

            if (res.data.error) {
                throw new Error(res.data.error.message);
            }

            const user = {
                uid: res.data.localId,
                email: res.data.email,
                token: res.data.idToken,
            };

            dispatch(login(user));
            dispatch(toggleModal(null));
            setPassword("");
            setEmail("");
            setErrors({});
        } catch (err) {
            setErrors({
                general: err.message || "Login failed",
            });
        }
    };


    return (
        <form className="login-form" onSubmit={handleLogin}>
            <label>Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    validateField("email", e.target.value);
                }}
                className="login-input"
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}

            <label>Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    validateField("password", e.target.value);
                }}
                className="login-input"
            />
            {errors.password && <p className="error-msg">{errors.password}</p>}

            {errors.general && <p className="error-msg">{errors.general}</p>}

            <button type="submit" className="login-btn">
                Login
            </button>

            <span className="cursor-pointer" onClick={() => dispatch(toggleModal('signup'))}>Don't have an Account?</span>
        </form>
    );
};

export default LoginForm;
