import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noOrderImage from '../../assets/No Order Hi.jpeg';

const UserOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        if (!userId || !token) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/api/v1/order-history/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Order History API Response:', response.data);

        // Adjust this depending on your actual backend response format
        setOrderHistory(response?.data?.orders || []);
      } catch (err) {
        console.error('Failed to fetch order history:', err);
        setError('Failed to fetch order history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [userId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-300 text-lg font-medium">Loading your order history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <p className="text-red-400 text-lg font-medium">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {orderHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent">
                No Order History
              </h1>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                <img 
                  src={noOrderImage} 
                  alt="No Order" 
                  className="relative h-[200px] md:h-[280px] object-contain drop-shadow-2xl" 
                />
              </div>
              <p className="text-slate-400 text-lg max-w-md mx-auto">
                Start exploring our collection and place your first order to see it here!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Order History
              </h1>
              <p className="text-slate-400 text-lg">
                Track all your book orders and their current status
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-3">Book Details</div>
                    <div className="col-span-4">Description</div>
                    <div className="col-span-1 text-center">Price</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-1 text-center">Payment</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-700/30">
                  {orderHistory.map((item, index) => (
                    <div
                      key={item._id}
                      className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-700/20 transition-all duration-300 group"
                    >
                      <div className="col-span-1 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-700 rounded-full text-sm font-medium text-slate-300 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                          {index + 1}
                        </span>
                      </div>

                      <div className="col-span-3">
                        {item.book ? (
                          <Link
                            to={`/view-book--details/${item.book._id}`}
                            className="block group/link"
                          >
                            <h3 className="font-semibold text-slate-200 group-hover/link:text-blue-400 transition-colors line-clamp-2">
                              {item.book.title}
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">Click to view details</p>
                          </Link>
                        ) : (
                          <div className="text-slate-500 italic">
                            <span>Book not found</span>
                          </div>
                        )}
                      </div>

                      <div className="col-span-4">
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                          {item.book?.desc ? item.book.desc.slice(0, 100) + '...' : 'No description available'}
                        </p>
                      </div>

                      <div className="col-span-1 text-center">
                        <span className="inline-flex items-center px-3 py-1 bg-green-500/10 text-green-400 font-semibold rounded-full text-sm border border-green-500/20">
                          ₹{item.book?.price ?? 'N/A'}
                        </span>
                      </div>

                      <div className="col-span-2 text-center">
                        {item.status === 'Order placed' && (
                          <span className="inline-flex items-center px-3 py-1 bg-yellow-500/10 text-yellow-400 font-medium rounded-full text-sm border border-yellow-500/20">
                            📦 {item.status}
                          </span>
                        )}
                        {item.status === 'canceled' && (
                          <span className="inline-flex items-center px-3 py-1 bg-red-500/10 text-red-400 font-medium rounded-full text-sm border border-red-500/20">
                            ❌ {item.status}
                          </span>
                        )}
                        {item.status === 'completed' && (
                          <span className="inline-flex items-center px-3 py-1 bg-green-500/10 text-green-400 font-medium rounded-full text-sm border border-green-500/20">
                            ✅ {item.status}
                          </span>
                        )}
                      </div>

                      <div className="col-span-1 text-center">
                        <span className="inline-flex items-center px-2 py-1 bg-slate-600/30 text-slate-300 font-medium rounded text-xs border border-slate-600/30">
                          {item.paymentMode ?? 'COD'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {orderHistory.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        {item.book ? (
                          <Link
                            to={`/view-book--details/${item.book._id}`}
                            className="font-semibold text-slate-200 hover:text-blue-400 transition-colors"
                          >
                            {item.book.title}
                          </Link>
                        ) : (
                          <span className="text-slate-500 italic">Book not found</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400 mb-1">
                        ₹{item.book?.price ?? 'N/A'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.paymentMode ?? 'COD'}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {item.book?.desc ? item.book.desc.slice(0, 120) + '...' : 'No description available'}
                  </p>

                  <div className="flex justify-between items-center">
                    <div>
                      {item.status === 'Order placed' && (
                        <span className="inline-flex items-center px-3 py-1 bg-yellow-500/10 text-yellow-400 font-medium rounded-full text-sm border border-yellow-500/20">
                          📦 Order Placed
                        </span>
                      )}
                      {item.status === 'canceled' && (
                        <span className="inline-flex items-center px-3 py-1 bg-red-500/10 text-red-400 font-medium rounded-full text-sm border border-red-500/20">
                          ❌ Canceled
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <span className="inline-flex items-center px-3 py-1 bg-green-500/10 text-green-400 font-medium rounded-full text-sm border border-green-500/20">
                          ✅ Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Footer */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/30 rounded-full backdrop-blur-sm border border-slate-700/30">
                <span className="text-slate-400">Total Orders:</span>
                <span className="font-bold text-slate-200">{orderHistory.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrderHistory;