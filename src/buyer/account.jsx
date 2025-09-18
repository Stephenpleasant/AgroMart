import React, { useState, useEffect } from 'react';
import {Search, Bell, User, Shield, ArrowRight, CreditCard} from 'lucide-react';
import BuyerNavbar from '../components/buyer-navbar';

const Account = () => {
    const username = "John Doe"; 
    const [availableBalance, setAvailableBalance] = useState(52.00);
    const [escrowBalance, setEscrowBalance] = useState(0.00);
    const [transferAmount, setTransferAmount] = useState('');
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactions, setTransactions] = useState([]);

    // TODO: Replace with actual API call to fetch user data on component mount
    useEffect(() => {
        fetchUserData();
        fetchTransactions();
    }, []);

    // API INTEGRATION POINT 1: Fetch user balance data
    const fetchUserData = async () => {
        try {
            // TODO: Replace with your actual API endpoint
            /*
            const response = await fetch('/api/user/wallet-data', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setAvailableBalance(data.availableBalance);
            setEscrowBalance(data.escrowBalance);
            */
        } catch (error) {
            console.error('Error fetching user data:', error);
            // TODO: Add error handling UI
        }
    };

    // API INTEGRATION POINT 2: Fetch transaction history
    const fetchTransactions = async () => {
        try {
            // TODO: Replace with your actual API endpoint
            /*
            const response = await fetch('/api/user/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setTransactions(data.transactions);
            */
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    // API INTEGRATION POINT 3: Initialize Paystack payment and create escrow transaction
    const handlePaystackPayment = async () => {
        const amount = parseFloat(transferAmount);
        if (amount > 0) {
            setIsProcessing(true);
            try {
                // TODO: Replace with your backend API endpoint to initialize Paystack payment
                /*
                // Step 1: Create escrow transaction in your backend
                const escrowResponse = await fetch('/api/payment/initialize-escrow-payment', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: amount * 100, // Paystack expects amount in kobo
                        currency: 'NGN',
                        email: 'user@example.com', // Replace with actual user email
                        transactionType: 'ESCROW_HOLD',
                        productId: 'PRODUCT_ID_HERE', // Add actual product ID
                        sellerId: 'SELLER_ID_HERE', // Add actual seller ID
                        metadata: {
                            productDetails: 'Product details here',
                            deliveryAddress: 'User delivery address'
                        }
                    })
                });

                if (escrowResponse.ok) {
                    const escrowData = await escrowResponse.json();
                    
                    // Step 2: Initialize Paystack payment with the reference from backend
                    const paystackHandler = window.PaystackPop.setup({
                        key: 'YOUR_PAYSTACK_PUBLIC_KEY', // Replace with your public key
                        email: 'user@example.com', // Replace with actual user email
                        amount: amount * 100, // Amount in kobo
                        currency: 'NGN',
                        ref: escrowData.reference, // Use reference from backend
                        callback: function(response) {
                            // Step 3: Verify payment and update escrow status
                            verifyPaymentAndUpdateEscrow(response.reference, amount);
                        },
                        onClose: function() {
                            console.log('Payment window closed');
                            setIsProcessing(false);
                        }
                    });
                    
                    paystackHandler.openIframe();
                } else {
                    throw new Error('Failed to initialize escrow transaction');
                }
                */
                
                // TEMPORARY: For demo purposes only - remove this in production
                // Simulate payment success
                setTimeout(() => {
                    setEscrowBalance(prev => prev + amount);
                    const newTransaction = {
                        id: Date.now(),
                        amount: amount,
                        type: 'ESCROW_HOLD',
                        status: 'PENDING',
                        date: new Date().toISOString(),
                        description: 'Payment held in escrow via Paystack'
                    };
                    setTransactions(prev => [newTransaction, ...prev]);
                    setTransferAmount('');
                    setShowTransferModal(false);
                    setIsProcessing(false);
                }, 2000);
                
            } catch (error) {
                console.error('Error processing payment:', error);
                setIsProcessing(false);
                // TODO: Show error message to user
            }
        }
    };

    // API INTEGRATION POINT 4: Verify payment and update escrow
    const verifyPaymentAndUpdateEscrow = async (reference, amount) => {
        try {
            // TODO: Replace with your backend API endpoint to verify payment
            /*
            const verifyResponse = await fetch('/api/payment/verify-paystack-payment', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reference: reference
                })
            });

            if (verifyResponse.ok) {
                const verificationData = await verifyResponse.json();
                
                if (verificationData.status === 'success') {
                    // Update local state
                    setEscrowBalance(prev => prev + amount);
                    
                    // Add transaction to history
                    const newTransaction = {
                        id: verificationData.transactionId,
                        amount: amount,
                        type: 'ESCROW_HOLD',
                        status: 'PENDING',
                        date: new Date().toISOString(),
                        description: 'Payment held in escrow via Paystack',
                        reference: reference
                    };
                    setTransactions(prev => [newTransaction, ...prev]);
                    
                    setTransferAmount('');
                    setShowTransferModal(false);
                    
                    // TODO: Show success message
                    alert('Payment successful! Funds are now held in escrow.');
                } else {
                    throw new Error('Payment verification failed');
                }
            } else {
                throw new Error('Failed to verify payment');
            }
            */
        } catch (error) {
            console.error('Error verifying payment:', error);
            // TODO: Show error message to user
        } finally {
            setIsProcessing(false);
        }
    };

    // API INTEGRATION POINT 5: Release escrow funds (called when goods are delivered)
    const handleReleaseEscrow = async (transactionId) => {
        try {
            // TODO: Replace with your actual API endpoint
            /*
            const response = await fetch(`/api/payment/release-escrow/${transactionId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    confirmDelivery: true,
                    rating: 5, // Optional: product/seller rating
                    feedback: 'Product delivered as expected' // Optional
                })
            });

            if (response.ok) {
                // Update transaction status and escrow balance
                const updatedTransaction = await response.json();
                setTransactions(prev => 
                    prev.map(t => t.id === transactionId ? updatedTransaction : t)
                );
                setEscrowBalance(prev => prev - updatedTransaction.amount);
                
                // TODO: Show success message
                alert('Escrow funds released to seller successfully!');
            }
            */
        } catch (error) {
            console.error('Error releasing escrow:', error);
        }
    };

    // API INTEGRATION POINT 6: Handle dispute/refund (if delivery is not confirmed)
    const handleDisputeRefund = async (transactionId) => {
        try {
            // TODO: Replace with your actual API endpoint
            /*
            const response = await fetch(`/api/payment/dispute-refund/${transactionId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reason: 'Product not delivered',
                    description: 'Detailed description of the issue'
                })
            });

            if (response.ok) {
                const refundData = await response.json();
                // Update transaction status
                setTransactions(prev => 
                    prev.map(t => t.id === transactionId ? {...t, status: 'REFUNDED'} : t)
                );
                setEscrowBalance(prev => prev - refundData.amount);
                
                // TODO: Show success message
                alert('Refund initiated successfully!');
            }
            */
        } catch (error) {
            console.error('Error processing refund:', error);
        }
    };

   
    return ( 
        <div className="min-h-screen bg-gray-100 flex">
            <BuyerNavbar />

            {/* Main Content - Shifted to avoid navbar overlap */}
            <div className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Balance and Escrow */}
                    <div className="lg:col-span-1">
                        {/* Virtual Card - Balance Display */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white mb-6">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="text-gray-300 text-sm">AgroMart</span>
                                    <p className="text-xs text-gray-400">Digital Wallet</p>
                                </div>
                                <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-red-500 rounded"></div>
                            </div>
                            
                            <div className="mb-6">
                                <div className="text-3xl font-mono tracking-wider">
                                    #{availableBalance.toFixed(2)}
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
                                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1.5 text-sm rounded-lg flex items-center space-x-2 transition-colors"
                                    >
                                        <span>{isProcessing ? 'Processing...' : 'Make Payment'}</span>
                                        <ArrowRight size={14} />
                                   </button>
                                </div>
                            </div>
                        </div>

                        {/* Escrow Account */}
                        <div className="bg-white rounded-lg p-6 mb-6 border-2 border-blue-200">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <Shield size={20} className="text-blue-600 mr-2" />
                                    <p className="text-blue-600 text-sm font-medium">Escrow Account</p>
                                </div>
                                <div className="text-3xl font-bold mb-2 text-blue-600">#{escrowBalance.toFixed(2)}</div>
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

                    {/* Right Column - Payments */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">My Payments</h2>
                                <div className="relative">
                                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search" 
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                                    />
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex space-x-8 mb-6 border-b">
                                <button className="pb-2 text-green-600 border-b-2 border-green-600 font-medium">
                                    All Payments
                                </button>
                                <button className="pb-2 text-gray-500 hover:text-gray-700">
                                    Escrow Payments
                                </button>
                            </div>

                            {/* Transactions List */}
                            {transactions.length > 0 ? (
                                <div className="space-y-4">
                                    {transactions.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium">#{transaction.amount.toFixed(2)}</p>
                                                <p className="text-sm text-gray-500">{transaction.description}</p>
                                                <p className="text-xs text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
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
                                                    {transaction.status}
                                                </span>
                                                {transaction.status === 'PENDING' && (
                                                    <div className="mt-2 space-x-2">
                                                        <button 
                                                            onClick={() => handleReleaseEscrow(transaction.id)}
                                                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                                        >
                                                            Confirm Delivery
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDisputeRefund(transaction.id)}
                                                            className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                                        >
                                                            Dispute
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CreditCard size={24} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                                    <p className="text-gray-500 text-sm">Your payment history will appear here once you start making transactions.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal - Updated for Paystack */}
            {showTransferModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-bold mb-4">Make Payment via Paystack</h3>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-4">Current Escrow: #{escrowBalance.toFixed(2)}</p>
                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                <p className="text-xs text-blue-700 mb-2">
                                    <Shield size={14} className="inline mr-1" />
                                    Secure Escrow Payment:
                                </p>
                                <p className="text-xs text-blue-600">
                                    Payment via Paystack → Funds held in escrow → Seller ships goods → You confirm delivery → Funds released to seller
                                </p>
                            </div>
                            <input
                                type="number"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                placeholder="Enter payment amount (NGN)"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                step="0.01"
                                min="1"
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowTransferModal(false)}
                                disabled={isProcessing}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePaystackPayment}
                                disabled={!transferAmount || parseFloat(transferAmount) <= 0 || isProcessing}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
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