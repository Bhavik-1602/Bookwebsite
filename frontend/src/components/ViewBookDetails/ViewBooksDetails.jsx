import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaShoppingCart, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewBooksDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isLoadingFav, setIsLoadingFav] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
useEffect(() => {
  if (!id || id.trim() === "") {
    toast.error("Invalid book ID");
    setLoading(false);
    return;
  }

  const fetchBook = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/all-book-byid/${id}`);
      console.log("Full response:", res.data); // 🔍 Debug here
      setBook(res.data.book); // ✅ Adjust based on actual response
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch book details");
    } finally {
      setLoading(false);
    }
  };

  fetchBook();
}, [id]);



  // const getImageUrl = () => {
  //   if (imageError) {
  //     return 'https://via.placeholder.com/400x600/f8f9fa/6c757d?text=No+Image+Available';
  //   }
  //   if (book?.url && book.url.trim() !== '') {
  //     console.log("hello")
  //     return book.url.startsWith('http') ? book.url : `http://localhost:3000${book.url}`;
  //   }
  //   return 'https://via.placeholder.com/400x600/e9ecef/495057?text=Book+Cover';
  // };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFavourite = async () => {
    setIsLoadingFav(true);
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
      await axios.put(
        "http://localhost:3000/api/v1/add-book-to-favourites",
        { bookid: id, id: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Book added to favourites!");
    } catch (error) {
      console.error("Favourite error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add to favourites");
    } finally {
      setIsLoadingFav(false);
    }
  };

  const handleCart = async () => {
    setIsLoadingCart(true);
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
      const res = await axios.put(
        "http://localhost:3000/api/v1/add-to-cart",
        { bookid: id, id: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Added to cart: " + res.data.message);
    } catch (error) {
      console.error("Cart error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    setIsLoadingDelete(true);
    const token = localStorage.getItem('authToken');

    try {
      await axios.delete(`http://localhost:3000/api/v1/delete-book`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { bookid: id },
      });

      toast.success("Book deleted successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Deletion failed");
    } finally {
      setIsLoadingDelete(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8">
          {/* Left: Book Image and Actions */}
          <div className="bg-gray-800 rounded-xl p-6 w-full md:w-2/5 flex flex-col items-center shadow-xl border border-gray-700">
            <div className="w-full h-[400px] flex items-center justify-center mb-6 relative overflow-hidden rounded-lg">
              <img
                src={book?.url}
                alt={book?.title || 'Book cover'}
                className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-300 hover:scale-105"
                onError={handleImageError}
              />
            </div>

            {/* Price Badge */}
            <div className="mb-4">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-lg font-semibold shadow-lg">
                ₹{book?.price ?? 'N/A'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap justify-center w-full">
              {isLoggedIn ? (
                <>
                  {role !== 'admin' && (
                    <>
                      <button
                        onClick={handleFavourite}
                        disabled={isLoadingFav}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg text-sm p-3 flex items-center transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none shadow-sm hover:shadow-md"
                      >
                        {isLoadingFav ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <FaHeart className="mr-2" />
                            <span className="hidden sm:inline">Favourite</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCart}
                        disabled={isLoadingCart}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg text-sm p-3 flex items-center transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none shadow-sm hover:shadow-md"
                      >
                        {isLoadingCart ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <FaShoppingCart className="mr-2" />
                            <span className="hidden sm:inline">Add to Cart</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                  {role === 'admin' && (
                    <>
                      <Link
                        to={`/update-book/${id}`}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg text-sm p-3 flex items-center transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                      >
                        <FaEdit className="mr-2" />
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                      <button
                        onClick={handleDelete}
                        disabled={isLoadingDelete}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg text-sm p-3 flex items-center transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none shadow-sm hover:shadow-md"
                      >
                        {isLoadingDelete ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <FaTrash className="mr-2" />
                            <span className="hidden sm:inline">Delete</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </>
              ) : (
                <p className="text-gray-300 text-sm text-center">Login to use favourites or cart.</p>
              )}
            </div>
          </div>

          {/* Right: Book Details */}
          <div className="text-white w-full md:w-3/5 bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white leading-tight">
              {book?.title || 'No Title'}
            </h1>

            <div className="mb-4 flex items-center">
              <span className="text-gray-100 text-lg mr-2">✍️</span>
              <p className="text-gray-100 text-lg">
                <span className="font-semibold">Author:</span> {book?.author || 'Unknown'}
              </p>
            </div>

            {book?.category && (
              <div className="mb-4">
                <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm font-medium inline-block">
                  {book.category}
                </div>
              </div>
            )}

            <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold mb-2 text-gray-100">Description:</h3>
              <p className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
                {book?.desc || 'No description available.'}
              </p>
            </div>

            <div className="mb-6 flex items-center p-3 bg-gray-700 rounded-lg border border-gray-600">
              <GrLanguage className="text-2xl mr-3 text-blue-400" />
              <p className="text-gray-100 text-lg">
                <span className="font-semibold">Language:</span> {book?.language || 'Unknown'}
              </p>
            </div>

            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ViewBooksDetails;