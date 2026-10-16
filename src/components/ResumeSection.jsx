import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { isConfigured } from '../utils/helpers';
import { 
  FileText, 
  Eye
} from 'lucide-react';

export default function ResumeSection() {
  const { data } = usePortfolio();
  const { personalInfo } = data;
  const resumeUrl = personalInfo?.contacts?.resumeUrl;
  const hasResume = isConfigured(resumeUrl);

  return (
    <section id="resume" className="section section-alt">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <FileText size={14} />
            <span>Curriculum Vitae</span>
          </div>
          <h2 className="section-title">Official Resume &amp; Technical Profile</h2>
          <p className="section-description">
            Complete overview of academic credentials, Java backend architecture projects, 
            TCS placement selection, and GATE qualification.
          </p>
        </div>

        {/* Central Resume Card (Public View) */}
        <div className="card resume-card">
          <div className={`resume-grid ${!hasResume ? 'resume-absent' : ''}`}>
            
            {/* Profile Details Sheet */}
            <div className="resume-sheet-preview">
              <div className="sheet-header">
                <FileText size={32} className="text-cyan" />
                <div className="sheet-meta">
                  <h3 className="sheet-name">{personalInfo.name}</h3>
                  <span className="sheet-role">{personalInfo.title}</span>
                </div>
              </div>

              <div className="sheet-spec-list">
                <div className="sheet-spec-row">
                  <span className="spec-label">Education:</span>
                  <span className="spec-val">{personalInfo.education.degree}</span>
                </div>
                <div className="sheet-spec-row">
                  <span className="spec-label">Institution:</span>
                  <span className="spec-val">{personalInfo.education.institution} ('27)</span>
                </div>
                <div className="sheet-spec-row">
                  <span className="spec-label">Placement:</span>
                  <span className="spec-val">{personalInfo.placement.role} (TCS)</span>
                </div>
                <div className="sheet-spec-row">
                  <span className="spec-label">GATE Status:</span>
                  <span className="spec-val">GATE CSE 2026 Qualified</span>
                </div>
                <div className="sheet-spec-row">
                  <span className="spec-label">Core Specialty:</span>
                  <span className="spec-val">Java 21, Spring Boot, Kafka, Saga</span>
                </div>
              </div>

              {hasResume && (
                <div className="sheet-status-footer">
                  <div className="sheet-attached-badge">
                    <FileText size={15} className="text-cyan" />
                    <span>Attached Document: Kritika_Khandelwal_Resume.pdf</span>
                  </div>
                </div>
              )}
            </div>

            {/* Document Action Panel (Only rendered when resume is attached) */}
            {hasResume && (
              <div className="resume-controls-panel">
                <div>
                  <h3 className="controls-heading">Document Review</h3>
                  <p className="controls-desc">
                    Preview the official curriculum vitae directly in your browser.
                  </p>
                </div>

                {/* Working Action Button */}
                <div className="resume-action-buttons">
                  <a 
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    id="resume-preview-btn"
                  >
                    <Eye size={16} />
                    <span>View Document</span>
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
