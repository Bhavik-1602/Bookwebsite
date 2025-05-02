import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard/BookCard'; // Ensure this is the correct path for BookCard
import Loader from '../components/Loader/Loader'; // Ensure this is the correct path for Loader

const AllBooks = () => {
  const [Data, setData] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/all-books');
        setData(response.data.books); // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []); // Empty array ensures this runs once when the component mounts

  return (
    <div className='bg-zinc-900 px-4'>
      <h4 className='text-4xl text-yellow-100'>All Books Show</h4>

      {!Data ? (
        <div className='flex items-center justify-center my-8'>
          <Loader />
        </div>
      ) : (
        <div className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {Data.map((item, i) => (
            <div key={i}>
              <BookCard data={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooks;
