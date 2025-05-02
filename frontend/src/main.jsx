import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Correct import for React 18
import { Provider } from "react-redux";

import App from "./App";
import "./index.css";
import store from './store/store.js';


const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Use createRoot
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
