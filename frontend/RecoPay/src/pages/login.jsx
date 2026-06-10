import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useGoogleLogin } from "@react-oauth/google";
import "./login.css";

function Login() {
    const { login, signup, loginWithGoogle } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [mode, setMode] = useState("login"); // login | signup
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ── LOGIN ──
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            await login({ email: form.email, password: form.password });
            toast.success("Welcome back! 👋");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message || "Invalid email or password");
        }
    };

    // ── SIGNUP ──
    const handleSignup = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password) {
            toast.error("Please fill all fields");
            return;
        }

        if (form.password.length < 4) {
            toast.error("Password must be at least 4 characters");
            return;
        }

        try {
            await signup({
                name: form.name,
                email: form.email,
                password: form.password
            });
            toast.success("Account created successfully! 🎉");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message || "Signup failed");
        }
    };

    // ── REAL GOOGLE LOGIN with Account Chooser ──
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Fetch user info from Google using the access token
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await res.json();

                await loginWithGoogle({
                    name: userInfo.name,
                    email: userInfo.email,
                    picture: userInfo.picture,
                });

                toast.success("Signed in with Google! 🎉");
                navigate("/dashboard");
            } catch (err) {
                console.error("Google login error:", err);
                toast.error("Google sign-in failed. Please try again.");
            }
        },
        onError: () => {
            toast.error("Google sign-in was cancelled.");
        },
        prompt: "select_account", // ✅ Forces account chooser every time
    });

    return (
        <div className="login-page">

            {/* BACKGROUND DECORATION */}
            <div className="login-bg-orb orb-1" />
            <div className="login-bg-orb orb-2" />
            <div className="login-bg-orb orb-3" />

            <div className="login-container">

                {/* LEFT - BRANDING */}
                <div className="login-brand">
                    <div className="brand-logo">
                        <div className="brand-icon" />
                        <span>RecoPay</span>
                    </div>
                    <h1>Smart Loan<br />Management</h1>
                    <p>Track your loans, manage EMIs, and stay on top of your finances — all in one place.</p>

                    <div className="brand-features">
                        <div className="brand-feature">
                            <span className="feature-dot" />
                            EMI Calculator with Interest
                        </div>
                        <div className="brand-feature">
                            <span className="feature-dot" />
                            Real-time Repayment Tracking
                        </div>
                        <div className="brand-feature">
                            <span className="feature-dot" />
                            Transaction History & Export
                        </div>
                    </div>
                </div>

                {/* RIGHT - FORM */}
                <div className="login-card">

                    <h2>
                        {mode === "login" && "Welcome back"}
                        {mode === "signup" && "Create account"}
                    </h2>
                    <p className="login-subtitle">
                        {mode === "login" && "Sign in to your account"}
                        {mode === "signup" && "Get started for free"}
                    </p>

                    <form onSubmit={mode === "login" ? handleLogin : handleSignup}>
                        {/* NAME (signup only) */}
                        {mode === "signup" && (
                            <div className="login-field">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

                        {/* EMAIL */}
                        <div className="login-field">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="login-field">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="login-submit">
                            {mode === "login" && "Sign In"}
                            {mode === "signup" && "Create Account"}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div className="login-divider">
                        <span>or</span>
                    </div>

                    {/* REAL GOOGLE SIGN-IN BUTTON */}
                    <button className="login-google-btn" onClick={() => googleLogin()}>
                        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8.5h11.3C34 33.3 29.5 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6.2-6.2C34.1 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.1-2.7-.4-4z" /><path fill="#FF3D00" d="M6.3 14.7l7.1 5.2C15 16.5 19.1 14 24 14c3 0 5.7 1.1 7.8 2.9l6.2-6.2C34.1 5.1 29.3 3 24 3 16.3 3 9.7 7.6 6.3 14.7z" /><path fill="#4CAF50" d="M24 45c5.2 0 10-1.8 13.7-5l-6.7-5.5C29.2 36 26.7 37 24 37c-5.4 0-10-3.6-11.7-8.5L5.2 34C8.6 41.2 15.8 45 24 45z" /><path fill="#1976D2" d="M43.6 20H24v8.5h11.3c-.8 2.6-2.5 4.7-4.8 6.1l6.7 5.5C41.4 36.2 45 30.7 45 24c0-1.3-.1-2.7-.4-4z" /></svg>
                        Continue with Google
                    </button>

                    {/* SWITCH MODE */}
                    <div className="login-switch">
                        {mode === "login" && (
                            <p>Don't have an account? <button onClick={() => { setMode("signup"); setForm({ name: "", email: "", password: "" }); }}>Sign up</button></p>
                        )}
                        {mode === "signup" && (
                            <p>Already have an account? <button onClick={() => { setMode("login"); setForm({ name: "", email: "", password: "" }); }}>Sign in</button></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
