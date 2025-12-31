
import React from 'react';
import { Link } from 'react-router-dom';

const Game2048Debug = () => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-4 text-green-500">DEBUG MODE: 2048</h1>
            <p className="mb-4">If you can see this, the Web App Frame (App.tsx) is SAFE.</p>
            <p className="mb-8">The crash is happening inside the original Game2048.tsx component.</p>
            <Link to="/" className="text-blue-400 underline">Go Home</Link>
        </div>
    );
};

export default Game2048Debug;
