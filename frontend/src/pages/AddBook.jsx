import React, { useState } from 'react';
import { Upload, X, Book, User, DollarSign, Globe, FileText, Loader, CheckCircle } from 'lucide-react';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    desc: '',
    language: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setMessage('❌ Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ File size should be less than 5MB');
        return;
      }

      setImageFile(file);
      setMessage('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setMessage('');
    // Reset file input
    const fileInput = document.getElementById('imageInput');
    if (fileInput) fileInput.value = '';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!imageFile) {
      setMessage('❌ Please select an image file');
      return;
    }

    // Get token from localStorage (replace with your token logic)
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (!token) {
      setMessage('❌ Access denied. Please login first');
      return;
    }

    setIsLoading(true);
    setMessage('📤 Uploading book...');

    try {
      // Create FormData
      const formDataToSend = new FormData();
      
      // Add image file (using 'image' field name as per your backend)
      formDataToSend.append('image', imageFile);
      
      // Add all form fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('desc', formData.desc);
      formDataToSend.append('language', formData.language);

      // Make API call
      const response = await fetch('http://localhost:3000/api/v1/add-book', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ Book added successfully!');
        
        // Reset form
        setFormData({
          title: '',
          author: '',
          price: '',
          desc: '',
          language: ''
        });
        setImageFile(null);
        setImagePreview(null);
        
        // Reset file input
        const fileInput = document.getElementById('imageInput');
        if (fileInput) fileInput.value = '';
        
      } else {
        setMessage(`❌ ${result.message || 'Error adding book'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`❌ Network error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-zinc-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <Book className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Add New Book</h1>
            <p className="text-gray-300">Upload book details with cover image to Cloudinary</p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl ${
              message.includes('✅') ? 'bg-green-500/20 border border-green-500/30 text-green-200' :
              message.includes('📤') ? 'bg-blue-500/20 border border-blue-500/30 text-blue-200' :
              'bg-red-500/20 border border-red-500/30 text-red-200'
            }`}>
              <p className="text-center font-medium">{message}</p>
            </div>
          )}

          <div onSubmit={handleSubmit}>
            {/* Image Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Book Cover Image *
              </label>
              
              {!imagePreview ? (
                <div className="relative">
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  <label
                    htmlFor="imageInput"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-300"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-300 text-center">
                      <span className="font-semibold text-blue-400">Click to upload cover image</span><br />
                      <span className="text-sm">PNG, JPG, WebP up to 5MB</span>
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-800">
                    <img
                      src={imagePreview}
                      alt="Book cover preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-green-300 mt-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Image selected: {imageFile?.name}
                  </p>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Title and Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-white mb-2">
                    <Book className="w-4 h-4 mr-2" />
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-white mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Price and Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-white mb-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-white mb-2">
                    <Globe className="w-4 h-4 mr-2" />
                    Language *
                  </label>
                  <input
                    type="text"
                    name="language"
                    placeholder="Enter language (e.g., English)"
                    value={formData.language}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center text-sm font-semibold text-white mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Description *
                </label>
                <textarea
                  name="desc"
                  placeholder="Write a detailed description of the book..."
                  value={formData.desc}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin w-5 h-5 mr-3" />
                    Uploading to Cloudinary...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Add Book to Library
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;