/**
 * Centralized Portfolio Configuration
 * Author: Kritika Khandelwal
 * 
 * Source of truth is src/data/portfolioData.json.
 * Any updates via the Owner Portal or direct edits are reflected here.
 */

import portfolioData from './portfolioData.json';

export const personalInfo = portfolioData.personalInfo;
export const flagshipProject = portfolioData.flagshipProject;
export const otherProjects = portfolioData.otherProjects;
export const skillsData = portfolioData.skillsData;
export const achievementsTimeline = portfolioData.achievementsTimeline;
export const certificates = portfolioData.certificates;
export const initialCertificates = portfolioData.certificates;

export default portfolioData;
