// components/UserPositionAdd.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

export default function UserPositionAdd({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        start_time: '08:00',
        end_time: '17:00',
        description: '',
    });

    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
            await api.post('/user-positions', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (onSuccess) onSuccess();
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({ general: err.response.data.message });
            } else {
                setErrors({ general: 'មានបញ្ហាក្នុងការបន្ថែមតំណែង សូមព្យាយាមម្តងទៀត!' });
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
                    បន្ថែមតំណែងថ្មី (Add User Position)
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
                            ជ្រើសរើសរូបតំណាង (Icon/Photo)
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
                            className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition duration-200 text-sm"
                        >
                            បោះបង់
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition duration-200 shadow-md shadow-amber-500/20 disabled:opacity-50 text-sm"
                        >
                            {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក (Save Role)'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}