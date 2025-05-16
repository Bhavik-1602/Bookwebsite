import React from 'react';
import Herosection from "../../assets/OIP.png";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className='min-h-screen bg-zinc-900 flex items-center justify-center px-4 md:px-8'>
      <div className='max-w-7xl w-full flex flex-col-reverse md:flex-row items-center justify-between gap-10 py-10'>

        {/* Text Content */}
        <div className='w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-100 leading-tight'>
            Discover Your Next Great Read
          </h1>
          <p className='mt-4 text-lg md:text-xl text-zinc-300'>
            Uncover captivating stories, enriching knowledge, and endless inspiration in our curated collection of books.
          </p>
          <Link 
            to="/all-books"
            className='mt-8 inline-block text-yellow-100 text-lg md:text-xl font-semibold border border-yellow-100 px-8 py-3 rounded-full hover:bg-yellow-100 hover:text-zinc-900 transition duration-300'>
            Discover Books
          </Link>
        </div>

        {/* Image */}
        <div className='w-full md:w-1/2 flex justify-center'>
          <img 
            src={Herosection} 
            alt="Book collection" 
            className="w-full max-w-md md:max-w-lg lg:max-w-xl object-contain"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;
