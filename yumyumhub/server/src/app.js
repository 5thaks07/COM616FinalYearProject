import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';

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

app.use(express.static('src/public'));
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

app.use('/user', UserRouter);
app.use('/recipe', RecipeRouter);

export default app;
