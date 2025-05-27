// components/AdminRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { token, role } = useSelector((state) => state.auth);

  return token && role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
