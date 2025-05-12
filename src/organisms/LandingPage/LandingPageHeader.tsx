import React, { useState, useEffect } from 'react';
import Logo from '../../atoms/Logo';
import NavLink from '../../molecules/NavLink';
import AuthButtons from '../../molecules/AuthButtons';
import Button from '../../atoms/Button';


const LandingPageHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isBreakpointIssue, setIsBreakpointIssue] = useState<boolean>(false);
  // Handle screen resize to detect problematic breakpoint range
  useEffect(() => {
    const handleResize = () => {
      // Check if within problematic range (approximately 768px to 1024px)
      setIsBreakpointIssue(window.innerWidth > 768 && window.innerWidth < 1024);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('nav') && !target.closest('button')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="py-4 px-4 md:px-8 flex justify-between items-center sticky top-0 bg-background-darkest/95 backdrop-blur-lg z-50 border-b border-overlay-light">
      <Logo />
      
      {/* Mobile menu overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      
      <nav 
        className={`
          fixed top-16 right-0 w-64 max-w-full h-[calc(100vh-64px)] 
          bg-background-darkest border-l border-overlay-light 
          transition-all duration-300 p-6 z-50 shadow-lg 
          lg:static lg:w-auto lg:h-auto lg:bg-transparent lg:shadow-none lg:p-0 lg:border-0
          ${menuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          ${isBreakpointIssue ? 'hidden' : ''}
        `}
      >
        <ul className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <li><NavLink href="#features" onClick={() => setMenuOpen(false)}>Features</NavLink></li>
          <li><NavLink href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</NavLink></li>
          <li><NavLink href="#privacy" onClick={() => setMenuOpen(false)}>Privacy</NavLink></li>
          <li><NavLink href="#faq" onClick={() => setMenuOpen(false)}>FAQ</NavLink></li>
          <li><NavLink href="#contact" onClick={() => setMenuOpen(false)}>Contact</NavLink></li>
        </ul>
        <div className="mt-6 flex flex-col gap-4 lg:hidden">
            <Button variant="secondary" onClick={() => router.push('/login')}>Log In</Button>
            <Button variant="primary" onClick={() => router.push('/signup')}>Sign Up</Button>
        </div>
      </nav>
      
      {/* Auth buttons for desktop */}
      <div className={`hidden ${isBreakpointIssue ? 'md:block' : 'lg:block'}`}>
        <AuthButtons />
      </div>
      
      {/* Mobile menu toggle button */}
      <button 
        className="lg:hidden flex items-center justify-center w-10 h-10 text-2xl text-text rounded-full border-none bg-background-card hover:bg-background-highlight focus:outline-none transition-colors" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? '✕' : '☰'}
      </button>
    </header>
  );
};

export default LandingPageHeader;