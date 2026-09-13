import React from 'react';
import { 
  Home, 
  PackageCheck, 
  Mail, 
  MessageSquareQuote, 
  Info, 
  Recycle,
  User,
  X
} from 'lucide-react';

export default function Sidebar({ 
  activeNav, 
  setActiveNav, 
  mobileOpen, 
  setMobileOpen,
  onOpenLogin
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'track-order', label: 'Track Order', icon: PackageCheck },
    { id: 'contact-us', label: 'Contact Us', icon: Mail },
    { id: 'feedback', label: 'Feedback', icon: MessageSquareQuote },
    { id: 'about-us', label: 'About Us', icon: Info },
  ];

  const handleNavClick = (id) => {
    setActiveNav(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 95 }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside 
        className={`sidebar ${mobileOpen ? 'open' : ''}`}
        aria-label="Sidebar Navigation"
      >
        <div className="sidebar-top">
          {/* Logo Area */}
          <div className="sidebar-logo">
            <div className="logo-badge" aria-hidden="true">
              <Recycle size={22} />
            </div>
            <div className="logo-text-group">
              <span className="logo-title">TexLoop</span>
              <span className="logo-tagline">ReTextile Platform</span>
            </div>
            {mobileOpen && (
              <button 
                type="button"
                className="btn-icon" 
                style={{ marginLeft: 'auto' }}
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation List */}
          <nav className="sidebar-nav" aria-label="Main Menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="nav-icon" aria-hidden="true" />
                  <span className="nav-text">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User / Status Area */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="user-quick-card"
            onClick={onOpenLogin}
            aria-label="Open Login Portal"
            style={{ width: '100%', textAlign: 'left' }}
          >
            <div className="user-avatar-circle" aria-hidden="true">
              <User size={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)' }}>
                Partner Portal
              </span>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                Guest Access
              </span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
