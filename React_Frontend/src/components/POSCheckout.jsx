// components/POSCheckout.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, CheckCircle, CreditCard, User, Phone, Printer, X } from 'lucide-react';
import api from '../api/axios';
// import { Tags } from 'lucide-react';

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

                {/* Header Actions (ពុំបង្ហាញពេលព្រីនចេញក្រដាស) */}
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

                {/* ផ្ទៃក្រដាសវិក្កយបត្រ ( Receipt Content ) */}
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
// Component មេ POSCheckout
// ----------------------------------------------------
export default function POSCheckout() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    // POS Cart & Customer States
    const [cart, setCart] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [customerPhoneSearch, setCustomerPhoneSearch] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // 💡 State សម្រាប់បង្ហាញ Modal ព្រីនវិក្កយបត្រក្រោយ Checkout រร็จ
    const [latestOrder, setLatestOrder] = useState(null);

    // ទាញយកទិន្នន័យ Products, Categories និង Customers
    useEffect(() => {
        const fetchPOSData = async () => {
            try {
                const [prodRes, catRes, custRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/product-categorys'),
                    api.get('/customers')
                ]);
                setProducts(prodRes.data?.data || prodRes.data || []);
                setCategories(catRes.data?.data || catRes.data || []);
                setCustomers(custRes.data?.data || custRes.data || []);
            } catch (error) {
                console.error('Error fetching POS data:', error);
            }
        };
        fetchPOSData();
    }, []);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
            const matchesCat = selectedCategory === 'ALL' || p.category_name === selectedCategory || p.category_id === selectedCategory;
            return matchesSearch && matchesCat;
        });
    }, [products, search, selectedCategory]);

    // ស្វែងរកអតិថិជនស្វ័យប្រវត្តិតាមលេខទូរស័ព្ទ
    useEffect(() => {
        if (customerPhoneSearch.trim() !== '') {
            const foundCustomer = customers.find(c => c.phone && c.phone.includes(customerPhoneSearch.trim()));
            if (foundCustomer) {
                const cId = foundCustomer._id?.$oid || foundCustomer._id || foundCustomer.id;
                setSelectedCustomer(cId);
            }
        }
    }, [customerPhoneSearch, customers]);

    const currentSelectedCustomerObj = customers.find(c => (c._id?.$oid || c._id || c.id) === selectedCustomer);

    // បន្ថែមចូលកន្រ្តក (Cart)
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product_id === (product._id?.$oid || product._id || product.id));
            if (existingItem) {
                return prevCart.map(item =>
                    item.product_id === existingItem.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, {
                    product_id: product._id?.$oid || product._id || product.id,
                    name: product.name,
                    price: Number(product.price),
                    quantity: 1,
                    photo: product.photo
                }];
            }
        });
    };

    // កែប្រែចំនួន quantity ក្នុង cart
    const updateQuantity = (productId, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.product_id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
        }).filter(Boolean));
    };

    // លុប item ពី cart
    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.product_id !== productId));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;

    // បញ្ជូនការបញ្ជាទិញ (Checkout)
    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        setSuccessMessage('');

        const orderData = {
            customer_id: selectedCustomer || null,
            customer_name: currentSelectedCustomerObj ? currentSelectedCustomerObj.name : 'អតិថិជនទូទៅ (Walk-in)',
            customer_phone: currentSelectedCustomerObj ? currentSelectedCustomerObj.phone : '',
            items: cart,
            subtotal: subtotal,
            discount: 0,
            total: total,
            payment_method: paymentMethod,
            status: 'Completed'
        };

        try {
            const response = await api.post('/orders', orderData);
            const createdOrder = response.data?.data || response.data;

            setSuccessMessage('ការទូទាត់ប្រាក់ និងបញ្ជាទិញបានជោគជ័យ!');

            // 💡 បង្ហាញ Modal ព្រីនវិក្កយបត្រភ្លាមៗដោយយកទិន្នន័យពី Server ឆ្លើយតបមកវិញ
            setLatestOrder(createdOrder);

            // សម្អាត Cart ក្រោយ Checkout រួច
            setCart([]);
            setSelectedCustomer('');
            setCustomerPhoneSearch('');
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (error) {
            console.error('Checkout error:', error);
            alert('មានបញ្ហាក្នុងការទូទាត់ប្រាក់ សូមព្យាយាមម្តងទៀត!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen bg-slate-50">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800">ប្រព័ន្ធលក់ទំនិញ (POS Checkout)</h1>
                    <p className="text-sm text-slate-500 mt-1">ជ្រើសរើសទំនិញ និងធ្វើការទូទាត់ប្រាក់ជូនអតិថិជន</p>
                </div>
            </div>

            {successMessage && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center space-x-3 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="font-bold text-sm">{successMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ផ្នែកខាងឆ្វេង៖ បញ្ជីផលិតផល */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="sm:col-span-2 relative">
                            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="ស្វែងរកផលិតផល..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                            />
                        </div>
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-amber-200 cursor-pointer"
                            >
                                <option value="ALL">🏷️ប្រភេទទាំងអស់</option>
                                {categories.map(cat => {
                                    const catId = cat._id?.$oid || cat._id || cat.id;
                                    const catName = cat.name || cat.category_name;
                                    return (
                                        <option key={catId} value={catName}>
                                            {catName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    {/* Products List Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[65vh] overflow-y-auto pr-1">
                        {filteredProducts.map(product => {
                            const prodId = product._id?.$oid || product._id || product.id;
                            const isOutOfStock = Number(product.stock || 0) <= 0;

                            return (
                                <div
                                    key={prodId}
                                    onClick={() => !isOutOfStock && addToCart(product)}
                                    className={`bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm flex flex-col justify-between transition cursor-pointer ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:border-amber-300 active:scale-95'
                                        }`}
                                >
                                    <div>
                                        <div className="w-full h-28 bg-slate-100 rounded-xl overflow-hidden mb-3 border border-slate-100 flex items-center justify-center">
                                            {product.photo ? (
                                                <img
                                                    src={product.photo.startsWith('http') ? product.photo : `http://127.0.0.1:8000${product.photo}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <ShoppingCart className="w-8 h-8 text-slate-300" />
                                            )}
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm truncate">{product.name}</h3>
                                        <p className="text-[11px] text-slate-400 mt-0.5">ស្តុក: {product.stock || 0}</p>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="font-extrabold text-amber-600 text-sm">${Number(product.price || 0).toFixed(2)}</span>
                                        <span className="w-7 h-7 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-xs font-bold border border-amber-200">
                                            +
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ផ្នែកខាងស្តាំ៖ កន្រ្តកទំនិញ និង Checkout */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between h-[85vh]">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center space-x-2">
                            <ShoppingCart className="w-5 h-5 text-amber-500" />
                            <span>កន្រ្តកទំនិញ (Current Order)</span>
                        </h2>

                        {/* ស្វែងរកអតិថិជនតាមលេខទូរស័ព្ទ */}
                        <div className="mb-3">
                            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                                <Phone className="w-3 h-3 text-amber-500" />
                                <span>ស្វែងរកអតិថិជនតាមលេខទូរស័ព្ទ</span>
                            </label>
                            <input
                                type="text"
                                placeholder="វាយបញ្ចូលលេខ📞ទូរស័ព្ទ..."
                                value={customerPhoneSearch}
                                onChange={(e) => setCustomerPhoneSearch(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-200"
                            />
                        </div>

                        {/* ជ្រើសរើសអតិថិជន */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-slate-700 mb-1">អតិថិជន (Customer)</label>
                            <select
                                value={selectedCustomer}
                                onChange={(e) => {
                                    setSelectedCustomer(e.target.value);
                                    if (!e.target.value) setCustomerPhoneSearch('');
                                }}
                                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-200"
                            >
                                <option value="">
                                    {currentSelectedCustomerObj ? '✅ មានអតិថិជន (Selected Customer)' : '👤 អតិថិជនទូទៅ (Walk-in Customer)'}
                                </option>
                                {customers.map(c => {
                                    const cId = c._id?.$oid || c._id || c.id;
                                    return (
                                        <option key={cId} value={cId}>
                                            👤 {c.name} ({c.phone || 'គ្មានទូរស័ព្ទ'})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Cart Items List */}
                        <div className="space-y-3 max-h-[26vh] overflow-y-auto pr-1 border-t border-slate-100 pt-3">
                            {cart.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-xs">
                                    មិនទាន់មានទំនិញក្នុងកន្រ្តកឡើយ
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.product_id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        <div className="flex-1 min-w-0 mr-2">
                                            <p className="font-bold text-slate-800 text-xs truncate">{item.name}</p>
                                            <p className="text-[11px] text-amber-600 font-semibold">${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => updateQuantity(item.product_id, -1)}
                                                className="w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-xs font-bold text-slate-700 w-5 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product_id, 1)}
                                                className="w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.product_id)}
                                                className="text-red-400 hover:text-red-600 p-1"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Payment & Totals */}
                    <div className="border-t border-slate-100 pt-4 space-y-3">
                        <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between text-slate-500 font-medium">
                                <span>សរុបងាយស្រួល (Subtotal)</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-800 font-extrabold text-base border-t border-slate-100 pt-2">
                                <span>ទឹកប្រាក់ត្រូវបង់សរុប (Total)</span>
                                <span className="text-amber-600">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <span className="text-xs font-bold text-slate-700">វិធីសាស្ត្រទូទាត់ (Payment Method)</span>
                            <div className="grid grid-cols-3 gap-2 mt-1">
                                {['Cash', 'ABA Pay', 'KHQR'].map(method => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setPaymentMethod(method)}
                                        className={`py-2 text-xs font-bold rounded-xl border transition ${paymentMethod === method
                                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                            }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-emerald-600/20 disabled:opacity-40 text-sm flex items-center justify-center space-x-2"
                        >
                            <CreditCard className="w-4 h-4" />
                            <span>{loading ? 'កំពុងដំណើរការ...' : `ទូទាត់ប្រាក់ ($${total.toFixed(2)})`}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Receipt Print Modal (បង្ហាញស្វ័យប្រវត្តិក្រោយ Checkout រร็จ) */}
            {latestOrder && (
                <ReceiptPrintModal
                    order={latestOrder}
                    onClose={() => setLatestOrder(null)}
                />
            )}
        </div>
    );
}