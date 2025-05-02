import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import { AiFillDelete } from 'react-icons/ai';
import axios from 'axios';
import emty from "../assets/Empty Cart.jpeg";
import { useNavigate } from "react-router-dom"
const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ✅ Fetch cart data
  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/get-cart/${userId}`, { headers });
      setCart(res.data.cart || []);
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Calculate total when cart updates
  useEffect(() => {
    if (cart) {
      const totalPrice = cart.reduce((acc, item) => acc + Number(item.price || 0), 0);
      setTotal(totalPrice);
    }
  }, [cart]);



  //placeorder 

  const PlaceOrder = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
  
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.post(
        `http://localhost:3000/api/v1/place-order`,
        {
          id: userId,
          order: cart,
        },
        { headers }
      );
  
      alert(response.data.message);
      navigate("/profile/orderHistory"); // ✅ Replace with your actual route
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order");
    }
  };
  // ✅ Remove specific item from cart
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

      alert('Removed from cart: ' + res.data.message);
      fetchCart(); // refresh cart
    } catch (err) {
      console.error('Error removing from cart:', err.response?.data || err.message);
    }
  };

  // ✅ Book count based on cart length
  const bookCount = cart ? cart.length : 0;

  return (
    <>
      {!cart ? (
        <Loader />
      ) : cart.length === 0 ? (
        <div className="h-[100vh] flex items-center justify-center flex-col">
          <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">Empty Cart</h1>
          <img src={emty} alt="Empty Cart" className="lg:h-[50vh]" />
        </div>
      ) : (
        <div className="p-4">
          <h1 className="text-4xl font-semibold text-zinc-200 mb-8">Your Cart</h1>

          {cart.map((item, i) => (
            <div
              className="w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center"
              key={i}
            >
              <img src={item.url} alt={item.title} className="h-[20vh] md:h-[10vh] object-cover" />

              <div className="w-full md:w-auto px-4">
                <h1 className="text-2xl text-zinc-100 font-semibold mt-2 md:mt-0">
                  {item.title}
                </h1>
                <p className="text-zinc-300 mt-2 hidden lg:block">
                  {item.desc?.slice(0, 100)}...
                </p>
                <p className="text-zinc-300 mt-2 hidden md:block lg:hidden">
                  {item.desc?.slice(0, 65)}...
                </p>
                <p className="text-zinc-300 mt-2 block md:hidden">
                  {item.desc?.slice(0, 100)}...
                </p>
              </div>

              <div className="flex mt-4 md:mt-0 w-full md:w-auto items-center justify-between md:justify-end gap-6">
                <h2 className="text-zinc-100 text-3xl font-semibold">₹ {item.price}</h2>
                <button
                  className="bg-red-100 text-red-700 border border-red-700 rounded p-2"
                  onClick={() => removeFromCart(item._id)}
                >
                  <AiFillDelete />
                </button>
              </div>
            </div>
          ))}

          {/* ✅ Summary Card */}
          <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
            <div className="text-zinc-800 text-lg font-medium mb-2">
              📚 Book Count: {bookCount}
            </div>
            <div className="text-zinc-800 text-lg font-medium mb-4">
              💰 Total Amount: ₹ {total}
            </div>
            <div className="text-right">
            <button
  onClick={PlaceOrder}
  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
>
  Place Your Order
</button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
