import React, { ReactNode, useState } from 'react';
import Logo from '../atoms/Logo';
import Sidebar from '../organisms/Dashboard/Sidebar';

interface DashboardTemplateProps {
  children: ReactNode;
  unreadCount?: number;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ 
  children,
  unreadCount = 0
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <div className="fixed inset-0 flex bg-background-darkest">
      {/* Mobile header - visible only on mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 py-4 px-6 flex justify-between items-center border-b border-overlay-light bg-background-card md:z-40">
        <Logo />
        <button 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-background-highlight text-text-bright"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>
      
      {/* Sidebar */}
      <Sidebar
        unreadCount={unreadCount} 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
      />
      
      {/* Main content - scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable content container */}
        <div className="pt-16 md:pt-0 overflow-y-auto h-full">
          <main className="p-6 md:py-8 md:px-10 max-w-5xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;