import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Razorpay = () => {
  const navigate = useNavigate();
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get cart total and items from localStorage
    const total = localStorage.getItem("cartTotal");
    const items = localStorage.getItem("cartItems");
    
    if (total) {
      setCartTotal(Number(total));
    }
    
    if (items) {
      setCartItems(JSON.parse(items));
    }

    // If no cart data found, redirect back to cart
    if (!total || !items) {
      navigate("/profile/orderhistory");
    }
  }, [navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (cartTotal <= 0) {
      alert("Invalid cart total. Please go back to cart.");
      return;
    }

    setLoading(true);
    
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // Convert rupees to paise (Razorpay expects amount in paise)
      const amountInPaise = cartTotal;
      
      // 1. Create order on backend
      const { data: order } = await axios.post("http://localhost:4000/api/createOrder", {
        amount: amountInPaise,
        courseId: "book_order_" + Date.now(), // Generate unique order ID
        items: cartItems // Send cart items for reference
      });

      // 2. Set Razorpay options
      const options = {
        key: "rzp_test_Ez4TCXSxq7BxuR", // Replace with your Razorpay test/public key
        amount: order.amount,
        currency: "INR",
        name: "BookStore",
        description: `Payment for ${cartItems.length} book(s)`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verify = await axios.post("http://localhost:4000/api/verifyPayment", {
              order_id: order.id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verify.data.success) {
              // Clear cart data from localStorage after successful payment
              localStorage.removeItem("cartTotal");
              localStorage.removeItem("cartItems");
              
              alert("✅ Payment Successful!");
              navigate("/profile/orderHistory");
            } else {
              alert("❌ Payment Verification Failed!");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("❌ Payment Verification Failed!");
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "Customer",
          email: localStorage.getItem("userEmail") || "",
          contact: localStorage.getItem("userPhone") || ""
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert("Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Complete Payment</h1>
          <p className="text-slate-600">Secure payment powered by Razorpay</p>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Books ({cartItems.length})</span>
              <span className="font-medium">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Shipping</span>
              <span className="font-medium text-emerald-600">FREE</span>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-slate-800">Total</span>
              <span className="text-2xl font-bold text-slate-800">₹{cartTotal}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={loading || cartTotal <= 0}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            `Pay ₹${cartTotal} Now`
          )}
        </button>

        {/* Back to Cart Button */}
        <button
          onClick={() => navigate("/cart")}
          className="w-full text-slate-600 hover:text-slate-800 font-medium py-2 transition-colors duration-300"
        >
          ← Back to Cart
        </button>

        {/* Security Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Razorpay;