import dotenv from 'dotenv';
import { createServer } from 'http';
import mongoose from 'mongoose';
import chalk from 'chalk';
import app from '../app.js';

// Specify the path to your .env file in the root folder
dotenv.config({ path: '../.env' });


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(
        'MongoDB connection established successfully',
        chalk.green('✓')
    );
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
