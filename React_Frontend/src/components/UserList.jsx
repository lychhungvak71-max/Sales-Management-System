// src/components/UserList.jsx
import api from '../api/axios';
import React, { useState, useEffect, useMemo } from 'react';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Edit3,
    Trash2,
    Shield,
    Mail,
    Phone,
    X,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserList() {
    const navigate = useNavigate();

    // Core States
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter & Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('All');

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modal & Form States
    const [editModalUser, setEditModalUser] = useState(null);
    const [deleteModalUser, setDeleteModalUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // 1. Fetch Users List
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('auth_token');

            if (!token) {
                console.error('រកមិនឃើញ Token ទេ! សូម Login ម្តងទៀត។');
                navigate('/login');
                return;
            }

            const response = await api.get('/users');

            if (response.data && Array.isArray(response.data.data)) {
                setUsers(response.data.data);
            } else if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setUsers([]);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('មិនអាចទាញយកទិន្នន័យបានទេ!');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter Users
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                (user.name && user.name.toLowerCase().includes(term)) ||
                (user.email && user.email.toLowerCase().includes(term)) ||
                (user.phone && user.phone.includes(term));

            const matchesRole = selectedRole === 'All' || user.role === selectedRole;

            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, selectedRole]);

    // Reset to page 1 on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedRole]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(start, start + itemsPerPage);
    }, [filteredUsers, currentPage, itemsPerPage]);

    // 2. Handle Edit User (PUT API)
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setValidationErrors({});

        try {
            const userId = editModalUser._id || editModalUser.id;

            const payload = {
                name: editModalUser.name,
                email: editModalUser.email,
                role: editModalUser.role,
                phone: editModalUser.phone,
                status: editModalUser.status,
            };

            const response = await api.put(`/users/${userId}`, payload);
            const updatedUser = response.data.data || response.data;

            setUsers(users.map(u => ((u._id || u.id) === userId ? updatedUser : u)));
            setEditModalUser(null);
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setValidationErrors(err.response.data.errors || {});
            } else {
                console.error('Error updating user:', err);
                alert('មានបញ្ហាក្នុងការកែប្រែទិន្នន័យបុគ្គលិក!');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 3. Handle Delete User (DELETE API)
    const handleDeleteConfirm = async () => {
        if (!deleteModalUser) return;
        setIsSubmitting(true);
        try {
            const userId = deleteModalUser._id || deleteModalUser.id;
            await api.delete(`/users/${userId}`);

            setUsers(users.filter(u => (u._id || u.id) !== userId));
            setDeleteModalUser(null);
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('មានបញ្ហាក្នុងការលុបបុគ្គលិក!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-md shadow-amber-500/20">
                            <Users className="w-6 h-6 stroke-[2.5]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                គ្រប់គ្រងអ្នកប្រើប្រាស់ (User Management)
                            </h1>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                បញ្ជីឈ្មោះ និងការកំណត់សិទ្ធិរបស់បុគ្គលិកទាំងអស់
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                    <UserPlus className="w-4 h-4 stroke-[2.5]" />
                    <span>ចុះឈ្មោះបុគ្គលិកថ្មី (Register)</span>
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Search Box */}
                <div className="sm:col-span-2 relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 stroke-[2.5]" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ស្វែងរកតាម ឈ្មោះ អ៊ីមែល ឬលេខទូរស័ព្ទ..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 transition placeholder:font-semibold placeholder:text-slate-400 shadow-sm"
                    />
                </div>

                {/* Role Filter Dropdown */}
                <div className="relative">
                    <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 stroke-[2.5]" />
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 transition shadow-sm appearance-none cursor-pointer"
                    >
                        <option value="All">តួនាទីទាំងអស់ (All Roles)</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Staff">Staff</option>
                    </select>
                </div>
            </div>

            {/* User List Table */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-600 text-[11px] font-extrabold uppercase tracking-wider">
                                <th className="py-3.5 px-5">អ្នកប្រើប្រាស់ (User)</th>
                                <th className="py-3.5 px-5">ទំនាក់ទំនង (Contact)</th>
                                <th className="py-3.5 px-5">តួនាទី (Position)</th>
                                <th className="py-3.5 px-5">ស្ថានភាព (Status)</th>
                                <th className="py-3.5 px-5 text-right">សកម្មភាព (Actions)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-100 text-xs font-bold text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-400 font-bold">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                                            <span>កំពុងទាញយកទិន្នន័យ...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-rose-500 font-bold">
                                        {error}
                                    </td>
                                </tr>
                            ) : paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user) => {
                                    const userId = user._id || user.id;
                                    return (
                                        <tr key={userId} className="hover:bg-slate-50/80 transition">
                                            {/* User Profile Info */}
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-3">
                                                    {user.photo ? (
                                                        <img
                                                            src={user.photo}
                                                            alt={user.name}
                                                            className="w-9 h-9 rounded-xl object-cover border-2 border-amber-500"
                                                        />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 font-serif font-extrabold flex items-center justify-center text-sm border border-amber-500/20">
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-extrabold text-slate-900">{user.name}</p>
                                                        <p className="text-[11px] font-semibold text-slate-400">
                                                            ID: #{String(userId).slice(-6)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact Details */}
                                            <td className="py-3.5 px-5 space-y-0.5">
                                                <div className="flex items-center gap-1.5 text-slate-600">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                                                    <span>{user.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                                                    <span>{user.phone || 'N/A'}</span>
                                                </div>
                                            </td>

                                            {/* Role Badge */}
                                            <td className="py-3.5 px-5">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${user.role === 'Admin'
                                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                    : user.role === 'Manager'
                                                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    }`}>
                                                    <Shield className="w-3 h-3 stroke-[2.5]" />
                                                    {user.role}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-3.5 px-5">
                                                {(() => {
                                                    const status = user?.status ? String(user.status).toLowerCase() : null;

                                                    if (status === 'active') {
                                                        return (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                <CheckCircle2 className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                                                                Active
                                                            </span>
                                                        );
                                                    }

                                                    if (status === 'inactive') {
                                                        return (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                                                                <XCircle className="w-3 h-3 text-rose-500 stroke-[2.5]" />
                                                                Inactive
                                                            </span>
                                                        );
                                                    }

                                                    return (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                                                            <AlertCircle className="w-3 h-3 text-amber-500 stroke-[2.5]" />
                                                            No Status
                                                        </span>
                                                    );
                                                })()}
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="py-3.5 px-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setValidationErrors({});
                                                            setEditModalUser(user);
                                                        }}
                                                        className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 border border-slate-200 transition"
                                                        title="កែប្រែ (Edit)"
                                                    >
                                                        <Edit3 className="w-4 h-4 stroke-[2.5]" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteModalUser(user)}
                                                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
                                                        title="លុប (Delete)"
                                                    >
                                                        <Trash2 className="w-4 h-4 stroke-[2.5]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-400 font-bold">
                                        មិនមានទិន្នន័យបុគ្គលិកដែលត្រូវនឹងការស្វែងរកឡើយ!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="p-4 bg-slate-50 border-t-2 border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>បង្ហាញទិន្នន័យ {paginatedUsers.length} ក្នុងចំណោម {filteredUsers.length} នាក់</span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 disabled:opacity-50 transition"
                        >
                            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <span className="px-3 py-1 rounded-lg bg-amber-500 text-white font-extrabold">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 disabled:opacity-50 transition"
                        >
                            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL EDIT USER */}
            {editModalUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden">
                        <div className="p-5 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-extrabold text-slate-900 text-sm">
                                កែប្រែព័ត៌មានបុគ្គលិក (#{String(editModalUser._id || editModalUser.id).slice(-6)})
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEditModalUser(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <X className="w-5 h-5 stroke-[2.5]" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះពេញ</label>
                                <input
                                    type="text"
                                    value={editModalUser.name || ''}
                                    onChange={(e) => setEditModalUser({ ...editModalUser, name: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-amber-500"
                                    required
                                />
                                {validationErrors.name && (
                                    <p className="text-[11px] font-bold text-rose-500 mt-1">{validationErrors.name[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">អ៊ីមែល</label>
                                <input
                                    type="email"
                                    value={editModalUser.email || ''}
                                    onChange={(e) => setEditModalUser({ ...editModalUser, email: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-amber-500"
                                    required
                                />
                                {validationErrors.email && (
                                    <p className="text-[11px] font-bold text-rose-500 mt-1">{validationErrors.email[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">លេខទូរស័ព្ទ</label>
                                <input
                                    type="text"
                                    value={editModalUser.phone || ''}
                                    onChange={(e) => setEditModalUser({ ...editModalUser, phone: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-amber-500"
                                />
                                {validationErrors.phone && (
                                    <p className="text-[11px] font-bold text-rose-500 mt-1">{validationErrors.phone[0]}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">តួនាទី</label>
                                    <select
                                        value={editModalUser.role || 'Staff'}
                                        onChange={(e) => setEditModalUser({ ...editModalUser, role: e.target.value })}
                                        className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-amber-500"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Staff">Staff</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">ស្ថានភាព</label>
                                    <select
                                        value={editModalUser.status || 'Active'}
                                        onChange={(e) => setEditModalUser({ ...editModalUser, status: e.target.value })}
                                        className="w-full px-3.5 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-amber-500"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-3 flex justify-end gap-2 border-t-2 border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditModalUser(null)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                                    disabled={isSubmitting}
                                >
                                    បោះបង់
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-amber-500/20 flex items-center gap-2"
                                >
                                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>រក្សាទុក</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DELETE CONFIRM */}
            {deleteModalUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border-2 border-slate-200 p-5 text-center space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 mx-auto flex items-center justify-center">
                            <Trash2 className="w-6 h-6 stroke-[2.5]" />
                        </div>

                        <div>
                            <h3 className="font-extrabold text-slate-900 text-base">
                                លុបគណនីបុគ្គលិក?
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 mt-1">
                                តើអ្នកពិតជាចង់លុបគណនីរបស់ <span className="font-bold text-slate-900">{deleteModalUser.name}</span> មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានឡើយ។
                            </p>
                        </div>

                        <div className="pt-2 flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteModalUser(null)}
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                                disabled={isSubmitting}
                            >
                                បោះបង់
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirm}
                                disabled={isSubmitting}
                                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-rose-600/20 flex items-center justify-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                <span>លុបចេញ</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}