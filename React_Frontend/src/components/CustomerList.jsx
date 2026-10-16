// components/CustomerList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios'; // Custom Axios Instance
import CustomerUpdate from './CustomerUpdate';
import CustomerDelete from './CustomerDelete';
import CustomerAdd from './CustomerAdd';
import { User, Phone, Mail, MapPin, Plus, Edit, Trash2 } from 'lucide-react';

export default function CustomerList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedAddressFilter, setSelectedAddressFilter] = useState('ALL');

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modal states
    const [selectedItem, setSelectedItem] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // ទាញយកទិន្នន័យអតិថិជនពី API MongoDB
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/customers');
            const data = response.data?.data || response.data || [];
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ទាញយក Address មិនឱ្យស្ទួនសម្រាប់ធ្វើជា Filter Options
    const uniqueAddresses = useMemo(() => {
        return [...new Set(items.map(i => i.address).filter(Boolean))];
    }, [items]);

    // Filter items (Search Input + Select Address Filter)
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch =
                item.name?.toLowerCase().includes(search.toLowerCase()) ||
                item.phone?.includes(search) ||
                item.email?.toLowerCase().includes(search.toLowerCase());

            const matchesAddressFilter =
                selectedAddressFilter === 'ALL' ||
                item.address === selectedAddressFilter;

            return matchesSearch && matchesAddressFilter;
        });
    }, [items, search, selectedAddressFilter]);

    // Reset back to page 1 on filter or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedAddressFilter]);

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
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">គ្រប់គ្រងអតិថិជន (Customer Management)</h1>
                        <p className="text-sm text-gray-500">បញ្ជីឈ្មោះអតិថិជនទាំងអស់ក្នុងប្រព័ន្ធ</p>
                    </div>
                </div>

                {/* Add New Item Button */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-md transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>បន្ថែមអតិថិជនថ្មី (Add Customer)</span>
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
                            placeholder="ស្វែងរកតាមឈ្មោះ លេខទូរស័ព្ទ ឬអ៊ីម៉ែល..."
                            className="w-full pl-10 pr-4 py-1.5 border-none rounded-xl text-sm focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filter Address Select Option */}
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <select
                        value={selectedAddressFilter}
                        onChange={(e) => setSelectedAddressFilter(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <option value="ALL">📍 ទីតាំងទាំងអស់ (All Addresses)</option>
                        {uniqueAddresses.map((addr) => (
                            <option key={addr} value={addr}>
                                🏛️ {addr}
                            </option>
                        ))}
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
                                <th className="py-4 px-6">អតិថិជន <br />(Customer)</th>
                                <th className="py-4 px-6">ភេទ <br />(Gender)</th>
                                <th className="py-4 px-6">លេខទូរស័ព្ទ <br />(Phone)</th>
                                <th className="py-4 px-6">អាសយដ្ឋាន <br />(Address)</th>
                                <th className="py-4 px-6">ការបញ្ជាទិញ <br />(Orders)</th>
                                <th className="py-4 px-6">ស្ថានភាព <br />(Status)</th>
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
                                        មិនមានទិន្នន័យអតិថិជនឡើយ
                                    </td>
                                </tr>
                            ) : (
                                paginatedItems.map((item) => {
                                    const itemId = item._id?.$oid || item._id || item.id;
                                    const imageSrc = item.photo
                                        ? item.photo.startsWith('http')
                                            ? item.photo
                                            : `http://localhost:8000${item.photo.startsWith('/') ? '' : '/'}${item.photo}`
                                        : null;

                                    return (
                                        <tr key={itemId} className="hover:bg-amber-50/30 transition-colors">
                                            {/* ID Column */}
                                            <td className="py-4 px-6 text-xs font-mono font-medium text-gray-400">
                                                #{String(itemId).substring(0, 6)}
                                            </td>

                                            {/* Customer Name & Photo */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center space-x-3">
                                                    {imageSrc ? (
                                                        <img
                                                            src={imageSrc}
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
                                                        <div className="text-xs text-gray-400">{item.email || 'គ្មានអ៊ីម៉ែល'}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Gender */}
                                            <td className="py-4 px-6 font-medium text-gray-600">
                                                {item.gender || 'មិនបានระบุ'}
                                            </td>

                                            {/* Phone */}
                                            <td className="py-4 px-6 font-medium text-gray-600">
                                                {item.phone || 'គ្មានលេខទូរស័ព្ទ'}
                                            </td>

                                            {/* Address */}
                                            <td className="py-4 px-6">
                                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                                                    {item.address || 'មិនមានអាសយដ្ឋាន'}
                                                </span>
                                            </td>

                                            {/* Orders Completed / Cancel */}
                                            <td className="py-4 px-6 text-xs font-medium">
                                                <span className="text-emerald-600 font-bold">✓ {item.total_order_completed || 0}</span>
                                                <span className="text-gray-300 mx-1">|</span>
                                                <span className="text-red-500 font-bold">✕ {item.total_order_cancel || 0}</span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${item.status === 'Inactive' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                                                    {item.status || 'Active'}
                                                </span>
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
                                                        <Edit className="w-5 h-5" />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
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
                <CustomerAdd
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        fetchData();
                    }}
                />
            )}

            {/* Edit Modal */}
            {showEditModal && selectedItem && (
                <CustomerUpdate
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
                <CustomerDelete
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