import { useState } from "react";
import "./dashboard.css";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Dashboard() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.info("Logged out successfully");
        navigate("/login");
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className="dashboard-container">
            {/* ── MOBILE HEADER ── */}
            <div className="mobile-header">
                <div className="mobile-logo">
                    <div className="logo-icon"></div>
                    <h2>RecoPay</h2>
                </div>
                <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                    )}
                </button>
            </div>

            <div className={`sidebar ${mobileMenuOpen ? "open" : ""}`}>
                <h2>RecoPay</h2>

                <NavLink to="/dashboard" end onClick={closeMobileMenu} className={({ isActive }) => isActive ? "active" : ""}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    Home
                </NavLink>

                <NavLink to="/dashboard/apply-loan" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "active" : ""}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                    Apply Loan
                </NavLink>

                <NavLink to="/dashboard/repayment" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "active" : ""}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                    Repayment
                </NavLink>

                <NavLink to="/dashboard/transactions" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "active" : ""}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    Transactions
                </NavLink>

                <NavLink to="/dashboard/emi-calculator" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "active" : ""}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="12" y2="10" /><line x1="8" y1="14" x2="12" y2="14" /><line x1="8" y1="18" x2="12" y2="18" /></svg>
                    EMI Calculator
                </NavLink>

                <NavLink to="/dashboard/support" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "active" : ""}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    Support
                </NavLink>

                <NavLink to="/dashboard/profile" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "active" : ""}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    Profile
                </NavLink>

                {/* SPACER */}
                <div style={{ flex: 1 }} />

                {/* ── THEME TOGGLE ── */}
                <button className="sidebar-toggle" onClick={toggleTheme}>
                    {theme === "dark" ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                    )}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>

                {/* ── USER + LOGOUT ── */}
                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {user?.avatar?.startsWith("http") ? (
                            <img src={user.avatar} alt={user?.name?.charAt(0) || "U"} referrerPolicy="no-referrer" />
                        ) : (
                            user?.avatar || user?.name?.charAt(0)?.toUpperCase() || "U"
                        )}
                    </div>
                    <div className="sidebar-user-info">
                        <span className="sidebar-username">{user?.name || "User"}</span>
                        <span className="sidebar-email">{user?.email || ""}</span>
                    </div>
                    <button className="sidebar-logout" onClick={handleLogout} title="Logout">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    </button>
                </div>
            </div>

            <div className="main">
                <Outlet />
            </div>

        </div>
    );
}

export default Dashboard;