// components/UserRoleList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios'; // Custom Axios Instance
import UserRoleUpdate from './UserRoleUpdate';
import UserRoleDelete from './UserRoleDelete';
import UserRoleAdd from './UserRoleAdd';

export default function UserRoleList() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modal states
    const [selectedRole, setSelectedRole] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await api.get('/user-roles');
            setRoles(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // Filter roles (Search Input + Select Role Filter)
    const filteredRoles = useMemo(() => {
        return roles.filter((role) => {
            const matchesSearch =
                role.name?.toLowerCase().includes(search.toLowerCase()) ||
                role.position?.toLowerCase().includes(search.toLowerCase()) ||
                role.description?.toLowerCase().includes(search.toLowerCase()) ||
                role.path_name?.toLowerCase().includes(search.toLowerCase());

            const matchesRoleFilter =
                selectedRoleFilter === 'ALL' || role.name === selectedRoleFilter;

            return matchesSearch && matchesRoleFilter;
        });
    }, [roles, search, selectedRoleFilter]);

    // Reset back to page 1 on filter or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedRoleFilter]);

    // Pagination Calculations
    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage) || 1;
    const paginatedRoles = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRoles.slice(start, start + itemsPerPage);
    }, [filteredRoles, currentPage, itemsPerPage]);

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            {/* Header Title & Add Button Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-md">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">គ្រប់គ្រងតួនាទីអ្នកប្រើប្រាស់ (User Role List)</h1>
                        <p className="text-sm text-gray-500">បញ្ជីឈ្មោះ តំណែង និងសិទ្ធិដំណើរការតួនាទីទាំងអស់</p>
                    </div>
                </div>

                {/* Add New Role Button */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-md transition-all active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>បន្ថែមតួនាទីថ្មី (Add Role)</span>
                </button>
            </div>

            {/* Search Bar & Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input Filter */}
                <div className="md:col-span-2 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="relative w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="ស្វែងរកតាមឈ្មោះ តំណែង ផ្លូវ (path_name) ឬការពិពណ៌នា..."
                            className="w-full pl-10 pr-4 py-1.5 border-none rounded-xl text-sm focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Role Select Option Filter */}
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <select
                        value={selectedRoleFilter}
                        onChange={(e) => setSelectedRoleFilter(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <option value="ALL">តួនាទីទាំងអស់ (All Roles)</option>
                        {roles.map((role) => {
                            const roleId = role._id || role.id;
                            return (
                                <option key={roleId} value={role.name}>
                                    {role.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                                <th className="py-4 px-6">តួនាទី (ROLE)</th>
                                <th className="py-4 px-6">តំណែង (POSITION)</th>
                                <th className="py-4 px-6">ផ្លូវ (PATH NAME)</th>
                                <th className="py-4 px-6">ការពិពណ៌នា (DESCRIPTION)</th>
                                <th className="py-4 px-6 text-right">សកម្មភាព (ACTIONS)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400">
                                        កំពុងទាញយកទិន្នន័យ...
                                    </td>
                                </tr>
                            ) : paginatedRoles.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400">
                                        មិនមានទិន្នន័យឡើយ
                                    </td>
                                </tr>
                            ) : (
                                paginatedRoles.map((role) => {
                                    const roleId = role._id || role.id;
                                    return (
                                        <tr key={roleId} className="hover:bg-amber-50/30 transition-colors">
                                            {/* Role Info & Icon */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    {role.photo ? (
                                                        <img
                                                            src={role.photo.startsWith('http') ? role.photo : `http://localhost:8000${role.photo.startsWith('/') ? '' : '/'}${role.photo}`}
                                                            alt={role.name}
                                                            className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-base">
                                                            {role.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-gray-900">{role.name}</div>
                                                        <div className="text-xs text-gray-400">ID: #{String(roleId).substring(0, 7)}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Position */}
                                            <td className="py-4 px-6 font-semibold text-gray-800">
                                                {role.position || '-'}
                                            </td>

                                            {/* Path Name */}
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-mono font-medium border border-slate-200">
                                                    {role.path_name || '-'}
                                                </span>
                                            </td>

                                            {/* Description */}
                                            <td className="py-4 px-6 text-gray-500 max-w-xs truncate">
                                                {role.description || '-'}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRole(role);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedRole(role);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Section: Total Count on Left & Pagination on Right */}
                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                    <div>
                        បង្ហាញទិន្នន័យ {paginatedRoles.length} ក្នុងចំណោម {filteredRoles.length} ជួរ (សរុប {roles.length})
                    </div>

                    {/* Pagination Bar Align Right */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            ថយក្រោយ
                        </button>

                        <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-semibold">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            បន្ទាប់
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Role Modal */}
            {showAddModal && (
                <UserRoleAdd
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        fetchRoles();
                    }}
                />
            )}

            {/* Edit Modal */}
            {showEditModal && selectedRole && (
                <UserRoleUpdate
                    role={selectedRole}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => {
                        setShowEditModal(false);
                        fetchRoles();
                    }}
                />
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedRole && (
                <UserRoleDelete
                    role={selectedRole}
                    onClose={() => setShowDeleteModal(false)}
                    onSuccess={() => {
                        setShowDeleteModal(false);
                        fetchRoles();
                    }}
                />
            )}
        </div>
    );
}