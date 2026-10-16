// src/pages/ChangePassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Lock, KeyRound, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

export default function ChangePassword() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // State សម្រាប់បើក/បិទការមើលឃើញពាក្យសម្ងាត់
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage({ type: '', text: '' });

        if (formData.password !== formData.password_confirmation) {
            setStatusMessage({ type: 'error', text: 'ពាក្យសម្ងាត់ថ្មី និងការផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ!' });
            setLoading(false);
            return;
        }

        try {
            await api.post('/profile/change-password', {
                current_password: formData.current_password,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            });

            setStatusMessage({ type: 'success', text: 'ផ្លាស់ប្តូរលេខសម្ងាត់ជោគជ័យ!' });
            setFormData({ current_password: '', password: '', password_confirmation: '' });
        } catch (err) {
            setStatusMessage({
                type: 'error',
                text: err.response?.data?.message || 'លេខសម្ងាត់ចាស់មិនត្រឹមត្រូវ ឬមានបញ្ហាផ្សេងៗ!',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Title */}
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">ផ្លាស់ប្តូរលេខសម្ងាត់ (Change Password)</h1>
                        <p className="text-xs text-gray-400 mt-0.5">ធ្វើបច្ចុប្បន្នភាពលេខសម្ងាត់ដើម្បីសុវត្ថិភាពគណនីរបស់អ្នក</p>
                    </div>
                </div>
            </div>

            {/* Status Alert */}
            {statusMessage.text && (
                <div
                    className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${statusMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                >
                    {statusMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{statusMessage.text}</span>
                </div>
            )}

            {/* Form Main Container */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h2 className="text-sm font-bold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    <span>ព័ត៌មានលេខសម្ងាត់</span>
                </h2>

                <div className="space-y-4 max-w-xl">
                    {/* Current Password */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">លេខសម្ងាត់ចាស់ *</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="current_password"
                                value={formData.current_password}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 rounded-xl p-2.5 pl-9 pr-10 text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                                placeholder="••••••••"
                                required
                            />
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />

                            {/* Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition"
                            >
                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">លេខសម្ងាត់ថ្មី *</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-xl p-2.5 pl-9 pr-10 text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                                    placeholder="យ៉ាងហោចណាស់ ៦-៨ តួអក្សរ"
                                    required
                                />
                                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />

                                {/* Toggle Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Confirmation */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">ផ្ទៀងផ្ទាត់លេខសម្ងាត់ថ្មី *</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-xl p-2.5 pl-9 pr-10 text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />

                                {/* Toggle Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-5 py-2.5 text-xs font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold bg-[#181611] text-white hover:bg-gray-800 rounded-xl transition shadow-sm disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកការផ្លាស់ប្តូរ'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}