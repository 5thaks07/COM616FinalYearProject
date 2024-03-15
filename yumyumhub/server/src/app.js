import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import UserRouter from './routes/user.route.js';
import RecipeRouter from './routes/recipe.route.js';

import passport from 'passport';

const app = express();

app.use(cors());
app.use(helmet());
app.use(passport.initialize());

require('./config/passport.js');

app.use(express.static('src/public'));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', UserRouter);
app.use('/recipe', RecipeRouter);

export default app;
