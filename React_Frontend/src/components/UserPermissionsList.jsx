// src/components/UserPermissionsList.jsx
import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit3, Trash2, Search, Loader2 } from 'lucide-react';
import api from '../api/axios';
import UserPermissionsAdd from './UserPermissionsAdd';
import UserPermissionsUpdate from './UserPermissionsUpdate';
import UserPermissionsDelete from './UserPermissionsDelete';

export default function UserPermissionsList() {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const response = await api.get('/user-permissions');
            const data = response.data?.data || response.data || [];
            setPermissions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យសិទ្ធិ:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const filteredPermissions = permissions.filter((item) => {
        const term = searchTerm.toLowerCase();
        return (
            (item.name && item.name.toLowerCase().includes(term)) ||
            (item.path && item.path.toLowerCase().includes(term)) ||
            (item.description && item.description.toLowerCase().includes(term))
        );
    });

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            {/* Header Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">គ្រប់គ្រងសិទ្ធិប្រព័ន្ធ (User Permissions)</h1>
                        <p className="text-xs text-slate-500">កំណត់ និងគ្រប់គ្រងផ្លូវសិទ្ធិ (Path) សម្រាប់អ្នកប្រើប្រាស់</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/20 text-xs"
                >
                    <Plus className="w-4 h-4" />
                    <span>បន្ថែមសិទ្ធិថ្មី</span>
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-3">
                <Search className="w-5 h-5 text-slate-400 ml-2" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ស្វែងរកតាមឈ្មោះសិទ្ធិ ផ្លូវ (Path) ឬការពិពណ៌នា..."
                    className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                                <th className="py-4 px-6">ល.រ</th>
                                <th className="py-4 px-6">ឈ្មោះសិទ្ធិ (Name)</th>
                                <th className="py-4 px-6">ផ្លូវសិទ្ធិ (Path)</th>
                                <th className="py-4 px-6">ការពិពណ៌នា (Description)</th>
                                <th className="py-4 px-6">ស្ថានភាព (Status)</th>
                                <th className="py-4 px-6 text-right">សកម្មភាព (Actions)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-400">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                                            <span>កំពុងទាញយកទិន្នន័យ...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPermissions.length > 0 ? (
                                filteredPermissions.map((item, index) => {
                                    const itemId = item._id?.$oid || item._id || item.id;
                                    return (
                                        <tr key={itemId} className="hover:bg-slate-50/80 transition">
                                            <td className="py-4 px-6 text-slate-400">{index + 1}</td>
                                            <td className="py-4 px-6 font-bold text-slate-800">{item.name}</td>
                                            <td className="py-4 px-6 font-mono text-indigo-600">{item.path || 'N/A'}</td>
                                            <td className="py-4 px-6 text-slate-500 max-w-xs truncate">{item.description || 'គ្មាន'}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${item.status === 'active' || !item.status
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                    }`}>
                                                    {item.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedPermission(item);
                                                        setShowUpdateModal(true);
                                                    }}
                                                    className="p-2 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl transition"
                                                    title="កែប្រែ"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedPermission(item);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition"
                                                    title="លុប"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-400">
                                        មិនមានទិន្នន័យសិទ្ធិប្រព័ន្ធឡើយ!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {showAddModal && (
                <UserPermissionsAdd
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        fetchPermissions();
                    }}
                />
            )}

            {showUpdateModal && selectedPermission && (
                <UserPermissionsUpdate
                    permission={selectedPermission}
                    onClose={() => setShowUpdateModal(false)}
                    onSuccess={() => {
                        setShowUpdateModal(false);
                        fetchPermissions();
                    }}
                />
            )}

            {showDeleteModal && selectedPermission && (
                <UserPermissionsDelete
                    permission={selectedPermission}
                    onClose={() => setShowDeleteModal(false)}
                    onSuccess={() => {
                        setShowDeleteModal(false);
                        fetchPermissions();
                    }}
                />
            )}
        </div>
    );
}