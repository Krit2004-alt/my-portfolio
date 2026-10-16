import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { isConfigured } from '../utils/helpers';
import { Menu, X, FileText, ExternalLink, ShieldCheck, Lock } from 'lucide-react';
import { Github } from './Icons';

export default function Navbar() {
  const { data, setCurrentView } = usePortfolio();
  const { personalInfo } = data;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'ArthSetu (Core)', href: '#arthsetu' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Resume', href: '#resume' },
    { name: 'Contact', href: '#contact' },
  ];

  const hasResume = isConfigured(personalInfo.contacts?.resumeUrl);

  return (
    <header className={`nav-header ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Brand / Monogram */}
        <a href="#hero" className="nav-brand" aria-label="Kritika Khandelwal Homepage">
          <div className="brand-monogram">KK</div>
          <div className="brand-text">
            <span className="brand-name">{personalInfo.name}</span>
            <span className="brand-sub">{personalInfo.statusTag}</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="nav-desktop" aria-label="Main Navigation">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="nav-link">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="nav-actions">
          {isConfigured(personalInfo.contacts?.github) && (
            <a
              href={personalInfo.contacts.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              aria-label="GitHub Profile"
            >
              <Github size={15} />
              <span>GitHub</span>
            </a>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <ul className="mobile-nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            {isConfigured(personalInfo.contacts?.github) && (
              <li className="mobile-nav-actions">
                <a
                  href={personalInfo.contacts.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Github size={16} />
                  <span>GitHub Profile</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
