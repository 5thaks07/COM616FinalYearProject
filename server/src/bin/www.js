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

let users = [];
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  const user = socket.decoded;

  // check if user already exists in the users array
  !users.some((u) => u.userId === user.id) &&
    users.push({ userId: user.id, socketId: socket.id });

  // send onlineusers to the client
  io.emit('onlineusers', users);

  // Handle chat messages for individual clients
  socket.on('sendmessage', (msg) => {
    const user = users.find((u) => u.userId === msg.recipientId);
    if (user) {
      io.to(user.socketId).emit('getmessage', msg);
    }
  });

  // Handle disconnect for individual clients
  socket.on('disconnect', () => {
    console.log('user disconnected');
    // remove the disconnected user from the users array
    users = users.filter((u) => u.userId !== user.id);

    io.emit('onlineusers', users);
  });
});

// check for errors
io.on('error', (err) => {
  console.log('io err', err);
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
