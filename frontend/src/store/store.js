import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';  // Corrected typo

const store = configureStore({
  reducer: {
    auth: authReducer,  // Corrected typo
  },
});

export default store;
