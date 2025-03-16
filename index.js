import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// import database connection
import db from './connect.js';
// Import routes
import authRoutes from './routes/auth.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

// middleware
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
    // kiểm tra kết nối db
    db.query('SELECT NOW()', (err, result) => {});
});

app.listen(8800, () => {
    console.log('Server is running on port 8800');
});
