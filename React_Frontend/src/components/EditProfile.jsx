// src/pages/EditProfile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, Save, User, Phone, MapPin, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/axios'; // ផ្លាស់ប្តូរ Path តាម axios config របស់អ្នក

export default function EditProfile() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};

    const [formData, setFormData] = useState({
        name: storedUser?.name || '',
        email: storedUser?.email || '',
        phone: storedUser?.phone || '',
        address: storedUser?.address || '',
    });

    const [photo, setPhoto] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(storedUser?.photo || null);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreviewPhoto(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage({ type: '', text: '' });

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('address', formData.address);

        if (photo) {
            data.append('photo', photo);
        }

        try {
            const res = await api.post('/profile/update', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // រក្សាទុក User data ថ្មីចូល LocalStorage
            const updatedUser = res.data.user || {
                ...storedUser,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                photo: previewPhoto,
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            setStatusMessage({ type: 'success', text: 'កែប្រែព័ត៌មានជោគជ័យ!' });

            // setTimeout(() => {
            //     navigate(-1); // ត្រឡប់ទៅទំព័រមុនវិញ
            // }, 1200);
        } catch (err) {
            setStatusMessage({
                type: 'error',
                text: err.response?.data?.message || 'មានបញ្ហាក្នុងការកែប្រែព័ត៌មាន!',
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
                        onClick={() => navigate(-1)}
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">កែប្រែព័ត៌មានគណនី (Edit Profile)</h1>
                        <p className="text-xs text-gray-400 mt-0.5">ធ្វើបច្ចុប្បន្នភាពរូបថត និងព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក</p>
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
                    {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{statusMessage.text}</span>
                </div>
            )}

            {/* Form Main Container */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Side: Photo Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-600/20 shadow-md bg-gray-50 group">
                        {previewPhoto ? (
                            <img src={previewPhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-serif font-bold text-3xl text-amber-800 bg-amber-100">
                                {storedUser?.name ? storedUser.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition duration-200">
                            <Camera className="w-6 h-6 text-white mb-1" />
                            <span className="text-[10px] text-white font-medium">ប្តូររូបថត</span>
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        </label>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-800">{formData.name || 'Admin User'}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{formData.email}</p>
                    </div>
                </div>

                {/* Right Side: Information Section */}
                <div className="md:col-span-2 space-y-6">
                    {/* General Information Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-sm font-bold text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
                            <User className="w-4 h-4 text-amber-600" />
                            <span>ព័ត៌មានទូទៅ</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">ឈ្មោះ *</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-200 rounded-xl p-2.5 pl-9 text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                                        required
                                    />
                                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">អ៊ីមែល *</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-200 rounded-xl p-2.5 pl-9 text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                                        required
                                    />
                                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">លេខទូរស័ព្ទ</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-200 rounded-xl p-2.5 pl-9 text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                                        placeholder="012 345 678"
                                    />
                                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">អាសយដ្ឋាន (Address)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-200 rounded-xl p-2.5 pl-9 text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                                        placeholder="រាជធានីភ្នំពេញ"
                                    />
                                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        {/* <button
                            type="button"
                            onClick={() => navigate('/change-password')}
                            className="px-5 py-2.5 text-xs font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-xl transition"
                        >
                            🔑 Change Password
                        </button> */}
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-55 px-5 py-2.5 text-xs font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-90 flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold bg-[#181611] text-white hover:bg-gray-800 rounded-xl transition shadow-sm disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{loading ? 'កំពុងរក្សាទុក...' : 'Update'}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}