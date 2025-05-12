import React from 'react';

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, children }) => (
  <div>
    <h4 className="text-lg font-semibold mb-5 text-text-bright">{title}</h4>
    {children}
  </div>
);

export default FooterColumn;