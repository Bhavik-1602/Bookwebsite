import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard/BookCard';
import Loader from '../components/Loader/Loader';

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/all-books');
        setBooks(res.data.books || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="bg-zinc-900 min-h-screen px-6 py-10">
      <h2 className="text-3xl md:text-4xl font-bold text-yellow-100 text-center mb-10">
        All Available Books
      </h2>

      {loading ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center text-zinc-400 text-lg">
          No books available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} data={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooks;
