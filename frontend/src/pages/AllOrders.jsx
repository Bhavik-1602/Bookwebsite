import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchAllOrders = async () => {
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
      }
    };

    if (token) fetchAllOrders();
  }, [currentPage, token]);

  return (
    <div className='min-h-screen p-4 text-zinc-100'>
      <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8 text-center'>
        All Orders
      </h1>

      {/* Table Header */}
      <div className='bg-zinc-800 rounded py-2 px-4 flex gap-2 text-sm md:text-base'>
        <div className='w-[5%] text-center font-bold'>Sr.</div>
        <div className='w-[20%] text-center font-bold'>Book</div>
        <div className='w-[25%] text-center font-bold'>User</div>
        <div className='w-[20%] text-center font-bold'>Price</div>
       
        <div className='w-[10%] text-center font-bold'>Status</div>
        <div className='hidden md:block w-[10%] text-center font-bold'>Ordered On</div>
      </div>

      {/* Order Items */}
      {orders.map((order, index) => (
        <div
          key={order._id}
          className='bg-zinc-800 rounded py-2 px-4 flex gap-2 items-center hover:bg-zinc-900 mt-2 text-sm md:text-base'
        >
          <div className='w-[5%] text-center'>{(currentPage - 1) * 5 + index + 1}</div>

          <div className='w-[20%] text-center truncate'>
            {order.book?.title || 'Untitled'}
          </div>

          <div className='w-[25%] text-center truncate'>
            {order.user?.username} ({order.user?.email})
          </div>

          <div className='w-[20%] text-center'>₹{order.book?.price}</div>

          

          <div className='w-[10%] text-center capitalize'>
  <span
    className={
      order.status === 'completed'
        ? 'text-green-500'
        : order.status === 'canceled'
        ? 'text-red-500'
        : order.status === 'Order placed'
        ? 'text-yellow-500'
        : 'text-gray-400'
    }
  >
    {order.status || 'Unknown'}
  </span>
</div>


          <div className='hidden md:block w-[10%] text-center text-xs'>
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-8 gap-4'>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className='bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-500'
          >
            Prev
          </button>

          <span className='text-zinc-300 font-medium'>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className='bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-500'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
