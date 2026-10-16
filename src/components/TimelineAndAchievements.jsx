import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { isConfigured } from '../utils/helpers';
import { achievementsTimeline as defaultTimeline } from '../data/portfolioData';
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Award, 
  Calendar, 
  Eye, 
  FileCheck2,
  Clock
} from 'lucide-react';

export default function TimelineAndAchievements() {
  const { data } = usePortfolio();
  const timeline = data?.achievementsTimeline || defaultTimeline;
  const certificates = data?.certificates || [];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Academic Degree':
        return <GraduationCap size={18} className="text-cyan" />;
      case 'Professional Placement':
        return <Briefcase size={18} className="text-emerald" />;
      case 'Competitive Examination':
        return <ShieldCheck size={18} className="text-amber" />;
      default:
        return <Award size={18} className="text-blue" />;
    }
  };

  const getMatchingCert = (item) => {
    if (!certificates || certificates.length === 0) return null;
    const titleLower = item.title.toLowerCase();
    return certificates.find(c => {
      const cTitle = (c.title || '').toLowerCase();
      if (titleLower.includes('gate') && cTitle.includes('gate')) return true;
      if (titleLower.includes('tcs') && cTitle.includes('tcs')) return true;
      if (titleLower.includes('adobe') && cTitle.includes('adobe')) return true;
      if (titleLower.includes('healthcare') && cTitle.includes('healthcare')) return true;
      return false;
    });
  };

  return (
    <section id="timeline" className="section section-alt">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Calendar size={14} />
            <span>Academic &amp; Career Milestones</span>
          </div>
          <h2 className="section-title">Education, Placement &amp; Achievements</h2>
          <p className="section-description">
            Academic background, professional campus placement selection, competitive examinations, 
            and hackathon engineering participation.
          </p>
        </div>

        {/* Timeline Stream */}
        <div className="timeline-container">
          {timeline.map((item, index) => {
            const cert = getMatchingCert(item);
            const hasValidDocument = cert && isConfigured(cert.fileUrl) && cert.published !== false;

            return (
              <div key={index} className="timeline-item">
                
                {/* Left Timeline Marker */}
                <div className="timeline-marker">
                  <div className="marker-icon">
                    {getCategoryIcon(item.category)}
                  </div>
                  {index < timeline.length - 1 && <div className="marker-line"></div>}
                </div>

                {/* Timeline Card Content */}
                <div className="card timeline-card">
                  <div className="timeline-card-header">
                    <div>
                      <span className="tag tag-cyan">{item.category}</span>
                      <h3 className="timeline-item-title">{item.title}</h3>
                      <span className="timeline-item-org">{item.organization}</span>
                    </div>
                    <div className="timeline-period-badge">
                      <Clock size={13} />
                      <span>{item.year}</span>
                    </div>
                  </div>

                  <p className="timeline-item-desc">{item.description}</p>

                  {/* Supporting Document Action (Rendered ONLY when valid document is attached and published) */}
                  {hasValidDocument && (
                    <div className="timeline-card-footer">
                      <div className="doc-type-pill">
                        <FileCheck2 size={13} />
                        <span>Supporting Document: {cert.fileName || item.documentType}</span>
                      </div>
                      <a 
                        href={cert.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-outline btn-sm"
                      >
                        <Eye size={13} />
                        <span>View Document</span>
                      </a>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
