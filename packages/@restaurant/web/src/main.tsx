/**
 * REACT ENTRY POINT
 * 
 * This is where React starts rendering the app to the DOM
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('📍 main.tsx loaded');

// ============================================
// RENDER APP TO DOM
// ============================================

// Get the HTML element with id="root" from index.html
const root = document.getElementById('root')

console.log('✅ root element found:', root);

if (root) {
  console.log('🚀 Rendering React App...');
  // Create React root and render App component
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('✅ React App rendered successfully');
} else {
  console.error('❌ root element not found!');
}
