import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { isConfigured } from '../utils/helpers';
import { 
  Mail, 
  Code2, 
  Copy, 
  Check, 
  ExternalLink, 
  Send,
  MessageSquare,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Github, Linkedin } from './Icons';

export default function ContactSection() {
  const { data } = usePortfolio();
  const { personalInfo } = data;
  const contacts = personalInfo.contacts || {};

  const hasEmail = isConfigured(contacts.email);
  const hasGithub = isConfigured(contacts.github);
  const hasLinkedin = isConfigured(contacts.linkedin);
  const hasLeetcode = isConfigured(contacts.leetcode);

  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (hasEmail) {
      navigator.clipboard.writeText(contacts.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Mail size={14} />
            <span>Direct Outreach</span>
          </div>
          <h2 className="section-title">Connect & Technical Inquiry</h2>
          <p className="section-description">
            Open for technical discussions, competitive internship evaluations (including the Bharat Digital Fellowship), 
            and backend systems engineering opportunities.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid-2 contact-grid">
          
          {/* Left Column: Direct Contact Info & Links */}
          <div className="contact-info-col">
            
            {/* Email Card with Copy Action (If Configured) */}
            {hasEmail ? (
              <div className="card contact-channel-card">
                <div className="channel-icon-wrap text-cyan">
                  <Mail size={22} />
                </div>
                <div className="channel-details">
                  <span className="channel-label">Official Email Address</span>
                  <span className="channel-val">
                    <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
                  </span>
                </div>
                <button 
                  className="btn btn-secondary btn-sm copy-btn"
                  onClick={handleCopyEmail}
                  title="Copy email address"
                >
                  {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ) : (
              <div className="card contact-channel-card">
                <div className="channel-icon-wrap text-cyan">
                  <Mail size={22} />
                </div>
                <div className="channel-details">
                  <span className="channel-label">Direct Communication</span>
                  <span className="channel-val">
                    Available for institutional inquiries via GitHub and professional networks.
                  </span>
                </div>
              </div>
            )}

            {/* GitHub Card (Always Verified) */}
            {hasGithub && (
              <a 
                href={contacts.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="card contact-channel-card"
              >
                <div className="channel-icon-wrap text-blue">
                  <Github size={22} />
                </div>
                <div className="channel-details">
                  <span className="channel-label">GitHub Monorepo & Source Code</span>
                  <span className="channel-val mono">{contacts.github}</span>
                </div>
                <ExternalLink size={16} className="text-muted" />
              </a>
            )}

            {/* LinkedIn Card (Configured Only) */}
            {hasLinkedin && (
              <a 
                href={contacts.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="card contact-channel-card"
              >
                <div className="channel-icon-wrap text-cyan">
                  <Linkedin size={22} />
                </div>
                <div className="channel-details">
                  <span className="channel-label">LinkedIn Professional Network</span>
                  <span className="channel-val mono">{contacts.linkedin}</span>
                </div>
                <ExternalLink size={16} className="text-muted" />
              </a>
            )}

            {/* LeetCode Card (Configured Only) */}
            {hasLeetcode && (
              <a 
                href={contacts.leetcode} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="card contact-channel-card"
              >
                <div className="channel-icon-wrap text-amber">
                  <Code2 size={22} />
                </div>
                <div className="channel-details">
                  <span className="channel-label">LeetCode Problem Solving Profile</span>
                  <span className="channel-val mono">{contacts.leetcode}</span>
                </div>
                <ExternalLink size={16} className="text-muted" />
              </a>
            )}

          </div>

          {/* Right Column: Candidate Statement */}
          <div className="card config-guide-card">
            <div className="guide-header">
              <ShieldCheck size={20} className="text-cyan" />
              <h3 className="guide-title">Candidate Evaluation Standards</h3>
            </div>

            <div className="guide-body">
              <p className="guide-text">
                This portfolio is engineered to demonstrate authentic backend systems engineering capability, 
                verifiable test suites, and transparent architectural trade-offs:
              </p>

              <ul className="guide-bullet-list">
                <li>
                  <strong>Direct Repository Inspection:</strong> Full source code, Flyway migrations, and Docker Compose configurations are available on GitHub for technical audit.
                </li>
                <li>
                  <strong>Verified Test Evidence:</strong> All 37 automated test claims in ArthSetu are backed by JUnit and Spring slice test execution with 100% pass rates.
                </li>
                <li>
                  <strong>Production Honesty:</strong> No unmeasured performance drops, exaggerated percentiles, or synthetic statistics are presented.
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
