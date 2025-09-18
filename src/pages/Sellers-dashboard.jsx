import React, { useState, useEffect } from "react";
import SellersNavbar from "../components/sellers-navbar";
import { ChevronLeft, ChevronRight, Search, MapPin, Plus, Upload, Package, Edit, Trash2, Eye } from "lucide-react";

const Sellers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showUploadModal, setShowUploadModal] = useState(false);

    // Mock seller ID - in real app, this would come from authentication
    const currentSellerId = 'seller1';
    const sellerName = 'Alex Sandra';

    const itemsPerPage = 4;

    // Categories for filtering
    const categories = [
        { id: 'all', name: 'All Products', active: true },
        { id: 'tubers', name: 'Tubers' },
        { id: 'vegetables', name: 'Vegetables' },
        { id: 'fruits', name: 'Fruits' },
        { id: 'grains', name: 'Grains' },
        { id: 'poultry', name: 'Poultry' },
        { id: 'dairy', name: 'Dairy' },
        { id: 'seedlings', name: 'Seedlings' }
    ];

    // Backend API endpoints
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const API_ENDPOINTS = {
        sellerProducts: `${API_BASE_URL}/api/products/seller/${currentSellerId}`,
        uploadProduct: `${API_BASE_URL}/api/products/upload`,
        updateProduct: `${API_BASE_URL}/api/products`,
        deleteProduct: `${API_BASE_URL}/api/products`
    };

    // Fetch seller's products from backend
    const fetchSellerProducts = async () => {
        setLoading(true);
        setError('');

        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery,
                category: selectedCategory === 'all' ? '' : selectedCategory
            });

            const response = await fetch(`${API_ENDPOINTS.sellerProducts}?${queryParams}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch seller products');
            }

            const data = await response.json();
            
            setProducts(data.products || []);
            setTotalPages(Math.ceil(data.total / itemsPerPage));

        } catch (err) {
            console.error('Error fetching seller products:', err);
            setError('Failed to load your products. Using demo data.');
            
            // Fallback to demo data
            loadSellerDemoData();
        } finally {
            setLoading(false);
        }
    };

    // Demo data fallback - only seller's products
    const loadSellerDemoData = () => {
        const sellerDemoProducts = [
            {
                _id: '1',
                name: "Fresh Yams",
                category: "tubers",
                location: "Lagos",
                price: 3000,
                image: "yams.jpeg",
                description: "Fresh, organic yams from Lagos farms",
                seller: {
                    _id: currentSellerId,
                    name: sellerName,
                    avatar: "/images/avatars/alex-sandra.jpg",
                    rating: 4.5
                },
                createdAt: new Date('2024-01-15'),
                inStock: true,
                views: 0,
                orders: 0
            }
        
        ];

        const filteredProducts = sellerDemoProducts.filter(product => {
            const matchesSearch = searchQuery === '' || 
                product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || 
                product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        setProducts(filteredProducts.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    };

    // Handle search
    const handleSearch = () => {
        setCurrentPage(1);
        fetchSellerProducts();
    };

    // Handle category change
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Fetch products when dependencies change
    useEffect(() => {
        fetchSellerProducts();
    }, [currentPage, selectedCategory]);

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Handle product actions
    const handleEditProduct = (productId) => {
        console.log('Edit product:', productId);
        // Navigate to edit form or open edit modal
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            console.log('Delete product:', productId);
            // API call to delete product
            fetchSellerProducts(); // Refresh list
        }
    };

    const handleViewAnalytics = (productId) => {
        console.log('View analytics for product:', productId);
        // Navigate to analytics page
    };

    return ( 
        <div className="min-h-screen bg-gray-50">
            <SellersNavbar />
            
            {/* Main Content - Properly offset for navbar with responsive margins */}
            <div className="md:ml-64 ml-0 p-4 md:p-6 pt-16 md:pt-6">
                
                {/* Header Section with Upload Button */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Products</h1>
                        <p className="text-gray-600">Manage and track your agricultural products</p>
                    </div>
                    
                    <button 
                        onClick={() => setShowUploadModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg hover:shadow-xl"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Upload Product</span>
                        <span className="sm:hidden">Upload</span>
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <Package size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                                <p className="text-sm text-gray-600">Active Products</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Eye size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">0</p>
                                <p className="text-sm text-gray-600">Total Views</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <MapPin size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">0</p>
                                <p className="text-sm text-gray-600">Total Orders</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="mb-8">
                    <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input 
                                type="text" 
                                placeholder="Search your products..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full px-4 py-3 pl-10 bg-gray-100 rounded-lg border-none outline-none focus:bg-white focus:shadow-md transition-all"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <Search className="h-4 w-4" />
                            <span className="hidden sm:inline">Search</span>
                        </button>
                    </div>
                </div>

                {/* Category Buttons */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                        {categories.map((category) => (
                            <button 
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`px-3 md:px-6 py-2 rounded-full transition-colors text-sm ${
                                    selectedCategory === category.id
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        <span className="ml-3 text-gray-600">Loading your products...</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6" role="alert">
                        <p className="font-medium">Notice:</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Products Grid - Seller's products only */}
                {!loading && (
                    <>
                        {products.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No products yet</h3>
                                <p className="text-gray-500 mb-6">Start by uploading your first agricultural product</p>
                                <button 
                                    onClick={() => setShowUploadModal(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 font-medium transition-colors"
                                >
                                    <Plus size={20} />
                                    Upload Your First Product
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
                                {products.map((product) => (
                                    <div key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                                        <div className="relative">
                                            {/* Stock Status */}
                                            <div className="absolute top-3 right-3 z-10">
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    product.inStock 
                                                        ? 'bg-green-500 text-white' 
                                                        : 'bg-red-500 text-white'
                                                }`}>
                                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </div>
                                            
                                            {/* Product Image */}
                                            <div className="w-full h-48 overflow-hidden bg-gray-100">
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name}
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.src = `https://via.placeholder.com/400x300/e5e7eb/6b7280?text=${encodeURIComponent(product.name)}`;
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                                            
                                            <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                                                <MapPin className="h-3 w-3" />
                                                {product.location}
                                            </div>
                                            
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-lg font-bold text-gray-900">
                                                    {typeof product.price === 'number' 
                                                        ? formatPrice(product.price)
                                                        : product.price
                                                    }
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span>{product.views || 0} views</span>
                                                    <span>{product.orders || 0} orders</span>
                                                </div>
                                            </div>
                                            
                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleEditProduct(product._id)}
                                                    className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <Edit size={14} />
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleViewAnalytics(product._id)}
                                                    className="flex-1 py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Add New Product Card */}
                                <div 
                                    onClick={() => setShowUploadModal(true)}
                                    className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center h-64 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors group"
                                >
                                    <div className="text-center text-gray-400 group-hover:text-green-600">
                                        <Plus size={32} className="mx-auto mb-2" />
                                        <p className="text-sm font-medium">Add New Product</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 md:gap-4 py-8 overflow-x-auto">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </button>
                        
                        <div className="flex gap-1 md:gap-2">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-2 md:px-3 py-2 rounded-lg transition-colors text-sm ${
                                        currentPage === index + 1
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Backend Integration Info */}
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Seller Dashboard Features</h3>
                    <div className="text-sm text-green-800 space-y-1">
                        <p><strong>Your Products API:</strong> {API_ENDPOINTS.sellerProducts}</p>
                        <p><strong>Upload API:</strong> {API_ENDPOINTS.uploadProduct}</p>
                        <p className="mt-2 text-green-600">
                            This dashboard shows only products uploaded by you. Upload functionality will integrate with your backend when ready.
                        </p>
                    </div>
                </div>
            </div>

            {/* Upload Modal Placeholder */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Upload Product</h3>
                            <button 
                                onClick={() => setShowUploadModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>
                        <div className="text-center py-8">
                            <Upload size={48} className="mx-auto mb-4 text-green-600" />
                            <p className="text-gray-600 mb-4">Upload form will be implemented here</p>
                            <button 
                                onClick={() => setShowUploadModal(false)}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>  
    );
}
 
export default Sellers;