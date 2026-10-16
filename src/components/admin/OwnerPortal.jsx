import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Lock, 
  Unlock, 
  Save, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Eye, 
  Download, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  Server, 
  GitBranch, 
  ShieldCheck, 
  Key, 
  RefreshCw,
  LogOut,
  FolderUp
} from 'lucide-react';

export default function OwnerPortal() {
  const { 
    data, 
    setData, 
    isAuthenticated, 
    login, 
    logout, 
    savePortfolio, 
    uploadFile, 
    setCurrentView 
  } = usePortfolio();

  // Login form state
  const [username, setUsername] = useState('kritika');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin tabs: 'profile', 'projects', 'resume', 'certificates', 'publish'
  const [activeTab, setActiveTab] = useState('profile');

  // Save / notification status
  const [saveStatus, setSaveStatus] = useState({ state: 'idle', message: '' });
  const [uploadStatus, setUploadStatus] = useState('');

  // Local draft state initialized from context data
  const [draft, setDraft] = useState(data);

  // Sync draft when data updates
  React.useEffect(() => {
    setDraft(data);
  }, [data]);

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    const result = await login(username, password, rememberMe);
    setIsLoggingIn(false);
    if (!result.success) {
      setLoginError(result.error || 'Invalid credentials.');
    }
  };

  // Handle saving changes
  const handleSaveAll = async () => {
    setSaveStatus({ state: 'saving', message: 'Saving changes to persistent disk storage...' });
    const result = await savePortfolio(draft);
    if (result.success) {
      setSaveStatus({ 
        state: 'success', 
        message: `Changes saved and published to disk successfully at ${new Date().toLocaleTimeString()}!` 
      });
      setTimeout(() => setSaveStatus({ state: 'idle', message: '' }), 4000);
    } else {
      setSaveStatus({ state: 'error', message: `Save error: ${result.error}` });
    }
  };

  // Handle Resume File Upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setUploadStatus('Upload failed: File exceeds 15MB limit.');
      return;
    }

    setUploadStatus('Uploading resume to server disk (/public/uploads)...');
    const result = await uploadFile(file, 'resume');
    if (result.success) {
      const updatedDraft = {
        ...draft,
        personalInfo: {
          ...draft.personalInfo,
          contacts: {
            ...draft.personalInfo.contacts,
            resumeUrl: result.fileUrl
          }
        }
      };
      setDraft(updatedDraft);
      const saveRes = await savePortfolio(updatedDraft);
      if (saveRes.success) {
        setUploadStatus(`Resume uploaded & saved to disk: ${result.fileName}`);
      } else {
        setUploadStatus(`Resume uploaded (${result.fileName}), but saving failed: ${saveRes.error}`);
      }
    } else {
      setUploadStatus(`Upload failed: ${result.error}`);
    }
  };

  // Handle Certificate Upload
  const handleCertUpload = async (certId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setUploadStatus('Upload failed: File exceeds 15MB limit.');
      return;
    }

    setUploadStatus(`Uploading document for certificate...`);
    const result = await uploadFile(file, 'cert');
    if (result.success) {
      const updatedDraft = {
        ...draft,
        certificates: (draft.certificates || []).map(c => {
          if (c.id === certId) {
            return {
              ...c,
              fileUrl: result.fileUrl,
              fileName: result.fileName,
              published: true
            };
          }
          return c;
        })
      };
      setDraft(updatedDraft);
      const saveRes = await savePortfolio(updatedDraft);
      if (saveRes.success) {
        setUploadStatus(`Document attached & saved to disk: ${result.fileName}`);
      } else {
        setUploadStatus(`Document uploaded (${result.fileName}), but saving failed: ${saveRes.error}`);
      }
    } else {
      setUploadStatus(`Upload failed: ${result.error}`);
    }
  };

  // Add new certificate entry
  const handleAddCertEntry = () => {
    const newEntry = {
      id: `cert-${Date.now()}`,
      title: 'New Qualification / Certificate',
      issuer: 'Issuing Organization',
      date: '2026',
      verificationUrl: '',
      fileUrl: '',
      fileName: '',
      published: true
    };
    setDraft(prev => ({
      ...prev,
      certificates: [newEntry, ...(prev.certificates || [])]
    }));
  };

  // Delete certificate entry
  const handleDeleteCert = (id) => {
    if (window.confirm('Are you sure you want to delete this certificate entry?')) {
      setDraft(prev => ({
        ...prev,
        certificates: (prev.certificates || []).filter(c => c.id !== id)
      }));
    }
  };

  // Export JSON configuration file
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolioData.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // =========================================================================
  // VIEW 1: Unauthenticated Login Screen
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="card admin-login-card">
          <div className="login-header">
            <div className="login-icon-box">
              <Lock size={26} className="text-cyan" />
            </div>
            <h2 className="login-title">Owner Administration Portal</h2>
            <p className="login-subtitle">
              Secure authentication area for <strong>Kritika Khandelwal</strong>.
              Protected by server-side bcrypt hashing and signed JWT session verification.
            </p>
          </div>

          {loginError && (
            <div className="callout-note callout-error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={16} className="text-amber" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Owner Username</label>
              <input 
                type="text" 
                className="form-input" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Owner Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Enter owner password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="login-options-row">
              <label className="remember-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                />
                <span>Keep me signed in on this computer</span>
              </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? <RefreshCw size={16} className="animate-spin" /> : <Key size={16} />}
              <span>{isLoggingIn ? 'Verifying Credentials...' : 'Authenticate & Open Dashboard'}</span>
            </button>
          </form>

          <div className="login-footer-actions">
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={() => { setCurrentView('public'); window.location.hash = ''; }}
            >
              <ArrowLeft size={14} />
              <span>Return to Public Recruiter Portfolio</span>
            </button>
          </div>

          <div className="security-notice-box">
            <ShieldCheck size={14} className="text-cyan" />
            <span>
              Real Authentication: Secrets and passwords remain strictly server-side. 
              No hidden buttons or client-only security.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: Authenticated Owner Dashboard
  // =========================================================================
  return (
    <div className="admin-dashboard-root">
      
      {/* Top Admin Navigation Header */}
      <header className="admin-topbar">
        <div className="container admin-topbar-container">
          <div className="admin-brand-group">
            <span className="brand-monogram">KK</span>
            <div>
              <span className="admin-title">Owner Management Console</span>
              <span className="admin-user-pill">
                <CheckCircle2 size={12} className="text-emerald" />
                <span>Authenticated: {username}</span>
              </span>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleSaveAll}
              disabled={saveStatus.state === 'saving'}
            >
              <Save size={15} />
              <span>{saveStatus.state === 'saving' ? 'Saving...' : 'Save & Publish to Disk'}</span>
            </button>

            <button 
              className="btn btn-outline btn-sm"
              onClick={() => { setCurrentView('public'); window.location.hash = ''; }}
            >
              <Eye size={15} />
              <span>View Public Portfolio</span>
            </button>

            <button 
              className="btn btn-outline btn-sm"
              onClick={logout}
              title="Logout from management console"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="container admin-main-content">
        
        {/* Save Status Banner */}
        {saveStatus.message && (
          <div className={`callout-note ${saveStatus.state === 'error' ? 'callout-error' : ''}`} style={{ marginBottom: '1.5rem' }}>
            {saveStatus.state === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald" />
            ) : saveStatus.state === 'saving' ? (
              <RefreshCw size={16} className="text-cyan animate-spin" />
            ) : (
              <AlertCircle size={16} className="text-amber" />
            )}
            <span>{saveStatus.message}</span>
          </div>
        )}

        {uploadStatus && (
          <div className="callout-note" style={{ marginBottom: '1.5rem', background: 'rgba(56, 189, 248, 0.08)' }}>
            <FolderUp size={16} className="text-cyan" />
            <span>{uploadStatus}</span>
          </div>
        )}

        {/* Dashboard Tabs Bar */}
        <div className="admin-tabs-bar">
          <button 
            className={`admin-tab-btn ${activeTab === 'profile' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span>Profile & Contacts</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'projects' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <span>Project URLs</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'resume' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            <span>Resume Management</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'certificates' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            <span>Certificates & Documents</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'publish' ? 'admin-tab-active' : ''}`}
            onClick={() => setActiveTab('publish')}
          >
            <span>Publishing & Deployment</span>
          </button>
        </div>

        {/* ===================================================================
            TAB 1: Profile & Contacts
            =================================================================== */}
        {activeTab === 'profile' && (
          <div className="card admin-section-card">
            <div className="section-card-header">
              <h3 className="section-card-title">Profile Information & Contact Channels</h3>
              <p className="section-card-desc">
                Configure your verified contact links. If left empty, these actions are 
                <strong> cleanly hidden</strong> on the public recruiter page rather than showing raw placeholders.
              </p>
            </div>

            <div className="admin-form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={draft.personalInfo.name}
                  onChange={(e) => setDraft({
                    ...draft,
                    personalInfo: { ...draft.personalInfo, name: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Status Tag</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={draft.personalInfo.statusTag}
                  onChange={(e) => setDraft({
                    ...draft,
                    personalInfo: { ...draft.personalInfo, statusTag: e.target.value }
                  })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Primary Headline</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={draft.personalInfo.headline}
                  onChange={(e) => setDraft({
                    ...draft,
                    personalInfo: { ...draft.personalInfo, headline: e.target.value }
                  })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Supporting Bio & Specialization</label>
                <textarea 
                  className="form-input" 
                  rows={3}
                  value={draft.personalInfo.subhead}
                  onChange={(e) => setDraft({
                    ...draft,
                    personalInfo: { ...draft.personalInfo, subhead: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="e.g. kritika.khandelwal@example.com"
                  value={draft.personalInfo.contacts.email || ''}
                  onChange={(e) => setDraft({
                    ...draft,
                    personalInfo: {
                      ...draft.personalInfo,
                      contacts: { ...draft.personalInfo.contacts, email: e.target.value }
                    }
                  })}
                />
                <span className="text-xs text-muted">Leave empty to hide direct email on public page.</span>
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn Profile URL</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://linkedin.com/in/..."
                  value={draft.personalInfo.contacts.linkedin || ''}
                  onChange={(e) => setDraft({
                    ...draft,
                    personalInfo: {
                      ...draft.personalInfo,
                      contacts: { ...draft.personalInfo.contacts, linkedin: e.target.value }
                    }
                  })}
                />
                <span className="text-xs text-muted">Only renders on public page when a valid URL is provided.</span>
              </div>

              <div className="form-group">
                <label className="form-label">GitHub Profile URL</label>
                <input 
                  type="url" 
                  className="form-input" 
                  value={draft.personalInfo.contacts.github || ''}
                  onChange={(e) => setDraft({
                    ...draft,
                    personalInfo: {
                      ...draft.personalInfo,
                      contacts: { ...draft.personalInfo.contacts, github: e.target.value }
                    }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">LeetCode Profile URL</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://leetcode.com/u/..."
                  value={draft.personalInfo.contacts.leetcode || ''}
                  onChange={(e) => setDraft({
                    ...draft,
                    personalInfo: {
                      ...draft.personalInfo,
                      contacts: { ...draft.personalInfo.contacts, leetcode: e.target.value }
                    }
                  })}
                />
                <span className="text-xs text-muted">Renders problem solving profile only when configured.</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: Project URLs
            =================================================================== */}
        {activeTab === 'projects' && (
          <div className="card admin-section-card">
            <div className="section-card-header">
              <h3 className="section-card-title">Project Deployment & Repository URLs</h3>
              <p className="section-card-desc">
                Manage live endpoints and GitHub links. If deployment URL is empty, the public portfolio 
                presents a clean "Cloud Blueprint Ready" badge instead of an empty/broken button.
              </p>
            </div>

            <div className="admin-form-grid">
              {/* ArthSetu */}
              <div className="card form-subcard" style={{ gridColumn: 'span 2' }}>
                <h4 className="subcard-title text-amber">ArthSetu (Distributed Digital Banking Platform)</h4>
                <div className="grid-2" style={{ gap: '1rem', marginTop: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">GitHub Repository URL</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      value={draft.flagshipProject.links.github}
                      onChange={(e) => setDraft({
                        ...draft,
                        flagshipProject: {
                          ...draft.flagshipProject,
                          links: { ...draft.flagshipProject.links, github: e.target.value }
                        }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Live Deployment URL (AWS)</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="e.g. https://api.arthsetu.in"
                      value={draft.flagshipProject.links.deployment || ''}
                      onChange={(e) => setDraft({
                        ...draft,
                        flagshipProject: {
                          ...draft.flagshipProject,
                          links: { ...draft.flagshipProject.links, deployment: e.target.value }
                        }
                      })}
                    />
                    <span className="text-xs text-muted">When empty, public site shows "Deployment in progress (AWS)".</span>
                  </div>
                </div>
              </div>

              {/* TruthTrace */}
              <div className="card form-subcard" style={{ gridColumn: 'span 2' }}>
                <h4 className="subcard-title text-cyan">TruthTrace (Misinformation Detection Platform)</h4>
                <div className="grid-2" style={{ gap: '1rem', marginTop: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">GitHub Repository URL</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://github.com/Krit2004-alt/truthtrace"
                      value={draft.otherProjects[0]?.links?.github || ''}
                      onChange={(e) => {
                        const updated = [...draft.otherProjects];
                        updated[0].links.github = e.target.value;
                        setDraft({ ...draft, otherProjects: updated });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Documentation URL</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://..."
                      value={draft.otherProjects[0]?.links?.documentation || ''}
                      onChange={(e) => {
                        const updated = [...draft.otherProjects];
                        updated[0].links.documentation = e.target.value;
                        setDraft({ ...draft, otherProjects: updated });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* LifeLedger */}
              <div className="card form-subcard" style={{ gridColumn: 'span 2' }}>
                <h4 className="subcard-title text-emerald">LifeLedger (Student Productivity Platform)</h4>
                <div className="grid-2" style={{ gap: '1rem', marginTop: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">GitHub Repository URL</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://github.com/Krit2004-alt/lifeledger"
                      value={draft.otherProjects[1]?.links?.github || ''}
                      onChange={(e) => {
                        const updated = [...draft.otherProjects];
                        updated[1].links.github = e.target.value;
                        setDraft({ ...draft, otherProjects: updated });
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Documentation URL</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://..."
                      value={draft.otherProjects[1]?.links?.documentation || ''}
                      onChange={(e) => {
                        const updated = [...draft.otherProjects];
                        updated[1].links.documentation = e.target.value;
                        setDraft({ ...draft, otherProjects: updated });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: Resume Management
            =================================================================== */}
        {activeTab === 'resume' && (
          <div className="card admin-section-card">
            <div className="section-card-header">
              <h3 className="section-card-title">Resume PDF Asset Management</h3>
              <p className="section-card-desc">
                Upload your official PDF resume directly to persistent server storage. 
                Once saved, the file is immediately available on the public portfolio.
              </p>
            </div>

            <div className="resume-admin-grid">
              <div className="card form-subcard">
                <h4 className="subcard-title">Upload / Replace Official PDF</h4>
                <p className="text-sm text-secondary" style={{ margin: '0.5rem 0 1rem 0' }}>
                  Select your PDF resume. The file will be stored at <code>/public/uploads/</code> 
                  and served permanently.
                </p>

                <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                  <Upload size={16} />
                  <span>Choose PDF File to Upload</span>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    style={{ display: 'none' }}
                    onChange={handleResumeUpload}
                  />
                </label>

                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label className="form-label">Or Custom Hosted URL Path</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="/uploads/resume.pdf or https://..."
                    value={draft.personalInfo.contacts.resumeUrl || ''}
                    onChange={(e) => setDraft({
                      ...draft,
                      personalInfo: {
                        ...draft.personalInfo,
                        contacts: { ...draft.personalInfo.contacts, resumeUrl: e.target.value }
                      }
                    })}
                  />
                </div>
              </div>

              <div className="card form-subcard">
                <h4 className="subcard-title">Current Public Resume Status</h4>
                {draft.personalInfo.contacts.resumeUrl ? (
                  <div style={{ marginTop: '1rem' }}>
                    <div className="doc-attached-pill" style={{ marginBottom: '1rem' }}>
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span className="mono text-sm">{draft.personalInfo.contacts.resumeUrl}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a 
                        href={draft.personalInfo.contacts.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye size={14} />
                        <span>View Document</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="callout-note" style={{ marginTop: '1rem' }}>
                    <AlertCircle size={16} className="text-amber" />
                    <span>
                      No resume file uploaded yet. On the public site, resume download/preview actions are completely hidden without any placeholder messages.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: Certificates & Documents
            =================================================================== */}
        {activeTab === 'certificates' && (
          <div className="card admin-section-card">
            <div className="certificates-admin-header">
              <div>
                <h3 className="section-card-title">Certificates & Document Credentials</h3>
                <p className="section-card-desc">
                  Upload official scorecard PDFs or verification images. Control which documents are published publicly.
                </p>
              </div>

              <button className="btn btn-primary btn-sm" onClick={handleAddCertEntry}>
                <Plus size={15} />
                <span>Add Certificate Entry</span>
              </button>
            </div>

            <div className="cert-admin-list" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(draft.certificates || []).map((cert) => (
                <div key={cert.id} className="card form-subcard cert-admin-row">
                  <div className="cert-admin-meta">
                    <div className="form-group">
                      <label className="form-label">Certificate Title</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={cert.title}
                        onChange={(e) => {
                          const updated = draft.certificates.map(c => c.id === cert.id ? { ...c, title: e.target.value } : c);
                          setDraft({ ...draft, certificates: updated });
                        }}
                      />
                    </div>

                    <div className="grid-2" style={{ gap: '0.75rem', marginTop: '0.5rem' }}>
                      <div className="form-group">
                        <label className="form-label">Issuer</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = draft.certificates.map(c => c.id === cert.id ? { ...c, issuer: e.target.value } : c);
                            setDraft({ ...draft, certificates: updated });
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={cert.date}
                          onChange={(e) => {
                            const updated = draft.certificates.map(c => c.id === cert.id ? { ...c, date: e.target.value } : c);
                            setDraft({ ...draft, certificates: updated });
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                      <label className="form-label">Verification URL (Optional)</label>
                      <input 
                        type="url" 
                        className="form-input" 
                        placeholder="https://..."
                        value={cert.verificationUrl || ''}
                        onChange={(e) => {
                          const updated = draft.certificates.map(c => c.id === cert.id ? { ...c, verificationUrl: e.target.value } : c);
                          setDraft({ ...draft, certificates: updated });
                        }}
                      />
                    </div>
                  </div>

                  <div className="cert-admin-file-controls">
                    <span className="mono text-xs uppercase text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
                      Document Attachment:
                    </span>
                    {cert.fileUrl ? (
                      <div className="cert-file-pill">
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span className="mono text-xs file-name-text">{cert.fileName || cert.fileUrl}</span>
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                          <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                            <Eye size={12} />
                            <span>View Document</span>
                          </a>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={async () => {
                              const updated = draft.certificates.map(c => c.id === cert.id ? { ...c, fileUrl: '', fileName: '' } : c);
                              const updatedDraft = { ...draft, certificates: updated };
                              setDraft(updatedDraft);
                              await savePortfolio(updatedDraft);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                        <Upload size={14} />
                        <span>Upload PDF / Image</span>
                        <input 
                          type="file" 
                          accept=".pdf,application/pdf,image/png,image/jpeg,image/jpg"
                          style={{ display: 'none' }}
                          onChange={(e) => handleCertUpload(cert.id, e)}
                        />
                      </label>
                    )}

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="remember-checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={cert.published !== false}
                          onChange={(e) => {
                            const updated = draft.certificates.map(c => c.id === cert.id ? { ...c, published: e.target.checked } : c);
                            setDraft({ ...draft, certificates: updated });
                          }}
                        />
                        <span className="text-xs">Show on Public Portfolio</span>
                      </label>

                      <button 
                        className="btn btn-outline btn-sm text-dim"
                        onClick={() => handleDeleteCert(cert.id)}
                        title="Delete entry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 5: Publishing & Deployment Guide
            =================================================================== */}
        {activeTab === 'publish' && (
          <div className="card admin-section-card">
            <div className="section-card-header">
              <h3 className="section-card-title">Production Publishing Workflow & Storage Guide</h3>
              <p className="section-card-desc">
                Clear architectural explanation of how persistent storage and updates work after deployment.
              </p>
            </div>

            <div className="grid-2" style={{ gap: '1.5rem' }}>
              
              {/* Option 1: Full-Stack Node / Docker / VPS */}
              <div className="card form-subcard">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Server size={18} className="text-emerald" />
                  <h4 className="subcard-title">Mode 1: Persistent Server Deployment (Express / Docker)</h4>
                </div>
                <p className="text-xs text-secondary" style={{ lineHeight: '1.6', marginBottom: '0.75rem' }}>
                  When deployed on a persistent server (e.g., Render Web Service, Railway, VPS, or Docker container with a mounted volume):
                </p>
                <ul className="guide-bullet-list" style={{ marginBottom: '1rem' }}>
                  <li>Clicking <strong>"Save & Publish to Disk"</strong> writes directly to <code>server/data/portfolioData.json</code> and saves uploaded files to <code>public/uploads/</code>.</li>
                  <li>All changes become <strong>instantly live</strong> for public recruiters with zero redeployment needed.</li>
                  <li>Authentication is validated by the Node backend against the secure <code>.env</code> file.</li>
                </ul>
                <div className="code-block-inline">
                  npm run build<br />
                  npm start  # Runs Node server on port 5000 serving built dist/ and API
                </div>
              </div>

              {/* Option 2: Static Git Hosting */}
              <div className="card form-subcard">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <GitBranch size={18} className="text-cyan" />
                  <h4 className="subcard-title">Mode 2: Static Git-Based Hosting (Vercel / GitHub Pages)</h4>
                </div>
                <p className="text-xs text-secondary" style={{ lineHeight: '1.6', marginBottom: '0.75rem' }}>
                  If you deploy as a static site without a persistent backend server:
                </p>
                <ol className="guide-bullet-list" style={{ marginBottom: '1rem' }}>
                  <li>Edit your links and upload your files locally in this Owner Console.</li>
                  <li>Click <strong>"Save & Publish to Disk"</strong>. This saves <code>src/data/portfolioData.json</code> and your upload files locally.</li>
                  <li>Commit and push the changes to GitHub:
                    <div className="code-block-inline" style={{ marginTop: '0.4rem' }}>
                      git add public/uploads src/data<br />
                      git commit -m "Update resume & portfolio assets"<br />
                      git push origin main
                    </div>
                  </li>
                  <li>Vercel / GitHub Pages automatically rebuilds and deploys the updated public site within seconds.</li>
                </ol>
              </div>

            </div>

            {/* Manual Backup / Export */}
            <div className="card" style={{ marginTop: '1.5rem', background: 'rgba(7, 13, 30, 0.6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 className="text-sm font-semibold">Manual Configuration Backup</h4>
                  <p className="text-xs text-muted">Download your current configuration as a JSON file anytime.</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={handleExportJson}>
                  <Download size={14} />
                  <span>Export portfolioData.json</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
