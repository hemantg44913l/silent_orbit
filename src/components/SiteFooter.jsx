import React from 'react';
import { Recycle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SiteFooter({ onSelectNav, onFindBestPath }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Column 1: Brand & Mission */}
          <div className="footer-col-brand">
            <div className="footer-brand-title" onClick={() => onSelectNav('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img 
                src="/assets/loomora_icon.png" 
                alt="Loomora Icon" 
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }} 
              />
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>LOOMORA</span>
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', lineHeight: '1.6', color: '#94A3B8' }}>
              Waste Optimization & Circular Fashion platform connecting textile waste suppliers, municipal drop hubs, and high-tech fiber recyclers into zero-landfill recovery routes.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'var(--space-2)' }}>
              <ShieldCheck size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'white', fontWeight: 600 }}>Circular Fashion Tech Platform</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <div className="footer-col-title">Navigation</div>
            <ul className="footer-links">
              <li><button onClick={() => onSelectNav('home')}>Home</button></li>
              <li><button onClick={() => onSelectNav('track-order')}>Track Order</button></li>
              <li><button onClick={() => onSelectNav('contact-us')}>Contact Us</button></li>
              <li><button onClick={() => onSelectNav('feedback')}>Feedback</button></li>
              <li><button onClick={() => onSelectNav('about-us')}>About Us</button></li>
            </ul>
          </div>

          {/* Column 3: Product / Platform */}
          <div>
            <div className="footer-col-title">Product / Platform</div>
            <ul className="footer-links">
              <li>
                <button 
                  onClick={onFindBestPath}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontWeight: 600 }}
                >
                  <Sparkles size={14} />
                  <span>Find the Best Path</span>
                  <ArrowRight size={12} />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Loomora — Circular Fashion Tech Platform. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
            <span style={{ color: 'white', fontWeight: 600 }}>Zero-Landfill Protocol Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

