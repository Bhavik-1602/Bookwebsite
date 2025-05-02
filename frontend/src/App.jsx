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

const App = () => { 

  // const dispatch = useDispatch();
  // const role = useSelector((state) = state.auth.role);

  // useEffect(( ) =>{
  //   if(
  //     localStorage.getItem("id")&&
  //     localStorage.getItem("token")&&
  //     localStorage.getItem("role")
  //   ) {
  //     dispatch(authActions.Login());
  //     dispatch(authActions.chnageRole(localStorage.getItem("role")));
      
  //   }
  // }, []);
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/all-books' element={<AllBooks />} />
          <Route path='/Signin' element={<Signin />} />
          <Route path='/Signup' element={<Signup />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/profile' element={<Profile />} >
            <Route index element = {<Favourites/>}/>
            <Route path='/profile/orderHistory' element = {<UserOrderHistory/>}/>
            <Route path='/profile/settings' element = {<Setting/>}/>
          </Route>


          <Route path='//view-book--details/:id' element={<ViewBooksDetails />} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
