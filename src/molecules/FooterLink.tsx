import React from 'react';
import NavLink from './NavLink';

export interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}
const FooterLink: React.FC<FooterLinkProps> = ({ href, children, external = false }) => {
  if (external) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-text-muted no-underline hover:text-text-bright transition-colors duration-300"
      >
        {children}
      </a>
    );
  }
  
  return <NavLink href={href}>{children}</NavLink>;
};

export default FooterLink;