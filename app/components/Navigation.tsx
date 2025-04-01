"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation({ userRole = 'user' }) {
  const pathname = usePathname();
  // In development, always show admin links for testing
  const isAdmin = process.env.NODE_ENV === 'development' || userRole === 'admin';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl">
                Academy Rooms
              </Link>
            </div>
            <div className="ml-6 flex space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/' 
                    ? 'border-indigo-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Meeting Rooms
              </Link>
              
              {isAdmin && (
                <Link 
                  href="/admin/rooms" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === '/admin/rooms' 
                      ? 'border-indigo-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Room Management
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}