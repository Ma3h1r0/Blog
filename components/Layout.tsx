import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faHome, faBlog, faMusic, faLink } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';

type LayoutProps = {
  children: React.ReactNode;
  showNavigation?: boolean;
};

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userPreference = localStorage.getItem('colorMode')
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const colorMode = userPreference || systemPreference
    setDarkMode(colorMode === 'dark')
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('colorMode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('colorMode', 'light');
    }
  }, [darkMode]);

  const navItems = [
    { href: '/', text: '主页 — Intro', icon: faHome },
    { href: '/blog', text: '文章 — Writing', icon: faBlog },
    { href: '/covers', text: '翻唱 — Cover', icon: faMusic },
    { href: '/links', text: '链接 — Link', icon: faLink },
    // 移除了 photos 相关的项目
  ];

  return (
    <div className="min-h-screen font-serif bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark bg-lined">
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row items-start justify-center min-h-screen">
        {showNavigation && (
          <>
            <aside className="w-full md:w-1/4 mb-8 md:mb-0 md:pr-8 md:pt-12">
              <nav className="space-y-6 text-lg font-serif sticky top-20">
                <ul className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.li 
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={item.href} className={`flex items-center space-x-3 py-2 px-4 rounded-lg transition-colors ${
                        router.pathname === item.href || (item.href !== '/' && router.pathname.startsWith(item.href))
                          ? 'bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light font-bold'
                          : 'text-primary-dark dark:text-primary-light hover:bg-primary-light dark:hover:bg-primary-dark hover:bg-opacity-50 dark:hover:bg-opacity-50'
                      }`}>
                        <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                        <span>{item.text}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </aside>
            <div className="hidden md:block w-px bg-primary-light dark:bg-primary-dark self-stretch mx-4 md:mt-12"></div>
          </>
        )}
        <main className={`w-full ${showNavigation ? 'md:w-3/4' : ''}`}>
          {children}
        </main>
      </div>
      <motion.button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed right-4 bottom-4 p-2 rounded-full bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light hover:bg-primary dark:hover:bg-primary-light transition-colors"
        aria-label="Toggle dark mode"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="w-6 h-6" />
      </motion.button>
      <div className="fixed left-4 bottom-4 text-sm font-handwriting">
        <p className="mt-1 text-xs">© 2024 LoliMashiro & Shiina. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Layout;