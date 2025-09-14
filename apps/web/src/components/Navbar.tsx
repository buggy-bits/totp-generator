import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-slate-900/50 backdrop-blur border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
              <Shield className="w-6 h-6" />
              <span className="font-mono text-lg font-semibold">TOTP Generator</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}