import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ArthSetuFeatured from './components/ArthSetuFeatured';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import TimelineAndAchievements from './components/TimelineAndAchievements';
import CertificatesSection from './components/CertificatesSection';
import ResumeSection from './components/ResumeSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import OwnerPortal from './components/admin/OwnerPortal';
import './App.css';

function MainAppContent() {
  const { currentView } = usePortfolio();

  if (currentView === 'admin') {
    return <OwnerPortal />;
  }

  return (
    <div className="portfolio-app">
      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Main Public Content Sections */}
      <main id="main-content">
        <Hero />
        <ArthSetuFeatured />
        <ProjectsSection />
        <SkillsSection />
        <TimelineAndAchievements />
        <CertificatesSection />
        <ResumeSection />
        <ContactSection />
      </main>

      {/* Professional Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <MainAppContent />
    </PortfolioProvider>
  );
}
