import React from 'react';

interface FooterSimpleProps {
  className?: string;
}

const FooterSimple: React.FC<FooterSimpleProps> = ({ className = '' }) => {
  return (
    <footer className={`py-4 px-6 text-center text-text-muted text-sm border-t border-overlay-light ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} Whispr. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/terms" className="hover:text-text-bright transition-colors">Terms</a>
          <a href="/privacy" className="hover:text-text-bright transition-colors">Privacy</a>
          <a href="https://github.com/hendurhance/whispr" target="_blank" rel="noopener noreferrer" className="hover:text-text-bright transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSimple;