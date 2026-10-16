import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import api from '../api/axios';

export default function ProductUpdate({ item, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category_id: '',
        category_name: '',
        price: '',
        original_price: '',
        stock: '',
    });

    const [categories, setCategories] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch Categories ពី MongoDB និង Prefill Data ចាស់ចូល Form
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/product-categorys');
                const data = response.data.data || response.data;
                setCategories(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();

        // ប្រសិនបើមាន Item ចាស់ ត្រូវកំណត់តម្លៃចូល formData
        if (item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                category_id: item.category_id || '',
                category_name: item.category_name || '',
                price: item.price || '',
                original_price: item.original_price || '',
                stock: item.stock || '',
            });

            // បង្ហាញរូបភាពចាស់ប្រសិនបើមាន
            if (item.photo) {
                const imageSrc = item.photo.startsWith('http')
                    ? item.photo
                    : `http://localhost:8000${item.photo.startsWith('/') ? '' : '/'}${item.photo}`;
                setPreview(imageSrc);
            }
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'category_id') {
            const selectedCat = categories.find(c => String(c._id?.$oid || c._id || c.id) === String(value));
            setFormData(prev => ({
                ...prev,
                category_id: value,
                category_name: selectedCat ? (selectedCat.name || selectedCat.category_name || '') : ''
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
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

        // ករណី Upload រូបភាពថ្មី
        if (photo) {
            data.append('photo', photo);
        }

        // Laravel Method Spoofing សម្រាប់ Update PUT Request
        data.append('_method', 'PUT');

        const itemId = item?._id?.$oid || item?._id || item?.id;

        try {
            await api.post(`/products/${itemId}`, data, {
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
                setErrors({ general: 'មានបញ្ហាក្នុងការកែប្រែផលិតផល សូមព្យាយាមម្តងទៀត!' });
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
                    កែប្រែផលិតផល (Edit Product)
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
                            ប្តូររូបភាពផលិតផល
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        </label>
                        {errors.photo && <p className="text-red-500 text-xs font-semibold mt-1">{errors.photo[0]}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Product Name */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                ឈ្មោះផលិតផល (Product Name) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                placeholder="ឧ. Coca Cola 330ml"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.name[0]}</p>}
                        </div>

                        {/* Category Select */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                ប្រភេទផលិតផល (Category) <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 bg-white ${errors.category_id ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                required
                            >
                                <option value="">-- ជ្រើសរើសប្រភេទ --</option>
                                {categories.map((cat) => {
                                    const catId = cat._id?.$oid || cat._id || cat.id;
                                    const catName = cat.name || cat.category_name;
                                    return (
                                        <option key={catId} value={catId}>
                                            🗄️ {catName} (Database)
                                        </option>
                                    );
                                })}
                            </select>
                            {errors.category_id && <p className="text-red-500 text-xs font-semibold mt-1">{errors.category_id[0]}</p>}
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                តម្លៃលក់ (Price) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.price ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                placeholder="0.00"
                                required
                            />
                            {errors.price && <p className="text-red-500 text-xs font-semibold mt-1">{errors.price[0]}</p>}
                        </div>

                        {/* Original Price */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                តម្លៃដើម (Original Price)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="original_price"
                                value={formData.original_price}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.original_price ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                placeholder="0.00"
                            />
                            {errors.original_price && <p className="text-red-500 text-xs font-semibold mt-1">{errors.original_price[0]}</p>}
                        </div>

                        {/* Stock */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                ចំនួនស្តុក (Stock) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className={`w-full border rounded-xl p-2.5 text-sm font-medium outline-none transition focus:ring-2 ${errors.stock ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-200 focus:border-amber-500'
                                    }`}
                                placeholder="ឧ. 50"
                                required
                            />
                            {errors.stock && <p className="text-red-500 text-xs font-semibold mt-1">{errors.stock[0]}</p>}
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
                                placeholder="ព័ត៌មានលម្អិតអំពីផលិតផល..."
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
                            {loading ? 'កំពុងធ្វើបច្ចុប្បន្នភាព...' : 'កែប្រែ (Update Product)'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}