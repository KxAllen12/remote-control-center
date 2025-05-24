'use client';

// Import React hooks for managing state and side effects
import { useEffect, useState } from 'react';

// Main component for the /ssh route
export default function Home() {
    // State to store command output, error messages, and loading status
    const [stdout, setStdout] = useState(''); // Stores standard output from SSH command
    const [stderr, setStderr] = useState(''); // Stores standard error output
    const [error, setError] = useState(''); // Stores any error message from fetch
    const [loading, setLoading] = useState(true); // Tracks if data is still loadings

    useEffect(() => {
        // Call the backend API that triggers an SSH command
        fetch('http://localhost:8080/ssh')
            .then(res => res.json()) // Parse the response as JSON
            .then(data => {
                // Set the output and error from the response
                setStdout(data.stdout);
                setStderr(data.stderr);
                setLoading(false); // Mark loading as complete
            })
            .catch(err => {
                // Handle any error that occurred during fetch
                setError(err.message);
                setLoading(false);
            });
    }, []); // Empty dependency array means this runs only once

    // If still loading, show a loading message
    if (loading) return <p>Loading...</p>;

    // Render the page with results or errors
    return (
        <main className="p-4">
            <h1 className="text-xl font-bold mb-4">SSH Status</h1>
            {/* Show error if it exists */}
            {error && <p className="text-red-500">Error: {error}</p>}

            {/* Show the command output */}
            <p className="font-mono whitespace-pre">Output: {stdout}</p>

            {/* Show any stderr output in yellow */}
            {stderr && <p className="text-yellow-600 font-mono">Stderr: {stderr}</p>}
        </main>
    );
}
