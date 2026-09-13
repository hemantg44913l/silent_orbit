import React, { useState, useEffect } from 'react';
import { Menu, ArrowRight, LogIn, Sparkles, UserCheck, LogOut } from 'lucide-react';

export default function TopHeader({ 
  currentPage, 
  onFindBestPath, 
  onOpenLogin,
  onToggleMobileMenu,
  currentUser = null,
  onLogout = null
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getBreadcrumb = () => {
    if (currentPage === 'action-flow') return 'Decision Assistant (Find the Best Path)';
    if (currentPage === 'vision-letter') return 'Strategic Vision Letter';
    return 'Home Dashboard';
  };

  return (
    <header className={`top-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-left">
        <button 
          type="button"
          className="mobile-menu-toggle"
          onClick={onToggleMobileMenu}
          aria-label="Open mobile navigation drawer"
        >
          <Menu size={22} />
        </button>

        {/* Breadcrumb Context Area */}
        <div className="breadcrumb-path">
          <span>TexLoop Platform</span>
          <span aria-hidden="true">/</span>
          <span className="breadcrumb-active">
            {getBreadcrumb()}
          </span>
        </div>
      </div>

      <div className="header-right">
        {/* Logged in User Profile or Login Portal Button */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(5, 150, 105, 0.1)', border: '1px solid #A7F3D0', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
              <UserCheck size={14} style={{ color: '#059669' }} />
              <span style={{ fontWeight: 600, color: '#065F46' }}>{currentUser.name || currentUser.email}</span>
              <span className="badge badge-success" style={{ fontSize: '10px', padding: '1px 5px' }}>{currentUser.role || 'Partner'}</span>
            </div>
            <button 
              type="button"
              className="btn btn-ghost"
              onClick={onLogout}
              title="Sign Out of MongoDB Session"
              style={{ padding: '6px 10px', color: 'var(--color-warning)' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={onOpenLogin}
            aria-label="Open Login Portal"
          >
            <LogIn size={16} aria-hidden="true" />
            <span>Login Portal</span>
          </button>
        )}

        {/* Primary CTA */}
        <button 
          type="button"
          className="btn btn-check-prices"
          onClick={onFindBestPath}
          aria-label="Find the Best Path - Open Decision Assistant"
        >
          <Sparkles size={16} aria-hidden="true" />
          <span>Find the Best Path</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
