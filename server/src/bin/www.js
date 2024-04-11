import dotenv from 'dotenv';
import { createServer } from 'http';
import mongoose from 'mongoose';
import chalk from 'chalk';
import app from '../app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

// Specify the path to your .env file in the root folder
dotenv.config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established successfully', chalk.green('✓'));
});

mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log(
    'MongoDB connection error. Please make sure MongoDB is running.',
    chalk.red('✗')
  );
  process.exit();
});

// Start the server
const server = createServer(app);

const io = new Server(server, {
  transports: ['websocket'],
  cors: {
    origin: process.env.CLIENT_URL,
  },
});


// middleware for socket.io to check for valid token
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    // decode token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error'));
      }
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const user = socket.decoded;
  console.log('a user connected socket id: ', socket.id);
  console.log('user: ', user);

  // join a room
  /* socket.join(user.id);
  console.log('user joined room: ', user.id); */

  // Handle messages
  socket.on('message', (message) => {
    console.log('message:', message);
    io.to(user.id).emit('message', message);
  });

  // Handle disconnect for individual clients
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// check for errors
io.on('error', (err) => {
  console.log("io err",err);
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  // stop HTTP server
  server.close(() => {
    console.log('Process terminated');
  });

  // close DB connection
  mongoose.connection.close();
});
