import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import { AiFillDelete } from 'react-icons/ai';
import axios from 'axios';
import emty from "../assets/Empty Cart.jpeg";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/get-cart/${userId}`, { headers });
      setCart(res.data.cart || []);
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error.message);
      toast.error("Failed to fetch cart data.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart) {
      const totalPrice = cart.reduce((acc, item) => acc + Number(item.price || 0), 0);
      setTotal(totalPrice);
    }
  }, [cart]);

  const PlaceOrder = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/place-order`,
        {
          id: userId,
          order: cart,
        },
        { headers }
      );

      toast.success(response.data.message || "Order placed successfully!");
      navigate("/profile/orderHistory");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order");
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      const res = await axios.put(
        'http://localhost:3000/api/v1/remove-from-cart',
        {
          id: userId,
          bookid: bookId,
        },
        { headers }
      );

      toast.success('Removed from cart: ' + (res.data.message || 'Success'));
      fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err.response?.data || err.message);
      toast.error('Failed to remove item');
    }
  };

  const bookCount = cart ? cart.length : 0;

  return (
    <>
      {!cart ? (
        <Loader />
      ) : cart.length === 0 ? (
        <div className="h-[100vh] flex flex-col items-center justify-center gap-6">
          <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400 select-none">Your Cart is Empty</h1>
          <img src={emty} alt="Empty Cart" className="lg:h-[50vh] rounded-md shadow-lg" />
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-zinc-200 mb-10 text-center">Your Shopping Cart</h1>

          <div className="flex flex-col gap-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row items-center bg-zinc-800 rounded-xl p-4 shadow-md hover:shadow-lg transition"
              >
                <img
                  src={'http://localhost:3000' + item.url}
                  alt={item.title}
                  className="h-28 w-20 md:h-24 md:w-20 object-cover rounded-md flex-shrink-0"
                />

                <div className="flex-1 px-4 md:px-6">
                  <h2 className="text-xl font-semibold text-zinc-100">{item.title}</h2>
                  <p className="text-zinc-400 mt-1 hidden lg:block">{item.desc?.slice(0, 100)}...</p>
                  <p className="text-zinc-400 mt-1 block lg:hidden">{item.desc?.slice(0, 65)}...</p>
                </div>

                <div className="flex items-center gap-6 mt-4 md:mt-0">
                  <span className="text-2xl font-semibold text-green-400">₹ {item.price}</span>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 hover:text-red-800 transition"
                    aria-label={`Remove ${item.title} from cart`}
                    title="Remove from cart"
                  >
                    <AiFillDelete size={28} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Card */}
          <div className="max-w-sm mx-auto mt-12 p-6 bg-zinc-900 rounded-2xl shadow-lg text-zinc-100">
            <div className="flex justify-between mb-3 text-lg font-medium">
              <span>📚 Book Count:</span>
              <span>{bookCount}</span>
            </div>
            <div className="flex justify-between mb-6 text-lg font-medium">
              <span>💰 Total Amount:</span>
              <span>₹ {total}</span>
            </div>
            <button
              onClick={PlaceOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Place Your Order
            </button>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
};

export default Cart;
