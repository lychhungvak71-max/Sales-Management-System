// src/pages/Sales.jsx
import React, { useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Sales() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State សម្រាប់ Modal & Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [formData, setFormData] = useState({
        customer_name: '',
        product_name: '', // 💡 កែប្រែពី item_name ទៅ product_name ឱ្យត្រូវជាមួយ Backend
        quantity: 1,
        total_price: ''
    });

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/sales');

            const salesData = Array.isArray(response.data)
                ? response.data
                : (response.data.data || []);

            setSales(salesData);
        } catch (err) {
            console.error('Failed to fetch sales:', err);
            setError('មិនអាចទាញយកទិន្នន័យបានឡើយ សូមពិនិត្យមើល Connection ឬ Backend API!');
        } finally {
            setLoading(false);
        }
    };

    // Helper function សម្រាប់កាត់យក ៦ តួអក្សរចុងក្រោយនៃ ID ដោយសុវត្ថិភាព
    const getShortId = (sale) => {
        const rawId = sale._id?.$oid || sale._id || sale.id || '';
        const idString = typeof rawId === 'object' ? JSON.stringify(rawId) : String(rawId);
        return idString ? idString.slice(-6) : 'N/A';
    };

    // Handle Form Inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit Form បង្កើត Sale ថ្មី
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!formData.customer_name || !formData.product_name || !formData.total_price) {
            setFormError('សូមបំពេញព័ត៌មានចាំបាច់ឱ្យបានគ្រប់គ្រាន់!');
            return;
        }

        try {
            setSubmitting(true);
            const response = await api.post('/sales', {
                ...formData,
                quantity: Number(formData.quantity),
                total_price: parseFloat(formData.total_price),
                status: 'Completed', // បន្ថែម status ជា Default សម្រាប់ MongoDB Sale Schema
                sale_date: new Date().toISOString().split('T')[0]
            });

            const newSale = response.data.data || response.data;

            setSales((prevSales) => [newSale, ...prevSales]);

            // Reset Form & បិទ Modal
            setFormData({ customer_name: '', product_name: '', quantity: 1, total_price: '' });
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to create sale:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setFormError(err.response.data.message);
            } else {
                setFormError('មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ សូមព្យាយាមម្តងទៀត!');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* <Navbar /> */}

            <div className="p-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">បញ្ជីការលក់ (Sales List)</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow font-medium transition flex items-center gap-1"
                    >
                        <span>+</span> បន្ថែមការលក់ថ្មី
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
                        កំពុងទាញយកទិន្នន័យ...
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 flex justify-between items-center">
                        <span>{error}</span>
                        <button
                            onClick={fetchSales}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                        >
                            ព្យាយាមម្តងទៀត
                        </button>
                    </div>
                )}

                {/* Sales Table */}
                {!loading && !error && (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b text-gray-600 uppercase text-xs">
                                    <th className="p-4">ID</th>
                                    <th className="p-4">ឈ្មោះអតិថិជន</th>
                                    <th className="p-4">ទំនិញ</th>
                                    <th className="p-4">ចំនួន</th>
                                    <th className="p-4">តម្លៃសរុប</th>
                                    <th className="p-4">កាលបរិច្ឆេទ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {sales.length > 0 ? (
                                    sales.map((sale, index) => (
                                        <tr key={sale._id?.$oid || sale._id || sale.id || index} className="hover:bg-gray-50 transition">
                                            {/* 💡 កាត់យកតែ ៦ តួចុងក្រោយ ដោយប្រើ helper getShortId */}
                                            <td className="px-4 py-2 font-mono text-xs font-semibold text-slate-600">
                                                #{getShortId(sale)}
                                            </td>

                                            <td className="p-4">{sale.customer_name || 'N/A'}</td>
                                            {/* 💡 បង្ហាញ product_name */}
                                            <td className="p-4">{sale.product_name || 'N/A'}</td>
                                            <td className="p-4">{sale.quantity}</td>
                                            <td className="p-4 text-green-600 font-bold">
                                                ${Number(sale.total_price || 0).toFixed(2)}
                                            </td>
                                            <td className="p-4 text-sm text-gray-500">
                                                {sale.created_at || sale.sale_date
                                                    ? new Date(sale.created_at || sale.sale_date).toLocaleDateString('km-KH')
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-6 text-center text-gray-500">
                                            មិនទាន់មានទិន្នន័យការលក់នៅឡើយទេ។
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Form សម្រាប់បន្ថែម Sale ថ្មី */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">បន្ថែមការលក់ថ្មី</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 font-bold text-xl leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {formError && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ឈ្មោះអតិថិជន <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    placeholder="ឧ. សុខ ជា"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ឈ្មោះទំនិញ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="product_name" // 💡 កែសម្រួល name មក product_name
                                    value={formData.product_name}
                                    onChange={handleChange}
                                    placeholder="ឧ. កាហ្វេទឹកដោះគោ"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ចំនួន
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        តម្លៃសរុប ($) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="total_price"
                                        value={formData.total_price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                                >
                                    បោះបង់
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow transition disabled:opacity-50"
                                >
                                    {submitting ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}