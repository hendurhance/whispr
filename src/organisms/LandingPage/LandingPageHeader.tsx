import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../atoms/Logo';
import NavLink from '../../molecules/NavLink';
import AuthButtons from '../../molecules/AuthButtons';
import Button from '../../atoms/Button';
import useLinks from '../../hooks/useLinks';

/**
 * Landing page header with responsive menu and navigation
 */
const LandingPageHeader: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  
  // Get navigation links from the hook
  const { landingNavLinks } = useLinks();
  
  // Track viewport width for responsive design
  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  
  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
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

  // Responsive layout classifications
  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;
  const isDesktop = viewportWidth >= 1024;

  return (
    <header className="py-4 px-4 md:px-8 flex justify-between items-center sticky top-0 bg-background-darkest/95 backdrop-blur-lg z-50 border-b border-overlay-light">
      <Logo />
      
      {/* Mobile menu overlay */}
      {menuOpen && !isDesktop && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
      
      {/* Navigation - show by default on desktop, conditionally on mobile/tablet */}
      {/* For tablet: only show auth buttons, hide navigation */}
      {(isDesktop || (!isTablet && (isMobile ? menuOpen : true))) && (
        <nav 
          className={`
            ${!isDesktop ? 'fixed top-16 right-0 w-64 max-w-full h-[calc(100vh-64px)] bg-background-darkest border-l border-overlay-light p-6 shadow-lg z-50' : ''}
            ${isDesktop ? 'static w-auto h-auto bg-transparent shadow-none p-0 border-0' : ''}
            transition-all duration-300
            ${!isDesktop && !menuOpen ? 'translate-x-full' : 'translate-x-0'}
          `}
        >
          <ul className={`flex ${!isDesktop ? 'flex-col gap-6' : 'flex-row gap-8'}`}>
            {landingNavLinks.map((link, index) => (
              <li key={index}>
                <NavLink href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.text}
                </NavLink>
              </li>
            ))}
          </ul>
          
          {/* Mobile auth buttons (in nav menu) */}
          {!isDesktop && (
            <div className="mt-6 flex flex-col gap-4">
              <Button variant="secondary" onClick={() => navigate('/auth')}>Log In</Button>
              <Button variant="primary" onClick={() => navigate('/auth')}>Sign Up</Button>
            </div>
          )}
        </nav>
      )}
      
      {/* Auth buttons */}
      <div className={`${isMobile ? 'hidden' : 'flex items-center gap-3'}`}>
        {/* Only show outside of nav on desktop and tablet */}
        {(isDesktop || isTablet) && <AuthButtons />}
      </div>
      
      {/* Mobile/Tablet menu toggle button - hide on tablet */}
      {!isDesktop && !isTablet && (
        <button 
          className="flex items-center justify-center w-10 h-10 text-2xl text-text rounded-full border-none bg-background-card hover:bg-background-highlight focus:outline-none transition-colors" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      )}
    </header>
  );
};

export default LandingPageHeader;