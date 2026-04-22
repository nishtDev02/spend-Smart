import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  TrendingUp,
  LayoutDashboard,
  Wallet,
  Receipt,
  Sparkles,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { path: "/income", label: "Income", icon: <Wallet size={16} /> },
    { path: "/expenses", label: "Expenses", icon: <Receipt size={16} /> },
    { path: "/ai-insights", label: "AI Insights", icon: <Sparkles size={16} /> },
  ];

  const isActive = (path) => location.pathname === path
  return (
    <nav className="border-b border-white/5 bg-gray-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16"> 
          {/* Logo */}
          <Link className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">Spend<span className="text-emerald-400">Smart</span></span>
          </Link>

          {/* Nav links - only show when logged in */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive(link.path)
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                {user.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-gray-300 hidden md:block">{user.username}</span>
              </div>
              <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden md:block">Logout</span>
              </button>
              </>
            ) : (
              <>
               <Link
               to={'/login'}
               className="text-sm text-gray-300 hover:text-white transition-colors"
               >
              Login
              </Link>
              <Link
              to={'/signup'}
              className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
              Get Started
              </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
