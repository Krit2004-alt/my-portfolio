import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { isConfigured } from '../utils/helpers';
import { 
  ExternalLink, 
  Layers, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  Image, 
  Clock, 
  Calendar, 
  CheckSquare, 
  Target, 
  ShieldCheck, 
  Database,
  X
} from 'lucide-react';
import { Github } from './Icons';

export default function ProjectsSection() {
  const { data } = usePortfolio();
  const otherProjects = data.otherProjects || [];
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="section section-alt">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Layers size={14} />
            <span>Full-Stack Engineering</span>
          </div>
          <h2 className="section-title">Additional Engineering Projects</h2>
          <p className="section-description">
            Complete full-stack systems designed with structured data modeling, modular Spring Boot backends, 
            and clearly defined functional modules. Built with technical depth and documented requirements.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid-2 projects-grid">
          {otherProjects.map((project) => (
            <div key={project.id} className="card project-card">
              
              {/* Card Header & Badges */}
              <div className="project-card-top">
                <div className="project-badge-row">
                  <span className="tag tag-cyan">{project.badge}</span>
                  <span className="tag">{project.type}</span>
                </div>
                <h3 className="project-card-title">{project.name}</h3>
                <p className="project-card-tagline">{project.tagline}</p>
              </div>

              {/* Tech Stack Chips */}
              <div className="project-tech-chips">
                {project.techStack.map((tech) => (
                  <span key={tech.name} className="tech-chip">
                    <strong>{tech.name}:</strong> {tech.version}
                  </span>
                ))}
              </div>

              {/* Structured Summary (Problem & Approach) */}
              <div className="project-summary-box">
                <div className="summary-row">
                  <span className="summary-label">Problem:</span>
                  <span className="summary-text">{project.overview.problem}</span>
                </div>
                <div className="summary-row" style={{ marginTop: '0.6rem' }}>
                  <span className="summary-label">Approach:</span>
                  <span className="summary-text">{project.overview.approach}</span>
                </div>
              </div>

              {/* Functional Modules Preview List */}
              <div className="modules-preview">
                <span className="mono text-xs uppercase text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Core System Modules ({project.modules.length}):
                </span>
                <ul className="modules-mini-list">
                  {project.modules.slice(0, 3).map((mod, idx) => (
                    <li key={idx} className="module-mini-item">
                      <ChevronRight size={14} className="text-cyan" />
                      <span><strong>{mod.title}:</strong> {mod.description.substring(0, 75)}...</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer: Actions */}
              <div className="project-card-footer">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedProject(project)}
                >
                  <span>Inspect Architecture & Modules</span>
                  <ChevronRight size={14} />
                </button>

                <div className="project-links-group">
                  {isConfigured(project.links?.github) && (
                    <a 
                      href={project.links.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline btn-sm"
                    >
                      <Github size={14} />
                      <span>View GitHub Repo</span>
                    </a>
                  )}

                  {isConfigured(project.links?.liveDemo) && (
                    <a 
                      href={project.links.liveDemo} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary btn-sm"
                    >
                      <ExternalLink size={14} />
                      <span>Live Demo</span>
                    </a>
                  )}

                  {isConfigured(project.links?.documentation) && (
                    <a 
                      href={project.links.documentation} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline btn-sm"
                    >
                      <FileText size={14} />
                      <span>Documentation</span>
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Deep-Dive Project Detail Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="tag tag-cyan">{selectedProject.badge}</span>
                <h3 className="modal-title" style={{ marginTop: '0.5rem' }}>{selectedProject.name}</h3>
                <p className="modal-sub">{selectedProject.tagline}</p>
              </div>
              <button 
                className="btn btn-outline btn-icon"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Tech Stack Specs */}
              <div className="modal-section">
                <h4 className="modal-section-title">Verified Technology Architecture</h4>
                <div className="table-container">
                  <table className="clean-table">
                    <thead>
                      <tr>
                        <th>Tier / Layer</th>
                        <th>Technology Selection</th>
                        <th>Architectural Responsibility</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProject.techStack.map((tech) => (
                        <tr key={tech.name}>
                          <td><strong>{tech.category}</strong></td>
                          <td><code>{tech.name}</code></td>
                          <td>{tech.version}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Workflow */}
              <div className="modal-section">
                <h4 className="modal-section-title">End-to-End System Workflow</h4>
                {selectedProject.id === 'truthtrace' ? (
                  <div className="workflow-diagram-box">
                    <div className="wf-node">User Input / Claim</div>
                    <div className="wf-arrow">→</div>
                    <div className="wf-node">Screenshot / Image</div>
                    <div className="wf-arrow">→</div>
                    <div className="wf-node node-highlight">Tesseract OCR Extraction</div>
                    <div className="wf-arrow">→</div>
                    <div className="wf-node node-highlight">NLP Credibility Pipeline</div>
                    <div className="wf-arrow">→</div>
                    <div className="wf-node">Explanation & Disclaimers</div>
                    <div className="wf-arrow">→</div>
                    <div className="wf-node">MySQL Persistence</div>
                  </div>
                ) : (
                  <div className="workflow-diagram-box">
                    <div className="wf-node">Register / Login</div>
                    <div className="wf-arrow">→</div>
                    <div className="wf-node node-highlight">JWT Auth & Refresh</div>
                    <div className="wf-arrow">→</div>
                    <div className="wf-node">Academic Tasks & Priorities</div>
                    <div className="wf-arrow">→</div>
                    <div className="wf-node">Milestones & Goal Progress</div>
                    <div className="wf-arrow">→</div>
                    <div className="wf-node">Habit Tracker & Streaks</div>
                    <div className="wf-arrow">→</div>
                    <div className="wf-node">Personalized Dashboard</div>
                  </div>
                )}
              </div>

              {/* Detailed Functional Modules */}
              <div className="modal-section">
                <h4 className="modal-section-title">Documented Functional Modules & Requirements</h4>
                <div className="grid-2 modal-modules-grid">
                  {selectedProject.modules.map((m, idx) => (
                    <div key={idx} className="card module-detail-card">
                      <div className="module-detail-head">
                        <CheckCircle2 size={16} className="text-cyan" />
                        <h5 className="module-title">{m.title}</h5>
                      </div>
                      <p className="module-text">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture & Engineering Note */}
              <div className="callout-note" style={{ marginTop: '1.5rem' }}>
                <ShieldCheck size={16} className="text-cyan" />
                <span>
                  <strong>Architecture &amp; System Design:</strong> {selectedProject.engineeringNote}
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <span className="mono text-xs text-muted">
                {isConfigured(selectedProject.links?.github)
                  ? `Repository: ${selectedProject.links.github}`
                  : 'Architecture & System Design Blueprint'}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedProject(null)}>
                Close Architecture View
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
