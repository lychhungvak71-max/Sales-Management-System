import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function SaleForm() {
    const { id } = useParams(); // បើមាន id មានន័យថាជា Edit Mode
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customer_name: '',
        product_name: '',
        quantity: 1,
        unit_price: '',
        status: 'Pending',
        sale_date: new Date().toISOString().split('T')[0],
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    // ប្រសិនបើជា Edit Mode ត្រូវ Fetch ទិន្នន័យចាស់មកដាក់ក្នុង Form
    useEffect(() => {
        if (isEdit) {
            setFetching(true);
            api.get(`/sales/${id}`)
                .then((res) => {
                    // 💡 ចាប់យក Data ឱ្យត្រូវទម្រង់
                    const data = res.data?.data || res.data;
                    if (data) {
                        setFormData({
                            customer_name: data.customer_name || '',
                            product_name: data.product_name || '',
                            quantity: data.quantity || 1,
                            unit_price: data.unit_price || '',
                            status: data.status || 'Pending',
                            // 💡 កាត់យកតែ YYYY-MM-DD សម្រាប់ input type="date"
                            sale_date: data.sale_date ? data.sale_date.split('T')[0] : new Date().toISOString().split('T')[0],
                        });
                    }
                })
                .catch((err) => {
                    console.error('Error fetching sale data:', err);
                    alert('មិនអាចទាញយកទិន្នន័យបានឡើយ');
                    navigate('/sales');
                })
                .finally(() => setFetching(false));
        }
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            if (isEdit) {
                await api.put(`/sales/${id}`, formData);
            } else {
                await api.post('/sales', formData);
            }
            navigate('/sales'); // ត្រឡប់ទៅទំព័របញ្ជីលក់វិញ
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setErrors(err.response.data.errors);
            } else {
                alert('មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ');
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
                {isEdit ? 'កែប្រែព័ត៌មានលក់ (Edit Sale)' : 'បន្ថែមការលក់ថ្មី (Add New Sale)'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ឈ្មោះអតិថិជន */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះអតិថិជន *</label>
                    <input
                        type="text"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="បញ្ចូលឈ្មោះអតិថិជន"
                    />
                    {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name[0]}</p>}
                </div>

                {/* ឈ្មោះទំនិញ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះទំនិញ *</label>
                    <input
                        type="text"
                        value={formData.product_name}
                        onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="បញ្ចូលឈ្មោះទំនិញ"
                    />
                    {errors.product_name && <p className="text-red-500 text-xs mt-1">{errors.product_name[0]}</p>}
                </div>

                {/* ចំនួន និង តម្លៃរាយ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ចំនួន (Quantity) *</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">តម្លៃមួយឯកតា ($) *</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.unit_price}
                            onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="0.00"
                        />
                        {errors.unit_price && <p className="text-red-500 text-xs mt-1">{errors.unit_price[0]}</p>}
                    </div>
                </div>

                {/* ស្ថានភាព និង កាលបរិច្ឆេទ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ស្ថានភាព (Status) *</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">កាលបរិច្ឆេទ *</label>
                        <input
                            type="date"
                            value={formData.sale_date}
                            onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.sale_date && <p className="text-red-500 text-xs mt-1">{errors.sale_date[0]}</p>}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/sales')}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        បោះបង់ (Cancel)
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                        {loading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក (Save)'}
                    </button>
                </div>
            </form>
        </div>
    );
}