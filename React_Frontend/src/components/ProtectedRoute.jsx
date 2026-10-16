// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ permissionKey, children }) {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    const location = useLocation();

    // ១. បើគ្មាន Token ទេ -> ដេញទៅ Login
    if (!token || !userStr) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    try {
        const user = JSON.parse(userStr);
        const userStatus = user?.status ? user.status.toLowerCase() : '';

        // ២. ពិនិត្យស្ថានភាព User
        if (userStatus !== 'active') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            return <Navigate to="/login" state={{ from: location }} replace />;
        }

        // ៣. ពិនិត្យសិទ្ធិ (Permission Check) តាម MongoDB
        if (permissionKey && user.role !== 'Admin') {
            const permissions = user.permissions || {};
            if (permissions[permissionKey] !== 'active') {
                return (
                    <div className="p-8 text-center bg-white rounded-2xl border-2 border-slate-200 shadow-sm mt-10 max-w-lg mx-auto">
                        <h2 className="text-xl font-extrabold text-rose-600 mb-2">
                            អត់មានសិទ្ធិចូលទំព័រនេះទេ (Access Denied)
                        </h2>
                        <p className="text-xs font-semibold text-slate-500 mb-4">
                            សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ (Administrator) ដើម្បីបើកសិទ្ធិសម្រាប់ម៉ូឌុលនេះ។
                        </p>
                    </div>
                );
            }
        }
    } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // ៤. ប្រសិនបើមាន children ត្រូវ Render children បើគ្មានទេ ប្រើ Outlet
    return children ? children : <Outlet />;
}