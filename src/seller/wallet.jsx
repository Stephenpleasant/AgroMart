import React, { useState, useEffect } from 'react';
import {Search, Bell, User, Shield, ArrowRight, CreditCard, DollarSign, Banknote} from 'lucide-react';
import SellersNavbar from '../components/sellers-navbar';

const SellerWallet = () => {
    // Define BASE_URL at the top
    const BASE_URL = 'https://agromart-4tnl.onrender.com';
    
    const username = "Williams Great"; // Replace with actual user data fetching logic
    const [availableBalance, setAvailableBalance] = useState(0.00);
    const [escrowBalance, setEscrowBalance] = useState(0.00);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [bankDetails, setBankDetails] = useState({
        accountName: '',
        accountNumber: '',
        bankName: '',
        bankCode: ''
    });

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
        fetchSellerWalletData();
        fetchSellerTransactions();
        fetchBankDetails();
    }, []);

    // API INTEGRATION POINT 1: Fetch seller wallet data from your backend
    const fetchSellerWalletData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found. Please login first.');
            }

            // Using seller-specific API endpoint
            const apiUrl = `${BASE_URL}/api/seller/wallet`;
            console.log('Fetching seller wallet data from:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error response body:', errorText);
                
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    throw new Error('Session expired. Please login again.');
                }
                if (response.status === 404) {
                    throw new Error('Seller wallet endpoint not found. Please check with backend team.');
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
            console.log('Raw seller wallet data received:', data);
            
            // Handle different possible response structures for seller wallet
            let walletBalance = 0;
            let escrowAmount = 0;
            
            if (typeof data === 'object') {
                // Case 1: Direct properties
                walletBalance = data.availableBalance || data.balance || data.wallet_balance || 0;
                escrowAmount = data.escrowBalance || data.pendingBalance || data.escrow_balance || 0;
                
                // Case 2: Nested in data property
                if (data.data) {
                    walletBalance = data.data.availableBalance || data.data.balance || data.data.wallet_balance || 0;
                    escrowAmount = data.data.escrowBalance || data.data.pendingBalance || data.data.escrow_balance || 0;
                }
                
                // Case 3: Nested in wallet property
                if (data.wallet) {
                    walletBalance = data.wallet.availableBalance || data.wallet.balance || 0;
                    escrowAmount = data.wallet.escrowBalance || data.wallet.pendingBalance || 0;
                }
            }
            
            console.log('Processed seller balances - Available:', walletBalance, 'Escrow/Pending:', escrowAmount);
            
            // Update state with processed values
            setAvailableBalance(Number(walletBalance) || 0);
            setEscrowBalance(Number(escrowAmount) || 0);
            
        } catch (error) {
            console.error('Detailed error fetching seller wallet data:', error);
            
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

    // API INTEGRATION POINT 2: Fetch seller transaction history
    const fetchSellerTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BASE_URL}/api/seller/wallet`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const transactionData = data.transactions || data.data || data || [];
                setTransactions(Array.isArray(transactionData) ? transactionData : []);
                console.log('Seller transactions loaded:', transactionData);
            } else {
                console.warn('Failed to fetch seller transactions:', response.status);
                setTransactions([]);
            }
        } catch (error) {
            console.error('Error fetching seller transactions:', error);
            setTransactions([]);
        }
    };

    // API INTEGRATION POINT 3: Fetch bank details
    const fetchBankDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${BASE_URL}/api/seller/bank-details`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setBankDetails(data.bankDetails || data || {
                    accountName: '',
                    accountNumber: '',
                    bankName: '',
                    bankCode: ''
                });
            }
        } catch (error) {
            console.error('Error fetching bank details:', error);
        }
    };

    // API INTEGRATION POINT 4: Handle withdrawal request
    const handleWithdrawal = async () => {
        const amount = parseFloat(withdrawAmount);
        if (amount <= 0) {
            alert('Please enter a valid withdrawal amount');
            return;
        }

        if (amount > availableBalance) {
            alert('Insufficient balance for withdrawal');
            return;
        }

        // Check if bank details are complete
        if (!bankDetails.accountNumber || !bankDetails.bankName) {
            alert('Please update your bank details in settings before withdrawing');
            return;
        }

        setIsProcessing(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${BASE_URL}/api/seller/withdraw`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount,
                    accountNumber: bankDetails.accountNumber,
                    bankCode: bankDetails.bankCode,
                    accountName: bankDetails.accountName,
                    bankName: bankDetails.bankName
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Withdrawal failed: ${response.status} - ${errorData}`);
            }

            const withdrawalData = await response.json();
            console.log('Withdrawal response:', withdrawalData);
            
            // Refresh wallet data
            await fetchSellerWalletData();
            await fetchSellerTransactions();
            
            // Reset form and close modal
            setWithdrawAmount('');
            setShowWithdrawModal(false);
            
            alert(`Withdrawal request successful! ₦${amount.toFixed(2)} will be transferred to your bank account.`);

        } catch (error) {
            console.error('Error processing withdrawal:', error);
            alert(`Withdrawal failed: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle retry for failed data fetch
    const handleRetry = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please login first to access your wallet.');
            return;
        }
        fetchSellerWalletData();
        fetchSellerTransactions();
    };

    // Redirect to login function
    const redirectToLogin = () => {
        window.location.href = '/login';
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex">
                <SellersNavbar />
                <div className="flex-1 ml-64 p-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading seller wallet data...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex">
                <SellersNavbar />
                <div className="flex-1 ml-64 p-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-600 mb-4">
                            <p className="text-lg font-medium">Error Loading Seller Wallet</p>
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
            <SellersNavbar />

            {/* Main Content - Shifted to avoid navbar overlap */}
            <div className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Seller Wallet</h1>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Balance and Pending Sales */}
                    <div className="lg:col-span-1">
                        {/* Virtual Card - Available Balance */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white mb-6">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="text-green-100 text-sm">AgroMart Seller</span>
                                    <p className="text-xs text-green-200">Available Balance</p>
                                </div>
                                <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"></div>
                            </div>
                            
                            <div className="mb-6">
                                <div className="text-3xl font-mono tracking-wider">
                                    ₦{availableBalance.toFixed(2)}
                                </div>
                                <p className="text-green-200 text-sm mt-1">Ready to withdraw</p>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-green-200">Instant Transfer</p>
                                </div>
                                <div className="flex items-center">
                                   <button 
                                        onClick={() => setShowWithdrawModal(true)}
                                        disabled={isProcessing || availableBalance <= 0}
                                        className="bg-white hover:bg-gray-100 disabled:bg-gray-300 text-green-600 px-3 py-1.5 text-sm rounded-lg flex items-center space-x-2 transition-colors font-medium"
                                    >
                                        <Banknote size={14} />
                                        <span>{isProcessing ? 'Processing...' : 'Withdraw'}</span>
                                        <ArrowRight size={14} />
                                   </button>
                                </div>
                            </div>
                        </div>

                        {/* Pending Sales (Escrow) */}
                        <div className="bg-white rounded-lg p-6 mb-6 border-2 border-blue-200">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <Shield size={20} className="text-blue-600 mr-2" />
                                    <p className="text-blue-600 text-sm font-medium">Pending Sales</p>
                                </div>
                                <div className="text-3xl font-bold mb-2 text-blue-600">₦{escrowBalance.toFixed(2)}</div>
                                <p className="text-gray-500 text-xs mb-4">Awaiting buyer confirmation</p>
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-gray-500 text-sm">Status</p>
                                    <p className="font-medium text-blue-600">In Escrow</p>
                                    <p className="text-blue-500 text-sm">Released when buyers confirm delivery</p>
                                </div>
                                {escrowBalance > 0 && (
                                    <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-blue-600">
                                            {transactions.filter(t => t.status === 'PENDING' && t.type === 'SALE').length} sale(s) awaiting confirmation
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bank Details Card */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Withdrawal Account</h3>
                            {bankDetails.accountNumber ? (
                                <div className="text-sm text-gray-600">
                                    <p><strong>{bankDetails.accountName}</strong></p>
                                    <p>{bankDetails.accountNumber}</p>
                                    <p>{bankDetails.bankName}</p>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">
                                    <p>No bank account linked</p>
                                    <button className="text-green-600 hover:text-green-700 mt-1">
                                        Add bank details
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Transaction History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Transaction History</h2>
                                <div className="relative">
                                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search transactions" 
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                                    />
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex space-x-8 mb-6 border-b">
                                <button className="pb-2 text-green-600 border-b-2 border-green-600 font-medium">
                                    All Transactions
                                </button>
                                <button className="pb-2 text-gray-500 hover:text-gray-700">
                                    Sales
                                </button>
                                <button className="pb-2 text-gray-500 hover:text-gray-700">
                                    Withdrawals
                                </button>
                            </div>

                            {/* Transactions List */}
                            {transactions.length > 0 ? (
                                <div className="space-y-4">
                                    {transactions.map((transaction, index) => (
                                        <div key={transaction.id || transaction._id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    transaction.type === 'SALE' ? 'bg-green-100' :
                                                    transaction.type === 'WITHDRAWAL' ? 'bg-blue-100' : 'bg-gray-100'
                                                }`}>
                                                    {transaction.type === 'SALE' ? 
                                                        <DollarSign size={16} className="text-green-600" /> :
                                                        transaction.type === 'WITHDRAWAL' ? 
                                                        <Banknote size={16} className="text-blue-600" /> :
                                                        <CreditCard size={16} className="text-gray-600" />
                                                    }
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">₦{(transaction.amount || 0).toFixed(2)}</p>
                                                    <p className="text-sm text-gray-500">{transaction.description || transaction.type || 'Transaction'}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {transaction.date ? new Date(transaction.date).toLocaleDateString() : 
                                                         transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 
                                                         'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    transaction.status === 'COMPLETED' || transaction.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                                                    transaction.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {transaction.status || 'UNKNOWN'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CreditCard size={24} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                                    <p className="text-gray-500 text-sm">Your sales and withdrawal history will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Withdrawal Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-bold mb-4">Withdraw Funds</h3>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Available Balance: ₦{availableBalance.toFixed(2)}</p>
                            
                            {bankDetails.accountNumber ? (
                                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                    <p className="text-xs text-gray-600 mb-1">Withdrawal Account:</p>
                                    <p className="text-sm font-medium">{bankDetails.accountName}</p>
                                    <p className="text-sm">{bankDetails.accountNumber} - {bankDetails.bankName}</p>
                                </div>
                            ) : (
                                <div className="bg-red-50 p-3 rounded-lg mb-4">
                                    <p className="text-xs text-red-600">Please add your bank details in settings before withdrawing</p>
                                </div>
                            )}
                            
                            <input
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                placeholder="Enter withdrawal amount (₦)"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                step="0.01"
                                min="1"
                                max={availableBalance}
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum withdrawal: ₦100</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowWithdrawModal(false)}
                                disabled={isProcessing}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleWithdrawal}
                                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > availableBalance || isProcessing || !bankDetails.accountNumber}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Processing...' : 'Withdraw'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default SellerWallet;