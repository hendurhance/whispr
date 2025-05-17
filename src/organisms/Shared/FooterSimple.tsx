import React from 'react';
import { Link } from 'react-router-dom';
import useLinks from '../../hooks/useLinks';

interface FooterSimpleProps {
  className?: string;
}

const FooterSimple: React.FC<FooterSimpleProps> = ({ className = '' }) => {
  const { simpleFooterLinks } = useLinks();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-4 px-6 text-center text-text-muted text-sm border-t border-overlay-light ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© {currentYear} Whispr. All rights reserved.</p>
        <div className="flex gap-6">
          {simpleFooterLinks.map((link, index) => (
            link.external ? (
              <a 
                key={`footer-link-${index}`}
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-text-bright transition-colors"
              >
                {link.text}
              </a>
            ) : (
              <Link 
                key={`footer-link-${index}`}
                to={link.href} 
                className="hover:text-text-bright transition-colors"
              >
                {link.text}
              </Link>
            )
          ))}
        </div>
      </div>
    </footer>
  );
};

export default FooterSimple;