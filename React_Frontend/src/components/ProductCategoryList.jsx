// components/ProductCategoryList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios'; // Custom Axios Instance
import ProductCategoryUpdate from './ProductCategoryUpdate';
import ProductCategoryDelete from './ProductCategoryDelete';
import ProductCategoryAdd from './ProductCategoryAdd';

export default function ProductCategoryList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedItemFilter, setSelectedItemFilter] = useState('ALL');

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modal states
    const [selectedItem, setSelectedItem] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await api.get('/product-categorys');
            setItems(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching categorys:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Filter categorys (Search Input + Select Item Filter)
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch =
                item.name?.toLowerCase().includes(search.toLowerCase()) ||
                item.description?.toLowerCase().includes(search.toLowerCase());

            const matchesItemFilter =
                selectedItemFilter === 'ALL' || item.name === selectedItemFilter;

            return matchesSearch && matchesItemFilter;
        });
    }, [items, search, selectedItemFilter]);

    // Reset back to page 1 on filter or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedItemFilter]);

    // Pagination Calculations
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage, itemsPerPage]);

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            {/* Header Title & Add Button Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-md">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">គ្រប់គ្រងប្រភេទផលិតផល (Product Category List)</h1>
                        <p className="text-sm text-gray-500">បញ្ជីឈ្មោះ ប្រភេទផលិតផលទាំងអស់</p>
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
                    <span>បន្ថែមប្រភេទផលិតផលថ្មី (Add Item)</span>
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
                            placeholder="ស្វែងរកតាមឈ្មោះ ឬការពិពណ៌នា..."
                            className="w-full pl-10 pr-4 py-1.5 border-none rounded-xl text-sm focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Item Select Option Filter */}
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <select
                        value={selectedItemFilter}
                        onChange={(e) => setSelectedItemFilter(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <option value="ALL">ប្រភេទផលិតផលទាំងអស់ (All Category)</option>
                        {items.map((item) => {
                            const itemId = item._id || item.id;
                            return (
                                <option key={itemId} value={item.name}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                                <th className="py-4 px-6">ប្រភេទផលិតផល (ROLE)</th>
                                {/* <th className="py-4 px-6">ម៉ោងធ្វើការ (SCHEDULE)</th>
                                <th className="py-4 px-6">ការពិពណ៌នា (DESCRIPTION)</th> */}
                                {/* <th className="py-4 px-6 text-right">សកម្មភាព (ACTIONS)</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-400">
                                        កំពុងទាញយកទិន្នន័យ...
                                    </td>
                                </tr>
                            ) : paginatedItems.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-400">
                                        មិនមានទិន្នន័យឡើយ
                                    </td>
                                </tr>
                            ) : (
                                paginatedItems.map((item) => {
                                    const itemId = item._id || item.id;
                                    return (
                                        <tr key={itemId} className="hover:bg-amber-50/30 transition-colors">
                                            {/* Item Info & Icon */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    {item.photo ? (
                                                        <img
                                                            src={item.photo.startsWith('http') ? item.photo : `http://localhost:8000${item.photo.startsWith('/') ? '' : '/'}${item.photo}`}
                                                            alt={item.name}
                                                            className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-base">
                                                            {item.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-gray-900">{item.name}</div>
                                                        <div className="text-xs text-gray-400">ID: #{String(itemId).substring(0, 7)}</div>
                                                    </div>
                                                </div>
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

                {/* Footer Section: Total Count on Left & Pagination on Right */}
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
                <ProductCategoryAdd
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        fetchItems();
                    }}
                />
            )}

            {/* Edit Modal */}
            {showEditModal && selectedItem && (
                <ProductCategoryUpdate
                    item={selectedItem}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={() => {
                        setShowEditModal(false);
                        fetchItems();
                    }}
                />
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedItem && (
                <ProductCategoryDelete
                    item={selectedItem}
                    onClose={() => setShowDeleteModal(false)}
                    onSuccess={() => {
                        setShowDeleteModal(false);
                        fetchItems();
                    }}
                />
            )}
        </div>
    );
}