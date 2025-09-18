import React, { useState, useEffect } from 'react';
import {Plus, Search, Bell, User, TrendingUp, TrendingDown, CreditCard, ArrowRight, Shield, Upload, X} from 'lucide-react';
import SellersNavbar from '../components/sellers-navbar';

const Wallet = () => {
    const username = "John Doe"; 
    const [availableBalance, setAvailableBalance] = useState(52.00);
    const [escrowBalance, setEscrowBalance] = useState(0.00);
    const [transferAmount, setTransferAmount] = useState('');
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [cards, setCards] = useState([
        { id: 1, number: "8595254****", expiry: "09/25", type: "VISA", isDefault: true }
    ]);
    const [cardForm, setCardForm] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: '',
        cardType: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactions, setTransactions] = useState([]);

    // TODO: Replace with actual API call to fetch user data on component mount
    useEffect(() => {
        fetchUserData();
        fetchTransactions();
    }, []);

    // API INTEGRATION POINT 1: Fetch user balance and card data
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
            setCards(data.cards);
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

    // API INTEGRATION POINT 3: Add new card
    const handleAddCard = async () => {
        setIsProcessing(true);
        try {
            // TODO: Replace with your payment processor API (Stripe, PayStack, Flutterwave, etc.)
            /*
            const response = await fetch('/api/payment/add-card', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cardNumber: cardForm.cardNumber,
                    expiryDate: cardForm.expiryDate,
                    cvv: cardForm.cvv,
                    cardHolderName: cardForm.cardHolderName,
                    // Add other required fields based on your payment processor
                })
            });
            
            if (response.ok) {
                const newCard = await response.json();
                setCards(prev => [...prev, newCard]);
                setShowCardModal(false);
                setCardForm({ cardNumber: '', expiryDate: '', cvv: '', cardHolderName: '', cardType: '' });
                // TODO: Show success message
            } else {
                // TODO: Handle API errors
                const errorData = await response.json();
                console.error('Card addition failed:', errorData);
            }
            */
            
            // TEMPORARY: For demo purposes only - remove this in production
            const newCard = {
                id: Date.now(),
                number: cardForm.cardNumber.replace(/\d(?=\d{4})/g, "*"),
                expiry: cardForm.expiryDate,
                type: cardForm.cardType || "VISA",
                isDefault: cards.length === 0
            };
            setCards(prev => [...prev, newCard]);
            setShowCardModal(false);
            setCardForm({ cardNumber: '', expiryDate: '', cvv: '', cardHolderName: '', cardType: '' });
            
        } catch (error) {
            console.error('Error adding card:', error);
            // TODO: Show error message to user
        } finally {
            setIsProcessing(false);
        }
    };

    // API INTEGRATION POINT 4: Process escrow payment
    const handleTransferToEscrow = async () => {
        const amount = parseFloat(transferAmount);
        if (amount > 0 && amount <= availableBalance) {
            setIsProcessing(true);
            try {
                // TODO: Replace with your actual payment processing API
                /*
                const response = await fetch('/api/payment/create-escrow-transaction', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: amount,
                        currency: 'NGN',
                        cardId: cards.find(card => card.isDefault)?.id,
                        transactionType: 'ESCROW_HOLD',
                        // Add product details, seller info, etc.
                    })
                });

                if (response.ok) {
                    const transaction = await response.json();
                    setAvailableBalance(prev => prev - amount);
                    setEscrowBalance(prev => prev + amount);
                    setTransactions(prev => [transaction, ...prev]);
                    setTransferAmount('');
                    setShowTransferModal(false);
                    // TODO: Show success message
                } else {
                    // TODO: Handle payment errors
                    const errorData = await response.json();
                    console.error('Payment failed:', errorData);
                }
                */
                
                // TEMPORARY: For demo purposes only - remove this in production
                setAvailableBalance(prev => prev - amount);
                setEscrowBalance(prev => prev + amount);
                const newTransaction = {
                    id: Date.now(),
                    amount: amount,
                    type: 'ESCROW_HOLD',
                    status: 'PENDING',
                    date: new Date().toISOString(),
                    description: 'Payment held in escrow'
                };
                setTransactions(prev => [newTransaction, ...prev]);
                setTransferAmount('');
                setShowTransferModal(false);
                
            } catch (error) {
                console.error('Error processing payment:', error);
                // TODO: Show error message to user
            } finally {
                setIsProcessing(false);
            }
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
                // TODO: Update escrow balance based on released amount
            }
            */
        } catch (error) {
            console.error('Error releasing escrow:', error);
        }
    };

    // Utility function to detect card type
    const detectCardType = (number) => {
        const patterns = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/,
            discover: /^6(?:011|5)/
        };
        
        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(number)) {
                return type.toUpperCase();
            }
        }
        return 'UNKNOWN';
    };

    // Format card number input
    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        if (value.length <= 16) {
            setCardForm(prev => ({
                ...prev,
                cardNumber: formattedValue,
                cardType: detectCardType(value)
            }));
        }
    };

    // Format expiry date input
    const handleExpiryChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/(\d{2})(\d{2})/, '$1/$2');
        if (value.length <= 4) {
            setCardForm(prev => ({ ...prev, expiryDate: formattedValue }));
        }
    };
    
    return ( 
        <div className="min-h-screen bg-gray-100 flex">
            <SellersNavbar />

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
                    {/* Left Column - Card and Balance */}
                    <div className="lg:col-span-1">
                        {/* Virtual Card */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white mb-6">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="text-gray-300 text-sm">AgroMart</span>
                                    <p className="text-xs text-gray-400">Commercial Bank</p>
                                </div>
                                <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-red-500 rounded"></div>
                            </div>
                            
                            <div className="mb-6">
                                <div className="text-3xl font-mono tracking-wider">
                                    #{availableBalance.toFixed(2)}
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-400">09/25</p>
                                </div>
                                <div className="flex items-center">
                                   <button 
                                        onClick={() => setShowTransferModal(true)}
                                        disabled={isProcessing}
                                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1.5 text-sm rounded-lg flex items-center space-x-2 transition-colors"
                                    >
                                        <span>{isProcessing ? 'Processing...' : 'Deposit'}</span>
                                        <ArrowRight size={14} />
                                   </button>
                                </div>
                            </div>
                        </div>

                        {/* Cards List */}
                        {cards.map((card) => (
                            <div key={card.id} className="bg-white rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">{card.number}</span>
                                    <span className="text-xs text-gray-400">{card.expiry}</span>
                                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                        {card.type}
                                    </div>
                                </div>
                                {card.isDefault && (
                                    <span className="text-xs text-green-600 mt-1 block">Default Card</span>
                                )}
                            </div>
                        ))}

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

                        {/* Add New Card */}
                        <button 
                            onClick={() => setShowCardModal(true)}
                            className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center space-x-2"
                        >
                            <Plus size={18} />
                            <span>Add New Card</span>
                        </button>
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
                                    Regular Payments
                                </button>
                            </div>

                            {/* Transactions List */}
                            {transactions.length > 0 ? (
                                <div className="space-y-4">
                                    {transactions.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium">#{transaction.amount.toFixed(2)}</p>
                                                <p className="text-sm text-gray-500">{transaction.description}</p>
                                                <p className="text-xs text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {transaction.status}
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
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                                    <p className="text-gray-500 text-sm">Your payment history will appear here once you start making transactions.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase Modal */}
            {showTransferModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-bold mb-4">Purchase Products</h3>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Available Balance: #{availableBalance.toFixed(2)}</p>
                            <p className="text-sm text-gray-600 mb-4">Current Escrow: #{escrowBalance.toFixed(2)}</p>
                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                <p className="text-xs text-blue-700 mb-2">
                                    <Shield size={14} className="inline mr-1" />
                                    How Escrow Works:
                                </p>
                                <p className="text-xs text-blue-600">
                                    Payment goes to escrow → Seller ships goods → You confirm delivery → Funds released to seller
                                </p>
                            </div>
                            <input
                                type="number"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                placeholder="Enter purchase amount"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                step="0.01"
                                max={availableBalance}
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
                                onClick={handleTransferToEscrow}
                                disabled={!transferAmount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > availableBalance || isProcessing}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Processing...' : 'Pay via Escrow'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Card Modal */}
            {showCardModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Add New Card</h3>
                            <button 
                                onClick={() => setShowCardModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    value={cardForm.cardNumber}
                                    onChange={handleCardNumberChange}
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                                {cardForm.cardType && (
                                    <p className="text-xs text-gray-500 mt-1">Detected: {cardForm.cardType}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Card Holder Name
                                </label>
                                <input
                                    type="text"
                                    value={cardForm.cardHolderName}
                                    onChange={(e) => setCardForm(prev => ({...prev, cardHolderName: e.target.value}))}
                                    placeholder="John Doe"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        value={cardForm.expiryDate}
                                        onChange={handleExpiryChange}
                                        placeholder="MM/YY"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        value={cardForm.cvv}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 4) {
                                                setCardForm(prev => ({...prev, cvv: value}));
                                            }
                                        }}
                                        placeholder="123"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            
                            {/* Security Notice */}
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-xs text-blue-700 mb-1">
                                    🔒 Your card information is encrypted and secure
                                </p>
                                <p className="text-xs text-blue-600">
                                    We use industry-standard encryption to protect your payment data
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowCardModal(false)}
                                disabled={isProcessing}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCard}
                                disabled={!cardForm.cardNumber || !cardForm.cardHolderName || !cardForm.expiryDate || !cardForm.cvv || isProcessing}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isProcessing ? (
                                    <span>Adding...</span>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        <span>Add Card</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
 
export default Wallet;