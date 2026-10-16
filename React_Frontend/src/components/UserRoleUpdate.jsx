// components/UserRoleUpdate.jsx
import React, { useState, useEffect } from 'react';
import { X, Shield, Image as ImageIcon, Briefcase, FileText, Link } from 'lucide-react';
import api from '../api/axios';

export default function UserRoleUpdate({ role, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        path_name: '',
        description: '',
        photo: null,
    });
    const [positions, setPositions] = useState([]); // 💡 State សម្រាប់បញ្ជី Position
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // 💡 ទាញយកទិន្នន័យ Positions ពី MongoDB តាមរយៈ API `/user-positions`
    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await api.get('/user-positions');
                const data = response.data?.data || response.data || [];
                setPositions(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };
        fetchPositions();
    }, []);

    useEffect(() => {
        if (role) {
            setFormData({
                name: role.name || '',
                position: role.position || '',
                path_name: role.path_name || '',
                description: role.description || '',
                photo: null,
            });
            if (role.photo) {
                const imgUrl = role.photo.startsWith('http') ? role.photo : `http://localhost:8000${role.photo.startsWith('/') ? '' : '/'}${role.photo}`;
                setPhotoPreview(imgUrl);
            }
        }
    }, [role]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photo: file });
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const roleId = role._id || role.id;
            const data = new FormData();
            data.append('_method', 'PUT'); // Laravel PUT via POST form-data
            data.append('name', formData.name);
            data.append('position', formData.position);
            data.append('path_name', formData.path_name);
            data.append('description', formData.description);
            if (formData.photo) {
                data.append('photo', formData.photo);
            }

            await api.post(`/user-roles/${roleId}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error updating role:', error);
            setErrorMsg(error.response?.data?.message || 'មានបញ្ហាក្នុងការកែប្រែតួនាទី!');
        } finally {
            setLoading(false);
        }
    };

    if (!role) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg relative my-8 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-md">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-800 text-base">កែប្រែតួនាទី (Edit Role)</h3>
                            <p className="text-xs text-slate-500">កែសម្រួលព័ត៌មានតួនាទី</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-xl transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Form Body */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                    {errorMsg && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                            {errorMsg}
                        </div>
                    )}

                    {/* Role Name */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                            <Shield className="w-3.5 h-3.5 text-amber-500" />
                            <span>ឈ្មោះតួនាទី (Role Name) <span className="text-red-500">*</span></span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition"
                        />
                    </div>

                    {/* 💡 Position (Select Option from user_positions) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                            <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                            <span>តំណែង (Position)</span>
                        </label>
                        <select
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition cursor-pointer"
                        >
                            <option value="">-- សូមជ្រើសរើសតំណែង --</option>
                            {positions.map((pos) => {
                                const posId = pos._id?.$oid || pos._id || pos.id;
                                const posName = pos.name || pos.position_name || pos.title;
                                return (
                                    <option key={posId} value={posName}>
                                        {posName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Path Name */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                            <Link className="w-3.5 h-3.5 text-amber-500" />
                            <span>ផ្លូវ (Path Name)</span>
                        </label>
                        <input
                            type="text"
                            value={formData.path_name}
                            onChange={(e) => setFormData({ ...formData, path_name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition font-mono"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                            <FileText className="w-3.5 h-3.5 text-amber-500" />
                            <span>ការពិពណ៌នា (Description)</span>
                        </label>
                        <textarea
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition"
                        ></textarea>
                    </div>

                    {/* Photo Upload & Preview */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                            <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                            <span>រូបភាព (Role Photo/Icon)</span>
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-6 h-6 text-slate-300" />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-600 hover:file:bg-amber-100 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
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
                            className="w-1/2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition shadow-md shadow-amber-500/20 text-xs disabled:opacity-50"
                        >
                            {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកការកែប្រែ'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}