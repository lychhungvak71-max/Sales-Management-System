// components/ProductList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios'; // Custom Axios Instance
import ProductUpdate from './ProductUpdate';
import ProductDelete from './ProductDelete';
import ProductAdd from './ProductAdd';

export default function ProductList() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]); // 💡 បន្ថែម State សម្រាប់រក្សា Categories ពី MongoDB
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modal states
    const [selectedItem, setSelectedItem] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // 💡 ទាញយកទាំង Products និង Categories ចេញពី MongoDB Atlas
    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                api.get('/products').catch(() => null),
                api.get('/product-categorys').catch(() => null)
            ]);

            if (productsRes) {
                setItems(productsRes.data?.data || productsRes.data || []);
            }

            if (categoriesRes) {
                const catData = categoriesRes.data?.data || categoriesRes.data || [];
                setCategories(Array.isArray(catData) ? catData : []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter items (Search Input + Select Category Filter)
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            // const matchesSearch =
            //     item.name?.toLowerCase().includes(search.toLowerCase()) ||
            //     item.description?.toLowerCase().includes(search.toLowerCase()) ||
            //     String(item._id || item.id).toLowerCase().includes(search.toLowerCase());

            const matchesSearch =
                item.name?.toLowerCase().includes(search.toLowerCase());

            // 💡 ផ្ទៀងផ្ទាត់ Filter តាមឈ្មោះ ឬ ID ប្រភេទ
            const matchesCategoryFilter =
                selectedCategoryFilter === 'ALL' ||
                item.category_name === selectedCategoryFilter ||
                item.category_id === selectedCategoryFilter ||
                item.category === selectedCategoryFilter;

            return matchesSearch && matchesCategoryFilter;
        });
    }, [items, search, selectedCategoryFilter]);

    // Reset back to page 1 on filter or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedCategoryFilter]);

    // Pagination Calculations
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage, itemsPerPage]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            {/* Header Title & Add Button Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-md">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">គ្រប់គ្រងផលិតផល (Product Management)</h1>
                        <p className="text-sm text-gray-500">បញ្ជីឈ្មោះផលិតផលទាំងអស់ក្នុងប្រព័ន្ធ</p>
                    </div>
                </div>

                {/* Add New Item Button */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-md transition-all active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>បន្ថែមផលិតផលថ្មី (Add Product)</span>
                </button>
            </div>

            {/* Search Bar & Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input Filter */}
                <div className="md:col-span-2 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="relative w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="ស្វែងរកតាមឈ្មោះ, ID ឬការពិពណ៌នា..."
                            className="w-full pl-10 pr-4 py-1.5 border-none rounded-xl text-sm focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* 💡 Filter Category Select Option - ទាញចេញពី MongoDB Categories collection */}
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <option value="ALL">ប្រភេទផលិតផលទាំងអស់ (All Category)</option>

                        {/* បង្ហាញ Categories ដែលបានទាញចេញពី MongoDB */}
                        {categories.length > 0 ? (
                            categories.map((cat) => {
                                const catId = cat._id?.$oid || cat._id || cat.id;
                                const catName = cat.name || cat.category_name;
                                return (
                                    <option key={catId} value={catName}>
                                        {catName} ☁️(Mongo)
                                    </option>
                                );
                            })
                        ) : (
                            // Fallback ប្រសិនបើ API Category ពុំទាន់បោះមក គឺដកស្រង់ចេញពី items តែមិនឱ្យស្ទួន
                            [...new Set(items.map(i => i.category_name).filter(Boolean))].map((catName) => (
                                <option key={catName} value={catName}>
                                    {catName} 📂(Local/Fallback)
                                </option>
                            ))
                        )}
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-center text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                                <th className="py-4 px-6">ID</th>
                                <th className="py-4 px-6">ផលិតផល <br />(Product)</th>
                                <th className="py-4 px-6">ប្រភេទ <br />(Category)</th>
                                <th className="py-4 px-6">តម្លៃដើម <br />(Original)</th>
                                <th className="py-4 px-6">តម្លៃលក់ <br />(Price)</th>
                                <th className="py-4 px-6">ស្តុក <br />(Stock)</th>
                                <th className="py-4 px-6">ការពិពណ៌នា <br />(Description)</th>
                                <th className="py-4 px-6">សកម្មភាព <br />(Actions)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center text-gray-400">
                                        កំពុងទាញយកទិន្នន័យ...
                                    </td>
                                </tr>
                            ) : paginatedItems.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center text-gray-400">
                                        មិនមានទិន្នន័យឡើយ
                                    </td>
                                </tr>
                            ) : (
                                paginatedItems.map((item) => {
                                    const itemId = item._id?.$oid || item._id || item.id;
                                    const stockCount = Number(item.stock || 0);

                                    return (
                                        <tr key={itemId} className="hover:bg-amber-50/30 transition-colors">
                                            {/* ID Column */}
                                            <td className="py-4 px-6 text-xs font-mono font-medium text-gray-400">
                                                #{String(itemId).substring(0, 6)}
                                            </td>

                                            {/* Item Info & Photo */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    {item.photo ? (
                                                        <img
                                                            src={
                                                                item.photo.startsWith('http')
                                                                    ? item.photo
                                                                    : `${backendUrl}${item.photo.startsWith('/') ? '' : '/'}${item.photo}`
                                                            }
                                                            alt={item.name}
                                                            className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-base">
                                                            {item.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="font-bold text-gray-900">{item.name}</div>
                                                </div>
                                            </td>

                                            {/* Category Column */}
                                            <td className="py-4 px-6">
                                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                                                    {item.category_name || 'មិនទាន់មាន'}
                                                </span>
                                            </td>

                                            {/* Original Price Column */}
                                            <td className="py-4 px-6 font-medium text-gray-500">
                                                ${Number(item.original_price || 0).toFixed(2)}
                                            </td>

                                            {/* Selling Price Column */}
                                            <td className="py-4 px-6 font-semibold text-amber-600">
                                                ${Number(item.price || 0).toFixed(2)}
                                            </td>

                                            {/* Stock Column */}
                                            <td className="py-4 px-6">
                                                {stockCount}
                                            </td>

                                            {/* Description Column */}
                                            <td className="py-4 px-6 text-gray-500 max-w-xs truncate">
                                                {item.description || 'គ្មានការពិពណ៌នា'}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
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
                        បង្ហាញទិន្នន័យ {paginatedItems.length} ក្នុងចំណោម {filteredItems.length} ជួរ (សរុប {items.length})
                    </div>

                    {/* Pagination Bar Align Right */}
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

            {/* Add Item Modal */}
            {showAddModal && (
                <ProductAdd
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        fetchData();
                    }}
                />
            )}

            {/* Edit Modal */}
            {showEditModal && selectedItem && (
                <ProductUpdate
                    item={selectedItem}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => {
                        setShowEditModal(false);
                        fetchData();
                    }}
                />
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedItem && (
                <ProductDelete
                    item={selectedItem}
                    onClose={() => setShowDeleteModal(false)}
                    onSuccess={() => {
                        setShowDeleteModal(false);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
}