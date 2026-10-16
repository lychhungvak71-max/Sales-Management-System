import React, { useState } from 'react';
import { User, KeyRound } from 'lucide-react';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Tab Header Navigation */}
            <div className="flex border-b border-gray-200 bg-white px-6 pt-4 rounded-t-2xl shadow-sm">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-2 pb-4 px-4 font-semibold text-sm transition border-b-2 ${activeTab === 'profile'
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                >
                    <User className="w-4 h-4" />
                    <span>កែប្រែព័ត៌មានផ្ទាល់ខ្លួន</span>
                </button>

                <button
                    onClick={() => setActiveTab('password')}
                    className={`flex items-center gap-2 pb-4 px-4 font-semibold text-sm transition border-b-2 ${activeTab === 'password'
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                >
                    <KeyRound className="w-4 h-4" />
                    <span>ផ្លាស់ប្តូរលេខសម្ងាត់</span>
                </button>
            </div>

            {/* Tab Body Content */}
            <div>
                {activeTab === 'profile' && <EditProfile />}
                {activeTab === 'password' && <ChangePassword />}
            </div>
        </div>
    );
}