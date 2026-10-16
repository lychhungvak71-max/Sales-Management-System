// src/components/UserPermissionsAdd.jsx
import React, { useState } from 'react';
import { X, Shield, Link, FileText, CheckCircle } from 'lucide-react';
import api from '../api/axios';

export default function UserPermissionsAdd({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        path: '',
        description: '',
        status: 'active',
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            await api.post('/user-permissions', formData);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error adding permission:', error);
            setErrorMsg(error.response?.data?.message || 'មានបញ្ហាក្នុងការបន្ថែមសិទ្ធិថ្មី!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md relative overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm">បន្ថែមសិទ្ធិថ្មី (Add Permission)</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errorMsg && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                            {errorMsg}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះសិទ្ធិ (Name) *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="ឧ. Dashboard View"
                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ផ្លូវសិទ្ធិ (Path)</label>
                        <input
                            type="text"
                            value={formData.path}
                            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                            placeholder="ឧ. /admin/dashboard"
                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 transition font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ការពិពណ៌នា (Description)</label>
                        <textarea
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="ពិពណ៌នាអំពីសិទ្ធិនេះ..."
                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 transition"
                        ></textarea>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center space-x-3 pt-3 border-t border-slate-100">
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
                            className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-indigo-600/20 text-xs disabled:opacity-50"
                        >
                            {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}