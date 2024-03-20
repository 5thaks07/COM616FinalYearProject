import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';

// Specify the path to your .env file in the root folder
dotenv.config({ path: '../.env' });

import UserRouter from './routes/user.route.js';
import RecipeRouter from './routes/recipe.route.js';

import passport from 'passport';
import('./config/passport.js');

const app = express();

app.use(cors());
app.use(helmet());
app.use(passport.initialize());

app.use(cookieParser());
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

// Get the directory name from the current file's URL
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Route to serve images
app.get('/uploadImages/:fileName', (req, res) => {
  try {
    const fileName = req.params.fileName;
    const filePath = path.resolve(__dirname, '..', 'uploadImages', fileName);
    console.log(filePath)
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Serve the file
      res.sendFile(filePath);
      console.log(filePath)
    } else {
      // If the file does not exist, return 404
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use('/user', UserRouter);
app.use('/recipe', RecipeRouter);

export default app;
