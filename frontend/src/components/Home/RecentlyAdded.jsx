import React, { useEffect, useState } from 'react';
import axios from "axios";
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';

const RecentlyAdded = () => {
  const [Data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/all-recent-books");
        console.log("API Response: ", response.data);
        setData(response.data.books);
      } catch (error) {
        console.error("Failed to fetch recently added books:", error);
      }
    };
    fetch();
  }, []);

  return (
    <section className="w-full bg-zinc-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-yellow-100">Recently Added Books</h2>
          <p className="text-gray-300 mt-2 text-sm md:text-base">
            Discover our newest arrivals and trending titles.
          </p>
        </div>

        {/* Loader */}
        {!Data && (
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        )}

        {/* Books Grid */}
        {Data && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Data.map((item, i) => (
              <BookCard key={i} data={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyAdded;
