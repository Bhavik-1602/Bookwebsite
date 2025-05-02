import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import nooder from "../../assets/No Order Hi.jpeg";

const UserOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  // Fetch order history
  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/order-history/${userId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.orders); // updated to match backend response
      setOrderHistory(response.data.orders); // updated to use 'orders'
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [userId, token]);

  return (
    <div>
      {/* No Order Image */}
      {orderHistory && orderHistory.length === 0 && (
        <div className='h-[80vh] p-4 text-zinc-100'>
          <div className='h-full flex flex-col items-center justify-center'>
            <h1 className='text-5xl font-semibold text-zinc-500 mb-8'>No Order History</h1>
            <img src={nooder} alt="No Order" className='h-[20vh] mb-8' />
          </div>
        </div>
      )}

      {/* Order History Display */}
      {orderHistory && orderHistory.length > 0 && (
        <div className='h-full p-0 md:p-4 text-zinc-100'>
          <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>
            Your Order History
          </h1>

          {/* Table Headers */}
          <div className='mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2'>
            <div className='w-[3%] text-center'>Sr.</div>
            <div className='w-[22%] text-center'>Books</div>
            <div className='w-[45%] text-center'>Description</div>
            <div className='w-[9%] text-center'>Price</div>
            <div className='w-[16%] text-center'>Status</div>
            <div className='w-none md:w-[5%] hidden md:block text-center'>Mode</div>
          </div>

          {/* Order List */}
          {orderHistory.map((item, i) => (
            <div
              key={item._id}
              className='bg-zinc-800 w-full rounded py-2 px-4 flex gap-4 hover:bg-zinc-900 hover:cursor-pointer'
            >
              <div className='w-[3%] text-center'>{i + 1}</div>

              <div className='w-[25%] text-center'>
                <Link to={`/view-book--details/${item.book._id}`} className="hover:text-blue-300">
                  {item.book.title}
                </Link>
              </div>

              <div className='w-[45%]'>
                {item.book.desc.slice(0, 50)}...
              </div>

              <div className='w-[9%] text-center'>
                ₹{item.book.price}
              </div>

              <div className='w-[16%] text-center'>
                {item.status === "Order placed" ? (
                  <span className='text-yellow-500'>{item.status}</span>
                ) : item.status === "canceled" ? (
                  <span className='text-red-500'>{item.status}</span>
                ) : (
                  <span className='text-green-500'>{item.status}</span>
                )}
              </div>

              <div className='w-none md:w-[5%] hidden md:block text-center'>
                COD
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;
