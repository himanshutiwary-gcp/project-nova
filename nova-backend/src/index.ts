import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import history from 'express-history-api-fallback';
import path from 'path';

// Import API routes
import authRoutes from './api/auth/auth.routes';
import postRoutes from './api/posts/post.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Standard middleware
app.use(cors()); // A simple cors is fine now
app.use(express.json());

// --- API ROUTES ---
// All API calls will be prefixed with /api
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// --- SERVE THE FRONTEND ---
// Point to the 'dist' folder of the built frontend
const root = path.join(__dirname, '../public');
app.use(express.static(root));

// This makes sure that any non-API call is handled by the frontend's index.html
// It's crucial for a Single Page Application (SPA).
app.use(history('index.html', { root }));


app.listen(PORT, () => {
  console.log(`🚀 UNIFIED SERVER is running on http://localhost:${PORT}`);
  console.log(`Serving frontend files from: ${root}`);
});