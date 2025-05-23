import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/api/v1/all-orders', {
          params: {
            page: currentPage,
            limit: 5,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data.orders || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error('Failed to fetch all orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAllOrders();
  }, [currentPage, token]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'order placed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-2'>
            All Orders
          </h1>
          <p className='text-gray-600 text-lg'>Manage and track all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>Total Orders</p>
                <p className='text-2xl font-bold text-gray-900'>{orders.length}</p>
              </div>
              <div className='bg-blue-100 p-3 rounded-full'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                </svg>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>Current Page</p>
                <p className='text-2xl font-bold text-gray-900'>{currentPage} of {totalPages}</p>
              </div>
              <div className='bg-green-100 p-3 rounded-full'>
                <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z' />
                </svg>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>Revenue</p>
                <p className='text-2xl font-bold text-gray-900'>
                  ₹{orders.reduce((sum, order) => sum + (order.book?.price || 0), 0)}
                </p>
              </div>
              <div className='bg-purple-100 p-3 rounded-full'>
                <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200'>
          {loading ? (
            <div className='flex justify-center items-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className='hidden lg:block'>
                <table className='w-full'>
                  <thead className='bg-gray-50 border-b border-gray-200'>
                    <tr>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Sr.</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Book</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>User</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Price</th>
                      <th className='px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>Status</th>
                      <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>Ordered On</th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {orders.map((order, index) => (
                      <tr key={order._id} className='hover:bg-gray-50 transition-colors duration-200'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium'>
                          {(currentPage - 1) * 5 + index + 1}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900 truncate max-w-xs'>
                            {order.book?.title || 'Untitled'}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-900'>{order.user?.username}</div>
                          <div className='text-sm text-gray-500'>{order.user?.email}</div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900'>
                          ₹{order.book?.price}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-center'>
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {order.status || 'Unknown'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className='lg:hidden'>
                {orders.map((order, index) => (
                  <div key={order._id} className='border-b border-gray-200 p-6 hover:bg-gray-50 transition-colors duration-200'>
                    <div className='flex justify-between items-start mb-3'>
                      <div className='flex items-center space-x-3'>
                        <span className='bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full'>
                          #{(currentPage - 1) * 5 + index + 1}
                        </span>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status || 'Unknown'}
                        </span>
                      </div>
                      <div className='text-right'>
                        <div className='text-lg font-bold text-gray-900'>₹{order.book?.price}</div>
                        <div className='text-xs text-gray-500'>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div>
                        <span className='text-xs font-medium text-gray-500'>Book:</span>
                        <p className='text-sm font-medium text-gray-900 truncate'>
                          {order.book?.title || 'Untitled'}
                        </p>
                      </div>
                      <div>
                        <span className='text-xs font-medium text-gray-500'>Customer:</span>
                        <p className='text-sm text-gray-900'>{order.user?.username}</p>
                        <p className='text-xs text-gray-500'>{order.user?.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className='flex flex-col sm:flex-row justify-between items-center mt-8 gap-4'>
            <div className='text-sm text-gray-600'>
              Showing page {currentPage} of {totalPages}
            </div>
            <div className='flex items-center space-x-2'>
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className='px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200'
              >
                Previous
              </button>
              <span className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md'>
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200'
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className='px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
              >
                Last
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className='text-center py-12'>
            <svg className='mx-auto h-24 w-24 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
            </svg>
            <h3 className='mt-4 text-lg font-medium text-gray-900'>No orders found</h3>
            <p className='mt-2 text-gray-500'>No orders have been placed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrders;