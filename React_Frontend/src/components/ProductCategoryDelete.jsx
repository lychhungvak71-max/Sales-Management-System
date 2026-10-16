// components/ProductCategoryDelete.jsx
import React, { useState } from 'react';
import api from '../api/axios'; // ប្រើ Custom Axios Instance ដែលមាន Token Header

export default function ProductCategoryDelete({ item, onClose = () => { }, onSuccess = () => { } }) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const itemId = item?._id || item?.id;

    const handleDelete = async () => {
        if (!itemId) {
            setErrorMsg('មិនអាចស្វែងរក ID របស់ Category នេះបានឡើយ!');
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            const response = await api.delete(`/product-categorys/${itemId}`);

            if (typeof onSuccess === 'function') {
                onSuccess(response.data);
            }
            if (typeof onClose === 'function') {
                onClose();
            }
        } catch (error) {
            console.error('Error deleting Category:', error);
            setErrorMsg(
                error.response?.data?.message ||
                'មិនអាចលុប Category នេះបានទេ! សូមព្យាយាមម្តងទៀត។'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
                {/* Warning Icon */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h2 className="text-xl font-bold mb-2 text-gray-800">Confirm Delete</h2>

                <p className="text-gray-600 mb-4 text-sm">
                    Are you sure you want to delete <span className="font-semibold text-red-600">{item?.name || 'this Category'}</span>? Action this cannot be undone.
                </p>

                {errorMsg && (
                    <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                        {errorMsg}
                    </div>
                )}

                <div className="flex justify-center space-x-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition text-sm font-medium flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            'Confirm Delete'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}