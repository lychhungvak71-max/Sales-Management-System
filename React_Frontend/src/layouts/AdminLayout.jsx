// src/layouts/AdminLayout.jsx
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutGrid,
    Package,
    Tags,
    ShoppingCart,
    Settings,
    ShoppingBag,
    LogOut,
    ChevronDown,
    ChevronRight,
    User,
    UserPlus,
    Users,
    KeyRound,
    UserStar,
    MonitorCog,
} from 'lucide-react';

export default function AdminLayout() {
    const navigate = useNavigate();

    // ទាញយកព័ត៌មាន User ពី localStorage
    const user = JSON.parse(localStorage.getItem('user')) || {};

    // 💡 មុខងារពិនិត្យសិទ្ធិ (Permission Check Helper)
    const hasPermission = (permissionKey) => {
        try {
            // បើជា Admin អាចចូលមើលបានទាំងអស់
            if (user.role === 'Admin') return true;

            const permissions = user.permissions || {};
            return permissions[permissionKey] === 'active';
        } catch (error) {
            console.error('Error checking permission:', error);
            return false;
        }
    };

    // State សម្រាប់ Toggle Hide/Show Sidebar
    const [isHide, setIsHide] = useState(false);

    // Auto-hide លើ Mobile Screen (< 768px)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsHide(true);
            } else {
                setIsHide(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // State សម្រាប់ បើក/បិទ User Expand Menu ក្នុង Sidebar
    const [isUserMamagementOpen, setIsUserMamagementOpen] = useState(false);
    const [isSystemsOpen, setIsSystemsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // State សម្រាប់ បើក/បិទ Profile Dropdown Menu ក្នុង Header
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // បិទ Dropdown វិញពេលចុច នៅក្រៅ Dropdown Area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    };

    const handleNavItemClick = () => {
        if (window.innerWidth < 768) {
            setIsHide(true);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-100 font-sans relative overflow-x-hidden text-slate-900">

            {/* Overlay សម្រាប់បិទ Sidebar វិញពេលចុចខាងក្រៅលើ Mobile */}
            {!isHide && (
                <div
                    onClick={() => setIsHide(true)}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
                />
            )}

            {/* ប៊ូតុង Toggle Floating Button ពេល Sidebar ត្រូវលាក់ */}
            {isHide && (
                <button
                    onClick={() => setIsHide(false)}
                    className="fixed left-3 top-3 md:top-20 md:left-0 z-40 p-2.5 md:p-2.5 rounded-2xl md:rounded-l-none md:rounded-r-xl shadow-xl border-2 border-slate-200 transition-all duration-200 
                            bg-amber-500 text-white hover:bg-amber-600 hover:scale-105 active:scale-95 md:hover:pr-3.5"
                    title="បង្ហាញ Menu"
                >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r-2 border-slate-200 text-slate-700 flex flex-col justify-between z-40 transition-all duration-300 ease-in-out shadow-lg ${isHide ? '-translate-x-full' : 'translate-x-0'
                    }`}
            >
                <div className="overflow-y-auto custom-scrollbar">
                    {/* Header Logo Area */}
                    <div className="p-5 flex items-center justify-between border-b-2 border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-md shadow-amber-500/30">
                                <ShoppingBag className="w-5 h-5 shrink-0 stroke-[2.5]" />
                            </div>
                            <div>
                                <h1 className="text-base font-extrabold text-slate-900 tracking-tight font-serif">
                                    Alto S.M
                                </h1>
                                <p className="text-[11px] text-amber-600 font-bold -mt-0.5">Management System</p>
                            </div>
                        </div>

                        {/* ប៊ូតុង Toggle លាក់ Sidebar */}
                        <button
                            type="button"
                            onClick={() => setIsHide(true)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                            title="លាក់ Menu"
                        >
                            <ChevronRight className="w-4 h-4 rotate-180 stroke-[2.5]" />
                        </button>
                    </div>

                    {/* Main Navigation Items (តម្រៀបតាមសិទ្ធិក្នុង MongoDB) */}
                    <nav className="p-3.5 space-y-2">
                        {hasPermission('dashboard') && (
                            <NavLink
                                to="/dashboard"
                                onClick={handleNavItemClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs tracking-wide transition-all duration-150 ${isActive
                                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-[1.01]'
                                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                    }`
                                }
                            >
                                <LayoutGrid className="w-4 h-4 shrink-0 stroke-[2.5]" />
                                <span>Dashboard</span>
                            </NavLink>
                        )}

                        {hasPermission('pos_checkout') && (
                            <NavLink
                                to="/pos-checkout"
                                onClick={handleNavItemClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs tracking-wide transition-all duration-150 ${isActive
                                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-[1.01]'
                                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                    }`
                                }
                            >
                                <ShoppingCart className="w-4 h-4 shrink-0 stroke-[2.5]" />
                                <span>POS-Checkout</span>
                            </NavLink>
                        )}

                        {hasPermission('order_history') && (
                            <NavLink
                                to="/order-history"
                                onClick={handleNavItemClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs tracking-wide transition-all duration-150 ${isActive
                                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-[1.01]'
                                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                    }`
                                }
                            >
                                <ShoppingCart className="w-4 h-4 shrink-0 stroke-[2.5]" />
                                <span>Order-History</span>
                            </NavLink>
                        )}

                        {hasPermission('sales_list') && (
                            <NavLink
                                to="/sales"
                                onClick={handleNavItemClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs tracking-wide transition-all duration-150 ${isActive
                                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-[1.01]'
                                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                    }`
                                }
                            >
                                <ShoppingCart className="w-4 h-4 shrink-0 stroke-[2.5]" />
                                <span>Sales List</span>
                            </NavLink>
                        )}

                        {hasPermission('customers') && (
                            <NavLink
                                to="/customer-list"
                                onClick={handleNavItemClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs tracking-wide transition-all duration-150 ${isActive
                                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-[1.01]'
                                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                    }`
                                }
                            >
                                <Users className="w-4 h-4 shrink-0 stroke-[2.5]" />
                                <span>Customers</span>
                            </NavLink>
                        )}

                        {hasPermission('products') && (
                            <NavLink
                                to="/product-list"
                                onClick={handleNavItemClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs tracking-wide transition-all duration-150 ${isActive
                                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-[1.01]'
                                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                    }`
                                }
                            >
                                <Package className="w-4 h-4 shrink-0 stroke-[2.5]" />
                                <span>Products</span>
                            </NavLink>
                        )}

                        {hasPermission('categories') && (
                            <NavLink
                                to="/product-category-list"
                                onClick={handleNavItemClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-xs tracking-wide transition-all duration-150 ${isActive
                                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-[1.01]'
                                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                    }`
                                }
                            >
                                <Tags className="w-4 h-4 shrink-0 stroke-[2.5]" />
                                <span>Categories</span>
                            </NavLink>
                        )}

                        {/* 💡 USER MANAGEMENT SECTION WITH SUB-MENU (បង្ហាញបើមានសិទ្ធិណាមួយក្នុងกลุ่ม) */}
                        {(hasPermission('register_user_login') || hasPermission('user_manager_list') || hasPermission('add_position') || hasPermission('user_role_form') || hasPermission('user_permissions')) && (
                            <div className="pt-1">
                                <button
                                    type="button"
                                    onClick={() => setIsUserMamagementOpen(!isUserMamagementOpen)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs transition-all ${isUserMamagementOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <User className="w-4 h-4 shrink-0 stroke-[2.5]" />
                                        <span>User Management</span>
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${isUserMamagementOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Sub-menu Items */}
                                {isUserMamagementOpen && (
                                    <div className="mt-1.5 ml-3 pl-3 border-l-2 border-slate-200 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                        {hasPermission('register_user_login') && (
                                            <NavLink
                                                to="/register"
                                                onClick={handleNavItemClick}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${isActive
                                                        ? 'bg-amber-500 text-white shadow-sm'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                    }`
                                                }
                                            >
                                                <UserPlus className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                                                <span>Register User & Login</span>
                                            </NavLink>
                                        )}

                                        {hasPermission('user_manager_list') && (
                                            <NavLink
                                                to="/user-list"
                                                onClick={handleNavItemClick}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${isActive
                                                        ? 'bg-amber-500 text-white shadow-sm'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                    }`
                                                }
                                            >
                                                <Users className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                                                <span>User Manager & List</span>
                                            </NavLink>
                                        )}

                                        {hasPermission('add_position') && (
                                            <NavLink
                                                to="/user-position-list"
                                                onClick={handleNavItemClick}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${isActive
                                                        ? 'bg-amber-500 text-white shadow-sm'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                    }`
                                                }
                                            >
                                                <UserStar className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                                                <span>Add Position</span>
                                            </NavLink>
                                        )}

                                        {hasPermission('user_role_form') && (
                                            <NavLink
                                                to="/user-role-list"
                                                onClick={handleNavItemClick}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${isActive
                                                        ? 'bg-amber-500 text-white shadow-sm'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                    }`
                                                }
                                            >
                                                <UserStar className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                                                <span>Add Form & Role</span>
                                            </NavLink>
                                        )}

                                        {hasPermission('user_permissions') && (
                                            <NavLink
                                                to="/user-permission-list"
                                                onClick={handleNavItemClick}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${isActive
                                                        ? 'bg-amber-500 text-white shadow-sm'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                    }`
                                                }
                                            >
                                                <UserStar className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                                                <span>Add Permiss & Path</span>
                                            </NavLink>
                                        )}

                                        {hasPermission('user_permissions') && (
                                            <NavLink
                                                to="/user-permission-control"
                                                onClick={handleNavItemClick}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${isActive
                                                        ? 'bg-amber-500 text-white shadow-sm'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                    }`
                                                }
                                            >
                                                <UserStar className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                                                <span>User Permiss & Mana</span>
                                            </NavLink>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 💡 SYSTEMS SECTION WITH SUB-MENU */}
                        {(hasPermission('edit_profile') || hasPermission('change_password')) && (
                            <div className="pt-1">
                                <button
                                    type="button"
                                    onClick={() => setIsSystemsOpen(!isSystemsOpen)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs transition-all ${isSystemsOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <MonitorCog className="w-4 h-4 shrink-0 stroke-[2.5]" />
                                        <span>Systems</span>
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${isSystemsOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Sub-menu Items */}
                                {isSystemsOpen && (
                                    <div className="mt-1.5 ml-3 pl-3 border-l-2 border-slate-200 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                        {hasPermission('edit_profile') && (
                                            <NavLink
                                                to="/edit-profile"
                                                onClick={handleNavItemClick}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${isActive
                                                        ? 'bg-amber-500 text-white shadow-sm'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                    }`
                                                }
                                            >
                                                <User className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                                                <span>Edit Profile</span>
                                            </NavLink>
                                        )}

                                        {hasPermission('change_password') && (
                                            <NavLink
                                                to="/change-password"
                                                onClick={handleNavItemClick}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${isActive
                                                        ? 'bg-amber-500 text-white shadow-sm'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                                    }`
                                                }
                                            >
                                                <KeyRound className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                                                <span>Change Password</span>
                                            </NavLink>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </nav>
                </div>

                {/* Bottom Settings Section */}
                <div className="p-3.5 border-t-2 border-slate-100 bg-slate-50/50">
                    {isSettingsOpen && (
                        <div className="mb-2 space-y-1.5 bg-white p-2 rounded-xl border-2 border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-150">
                            {hasPermission('edit_profile') && (
                                <NavLink
                                    to="/edit-profile"
                                    onClick={handleNavItemClick}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${isActive
                                            ? 'bg-amber-500 text-white'
                                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                        }`
                                    }
                                >
                                    <User className="w-4 h-4 shrink-0 stroke-[2.5]" />
                                    <span>Edit Profile</span>
                                </NavLink>
                            )}

                            {hasPermission('change_password') && (
                                <NavLink
                                    to="/change-password"
                                    onClick={handleNavItemClick}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${isActive
                                            ? 'bg-amber-500 text-white'
                                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                        }`
                                    }
                                >
                                    <KeyRound className="w-4 h-4 shrink-0 stroke-[2.5]" />
                                    <span>Change Password</span>
                                </NavLink>
                            )}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs transition-all ${isSettingsOpen ? 'bg-slate-200 text-slate-900' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Settings className="w-4 h-4 shrink-0 stroke-[2.5]" />
                            <span>Settings</span>
                        </div>
                        <ChevronDown
                            className={`w-4 h-4 stroke-[2.5] transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''
                                }`}
                        />
                    </button>
                </div>
            </aside>

            {/* Content Section */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isHide ? 'ml-0' : 'md:ml-64 ml-0'}`}>
                {/* Top Header */}
                <header className="h-16 bg-white border-b-2 border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3 pl-12 md:pl-0">
                        <span className="text-sm font-extrabold text-slate-900 tracking-wide">
                            ប្រព័ន្ធគ្រប់គ្រងការលក់
                        </span>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition focus:outline-none bg-white"
                        >
                            {user?.photo ? (
                                <img
                                    src={user.photo}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-lg object-cover border-2 border-amber-500"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-serif font-extrabold flex items-center justify-center text-sm">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                            )}

                            <span className="text-xs font-extrabold text-slate-800 hidden sm:inline">
                                {user?.name || 'Admin User'}
                            </span>

                            <ChevronDown className={`w-4 h-4 text-slate-600 stroke-[2.5] transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Profile Dropdown Card */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="px-4 py-2 border-b-2 border-slate-100 bg-slate-50/50">
                                    <p className="text-xs font-extrabold text-slate-900 truncate">{user?.name || 'Admin User'}</p>
                                    <p className="text-[11px] font-semibold text-slate-500 truncate">{user?.email || 'admin@example.com'}</p>
                                </div>

                                {hasPermission('edit_profile') && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            navigate('/edit-profile');
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2.5 transition"
                                    >
                                        <User className="w-4 h-4 text-slate-500 stroke-[2.5]" />
                                        <span>កែប្រែ ព័ត៌មាន (Edit Profile)</span>
                                    </button>
                                )}

                                {hasPermission('change_password') && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            navigate('/change-password');
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2.5 transition"
                                    >
                                        <KeyRound className="w-4 h-4 text-slate-500 stroke-[2.5]" />
                                        <span>ប្តូរ លេខសម្ងាត់ (Change Pass)</span>
                                    </button>
                                )}

                                <div className="border-t-2 border-slate-100 my-1"></div>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition"
                                >
                                    <LogOut className="w-4 h-4 text-rose-600 stroke-[2.5]" />
                                    <span>ចាកចេញ (Logout)</span>
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content View */}
                <main className="p-4 md:p-8 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}