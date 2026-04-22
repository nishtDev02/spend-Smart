import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  TrendingUp,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  BarChart3,
} from "lucide-react";
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side branding */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-linear-to-br from-emerald-950 to-gray-950 border-r border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            Spend
            <span className="text-emerald-400">Smart</span>
          </span>
        </div>

        {/* Middle content */}
        <div>
          <h1 className="text-4xl text-white font-bold mb-4 leading-tight">
            Take control of your
            <span className="block text-emerald-400">financial life</span>
          </h1>
          <p className="text-gray-400 mb-10">
            Track income, manage expenses, and get AI-powered insights to make
            smarter financial decisions.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              {
                icon: <BarChart3 size={18} />,
                text: "Visuals expense breakdown & charts",
              },
              {
                icon: <Sparkles size={18} />,
                text: "AI-powered personalized insights",
              },
              {
                icon: <ShieldCheck size={18} />,
                text: "Secure & private - your data stays yours",
              },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">{feature.icon}</div>
                <span className="text-gray-300 text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "10K+", label: "Users" },
            { value: "₹2Cr+", label: "Tracked" },
            { value: "94%", label: "Satisfaction" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-emerald-400 font-bold text-lg">{stat.value}</div>
              <div className="text-gray-400 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side form */}
      <div className="flex items-center justify-center px-6 py-12 bg-gray-950">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 md:hidden">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-white text-xl font-bold">Spend<span className="text-emerald-400">Smart</span></span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
          <p className="text-gray-400 text-sm mb-8">Enter your credentials to continue.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm text-gray-400 mb-1.5 block">Email</label>
              <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@gmail.com"
              required
              className="w-full br-gray-900 border border-white/10 px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm text-gray-400 mb-1.5 block">Password</label>
              <div className="relative">
                <input 
                type={showPassword ? 'text' : 'password'} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors pr-12"
                />

                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-all hover:scale-[1.02] mt-2">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to={'/signup'} className="text-emerald-400 hover:text-emerald-300">
            Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
