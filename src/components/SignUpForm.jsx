import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authReducer";
import { closeModal, toggleModal } from "../redux/slices/modalReducer";
import { auth, db } from "../firebase";
import { ref, set, push } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUpForm = () => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ email: "", password: "", confirm: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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

    // Validation
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!form.confirm) newErrors.confirm = "Confirm your password";
    else if (form.confirm !== form.password)
      newErrors.confirm = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      
      // Create user with Firebase SDK (NOT REST API)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
        
      );

      const uid = userCredential.user.uid;
      const email = userCredential.user.email;

      console.log("✅ User created:", uid);

      // Create chat entry with proper ID
      const newChatRef = push(ref(db, "chic-havens-enquiries"));
      const newChatId = newChatRef.key; // This generates a unique ID like "-OblSazp..."

      console.log("📝 Creating chat with ID:", newChatId);

      await set(ref(db, `chic-havens-enquiries/${newChatId}`), {
        user: {
          uid,
          email,
          createdAt: Date.now(),
          role: "customer",
        },
        messages: {},
      });

      console.log("✅ Chat created");

      // Create user profile
      await set(ref(db, `users/${uid}`), {
        email,
        chatId: newChatId,  // ← Store the chat ID here
        createdAt: Date.now(),
      });

      console.log("✅ User profile created");

      // Login user
      const user = {
        uid,
        email,
        token: await userCredential.user.getIdToken(),
        chatId: newChatId,  // ← Pass the chat ID to Redux
      };

      dispatch(login(user));
      setForm({ email: "", password: "", confirm: "" });
      dispatch(closeModal());
      setErrors({});

    } catch (err) {
      console.error("❌ Signup error:", err);
      setErrors({
        general: err.message || "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };


    return (
        <div className="signup-form-container">
            {/* Header */}
            <div className="text-center mb-4">
                <h3 className="fw-bold mb-2">Create Account</h3>
                <p className="text-muted small mb-0">Join Chic Havens today</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignUp}>
                {/* Email Field */}
                <div className="mb-3">
                    <label className="form-label fw-semibold small">Email Address</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                            type="email"
                            name="email"
                            className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
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
                            name="password"
                            className={`form-control border-start-0 border-end-0 ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="At least 6 characters"
                            value={form.password}
                            onChange={handleChange}
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

                {/* Confirm Password Field */}
                <div className="mb-3">
                    <label className="form-label fw-semibold small">Confirm Password</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-shield-check text-muted"></i>
                        </span>
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirm"
                            className={`form-control border-start-0 border-end-0 ${errors.confirm ? 'is-invalid' : ''}`}
                            placeholder="Re-enter your password"
                            value={form.confirm}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <span
                            className="input-group-text bg-light border-start-0 cursor-pointer"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                        </span>
                    </div>
                    {errors.confirm && (
                        <div className="text-danger small mt-1">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors.confirm}
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

                {/* Password Strength Indicator (Optional) */}
                {form.password && (
                    <div className="mb-3">
                        <div className="d-flex gap-1 mb-1">
                            <div className={`password-strength-bar ${form.password.length >= 2 ? 'active' : ''}`}></div>
                            <div className={`password-strength-bar ${form.password.length >= 4 ? 'active' : ''}`}></div>
                            <div className={`password-strength-bar ${form.password.length >= 6 ? 'active' : ''}`}></div>
                            <div className={`password-strength-bar ${form.password.length >= 8 ? 'active' : ''}`}></div>
                        </div>
                        <small className="text-muted">
                            {form.password.length < 6 ? 'Weak' : form.password.length < 8 ? 'Good' : 'Strong'} password
                        </small>
                    </div>
                )}

                {/* Sign Up Button */}
                <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-semibold mb-3"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Creating account...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-person-plus me-2"></i>
                            Create Account
                        </>
                    )}
                </button>

                {/* Divider */}
                <div className="text-center mb-3">
                    <small className="text-muted">OR</small>
                </div>

                {/* Login Link */}
                <div className="text-center">
                    <span className="text-muted small">Already have an account? </span>
                    <span
                        className="text-primary fw-semibold small cursor-pointer text-decoration-underline"
                        onClick={() => dispatch(toggleModal("login"))}
                    >
                        Sign In
                    </span>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;
