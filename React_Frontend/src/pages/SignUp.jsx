// src/pages/SignUp.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '', // ទុកទទេ ដើម្បី assign តម្លៃដំបូងពី MongoDB ពេល Fetch មកដល់
        address: '',
        password: '',
        password_confirmation: '',
    });

    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // 💡 State សម្រាប់រក្សាទុកបញ្ជី Position ពី MongoDB
    const [positions, setPositions] = useState([]);
    const [loadingPositions, setLoadingPositions] = useState(true);

    // State សម្រាប់ Show/Hide Password
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 💡 ទាញទិន្នន័យ UserPosition / Roles ពី MongoDB
    useEffect(() => {
        const fetchPositions = async () => {
            try {
                // តម្រូវ Endpoint API តាម Backend របស់អ្នក (ឧ. /user-roles ឬ /user-positions)
                const res = await api.get('/user-positions');
                const list = res.data?.data || res.data || [];

                setPositions(list);

                // កំណត់ Default value ឲ្យformData.role ដោយយក item ដំបូងពី DB
                if (list.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        role: list[0].name || list[0].title || list[0]._id,
                    }));
                }
            } catch (err) {
                console.error(' Error fetching user positions:', err);
            } finally {
                setLoadingPositions(false);
            }
        };

        fetchPositions();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        if (photo) {
            data.append('photo', photo);
        }

        try {
            const res = await api.post('/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const token = res.data?.access_token || res.data?.token || res.data?.data?.access_token;
            const user = res.data?.user || res.data?.data?.user;

            if (token) {
                localStorage.setItem('auth_token', token);
                if (user) localStorage.setItem('user', JSON.stringify(user));
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({ general: err.response.data.message });
            } else {
                setErrors({ general: 'មានបញ្ហាក្នុងការចុះឈ្មោះ សូមព្យាយាមម្តងទៀត!' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex place-items-baseline justify-center bg-slate-100 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl">
                <h2 className="text-2xl font-extrabold text-center text-slate-800 mb-6">
                    ចុះឈ្មោះបុគ្គលិកថ្មី (Sign Up)
                </h2>

                {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Photo Upload & Preview */}
                    <div className="flex flex-col items-center justify-center mb-4">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 mb-2 relative">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-slate-400 text-xs font-semibold text-center p-2">ជ្រើសរូបថត</span>
                            )}
                        </div>
                        <label className="cursor-pointer text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition">
                            ជ្រើសរើសរូបថត (Photo)
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        </label>
                        {errors.photo && <p className="text-red-500 text-xs font-semibold mt-1">{errors.photo[0]}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះពេញ *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                placeholder="ឧ. កែវ សុខា"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.name[0]}</p>}
                        </div>

                        {/* Dynamic Role / Position from MongoDB */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">តំណែង (Position) *</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={loadingPositions}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 bg-white ${errors.role ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                required
                            >
                                {loadingPositions ? (
                                    <option value="">កំពុងទាញយកតំណែង...</option>
                                ) : positions.length === 0 ? (
                                    <option value="">គ្មានតំណែងក្នុងប្រព័ន្ធ</option>
                                ) : (
                                    positions.map((item) => (
                                        <option key={item._id || item.id} value={item.name || item.title}>
                                            {item.name || item.title}
                                        </option>
                                    ))
                                )}
                            </select>
                            {errors.role && <p className="text-red-500 text-xs font-semibold mt-1">{errors.role[0]}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">អ៊ីមែល *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                placeholder="example@domain.com"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs font-semibold mt-1">{errors.email[0]}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">លេខទូរស័ព្ទ *</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                placeholder="012 345 678"
                                required
                            />
                            {errors.phone && <p className="text-red-500 text-xs font-semibold mt-1">{errors.phone[0]}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">លេខសម្ងាត់ *</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full border rounded-xl p-2.5 pr-10 text-sm font-medium outline-none transition focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                        }`}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs font-semibold mt-1">{errors.password[0]}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">ផ្ទៀងផ្ទាត់លេខសម្ងាត់ *</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 rounded-xl p-2.5 pr-10 text-sm font-medium outline-none transition focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">អាសយដ្ឋាន</label>
                        <textarea
                            name="address"
                            rows="2"
                            value={formData.address}
                            onChange={handleChange}
                            className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.address ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                }`}
                            placeholder="រាជធានីភ្នំពេញ, កម្ពុជា..."
                        ></textarea>
                        {errors.address && <p className="text-red-500 text-xs font-semibold mt-1">{errors.address[0]}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || loadingPositions}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition duration-200 shadow-md shadow-amber-500/20 disabled:opacity-50 mt-2"
                    >
                        {loading ? 'កំពុងបង្កើតគណនី...' : 'ចុះឈ្មោះ (Sign Up)'}
                    </button>

                    <p className="text-center text-xs font-semibold text-slate-600 mt-4">
                        មានគណនីរួចហើយ?{' '}
                        <Link to="/login" className="text-amber-600 font-extrabold hover:underline">
                            ចូលប្រើប្រាស់ (Login)
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}