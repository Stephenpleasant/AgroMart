import React, { useState, useEffect } from 'react';
import {Search, Bell, User, Shield, ArrowRight, CreditCard, Menu, X} from 'lucide-react';
import BuyerNavbar from '../components/buyer-navbar';

const Account = () => {
    // Define BASE_URL at the top
    const BASE_URL = 'https://agromart-4tnl.onrender.com';
    
    const username = "John Doe"; 
    const [availableBalance, setAvailableBalance] = useState(0.00);
    const [escrowBalance, setEscrowBalance] = useState(0.00);
    const [transferAmount, setTransferAmount] = useState('');
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        // Check authentication first
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please login first.');
            setLoading(false);
            setIsAuthenticated(false);
            return;
        }
        
        setIsAuthenticated(true);
        fetchUserData();
        fetchTransactions();
        
        // Check if there's a payment reference in the URL (for redirect flow)
        const urlParams = new URLSearchParams(window.location.search);
        const reference = urlParams.get('reference');
        const status = urlParams.get('status');
        
        if (reference && status === 'success') {
            // Verify the payment
            verifyPayment(reference);
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (reference && status === 'cancelled') {
            alert('Payment was cancelled');
            setIsProcessing(false);
        }
    }, []);

    // API INTEGRATION POINT 1: Fetch user wallet data from your backend
    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            console.log('Auth token:', token ? 'Found' : 'Not found');
            
            if (!token) {
                throw new Error('No authentication token found. Please login first.');
            }

            // Using your exact API endpoint
            const apiUrl = `${BASE_URL}/api/buyer/wallet`;
            console.log('Fetching wallet data from:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error response body:', errorText);
                
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    throw new Error('Session expired. Please login again.');
                }
                if (response.status === 404) {
                    throw new Error('Wallet endpoint not found. Please check with backend team.');
                }
                if (response.status === 403) {
                    throw new Error('Access denied. Please check your permissions.');
                }
                if (response.status === 500) {
                    throw new Error('Server error. Please try again later.');
                }
                
                throw new Error(`HTTP ${response.status}: ${errorText || 'Unknown error'}`);
            }
            
            const data = await response.json();
            console.log('Raw wallet data received:', data);
            
            // Handle different possible response structures
            let walletBalance = 0;
            let escrowAmount = 0;
            
            // Try different possible response structures from your backend
            if (typeof data === 'object') {
                // Case 1: Direct properties
                walletBalance = data.availableBalance || data.Balance || data.wallet_balance || 0;
                escrowAmount = data.escrowBalance || data.escrow || data.escrow_balance || 0;
                
                // Case 2: Nested in data property
                if (data.data) {
                    walletBalance = data.data.availableBalance || data.data.balance || data.data.wallet_balance || 0;
                    escrowAmount = data.data.escrowBalance || data.data.escrow || data.data.escrow_balance || 0;
                }
                
                // Case 3: Nested in wallet property
                if (data.wallet) {
                    walletBalance = data.wallet.availableBalance || data.wallet.balance || 0;
                    escrowAmount = data.wallet.escrowBalance || data.wallet.escrow || 0;
                }
            }
            
            console.log('Processed balances - Available:', walletBalance, 'Escrow:', escrowAmount);
            
            // Update state with processed values
            setAvailableBalance(Number(walletBalance) || 0);
            setEscrowBalance(Number(escrowAmount) || 0);
            
        } catch (error) {
            console.error('Detailed error fetching wallet data:', error);
            
            // More specific error messages
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                setError('Network error. Please check your internet connection.');
            } else if (error.message.includes('CORS')) {
                setError('CORS error. Please contact the development team.');
            } else {
                setError(error.message || 'Failed to load wallet data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // API INTEGRATION POINT 2: Fetch transaction history
    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BASE_URL}/api/buyer/wallet`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setTransactions(data.transactions || data || []);
            } else {
                console.warn('Failed to fetch transactions:', response.status);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    // API INTEGRATION POINT 3: Initialize Paystack payment
    const handlePaystackPayment = async () => {
        const amount = parseFloat(transferAmount);
        if (amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        setIsProcessing(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            // Step 1: Initialize payment with your backend
            const response = await fetch(`${BASE_URL}/api/payment/deposit/init/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount 
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to initialize payment: ${response.status}`);
            }

            const paymentData = await response.json();
            console.log('Payment initialization response:', paymentData);
            
            // Step 2: Redirect to Paystack payment page
            if (paymentData.authorizationUrl || paymentData.data?.authorizationUrl) {
                const authUrl = paymentData.authorizationUrl || paymentData.data.authorizationUrl;
                window.location.href = authUrl;
            } else {
                throw new Error('No authorization URL received from backend');
            }

        } catch (error) {
            console.error('Error initializing payment:', error);
            setIsProcessing(false);
            alert(`Failed to initialize payment: ${error.message}`);
        }
    };

    // API INTEGRATION POINT 4: Verify payment after successful Paystack transaction
    const verifyPayment = async (reference) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/payment/verify`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reference: reference
                })
            });
            if (!response.ok) {
                throw new Error('Payment verification failed');
            }

            const verificationData = await response.json();
            
            if (verificationData.status === 'success' || verificationData.data?.status === 'success') {
                // Refresh wallet data from backend
                await fetchUserData();
                await fetchTransactions();
                
                // Reset form
                setTransferAmount('');
                setShowTransferModal(false);
                
                alert('Payment successful! Funds are now held in escrow.');
            } else {
                throw new Error('Payment verification failed');
            }
            
        } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Payment verification failed. Please contact support.');
        } finally {
            setIsProcessing(false);
        }
    };

    // API INTEGRATION POINT 5: Release escrow funds (called when goods are delivered)
    const handleReleaseEscrow = async (transactionId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/escrow/release/${transactionId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    confirmDelivery: true,
                    rating: 5,
                    feedback: 'Product delivered as expected'
                })
            });

            if (response.ok) {
                // Refresh data from backend
                await fetchUserData();
                await fetchTransactions();
                
                alert('Escrow funds released to seller successfully!');
            } else {
                throw new Error('Failed to release escrow');
            }
        } catch (error) {
            console.error('Error releasing escrow:', error);
            alert('Failed to release escrow funds. Please try again.');
        }
    };

    // API INTEGRATION POINT 6: Handle dispute/refund
    const handleDisputeRefund = async (transactionId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/escrow/dispute/${transactionId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reason: 'Product not delivered',
                    description: 'Detailed description of the issue'
                })
            });

            if (response.ok) {
                // Refresh data from backend
                await fetchUserData();
                await fetchTransactions();
                
                alert('Dispute initiated successfully!');
            } else {
                throw new Error('Failed to initiate dispute');
            }
        } catch (error) {
            console.error('Error processing refund:', error);
            alert('Failed to initiate dispute. Please try again.');
        }
    };

    // Handle retry for failed data fetch
    const handleRetry = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please login first to access your wallet.');
            return;
        }
        fetchUserData();
        fetchTransactions();
    };

    // Redirect to login function
    const redirectToLogin = () => {
        // Replace with your actual login route
        window.location.href = '/login';
        // Or if using React Router: navigate('/login');
    };

    // Filter transactions based on active tab
    const filteredTransactions = transactions.filter(transaction => {
        if (activeTab === 'escrow') {
            return transaction.status === 'PENDING';
        }
        return true; // Show all for 'all' tab
    });

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex">
                <div className="hidden lg:block">
                    <BuyerNavbar />
                </div>
                <div className="flex-1 lg:ml-64 p-4 lg:p-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading wallet data...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state - Enhanced for authentication issues
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex">
                <div className="hidden lg:block">
                    <BuyerNavbar />
                </div>
                <div className="flex-1 lg:ml-64 p-4 lg:p-8 flex items-center justify-center">
                    <div className="text-center px-4">
                        <div className="text-red-600 mb-4">
                            <p className="text-lg font-medium">Error Loading Wallet</p>
                            <p className="text-sm">{error}</p>
                        </div>
                        <div className="space-x-3">
                            {!isAuthenticated ? (
                                <button 
                                    onClick={redirectToLogin}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Go to Login
                                </button>
                            ) : (
                                <button 
                                    onClick={handleRetry}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Retry
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return ( 
        <div className="min-h-screen bg-gray-100 flex">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <BuyerNavbar />
            </div>

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
                    <div className="w-64 h-full bg-white">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="font-bold text-gray-900">Menu</h2>
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <BuyerNavbar />
                    </div>
                </div>
            )}

            {/* Main Content - Responsive layout */}
            <div className="flex-1 lg:ml-64 w-full">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white shadow-sm border-b p-4 flex items-center justify-between">
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">My Wallets</h1>
                    <div className="flex items-center space-x-2">
                        <Bell size={18} className="text-gray-500" />
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                            <User size={14} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="p-4 lg:p-8">
                    {/* Desktop Header */}
                    <div className="hidden lg:flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">My Wallets</h1>
                        <div className="flex items-center space-x-4">
                            <Bell size={20} className="text-gray-500" />
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                    <User size={16} className="text-white" />
                                </div>
                                <span className="text-sm font-medium">{username}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-8">
                        {/* Balance and Escrow Cards */}
                        <div className="xl:col-span-1 space-y-4 lg:space-y-6">
                            {/* Virtual Card - Balance Display */}
                            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 lg:p-6 text-white">
                                <div className="flex justify-between items-start mb-6 lg:mb-8">
                                    <div>
                                        <span className="text-gray-300 text-sm">AgroMart</span>
                                        <p className="text-xs text-gray-400">Digital Wallet</p>
                                    </div>
                                    <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-red-500 rounded"></div>
                                </div>
                                
                                <div className="mb-4 lg:mb-6">
                                    <div className="text-2xl lg:text-3xl font-mono tracking-wider">
                                        ₦{availableBalance.toFixed(2)}
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">Available Balance</p>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-400">Secure Payment</p>
                                    </div>
                                    <div className="flex items-center">
                                       <button 
                                            onClick={() => setShowTransferModal(true)}
                                            disabled={isProcessing}
                                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1.5 text-xs lg:text-sm rounded-lg flex items-center space-x-1 lg:space-x-2 transition-colors"
                                        >
                                            <span>{isProcessing ? 'Processing...' : 'Make Payment'}</span>
                                            <ArrowRight size={12} className="lg:w-4 lg:h-4" />
                                       </button>
                                    </div>
                                </div>
                            </div>

                            {/* Escrow Account */}
                            <div className="bg-white rounded-lg p-4 lg:p-6 border-2 border-blue-200">
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <Shield size={18} className="text-blue-600 mr-2 lg:w-5 lg:h-5" />
                                        <p className="text-blue-600 text-sm font-medium">Escrow Account</p>
                                    </div>
                                    <div className="text-2xl lg:text-3xl font-bold mb-2 text-blue-600">₦{escrowBalance.toFixed(2)}</div>
                                    <p className="text-gray-500 text-xs mb-4">Funds held for pending purchases</p>
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-gray-500 text-sm">Status</p>
                                        <p className="font-medium text-blue-600">Secure Hold</p>
                                        <p className="text-blue-500 text-sm">Released when goods delivered</p>
                                    </div>
                                    {escrowBalance > 0 && (
                                        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                                            <p className="text-xs text-blue-600">
                                                Pending: {transactions.filter(t => t.status === 'PENDING').length} transaction(s) awaiting delivery confirmation
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payments Section */}
                        <div className="xl:col-span-2">
                            <div className="bg-white rounded-lg p-4 lg:p-6">
                                {/* Header - Responsive */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                                    <h2 className="text-lg lg:text-xl font-bold">My Payments</h2>
                                    <div className="relative">
                                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 lg:w-4 lg:h-4" />
                                        <input 
                                            type="text" 
                                            placeholder="Search" 
                                            className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Tabs - Responsive */}
                                <div className="flex space-x-4 lg:space-x-8 mb-6 border-b overflow-x-auto">
                                    <button 
                                        onClick={() => setActiveTab('all')}
                                        className={`pb-2 font-medium whitespace-nowrap text-sm lg:text-base ${
                                            activeTab === 'all' 
                                                ? 'text-green-600 border-b-2 border-green-600' 
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        All Payments
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('escrow')}
                                        className={`pb-2 font-medium whitespace-nowrap text-sm lg:text-base ${
                                            activeTab === 'escrow' 
                                                ? 'text-green-600 border-b-2 border-green-600' 
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Escrow Payments
                                    </button>
                                </div>

                                {/* Transactions List - Mobile Optimized */}
                                {filteredTransactions.length > 0 ? (
                                    <div className="space-y-3 lg:space-y-4">
                                        {filteredTransactions.map((transaction) => (
                                            <div key={transaction.id || transaction._id} className="border border-gray-200 rounded-lg p-4">
                                                {/* Mobile Layout */}
                                                <div className="lg:hidden">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="font-medium text-lg">₦{(transaction.amount || 0).toFixed(2)}</p>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                                            transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                            transaction.status === 'REFUNDED' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {transaction.status || 'UNKNOWN'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-1">{transaction.description || 'Transaction'}</p>
                                                    <p className="text-xs text-gray-400 mb-2">{new Date(transaction.date || transaction.createdAt).toLocaleDateString()}</p>
                                                    {transaction.reference && (
                                                        <p className="text-xs text-gray-400 mb-2">Ref: {transaction.reference}</p>
                                                    )}
                                                    {transaction.status === 'PENDING' && (
                                                        <div className="flex flex-col sm:flex-row gap-2">
                                                            <button 
                                                                onClick={() => handleReleaseEscrow(transaction.id || transaction._id)}
                                                                className="flex-1 text-xs bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                                                            >
                                                                Confirm Delivery
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDisputeRefund(transaction.id || transaction._id)}
                                                                className="flex-1 text-xs bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                                                            >
                                                                Dispute
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Desktop Layout */}
                                                <div className="hidden lg:flex lg:items-center lg:justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-medium">₦{(transaction.amount || 0).toFixed(2)}</p>
                                                        <p className="text-sm text-gray-500">{transaction.description || 'Transaction'}</p>
                                                        <p className="text-xs text-gray-400">{new Date(transaction.date || transaction.createdAt).toLocaleDateString()}</p>
                                                        {transaction.reference && (
                                                            <p className="text-xs text-gray-400">Ref: {transaction.reference}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                                            transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                            transaction.status === 'REFUNDED' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {transaction.status || 'UNKNOWN'}
                                                        </span>
                                                        {transaction.status === 'PENDING' && (
                                                            <div className="mt-2 space-x-2">
                                                                <button 
                                                                    onClick={() => handleReleaseEscrow(transaction.id || transaction._id)}
                                                                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                                                >
                                                                    Confirm Delivery
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDisputeRefund(transaction.id || transaction._id)}
                                                                    className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                                                >
                                                                    Dispute
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 lg:py-12">
                                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CreditCard size={20} className="text-gray-400 lg:w-6 lg:h-6" />
                                        </div>
                                        <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                                        <p className="text-gray-500 text-sm px-4">Your payment history will appear here once you start making transactions.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal - Responsive */}
            {showTransferModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-md max-h-screen overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">Make Payment via Paystack</h3>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-4">Current Escrow: ₦{escrowBalance.toFixed(2)}</p>
                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                <p className="text-xs text-blue-700 mb-1 font-medium">











                                   <Shield size={14} className="inline mr-1" />
                                    Secure Escrow Payment:
                                </p>
                                <p className="text-xs sm:text-sm text-blue-600 leading-relaxed">
                                    Payment via Paystack → Funds held in escrow → Seller ships goods → You confirm delivery → Funds released to seller
                                </p>
                            </div>
                            <input
                                type="number"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                placeholder="Enter payment amount (₦)"
                                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                                step="0.01"
                                min="1"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={() => setShowTransferModal(false)}
                                disabled={isProcessing}
                                className="w-full sm:flex-1 px-4 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePaystackPayment}
                                disabled={!transferAmount || parseFloat(transferAmount) <= 0 || isProcessing}
                                className="w-full sm:flex-1 px-4 py-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                {isProcessing ? 'Processing...' : 'Proceed to Paystack'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default Account;