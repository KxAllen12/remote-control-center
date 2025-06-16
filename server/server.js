// Import required modules
import express from 'express';
import cors from 'cors';
import vmRoute from './routes/vms.js'; // Import route file

// Define which port the server will listen on
const PORT = 8080;

// Create a new Express app
const app = express();

// allow client to access the server
app.use(cors());

// for JSON parsing
app.use(express.json());

// MOUNT VM Route
app.use('/', vmRoute);

// Start listening for incoming requests
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});
