// components/UserPositionUpdate.jsx
import React, { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import api from '../api/axios';

export default function UserPositionUpdate({ role, onClose = () => { }, onSuccess = () => { } }) {
    const roleId = role?._id || role?.id;

    const [formData, setFormData] = useState({
        name: '',
        start_time: '',
        end_time: '',
        description: '',
    });

    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Pre-fill ទិន្នន័យចាស់ពេល Component ដំណើរការ ឬ role ផ្លាស់ប្តូរ
    useEffect(() => {
        if (role) {
            setFormData({
                name: role.name || '',
                start_time: role.start_time || '',
                end_time: role.end_time || '',
                description: role.description || '',
            });

            if (role.photo) {
                const imageUrl = role.photo.startsWith('http')
                    ? role.photo
                    : `http://localhost:8000${role.photo.startsWith('/') ? '' : '/'}${role.photo}`;
                setPreview(imageUrl);
            }
        }
    }, [role]);

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
        if (!roleId) {
            setErrors({ general: 'មិនអាចស្វែងរក ID របស់ Role នេះបានឡើយ!' });
            return;
        }

        setLoading(true);
        setErrors({});

        const data = new FormData();
        data.append('_method', 'PUT'); // Laravel HTTP Method Spoofing
        data.append('name', formData.name);
        data.append('start_time', formData.start_time);
        data.append('end_time', formData.end_time);
        data.append('description', formData.description || '');

        if (photo) {
            data.append('photo', photo);
        }

        try {
            const response = await api.post(`/user-positions/${roleId}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (typeof onSuccess === 'function') {
                onSuccess(response.data);
            }
            if (typeof onClose === 'function') {
                onClose();
            }
        } catch (err) {
            console.error('Error updating role:', err);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({ general: err.response.data.message });
            } else {
                setErrors({ general: 'មានបញ្ហាក្នុងការកែប្រែទិន្នន័យ សូមព្យាយាមម្តងទៀត!' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl relative animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-extrabold text-center text-slate-800 mb-6">
                    កែប្រែតំណែង (Update User Role)
                </h2>

                {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Photo Upload & Preview */}
                    <div className="flex flex-col items-center justify-center mb-4">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 mb-2 relative group">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Camera className="w-8 h-8 text-slate-400" />
                            )}
                        </div>
                        <label className="cursor-pointer text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition">
                            {photo ? 'ផ្លាស់ប្តូររូបថតថ្មី' : preview ? 'ប្តូររូបតំណាង (Icon/Photo)' : 'ជ្រើសរើសរូបតំណាង'}
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        </label>
                        {errors.photo && <p className="text-red-500 text-xs font-semibold mt-1">{errors.photo[0]}</p>}
                    </div>

                    {/* Role Name */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះតំណែង (Role Name) *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                }`}
                            placeholder="ឧ. Manager / Cashier"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.name[0]}</p>}
                    </div>

                    {/* Work Hours Schedule */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">ម៉ោងចាប់ផ្តើម (Start Time)</label>
                            <input
                                type="time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.start_time ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                            />
                            {errors.start_time && <p className="text-red-500 text-xs font-semibold mt-1">{errors.start_time[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">ម៉ោងបញ្ចប់ (End Time)</label>
                            <input
                                type="time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.end_time ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                            />
                            {errors.end_time && <p className="text-red-500 text-xs font-semibold mt-1">{errors.end_time[0]}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ការពិពណ៌នា (Description)</label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                }`}
                            placeholder="ពិពណ៌នាអំពីសិទ្ធិ ឬភារកិច្ចនៃតំណែងនេះ..."
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-xs font-semibold mt-1">{errors.description[0]}</p>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition duration-200 text-sm disabled:opacity-50"
                        >
                            បោះបង់
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition duration-200 shadow-md shadow-amber-500/20 disabled:opacity-50 text-sm"
                        >
                            {loading ? 'កំពុងកែប្រែ...' : 'រក្សាទុកការកែប្រែ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}