import React from 'react';
import FooterLink from "../../molecules/FooterLink";
import FooterColumn from '../../molecules/FooterColumn';
import SocialLink from "../../molecules/SocialLink";
import useLinks from '../../hooks/useLinks';

const LandingPageFooter: React.FC = () => {
  // Get links data from the hook
  const { footerColumns, socialLinks } = useLinks();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 px-4 md:px-8 bg-background-darkest border-t border-overlay-light">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {footerColumns.map((column, index) => (
          <FooterColumn key={`col-${index}`} title={column.title}>
            {column.content && (
              <p className="text-text-muted">{column.content}</p>
            )}
            {column.links && (
              <ul className="list-none">
                {column.links.map((link, linkIndex) => (
                  <li key={`link-${linkIndex}`} className="mb-2">
                    <FooterLink href={link.href} external={link.external}>
                      {link.text}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            )}
          </FooterColumn>
        ))}
      </div>
      
      <div className="mt-12 pt-5 border-t border-overlay-light flex flex-wrap justify-between items-center gap-5">
        <p className="text-text-muted">© {currentYear} Whispr. All rights reserved.</p>
        <div className="flex gap-4">
          {socialLinks.map((social, index) => (
            <SocialLink key={`social-${index}`} href={social.href} aria-label={social.label}>
              {social.icon}
            </SocialLink>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;