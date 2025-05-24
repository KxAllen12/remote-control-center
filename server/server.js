// Import required modules
import express from 'express';
import cors from 'cors';
import { NodeSSH } from "node-ssh";
import dotenv from 'dotenv';

dotenv.config();
// Define which port the server will listen on
const PORT = process.env.PORT || 8080;

// Start the server and handle SSH requests
const startServer = async () => {
    const app = express(); // Create a new Express app
    const ssh = new NodeSSH(); // Create a new SSH instance
    app.use(cors()); // allow client to access the server

    // Handle GET requests to /ssh
    app.get('/ssh', async (req, res) => {
        try {
            await ssh.connect({
                host: process.env.SSH_HOST,
                username: process.env.SSH_USERNAME,
                password: process.env.SSH_PASSWORD,
            });
            // Run a command on the Raspberry Pi
            const result = await ssh.execCommand('uptime');

            // Send back the output and any errors
            res.json({
                stdout: result.stdout,
                stderr: result.stderr
            });
        } catch (error) {
            // If something went wrong, respond with error
            res.status(500).json({ error: error.message });
        }
    });
    // Start listening for incoming requests
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    });
}
// Start it 
startServer();