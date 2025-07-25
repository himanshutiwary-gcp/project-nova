import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// IMPORTANT: Replace with your actual Google Client ID from the GCP Console

// Create a client for React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="218121396127-idv5p8g9in9gbl166urutidoi27un6u5.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-center" reverseOrder={false} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
