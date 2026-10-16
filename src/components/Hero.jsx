import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { isConfigured } from '../utils/helpers';
import { 
  ArrowRight, 
  FileText, 
  Mail, 
  Code2, 
  CheckCircle2, 
  ShieldCheck, 
  Server, 
  Layers, 
  Database,
  Cpu
} from 'lucide-react';
import { Github, Linkedin } from './Icons';

export default function Hero() {
  const { data } = usePortfolio();
  const { personalInfo } = data;

  const hasGithub = isConfigured(personalInfo.contacts?.github);
  const hasLinkedin = isConfigured(personalInfo.contacts?.linkedin);
  const hasLeetcode = isConfigured(personalInfo.contacts?.leetcode);
  const hasResume = isConfigured(personalInfo.contacts?.resumeUrl);
  const hasEmail = isConfigured(personalInfo.contacts?.email);

  return (
    <section id="hero" className="hero-section">
      <div className="container hero-container">
        
        {/* Left Column: Core Identity & Technical Pitch */}
        <div className="hero-content">
          {/* Status Badges Group */}
          <div className="hero-status-group">
            <span className="hero-tag">
              <span className="status-dot"></span>
              {personalInfo.statusTag}
            </span>
            <span className="hero-tag hero-tag-accent">
              <ShieldCheck size={14} />
              {personalInfo.gate.badge}
            </span>
            <span className="hero-tag hero-tag-tcs">
              <CheckCircle2 size={14} />
              {personalInfo.placement.badge}
            </span>
          </div>

          {/* Primary Headline */}
          <h1 className="hero-headline">
            Building Reliable Backend Systems.
            <span className="headline-gradient"> Solving Real Problems.</span>
          </h1>

          {/* Supporting Technical Bio */}
          <p className="hero-subhead">
            I am a Computer Science engineering student at <strong>{personalInfo.education.institution}</strong> ('27) 
            specializing in Java, Spring Boot, distributed microservices, and asynchronous event streams. 
            Selected for a <strong>System Engineer</strong> role at TCS and qualified in <strong>GATE CSE 2026</strong>. 
            Passionate about building production-grade architectures with zero double-debit guarantees, 
            distributed locking, and verifiable test coverage.
          </p>

          {/* Primary Call to Actions */}
          <div className="hero-actions">
            <a href="#arthsetu" className="btn btn-primary">
              <span>View Flagship Project (ArthSetu)</span>
              <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn btn-outline">
              <Mail size={16} />
              <span>Contact</span>
            </a>
          </div>

          {/* Direct Profile Links (Configured Only) */}
          {(hasGithub || hasLinkedin || hasLeetcode) && (
            <div className="hero-profile-links">
              <span className="profile-label">Verified Links:</span>
              
              {hasGithub && (
                <a 
                  href={personalInfo.contacts.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="profile-link"
                  title="GitHub Profile"
                >
                  <Github size={16} />
                  <span>GitHub</span>
                </a>
              )}

              {hasLinkedin && (
                <a 
                  href={personalInfo.contacts.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="profile-link"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={16} />
                  <span>LinkedIn</span>
                </a>
              )}

              {hasLeetcode && (
                <a 
                  href={personalInfo.contacts.leetcode} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="profile-link"
                  title="LeetCode Profile"
                >
                  <Code2 size={16} />
                  <span>LeetCode</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Architectural Highlights Card */}
        <div className="hero-visual" aria-hidden="true">
          <div className="system-spec-card">
            <div className="spec-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={16} className="text-cyan" />
                <span className="spec-title" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  ArthSetu — System Design Highlights
                </span>
              </div>
              <span className="mono text-xs text-muted">Microservices Core</span>
            </div>

            <div className="spec-card-body">
              <div className="spec-item">
                <div className="spec-icon"><Server size={18} className="text-cyan" /></div>
                <div className="spec-text">
                  <span className="spec-label">Core Runtime &amp; Framework</span>
                  <span className="spec-value">Java 21 · Spring Boot 3.3.5 · Spring Cloud Gateway</span>
                </div>
              </div>

              <div className="spec-item">
                <div className="spec-icon"><Layers size={18} className="text-amber" /></div>
                <div className="spec-text">
                  <span className="spec-label">Distributed Pattern</span>
                  <span className="spec-value">Saga Choreography + Compensating Refunds</span>
                </div>
              </div>

              <div className="spec-item">
                <div className="spec-icon"><Cpu size={18} className="text-blue" /></div>
                <div className="spec-text">
                  <span className="spec-label">Concurrency &amp; Safety</span>
                  <span className="spec-value">Redisson Locks + Redis Idempotency + @Version</span>
                </div>
              </div>

              <div className="spec-item">
                <div className="spec-icon"><Database size={18} className="text-emerald" /></div>
                <div className="spec-text">
                  <span className="spec-label">Event Backbone &amp; Isolation</span>
                  <span className="spec-value">Apache Kafka 3.7.1 · 4 Isolated PostgreSQL DBs</span>
                </div>
              </div>
            </div>

            {/* Verified Test Banner */}
            <div className="spec-footer-banner">
              <div className="test-badge">
                <CheckCircle2 size={16} className="text-emerald" />
                <span className="test-count">37 Automated Tests Passing (7 Test Suites)</span>
              </div>
              <a href="#arthsetu" className="text-xs text-cyan" style={{ textDecoration: 'none' }}>
                Inspect Architecture &rarr;
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
