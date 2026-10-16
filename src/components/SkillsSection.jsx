import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { isConfigured } from '../utils/helpers';
import { skillsData as defaultSkillsData, personalInfo as defaultPersonalInfo } from '../data/portfolioData';
import { 
  Server, 
  Database, 
  Activity, 
  Cpu, 
  Layers, 
  Code2, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function SkillsSection() {
  const { data } = usePortfolio();
  const personalInfo = data?.personalInfo || defaultPersonalInfo;
  const skillsData = data?.skillsData || defaultSkillsData;
  const leetcodeUrl = personalInfo?.contacts?.leetcode;

  return (
    <section id="skills" className="section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Cpu size={14} />
            <span>Technical Competency</span>
          </div>
          <h2 className="section-title">Skills & Systems Engineering Expertise</h2>
          <p className="section-description">
            Organized strictly by backend relevance and architectural application. 
            Focused on technologies I can substantiate in technical interviews, without arbitrary percentage skill bars.
          </p>
        </div>

        {/* Skills Category Grid */}
        <div className="skills-grid">
          
          {/* 1. Backend Core */}
          <div className="card skill-group-card">
            <div className="skill-group-header">
              <div className="skill-icon-wrap text-blue">
                <Server size={20} />
              </div>
              <div>
                <h3 className="skill-group-title">Backend Architecture</h3>
                <span className="skill-group-sub">Java, Spring Boot & Distributed Services</span>
              </div>
            </div>
            <ul className="skill-items-list">
              {skillsData.backend.map((item) => (
                <li key={item.name} className="skill-item">
                  <span className="skill-name">{item.name}</span>
                  <span className="skill-context">{item.context}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Messaging & Concurrency */}
          <div className="card skill-group-card">
            <div className="skill-group-header">
              <div className="skill-icon-wrap text-amber">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="skill-group-title">Messaging & Concurrency</h3>
                <span className="skill-group-sub">Event Streams & Distributed Locks</span>
              </div>
            </div>
            <ul className="skill-items-list">
              {skillsData.messagingAndConcurrency.map((item) => (
                <li key={item.name} className="skill-item">
                  <span className="skill-name">{item.name}</span>
                  <span className="skill-context">{item.context}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Databases & Migrations */}
          <div className="card skill-group-card">
            <div className="skill-group-header">
              <div className="skill-icon-wrap text-emerald">
                <Database size={20} />
              </div>
              <div>
                <h3 className="skill-group-title">Databases & Infrastructure</h3>
                <span className="skill-group-sub">Relational Schemas, Docker & Build Tools</span>
              </div>
            </div>
            <ul className="skill-items-list">
              {skillsData.databasesAndTools.map((item) => (
                <li key={item.name} className="skill-item">
                  <span className="skill-name">{item.name}</span>
                  <span className="skill-context">{item.context}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Observability & Frontend */}
          <div className="card skill-group-card">
            <div className="skill-group-header">
              <div className="skill-icon-wrap text-cyan">
                <Layers size={20} />
              </div>
              <div>
                <h3 className="skill-group-title">Observability & Web Client</h3>
                <span className="skill-group-sub">Tracing, Metrics & Modern Interfaces</span>
              </div>
            </div>
            
            <div className="nested-skill-block">
              <span className="nested-skill-heading">Observability & Distributed Tracing:</span>
              <ul className="skill-items-list">
                {skillsData.observability.map((item) => (
                  <li key={item.name} className="skill-item">
                    <span className="skill-name">{item.name}</span>
                    <span className="skill-context">{item.context}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nested-skill-block" style={{ marginTop: '1rem' }}>
              <span className="nested-skill-heading">Frontend Technologies:</span>
              <ul className="skill-items-list">
                {skillsData.frontend.map((item) => (
                  <li key={item.name} className="skill-item">
                    <span className="skill-name">{item.name}</span>
                    <span className="skill-context">{item.context}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Problem Solving & DSA Profile Link Card */}
        <div className="card problem-solving-card">
          <div className="ps-left">
            <Code2 size={24} className="text-amber" />
            <div>
              <h4 className="ps-title">Algorithmic Problem Solving & Data Structures</h4>
              <p className="ps-desc">
                Practicing algorithmic problem solving and core data structures. Verified profile link available without exaggerated ranking or problem-count claims.
              </p>
            </div>
          </div>
          {isConfigured(leetcodeUrl) && (
            <div className="ps-right">
              <a 
                href={leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                id="leetcode-profile-btn"
              >
                <span>View LeetCode Profile</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
