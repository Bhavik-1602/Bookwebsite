import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BookCard from "../BookCard/BookCard";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Favourites = () => {
  const [favouriteBooks, setFavouriteBooks] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!userId || !token) return;

      try {
        const response = await axios.get(`http://localhost:3000/api/v1/favourite-books/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setFavouriteBooks(response.data.favourites || []);
        toast.success("Favourites loaded successfully");
      } catch (error) {
        console.error("Error fetching favourites:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Failed to load favourites");
      }
    };

    fetchFavourites();
  }, [userId, token]);

  const handleRemove = (removedId) => {
    setFavouriteBooks((prev) => prev.filter((book) => book._id !== removedId));
    toast.info("Book removed from favourites");
  };

  if (!userId || !token) {
    return <p className="text-white p-4">Please log in to view your favourite books.</p>;
  }

  return (
    <div className='p-4'>
      <ToastContainer />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {favouriteBooks.length > 0 ? (
          favouriteBooks.map((items, i) => (
            <div key={i}>
              <BookCard
                data={items}
                favourite={true}
                onRemove={handleRemove}
              />
            </div>
          ))
        ) : (
          <p className='text-white text-5xl font-semibold col-span-full'>No favourites found.</p>
        )}
      </div>
    </div>
  );
};

export default Favourites;
