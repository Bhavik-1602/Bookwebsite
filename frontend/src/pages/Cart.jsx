import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import { AiFillDelete } from 'react-icons/ai';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import axios from 'axios';
import emty from "../assets/Empty Cart.jpeg";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [removingItems, setRemovingItems] = useState(new Set());

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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (bookId) => {
    setRemovingItems(prev => new Set([...prev, bookId]));
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
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  const bookCount = cart ? cart.length : 0;

  return (
    <>
      {!cart ? (
        <Loader />
      ) : cart.length === 0 ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center gap-8 px-4">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="mx-auto w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
              <FiShoppingCart className="w-12 h-12 text-slate-400" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-700 select-none">
              Your Cart is Empty
            </h1>
            <p className="text-slate-500 text-lg max-w-md">
              Looks like you haven't added any books to your cart yet. Start exploring our collection!
            </p>
          </div>
          
          <div className="relative group">
            <img 
              src={emty} 
              alt="Empty Cart" 
              className="lg:h-80 h-64 rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <span className="flex items-center gap-2">
              <HiOutlineShoppingBag className="w-5 h-5 group-hover:animate-bounce" />
              Browse Books
            </span>
          </button>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
                Shopping Cart
              </h1>
              <p className="text-slate-600 text-lg">
                {bookCount} {bookCount === 1 ? 'book' : 'books'} in your cart
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={item._id}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-indigo-200 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      {/* Book Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="h-32 w-24 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          <span className="hidden lg:inline">{item.desc?.slice(0, 120)}...</span>
                          <span className="lg:hidden">{item.desc?.slice(0, 80)}...</span>
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            Novel
                          </span>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex flex-col items-end gap-4 min-w-fit">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">₹{item.price}</div>
                          <div className="text-sm text-slate-500">per book</div>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item._id)}
                          disabled={removingItems.has(item._id)}
                          className="group/btn flex items-center gap-2 px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          {removingItems.has(item._id) ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <AiFillDelete className="w-4 h-4 group-hover/btn:animate-pulse" />
                          )}
                          <span className="text-sm font-medium">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                      Order Summary
                    </h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-600 flex items-center gap-2">
                          <FiShoppingCart className="w-4 h-4" />
                          Books ({bookCount})
                        </span>
                        <span className="font-semibold text-slate-800">₹{total}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-600">Shipping</span>
                        <span className="font-semibold text-emerald-600">FREE</span>
                      </div>
                      
                      <div className="border-t border-slate-200 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-slate-800">Total</span>
                          <span className="text-2xl font-bold text-slate-800">₹{total}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={PlaceOrder}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <HiOutlineShoppingBag className="w-5 h-5" />
                          Place Order
                        </span>
                      )}
                    </button>

                    <p className="text-xs text-slate-500 text-center mt-4">
                      By placing this order, you agree to our terms and conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
        className="mt-16"
        toastClassName="rounded-xl"
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out both;
        }
      `}</style>
    </>
  );
};

export default Cart;