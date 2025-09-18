import React, { useState } from 'react';

const Settings = () => {
    // State for toggleable settings
    const [notifications, setNotifications] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);
    const [biometric, setBiometric] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    
    // State for modals
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logging out...");
        setShowLogoutModal(false);
    };

    const handleDeleteAccount = () => {
        // Add your delete account logic here
        console.log("Deleting account...");
        setShowDeleteModal(false);
    };

    return ( 
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your account preferences and security settings</p>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                    JD
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">John Doe</h3>
                                    <p className="text-gray-600">john.doe@example.com</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Security</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b">
                            <div>
                                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                            </div>
                            <button
                                onClick={() => setTwoFactor(!twoFactor)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    twoFactor ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        twoFactor ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b">
                            <div>
                                <h3 className="font-medium text-gray-900">Biometric Login</h3>
                                <p className="text-sm text-gray-600">Use fingerprint or face recognition</p>
                            </div>
                            <button
                                onClick={() => setBiometric(!biometric)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    biometric ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        biometric ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="pt-3">
                            <button className="text-blue-600 hover:text-blue-800 font-medium">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b">
                            <div>
                                <h3 className="font-medium text-gray-900">Push Notifications</h3>
                                <p className="text-sm text-gray-600">Receive notifications on your device</p>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    notifications ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        notifications ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <h3 className="font-medium text-gray-900">Email Updates</h3>
                                <p className="text-sm text-gray-600">Receive account updates via email</p>
                            </div>
                            <button
                                onClick={() => setEmailUpdates(!emailUpdates)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    emailUpdates ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        emailUpdates ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b">
                            <div>
                                <h3 className="font-medium text-gray-900">Dark Mode</h3>
                                <p className="text-sm text-gray-600">Use dark theme across the app</p>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    darkMode ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        darkMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="pt-3">
                            <button className="text-blue-600 hover:text-blue-800 font-medium">
                                Language & Region
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
                    <div className="space-y-4">
                        <button 
                            onClick={() => setShowLogoutModal(true)}
                            className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-medium text-gray-900">Log Out</span>
                        </button>

                        <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center space-x-3"
                        >
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="font-medium text-red-600">Delete Account</span>
                        </button>
                    </div>
                </div>

                {/* Logout Confirmation Modal */}
                {showLogoutModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Logout</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to log out of your account?</p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Account Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                            <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Account</h3>
                            <p className="text-gray-600 mb-6">
                                This action cannot be undone. All your data will be permanently deleted.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default Settings;