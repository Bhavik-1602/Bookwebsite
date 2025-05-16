import React, { useEffect } from 'react';
import Home from "./pages/Home";
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllBooks from './pages/AllBooks';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import ViewBooksDetails from './components/ViewBookDetails/ViewBooksDetails';
import Favourites from './components/Profile/Favourites';
import UserOrderHistory from './components/Profile/UserOrderHistory';
import Setting from './components/Profile/Setting';
import AllOrders from './pages/AllOrders';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './store/auth';
import AddBook from './pages/AddBook';  // Corrected import
import UpdateBook from './pages/UpdateBook';

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    if (token) {
      dispatch(login({ token, role }));
    }
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/all-books' element={<AllBooks />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/cart' element={<Cart />} />
       
<Route path="/update-book/:id" element={<UpdateBook />} />

          <Route path='/view-book--details/:id' element={<ViewBooksDetails />} />

          {/* Profile Routes */}
          <Route path='/profile' element={<Profile />}>
            {role === "user" ? (
              // If the role is "user", show the Favourites page
              <Route index element={<Favourites />} />
            ) : (
              // If the role is "admin", show the AllOrders page
              <Route index element={<AllOrders />} />
            )}

            {/* Only admin users can add books */}
            {role === "admin" && (
              <Route path='add-book' element={<AddBook />} />
              
            )}
            
            <Route path='orderHistory' element={<UserOrderHistory />} />
            <Route path='settings' element={<Setting />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
