import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Addbook = () => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    price: '',
    desc: '',
    language: ''
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Access denied. No token found.");
      return;
    }

    if (!imageFile) {
      toast.warn("Please select an image file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await axios.post('http://localhost:3000/api/v1/add-book', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(" Book added successfully!");
      setForm({
        title: '',
        author: '',
        price: '',
        desc: '',
        language: ''
      });
      setImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌ Error adding book");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-zinc-900 text-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-6">📚 Add a New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        <div>
          <label className="block mb-1 font-semibold">Book Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter book title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Author</label>
          <input
            type="text"
            name="author"
            placeholder="Enter author name"
            value={form.author}
            onChange={handleChange}
            required
            className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Price</label>
          <input
            type="number"
            name="price"
            placeholder="Enter price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="desc"
            placeholder="Write a short description..."
            value={form.desc}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Language</label>
          <input
            type="text"
            name="language"
            placeholder="Enter language"
            value={form.language}
            onChange={handleChange}
            required
            className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold py-2 rounded-lg transition duration-200"
        >
          Add Book
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Addbook;
