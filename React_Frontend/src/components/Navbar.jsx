import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // State សម្រាប់បើក/បិទ Dropdown
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // បិទ Dropdown វិញពេលចុច នៅខាងក្រៅ Menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            navigate('/login', { replace: true });
        }
    };

    return (
        <nav className="bg-white shadow px-6 py-4 flex justify-between items-center relative z-50">
            {/* Title & Navigation Links */}
            <div className="flex items-center gap-6">
                <Link to="/dashboard" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
                    ប្រព័ន្ធគ្រប់គ្រងការលក់
                </Link>
                <div className="flex gap-4 text-sm font-medium">
                    <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition">
                        Dashboard
                    </Link>
                    <Link to="/sales" className="text-gray-600 hover:text-blue-600 transition">
                        Sales
                    </Link>
                </div>
            </div>

            {/* User Profile & Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
                {/* 💡 ចុចលើឈ្មោះ User ដើម្បី បើក/បិទ Dropdown */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 focus:outline-none py-1 px-2 rounded-lg hover:bg-gray-100 transition"
                >
                    <div className="flex items-center gap-2">
                        {/* បង្ហាញរូបភាព Profile ប្រសិនបើមាន បើគ្មានទេបង្ហាញអាយខន 👤 */}
                        {user?.photo ? (
                            <img
                                src={user.photo}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            />
                        ) : (
                            <span className="text-xl">👤</span>
                        )}

                        {/* បង្ហាញឈ្មោះ User */}
                        <span className="text-gray-700 font-medium">{user?.name || 'User'}</span>
                    </div>
                    <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* 💡 Dropdown Menu លោតមកខាងក្រោមពេល isOpen = true */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-xs text-gray-500">គណនី</p>
                            <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition font-medium"
                        >
                            <span>🚪</span> ចាកចេញ (Logout)
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}