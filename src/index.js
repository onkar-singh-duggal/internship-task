// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // import router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Rendering the App component wrapped inside BrowserRouter
// BrowserRouter enables navigation and routing in the app
  <React.StrictMode>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
