import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to <span className="text-primary-600">Neuron Log</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Your personal "Second Brain" for capturing structured daily shutdown reflections
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link 
            href="/signin" 
            className="btn-primary text-center py-3 px-8 text-lg"
          >
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="btn-secondary text-center py-3 px-8 text-lg"
          >
            Create Account
          </Link>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-3">Capture Your Day</h3>
            <p>Log accomplishments, blockers, priorities and loose thoughts in a structured format.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
            <p>Build a timeline of your work and see patterns emerge over time.</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-3">Clear Your Mind</h3>
            <p>End each day with a proper shutdown ritual to reduce cognitive load.</p>
          </div>
        </div>
      </div>
    </main>
  );
} 