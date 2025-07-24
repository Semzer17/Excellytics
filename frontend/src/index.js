import React from 'react';
import ReactDOM from 'react-dom/client';
// Import the CSS file here
import '../src/App.css'; 
import App from '../src/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);