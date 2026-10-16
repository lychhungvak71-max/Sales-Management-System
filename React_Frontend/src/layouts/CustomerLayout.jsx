// src/layouts/CustomerLayout.jsx
import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, ShoppingCart, User, LogOut } from 'lucide-react';

export default function CustomerLayout() {
    const navigate = useNavigate();
    const token = localStorage.getItem('auth_token');
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F7F6F2]">
            {/* Top Store Navigation Bar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6 text-amber-600" />
                        <span className="text-xl font-serif font-bold text-gray-900 tracking-wide">
                            Alto Store
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
                        <NavLink to="/" className={({ isActive }) => isActive ? 'text-amber-600 font-semibold' : 'hover:text-amber-600 transition'}>
                            Home
                        </NavLink>
                        <NavLink to="/shop" className={({ isActive }) => isActive ? 'text-amber-600 font-semibold' : 'hover:text-amber-600 transition'}>
                            Shop
                        </NavLink>
                        <NavLink to="/categories" className={({ isActive }) => isActive ? 'text-amber-600 font-semibold' : 'hover:text-amber-600 transition'}>
                            Categories
                        </NavLink>
                    </nav>

                    {/* Quick Action Icons */}
                    <div className="flex items-center gap-4">
                        <Link to="/cart" className="p-2 text-gray-600 hover:text-amber-600 relative transition">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute top-1 right-1 bg-amber-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                0
                            </span>
                        </Link>

                        {token ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 text-sm font-medium text-gray-700 focus:outline-none">
                                    {user?.photo ? (
                                        <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full object-cover border" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                                        </div>
                                    )}
                                </button>
                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 hidden group-hover:block z-50">
                                    <Link to="/my-orders" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                                        My Orders
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1"
                                    >
                                        <LogOut className="w-3 h-3" /> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="text-xs font-semibold bg-[#181611] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Dynamic Customer Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-6">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-[#181611] text-gray-400 py-8 text-center text-xs border-t border-gray-800 mt-auto">
                <p>© {new Date().getFullYear()} Alto Store. All rights reserved.</p>
            </footer>
        </div>
    );
}