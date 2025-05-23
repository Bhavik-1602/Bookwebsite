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
    <section className="w-full bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 py-16 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Heading Section */}
        <div className="text-center mb-16">
          {/* Badge */}
        

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-200 to-amber-200 mb-4">
            Recently Added Books
          </h2>
          
          {/* Subtitle */}
          <p className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover our newest arrivals and trending titles, carefully curated for book lovers like you.
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-100/30 to-transparent w-32"></div>
            <div className="mx-4 w-2 h-2 bg-yellow-100 rounded-full"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-100/30 to-transparent w-32"></div>
          </div>
        </div>

        {/* Enhanced Loader */}
        {!Data && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6">
              <Loader />
            </div>
            <div className="text-center">
              <p className="text-yellow-100 text-lg font-medium mb-2">Loading Fresh Books...</p>
              <p className="text-zinc-400 text-sm">Curating the best reads for you</p>
            </div>
          </div>
        )}

        {/* Enhanced Books Grid */}
        {Data && (
          <div className="space-y-8">
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
              <div className="text-center px-6 py-3 bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700/50">
                <div className="text-2xl font-bold text-yellow-100">{Data.length}</div>
                <div className="text-sm text-zinc-400">New Books</div>
              </div>
              <div className="text-center px-6 py-3 bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700/50">
                <div className="text-2xl font-bold text-yellow-100">📚</div>
                <div className="text-sm text-zinc-400">Fresh Content</div>
              </div>
              <div className="text-center px-6 py-3 bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700/50">
                <div className="text-2xl font-bold text-yellow-100">⭐</div>
                <div className="text-sm text-zinc-400">Trending</div>
              </div>
            </div>

            {/* Books Grid with enhanced styling */}
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Data.map((item, i) => (
                <div 
                  key={i} 
                  className="group transform hover:scale-105 transition-all duration-300"
                  style={{ 
                    animationDelay: `${i * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-100/10 to-amber-200/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                    
                    {/* Book card wrapper */}
                    <div className="relative bg-zinc-800/30 backdrop-blur-sm rounded-xl border border-zinc-700/50 group-hover:border-yellow-100/30 transition-all duration-300 overflow-hidden">
                      <BookCard data={item} />
                      
                      {/* New badge for first few items */}
                      {i < 3 && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="bg-gradient-to-r from-yellow-400 to-amber-400 text-zinc-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            NEW
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default RecentlyAdded;