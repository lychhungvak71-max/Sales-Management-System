// components/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    TrendingUp,
    ArrowUpRight,
    CreditCard,
    Calendar,
    Award,
    RotateCcw
} from 'lucide-react';
import api from '../api/axios';

export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // ទាញយកទិន្នន័យចាំបាច់ទាំងអស់សម្រាប់ Dashboard Analytics
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [orderRes, prodRes, custRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/products'),
                    api.get('/customers')
                ]);

                setOrders(orderRes.data?.data || orderRes.data || []);
                setProducts(prodRes.data?.data || prodRes.data || []);
                setCustomers(custRes.data?.data || custRes.data || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // គណនាស្ថិតិសំខាន់ៗ (KPI Metrics រួមទាំង Return / Refund)
    const analyticsData = useMemo(() => {
        // បែងចែក Orders ធម្មតា និង Orders ដែលបាន Cancelled/Refund
        const activeOrders = orders.filter(o => o.status !== 'Cancelled');
        const returnedOrders = orders.filter(o => o.status === 'Cancelled');

        // ចំណូលសរុប (គណនាเฉพาะ Order ដែលមិនទាន់ Cancelled)
        const totalRevenue = activeOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

        const totalOrders = activeOrders.length;
        const totalReturnedOrders = returnedOrders.length;
        const totalProducts = products.length;
        const totalCustomers = customers.length;

        // គណនាទំនិញលក់ដាច់បំផុត (Top Selling Products - មិនរាប់បញ្ចូល Order ដែល Cancelled)
        const productSalesMap = {};
        activeOrders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const name = item.name || 'Unknown Product';
                    const qty = Number(item.quantity || 1);
                    const amount = Number(item.price || 0) * qty;

                    if (!productSalesMap[name]) {
                        productSalesMap[name] = { name, quantity: 0, totalAmount: 0 };
                    }
                    productSalesMap[name].quantity += qty;
                    productSalesMap[name].totalAmount += amount;
                });
            }
        });

        const topProducts = Object.values(productSalesMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        // គណនាការទូទាត់តាមវិធីសាស្ត្រ ( Payment Method Breakdown )
        const paymentMap = { Cash: 0, 'ABA Pay': 0, KHQR: 0 };
        activeOrders.forEach(order => {
            const method = order.payment_method || 'Cash';
            paymentMap[method] = (paymentMap[method] || 0) + Number(order.total || 0);
        });

        return {
            totalRevenue,
            totalOrders,
            totalReturnedOrders,
            totalProducts,
            totalCustomers,
            topProducts,
            paymentMap
        };
    }, [orders, products, customers]);

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            {/* Title Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-100">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800">ផ្ទាំងគ្រប់គ្រង និងរបាយការណ៍ (Dashboard)</h1>
                    <p className="text-sm text-slate-500 mt-1">ទិន្នន័យសង្ខេបនៃការលក់ ចំណូល ផលិតផល អតិថិជន និងការប្រគល់ទំនិញវិញ</p>
                </div>
                <div className="flex items-center space-x-2 bg-slate-100 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span>ធ្វើបច្ចុប្បន្នភាព: {new Date().toLocaleDateString()}</span>
                </div>
            </div>

            {/* KPI Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Total Revenue */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ចំណូលសរុប (Revenue)</p>
                        <h2 className="text-2xl font-extrabold text-emerald-600 mt-1">
                            ${analyticsData.totalRevenue.toFixed(2)}
                        </h2>
                        <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" /> សុទ្ធ 100%
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
                        <DollarSign className="w-6 h-6" />
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ការបញ្ជាទិញ (Orders)</p>
                        <h2 className="text-2xl font-extrabold text-slate-800 mt-1">
                            {analyticsData.totalOrders}
                        </h2>
                        <span className="inline-flex items-center text-[11px] font-semibold text-amber-600 mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> ជោគជ័យ
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                </div>

                {/* Returned / Refunded Orders 💡 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ប្រគល់ទំនិញវិញ (Returns)</p>
                        <h2 className="text-2xl font-extrabold text-red-600 mt-1">
                            {analyticsData.totalReturnedOrders}
                        </h2>
                        <span className="inline-flex items-center text-[11px] font-semibold text-red-500 mt-1">
                            <RotateCcw className="w-3 h-3 mr-1" /> បានបូកស្តុកវិញ
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100">
                        <RotateCcw className="w-6 h-6" />
                    </div>
                </div>

                {/* Total Products */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ផលិតផល (Products)</p>
                        <h2 className="text-2xl font-extrabold text-slate-800 mt-1">
                            {analyticsData.totalProducts}
                        </h2>
                        <span className="inline-flex items-center text-[11px] font-semibold text-blue-600 mt-1">
                            ក្នុងស្តុក
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                        <Package className="w-6 h-6" />
                    </div>
                </div>

                {/* Total Customers */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">អតិថិជន (Customers)</p>
                        <h2 className="text-2xl font-extrabold text-slate-800 mt-1">
                            {analyticsData.totalCustomers}
                        </h2>
                        <span className="inline-flex items-center text-[11px] font-semibold text-purple-600 mt-1">
                            សរុបក្នុងបញ្ជី
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-100">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Detailed Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ផលិតផលលក់ដាច់បំផុត (Top Selling Products) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-extrabold text-slate-800 text-base flex items-center space-x-2">
                            <Award className="w-5 h-5 text-amber-500" />
                            <span>ផលិតផលលក់ដាច់បំផុត Top 5 (Top Products)</span>
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <p className="text-xs text-slate-400 text-center py-6">កំពុងគណនាទិន្នន័យ...</p>
                        ) : analyticsData.topProducts.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-6">មិនទាន់មានទិន្នន័យលក់នៅឡើយ</p>
                        ) : (
                            analyticsData.topProducts.map((prod, index) => (
                                <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div className="flex items-center space-x-3">
                                        <span className="w-7 h-7 bg-amber-500 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                                            #{index + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{prod.name}</h4>
                                            <p className="text-xs text-slate-400">ចំនួនលក់ចេញ: <span className="font-semibold text-slate-700">{prod.quantity} ឯកតា</span></p>
                                        </div>
                                    </div>
                                    <span className="font-extrabold text-amber-600 text-sm">
                                        ${prod.totalAmount.toFixed(2)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ស្ថិតិទូទាត់តាមវិធីសាស្ត្រ (Payment Method Revenue) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="font-extrabold text-slate-800 text-base mb-4 flex items-center space-x-2">
                            <CreditCard className="w-5 h-5 text-amber-500" />
                            <span>ចំណូលតាមវិធីសាស្ត្រទូទាត់</span>
                        </h3>

                        <div className="space-y-4">
                            {/* Cash */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-700">💵 ប្រាក់ស្រស់ (Cash)</span>
                                    <span className="text-slate-900">${(analyticsData.paymentMap['Cash'] || 0).toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${analyticsData.totalRevenue ? ((analyticsData.paymentMap['Cash'] || 0) / analyticsData.totalRevenue) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* ABA Pay */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-700">💳 ABA Pay</span>
                                    <span className="text-slate-900">${(analyticsData.paymentMap['ABA Pay'] || 0).toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${analyticsData.totalRevenue ? ((analyticsData.paymentMap['ABA Pay'] || 0) / analyticsData.totalRevenue) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* KHQR */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-700">📱 KHQR</span>
                                    <span className="text-slate-900">${(analyticsData.paymentMap['KHQR'] || 0).toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${analyticsData.totalRevenue ? ((analyticsData.paymentMap['KHQR'] || 0) / analyticsData.totalRevenue) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                        <p className="text-[11px] text-slate-400">ប្រព័ន្ធគ្រប់គ្រងការលក់ Sales Management POS</p>
                    </div>
                </div>
            </div>
        </div>
    );
}