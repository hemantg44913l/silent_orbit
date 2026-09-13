import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Check, 
  Image as ImageIcon, 
  DollarSign, 
  Sparkles, 
  Recycle, 
  MapPin, 
  Scissors, 
  Truck, 
  CheckCircle2, 
  Edit3, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Building2, 
  Clock, 
  Layers, 
  Award, 
  Loader2,
  ExternalLink,
  Navigation,
  AlertCircle,
  Camera
} from 'lucide-react';
import ImagePlaceholder from './ImagePlaceholder';
import LocationSearch from './LocationSearch';
import GoogleMapView from './GoogleMapView';
import { useScrollReveal, handleCardMouseMove, handleCardMouseLeave } from '../hooks/useScrollReveal';
import { api } from '../services/api';

export default function ActionFlow({ onBackToDashboard, onNavigateToVision, onTrackOrder }) {
  // Activate bidirectional scroll reveal engine
  useScrollReveal();

  // Stepper State (1: Add Image, 2: Choose Path, 3: Details, 4: Review, 5: Recommendation)
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Form & Image State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('/assets/sustainable_fashion.png');
  const [selectedPath, setSelectedPath] = useState('sell'); // 'sell' | 'reuse' | 'disposal'
  
  // Live Camera Stream State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  
  // Base Functional Fields
  const [material, setMaterial] = useState('Cotton');
  const [customMaterial, setCustomMaterial] = useState('');
  const [weight, setWeight] = useState('15');
  const [condition, setCondition] = useState('Good condition');
  const [contamination, setContamination] = useState('Clean');
  const [notes, setNotes] = useState('');

  // Location Object from LocationSearch
  const [locationObj, setLocationObj] = useState({
    address: 'Austin, TX',
    latitude: 30.2672,
    longitude: -97.7431,
    placeId: ''
  });

  // Conditional Path Inputs
  const [targetPrice, setTargetPrice] = useState('1.75');
  const [pickupPref, setPickupPref] = useState('Vendor Pickup');
  const [purity, setPurity] = useState('Pure Monofiber (>95%)');

  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [availableTime, setAvailableTime] = useState('1-2 Hours');
  const [itemCategory, setItemCategory] = useState('Garment / Shirt');

  const [urgency, setUrgency] = useState('Within 3 Days');

  // Database Data States
  const [materialsList, setMaterialsList] = useState([
    'Cotton', 'Linen', 'Denim', 'Wool', 'Silk', 
    'Polyester', 'Nylon', 'Rayon', 'Acrylic', 'Blended Fabric', 'Other'
  ]);
  const [vendorsList, setVendorsList] = useState([]);
  const [collectionPoints, setCollectionPoints] = useState([]);
  const [reuseIdeas, setReuseIdeas] = useState([]);
  const [disposalOptions, setDisposalOptions] = useState([]);

  // Selected Destination & Order State
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Initial Load from Database
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [mats, cps, reuse, disposal] = await Promise.all([
          api.fetchMaterials(),
          api.fetchCollectionPoints(),
          api.fetchReuseOptions(),
          api.fetchDisposalOptions()
        ]);

        if (!isMounted) return;

        if (mats && mats.length > 0) {
          setMaterialsList(mats.map(m => m.name));
        }

        if (cps && cps.length > 0) {
          setCollectionPoints(cps);
        }

        if (reuse && reuse.length > 0) {
          setReuseIdeas(reuse.map(r => ({
            title: r.title,
            diff: r.difficulty || 'Quick (15 mins)',
            materials: Array.isArray(r.suitableMaterials) ? r.suitableMaterials.join(', ') : (r.materials || 'Assorted scrap'),
            summary: r.description || r.summary,
            image: r.image || '/assets/circular_fashion.png'
          })));
        }

        if (disposal && disposal.length > 0) {
          setDisposalOptions(disposal);
        }
      } catch (err) {
        console.error('[ActionFlow] Initial DB fetch error:', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Stop camera tracks cleanly
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  // Start live device camera WebRTC video stream
  const startCamera = async () => {
    setUploadError(null);
    setCameraError(null);
    setIsCameraActive(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera access unavailable or permission denied. Please grant camera permission in your browser or choose an image file.');
    }
  };

  // Capture photo snapshot from live video canvas
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImagePreview(dataUrl);

    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const capturedFile = new File([blob], `live_photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setImageFile(capturedFile);
      })
      .catch(() => {});

    stopCamera();
  };

  // Stop camera on unmount or step change
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Image Upload Handlers with Validation
  const handleImageChange = (e) => {
    setUploadError(null);
    stopCamera();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Image size exceeds 10MB limit.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSelectSample = (sampleUrl) => {
    setUploadError(null);
    stopCamera();
    setImageFile(null);
    setImagePreview(sampleUrl);
  };

  const handleRemoveImage = () => {
    stopCamera();
    setImageFile(null);
    setImagePreview(null);
    setUploadError(null);
  };

  // Trigger Backend Analysis & Matching
  const handleExecuteMatching = async () => {
    const numWeight = parseFloat(weight);
    if (isNaN(numWeight) || numWeight <= 0) {
      setOrderError('Please enter a valid positive weight in kilograms.');
      return;
    }

    setIsAnalyzing(true);
    setCreatedOrder(null);
    setOrderError(null);

    try {
      const finalMaterial = material === 'Other' ? (customMaterial || 'Other') : material;
      
      // 1. Persist Textile Record to Backend/Database
      const textilePayload = {
        image: imagePreview,
        selectedPath,
        material: finalMaterial,
        weightKg: numWeight,
        condition,
        contamination,
        location: locationObj.address,
        latitude: locationObj.latitude,
        longitude: locationObj.longitude,
        notes
      };

      let textileRes = null;
      try {
        textileRes = await api.submitTextile(textilePayload);
      } catch (err) {
        console.warn('[ActionFlow] Textile DB record error, using local state:', err);
      }

      // 2. Perform Database Vendor Matching
      if (selectedPath === 'sell') {
        const matchResult = await api.matchTextile({
          material: finalMaterial,
          weightKg: numWeight,
          condition,
          contamination,
          userLat: locationObj.latitude,
          userLng: locationObj.longitude
        });

        if (matchResult && matchResult.matches && matchResult.matches.length > 0) {
          const formatted = matchResult.matches.map((m, idx) => ({
            _id: m.vendorId,
            name: m.vendorName,
            match: `${m.compatibilityScore}% Match`,
            compatibilityScore: m.compatibilityScore,
            accepted: m.acceptedMaterials.join(', '),
            qtyRange: `${m.minQuantityKg} - ${m.maxQuantityKg} kg`,
            capacityKg: m.availableCapacityKg,
            dist: m.distanceKm !== null ? `${m.distanceKm} km` : 'Local Hub',
            location: m.address || m.location || 'Local Processing Center',
            latitude: m.latitude || 30.2672,
            longitude: m.longitude || -97.7431,
            capacity: `Available Capacity: ${m.availableCapacityKg} kg`,
            pickupAvailable: m.pickupAvailable,
            price: `$${(1.5 + (m.rating * 0.1)).toFixed(2)} / kg`,
            badgeClass: m.isViable ? (idx === 0 ? 'badge-success' : 'badge-primary') : 'badge-neutral'
          }));

          setVendorsList(formatted);
          if (formatted.length > 0) {
            setSelectedDestination(formatted[0]);
          }
        }
      } else if (selectedPath === 'disposal' && collectionPoints.length > 0) {
        setSelectedDestination(collectionPoints[0]);
      }
    } catch (err) {
      console.error('[ActionFlow] Matching execution error:', err);
    } finally {
      setIsAnalyzing(false);
      setStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Create Real Database Order
  const handleCreateOrder = async (vendorOrHub) => {
    setIsCreatingOrder(true);
    setOrderError(null);

    try {
      const finalMaterial = material === 'Other' ? (customMaterial || 'Other') : material;
      const destName = vendorOrHub?.name || 'Central Eco-Drop Hub';
      const destLat = vendorOrHub?.latitude || 30.2672;
      const destLng = vendorOrHub?.longitude || -97.7431;
      const destAddress = vendorOrHub?.address || vendorOrHub?.location || 'Processing Facility';

      const orderPayload = {
        vendorId: vendorOrHub?._id || null,
        vendorName: destName,
        material: finalMaterial,
        quantityKg: parseFloat(weight) || 10,
        condition,
        contamination,
        pickupLocation: {
          address: locationObj.address,
          latitude: locationObj.latitude,
          longitude: locationObj.longitude
        },
        destinationLocation: {
          address: destAddress,
          latitude: destLat,
          longitude: destLng
        },
        pickupPreference: pickupPref,
        notes: `Selected path: ${selectedPath}. Urgency: ${urgency}`
      };

      const newOrder = await api.createOrder(orderPayload);
      setCreatedOrder(newOrder);
    } catch (err) {
      console.error('[ActionFlow] Order creation failed:', err);
      setOrderError(err.message || 'Failed to create order in database. Please try again.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Paths Configuration
  const paths = [
    {
      id: 'sell',
      title: 'Sell to a Vendor',
      icon: DollarSign,
      desc: 'Connect with verified commercial buyers, fiber recyclers, and garment refurbishers for competitive payout rates.'
    },
    {
      id: 'reuse',
      title: 'Reuse It Yourself',
      icon: Sparkles,
      desc: 'Discover custom upcycling pattern guides, sewing tutorials, and creative DIY repurposing ideas.'
    },
    {
      id: 'disposal',
      title: 'Find the Best Disposal Way',
      icon: Recycle,
      desc: 'Identify the optimal zero-landfill recovery path, nearest drop bin with capacity, and eco-certified processing hubs.'
    }
  ];

  const conditionsList = [
    'Good condition', 'Usable', 'Needs repair', 'Damaged', 'Heavily damaged'
  ];

  const contaminationList = [
    'Clean', 'Slightly contaminated', 'Heavily contaminated'
  ];

  return (
    <div className="dashboard-view" style={{ width: '100%', position: 'relative' }}>
      {/* ATMOSPHERIC AMBIENT LIGHTING ORBS */}
      <div className="bg-atmosphere-glow" aria-hidden="true">
        <div className="bg-glow-orb-1" />
        <div className="bg-glow-orb-2" />
      </div>

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          type="button"
          className="btn btn-secondary"
          onClick={onBackToDashboard}
        >
          <ArrowLeft size={16} />
          <span>Exit Assistant</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="caption" style={{ fontWeight: 'var(--font-weight-semibold)' }}>Textile Action Assistant</span>
          <span className="badge badge-accent">Step {step} of 5</span>
        </div>
      </div>

      {/* STEP PROGRESS BAR */}
      <div className="card card-glass reveal-on-scroll reveal-from-left" style={{ padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {[
            { num: 1, label: 'Add Textile' },
            { num: 2, label: 'Choose Path' },
            { num: 3, label: 'Details' },
            { num: 4, label: 'Review' },
            { num: 5, label: 'Recommendation' }
          ].map((s) => (
            <div 
              key={s.num}
              onClick={() => { if (s.num < step) setStep(s.num); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                opacity: step >= s.num ? 1 : 0.4,
                cursor: s.num < step ? 'pointer' : 'default',
                transition: 'opacity var(--transition-fast)'
              }}
            >
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-full)',
                  background: step >= s.num ? 'var(--color-primary)' : 'var(--color-border)',
                  color: 'var(--color-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-bold)',
                  boxShadow: step === s.num ? '0 0 12px rgba(46, 90, 68, 0.4)' : 'none'
                }}
              >
                {step > s.num ? <Check size={14} /> : s.num}
              </div>
              <span className="caption" style={{ fontWeight: step === s.num ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)', color: step === s.num ? 'var(--color-primary)' : 'var(--color-text)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: UPLOAD TEXTILE */}
      {step === 1 && (
        <section className="card card-glow-corner card-glass reveal-on-scroll reveal-from-right" style={{ gap: 'var(--space-6)' }}>
          <div className="card-header">
            <div>
              <h2>Step 1 — Provide Textile / Product Image</h2>
              <span className="caption">Upload or select an image of the textile waste batch to initiate analysis</span>
            </div>
            <span className="badge badge-accent">Input Phase</span>
          </div>

          {/* Image Upload Dropzone */}
          <div 
            style={{ 
              border: '2px dashed rgba(226, 232, 240, 0.9)', 
              borderRadius: 'var(--radius-lg)', 
              padding: 'var(--space-8)', 
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-4)',
              position: 'relative'
            }}
          >
            {isCameraActive ? (
              <div style={{ width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ width: '100%', aspectRatio: '16/10', maxHeight: '420px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--color-primary)', background: '#000', position: 'relative' }}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(5, 150, 105, 0.9)', color: 'white' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.5s infinite' }} />
                      Live Camera View
                    </span>
                  </div>
                </div>

                {cameraError && (
                  <div style={{ padding: 'var(--space-3)', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
                    {cameraError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={capturePhoto}
                    style={{ background: '#059669', borderColor: '#059669' }}
                  >
                    <Camera size={16} />
                    <span>Snap Photo</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={stopCamera}
                  >
                    <span>Cancel Camera</span>
                  </button>
                </div>
              </div>
            ) : imagePreview ? (
              <div style={{ width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ width: '100%', aspectRatio: '16/10', maxHeight: '420px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', position: 'relative' }}>
                  <img src={imagePreview} alt="Textile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                    <Upload size={14} />
                    <span>Replace Image File</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>

                  <button type="button" className="btn btn-secondary" onClick={startCamera}>
                    <Camera size={14} />
                    <span>Take Live Photo</span>
                  </button>

                  <button type="button" className="btn btn-ghost" onClick={handleRemoveImage} style={{ color: 'var(--color-warning)' }}>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="logo-badge" style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', background: 'var(--color-accent)' }}>
                  <ImageIcon size={28} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-md)' }}>Provide Garment / Textile Image</h3>
                  <p className="caption">Upload an image file (PNG, JPG, WEBP) or snap a photo directly using your live camera</p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                    <Upload size={16} />
                    <span>Upload Image File</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>

                  <button type="button" className="btn btn-secondary" onClick={startCamera}>
                    <Camera size={16} />
                    <span>Use Live Camera</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {uploadError && (
            <div style={{ padding: 'var(--space-3)', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
              {uploadError}
            </div>
          )}

          {/* Quick Preset Sample Selection Bar */}
          <div style={{ padding: 'var(--space-4)', background: 'rgba(255, 255, 255, 0.6)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span className="caption" style={{ fontWeight: 'var(--font-weight-bold)' }}>Or pick a sample garment for quick demo testing:</span>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', paddingBottom: 'var(--space-1)' }}>
              {[
                { label: 'Sample 1: Sustainable Garments', url: '/assets/sustainable_fashion.png' },
                { label: 'Sample 2: Mixed Scrap Offcuts', url: '/assets/textile_waste.png' },
                { label: 'Sample 3: Circular Fabric Swatches', url: '/assets/circular_fashion.png' }
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample.url)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: imagePreview === sample.url ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    background: imagePreview === sample.url ? 'var(--color-accent)' : 'rgba(249, 249, 246, 0.8)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-xs)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <img src={sample.url} alt="sample" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={() => setStep(2)}
            >
              <span>Continue to Step 2</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: CHOOSE PATHWAY */}
      {step === 2 && (
        <section className="card card-glow-corner card-glass reveal-on-scroll reveal-from-left" style={{ gap: 'var(--space-6)' }}>
          <div className="card-header">
            <div>
              <h2>Step 2 — Choose What You Want to Do</h2>
              <span className="caption">Select your desired outcome for this textile batch</span>
            </div>
            <span className="badge badge-accent">Pathway Selection</span>
          </div>

          <div className="grid-3">
            {paths.map((p, idx) => {
              const Icon = p.icon;
              const isSelected = selectedPath === p.id;
              return (
                <div 
                  key={p.id}
                  className={`card card-glass card-interactive card-glow-corner delay-${idx + 1} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedPath(p.id)}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  style={{
                    borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                    background: isSelected ? 'linear-gradient(145deg, rgba(255,255,255,0.95), var(--color-accent))' : 'rgba(255, 255, 255, 0.7)',
                    borderWidth: isSelected ? '2px' : '1px',
                    position: 'relative',
                    boxShadow: isSelected ? '0 12px 28px rgba(46, 90, 68, 0.18)' : 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="logo-badge" style={{ background: isSelected ? 'var(--color-primary)' : 'rgba(249, 249, 246, 0.8)', color: isSelected ? 'var(--color-surface)' : 'var(--color-primary)' }}>
                      <Icon size={20} />
                    </div>
                    {isSelected && (
                      <span className="badge badge-primary">
                        <Check size={12} /> Selected
                      </span>
                    )}
                  </div>

                  <h3 style={{ marginTop: 'var(--space-2)' }}>{p.title}</h3>
                  <p className="caption">{p.desc}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-3)', color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)' }}>
                    <span>Select Path</span>
                    <ArrowRight size={12} style={{ transform: isSelected ? 'translateX(4px)' : 'none', transition: 'transform var(--transition-fast)' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-4)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
              <span>Continue to Textile Details</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: TEXTILE DETAILS FORM */}
      {step === 3 && (
        <section className="card card-glass reveal-on-scroll reveal-from-right" style={{ gap: 'var(--space-6)' }}>
          <div className="card-header">
            <div>
              <h2>Step 3 — Textile Specifications & Pickup Location</h2>
              <span className="caption">Provide functional fields for material, weight, condition, and search pickup location</span>
            </div>
            <span className="badge badge-accent">Specifications Form</span>
          </div>

          <div className="grid-2">
            {/* Material Selection */}
            <div className="form-group">
              <label className="label">Material Type</label>
              <select 
                className="select" 
                value={material} 
                onChange={(e) => setMaterial(e.target.value)}
              >
                {materialsList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {material === 'Other' && (
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Specify custom fabric/blend"
                  value={customMaterial}
                  onChange={(e) => setCustomMaterial(e.target.value)}
                  style={{ marginTop: 'var(--space-2)' }}
                />
              )}
            </div>

            {/* Quantity / Weight */}
            <div className="form-group">
              <label className="label">Quantity / Weight (kg)</label>
              <input 
                type="number" 
                className="input" 
                placeholder="e.g. 15"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0.5"
                step="0.5"
              />
            </div>

            {/* Condition */}
            <div className="form-group">
              <label className="label">Garment / Textile Condition</label>
              <select 
                className="select" 
                value={condition} 
                onChange={(e) => setCondition(e.target.value)}
              >
                {conditionsList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Contamination */}
            <div className="form-group">
              <label className="label">Contamination Level</label>
              <select 
                className="select" 
                value={contamination} 
                onChange={(e) => setContamination(e.target.value)}
              >
                {contaminationList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* GOOGLE MAPS LOCATION SEARCH & GEOLOCATION */}
          <div className="form-group" style={{ marginTop: 'var(--space-2)' }}>
            <label className="label">Pickup Location (Google Places Search / Use My Location)</label>
            <LocationSearch 
              locationValue={locationObj.address}
              onLocationSelect={(selectedLoc) => setLocationObj(selectedLoc)}
              placeholder="Enter pickup address or search location..."
            />
          </div>

          {/* Optional Notes */}
          <div className="form-group">
            <label className="label">Additional Notes (Optional)</label>
            <textarea 
              className="input" 
              rows={2}
              placeholder="Provide special instructions, access notes, or packaging details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* CONDITIONAL QUESTIONS BASED ON PATH */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <ShieldCheck size={18} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: 'var(--font-size-md)' }}>
                {selectedPath === 'sell' && 'Vendor Sale Parameters'}
                {selectedPath === 'reuse' && 'DIY & Upcycling Parameters'}
                {selectedPath === 'disposal' && 'Disposal & Environmental Parameters'}
              </h3>
            </div>

            {selectedPath === 'sell' && (
              <div className="grid-3">
                <div className="form-group">
                  <label className="label">Target Payout Expectation ($/kg)</label>
                  <input 
                    type="number" 
                    className="input" 
                    placeholder="1.75"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    step="0.10"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Logistics Preference</label>
                  <select className="select" value={pickupPref} onChange={(e) => setPickupPref(e.target.value)}>
                    <option value="Vendor Pickup">Vendor Pickup Needed</option>
                    <option value="Self Drop-off">Self Drop-off to Hub</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="label">Material Monofiber Purity</label>
                  <select className="select" value={purity} onChange={(e) => setPurity(e.target.value)}>
                    <option value="Pure Monofiber (>95%)">Pure Monofiber (&gt;95%)</option>
                    <option value="Blended Fabric">Blended Fabric</option>
                    <option value="Unknown / Mixed">Unknown / Mixed</option>
                  </select>
                </div>
              </div>
            )}

            {selectedPath === 'reuse' && (
              <div className="grid-3">
                <div className="form-group">
                  <label className="label">DIY Crafting Skill Level</label>
                  <select className="select" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
                    <option value="Beginner">Beginner (No Sewing)</option>
                    <option value="Intermediate">Intermediate (Basic Machine)</option>
                    <option value="Advanced">Advanced (Tailoring)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="label">Available Craft Time</label>
                  <select className="select" value={availableTime} onChange={(e) => setAvailableTime(e.target.value)}>
                    <option value="Under 30 Mins">Under 30 Mins</option>
                    <option value="1-2 Hours">1-2 Hours</option>
                    <option value="Weekend Project">Weekend Project</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="label">Item Classification</label>
                  <select className="select" value={itemCategory} onChange={(e) => setItemCategory(e.target.value)}>
                    <option value="Garment / Shirt">Garment / Shirt</option>
                    <option value="Denim / Jeans">Denim / Jeans</option>
                    <option value="Home Fabric / Sheet">Home Fabric / Sheet</option>
                    <option value="Scrap Cutoffs">Scrap Cutoffs</option>
                  </select>
                </div>
              </div>
            )}

            {selectedPath === 'disposal' && (
              <div className="grid-2">
                <div className="form-group">
                  <label className="label">Turnaround Urgency</label>
                  <select className="select" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                    <option value="Same Day">Same Day Pickup / Drop</option>
                    <option value="Within 3 Days">Within 3 Days</option>
                    <option value="Flexible / Regular Bin">Flexible / Regular Bin Slot</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-4)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button type="button" className="btn btn-primary" onClick={() => setStep(4)}>
              <span>Review Details</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: REVIEW SCREEN */}
      {step === 4 && (
        <section className="card card-glow-corner card-glass reveal-on-scroll reveal-from-left" style={{ gap: 'var(--space-6)' }}>
          <div className="card-header">
            <div>
              <h2>Step 4 — Review Summary</h2>
              <span className="caption">Confirm your input specifications before executing matching</span>
            </div>
            <span className="badge badge-accent">Review Phase</span>
          </div>

          <div className="grid-2" style={{ alignItems: 'start' }}>
            {/* Image Preview Box */}
            <div style={{ width: '100%', aspectRatio: '16/10', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)', position: 'relative', background: 'var(--color-accent)' }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Textile Review" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', color: 'var(--color-accent-text)' }}>
                  <ImageIcon size={32} style={{ color: 'var(--color-primary)', opacity: 0.7 }} />
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)' }}>No Image Provided</span>
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 'var(--space-3)', left: 'var(--space-3)' }}>
                <span className="badge badge-primary">
                  {selectedPath === 'sell' && 'Sell to Vendor'}
                  {selectedPath === 'reuse' && 'Reuse Yourself'}
                  {selectedPath === 'disposal' && 'Disposal Recovery'}
                </span>
              </div>
            </div>

            {/* Specifications Table */}
            <div className="card-body" style={{ gap: 'var(--space-3)' }}>
              <div style={{ padding: 'var(--space-4)', background: 'rgba(255, 255, 255, 0.6)', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="caption">Material:</span>
                  <strong>{material === 'Other' ? customMaterial || 'Custom Material' : material}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="caption">Total Weight:</span>
                  <strong>{weight} kg</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="caption">Condition:</span>
                  <span className="badge badge-neutral">{condition}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="caption">Contamination:</span>
                  <span className="badge badge-neutral">{contamination}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="caption">Pickup Location:</span>
                  <strong style={{ fontSize: 'var(--font-size-xs)' }}>{locationObj.address}</strong>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-4)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep(3)}>
              <Edit3 size={16} />
              <span>Edit Information</span>
            </button>

            <button 
              type="button" 
              className="btn btn-check-prices" 
              onClick={handleExecuteMatching}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Querying Database & Calculating Routes...</span>
                </>
              ) : (
                <>
                  <span>Find Best Path</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* STEP 5: RECOMMENDATION RESULTS & GOOGLE MAP */}
      {step === 5 && (
        <section className="card card-glow-corner card-glass reveal-on-scroll reveal-scale" style={{ gap: 'var(--space-6)' }}>
          <div className="card-header">
            <div>
              <h2>Step 5 — Recommended Path & Live Interactive Map</h2>
              <span className="caption">Database vendors, collection points, and Google Routes driving calculations</span>
            </div>
            <span className="badge badge-success">Optimized Results</span>
          </div>

          {/* ORDER CREATED SUCCESS CONFIRMATION BANNER */}
          {createdOrder && (
            <div style={{ padding: 'var(--space-4)', background: '#ECFDF5', border: '2px solid #059669', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <CheckCircle2 size={24} style={{ color: '#059669' }} />
                  <div>
                    <h3 style={{ margin: 0, color: '#065F46' }}>Order Created Successfully in MongoDB!</h3>
                    <span className="caption" style={{ color: '#047857' }}>Tracking ID: <strong>{createdOrder.orderId}</strong></span>
                  </div>
                </div>
                <span className="badge badge-success">{createdOrder.status}</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: '#065F46', background: 'rgba(255,255,255,0.7)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                <span><strong>Destination:</strong> {createdOrder.vendorName}</span>
                <span><strong>Weight:</strong> {createdOrder.quantityKg} kg</span>
                <span><strong>Pickup Location:</strong> {createdOrder.pickupLocation?.address}</span>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => onTrackOrder && onTrackOrder(createdOrder.orderId)}
                >
                  <Truck size={16} />
                  <span>Track Order Status</span>
                </button>
              </div>
            </div>
          )}

          {orderError && (
            <div style={{ padding: 'var(--space-3)', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <AlertCircle size={16} />
              <span>{orderError}</span>
            </div>
          )}

          {/* INTERACTIVE GOOGLE MAP VIEW */}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <h3 style={{ fontSize: 'var(--font-size-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <MapPin size={18} style={{ color: 'var(--color-primary)' }} />
                <span>Geospatial Map & Route Preview</span>
              </h3>
              <span className="caption">Click marker or vendor card to view route & navigate</span>
            </div>

            <GoogleMapView 
              pickupLocation={locationObj}
              vendors={vendorsList}
              collectionPoints={collectionPoints}
              selectedDestination={selectedDestination}
              onSelectDestination={(dest) => setSelectedDestination(dest)}
              height="380px"
            />
          </div>

          {/* PATH 1 RESULTS: SELL TO VENDOR */}
          {selectedPath === 'sell' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ padding: 'var(--space-4)', background: 'var(--color-accent)', border: '1px solid var(--color-accent-border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Award size={20} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <strong>Ranked Database Vendors ({vendorsList.length})</strong>
                    <div className="caption">Matching {material} ({weight} kg) near {locationObj.address}</div>
                  </div>
                </div>
                <span className="badge badge-primary">Database Search</span>
              </div>

              <div className="grid-1">
                {vendorsList.map((v, idx) => {
                  const isSelected = selectedDestination && (selectedDestination._id === v._id || selectedDestination.name === v.name);
                  return (
                    <div 
                      className={`card card-glass card-interactive ${isSelected ? 'card-glow-corner' : ''}`} 
                      key={idx} 
                      onClick={() => setSelectedDestination(v)}
                      style={{ 
                        padding: 'var(--space-5)', 
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        background: isSelected ? 'linear-gradient(145deg, rgba(255,255,255,0.95), var(--color-accent))' : 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <h3 style={{ fontSize: 'var(--font-size-md)' }}>{v.name}</h3>
                            <span className={`badge ${v.badgeClass}`}>{v.match}</span>
                            {idx === 0 && <span className="badge badge-primary">Hero Match</span>}
                          </div>
                          <span className="caption">{v.location} • {v.dist} away</span>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-primary)' }}>
                            {v.price}
                          </div>
                          <span className="caption">Est. Payout: ${ (parseFloat(v.price.replace(/[^0-9.]/g, '') || '1.5') * parseFloat(weight || '10')).toFixed(2) }</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-2)', background: 'rgba(249, 249, 246, 0.7)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(8px)' }}>
                        <div>
                          <span className="caption" style={{ display: 'block', fontSize: 'var(--font-size-xs)' }}>Accepted Materials</span>
                          <strong style={{ fontSize: 'var(--font-size-xs)' }}>{v.accepted}</strong>
                        </div>
                        <div>
                          <span className="caption" style={{ display: 'block', fontSize: 'var(--font-size-xs)' }}>Capacity</span>
                          <strong style={{ fontSize: 'var(--font-size-xs)' }}>{v.capacity}</strong>
                        </div>
                        <div>
                          <span className="caption" style={{ display: 'block', fontSize: 'var(--font-size-xs)' }}>Pickup Status</span>
                          <strong style={{ fontSize: 'var(--font-size-xs)' }}>{v.pickupAvailable ? 'Pickup Available' : 'Drop-off Only'}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${v.latitude},${v.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary"
                          style={{ fontSize: 'var(--font-size-xs)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} />
                          <span>Navigate</span>
                        </a>

                        <button 
                          type="button" 
                          className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateOrder(v);
                          }}
                          disabled={isCreatingOrder}
                        >
                          {isCreatingOrder ? <Loader2 size={14} className="spin" /> : <CheckCircle2 size={14} />}
                          <span>Continue with this Vendor</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PATH 2 RESULTS: REUSE YOURSELF */}
          {selectedPath === 'reuse' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ padding: 'var(--space-4)', background: 'var(--color-accent)', border: '1px solid var(--color-accent-border)', borderRadius: 'var(--radius-md)' }}>
                <strong>Recommended DIY Upcycling Projects for {material}</strong>
                <div className="caption">Tailored for {skillLevel} skill level ({availableTime})</div>
              </div>

              <div className="grid-3">
                {reuseIdeas.map((idea, idx) => (
                  <div 
                    className="card card-glass card-interactive" 
                    key={idx}
                  >
                    <ImagePlaceholder 
                      imageUrl={idea.image}
                      altText={idea.title}
                      label={idea.title}
                      aspectRatio="16 / 10"
                    />

                    <h3>{idea.title}</h3>
                    <span className="badge badge-accent">{idea.diff}</span>

                    <p className="caption" style={{ padding: 'var(--space-3)', background: 'rgba(249, 249, 246, 0.7)', borderRadius: 'var(--radius-md)' }}>
                      {idea.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PATH 3 RESULTS: BEST DISPOSAL WAY */}
          {selectedPath === 'disposal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Hierarchical Pipeline Bar */}
              <div style={{ padding: 'var(--space-4)', background: 'rgba(249, 249, 246, 0.7)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', backdropFilter: 'blur(8px)' }}>
                <span className="caption" style={{ fontWeight: 'var(--font-weight-bold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recommended Waste Diversion Hierarchy
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <div style={{ padding: 'var(--space-2) var(--space-4)', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', opacity: 0.6 }}>
                    <span className="caption">1. Reuse</span>
                  </div>
                  <span>→</span>
                  <div style={{ padding: 'var(--space-2) var(--space-4)', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', opacity: 0.6 }}>
                    <span className="caption">2. Repair</span>
                  </div>
                  <span>→</span>
                  <div style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-primary)', color: 'var(--color-surface)', borderRadius: 'var(--radius-md)', fontWeight: 'var(--font-weight-bold)', boxShadow: '0 4px 12px rgba(46, 90, 68, 0.3)' }}>
                    <span>3. Mechanical Fiber Recycle</span>
                  </div>
                  <span>→</span>
                  <div style={{ padding: 'var(--space-2) var(--space-4)', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', opacity: 0.6 }}>
                    <span className="caption">4. Thermal Energy</span>
                  </div>
                </div>
              </div>

              {/* Collection Points from Database */}
              {collectionPoints.map((cp, idx) => (
                <div 
                  className="card card-glow-corner card-glass" 
                  key={cp._id || idx}
                  style={{ border: '2px solid var(--color-primary)', background: 'linear-gradient(145deg, rgba(255,255,255,0.95), var(--color-accent))' }}
                >
                  <div className="card-header">
                    <div>
                      <span className="badge badge-success">Eco-Drop Hub</span>
                      <h3 style={{ marginTop: 'var(--space-1)' }}>{cp.name}</h3>
                      <span className="caption">Address: {cp.address}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-accent">Capacity: {cp.capacityKg ? `${cp.capacityKg} kg` : 'Optimal'}</span>
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="card-body">
                      <p className="caption" style={{ padding: 'var(--space-3)', background: 'rgba(249, 249, 246, 0.7)', borderRadius: 'var(--radius-md)' }}>
                        Direct delivery recommended for {material} ({weight} kg). Certified zero-landfill processing.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)' }}>
                        <div>✓ Accepted Fibers: <strong>{(cp.acceptedMaterials || []).join(', ') || 'All Textiles'}</strong></div>
                        <div>✓ Status: <strong>{cp.status || 'Active'}</strong></div>
                      </div>
                    </div>

                    <div>
                      <ImagePlaceholder 
                        imageUrl="/assets/clothing_collection.png"
                        altText={cp.name}
                        label={cp.name}
                        aspectRatio="16 / 9"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${cp.latitude},${cp.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: 'var(--font-size-xs)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <ExternalLink size={14} />
                      <span>Navigate</span>
                    </a>

                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => handleCreateOrder(cp)}
                      disabled={isCreatingOrder}
                    >
                      {isCreatingOrder ? <Loader2 size={14} className="spin" /> : <CheckCircle2 size={14} />}
                      <span>Reserve Drop-off Bin Slot</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BOTTOM RESET & NAVIGATION */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setStep(1);
                setCreatedOrder(null);
              }}
            >
              <RotateCcw size={16} />
              <span>Start New Search</span>
            </button>

            <button 
              type="button" 
              className="btn btn-primary"
              onClick={onBackToDashboard}
            >
              <span>Return to Main Dashboard</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
