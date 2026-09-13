import React, { useState, useEffect } from 'react';
import { X, PackageCheck, Mail, MessageSquareQuote, Info, Loader2, CheckCircle2, AlertCircle, Clock, MapPin, Truck, ExternalLink, Layers, Search, Filter, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import GoogleMapView from './GoogleMapView';

export default function InfoModal({ type, onClose, initialSearchId = '' }) {
  if (!type || type === 'home') return null;

  // Track Order State
  const [searchId, setSearchId] = useState(initialSearchId || '');
  const [orderResult, setOrderResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState(null); // { type: 'success' | 'error', text }

  // Feedback Form State
  const [feedbackCategory, setFeedbackCategory] = useState('Logistics');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState(null);

  // Modal Mode State
  const [activeMode, setActiveMode] = useState(type);

  // Orders History State
  const [allOrders, setAllOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync mode with type prop
  useEffect(() => {
    setActiveMode(type);
  }, [type]);

  // Load database orders when order-details or order-history is active
  useEffect(() => {
    if (activeMode === 'order-details' || activeMode === 'order-history') {
      loadAllOrders();
    }
  }, [activeMode]);

  const loadAllOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const orders = await api.fetchAllOrders();
      setAllOrders(orders || []);
    } catch (err) {
      console.warn('Error loading orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleTrackSpecificOrder = async (ord) => {
    const targetId = typeof ord === 'string' ? ord : (ord.orderId || ord._id);
    setSearchId(targetId);
    setActiveMode('track-order');
    if (typeof ord === 'object' && ord.orderId) {
      setOrderResult(ord);
      setSearchError(null);
    } else {
      await handleSearchOrder(targetId);
    }
  };

  // Auto search if initialSearchId is provided
  useEffect(() => {
    if (type === 'track-order' && initialSearchId) {
      setSearchId(initialSearchId);
      handleSearchOrder(initialSearchId);
    }
  }, [type, initialSearchId]);

  // Track Order API Lookup
  const handleSearchOrder = async (idToSearch) => {
    const targetId = idToSearch || searchId;
    if (!targetId || !targetId.trim()) {
      setSearchError('Please enter an Order ID or Consignment Number.');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setOrderResult(null);

    try {
      const orderData = await api.getOrderById(targetId.trim());
      if (orderData) {
        setOrderResult(orderData);
      } else {
        setSearchError(`Order "${targetId}" not found in database.`);
      }
    } catch (err) {
      setSearchError(err.message || `No active consignment found for ID "${targetId}".`);
    } finally {
      setIsSearching(false);
    }
  };

  // Submit Contact Us Form
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactMessage.trim()) {
      setContactStatus({ type: 'error', text: 'Please enter your inquiry message.' });
      return;
    }

    setIsLoading(true);
    setContactStatus(null);

    try {
      await api.submitContact({
        name: contactName || 'Anonymous User',
        email: contactEmail || 'user@texloop.org',
        message: contactMessage
      });
      setContactStatus({ type: 'success', text: 'Thank you! Your inquiry has been submitted to the logistics team.' });
      setContactMessage('');
    } catch (err) {
      setContactStatus({ type: 'error', text: err.message || 'Failed to submit inquiry. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Feedback Form
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) {
      setFeedbackStatus({ type: 'error', text: 'Please enter your feedback message.' });
      return;
    }

    setIsLoading(true);
    setFeedbackStatus(null);

    try {
      await api.submitFeedback({
        category: feedbackCategory,
        message: feedbackMessage
      });
      setFeedbackStatus({ type: 'success', text: 'Thank you for your feedback! It will help optimize our circular routes.' });
      setFeedbackMessage('');
    } catch (err) {
      setFeedbackStatus({ type: 'error', text: err.message || 'Failed to submit feedback.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Status Progression Steps for Order Lifecycle
  const orderSteps = [
    { key: 'SUBMITTED', label: 'Order Submitted' },
    { key: 'MATCHED', label: 'Vendor Matched' },
    { key: 'VENDOR_ACCEPTED', label: 'Accepted' },
    { key: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled' },
    { key: 'PICKED_UP', label: 'Picked Up' },
    { key: 'PROCESSING', label: 'In Processing' },
    { key: 'COMPLETED', label: 'Completed' }
  ];

  const getStepIndex = (status) => {
    const idx = orderSteps.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div 
        className="modal-content-box" 
        style={{ 
          maxWidth: (activeMode === 'order-details' || activeMode === 'order-history') 
            ? '880px' 
            : ((activeMode === 'track-order' && orderResult) ? '720px' : '560px'), 
          maxHeight: '90vh', 
          overflowY: 'auto' 
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose} 
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* MODAL HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div className="logo-badge" style={{ width: '44px', height: '44px', flexShrink: 0 }}>
            {(activeMode === 'order-details' || activeMode === 'order-history') && <Layers size={22} />}
            {activeMode === 'track-order' && <PackageCheck size={22} />}
            {activeMode === 'contact-us' && <Mail size={22} />}
            {activeMode === 'feedback' && <MessageSquareQuote size={22} />}
            {activeMode === 'about-us' && <Info size={22} />}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>
              {(activeMode === 'order-details' || activeMode === 'order-history') && 'Order History & Database Consignments'}
              {activeMode === 'track-order' && 'Track Order & Pickup Status'}
              {activeMode === 'contact-us' && 'Contact Recycling Logistics'}
              {activeMode === 'feedback' && 'Platform Feedback & Ideas'}
              {activeMode === 'about-us' && 'About Loomora Platform'}
            </h2>
            <p className="caption" style={{ margin: 0 }}>
              {(activeMode === 'order-details' || activeMode === 'order-history') && 'Previous textile pickup orders, total count, and consignment tracking history'}
              {activeMode === 'track-order' && 'Real-time database consignment tracking & route telematics'}
              {activeMode === 'contact-us' && 'Direct line to recycling suppliers and collection hubs'}
              {activeMode === 'feedback' && 'Optimize collection routes and waste categorization'}
              {activeMode === 'about-us' && 'Zero-landfill circular fashion logistics infrastructure'}
            </p>
          </div>
        </div>

        {/* MODE 1: TRACK ORDER */}
        {activeMode === 'track-order' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {(type === 'order-details' || type === 'order-history') && (
              <button 
                type="button" 
                className="btn btn-ghost" 
                onClick={() => setActiveMode(type)}
                style={{ alignSelf: 'flex-start', padding: '2px 8px', fontSize: 'var(--font-size-xs)', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={14} />
                <span>Back to Order Details</span>
              </button>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input 
                type="text" 
                className="input" 
                placeholder="Enter Order ID (e.g. ORD-10001 or TXL-8940)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchOrder(); }}
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => handleSearchOrder()}
                disabled={isSearching}
              >
                {isSearching ? <Loader2 size={16} className="spin" /> : <PackageCheck size={16} />}
                <span>Track</span>
              </button>
            </div>

            {searchError && (
              <div style={{ padding: 'var(--space-3)', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <AlertCircle size={16} />
                <span>{searchError}</span>
              </div>
            )}

            {orderResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                {/* Order Meta Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Order ID: {orderResult.orderId}</h3>
                    <span className="caption">Created on: {new Date(orderResult.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="badge badge-success">{orderResult.status}</span>
                </div>

                {/* Status Timeline */}
                <div>
                  <span className="caption" style={{ fontWeight: 'var(--font-weight-bold)', display: 'block', marginBottom: 'var(--space-2)' }}>Consignment Lifecycle Timeline:</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
                    {orderSteps.map((stepObj, idx) => {
                      const currentIdx = getStepIndex(orderResult.status);
                      const isDone = idx <= currentIdx;
                      return (
                        <div key={stepObj.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px', textAlign: 'center', opacity: isDone ? 1 : 0.4 }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: isDone ? '#059669' : '#E5E7EB', color: isDone ? 'white' : '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
                            {isDone ? '✓' : idx + 1}
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: isDone ? 'bold' : 'normal' }}>{stepObj.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Summary */}
                <div className="grid-2" style={{ background: '#F9FAFB', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
                  <div>
                    <div><strong>Vendor / Destination:</strong> {orderResult.vendorName || 'Eco Drop Hub'}</div>
                    <div><strong>Material:</strong> {orderResult.material}</div>
                    <div><strong>Quantity:</strong> {orderResult.quantityKg} kg</div>
                  </div>
                  <div>
                    <div><strong>Pickup Preference:</strong> {orderResult.pickupPreference || 'Vendor Pickup'}</div>
                    <div><strong>Pickup Address:</strong> {orderResult.pickupLocation?.address || 'On file'}</div>
                  </div>
                </div>

                {/* Live Route Map if location coordinates exist */}
                {orderResult.pickupLocation?.latitude && orderResult.destinationLocation?.latitude && (
                  <div>
                    <span className="caption" style={{ fontWeight: 'var(--font-weight-bold)', display: 'block', marginBottom: 'var(--space-2)' }}>Logistics Route Map:</span>
                    <GoogleMapView 
                      pickupLocation={orderResult.pickupLocation}
                      selectedDestination={{
                        name: orderResult.vendorName,
                        latitude: orderResult.destinationLocation.latitude,
                        longitude: orderResult.destinationLocation.longitude,
                        address: orderResult.destinationLocation.address
                      }}
                      height="220px"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODE 2: CONTACT US */}
        {activeMode === 'contact-us' && (
          <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div className="form-group">
              <label className="label">Your Name</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. Sarah Jenkins"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label">Your Email</label>
              <input 
                type="email" 
                className="input" 
                placeholder="e.g. sarah@company.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label">Inquiry Message</label>
              <textarea 
                className="input" 
                rows={3}
                placeholder="Specify your collection inquiry or enterprise request..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                required
              />
            </div>

            {contactStatus && (
              <div style={{ padding: 'var(--space-3)', background: contactStatus.type === 'success' ? '#D1FAE5' : '#FEE2E2', border: contactStatus.type === 'success' ? '1px solid #6EE7B7' : '1px solid #FCA5A5', color: contactStatus.type === 'success' ? '#065F46' : '#991B1B', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
                {contactStatus.text}
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? <Loader2 size={16} className="spin" /> : <Mail size={16} />}
                <span>Send Inquiry</span>
              </button>
            </div>
          </form>
        )}

        {/* MODE 3: FEEDBACK */}
        {activeMode === 'feedback' && (
          <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div className="form-group">
              <label className="label">Feedback Category</label>
              <select className="select" value={feedbackCategory} onChange={(e) => setFeedbackCategory(e.target.value)}>
                <option value="Logistics">Logistics & Route Efficiency</option>
                <option value="Vendor Matching">Vendor Matching Quality</option>
                <option value="Platform Usability">Platform Usability & UI</option>
                <option value="Collection Points">Municipal Collection Points</option>
                <option value="Other">Other Suggestion</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Feedback Details</label>
              <textarea 
                className="input" 
                rows={3}
                placeholder="Share suggestions to improve our textile recycling experience..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                required
              />
            </div>

            {feedbackStatus && (
              <div style={{ padding: 'var(--space-3)', background: feedbackStatus.type === 'success' ? '#D1FAE5' : '#FEE2E2', border: feedbackStatus.type === 'success' ? '1px solid #6EE7B7' : '1px solid #FCA5A5', color: feedbackStatus.type === 'success' ? '#065F46' : '#991B1B', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
                {feedbackStatus.text}
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? <Loader2 size={16} className="spin" /> : <MessageSquareQuote size={16} />}
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        )}

        {/* MODE 4: ABOUT US */}
        {activeMode === 'about-us' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-accent)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', lineHeight: '1.6' }}>
              <strong>Loomora Circular Fashion Tech Platform</strong> is an end-to-end circular economy system connecting garment manufacturers, fashion brands, municipal collection points, and high-tech fiber recyclers.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)' }}>
              <div>✓ <strong>MongoDB Core Engine:</strong> Single source of truth for materials, vendor capacity, and collection hubs.</div>
              <div>✓ <strong>Google Maps Integration:</strong> Places autocomplete, driving distance, ETA telematics, and Google Maps directions navigation.</div>
              <div>✓ <strong>Zero-Landfill Mission:</strong> Multi-path evaluation for automated vendor sale, DIY upcycling, or municipal eco-recycling.</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
              <button type="button" className="btn btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* MODE 5: ORDER DETAILS & PREVIOUS DATABASE RECORDS */}
        {(activeMode === 'order-details' || activeMode === 'order-history') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Top Metrics Cards */}
            <div className="grid-4" style={{ gap: 'var(--space-3)' }}>
              <div style={{ padding: 'var(--space-3) var(--space-4)', background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
                <span className="caption" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Total Orders</span>
                <strong style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)' }}>{allOrders.length}</strong>
              </div>
              <div style={{ padding: 'var(--space-3) var(--space-4)', background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
                <span className="caption" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Recycled Weight</span>
                <strong style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-secondary)' }}>
                  {allOrders.reduce((sum, o) => sum + (Number(o.quantityKg) || 0), 0)} kg
                </strong>
              </div>
              <div style={{ padding: 'var(--space-3) var(--space-4)', background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
                <span className="caption" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Active Consignments</span>
                <strong style={{ fontSize: 'var(--font-size-xl)', color: '#D97706' }}>
                  {allOrders.filter(o => ['IN_TRANSIT', 'SCHEDULED', 'PROCESSING', 'SUBMITTED', 'MATCHED'].includes(o.status)).length}
                </strong>
              </div>
              <div style={{ padding: 'var(--space-3) var(--space-4)', background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
                <span className="caption" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Completed</span>
                <strong style={{ fontSize: 'var(--font-size-xl)', color: '#059669' }}>
                  {allOrders.filter(o => o.status === 'COMPLETED').length}
                </strong>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Filter by Order ID, Vendor, Material, or Location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '34px', fontSize: 'var(--font-size-xs)' }}
                />
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Filter size={14} style={{ color: 'var(--color-text-muted)' }} />
                <select 
                  className="select" 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ fontSize: 'var(--font-size-xs)', padding: 'var(--space-2) var(--space-3)' }}
                >
                  <option value="ALL">All Statuses ({allOrders.length})</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="SUBMITTED">Submitted</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            {isLoadingOrders ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto var(--space-2)' }} />
                <div>Fetching previous database orders...</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: '50vh', overflowY: 'auto', paddingRight: '4px' }}>
                {allOrders
                  .filter(o => {
                    const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;
                    const q = searchQuery.toLowerCase();
                    const matchesQuery = !q || 
                      (o.orderId && o.orderId.toLowerCase().includes(q)) ||
                      (o.vendorName && o.vendorName.toLowerCase().includes(q)) ||
                      (o.material && o.material.toLowerCase().includes(q)) ||
                      (o.pickupLocation?.address && o.pickupLocation.address.toLowerCase().includes(q));
                    return matchesStatus && matchesQuery;
                  })
                  .map((ord) => (
                    <div 
                      key={ord._id || ord.orderId} 
                      className="card card-glass" 
                      style={{ padding: 'var(--space-4)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <span className="badge badge-accent" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{ord.orderId}</span>
                          <span className="caption" style={{ fontSize: '11px' }}>
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <span className={`badge ${
                            ord.status === 'COMPLETED' ? 'badge-success' :
                            ord.status === 'IN_TRANSIT' ? 'badge-primary' :
                            'badge-neutral'
                          }`}>
                            {ord.status}
                          </span>

                          <button 
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleTrackSpecificOrder(ord)}
                            style={{ padding: '5px 12px', fontSize: 'var(--font-size-xs)' }}
                          >
                            <PackageCheck size={14} />
                            <span>Track Order</span>
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)', background: 'rgba(255,255,255,0.7)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        <div>
                          <span className="caption">Material & Quantity:</span>
                          <div><strong>{ord.material || 'Cotton'} • {ord.quantityKg} kg</strong></div>
                        </div>

                        <div>
                          <span className="caption">Recycling Vendor:</span>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <strong>{ord.vendorName || 'Recycling Hub'}</strong>
                          </div>
                        </div>

                        <div>
                          <span className="caption">Pickup Location:</span>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <strong>{ord.pickupLocation?.address || 'Pickup Point'}</strong>
                          </div>
                        </div>

                        <div>
                          <span className="caption">Est. Payout:</span>
                          <div style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{ord.estimatedPrice || '$25.00'}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                {allOrders.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                    <div>No previous orders found in database.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
