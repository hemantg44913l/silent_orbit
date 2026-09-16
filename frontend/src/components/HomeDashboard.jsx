import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  Target, 
  Shirt, 
  Recycle, 
  HelpCircle, 
  MapPin, 
  BarChart3, 
  Sliders, 
  RefreshCw, 
  User, 
  Search, 
  CheckSquare, 
  Navigation, 
  Factory, 
  Workflow, 
  GitCommit 
} from 'lucide-react';
import ImagePlaceholder from './ImagePlaceholder';
import { useScrollReveal, handleCardMouseMove, handleCardMouseLeave } from '../hooks/useScrollReveal';

export default function HomeDashboard({ onFindBestPath, onCheckPrices, onOpenLogin }) {
  // Activate bidirectional scroll reveal engine
  useScrollReveal();

  const workflowSteps = [
    {
      num: '01',
      title: 'Textile Collection',
      icon: Factory,
      text: 'Generation of post-consumer garments or factory fabric offcuts.'
    },
    {
      num: '02',
      title: 'Fiber Classification',
      icon: Layers,
      text: 'Automated fiber identification, purity testing, and condition grading.'
    },
    {
      num: '03',
      title: 'Path Optimization',
      icon: RefreshCw,
      text: 'Optimal valorization routing: direct resale, upcycling, or fiber recycling.'
    },
    {
      num: '04',
      title: 'Collection Point Matching',
      icon: MapPin,
      text: 'Intelligent hub dispatch based on material type and available capacity.'
    },
    {
      num: '05',
      title: 'Efficient Dispatch',
      icon: Truck,
      text: 'Dynamic courier scheduling, pickup coordination, and route tracking.'
    }
  ];

  const categoryCards = [
    {
      title: 'Wearable Garments',
      badge: 'Condition: Wearable',
      icon: Shirt,
      text: 'Intact garments suitable for direct secondary market resale, donation, or sorting.'
    },
    {
      title: 'Repairable Textiles',
      badge: 'Condition: Minor Defects',
      icon: RefreshCw,
      text: 'Garments requiring minor mending, hardware replacement, or custom upcycling.'
    },
    {
      title: 'Recyclable Fiber Streams',
      badge: 'Condition: Monofiber Scrap',
      icon: Recycle,
      text: '100% cotton, polyester, wool, and denim scrap suitable for garnetting and fiber re-spinning.'
    },
    {
      title: 'Composite & Technical Scrap',
      badge: 'Condition: Composite Scrap',
      icon: Layers,
      text: 'Mixed synthetic blends, footwear, and industrial cutoffs reserved for chemical depolymerization.'
    }
  ];

  const collectionPointFactors = [
    {
      title: 'Material Accepted',
      text: 'Verification that facility accepts and processes target fiber grade.'
    },
    {
      title: 'Remaining Capacity',
      text: 'Real-time bin fill level telemetry monitoring to prevent overflow.'
    },
    {
      title: 'Distance & Proximity',
      text: 'Optimized geographic driving route calculation for minimal carbon footprint.'
    },
    {
      title: 'Accessibility',
      text: 'Operating hours, loading bay availability, and public vehicle access.'
    },
    {
      title: 'Processing Suitability',
      text: 'Matching batch size and weight against hub processing equipment specs.'
    }
  ];

  const visualJourneySteps = [
    { label: 'USER', icon: User },
    { label: 'TEXTILE ITEM', icon: Shirt },
    { label: 'CLASSIFICATION', icon: Search },
    { label: 'DISPOSAL DECISION', icon: CheckSquare },
    { label: 'COLLECTION-POINT MATCHING', icon: MapPin },
    { label: 'COLLECTION', icon: Truck },
    { label: 'TRACKING', icon: Navigation }
  ];

  return (
    <div className="dashboard-view">
      {/* 1. HERO SECTION (REFERENCE DESIGN COMPOSITION) */}
      <section className="hero-section card-glow-corner reveal-on-scroll reveal-up">
        <div className="hero-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <h1 className="hero-title">
              Textile Waste Collection & Route Optimization Platform
            </h1>

            <div className="hero-statement-box">
              [Website Introduction Placeholder]: Overview statement introducing the digital infrastructure connecting textile collection hubs, automated fiber sorting facilities, and circular fashion brands.
            </div>

            <div className="hero-actions">
              <button 
                type="button"
                className="btn-hero-primary" 
                onClick={onFindBestPath}
              >
                <span>Explore Vision & Prices</span>
                <ArrowRight size={16} />
              </button>
              <button 
                type="button"
                className="btn-hero-secondary" 
                onClick={onOpenLogin}
              >
                <span>Partner Portal Login</span>
              </button>
            </div>
          </div>

          <div className="hero-image-frame">
            <img 
              src="/assets/sustainable_fashion.png"
              alt="Sustainable Fashion Garments Rack"
            />
          </div>
        </div>
      </section>

      {/* 2. OUR MOTIVE & PROBLEM WE SOLVE (SIDE BY SIDE 2-COLUMN CARDS) */}
      <div className="motive-problem-grid">
        {/* Card 1: Our Motive */}
        <section 
          className="dashboard-card card-glass reveal-on-scroll reveal-from-left"
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          <div className="card-top-row">
            <div className="card-title-group">
              <div className="card-avatar-icon" style={{ background: '#DCFCE7', color: '#15803D' }}>
                <Target size={22} />
              </div>
              <div>
                <h2 className="card-heading">Our Motive</h2>
                <span className="card-subheading">Driving closed-loop textile circularity</span>
              </div>
            </div>
            <span className="pill-badge pill-green">
              Sustainability Motive
            </span>
          </div>

          <div className="statement-box" style={{ margin: 0, flexGrow: 1 }}>
            [Our Motive Content Placeholder]: Primary statement explaining the environmental and economic motivation behind structured textile waste recovery.
          </div>

          <div className="motive-metrics-grid">
            <div className="metric-card-sub">
              <span className="metric-card-sub-label">Motive Metric A</span>
              <span className="metric-card-sub-val">[100% Zero-Landfill Target]</span>
            </div>
            <div className="metric-card-sub">
              <span className="metric-card-sub-label">Motive Metric B</span>
              <span className="metric-card-sub-val">[50,000+ kg / Mo Capacity]</span>
            </div>
          </div>
        </section>

        {/* Card 2: Problem We Solve */}
        <section 
          className="dashboard-card card-glass reveal-on-scroll reveal-from-right"
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          <div className="card-top-row">
            <div className="card-title-group">
              <div className="card-avatar-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <h2 className="card-heading">Problem We Solve</h2>
                <span className="card-subheading">Overcoming linear waste friction</span>
              </div>
            </div>
            <span className="pill-badge pill-amber">
              Supply Chain Friction
            </span>
          </div>

          <div className="statement-box" style={{ margin: 0 }}>
            [Problem Statement Placeholder]: Quantitative breakdown detailing global fashion waste volumes, landfill overcrowding, and uncoordinated logistics channels.
          </div>

          <div className="problem-image-box">
            <img 
              src="/assets/textile_waste.png" 
              alt="Stacked Textile Scrap Bundles"
            />
          </div>
        </section>
      </div>

      {/* 3. HOW THE SYSTEM WORKS (5 SEQUENTIAL PROCESS STEPS) */}
      <section className="card card-glow-corner card-glass reveal-on-scroll reveal-from-left" style={{ padding: '32px', borderRadius: '20px' }}>
        <div className="card-header" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className="card-avatar-icon" style={{ background: '#DCFCE7', color: '#15803D' }}>
              <Workflow size={22} />
            </div>
            <div>
              <h2 className="card-heading">How the Platform Works</h2>
              <span className="caption">End-to-end 5-step collection and decision workflow</span>
            </div>
          </div>
          <span className="badge badge-accent">Sequential Process</span>
        </div>

        <div className="workflow-responsive-grid">
          {workflowSteps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div 
                key={idx} 
                className={`workflow-card-item card-glass card-interactive delay-${idx + 1}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-primary" style={{ borderRadius: 'var(--radius-full)', fontSize: '11px', padding: '2px 8px' }}>{step.num}</span>
                  <StepIcon size={18} style={{ color: 'var(--color-text-muted)' }} />
                </div>
                <h3 style={{ fontSize: '13px', marginTop: '14px', fontWeight: 700, color: '#0F172A' }}>{step.title}</h3>
                <p className="caption" style={{ fontSize: '12px', lineHeight: 1.5, marginTop: '6px' }}>{step.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. TEXTILE WASTE CATEGORIES (4 CORE STREAMS) */}
      <section className="card card-glass reveal-on-scroll reveal-from-right" style={{ padding: '32px', borderRadius: '20px' }}>
        <div className="card-header" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className="card-avatar-icon" style={{ background: '#E0F2FE', color: '#0284C7' }}>
              <Layers size={22} />
            </div>
            <div>
              <h2 className="card-heading">Textile Waste Categories</h2>
              <span className="caption">Classification schema for post-consumer and pre-consumer scrap</span>
            </div>
          </div>
          <span className="badge badge-accent">4 Core Streams</span>
        </div>

        <div className="categories-responsive-grid">
          {categoryCards.map((cat, idx) => {
            const CatIcon = cat.icon;
            return (
              <div key={idx} className="card card-glass card-interactive" style={{ padding: '22px', borderRadius: '14px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CatIcon size={18} />
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{cat.title}</h3>
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '11px' }}>{cat.badge}</span>
                </div>
                <p className="caption" style={{ fontSize: '13px', lineHeight: 1.55 }}>{cat.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. COLLECTION POINT MATCHING ENGINE */}
      <section className="card card-glow-corner card-glass reveal-on-scroll reveal-from-left" style={{ padding: '32px', borderRadius: '20px' }}>
        <div className="card-header" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className="card-avatar-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
              <MapPin size={22} />
            </div>
            <div>
              <h2 className="card-heading">Collection Point Matching Engine</h2>
              <span className="caption">5 key matching factors for optimal hub dispatch</span>
            </div>
          </div>
          <span className="badge badge-accent">Optimizer Foundation</span>
        </div>

        <div className="matching-responsive-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {collectionPointFactors.map((factor, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 18px', background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--color-primary)', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{factor.title}</h3>
                  <p className="caption" style={{ fontSize: '12px', marginTop: '3px', lineHeight: 1.45 }}>{factor.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="matching-image-frame">
            <img 
              src="/assets/clothing_collection.png"
              alt="Public Textile Drop Box Location"
            />
          </div>
        </div>
      </section>

      {/* 6. VISUAL JOURNEY / PLATFORM FLOW */}
      <section className="card card-glass reveal-on-scroll reveal-from-right" style={{ padding: '32px', borderRadius: '20px' }}>
        <div className="card-header" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className="card-avatar-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <GitCommit size={22} />
            </div>
            <div>
              <h2 className="card-heading">Lifecycle Logistics Pipeline</h2>
              <span className="caption">Complete tracking diagram from user submission to consignment dispatch</span>
            </div>
          </div>
          <span className="badge badge-accent">System Architecture Flow</span>
        </div>

        <div className="journey-scroll-box">
          <div className="journey-step-row">
            {visualJourneySteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <React.Fragment key={idx}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <StepIcon size={16} style={{ color: 'var(--color-primary)' }} />
                    <span className="caption" style={{ fontWeight: 700, fontSize: '11px', whiteSpace: 'nowrap', color: '#0F172A' }}>{step.label}</span>
                  </div>
                  {idx < visualJourneySteps.length - 1 && (
                    <span style={{ color: 'var(--color-text-subtle)', fontSize: '14px', fontWeight: 700 }}>→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FINAL STRATEGIC CTA BANNER */}
      <section className="cta-banner-card card-glow-corner card-glass reveal-on-scroll reveal-scale">
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center' }}>
          <span className="badge badge-primary">Strategic Next Step</span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#064E3B', margin: 0 }}>Find the Best Path for Your Textile Waste</h2>
          <p className="caption" style={{ color: '#065F46', fontSize: '15px', lineHeight: 1.6 }}>
            Analyze your materials, explore vendor buyback rates, access custom DIY upcycling patterns, or reserve zero-landfill drop bin slots.
          </p>

          <div style={{ display: 'flex', gap: '14px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              type="button"
              className="btn btn-check-prices"
              onClick={onFindBestPath}
              style={{ padding: '13px 30px', borderRadius: '9999px', fontSize: '14px', fontWeight: 700 }}
            >
              <Sparkles size={16} />
              <span>Find the Best Path</span>
              <ArrowRight size={16} />
            </button>
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={onCheckPrices}
              style={{ padding: '13px 26px', borderRadius: '9999px', fontSize: '14px', fontWeight: 600 }}
            >
              <span>Read Strategic Brief</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

