import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { isConfigured } from '../utils/helpers';
import { 
  FileCheck2, 
  Eye, 
  ExternalLink, 
  FileText, 
  Image as ImageIcon, 
  X,
  ShieldCheck
} from 'lucide-react';

export default function CertificatesSection() {
  const { data } = usePortfolio();
  const rawCertificates = data.certificates || [];
  
  // Public view: only show certificates marked as published (or all if not explicitly false)
  const publishedCertificates = rawCertificates.filter(c => c.published !== false);

  const [previewDoc, setPreviewDoc] = useState(null);

  return (
    <section id="certificates" className="section">
      <div className="container">
        
        {/* Section Header */}
        <div className="certificates-header-row">
          <div className="section-header" style={{ marginBottom: 0 }}>
            <div className="section-badge">
              <FileCheck2 size={14} />
              <span>Verifiable Credentials</span>
            </div>
            <h2 className="section-title">Certificates &amp; Supporting Documents</h2>
            <p className="section-description">
              Official qualification scorecards, placement confirmation records, 
              and technical hackathon credentials.
            </p>
          </div>
        </div>

        {/* Certificates Grid (Recruiter / Public Clean View) */}
        <div className="grid-2 certificates-grid" style={{ marginTop: '2rem' }}>
          {publishedCertificates.map((cert) => {
            const hasFile = isConfigured(cert.fileUrl);
            const hasVerifyUrl = isConfigured(cert.verificationUrl);
            const isPdf = cert.fileUrl && !cert.fileUrl.match(/\.(png|jpe?g)$/i);

            return (
              <div key={cert.id} className="card certificate-card">
                
                <div className="cert-card-header">
                  <div className="cert-icon-wrapper">
                    {hasFile ? (
                      isPdf ? (
                        <FileText size={22} className="text-cyan" />
                      ) : (
                        <ImageIcon size={22} className="text-emerald" />
                      )
                    ) : (
                      <FileCheck2 size={22} className="text-muted" />
                    )}
                  </div>

                  <div className="cert-title-group">
                    <h3 className="cert-title">{cert.title}</h3>
                    <span className="cert-issuer">{cert.issuer} {cert.date ? `· ${cert.date}` : ''}</span>
                  </div>
                </div>

                {/* Status & Attachment Indicator */}
                {(hasFile || hasVerifyUrl) && (
                  <div className="cert-attachment-status">
                    {hasFile && (
                      <div className="doc-attached-pill">
                        <FileText size={14} className="text-cyan" />
                        <span className="file-name-text">{cert.fileName || 'Attached Document'}</span>
                      </div>
                    )}

                    {hasVerifyUrl && (
                      <a 
                        href={cert.verificationUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="verification-link"
                      >
                        <span>Verify Issuing Authority</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                )}

                {/* Recruiter Actions Bar (Rendered ONLY when file exists) */}
                {hasFile && (
                  <div className="cert-actions-bar">
                    <a 
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <Eye size={14} />
                      <span>View Document</span>
                    </a>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Credential Verification Assurance */}
        <div className="callout-note" style={{ marginTop: '2.5rem' }}>
          <ShieldCheck size={18} className="text-cyan" />
          <div className="callout-text">
            <strong>Credential Integrity Assurance:</strong>
            <p>
              All academic degrees, GATE CSE qualifications, and TCS placement records displayed are authentic. 
              Recruiters and fellowship review committees can request certified copies directly via the contact channels below.
            </p>
          </div>
        </div>

      </div>

      {/* Document Preview Modal (for in-page modal inspection if triggered) */}
      {previewDoc && (
        <div className="modal-overlay" onClick={() => setPreviewDoc(null)} role="dialog" aria-modal="true">
          <div className="modal-content doc-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{previewDoc.title}</h3>
                <span className="mono text-xs text-muted">{previewDoc.fileName || previewDoc.issuer}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-outline btn-icon" onClick={() => setPreviewDoc(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="modal-body doc-preview-body">
              {!previewDoc.fileUrl.match(/\.(png|jpe?g)$/i) ? (
                <div className="pdf-fallback-view" style={{ padding: '2rem', textAlign: 'center' }}>
                  <p>PDF document ready for review.</p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                    <a href={previewDoc.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      <Eye size={14} />
                      <span>View Document</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="image-viewer-container">
                  <img src={previewDoc.fileUrl} alt={previewDoc.title} className="preview-image" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
