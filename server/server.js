require('dotenv').config();
const express = require('express');
const http = require('http'); // ضيفنا دي
const { Server } = require('socket.io'); // ضيفنا دي
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');
const Photo = require('./models/Photo');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app); // غيرنا app.listen لـ server.listen تحت
const io = new Server(server, { cors: { origin: '*' } }); // إعداد الـ Socket

app.set('io', io); // عشان نقدر نوصل للـ io من جوه الـ Controllers

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/photos/:id/comments', require('./routes/commentRoutes'));
app.use('/api/photos', require('./routes/photoRoutes'));
app.get('/api/stats', async (req, res, next) => {
  try {
    res.json({ userCount: await User.countDocuments(), photoCount: await Photo.countDocuments() });
  } catch (err) { next(err); }
});
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => server.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`)))
  .catch((err) => { console.error('DB connection failed:', err.message); process.exit(1); });