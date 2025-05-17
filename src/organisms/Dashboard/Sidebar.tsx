import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import Logo from '../../atoms/Logo';
import Badge from '../../atoms/Badge';
import useLinks from '../../hooks/useLinks';

interface SidebarProps {
  unreadCount?: number;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  unreadCount = 0,
  isOpen,
  onClose
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const { dashboardNavItems, supportLinks } = useLinks();

  // Check if a nav item is active
  const isActive = (path: string) => location.pathname === path;

  // Handle logout
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Add badge count to nav items that need it
  const navItemsWithBadges = dashboardNavItems.map(item => ({
    ...item,
    badge: item.badgeKey === 'unreadCount' && unreadCount > 0 ? unreadCount : undefined
  }));

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-background-card h-full border-r border-overlay-light
          flex flex-col md:flex
          fixed md:relative
          transform transition-transform duration-300 z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-overlay-light hidden md:block">
          <Logo />
        </div>

        <nav className="p-4 flex-grow overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-text-muted text-xs font-medium uppercase mb-2 px-4">MENU</h3>
            <ul className="space-y-1">
              {navItemsWithBadges.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive(item.path)
                        ? 'bg-gradient-primary text-white'
                        : 'text-text-muted hover:bg-background-highlight hover:text-text-bright'}
                    `}
                    onClick={onClose}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge count={item.badge} variant={isActive(item.path) ? 'primary' : 'accent'} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-text-muted text-xs font-medium uppercase mb-2 px-4">SUPPORT</h3>
            <ul className="space-y-1">
              {supportLinks.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-background-highlight hover:text-text-bright transition-colors"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="p-4 border-t border-overlay-light mt-auto">
          <a
            href="#logout"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-background-highlight hover:text-text-bright transition-colors"
            onClick={handleLogout}
          >
            <span>🚪</span>
            <span>Log Out</span>
          </a>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;