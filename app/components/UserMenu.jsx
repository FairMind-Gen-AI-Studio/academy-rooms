"use client";

import React from 'react';
import Link from 'next/link';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import ThemeToggle from './ThemeToggle';

const UserMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  const { theme } = useTheme();
  
  // Mock user data (in a real app, this would come from authentication)
  const user = {
    name: "Mario Rossi",
    email: "mario.rossi@example.com",
    avatar: null, // This would be a URL to the user's avatar
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle clicks outside to close menu
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-secondary transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.avatar ? (
          <img 
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
            {user.name.charAt(0)}
          </div>
        )}
        <span className="hidden md:inline font-medium">{user.name}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          
          <div className="py-1">
            <Link 
              href="/profile" 
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary w-full text-left"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Profilo
            </Link>
            <Link 
              href="/settings" 
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary w-full text-left"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Impostazioni
            </Link>
          </div>
          
          <div className="border-t border-border py-1">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="text-sm">Tema</span>
              <ThemeToggle />
            </div>
          </div>
          
          <div className="border-t border-border py-1">
            <button 
              className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary w-full text-left"
              onClick={() => {
                // Handle logout in a real app
                alert("Logout (da implementare)");
                setIsOpen(false);
              }}
            >
              <LogOut className="w-4 h-4" />
              Esci
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;