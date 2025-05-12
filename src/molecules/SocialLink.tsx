import { FooterLinkProps } from "./FooterLink";

const SocialLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-background-card flex items-center justify-center hover:bg-background-highlight hover:-translate-y-1 hover:shadow-glow-sm transition-all duration-300"
    aria-label={typeof children === 'string' ? children : 'Social media link'}
  >
    {children}
  </a>
);

export default SocialLink;