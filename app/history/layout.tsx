import React from 'react';
import ProtectedLayout from '../components/Layout/ProtectedLayout';
import Navbar from '../components/Layout/Navbar';

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-white dark:bg-gray-800 shadow-sm py-4">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Neuron Log. All rights reserved.
          </div>
        </footer>
      </div>
    </ProtectedLayout>
  );
} 