import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUp, ShieldCheck, Heart, Lock } from 'lucide-react';

export default function Footer() {
  const { data, setCurrentView } = usePortfolio();
  const { personalInfo } = data;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openOwnerPortal = (e) => {
    e.preventDefault();
    setCurrentView('admin');
    window.location.hash = '#/admin';
  };

  return (
    <footer className="footer-root">
      <div className="container footer-container">
        
        {/* Top Footer Tier */}
        <div className="footer-top-row">
          <div className="footer-brand">
            <div className="brand-monogram">KK</div>
            <div>
              <span className="footer-name">{personalInfo.name}</span>
              <p className="footer-bio">
                B.Tech Computer Science & Engineering · JECRC University, Jaipur ('27)<br />
                Selected at TCS (System Engineer) · GATE CSE 2026 Qualified
              </p>
            </div>
          </div>

          <div className="footer-nav-groups">
            <div className="footer-links-col">
              <span className="footer-col-title">Navigation</span>
              <a href="#hero" className="footer-link">Overview</a>
              <a href="#arthsetu" className="footer-link">ArthSetu (Core)</a>
              <a href="#projects" className="footer-link">Full-Stack Projects</a>
              <a href="#skills" className="footer-link">Technical Skills</a>
            </div>

            <div className="footer-links-col">
              <span className="footer-col-title">Credentials</span>
              <a href="#timeline" className="footer-link">Academic Milestones</a>
              <a href="#certificates" className="footer-link">Certificates & Documents</a>
              <a href="#resume" className="footer-link">Official Resume</a>
              <a href="#contact" className="footer-link">Outreach</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Tier: Copyright, Security & Back-to-Top */}
        <div className="footer-bottom-row">
          <div className="footer-meta">
            <span className="footer-copy">
              © {new Date().getFullYear()} {personalInfo.name}. Built with React &amp; Vanilla CSS.
            </span>
            <span className="footer-fellowship-note">
              Engineered for competitive technology fellowship &amp; internship evaluation.
            </span>
          </div>

          <div className="footer-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="btn btn-outline btn-sm owner-access-btn"
              onClick={openOwnerPortal}
              title="Private Owner Portal (Requires Authentication)"
            >
              <Lock size={13} />
              <span>Owner Access</span>
            </button>

            <button 
              className="btn btn-outline btn-sm"
              onClick={scrollToTop}
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
