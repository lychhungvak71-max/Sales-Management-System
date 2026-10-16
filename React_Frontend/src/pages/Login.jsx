// src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                const userStatus = user?.status ? user.status.toLowerCase() : '';

                if (userStatus === 'active') {
                    navigate('/dashboard', { replace: true });
                } else {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                }
            } catch (e) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const response = await api.post('/login', formData);

            const token =
                response.data?.token ||
                response.data?.access_token ||
                response.data?.data?.token ||
                response.data?.data?.access_token;

            const user = response.data?.user || response.data?.data?.user;

            const userStatus = user?.status ? user.status.toLowerCase() : '';

            if (userStatus !== 'active') {
                setErrors({
                    general: 'គណនីរបស់អ្នកមិនទាន់សកម្ម (Inactive) ឬគ្មាន Status ឡើយ! សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ។'
                });

                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                return;
            }

            if (token) {
                localStorage.setItem('auth_token', token);
                if (user) {
                    // 💡 រក្សាទុកទិន្នន័យ user ព្រមទាំង permissions ចូលក្នុង localStorage សម្រាប់ប្រើប្រាស់ពេលឆែកសិទ្ធិ
                    localStorage.setItem('user', JSON.stringify(user));
                }
                navigate('/dashboard', { replace: true });
            } else {
                setErrors({ general: 'មិនទទួលបាន Token ពី Server ឡើយ!' });
            }

        } catch (err) {
            if (err.response && err.response.data) {
                if (err.response.status === 403) {
                    setErrors({ general: err.response.data.message || 'គណនីមិនទាន់សកម្ម (Inactive) ឡើយ!' });
                } else if (err.response.data.errors) {
                    setErrors(err.response.data.errors);
                } else if (err.response.data.message) {
                    setErrors({ general: err.response.data.message });
                } else {
                    setErrors({ general: 'ការចូលប្រើប្រាស់បរាជ័យ សូមព្យាយាមម្តងទៀត!' });
                }
            } else {
                setErrors({ general: 'មិនអាចភ្ជាប់ទៅកាន់ Server បានទេ!' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-center mb-6">ចូលគណនី (Login)</h2>

                {errors.general && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-xs font-bold">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        កុំភ្លេចអ៊ីមែល (Email Address)
                        <input
                            type="email"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email[0]}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">ពាក្យសម្ងាត់ (Password)</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-xs"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2.5 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <span className="text-red-500 text-xs">{errors.password[0]}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 text-xs font-bold"
                    >
                        {loading ? 'កំពុងចូល...' : 'ចូលប្រព័ន្ធ'}
                    </button>
                </form>
            </div>
        </div>
    );
}