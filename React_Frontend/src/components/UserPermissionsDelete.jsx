// src/components/UserPermissionsDelete.jsx
import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import api from '../api/axios';

export default function UserPermissionsDelete({ permission, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if (!permission) return null;

    const handleDelete = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const permId = permission._id || permission.id;
            await api.delete(`/user-permissions/${permId}`);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error deleting permission:', error);
            setErrorMsg(error.response?.data?.message || 'មានបញ្ហាក្នុងการលុបសិទ្ធិនេះ!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm relative overflow-hidden flex flex-col text-center p-6 space-y-4">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl transition">
                    <X className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <AlertTriangle className="w-6 h-6" />
                </div>

                <div>
                    <h3 className="font-bold text-slate-900 text-base">លុបសិទ្ធិប្រព័ន្ធ?</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        តើអ្នកពិតជាចង់លុបសិទ្ធិ <span className="font-bold text-slate-800">"{permission.name}"</span> នេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានឡើយ។
                    </p>
                </div>

                {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-left">
                        {errorMsg}
                    </div>
                )}

                <div className="flex items-center space-x-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition text-xs"
                    >
                        បោះបង់
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-rose-600/20 text-xs disabled:opacity-50"
                    >
                        {loading ? 'កំពុងលុប...' : 'យល់ព្រមលុប'}
                    </button>
                </div>
            </div>
        </div>
    );
}