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

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/all-book-byid/${id}`);
        setBook(res.data.books);
      } catch (error) {
        console.error('Failed to fetch book:', error);
        toast.error('Failed to fetch book details');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleFavourite = async () => {
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
    }
  };

  const handleCart = async () => {
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
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('authToken');
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

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
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="min-h-screen bg-zinc-900 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8">
          {/* Left: Book Image and Actions */}
          <div className="bg-zinc-800 rounded-lg p-4 w-full md:w-2/5 flex flex-col items-center">
            <div className="w-full h-[400px] flex items-center justify-center">
              {book?.url ? (
                <img
                  src={ 'http://localhost:3000' + book.url}
                  alt={book.title}
                  className="max-h-full object-contain rounded-md w-full"
                />
              ) : (
                <p className="text-white">No Image Available</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 flex-wrap justify-center mt-6">
              {isLoggedIn ? (
  <>
    {role !== 'admin' && (
      <>
        <button
          onClick={handleFavourite}
          className="bg-white hover:bg-red-100 text-red-600 rounded-full text-lg p-3 flex items-center"
        >
          <FaHeart />
          <span className="ml-2 hidden lg:inline">Favourite</span>
        </button>
        <button
          onClick={handleCart}
          className="bg-white hover:bg-blue-100 text-blue-600 rounded-full text-lg p-3 flex items-center"
        >
          <FaShoppingCart />
          <span className="ml-2 hidden lg:inline">Add to Cart</span>
        </button>
      </>
    )}
    {role === 'admin' && (
      <>
        <Link
          to={`/update-book/${id}`}
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-full text-lg p-3 flex items-center"
        >
          <FaEdit />
          <span className="ml-2 hidden lg:inline">Edit</span>
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-100 hover:bg-red-200 text-red-800 rounded-full text-lg p-3 flex items-center"
        >
          <FaTrash />
          <span className="ml-2 hidden lg:inline">Delete</span>
        </button>
      </>
    )}
  </>
) : (
  <p className="text-gray-300 mt-4 text-sm">Login to use favourites or cart.</p>
)}

            </div>
          </div>

          {/* Right: Book Details */}
          <div className="text-white w-full md:w-3/5">
            <h1 className="text-3xl font-bold mb-4">{book?.title || 'No Title'}</h1>
            <p className="text-lg mb-2">Author: {book?.author || 'Unknown'}</p>
            <p className="text-lg mb-2">Price: ₹{book?.price ?? 'N/A'}</p>
            <p className="text-md mb-4 whitespace-pre-wrap">{book?.desc || 'No description available.'}</p>
            <p className="text-lg mb-4 flex items-center">
              <GrLanguage className="text-xl mr-2 text-blue-400" />
              {book?.language || 'Unknown'}
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ViewBooksDetails;
