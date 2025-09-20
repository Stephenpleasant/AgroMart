import React, { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, Building, CreditCard, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        businessName: '',
        businessAddress: '',
        city: '',
        state: '',
        zipCode: '',
        taxId: '',
        bankAccount: '',
        description: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!profile.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!profile.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(profile.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation
        if (!profile.password) {
            newErrors.password = 'Password is required';
        } else if (profile.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        // Confirm password validation
        if (profile.password !== profile.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Phone validation
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!profile.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(profile.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        // Business name validation
        if (!profile.businessName.trim()) {
            newErrors.businessName = 'Business name is required';
        }

        // Address validation
        if (!profile.businessAddress.trim()) {
            newErrors.businessAddress = 'Business address is required';
        }

        // City validation
        if (!profile.city.trim()) {
            newErrors.city = 'City is required';
        }

        // State validation
        if (!profile.state.trim()) {
            newErrors.state = 'State is required';
        }

        // Zip code validation
        if (!profile.zipCode.trim()) {
            newErrors.zipCode = 'Zip code is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            console.log('Profile Data:', profile);
            alert('Profile updated successfully!');
            
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const InputField = ({ icon: Icon, label, name, type = "text", placeholder, required = true, ...props }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type={type}
                    name={name}
                    value={profile[name]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    {...props}
                />
            </div>
            {errors[name] && (
                <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
            )}
        </div>
    );

    const PasswordField = ({ label, name, placeholder, showPassword, toggleShow }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={profile[name]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                />
                <button
                    type="button"
                    onClick={toggleShow}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
            {errors[name] && (
                <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Profile</h1>
                    <p className="text-gray-600">Create and manage your seller account</p>
                </div>

                <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                        
                        <InputField
                            icon={User}
                            label="Full Name"
                            name="name"
                            placeholder="Enter your full name"
                        />

                        <InputField
                            icon={Mail}
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                        />

                        <InputField
                            icon={Phone}
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                        />

                        <PasswordField
                            label="Password"
                            name="password"
                            placeholder="Enter your password"
                            showPassword={showPassword}
                            toggleShow={() => setShowPassword(!showPassword)}
                        />

                        <PasswordField
                            label="Confirm Password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            showPassword={showConfirmPassword}
                            toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </div>

                    {/* Business Information */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Information</h2>
                        
                        <InputField
                            icon={Building}
                            label="Business Name"
                            name="businessName"
                            placeholder="Enter your business name"
                        />

                        <InputField
                            icon={MapPin}
                            label="Business Address"
                            name="businessAddress"
                            placeholder="Enter your business address"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField
                                icon={MapPin}
                                label="City"
                                name="city"
                                placeholder="City"
                            />
                            <InputField
                                icon={MapPin}
                                label="State"
                                name="state"
                                placeholder="State"
                            />
                            <InputField
                                icon={MapPin}
                                label="Zip Code"
                                name="zipCode"
                                placeholder="Zip Code"
                            />
                        </div>

                      
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Description
                            </label>
                            <textarea
                                name="description"
                                value={profile.description}
                                onChange={handleInputChange}
                                placeholder="Describe your business and what you sell..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                            isSubmitting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-300'
                        }`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Updating Profile...
                            </div>
                        ) : (
                            'Update Profile'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;