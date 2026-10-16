// components/CustomerAdd.jsx
import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import api from '../api/axios';

export default function CustomerAdd({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        status: 'Active',
    });

    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        });

        if (photo) {
            data.append('photo', photo);
        }

        try {
            await api.post('/customers', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({ general: err.response.data.message });
            } else {
                setErrors({ general: 'មានបញ្ហាក្នុងការបន្ថែមអតិថិជន សូមព្យាយាមម្តងទៀត!' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl relative my-8 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-extrabold text-center text-slate-800 mb-6">
                    បន្ថែមអតិថិជនថ្មី (Add Customer)
                </h2>

                {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Photo Upload & Preview */}
                    <div className="flex flex-col items-center justify-center mb-4">
                        <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 mb-2 relative group">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Upload className="w-8 h-8 text-slate-400" />
                            )}
                        </div>
                        <label className="cursor-pointer text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition">
                            ជ្រើសរើសរូបភាពអតិថិជន
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        </label>
                        {errors.photo && <p className="text-red-500 text-xs font-semibold mt-1">{errors.photo[0]}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Customer Name */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                ឈ្មោះអតិថិជន (Customer Name) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                placeholder="ដារា"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.name[0]}</p>}
                        </div>

                        {/* Gender Select */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                ភេទ (Gender)
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 bg-white ${errors.gender ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                            >
                                <option value="">-- ជ្រើសរើសភេទ --</option>
                                <option value="Male">ប្រុស (Male)</option>
                                <option value="Female">ស្រី (Female)</option>
                                <option value="Other">ភេទទី៣ (Other)</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-xs font-semibold mt-1">{errors.gender[0]}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                លេខទូរស័ព្ទ (Phone)
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                placeholder="ឧ. 012 345 678"
                            />
                            {errors.phone && <p className="text-red-500 text-xs font-semibold mt-1">{errors.phone[0]}</p>}
                        </div>

                        {/* Email */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                អ៊ីម៉ែល (Email)
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                placeholder="example@gmail.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs font-semibold mt-1">{errors.email[0]}</p>}
                        </div>

                        {/* Address */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                អាសយដ្ឋាន / ទីតាំង (Address)
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.address ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                placeholder="ឧ. ភ្នំពេញ, កម្ពុជា"
                            />
                            {errors.address && <p className="text-red-500 text-xs font-semibold mt-1">{errors.address[0]}</p>}
                        </div>

                        {/* Status */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                ស្ថានភាព (Status)
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 bg-white border-slate-300 focus:ring-amber-200 focus:border-amber-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                បរិយាយ (Description)
                            </label>
                            <textarea
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                placeholder="ព័ត៌មានលម្អិតបន្ថែមអំពីអតិថិជន..."
                            />
                            {errors.description && <p className="text-red-500 text-xs font-semibold mt-1">{errors.description[0]}</p>}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 pt-4">
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
                            {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក (Save Customer)'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}