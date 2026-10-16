// components/ReceiptPrint.jsx
import React from 'react';
import { X, Printer } from 'lucide-react';

export default function ReceiptPrint({ order, onClose }) {
    if (!order) return null;

    const orderId = order._id?.$oid || order._id || order.id;
    const formattedDate = order.created_at ? new Date(order.created_at).toLocaleString() : new Date().toLocaleString();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md relative my-8 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Modal Header Actions (មិនព្រីនពេលចេញក្រដាស) */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 print:hidden bg-slate-50">
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

                {/* Receipt Content Area (ផ្នែកដែលត្រូវព្រីនចេញក្រដាស) */}
                <div className="p-6 overflow-y-auto font-mono text-slate-800 bg-white print:p-0 print:m-0 print:w-full">
                    {/* Store Header */}
                    <div className="text-center mb-4 pb-3 border-b border-dashed border-slate-300">
                        <h2 className="font-extrabold text-lg tracking-wider text-slate-900">SALES MANAGEMENT</h2>
                        <p className="text-[11px] text-slate-500">ប្រព័ន្ធគ្រប់គ្រងការលក់ និងស្តុកទំនិញ</p>
                        <p className="text-[11px] text-slate-500">ទូរស័ព្ទ: 012 345 678 / 098 765 432</p>
                    </div>

                    {/* Order & Customer Info */}
                    <div className="text-xs space-y-1 mb-4 pb-3 border-b border-dashed border-slate-300">
                        <div className="flex justify-between">
                            <span className="text-slate-500">វិក្កយបត្រ #ID:</span>
                            <span className="font-bold">{String(orderId).substring(0, 8)}</span>
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

                    {/* Items Table Header */}
                    <div className="text-xs border-b border-slate-800 pb-1 mb-2 font-bold flex justify-between">
                        <span className="w-5/12">បរិយាយ (Item)</span>
                        <span className="w-2/12 text-center">ចំនួន</span>
                        <span className="w-2/12 text-right">តម្លៃ</span>
                        <span className="w-3/12 text-right">សរុប</span>
                    </div>

                    {/* Items List */}
                    <div className="text-xs space-y-1.5 mb-4 pb-3 border-b border-dashed border-slate-300">
                        {order.items && order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                                <span className="w-5/12 truncate pr-1">{item.name}</span>
                                <span className="w-2/12 text-center">{item.quantity}</span>
                                <span className="w-2/12 text-right">${Number(item.price).toFixed(2)}</span>
                                <span className="w-3/12 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Totals Summary */}
                    <div className="text-xs space-y-1.5 mb-6 pb-4 border-b border-dashed border-slate-300">
                        <div className="flex justify-between text-slate-600">
                            <span>តម្លៃសរុប (Subtotal):</span>
                            <span>${Number(order.subtotal || order.total).toFixed(2)}</span>
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

                    {/* Footer Thank You */}
                    <div className="text-center text-xs space-y-1 text-slate-500 pt-2">
                        <p className="font-bold text-slate-700">អរគុណសម្រាប់ការអុញទិញ!</p>
                        <p className="text-[10px]">សូមអញ្ជើញមកម្តងទៀត 🙏</p>
                    </div>
                </div>

            </div>
        </div>
    );
}