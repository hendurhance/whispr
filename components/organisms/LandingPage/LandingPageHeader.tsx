'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/atoms/Logo';
import NavLink from '@/components/molecules/NavLink';
import AuthButtons from '@/components/molecules/AuthButtons';
import Button from '@/components/atoms/Button';
import useLinks from '@/hooks/useLinks';
import { Menu, X } from 'lucide-react';

/**
 * Landing page header with responsive menu and navigation
 */
const LandingPageHeader: React.FC = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  
  const { landingNavLinks } = useLinks();
  
  const [viewportWidth, setViewportWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;
  const isDesktop = viewportWidth >= 1024;

  return (
    <header className="py-4 px-4 md:px-8 flex justify-between items-center sticky top-0 bg-background-darkest/95 backdrop-blur-lg z-50 border-b border-overlay-light">
      <Logo />
      
      {menuOpen && !isDesktop && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
      
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
          
          {!isDesktop && (
            <div className="mt-6 flex flex-col gap-4">
              <Button variant="secondary" onClick={() => router.push('/auth')}>Log In</Button>
              <Button variant="primary" onClick={() => router.push('/auth')}>Sign Up</Button>
            </div>
          )}
        </nav>
      )}
      
      <div className={`${isMobile ? 'hidden' : 'flex items-center gap-3'}`}>
        {(isDesktop || isTablet) && <AuthButtons />}
      </div>
      
      {!isDesktop && !isTablet && (
        <button
          className="flex items-center justify-center w-10 h-10 text-text rounded-full border-none bg-background-card hover:bg-background-highlight focus:outline-none transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}
    </header>
  );
};

export default LandingPageHeader;