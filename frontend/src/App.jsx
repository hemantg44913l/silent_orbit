import React, { useState, useEffect } from 'react';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import HomeDashboard from './components/HomeDashboard';
import ActionFlow from './components/ActionFlow';
import VisionLetter from './components/VisionLetter';
import LoginModal from './components/LoginModal';
import InfoModal from './components/InfoModal';
import AuthView from './components/AuthView';
import AIChatBot from './components/AIChatBot';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'action-flow' | 'vision-letter'
  const [activeNav, setActiveNav] = useState('home'); // 'home' | 'track-order' | 'contact-us' | 'feedback' | 'about-us'
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Load saved MongoDB user session on boot
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('texloop_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.warn('[App] Failed to load saved user session:', err);
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage('home');
    setActiveNav('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('texloop_user');
    localStorage.removeItem('texloop_token');
    setCurrentUser(null);
  };

  const handleFindBestPath = () => {
    setCurrentPage('action-flow');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckPrices = () => {
    setCurrentPage('vision-letter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setCurrentPage('home');
    setActiveNav('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNav = (id) => {
    if (id === 'find-path') {
      handleFindBestPath();
      return;
    }
    setActiveNav(id);
    if (currentPage !== 'home') {
      setCurrentPage('home');
    }
  };

  // Brief initial session loading check
  if (isAuthChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A', color: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <h3>TexLoop Platform Loading...</h3>
        </div>
      </div>
    );
  }

  // FIRST PAGE: MANDATORY LOGIN & SIGN IN SCREEN IF NOT AUTHENTICATED
  if (!currentUser) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  // SECOND PHASE: FULL LANDING PAGE WITH STICKY HEADER & FOOTER ONCE AUTHENTICATED
  return (
    <div className="site-wrapper">
      {/* Sticky Modern Top Header */}
      <SiteHeader
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        onFindBestPath={handleFindBestPath}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main View Router */}
      <main className="site-main">
        {currentPage === 'home' && (
          <HomeDashboard
            onFindBestPath={handleFindBestPath}
            onCheckPrices={handleCheckPrices}
            onOpenLogin={() => setIsLoginOpen(true)}
          />
        )}

        {currentPage === 'action-flow' && (
          <ActionFlow
            onBackToDashboard={handleBackToDashboard}
            onNavigateToVision={handleCheckPrices}
            onTrackOrder={(orderId) => {
              setActiveNav('track-order');
              setCurrentPage('home');
            }}
          />
        )}

        {currentPage === 'vision-letter' && (
          <VisionLetter
            onBackToDashboard={handleBackToDashboard}
          />
        )}
      </main>

      {/* Multi-column Footer */}
      <SiteFooter
        onSelectNav={handleSelectNav}
        onFindBestPath={handleFindBestPath}
      />

      {/* Login Portal Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Interactive Sidebar Info Modals (Track Order, Contact, Feedback, About Us) */}
      {activeNav !== 'home' && (
        <InfoModal
          type={activeNav}
          onClose={() => setActiveNav('home')}
        />
      )}

      {/* Floating 24/7 AI Chatbot for Doubts & Queries */}
      <AIChatBot />
    </div>
  );
}
