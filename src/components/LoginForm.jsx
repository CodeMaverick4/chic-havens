import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authReducer";
import axios from "axios";
import { toggleModal } from "../redux/slices/modalReducer";
import { db } from "../firebase";
import { ref, get, push, set } from "firebase/database";

const LoginForm = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            setLoading(true);
            const API_KEY = import.meta.env.VITE_APIKEY;

            const res = await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
                { email, password, returnSecureToken: true }
            );

            const uid = res.data.localId;
            const token = res.data.idToken;

            const userRef = ref(db, `users/${uid}`);
            const snapshot = await get(userRef);

            let chatId;

            if (snapshot.exists() && snapshot.val().chatId) {
                chatId = snapshot.val().chatId;
            } else {
                const newChatRef = push(ref(db, "chic-havens-enquiries"));
                chatId = newChatRef.key;

                await set(ref(db, `chic-havens-enquiries/${chatId}`), {
                    user: { uid, email, createdAt: Date.now() },
                    messages: {},
                });

                await set(userRef, {
                    email,
                    chatId,
                    createdAt: Date.now(),
                });
            }

            const user = { uid, email, token, chatId };
            dispatch(login(user));
            dispatch(toggleModal(null));

            setPassword("");
            setEmail("");
            setErrors({});
        } catch (err) {
            console.error("Login error:", err);
            setErrors({
                general: err.response?.data?.error?.message || "Invalid credentials. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-form-container">
            {/* Header */}
            <div className="text-center mb-4">
                <h3 className="fw-bold mb-2">Welcome Back</h3>
                <p className="text-muted small mb-0">Sign in to your account to continue</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin}>
                {/* Email Field */}
                <div className="mb-3">
                    <label className="form-label fw-semibold small">Email Address</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                            type="email"
                            className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                validateField("email", e.target.value);
                            }}
                            disabled={loading}
                        />
                    </div>
                    {errors.email && (
                        <div className="text-danger small mt-1">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.email}
                        </div>
                    )}
                </div>

                {/* Password Field */}
                <div className="mb-3">
                    <label className="form-label fw-semibold small">Password</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-lock text-muted"></i>
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`form-control border-start-0 border-end-0 ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                validateField("password", e.target.value);
                            }}
                            disabled={loading}
                        />
                        <span 
                            className="input-group-text bg-light border-start-0 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                        </span>
                    </div>
                    {errors.password && (
                        <div className="text-danger small mt-1">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.password}
                        </div>
                    )}
                </div>

                {/* General Error */}
                {errors.general && (
                    <div className="alert alert-danger py-2 px-3 small" role="alert">
                        <i className="bi bi-x-circle me-2"></i>
                        {errors.general}
                    </div>
                )}

                {/* Login Button */}
                <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2 fw-semibold mb-3"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Signing in...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Sign In
                        </>
                    )}
                </button>

                {/* Divider */}
                <div className="text-center mb-3">
                    <small className="text-muted">OR</small>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                    <span className="text-muted small">Don't have an account? </span>
                    <span
                        className="text-primary fw-semibold small cursor-pointer text-decoration-underline"
                        onClick={() => dispatch(toggleModal("signup"))}
                    >
                        Create Account
                    </span>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
