// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider, ToastViewport } from './components/ui/toast'; // path to your toast file
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
        <ToastViewport /> {/* this ensures toasts appear */}
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
