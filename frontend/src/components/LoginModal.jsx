import React, { useState } from 'react';
import { X, Lock, Mail, Recycle, CheckCircle2, AlertCircle, Loader2, User as UserIcon } from 'lucide-react';
import { api } from '../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('partner');
  const [isSignup, setIsSignup] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen) return null;

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

      onClose();
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Authentication failed. Please check your credentials.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button"
          className="modal-close-btn" 
          onClick={onClose} 
          aria-label="Close modal dialog"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-primary)' }}>
            <Recycle size={20} aria-hidden="true" />
            <span className="badge badge-accent">TEXLOOP MONGODB AUTH</span>
          </div>
          <h2>{isSignup ? 'Create Account' : 'Partner Sign In'}</h2>
          <p className="caption">
            Store and retrieve your textile batch metrics, orders, and pick-up status directly in MongoDB.
          </p>
        </div>

        {statusMessage && (
          <div style={{
            padding: 'var(--space-3)',
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {isSignup && (
            <div className="form-group">
              <label className="label" htmlFor="login-name">Full Name or Organization</label>
              <input
                id="login-name"
                type="text"
                className="input"
                placeholder="e.g. Austin Apparel Recycling Co."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignup}
              />
            </div>
          )}

          <div className="form-group">
            <label className="label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="input"
              placeholder="user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-2)' }} disabled={isLoading}>
            {isLoading ? <Loader2 size={16} className="spin" /> : <Lock size={16} />}
            <span>{isLoading ? (isSignup ? 'Creating Account...' : 'Signing In...') : (isSignup ? 'Register Account' : 'Sign In')}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          {isSignup ? 'Already registered?' : "Don't have an account in MongoDB?"}{' '}
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
  );
}
