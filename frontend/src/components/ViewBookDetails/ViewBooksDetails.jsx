import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useParams } from 'react-router-dom';
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaShoppingCart, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from 'react-redux';

const ViewBooksDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/all-book-byid/${id}`);
        setData(response.data.books);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleFavourite = async () => {
    try {
      const userId = localStorage.getItem("userId"); // or from logged-in user state
      const token = localStorage.getItem("authToken");
  
      const response = await axios.put(
        "http://localhost:3000/api/v1/add-book-to-favourites",
        { bookid: id, id: userId }, // ✅ body
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ only token in headers
          },
        }
      );
  
       alert("Favourite added:", response.data);
    } catch (error) {
      console.error("Error adding to favourites:", error.response?.data || error.message);
    }
  };
  
  if (loading) return <Loader />;



  const handleCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
  
      const response = await axios.put(
        "http://localhost:3000/api/v1/add-to-cart",
        { bookid: id, id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert("Added to cart: " + response.data.message);
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
    }
  };
  
  

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    alert("Edit Book clicked (implement navigation or modal)");
  };

  const handleDelete = () => {
    // Confirm and perform delete
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if (confirmed) {
      // Perform delete logic here
      alert("Delete logic goes here.");
    }
  };

  return (
    <div className='px-6 md:px-12 py-8 bg-zinc-900 flex flex-col md:flex-row gap-8'>

      {/* Left side: Book Image and Buttons */}
      <div className='bg-zinc-800 rounded p-4 h-[88vh] w-full md:w-2/5 flex flex-col items-center justify-between'>
        <div className="flex items-center justify-center h-[80%]">
          {data?.url ? (
            <img
              src={data.url}
              alt="Book Cover"
              className='h-full max-h-[500px] object-contain rounded-md'
            />
          ) : (
            <p className="text-white">No Image Available</p>
          )}
        </div>

        {/* Button Section */}
        {isLoggedIn ? (
          <div className='flex gap-4 mt-6 flex-wrap justify-center'>
            {/* Common for both user & admin */}
            <button className='bg-white hover:bg-red-100 text-red-600 rounded-full text-xl p-3 transition duration-300 flex items-center justify-center' onClick={handleFavourite}>
              <FaHeart /> <span className='ms-2 hidden lg:block'>Favourite</span>
            </button>
            <button className='bg-white hover:bg-blue-100 text-blue-600 rounded-full text-xl p-3 transition duration-300 flex items-center justify-center' onClick={handleCart}>
              <FaShoppingCart /> <span className='ms-2 hidden lg:block'>Add to Cart</span>
            </button>

            {/* Admin-only actions */}
            {role === 'admin' && (
              <>
                <button
                  onClick={handleEdit}
                  className='bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-full text-xl p-3 transition duration-300 flex items-center justify-center'
                >
                  <FaEdit /> <span className='ms-2 hidden lg:block'>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className='bg-red-100 hover:bg-red-200 text-red-800 rounded-full text-xl p-3 transition duration-300 flex items-center justify-center'
                >
                  <FaTrash /> <span className='ms-2 hidden lg:block'>Delete</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <p className='text-gray-300 mt-6 text-sm'>Login to add to favorites or cart.</p>
        )}
      </div>

      {/* Right side: Book Details */}
      <div className='p-4 w-full md:w-3/5 text-white'>
        <h1 className="text-3xl font-bold mb-4">{data?.title || 'No Title Available'}</h1>
        <p className="text-lg mb-2">Author: {data?.author || 'Unknown'}</p>
        <p className="text-lg mb-2">Price: ₹{data?.price ?? 'N/A'}</p>
        <p className="text-md mb-4 whitespace-pre-wrap">{data?.desc || 'No description provided.'}</p>

        <p className="text-lg mb-4 flex items-center">
          <GrLanguage className="text-lg mr-2 text-blue-400" />
          {data?.language || 'Unknown'}
        </p>

        <button
          onClick={() => window.history.back()}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewBooksDetails;
