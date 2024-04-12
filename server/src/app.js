import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';

// Specify the path to your .env file in the root folder
dotenv.config({ path: '../.env' });

import UserRouter from './routes/user.route.js';
import RecipeRouter from './routes/recipe.route.js';
import ChatRouter from './routes/chat.route.js';

import passport from 'passport';
import('./config/passport.js');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  })
);

app.use(passport.initialize());

// Middleware for JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for file uploads
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: process.env.TMPDIR,
    limits: { fileSize: process.env.UPLOAD_LIMIT_IN_MB * 1024 * 1024 },
  })
);

// serve images
app.use('/uploadImages', express.static('uploadImages'));

app.use('/user', UserRouter);
app.use('/recipe', RecipeRouter);
app.use('/chat', ChatRouter);

export default app;
