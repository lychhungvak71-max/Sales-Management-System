// components/OrderHistory.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingBag, Printer, X, RotateCcw } from 'lucide-react';
import api from '../api/axios';

// ----------------------------------------------------
// Component សម្រាប់ Modal បញ្ជាក់ការប្រគល់ទំនិញវិញ (Order Return Modal)
// ----------------------------------------------------
function OrderReturnModal({ order, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const orderId = order?._id?.$oid || order?._id || order?.id;

    const handleReturn = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            await api.put(`/orders/${orderId}/refund`);
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (error) {
            console.error('Refund error:', error);
            setErrorMsg(error.response?.data?.message || 'មានបញ្ហាក្នុងការប្រគល់ទំនិញវិញ!');
        } finally {
            setLoading(false);
        }
    };

    if (!order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md relative animate-in zoom-in-95 duration-200">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center mb-5">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-3 border border-amber-100">
                        <RotateCcw className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-800 mb-1">
                        បញ្ជាក់ការប្រគល់ទំនិញវិញ (Return Order)
                    </h3>
                    <p className="text-xs text-slate-500">
                        វិក្កយបត្រ #{String(orderId).substring(0, 8)}
                    </p>
                </div>

                {/* Items preview */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-5 space-y-1.5 max-h-36 overflow-y-auto">
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs font-medium text-slate-700">
                            <span>• {item.name} (x{item.quantity})</span>
                            <span className="font-bold text-amber-600">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t border-slate-200 pt-1.5 flex justify-between text-xs font-extrabold text-slate-900">
                        <span>ទឹកប្រាក់សរុប:</span>
                        <span className="text-red-600">${Number(order.total || 0).toFixed(2)}</span>
                    </div>
                </div>

                <p className="text-xs text-slate-500 text-center mb-5">
                    តើអ្នកពិតជាចង់ទទួលទំនិញនេះត្រឡប់មកវិញមែនទេ? ស្តុកទំនិញនឹងត្រូវបូកបញ្ចូលក្នុងប្រព័ន្ធវិញស្វ័យប្រវត្តិ។
                </p>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 text-center">
                        {errorMsg}
                    </div>
                )}

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
                        onClick={handleReturn}
                        disabled={loading}
                        className="w-1/2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition duration-200 shadow-md shadow-amber-500/20 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>{loading ? 'កំពុងប្រគល់...' : 'ប្រគល់ទំនិញវិញ'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------
// Component សម្រាប់ទម្រង់បោះពុម្ពវិក្កយបត្រ (Receipt Print Modal)
// ----------------------------------------------------
function ReceiptPrintModal({ order, onClose }) {
    if (!order) return null;

    const orderId = order._id?.$oid || order._id || order.id;
    const formattedDate = order.created_at ? new Date(order.created_at).toLocaleString() : new Date().toLocaleString();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md relative my-8 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 print:hidden">
                    <h3 className="font-extrabold text-slate-800 text-base">បោះពុម្ពវិក្កយបត្រ (Receipt)</h3>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePrint}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                        >
                            <Printer className="w-4 h-4" />
                            <span>ព្រីន (Print)</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-xl transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto font-mono text-slate-800 bg-white print:p-0 print:m-0 print:w-full">
                    <div className="text-center mb-4 pb-3 border-b border-dashed border-slate-300">
                        <h2 className="font-extrabold text-lg tracking-wider text-slate-900">SALES MANAGEMENT SYSTEM</h2>
                        <p className="text-[11px] text-slate-500">ប្រព័ន្ធគ្រប់គ្រងការលក់ និងស្តុកទំនិញ</p>
                        <p className="text-[11px] text-slate-500">ទូរស័ព្ទ: 012 345 678 / 098 765 432</p>
                    </div>

                    <div className="text-xs space-y-1 mb-4 pb-3 border-b border-dashed border-slate-300">
                        <div className="flex justify-between">
                            <span className="text-slate-500">វិក្កយបត្រ #ID:</span>
                            <span className="font-bold">#{String(orderId).substring(0, 8)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">កាលបរិច្ឆេទ:</span>
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">អតិថិជន:</span>
                            <span className="font-bold">{order.customer_name || 'អតិថិជនទូទៅ'}</span>
                        </div>
                        {order.customer_phone && (
                            <div className="flex justify-between">
                                <span className="text-slate-500">លេខទូរស័ព្ទ:</span>
                                <span>{order.customer_phone}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-slate-500">ទូទាត់តាម:</span>
                            <span className="font-bold">{order.payment_method || 'Cash'}</span>
                        </div>
                    </div>

                    <div className="text-xs border-b border-slate-800 pb-1 mb-2 font-bold flex justify-between">
                        <span className="w-5/12">បរិយាយ</span>
                        <span className="w-2/12 text-center">ចំនួន</span>
                        <span className="w-2/12 text-right">តម្លៃ</span>
                        <span className="w-3/12 text-right">សរុប</span>
                    </div>

                    <div className="text-xs space-y-1.5 mb-4 pb-3 border-b border-dashed border-slate-300">
                        {order.items && order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                                <span className="w-5/12 truncate pr-1">{item.name}</span>
                                <span className="w-2/12 text-center">{item.quantity}</span>
                                <span className="w-2/12 text-right">${Number(item.price || 0).toFixed(2)}</span>
                                <span className="w-3/12 text-right font-semibold">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="text-xs space-y-1.5 mb-6 pb-4 border-b border-dashed border-slate-300">
                        <div className="flex justify-between text-slate-600">
                            <span>តម្លៃសរុប (Subtotal):</span>
                            <span>${Number(order.subtotal || order.total || 0).toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-red-500">
                                <span>បញ្ចុះតម្លៃ (Discount):</span>
                                <span>-${Number(order.discount).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                            <span>ទឹកប្រាក់សរុប (Total):</span>
                            <span className="text-amber-600">${Number(order.total || 0).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="text-center text-xs space-y-1 text-slate-500 pt-2">
                        <p className="font-bold text-slate-700">អរគុណសម្រាប់ការទិញទំនិញ!</p>
                        <p className="text-[10px]">សូមអញ្ជើញមកម្តងទៀត 🙏</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------
// Component មេ OrderHistory
// ----------------------------------------------------
export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
    const [selectedPrintOrder, setSelectedPrintOrder] = useState(null);
    const [selectedReturnOrder, setSelectedReturnOrder] = useState(null); // 💡 State សម្រាប់ Return Modal

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // ទាញយកប្រវត្តិ Orders ពី API
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders');
            const data = response.data?.data || response.data || [];
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter Orders តាម Search និង Status
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
                order.customer_phone?.includes(search) ||
                String(order._id?.$oid || order._id || order.id).toLowerCase().includes(search.toLowerCase()) ||
                order.items?.some(i => i.name?.toLowerCase().includes(search.toLowerCase()));

            const orderStatus = order.status ? order.status.trim().toLowerCase() : '';
            const filterStatus = selectedStatusFilter.trim().toLowerCase();

            let matchesStatus = true;
            if (selectedStatusFilter !== 'ALL') {
                if (selectedStatusFilter === 'NONE') {
                    matchesStatus = !order.status;
                } else {
                    matchesStatus = orderStatus === filterStatus;
                }
            }

            return matchesSearch && matchesStatus;
        });
    }, [orders, search, selectedStatusFilter]);

    // Reset page ទៅទំព័រទី 1 ពេលលក្ខខណ្ឌស្វែងរកប្រែប្រួល
    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedStatusFilter]);

    // ការគណនាលើ Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(start, start + itemsPerPage);
    }, [filteredOrders, currentPage, itemsPerPage]);

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            {/* Header Title Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-md">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">ប្រវត្តិការបញ្ជាទិញ (Order History)</h1>
                        <p className="text-sm text-gray-500">បញ្ជីការបញ្ជាទិញ ឈ្មោះទំនិញ និងការប្រគល់ទំនិញវិញ</p>
                    </div>
                </div>
            </div>

            {/* Search Bar & Status Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="relative w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Search className="w-5 h-5" />
                        </span>
                        <input
                            type="text"
                            placeholder="ស្វែងរកតាមឈ្មោះអតិថិជន លេខទូរស័ព្ទ ឈ្មោះទំនិញ ឬកូដ Order..."
                            className="w-full pl-10 pr-4 py-1.5 border-none rounded-xl text-sm focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <select
                        value={selectedStatusFilter}
                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <option value="ALL">📌 ស្ថានភាពទាំងអស់ (All Status)</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="NONE">មិនមាន (No Status)</option>
                    </select>
                </div>
            </div>

            {/* Orders Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-center text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                                <th className="py-4 px-6">Order ID</th>
                                <th className="py-4 px-6 text-left">អតិថិជន <br />(Customer)</th>
                                <th className="py-4 px-6 text-left">ឈ្មោះទំនិញទាំងអស់ <br />(Products Ordered)</th>
                                <th className="py-4 px-6">ទឹកប្រាក់ <br />(Total)</th>
                                <th className="py-4 px-6">ការទូទាត់ <br />(Payment)</th>
                                <th className="py-4 px-6">ស្ថានភាព <br />(Status)</th>
                                <th className="py-4 px-6">កាលបរិច្ឆេទ <br />(Date)</th>
                                <th className="py-4 px-6">សកម្មភាព <br />(Actions)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center text-gray-400">
                                        កំពុងទាញយកទិន្នន័យប្រវត្តិបញ្ជាទិញ...
                                    </td>
                                </tr>
                            ) : paginatedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center text-gray-400">
                                        មិនមានប្រវត្តិការបញ្ជាទិញឡើយ
                                    </td>
                                </tr>
                            ) : (
                                paginatedOrders.map((order) => {
                                    const orderId = order._id?.$oid || order._id || order.id;
                                    const isCancelled = order.status === 'Cancelled';

                                    return (
                                        <tr key={orderId} className="hover:bg-amber-50/30 transition-colors text-center">
                                            {/* ID */}
                                            <td className="py-4 px-6 text-xs font-mono font-medium text-gray-400">
                                                #{String(orderId).substring(0, 6)}
                                            </td>

                                            {/* Customer Info */}
                                            <td className="py-4 px-6 text-left">
                                                <div className="font-bold text-gray-900">{order.customer_name || 'អតិថិជនទូទៅ'}</div>
                                                <div className="text-xs text-gray-400">{order.customer_phone || 'គ្មានលេខទូរស័ព្ទ'}</div>
                                            </td>

                                            {/* ឈ្មោះទំនិញទាំងអស់ */}
                                            <td className="py-4 px-6 text-left max-w-xs">
                                                <div className="space-y-1">
                                                    {order.items && order.items.length > 0 ? (
                                                        order.items.map((item, idx) => (
                                                            <div key={idx} className="text-xs flex items-center justify-between bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                                <span className="font-semibold text-slate-800 truncate mr-2">• {item.name}</span>
                                                                <span className="text-amber-600 font-bold whitespace-nowrap">x{item.quantity} (${((item.price || 0) * (item.quantity || 1)).toFixed(2)})</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-400">គ្មានទំនិញ</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Total Price */}
                                            <td className="py-4 px-6 font-extrabold text-amber-600">
                                                ${Number(order.total || 0).toFixed(2)}
                                            </td>

                                            {/* Payment Method */}
                                            <td className="py-4 px-6">
                                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                                                    {order.payment_method || 'Cash'}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${!order.status ? 'bg-slate-100 text-slate-500 border border-slate-200' :
                                                        order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border border-red-200' :
                                                            order.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                                                'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                    }`}>
                                                    {!order.status ? 'មិនមាន' : order.status === 'Pending' ? 'Pending' : order.status === 'Cancelled' ? 'Cancelled' : 'Completed'}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                                                {order.created_at ? new Date(order.created_at).toLocaleString() : 'ពេលនេះ'}
                                            </td>

                                            {/* Actions: Print Receipt & Return Button */}
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center space-x-1">
                                                    {/* Print Receipt Button */}
                                                    <button
                                                        onClick={() => setSelectedPrintOrder(order)}
                                                        className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                                        title="បោះពុម្ពវិក្កយបត្រ (Print Receipt)"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>

                                                    {/* Return/Refund Button */}
                                                    {!isCancelled && (
                                                        <button
                                                            onClick={() => setSelectedReturnOrder(order)}
                                                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                            title="ប្រគល់ទំនិញវិញ (Return Order)"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Section */}
                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                    <div>
                        បង្ហាញទិន្នន័យ {paginatedOrders.length} ក្នុងចំណោម {filteredOrders.length} ជួរ (សរុប {orders.length})
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            ថយក្រោយ
                        </button>

                        <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-semibold">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            បន្ទាប់
                        </button>
                    </div>
                </div>
            </div>

            {/* Receipt Print Modal */}
            {selectedPrintOrder && (
                <ReceiptPrintModal
                    order={selectedPrintOrder}
                    onClose={() => setSelectedPrintOrder(null)}
                />
            )}

            {/* Order Return Modal */}
            {selectedReturnOrder && (
                <OrderReturnModal
                    order={selectedReturnOrder}
                    onClose={() => setSelectedReturnOrder(null)}
                    onSuccess={() => {
                        fetchOrders(); // ទាញយកទិន្នន័យថ្មីក្រោយ Return ជោគជ័យ
                    }}
                />
            )}
        </div>
    );
}