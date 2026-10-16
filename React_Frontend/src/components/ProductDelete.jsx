// components/ProductDelete.jsx
import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import api from '../api/axios';

export default function ProductDelete({ item, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // ទាញយក ID របស់ Product (ទ្រទ្រង់ទាំង MongoDB _id.$oid, _id និង id)
    const itemId = item?._id?.$oid || item?._id || item?.id;

    // Function សម្រាប់ទាញយក URL រូបភាព
    const getImageUrl = (photoPath) => {
        if (!photoPath) return null;
        if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
            return photoPath;
        }
        const baseURL = api.defaults.baseURL || 'http://127.0.0.1:8000/api';
        const backendOrigin = new URL(baseURL).origin;
        const cleanPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
        return `${backendOrigin}${cleanPath}`;
    };

    const handleDelete = async () => {
        if (!itemId) {
            setErrorMsg('មិនអាចស្វែងរក ID របស់ផលិតផលនេះបានឡើយ!');
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            await api.delete(`/products/${itemId}`);

            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (error) {
            console.error('Error deleting product:', error);
            setErrorMsg(
                error.response?.data?.message ||
                'មិនអាចលុបផលិតផលនេះបានទេ! សូមព្យាយាមម្តងទៀត។'
            );
        } finally {
            setLoading(false);
        }
    };

    if (!item) return null;

    const imageSrc = getImageUrl(item.photo || item.image);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md relative animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Warning Icon Header */}
                <div className="flex flex-col items-center text-center mb-5">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-3 border border-red-100">
                        <AlertTriangle className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-800 mb-1">
                        បញ្ជាក់ការលុបផលិតផល
                    </h3>
                </div>

                {/* 💡 ផ្នែកបង្ហាញរូបភាព និងព័ត៌មានផលិតផលដែលត្រូវលុប */}
                <div className="flex items-center space-x-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-5">
                    <div className="w-16 h-16 rounded-lg bg-white overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                        {imageSrc ? (
                            <img src={imageSrc} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl">🖼️</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                            ប្រភេទ: <span className="font-medium text-slate-700">{item.category_name || 'General'}</span>
                        </p>
                        <p className="text-xs font-semibold text-emerald-600 mt-1">
                            ${Number(item.price || 0).toFixed(2)}
                        </p>
                    </div>
                </div>

                <p className="text-xs text-slate-500 text-center mb-5">
                    តើអ្នកពិតជាចង់លុបផលិតផលនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានឡើយ។
                </p>

                {/* Error Message */}
                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 text-center">
                        {errorMsg}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 pt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition duration-200 text-sm disabled:opacity-50"
                    >
                        បោះបង់
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition duration-200 shadow-md shadow-red-600/20 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>{loading ? 'កំពុងលុប...' : 'លុបផលិតផល'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}