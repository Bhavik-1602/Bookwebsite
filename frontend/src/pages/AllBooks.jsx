import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/BookCard/BookCard';
import Loader from '../components/Loader/Loader';

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

 


  // Fetch all books from your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';


const fetchBooks = async () => {
  try {
    setLoading(true);
    const res = await axios.get(`${API_BASE_URL}/api/v1/all-books`);
    const booksData = res.data.books || [];
    setBooks(booksData);
    setFilteredBooks(booksData);
  } catch (error) {
    console.error('Error fetching books:', error);
  } finally {
    setLoading(false);
  }
};


  // Filter books based on search query
  const filterBooks = (query) => {
    if (!query.trim()) {
      setFilteredBooks(books);
      return;
    }

    const filtered = books.filter(book => 
      book.title?.toLowerCase().includes(query.toLowerCase()) ||
      book.author?.toLowerCase().includes(query.toLowerCase()) ||
      book.genre?.toLowerCase().includes(query.toLowerCase()) ||
      book.description?.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredBooks(filtered);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks(searchQuery);
  }, [searchQuery, books]);

  return (
    <div className="bg-zinc-900 min-h-screen px-6 py-10">
      {/* Header */}
      <h2 className="text-3xl md:text-4xl font-bold text-yellow-100 text-center mb-4">
        {searchQuery ? `Search Results for "${searchQuery}"` : 'All Available Books'}
      </h2>
      
      {searchQuery && (
        <p className="text-zinc-400 text-center mb-10">
          Found {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {/* No results message for search */}
          {searchQuery && filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-zinc-600 mb-4">📚</div>
              <h3 className="text-2xl font-semibold text-zinc-300 mb-2">No books found</h3>
              <p className="text-zinc-400 mb-6">
                We couldn't find any books matching "{searchQuery}". Try different keywords.
              </p>
              <button 
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-zinc-900 rounded-full font-semibold hover:from-yellow-300 hover:to-amber-300 transition-all duration-300 transform hover:scale-105"
              >
                Go Back
              </button>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center text-zinc-400 text-lg">
              No books available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book._id} data={book} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllBooks;