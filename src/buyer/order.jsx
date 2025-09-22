import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, ShoppingCart, Shield, User, Heart, Share2, Truck, Clock } from 'lucide-react';
import BuyerNavbar from '../components/buyer-navbar';
import { Link, useParams, useNavigate } from 'react-router-dom';

const Order = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);

    // Backend API endpoints
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://agromart-4tnl.onrender.com';
    const API_ENDPOINTS = {
        product: `${API_BASE_URL}/api/product/${productId}`,
        createEscrowPayment: `${API_BASE_URL}/api/order/order/place`
    };

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    // Fetch product details from backend
    const fetchProductDetails = async () => {
        setLoading(true);
        try {
            console.log('Fetching product with ID:', productId);
            
            // Try to fetch from your backend first
            const response = await fetch(`${API_BASE_URL}/api/product/product/${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            
            console.log('Product fetch response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Backend product data:', data);
                
                // Map the backend product data to your frontend format
                const mappedProduct = {
                    _id: data._id || data.id,
                    name: data.name || data.title,
                    category: data.category || 'uncategorized',
                    location: data.location || 'Unknown',
                    price: data.price || 0,
                    originalPrice: data.originalPrice || (data.price + 500), // Add some markup for demo
                    images: data.images && data.images.length > 0 ? data.images : 
                           data.image ? [data.image] : 
                           ['/images/default-product.jpg'],
                    description: data.description || 'No description available',
                    specifications: {
                        "Weight": data.weight || "Standard weight",
                        "Origin": data.location || "Nigeria",
                        "Harvest Date": "Fresh harvest",
                        "Storage": "Cool, dry place",
                        "Shelf Life": "2-3 weeks when properly stored"
                    },
                    seller: {
                        _id: data.seller?._id || data.sellerId || 'unknown',
                        name: data.seller?.fullName || data.seller?.name || 'Unknown Seller',
                        avatar: data.seller?.avatar || `/images/avatars/default.jpg`,
                        rating: data.seller?.rating || 4.0,
                        reviewCount: data.seller?.reviewCount || 50,
                        verified: true,
                        responseTime: "Within 2 hours",
                        farmLocation: data.location || "Nigeria",
                        yearsInBusiness: 5,
                        phone: data.seller?.phone || 'N/A'
                    },
                    availability: {
                        inStock: data.inStock !== undefined ? data.inStock : true,
                        stockCount: data.stockCount || 50,
                        minOrderQuantity: 1,
                        maxOrderQuantity: 20
                    },
                    delivery: {
                        estimatedDays: "2-3 business days",
                        freeShippingThreshold: 5000,
                        shippingCost: 500
                    },
                    reviews: [
                        {
                            id: 1,
                            userName: "Happy Customer",
                            rating: 5,
                            comment: "Great quality product!",
                            date: new Date().toISOString().split('T')[0]
                        }
                    ],
                    tags: ["Fresh", "Quality", "Local"],
                    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                    rating: data.rating || data.seller?.rating || 4.0
                };
                
                console.log('Mapped product for order page:', mappedProduct);
                setProduct(mappedProduct);
                
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Error fetching product from backend:', error);
            console.log('Falling back to check if product exists in localStorage or demo data');
            
            // Fallback: Try to get product data from localStorage if it was stored during navigation
            const cachedProduct = localStorage.getItem(`product_${productId}`);
            if (cachedProduct) {
                console.log('Found cached product data');
                const parsedProduct = JSON.parse(cachedProduct);
                
                // Ensure the cached product has all required fields
                const enhancedProduct = {
                    ...parsedProduct,
                    originalPrice: parsedProduct.originalPrice || (parsedProduct.price + 500),
                    images: parsedProduct.images || parsedProduct.image ? [parsedProduct.image] : ['/images/default-product.jpg'],
                    specifications: parsedProduct.specifications || {
                        "Weight": "Standard weight",
                        "Origin": parsedProduct.location || "Nigeria",
                        "Harvest Date": "Fresh harvest",
                        "Storage": "Cool, dry place",
                        "Shelf Life": "2-3 weeks when properly stored"
                    },
                    availability: parsedProduct.availability || {
                        inStock: parsedProduct.inStock !== undefined ? parsedProduct.inStock : true,
                        stockCount: 50,
                        minOrderQuantity: 1,
                        maxOrderQuantity: 20
                    },
                    delivery: parsedProduct.delivery || {
                        estimatedDays: "2-3 business days",
                        freeShippingThreshold: 5000,
                        shippingCost: 500
                    },
                    reviews: parsedProduct.reviews || [
                        {
                            id: 1,
                            userName: "Happy Customer",
                            rating: 5,
                            comment: "Great quality product!",
                            date: new Date().toISOString().split('T')[0]
                        }
                    ],
                    tags: parsedProduct.tags || ["Fresh", "Quality", "Local"]
                };
                
                setProduct(enhancedProduct);
                return;
            }
            
            // Last resort: Show error
            console.error('Product not found in backend or cache');
            setProduct(null); // This will show the "Product Not Found" message
        } finally {
            setLoading(false);
        }
    };

    // Handle escrow payment via Paystack
    const handleEscrowPayment = async () => {
        if (!product) return;
        
        const totalAmount = (product.price * quantity) + (product.price * quantity >= product.delivery.freeShippingThreshold ? 0 : product.delivery.shippingCost);
        
        setIsProcessingPayment(true);
        try {
            // TODO: Replace with actual API call to create escrow transaction
            
            const escrowResponse = await fetch(API_ENDPOINTS.createEscrowPayment, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: product._id,
                    sellerId: product.seller._id,
                    quantity: quantity,
                    unitPrice: product.price,
                    totalAmount: totalAmount,
                    shippingCost: product.price * quantity >= product.delivery.freeShippingThreshold ? 0 : product.delivery.shippingCost,
                    deliveryAddress: "User delivery address", // TODO: Get from user profile
                    metadata: {
                        productName: product.name,
                        sellerName: product.seller.name,
                        estimatedDelivery: product.delivery.estimatedDays
                    }
                })
            });

            if (escrowResponse.ok) {
                const escrowData = await escrowResponse.json();
                
                // Initialize Paystack payment
                const paystackHandler = window.PaystackPop.setup({
                    key: 'YOUR_PAYSTACK_PUBLIC_KEY', // Replace with your public key
                    email: 'user@example.com', // Replace with actual user email
                    amount: totalAmount,
                    currency: 'NGN',
                    ref: escrowData.reference,
                    callback: function(response) {
                        // Verify payment and update escrow
                        verifyEscrowPayment(response.reference, escrowData.transactionId);
                    },
                    onClose: function() {
                        setIsProcessingPayment(false);
                    }
                });
                
                paystackHandler.openIframe();
            }
            

            // DEMO: Simulate successful payment
            setTimeout(() => {
                setIsProcessingPayment(false);
                setShowPaymentModal(false);
                alert(`Payment successful! ₦${totalAmount.toLocaleString()} has been held in escrow. You will be notified when the seller ships your order.`);
                // Redirect to account page to see escrow balance
                navigate('/account');
            }, 2000);

        } catch (error) {
            console.error('Error processing payment:', error);
            setIsProcessingPayment(false);
            alert('Payment failed. Please try again.');
        }
    };

    // Format price in Naira
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Calculate total cost including shipping
    const calculateTotal = () => {
        if (!product) return 0;
        const subtotal = product.price * quantity;
        const shipping = subtotal >= product.delivery.freeShippingThreshold ? 0 : product.delivery.shippingCost;
        return subtotal + shipping;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <BuyerNavbar />
                <div className="md:ml-64 ml-0 p-4 md:p-6 pt-16 md:pt-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        <span className="ml-3 text-gray-600">Loading product details...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <BuyerNavbar />
                <div className="md:ml-64 ml-0 p-4 md:p-6 pt-16 md:pt-6">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                        <p className="text-gray-600 mb-4">The product you're looking for could not be found.</p>
                        <Link to="/buyer-dashboard" className="text-green-600 hover:text-green-700">
                            ← Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <BuyerNavbar />
            
            <div className="md:ml-64 ml-0 p-4 md:p-6 pt-16 md:pt-6">
                {/* Back Button */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back to Products
                    </button>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                                <img 
                                    src={product.images[selectedImageIndex]} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = `https://via.placeholder.com/500x500/e5e7eb/6b7280?text=${encodeURIComponent(product.name)}`;
                                    }}
                                />
                            </div>
                            
                            {/* Image thumbnails */}
                            {product.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                                selectedImageIndex === index ? 'border-green-500' : 'border-gray-200'
                                            }`}
                                        >
                                            <img 
                                                src={image} 
                                                alt={`${product.name} view ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            {/* Product Header */}
                            <div>
                                <div className="flex items-start justify-between mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setIsFavorited(!isFavorited)}
                                            className={`p-2 rounded-full ${isFavorited ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:scale-110 transition-all`}
                                        >
                                            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                                        </button>
                                        <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:scale-110 transition-all">
                                            <Share2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-sm">{product.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {product.tags.map((tag, index) => (
                                            <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-lg text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">per unit</p>
                                
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <div className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full w-fit">
                                        Save {formatPrice(product.originalPrice - product.price)}
                                    </div>
                                )}
                            </div>

                            {/* Quantity and Add to Cart */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-semibold">{quantity}</span>
                                        <button 
                                            onClick={() => setQuantity(Math.min(product.availability.maxOrderQuantity, quantity + 1))}
                                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        ({product.availability.stockCount} available)
                                    </span>
                                </div>

                                {/* Total Calculation */}
                                <div className="border-t pt-4 mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Subtotal ({quantity} items):</span>
                                        <span>{formatPrice(product.price * quantity)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Shipping:</span>
                                        <span className={product.price * quantity >= product.delivery.freeShippingThreshold ? 'text-green-600' : ''}>
                                            {product.price * quantity >= product.delivery.freeShippingThreshold 
                                                ? 'FREE' 
                                                : formatPrice(product.delivery.shippingCost)
                                            }
                                        </span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-bold">
                                        <span>Total:</span>
                                        <span>{formatPrice(calculateTotal())}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setShowPaymentModal(true)}
                                    disabled={!product.availability.inStock}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Shield className="h-5 w-5" />
                                    Make Secure Payment
                                </button>
                                
                                <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-500">
                                    <Shield className="h-3 w-3" />
                                    <span>Payment held safely in escrow until delivery</span>
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-gray-600" />
                                    Delivery Information
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>Estimated delivery: {product.delivery.estimatedDays}</span>
                                    </div>
                                    <p>Free shipping on orders above {formatPrice(product.delivery.freeShippingThreshold)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Tabs */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <div className="space-y-6">
                            {/* Description */}
                            <div>
                                <h2 className="text-xl font-bold mb-3">Product Description</h2>
                                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                            </div>

                            {/* Specifications */}
                            <div>
                                <h2 className="text-xl font-bold mb-3">Specifications</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="font-medium text-gray-700">{key}:</span>
                                            <span className="text-gray-600">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seller Information */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">Seller Information</h2>
                        <div className="flex items-start gap-4">
                            <img 
                                src={product.seller.avatar} 
                                alt={product.seller.name}
                                className="w-16 h-16 rounded-full object-cover"
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.seller.name)}&size=64&background=6b7280&color=ffffff`;
                                }}
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg">{product.seller.name}</h3>
                                    {product.seller.verified && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Verified</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span>{product.seller.rating} ({product.seller.reviewCount} reviews)</span>
                                    </div>
                                    <span>Response time: {product.seller.responseTime}</span>
                                </div>
                                <p className="text-sm text-gray-600">{product.seller.yearsInBusiness} years in business • {product.seller.farmLocation}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
                        <div className="space-y-4">
                            {product.reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <span className="font-medium">{review.userName}</span>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Secure Escrow Payment</h3>
                        
                        <div className="space-y-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                    <span className="font-semibold text-blue-900">How Escrow Works:</span>
                                </div>
                                <ol className="text-sm text-blue-800 space-y-1">
                                    <li>1. Your payment is held securely in escrow</li>
                                    <li>2. Seller ships your order</li>
                                    <li>3. You confirm delivery and quality</li>
                                    <li>4. Payment is released to seller</li>
                                </ol>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Product:</span>
                                    <span className="font-semibold">{product.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Quantity:</span>
                                    <span>{quantity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Unit Price:</span>
                                    <span>{formatPrice(product.price)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>{formatPrice(product.price * quantity)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>{product.price * quantity >= product.delivery.freeShippingThreshold ? 'FREE' : formatPrice(product.delivery.shippingCost)}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>{formatPrice(calculateTotal())}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                disabled={isProcessingPayment}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEscrowPayment}
                                disabled={isProcessingPayment}
                                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                            >
                                {isProcessingPayment ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-4 w-4" />
                                        Pay via Escrow
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Order;
