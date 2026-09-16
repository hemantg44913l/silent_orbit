import React, { useState } from 'react';
import { Recycle, Lock, Mail, User as UserIcon, CheckCircle2, AlertCircle, Loader2, ArrowRight, Sparkles, ShieldCheck, Globe, Truck, MapPin } from 'lucide-react';
import { api } from '../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export default function AuthView({ onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('partner');

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid email address (e.g. user@gmail.com).'
      });
      return;
    }

    if (!password || !PASSWORD_REGEX.test(password)) {
      setStatusMessage({
        type: 'error',
        text: 'Password must be at least 8 characters long and include an uppercase letter, lowercase letter, a number, and a special character (!@#$%^&*).'
      });
      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (isSignup) {
        result = await api.registerUser({
          name: name || cleanEmail.split('@')[0],
          email: cleanEmail,
          password,
          role
        });
      } else {
        result = await api.loginUser({
          email: cleanEmail,
          password
        });
      }

      const userObj = result.user;
      localStorage.setItem('texloop_user', JSON.stringify(userObj));
      localStorage.setItem('texloop_token', result.token);

      if (onLoginSuccess) {
        onLoginSuccess(userObj);
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Authentication failed. Please check your email and password.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      backgroundColor: '#0F172A'
    }}>
      {/* Left Column: Visual Hero & Platform Branding */}
      <div style={{
        background: 'linear-gradient(135deg, #064E3B 0%, #059669 50%, #022C22 100%)',
        padding: 'var(--space-12)',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow ambient circle */}
        <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)', top: '-150px', left: '-150px', pointerEvents: 'none' }} />

        {/* Top Branding Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/assets/loomora_icon.png" 
            alt="Loomora Icon" 
            style={{ height: '48px', width: 'auto', objectFit: 'contain' }} 
          />
          <div>
            <h1 style={{ color: 'white', fontSize: '1.75rem', margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>LOOMORA</h1>
            <span style={{ fontSize: 'var(--font-size-xs)', color: '#A7F3D0', fontWeight: 600 }}>CIRCULAR FASHION TECH</span>
          </div>
        </div>

        {/* Center Content Brief */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '520px', zIndex: 1 }}>
          <div className="badge badge-accent" style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
            <ShieldCheck size={14} /> MongoDB Database Protected
          </div>

          <h2 style={{ color: 'white', fontSize: 'var(--font-size-3xl)', lineHeight: '1.15' }}>
            Intelligent Fiber Routing & Recycler Matching Engine
          </h2>

          <p style={{ color: '#E8F0EA', fontSize: 'var(--font-size-base)', lineHeight: '1.6' }}>
            Connect post-consumer garments, commercial textile scrap, and municipal drop points to optimal fiber recyclers using MongoDB persistence and OpenStreetMap 3D navigation.
          </p>

          <div className="grid-2" style={{ marginTop: 'var(--space-2)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ color: '#A7F3D0', fontSize: 'var(--font-size-xs)', fontWeight: 700, textTransform: 'uppercase' }}>Active Hubs</div>
              <div style={{ color: 'white', fontSize: 'var(--font-size-xl)', fontWeight: 800, marginTop: '2px' }}>50,000+ kg/mo</div>
            </div>
            <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ color: '#A7F3D0', fontSize: 'var(--font-size-xs)', fontWeight: 700, textTransform: 'uppercase' }}>Target Impact</div>
              <div style={{ color: 'white', fontSize: 'var(--font-size-xl)', fontWeight: 800, marginTop: '2px' }}>100% Diversion</div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.7)', display: 'flex', gap: 'var(--space-4)' }}>
          <span>✓ OpenStreetMap 3D</span>
          <span>✓ OSRM Route Telematics</span>
          <span>✓ MongoDB Atlas</span>
        </div>
      </div>

      {/* Right Column: Authentication Form Card */}
      <div style={{
        padding: 'var(--space-12) var(--space-8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC'
      }}>
        <div className="card card-glass" style={{
          width: '100%',
          maxWidth: '440px',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)'
        }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-secondary)' }}>
              {isSignup ? 'Create Partner Account' : 'Partner Sign In'}
            </h2>
            <p className="caption" style={{ marginTop: '4px' }}>
              {isSignup ? 'Register your organization to access MongoDB route optimization.' : 'Sign in to access your circular textile dashboard and MongoDB orders.'}
            </p>
          </div>

          {statusMessage && (
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-xs)',
              background: statusMessage.type === 'success' ? '#D1FAE5' : '#FEE2E2',
              color: statusMessage.type === 'success' ? '#065F46' : '#991B1B',
              border: statusMessage.type === 'success' ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {isSignup && (
              <div className="form-group">
                <label className="label">Organization / Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)', opacity: 0.7 }} />
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Austin Garment Lab"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                    required={isSignup}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)', opacity: 0.7 }} />
                <input
                  type="email"
                  className="input"
                  placeholder="user@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)', opacity: 0.7 }} />
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                Must be 8+ chars with uppercase, lowercase, number & special char (!@#$).
              </span>
            </div>

            {isSignup && (
              <div className="form-group">
                <label className="label">Account Role</label>
                <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="partner">Industrial Supplier / Brand Partner</option>
                  <option value="user">Individual Waste Generator</option>
                  <option value="vendor">Commercial Recycler / Buyer</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}
            >
              {isLoading ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
              <span>{isLoading ? (isSignup ? 'Creating Account...' : 'Signing In...') : (isSignup ? 'Register Account' : 'Sign In')}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          <div style={{ textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {isSignup ? 'Already have an account?' : "Don't have an account in MongoDB?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setStatusMessage(null);
              }}
              style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer', padding: 0 }}
            >
              {isSignup ? 'Sign in' : 'Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
