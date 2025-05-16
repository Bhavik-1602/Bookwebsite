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
      <div className="min-h-screen flex items-center justify-center text-zinc-300 text-lg">
        Loading your order history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 text-zinc-100">
      {orderHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl md:text-5xl font-semibold text-zinc-500 mb-8">
            No Order History
          </h1>
          <img src={noOrderImage} alt="No Order" className="h-[200px] md:h-[250px]" />
        </div>
      ) : (
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Your Order History
          </h1>

          {/* Table Header */}
          <div className="bg-zinc-800 rounded py-2 px-4 flex gap-2 text-sm md:text-base font-bold">
            <div className="w-[5%] text-center">Sr.</div>
            <div className="w-[25%] text-center">Book</div>
            <div className="w-[40%] text-center">Description</div>
            <div className="w-[10%] text-center">Price</div>
            <div className="w-[15%] text-center">Status</div>
            <div className="hidden md:block w-[5%] text-center">Mode</div>
          </div>

          {/* Order Items */}
          {orderHistory.map((item, index) => (
            <div
              key={item._id}
              className="bg-zinc-800 rounded py-2 px-4 flex gap-2 items-center hover:bg-zinc-900 mt-2 text-sm md:text-base"
            >
              <div className="w-[5%] text-center">{index + 1}</div>

              <div className="w-[25%] text-center">
                {item.book ? (
                  <Link
                    to={`/view-book--details/${item.book._id}`}
                    className="hover:text-blue-400 font-medium"
                  >
                    {item.book.title}
                  </Link>
                ) : (
                  <span className="text-zinc-400 italic">Book not found</span>
                )}
              </div>

              <div className="w-[40%] text-zinc-400">
                {item.book?.desc ? item.book.desc.slice(0, 50) + '...' : 'No description'}
              </div>

              <div className="w-[10%] text-center">
                ₹{item.book?.price ?? 'N/A'}
              </div>

              <div className="w-[15%] text-center">
                {item.status === 'Order placed' && (
                  <span className="text-yellow-500">{item.status}</span>
                )}
                {item.status === 'canceled' && (
                  <span className="text-red-500">{item.status}</span>
                )}
                {item.status === 'completed' && (
                  <span className="text-green-500">{item.status}</span>
                )}
              </div>

              <div className="hidden md:block w-[5%] text-center">
                {item.paymentMode ?? 'COD'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;
