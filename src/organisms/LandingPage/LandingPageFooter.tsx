import React from 'react';
import FooterLink from "../../molecules/FooterLink";
import FooterColumn from '../../molecules/FooterColumn';
import SocialLink from "../../molecules/SocialLink";

interface FooterColumnData {
  title: string;
  links?: Array<{
    text: string;
    href: string;
    external?: boolean;
  }>;
  content?: string;
}

interface SocialLinkData {
  icon: string;
  href: string;
  label: string;
}

const LandingPageFooter: React.FC = () => {
  // Column data
  const footerColumns: FooterColumnData[] = [
    {
      title: "Whispr",
      content: "An open-source platform for anonymous messaging, built with privacy and security in mind."
    },
    {
      title: "Links",
      links: [
        { text: "Features", href: "/#features" },
        { text: "How It Works", href: "/#how-it-works" },
        { text: "Privacy", href: "/#privacy" },
        { text: "FAQ", href: "/#faq" },
        { text: "Contact", href: "/#contact" }
      ]
    },
    {
      title: "Community",
      links: [
        { text: "GitHub Repo", href: "https://github.com/whispr", external: true },
        { text: "Report a Bug", href: "https://github.com/whispr/issues", external: true },
        { text: "Contact Us", href: "mailto:support@whispr.app", external: true }
      ]
    },
    {
      title: "Legal",
      links: [
        { text: "Terms of Use", href: "/terms" },
        { text: "Privacy Policy", href: "/privacy" }
      ]
    }
  ];
  
  // Social links data
  const socialLinks: SocialLinkData[] = [
    { icon: "🐙", href: "https://github.com/hendurhance/whispr", label: "GitHub" },
    { icon: "🐦", href: "https://twitter.com/whispr", label: "Twitter" },
    { icon: "💬", href: "https://discord.gg/whispr", label: "Discord" }
  ];
  
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
        <p className="text-text-muted">© {new Date().getFullYear()} Whispr. All rights reserved.</p>
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