import React from 'react';
import { ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import ImagePlaceholder from './ImagePlaceholder';

export default function VisionLetter({ onBackToDashboard }) {
  return (
    <div className="vision-letter-view">
      {/* Top Navigation Bar */}
      <div className="vision-letter-header-bar">
        <button 
          type="button"
          className="btn btn-secondary"
          onClick={onBackToDashboard}
        >
          <ArrowLeft size={16} />
          <span>Back to Main Dashboard</span>
        </button>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button 
            type="button"
            className="btn btn-ghost"
            onClick={() => window.print()}
          >
            <Download size={16} />
            <span>Export Vision Brief</span>
          </button>
        </div>
      </div>

      {/* Large SaaS Document Container */}
      <article className="card" style={{ padding: 'var(--space-10)', gap: 'var(--space-8)' }}>
        {/* Document Top Metadata */}
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <ShieldCheck size={18} style={{ color: 'var(--color-primary)' }} />
              <span className="caption" style={{ fontWeight: 'var(--font-weight-bold)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                EXECUTIVE VISION BRIEF • REF #TXL-V2026
              </span>
            </div>
            <h1>Strategic Vision Letter: Scalable Circular Fashion Infrastructure</h1>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-accent">
              Pricing & Ecosystem Vision
            </span>
            <div className="caption" style={{ marginTop: 'var(--space-1)' }}>
              Date: Q3 2026 Release
            </div>
          </div>
        </div>

        {/* Vision Section 1: Executive Summary */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h2>Executive Summary & Strategic Directive</h2>
          <div className="caption" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height-relaxed)', padding: 'var(--space-4)', background: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
            Comprehensive vision statement outlining Loomora's mission to transform textile waste from an environmental liability into a high-value industrial raw material through automated geospatial routing, material purity telemetry, and transparent buyback valuation.
          </div>
        </section>

        {/* Vision Supporting Visual Container - Preserved Image Asset */}
        <ImagePlaceholder 
          imageUrl="/assets/circular_fashion.png"
          altText="Supporting Circular Fashion Vision Visual"
          label="Supporting Circular Fashion Vision Visual" 
          aspectRatio="16 / 7" 
        />

        {/* Vision Section 2: Pillar 1 */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h2>Pillar 1: Smart Collection Infrastructure & Geolocation Routing</h2>
          <div className="caption" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-relaxed)', padding: 'var(--space-4)', background: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
            Deployment strategy for IoT-enabled collection bins, municipal drop-off hubs, and AI-optimized routing networks using Google Maps Platform APIs to reduce logistics overhead by up to 40%.
          </div>
        </section>

        {/* Vision Section 3: Pillar 2 */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h2>Pillar 2: Transparent Fiber Pricing & Economic Incentives</h2>
          <div className="caption" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-relaxed)', padding: 'var(--space-4)', background: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
            Framework explaining transparent per-kilogram waste acquisition pricing, tiered quality incentives for garment suppliers, and market index tracking for recycled cotton and synthetic polymers.
          </div>
        </section>

        {/* Vision Section 4: Pillar 3 */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h2>Pillar 3: Zero-Landfill Closed-Loop Operations</h2>
          <div className="caption" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-relaxed)', padding: 'var(--space-4)', background: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
            Long-term operational roadmap guaranteeing 100% diversion from landfills through integrated mechanical fiber shredding, chemical depolymerization, and upcycling channels.
          </div>
        </section>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)' }}>
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={onBackToDashboard}
          >
            <ArrowLeft size={16} />
            <span>Return to Main Dashboard</span>
          </button>

          <button 
            type="button"
            className="btn btn-check-prices"
            onClick={onBackToDashboard}
          >
            <span>Proceed with Dashboard</span>
          </button>
        </div>
      </article>
    </div>
  );
}
