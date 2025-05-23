import React from 'react';
import Herosection from "../../assets/OIP.png";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className='min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center px-4 md:px-8 relative overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse'></div>
        <div className='absolute top-40 right-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000'></div>
        <div className='absolute -bottom-8 left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000'></div>
      </div>

      <div className='max-w-7xl w-full flex flex-col-reverse md:flex-row items-center justify-between gap-10 py-10 relative z-10'>
        
        {/* Text Content */}
        <div className='w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left'>
          <div className='mb-4 px-4 py-2 bg-yellow-100/10 backdrop-blur-sm border border-yellow-100/20 rounded-full'>
            <span className='text-yellow-100 text-sm font-medium'>📚 Premium Book Collection</span>
          </div>
          
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-200 to-amber-200 leading-tight mb-2'>
            Discover Your Next
            <span className='block text-yellow-100 drop-shadow-lg'>Great Read</span>
          </h1>
          
          <p className='mt-6 text-lg md:text-xl text-zinc-300 leading-relaxed max-w-lg'>
            Uncover captivating stories, enriching knowledge, and endless inspiration in our curated collection of books.
          </p>
          
          <div className='mt-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto'>
            <Link 
              to="/all-books"
              className='group inline-flex items-center justify-center text-zinc-900 text-lg md:text-xl font-semibold bg-gradient-to-r from-yellow-100 to-amber-200 px-8 py-4 rounded-full hover:from-yellow-200 hover:to-amber-300 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-yellow-100/25'>
              <span>Discover Books</span>
              <svg className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
              </svg>
            </Link>
            
            <button className='inline-flex items-center justify-center text-yellow-100 text-lg md:text-xl font-semibold border-2 border-yellow-100/50 px-8 py-4 rounded-full hover:bg-yellow-100/10 hover:border-yellow-100 transition-all duration-300 backdrop-blur-sm'>
              Browse Categories
            </button>
          </div>
          
          {/* Stats */}
          <div className='mt-12 flex gap-8 text-center md:text-left'>
            <div>
              <div className='text-2xl font-bold text-yellow-100'>1000+</div>
              <div className='text-sm text-zinc-400'>Books Available</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-yellow-100'>50+</div>
              <div className='text-sm text-zinc-400'>Categories</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-yellow-100'>24/7</div>
              <div className='text-sm text-zinc-400'>Access</div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className='w-full md:w-1/2 flex justify-center relative'>
          <div className='relative group'>
            {/* Glow effect */}
            <div className='absolute -inset-4 bg-gradient-to-r from-yellow-100/20 to-amber-200/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-75'></div>
            
            {/* Image container */}
            <div className='relative bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/50 hover:border-yellow-100/30 transition-all duration-300'>
              <img 
                src={Herosection}
                alt="Book collection"
                className="w-full max-w-md md:max-w-lg lg:max-w-xl object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Floating elements */}
              <div className='absolute -top-4 -right-4 bg-yellow-100 text-zinc-900 px-3 py-1 rounded-full text-sm font-semibold shadow-lg animate-bounce'>
                New!
              </div>
              
              <div className='absolute -bottom-2 -left-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-zinc-900 px-3 py-1 rounded-full text-sm font-semibold shadow-lg'>
                Bestsellers
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Scroll indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
        <svg className='w-6 h-6 text-yellow-100/60' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
        </svg>
      </div>
    </section>
  );
};

export default Hero;