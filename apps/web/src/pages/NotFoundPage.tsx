import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-yellow-400" />
        </div>
        
        <h1 className="text-6xl font-mono font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-mono text-slate-300 mb-8">Page Not Found</h2>
        
        <p className="text-slate-400 font-mono mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-mono transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
}