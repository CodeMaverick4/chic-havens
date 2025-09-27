import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authReducer";
import { closeModal, toggleModal } from "../redux/slices/modalReducer";

const SignUpForm = () => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ email: "", password: "", confirm: "" });
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

        if (name === "confirm") {
            if (!value) message = "Confirm your password";
            else if (value !== form.password) message = "Passwords do not match";
        }

        setErrors((prev) => ({ ...prev, [name]: message }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        // validate all before submit
        validateField("email", form.email);
        validateField("password", form.password);
        validateField("confirm", form.confirm);

        if (errors.email || errors.password || errors.confirm) return;

        try {
            const API_KEY = import.meta.env.VITE_APIKEY;
            const res = await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
                { email: form.email, password: form.password, returnSecureToken: true }
            );

            const user = {
                uid: res.data.localId,
                email: res.data.email,
                token: res.data.idToken,
            };

            dispatch(login(user));
            setForm({ email: "", password: "", confirm: "" });
            dispatch(closeModal());
            setErrors({});
        } catch (err) {
            setErrors({
                general: err.response?.data?.error?.message || "Signup failed",
            });
        }
    };

    return (
        <form className="signup-form" onSubmit={handleSignUp}>
            <label>Email</label>
            <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="signup-input"
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <label>Password</label>
            <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="signup-input"
            />
            {errors.password && <p className="error">{errors.password}</p>}

            <label>Confirm Password</label>
            <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                className="signup-input"
            />
            {errors.confirm && <p className="error">{errors.confirm}</p>}

            {errors.general && <p className="error">{errors.general}</p>}

            <button type="submit" className="signup-btn">
                Sign Up
            </button>
            <span className="cursor-pointer" onClick={() => dispatch(toggleModal('login'))}>Have a account?</span>
        </form>
    );
};

export default SignUpForm;
