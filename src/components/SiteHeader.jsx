import React, { useState } from 'react';
import { Recycle, Sparkles, ArrowRight, UserCheck, LogOut, LogIn, Menu, X } from 'lucide-react';

export default function SiteHeader({
  activeNav = 'home',
  onSelectNav,
  onFindBestPath,
  currentUser = null,
  onLogout,
  onOpenLogin
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (navId) => {
    onSelectNav(navId);
    setMobileMenuOpen(false);
  };

  const handleFindPathClick = () => {
    onFindBestPath();
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    onOpenLogin();
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* Brand Logo */}
        <div className="header-brand" onClick={() => handleNavClick('home')}>
          <img 
            src="/assets/loomora_icon.png" 
            alt="Loomora Icon" 
            style={{ height: '44px', width: 'auto', objectFit: 'contain' }} 
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="header-brand-text" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '-0.02em' }}>LOOMORA</span>
            <span className="header-brand-tag">CIRCULAR FASHION TECH</span>
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="header-nav">
          <span 
            className={`nav-item ${activeNav === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </span>
          <span 
            className={`nav-item ${activeNav === 'order-details' ? 'active' : ''}`}
            onClick={() => handleNavClick('order-details')}
          >
            Order Details
          </span>
          <span 
            className={`nav-item ${activeNav === 'contact-us' ? 'active' : ''}`}
            onClick={() => handleNavClick('contact-us')}
          >
            Contact Us
          </span>
          <span 
            className={`nav-item ${activeNav === 'feedback' ? 'active' : ''}`}
            onClick={() => handleNavClick('feedback')}
          >
            Feedback
          </span>
          <span 
            className={`nav-item ${activeNav === 'about-us' ? 'active' : ''}`}
            onClick={() => handleNavClick('about-us')}
          >
            About Us
          </span>
        </nav>

        {/* Right Header Actions */}
        <div className="header-actions">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--color-accent)', border: '1px solid var(--color-accent-border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
                <UserCheck size={14} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontWeight: 600, color: 'var(--color-accent-text)' }}>{currentUser.name || currentUser.email}</span>
                <span className="badge badge-primary" style={{ fontSize: '10px', padding: '1px 6px' }}>{currentUser.role || 'Partner'}</span>
              </div>

              <button 
                type="button"
                className="btn btn-ghost"
                onClick={onLogout}
                title="Sign Out of Session"
                style={{ padding: '6px 10px', color: 'var(--color-error)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={handleLoginClick}
            >
              <LogIn size={16} />
              <span>Login Portal</span>
            </button>
          )}

          <button 
            type="button"
            className="btn btn-check-prices"
            onClick={handleFindPathClick}
          >
            <Sparkles size={16} />
            <span>Find the Best Path</span>
            <ArrowRight size={14} />
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <nav className="mobile-nav-list">
            <button 
              type="button" 
              className={`mobile-nav-item ${activeNav === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
            <button 
              type="button" 
              className={`mobile-nav-item ${activeNav === 'order-details' ? 'active' : ''}`}
              onClick={() => handleNavClick('order-details')}
            >
              Order Details
            </button>
            <button 
              type="button" 
              className={`mobile-nav-item ${activeNav === 'contact-us' ? 'active' : ''}`}
              onClick={() => handleNavClick('contact-us')}
            >
              Contact Us
            </button>
            <button 
              type="button" 
              className={`mobile-nav-item ${activeNav === 'feedback' ? 'active' : ''}`}
              onClick={() => handleNavClick('feedback')}
            >
              Feedback
            </button>
            <button 
              type="button" 
              className={`mobile-nav-item ${activeNav === 'about-us' ? 'active' : ''}`}
              onClick={() => handleNavClick('about-us')}
            >
              About Us
            </button>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {!currentUser && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ width: '100%' }}
                  onClick={handleLoginClick}
                >
                  <LogIn size={16} />
                  <span>Login Portal</span>
                </button>
              )}
              <button 
                type="button" 
                className="btn btn-check-prices" 
                style={{ width: '100%' }}
                onClick={handleFindPathClick}
              >
                <Sparkles size={16} />
                <span>Find the Best Path</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

