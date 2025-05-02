import React, { useEffect, useState } from 'react'
import axios from "axios";
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';
const RecentlyAdded = () => {

  const [Data, setData] = useState();
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get("http://localhost:3000/api/v1/all-recent-books");
      console.log("API Response: ", response.data); // You’ll see {status, message, books}
      setData(response.data.books); // ✅ books are inside `response.data.books`
    };
    fetch();
  }, []);
  

  return (
    <div className='mt-8 px-4'>
     <h4 className='text-4xl text-yellow-100'>Recently Added Books</h4>
     
     {!Data && ( <div className='flex items-center justify-center my-8'> <Loader/></div>
     )}    
      <div className='my-8 grid  grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4'>
        
      {Data && Data.map((item, i) => (
  <div key={i}>
    <BookCard data={item} />
  </div>
))}

      </div>

    </div>
  )
}

export default RecentlyAdded