import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const UpdateBook = () => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    price: '',
    desc: '',
    language: ''
  });

  const [imageFile, setImageFile] = useState(null);      // New file state
  const [imagePreview, setImagePreview] = useState('');  // For previewing existing or selected image
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Preview selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/all-book-byid/${id}`);
        const book = res.data.books;

        setForm({
          title: book.title || '',
          author: book.author || '',
          price: book.price || '',
          desc: book.desc || '',
          language: book.language || ''
        });

        // Set existing image preview from backend URL
        if (book.url) {
          // Adjust this if your backend serves image differently
          const imageUrl = `http://localhost:3000${book.url.replace('/public', '')}`;
          setImagePreview(imageUrl);
        }
      } catch (error) {
        console.error('Failed to fetch book:', error);
        toast.error('Failed to fetch book details');
      }
    };

    fetchBook();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Access denied. No token found.');
      return;
    }

    if (!form.title || !form.author || !form.price || !form.desc || !form.language) {
      toast.error('Please fill in all required fields.');
      return;
    }

  try {
    setLoading(true);
    const formData = new FormData();

    if (imageFile) {
      formData.append('image', imageFile);
    }
    formData.append('title', form.title);
    formData.append('author', form.author);
    formData.append('price', form.price);
    formData.append('desc', form.desc);
    formData.append('language', form.language);

    const res = await axios.put(
      `http://localhost:3000/api/v1/update-book/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    // Update image preview with returned updatedBook.url
    if (res.data.updatedBook && res.data.updatedBook.url) {
      const updatedImageUrl = `http://localhost:3000${res.data.updatedBook.url.replace('/public', '')}`;
      setImagePreview(updatedImageUrl);
    }

    toast.success('Book updated successfully!');
    setTimeout(() => navigate(`/view-book--details/${id}`), 1500);
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Error updating book');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-zinc-800 mb-6 text-center">Update Book</h2>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-4">
          <img
            src={imagePreview}
            alt="Book Preview"
            className="w-full h-48 object-cover rounded-md border"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={form.author}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <textarea
          name="desc"
          placeholder="Description"
          value={form.desc}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="text"
          name="language"
          placeholder="Language"
          value={form.language}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold py-3 rounded-md transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-500'
          }`}
        >
          {loading ? 'Updating...' : 'Update Book'}
        </button>
      </form>
      <Toaster position="top-right" />
    </div>
  );
};

export default UpdateBook;
