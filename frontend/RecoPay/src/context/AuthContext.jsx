import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("recopay_user");
        return saved ? JSON.parse(saved) : null;
    });

    const login = async (userData) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to login");

        setUser(data);
        localStorage.setItem("recopay_user", JSON.stringify(data));
        localStorage.setItem("recopay_token", data.token);
    };

    const signup = async (userData) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to signup");

        setUser(data);
        localStorage.setItem("recopay_user", JSON.stringify(data));
        localStorage.setItem("recopay_token", data.token);
    };

    const loginWithGoogle = async (googleUser) => {
        const userData = {
            name: googleUser.name || googleUser.email.split("@")[0],
            email: googleUser.email,
            picture: googleUser.picture
        };

        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to login with Google");

        setUser(data);
        localStorage.setItem("recopay_user", JSON.stringify(data));
        localStorage.setItem("recopay_token", data.token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("recopay_user");
        localStorage.removeItem("recopay_token");
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
