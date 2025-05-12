// DashboardTemplate.tsx
import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../atoms/Logo';

interface DashboardTemplateProps {
  children: ReactNode;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ children }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Navigation items
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Profile', path: '/profile', icon: '👤' },
    { label: 'Settings', path: '/settings', icon: '⚙️' }
  ];
  
  // Check if a nav item is active
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-background-darkest flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="md:hidden py-4 px-6 flex justify-between items-center border-b border-overlay-light bg-background-card">
        <Link to="/dashboard">
          <Logo />
        </Link>
        <button 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-background-highlight text-text-bright"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 w-64 bg-background-card border-r border-overlay-light 
          transform transition-transform duration-300 z-30
          ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-overlay-light hidden md:block">
          <Link to="/dashboard">
            <Logo />
          </Link>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.path) 
                      ? 'bg-gradient-primary text-white' 
                      : 'text-text-muted hover:bg-background-highlight hover:text-text-bright'}
                  `}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-overlay-light">
          <Link 
            to="/logout" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-background-highlight hover:text-text-bright transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // Replace with your logout logic
              localStorage.removeItem('auth_token');
              window.location.href = '/login';
            }}
          >
            <span>🚪</span>
            <span>Log Out</span>
          </Link>
        </div>
      </aside>
      
      {/* Mobile overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      
      {/* Main content */}
      <main className="flex-grow p-6 md:py-8 md:px-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardTemplate;