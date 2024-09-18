import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen font-serif bg-lined ${darkMode ? 'dark bg-gray-900 text-amber-50' : 'bg-amber-50 text-amber-900'}`}>
      <main className="w-full relative pb-16">
        {children}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed left-4 bottom-4 p-2 rounded-full bg-amber-100 dark:bg-gray-800 text-amber-900 dark:text-amber-50 hover:bg-amber-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="w-6 h-6" />
        </button>
        <div className="fixed right-4 bottom-4 text-sm font-handwriting">
          <p>本页面作者: LoliMashiro / Shiina</p>
          <p className="mt-1 text-xs">© 2024 LoliMashiro and Shiina. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
};

export default Layout;