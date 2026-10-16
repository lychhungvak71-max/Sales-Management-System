// components/UserRoleDelete.jsx
import React, { useState } from 'react';
import { X, AlertTriangle, Shield, Briefcase, Link, FileText, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios';

export default function UserRoleDelete({ role, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if (!role) return null;

    // រៀបចំតំណភ្ជាប់រូបភាពឱ្យបានត្រឹមត្រូវ
    const photoUrl = role.photo
        ? (role.photo.startsWith('http') ? role.photo : `http://localhost:8000${role.photo.startsWith('/') ? '' : '/'}${role.photo}`)
        : null;

    const handleDelete = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const roleId = role._id || role.id;
            await api.delete(`/user-roles/${roleId}`);

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error deleting role:', error);
            setErrorMsg(error.response?.data?.message || 'មានបញ្ហាក្នុងការលុបតួនាទីនេះ!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md relative my-8 overflow-hidden flex flex-col">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-red-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-md">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-800 text-base">លុបតួនាទី (Delete Role)</h3>
                            <p className="text-xs text-red-500 font-medium">សកម្មភាពនេះមិនអាចសារុបវិញបានទេ</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-xl transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleDelete} className="p-6 space-y-4">
                    {errorMsg && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                            {errorMsg}
                        </div>
                    )}

                    <p className="text-xs text-slate-600 text-center">
                        តើអ្នកពិតជាចង់លុបតួនាទីខាងក្រោមនេះចេញពីប្រព័ន្ធមែនទេ?
                    </p>

                    {/* Role Info Preview Card with Photo */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
                            {photoUrl ? (
                                <img src={photoUrl} alt={role.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">
                                    {role.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1 overflow-hidden">
                            <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-sm">
                                <Shield className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <span className="truncate">{role.name}</span>
                            </div>
                            {role.position && (
                                <div className="flex items-center space-x-1.5 text-slate-600 text-xs">
                                    <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <span className="truncate">{role.position}</span>
                                </div>
                            )}
                            {role.path_name && (
                                <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-mono">
                                    <Link className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <span className="truncate">{role.path_name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="flex items-center space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition text-xs"
                        >
                            បោះបង់
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition shadow-md shadow-red-500/20 text-xs disabled:opacity-50"
                        >
                            {loading ? 'កំពុងលុប...' : 'យល់ព្រមលុប (Delete)'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}