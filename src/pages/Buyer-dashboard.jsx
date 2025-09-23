import React, { useState, useEffect } from "react";
import BuyerNavbar from "../components/buyer-navbar";
import { ChevronLeft, ChevronRight, Search, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Buyer = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const itemsPerPage = 4; // 4 products per page as requested

    // Categories for filtering
    const categories = [
        { id: 'all', name: 'Explore →', active: true },
        { id: 'tubers', name: 'Tubers' },
        { id: 'vegetables', name: 'Vegetables' },
        { id: 'fruits', name: 'Fruits' },
        { id: 'grains', name: 'Grains' },
        { id: 'poultry', name: 'Poultry' },
        { id: 'dairy', name: 'Dairy' },
        { id: 'seedlings', name: 'Seedlings' }
    ];

    // Backend API endpoints - REPLACE WITH YOUR BACKEND URL
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://agromart-4tnl.onrender.com';
    const API_ENDPOINTS = {
        products: `${API_BASE_URL}/api/product/all`,
    };

    // Function to map backend product data to frontend format
    const mapBackendProductToFrontend = (backendProduct) => {
        console.log('Mapping product:', backendProduct); // Debug log
        
        return {
            _id: backendProduct._id || backendProduct.id,
            name: backendProduct.name || backendProduct.title,
            category: backendProduct.category || 'uncategorized',
            location: backendProduct.location || 'Unknown',
            price: backendProduct.price || 'Contact for price',
            image: backendProduct.images || backendProduct.images?.[0] || '/images/default-product.jpg',
            description: backendProduct.description || 'No description available',
            sellerId: backendProduct.sellerId || backendProduct.seller?._id,
            seller: backendProduct.seller ? {
                _id: backendProduct.seller._id || backendProduct.seller.id,
                name: backendProduct.seller.fullName || 'Unknown Seller',
                phone: backendProduct.seller.phone || 'N/A',
                avatar: backendProduct.seller.avatar || `/images/avatars/${(backendProduct.seller.name || 'default').toLowerCase().replace(' ', '-')}.jpg`,
                rating: backendProduct.seller.rating || 4.0
            } : {
                _id: 'unknown',
                name: 'Unknown Seller',
                avatar: '/images/avatars/default.jpg',
                rating: 4.0
            },
            createdAt: backendProduct.createdAt ? new Date(backendProduct.createdAt) : new Date(),
            inStock: backendProduct.inStock !== undefined ? backendProduct.inStock : true,
            rating: backendProduct.rating || backendProduct.seller?.rating || 4.0
        };
    };

    // Fetch products from backend
    const fetchProducts = async () => {
        setLoading(true);
        setError('');

        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery,
                category: selectedCategory === 'all' ? '' : selectedCategory
            });

            console.log('Making GET request to:', `${API_ENDPOINTS.products}?${queryParams}`);
            
            const response = await fetch(`${API_ENDPOINTS.products}?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Backend response data:', data);

            // Handle different response structures
            let productsArray = [];
            if (Array.isArray(data)) {
                // If data is directly an array of products
                productsArray = data;
            } else if (data.products && Array.isArray(data.products)) {
                // If data has a products property
                productsArray = data.products;
            } else if (data.data && Array.isArray(data.data)) {
                // If data has a data property
                productsArray = data.data;
            } else {
                console.warn('Unexpected response structure:', data);
                productsArray = [];
            }

            console.log('Products array before mapping:', productsArray);

            // Map backend products to frontend format
            const mappedProducts = productsArray.map(mapBackendProductToFrontend);

            setProducts(mappedProducts);
            setTotalPages(Math.ceil((data.total || data.totalCount || data.pagination?.total || mappedProducts.length) / itemsPerPage));

            console.log('Mapped products:', mappedProducts);

        } catch (err) {
            console.error('Error fetching products:', err);
            setError(`Failed to load products from backend: ${err.message}. Using demo data.`);
            
            // Fallback to demo data
            loadDemoData();
        } finally {
            setLoading(false);
        }
    };

    // Demo data fallback (Fixed - should be an array)
    const loadDemoData = () => {
        const demoProducts = [
            {
                _id: '4',
                name: "Fresh Carrots",
                category: "vegetables",
                location: "Abuja",
                price: 800,
                image: "/images/vegetables.jpeg",
                description: "Crunchy orange carrots, rich in vitamins",
                seller: {
                    _id: 'seller4',
                    name: "David Wilson",
                    avatar: "/images/avatars/david-wilson.jpg",
                    rating: 4.6
                },
                createdAt: new Date(),
                inStock: true
            }
        ];

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const filteredProducts = demoProducts.filter(product => {
            const matchesSearch = searchQuery === '' || 
                product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || 
                product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        setProducts(filteredProducts.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    };

    // Handle search
    const handleSearch = () => {
        setCurrentPage(1);
        fetchProducts();
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
        fetchProducts();
    }, [currentPage, selectedCategory]);

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleViewMore = (id) => {
    console.log('Navigating to order page with product:', id);
    // Cache the product data so the Order page can access it immediately
    localStorage.setItem(`product_${product._id}`, JSON.stringify(id));
};

    return ( 
        <div className="min-h-screen bg-gray-50">
            <BuyerNavbar />
            
            {/* Main Content - Properly offset for navbar with responsive margins */}
            <div className="md:ml-64 ml-0 p-4 md:p-6 pt-16 md:pt-6">
                {/* Search Section */}
                <div className="mb-8">
                    <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input 
                                type="text" 
                                placeholder="What are you searching for?" 
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

                {/* Discover Section */}
                <div className="mb-12 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-6 md:p-8 text-white">
                    <div className="max-w-lg">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover</h1>
                        <p className="text-base md:text-lg mb-6 text-green-100">
                            Find the best agricultural products from verified users — at your price.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full w-fit">
                                {products.length} Products Available
                            </div>
                            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full w-fit">
                                Page {currentPage} of {totalPages}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        <span className="ml-3 text-gray-600">Loading products...</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6" role="alert">
                        <p className="font-medium">Notice:</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Products Grid - Responsive grid */}
                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:scale-105">
                                <div className="relative">
                                    {/* Seller Info */}
                                    <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                                        <img 
                                            src={product.seller?.avatar} 
                                            alt={product.seller?.name}
                                            className="w-6 h-6 rounded-full object-cover border-2 border-white shadow-sm"
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.seller?.name || 'Seller')}&size=24&background=6b7280&color=ffffff`;
                                            }}
                                        />
                                        <span className="text-xs text-white bg-black bg-opacity-60 px-2 py-1 rounded-full backdrop-blur-sm">
                                            {product.seller?.name}
                                        </span>
                                    </div>
                                    
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
                                            src={product.images} 
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
                                        {product.seller?.rating && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-yellow-400">⭐</span>
                                                <span className="text-xs text-gray-600">{product.seller.rating}</span>
                                            </div>
                                        )}
                                    </div>
                                   <Link to={`/order/${product._id}`} onClick={() => handleViewMore(id)}>
                                      <button className='w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 bg-green-500 hover:bg-green-800 text-white'>
                                           View More
                                               </button>
                                           </Link>
                                </div>
                            </div>
                        ))}
                        
                        {/* Empty slots if less than 4 products - only show on larger screens */}
                        {products.length < 4 && Array.from({ length: 4 - products.length }, (_, index) => (
                            <div key={`empty-${index}`} className="hidden xl:flex bg-gray-100 rounded-xl shadow-sm border-2 border-dashed border-gray-300 items-center justify-center h-64">
                                <div className="text-center text-gray-400">
                                    <div className="text-4xl mb-2">📦</div>
                                    <p className="text-sm">No more products</p>
                                </div>
                            </div>
                        ))}
                    </div>
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

                
            </div>
        </div>  
    );
}
 
export default Buyer;