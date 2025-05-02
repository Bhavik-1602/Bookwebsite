import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BookCard from "../BookCard/BookCard";

const Favourites = () => {
  const [favouriteBooks, setFavouriteBooks] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!userId || !token) return; // ⛔ Prevent API call if not logged in

      try {
        const response = await axios.get(`http://localhost:3000/api/v1/favourite-books/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setFavouriteBooks(response.data.favourites || []);
        console.log("Fetched favourites:", response.data.favourites);
      } catch (error) {
        console.error("Error fetching favourites:", error.response?.data || error.message);
      }
    };

    fetchFavourites();
  }, [userId, token]);

  // 🚫 Show login prompt if not logged in
  if (!userId || !token) {
    return <p className="text-white p-4">Please log in to view your favourite books.</p>;
  }

  return (
    <div className='p-4'>
   
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {favouriteBooks.length > 0 ? (
          favouriteBooks.map((items, i) => (
            <div key={i}>
              <BookCard
  data={items}
  favourite={true}
  onRemove={(removedId) =>
    setFavouriteBooks((prev) => prev.filter((book) => book._id !== removedId))
  }
/>
            </div>
          ))
        ) : (
          <p className='text-white  text-5xl font-semibold col-span-full'>No favourites found.</p>
        )}
      </div>
    </div>
  );
};

export default Favourites;
