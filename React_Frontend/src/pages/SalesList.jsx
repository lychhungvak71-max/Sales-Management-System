import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function SalesList() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    const fetchSales = async () => {
        setLoading(true);
        try {
            const response = await api.get('/sales', {
                params: { search, status }
            });
            setSales(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [search, status]);

    const handleDelete = async (id) => {
        if (window.confirm('តើអ្នកពិតជាចង់លុបទិន្នន័យលក់នេះមែនទេ?')) {
            try {
                await api.delete(`/sales/${id}`);
                fetchSales(); // Refresh បញ្ជីទិន្នន័យ
            } catch (error) {
                alert('បរាជ័យក្នុងការលុបទិន្នន័យ');
            }
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">គ្រប់គ្រងការលក់ (Sales List)</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    + បន្ថែមការលក់ថ្មី
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="ស្វែងរកតាមឈ្មោះអតិថិជន ឬទំនិញ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="">-- តម្រងតាមស្ថានភាព --</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {/* Table & Loading State */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">កំពុងទាញយកទិន្នន័យ...</span>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200 text-sm font-semibold text-gray-700">
                                <th className="p-4">អតិថិជន</th>
                                <th className="p-4">ទំនិញ</th>
                                <th className="p-4">ចំនួន</th>
                                <th className="p-4">តម្លៃសរុប</th>
                                <th className="p-4">ស្ថានភាព</th>
                                <th className="p-4 text-center">សកម្មភាព</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {sales.length > 0 ? (
                                sales.map((item) => (
                                    <tr key={item._id || item.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900">{item.customer_name}</td>
                                        <td className="p-4 text-gray-600">{item.product_name}</td>
                                        <td className="p-4 text-gray-600">{item.quantity}</td>
                                        <td className="p-4 text-gray-900 font-semibold">${item.total_price}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center space-x-2">
                                            <button className="text-blue-600 hover:text-blue-800 font-medium">កែប្រែ</button>
                                            <button
                                                onClick={() => handleDelete(item._id || item.id)}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                លុប
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-6 text-gray-500">
                                        មិនមានទិន្នន័យឡើយ
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}