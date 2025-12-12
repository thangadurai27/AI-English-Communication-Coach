import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';

const PageLayout = ({ children, maxWidth = '7xl' }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  
  const maxWidths = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light via-white to-primary-light/10 
      dark:from-background-dark dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className={`container mx-auto px-4 py-8 ${maxWidths[maxWidth]}`}>
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;
