import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { isConfigured } from '../utils/helpers';
import { 
  ExternalLink, 
  CheckCircle2, 
  Server, 
  Layers, 
  ShieldCheck, 
  GitBranch, 
  Database, 
  Zap, 
  RefreshCw, 
  Clock, 
  Lock, 
  Activity,
  AlertCircle,
  FileCode2,
  ChevronRight,
  Terminal,
  Cpu
} from 'lucide-react';
import { Github } from './Icons';

export default function ArthSetuFeatured() {
  const { data } = usePortfolio();
  const { flagshipProject } = data;
  const [activeTab, setActiveTab] = useState('architecture'); // 'architecture', 'saga', 'tests', 'decisions', 'kafka'

  const hasDeployment = isConfigured(flagshipProject.links?.deployment);

  return (
    <section id="arthsetu" className="section section-featured">
      <div className="container">
        
        {/* Featured Flagship Header */}
        <div className="featured-banner-wrapper">
          <div className="featured-badge-row">
            <span className="badge-flagship">
              <Zap size={14} className="badge-icon-amber" />
              {flagshipProject.badge}
            </span>
            <span className="badge-type">{flagshipProject.type}</span>
            <span className="badge-verified">
              <CheckCircle2 size={14} className="text-emerald" />
              Verified 37 Passing Tests
            </span>
          </div>

          <h2 className="featured-title">{flagshipProject.name}</h2>
          <p className="featured-tagline">{flagshipProject.tagline}</p>

          {/* Action Links & Polished Status */}
          <div className="featured-links-bar">
            {isConfigured(flagshipProject.links?.github) && (
              <a 
                href={flagshipProject.links.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
              >
                <Github size={16} />
                <span>View GitHub Repository</span>
              </a>
            )}

            {hasDeployment ? (
              <a 
                href={flagshipProject.links.deployment} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
              >
                <ExternalLink size={16} />
                <span>Open Live Deployment</span>
              </a>
            ) : (
              <div className="deployment-placeholder-pill" title="Microservices core and Docker compose run locally; AWS MSK/ECS deployment blueprint ready.">
                <Clock size={15} className="text-amber" />
                <span>Core Repository on GitHub · AWS Deployment Blueprint Documented</span>
              </div>
            )}
          </div>
        </div>

        {/* Problem -> Approach -> Outcome Summary Cards */}
        <div className="grid-3 summary-grid">
          <div className="card summary-card">
            <div className="summary-card-header">
              <AlertCircle size={18} className="text-amber" />
              <h3 className="summary-title">The Engineering Problem</h3>
            </div>
            <p className="summary-desc">{flagshipProject.overview.problem}</p>
          </div>

          <div className="card summary-card">
            <div className="summary-card-header">
              <Layers size={18} className="text-blue" />
              <h3 className="summary-title">Architectural Approach</h3>
            </div>
            <p className="summary-desc">{flagshipProject.overview.approach}</p>
          </div>

          <div className="card summary-card">
            <div className="summary-card-header">
              <CheckCircle2 size={18} className="text-emerald" />
              <h3 className="summary-title">Verified Outcome</h3>
            </div>
            <p className="summary-desc">{flagshipProject.overview.outcome}</p>
          </div>
        </div>

        {/* Verified Tech Stack Pills */}
        <div className="tech-stack-container card">
          <div className="tech-stack-header">
            <span className="mono text-xs uppercase text-muted">Verified Tech Stack & Infrastructure Versions</span>
          </div>
          <div className="tech-pills-wrap">
            {flagshipProject.techStack.map((tech) => (
              <div key={tech.name} className="tech-pill">
                <span className="tech-pill-name">{tech.name}</span>
                <span className="tech-pill-version">{tech.version}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Technical Deep-Dive Tabs */}
        <div className="deep-dive-card card card-highlight">
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'architecture' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('architecture')}
            >
              <Server size={16} />
              <span>System Architecture</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'saga' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('saga')}
            >
              <RefreshCw size={16} />
              <span>Saga Transfer Flow</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'tests' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('tests')}
            >
              <CheckCircle2 size={16} />
              <span>Verified Test Evidence (37)</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'decisions' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('decisions')}
            >
              <Cpu size={16} />
              <span>Engineering Decisions</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'kafka' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('kafka')}
            >
              <Activity size={16} />
              <span>Kafka Event Contracts</span>
            </button>
          </div>

          {/* TAB 1: System Architecture Diagram & Service Decomposition */}
          {activeTab === 'architecture' && (
            <div className="tab-pane">
              <div className="pane-intro">
                <h3 className="pane-heading">Hexagonal Microservices with Isolated Databases</h3>
                <p className="pane-subtext">
                  The banking core follows a database-per-service pattern across four independent PostgreSQL instances.
                  API Gateway acts as the secure reverse proxy, offloading authentication and rate-limiting from downstream services.
                </p>
              </div>

              {/* High-Fidelity Visual Architecture Topology */}
              <div className="architecture-canvas">
                <div className="arch-layer">
                  <div className="arch-layer-label">CLIENT / PERIMETER</div>
                  <div className="arch-box client-box">
                    <span className="arch-box-title">Client Apps / Postman</span>
                    <span className="arch-box-sub">HTTPS :8080</span>
                  </div>
                  <div className="arch-arrow">↓ JWT Bearer Token</div>
                  <div className="arch-box gateway-box">
                    <div className="arch-box-header">
                      <ShieldCheck size={16} className="text-cyan" />
                      <span className="arch-box-title">Spring Cloud Gateway (:8080)</span>
                    </div>
                    <ul className="arch-box-list">
                      <li>WebFlux & Netty Non-blocking Reactive Engine</li>
                      <li>JWT RS256 Validation using <code>public.pem</code></li>
                      <li>Token-Bucket Rate Limiter per User (Redis backed: 10 req/s, burst 20)</li>
                      <li>Header Enrichment: Injects trusted <code>X-User-Id</code> & <code>X-User-Role</code></li>
                    </ul>
                  </div>
                </div>

                <div className="arch-arrow-split">↓ Routed Requests with Trusted Identity Headers ↓</div>

                {/* Core Microservices Row */}
                <div className="arch-services-row">
                  <div className="arch-service-card">
                    <div className="service-card-top">
                      <Lock size={16} className="text-blue" />
                      <span className="service-name">Auth Service</span>
                      <span className="service-port">:8081</span>
                    </div>
                    <p className="service-desc">User identity, BCrypt hashing, JWT RS256 token signing with <code>private.pem</code>. Private key never leaves this service.</p>
                    <div className="service-db-tag">
                      <Database size={13} />
                      <span>PostgreSQL :: auth_db</span>
                    </div>
                  </div>

                  <div className="arch-service-card">
                    <div className="service-card-top">
                      <Database size={16} className="text-emerald" />
                      <span className="service-name">Account Service</span>
                      <span className="service-port">:8082</span>
                    </div>
                    <p className="service-desc">Account lifecycles, ledger balances, <code>@Version</code> optimistic locking, and atomic <code>@Modifying</code> JPQL debit updates.</p>
                    <div className="service-db-tag">
                      <Database size={13} />
                      <span>PostgreSQL :: account_db</span>
                    </div>
                  </div>

                  <div className="arch-service-card">
                    <div className="service-card-top">
                      <RefreshCw size={16} className="text-amber" />
                      <span className="service-name">Transaction Service</span>
                      <span className="service-port">:8083</span>
                    </div>
                    <p className="service-desc">Saga choreography engine, Redisson distributed locking, REST idempotency cache, Feign balance check & compensating refunds.</p>
                    <div className="service-db-tag">
                      <Database size={13} />
                      <span>PostgreSQL :: transaction_db</span>
                    </div>
                  </div>
                </div>

                {/* Infrastructure Backbone Row */}
                <div className="arch-backbone-grid">
                  <div className="backbone-card redis-card">
                    <div className="backbone-header">
                      <Zap size={16} className="text-amber" />
                      <span className="backbone-title">Redis 7 & Redisson (:6379)</span>
                    </div>
                    <p className="backbone-detail">
                      • Distributed lock <code>lock:account:{"{id}"}</code> (wait 5s, lease 10s)<br/>
                      • 24h Idempotency Engine for <code>X-Idempotency-Key</code><br/>
                      • Token-bucket rate limiting counter
                    </p>
                  </div>

                  <div className="backbone-card kafka-card">
                    <div className="backbone-header">
                      <Activity size={16} className="text-cyan" />
                      <span className="backbone-title">Apache Kafka 3.7.1 + Zookeeper (:9092)</span>
                    </div>
                    <p className="backbone-detail">
                      • Event topics: <code>fincore.transfer.*</code>, <code>fincore.account.*</code><br/>
                      • Temporal decoupling and asynchronous Saga choreography<br/>
                      • Monitored live via Kafka UI (:8090)
                    </p>
                  </div>

                  <div className="backbone-card obs-card">
                    <div className="backbone-header">
                      <Activity size={16} className="text-emerald" />
                      <span className="backbone-title">Observability & Tracing</span>
                    </div>
                    <p className="backbone-detail">
                      • Prometheus (:9090) scraping Actuator metrics<br/>
                      • Grafana (:3000) dashboards<br/>
                      • Zipkin (:9411) distributed request tracing
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Responsibilities Table */}
              <div className="table-container" style={{ marginTop: '1.5rem' }}>
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Service Module</th>
                      <th>Port</th>
                      <th>Primary Responsibilities</th>
                      <th>Storage & Caching</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>API Gateway</strong></td>
                      <td><code>:8080</code></td>
                      <td>Single entry point, JWT RS256 token verification, Redis rate limiting, user header injection</td>
                      <td>Redis 7 (Rate Limiter)</td>
                    </tr>
                    <tr>
                      <td><strong>Auth Service</strong></td>
                      <td><code>:8081</code></td>
                      <td>User registration, BCrypt password hashing, JWT RS256 signing (RSA private.pem)</td>
                      <td>PostgreSQL (auth_db)</td>
                    </tr>
                    <tr>
                      <td><strong>Account Service</strong></td>
                      <td><code>:8082</code></td>
                      <td>Account lifecycle (PEN/USD), @Version optimistic locking, atomic @Modifying JPQL debit execution</td>
                      <td>PostgreSQL (account_db)</td>
                    </tr>
                    <tr>
                      <td><strong>Transaction Service</strong></td>
                      <td><code>:8083</code></td>
                      <td>Saga choreography, Redisson distributed lock, idempotency engine, compensating refund handler</td>
                      <td>PostgreSQL (transaction_db) + Redis 7</td>
                    </tr>
                    <tr>
                      <td><strong>Config Server</strong></td>
                      <td><code>:8888</code></td>
                      <td>Centralized native classpath configuration with Kafka cloud bus refresh support</td>
                      <td>Classpath Git/Local</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Saga Choreography & Concurrency Sequence Flow */}
          {activeTab === 'saga' && (
            <div className="tab-pane">
              <div className="pane-intro">
                <h3 className="pane-heading">End-to-End Transfer Flow: Distributed Locking & Saga Choreography</h3>
                <p className="pane-subtext">
                  Inter-account transfers use a two-phase architecture: synchronous pre-flight checks (idempotency key & distributed lock) 
                  followed by asynchronous Saga choreography with automated compensating transactions (refunds).
                </p>
              </div>

              {/* Step by Step Visual Flow */}
              <div className="saga-steps-timeline">
                
                <div className="saga-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <div className="step-header">
                      <h4 className="step-title">Phase 1: Synchronous Pre-flight Validation</h4>
                      <span className="step-badge tag-cyan">HTTP 202 Accepted</span>
                    </div>
                    <p className="step-desc">
                      Client sends <code>POST /api/v1/transfers</code> with <code>X-Idempotency-Key</code>.
                      Transaction Service checks Redis to prevent re-submissions. It acquires a <strong>Redisson distributed lock</strong> (<code>lock:account:{"{sourceId}"}</code>, wait 5s, lease 10s) to prevent concurrent overdraft attempts across service instances.
                      It calls Account Service via Feign to verify sufficient funds and owner identity, saves the transfer as <code>PENDING</code> in PostgreSQL, caches the idempotency key (TTL 24h), releases the lock, and publishes <code>fincore.transfer.initiated</code> to Kafka.
                    </p>
                  </div>
                </div>

                <div className="saga-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <div className="step-header">
                      <h4 className="step-title">Phase 2: Source Account Debit Execution</h4>
                      <span className="step-badge tag-amber">Kafka Event: transfer.initiated</span>
                    </div>
                    <p className="step-desc">
                      Account Service consumes <code>fincore.transfer.initiated</code>. It executes an atomic <code>@Modifying</code> direct JPQL update:
                      <code className="code-block-inline">UPDATE Account a SET a.balance = a.balance - :amount WHERE a.id = :id AND a.balance &gt;= :amount</code>
                      This direct database update bypasses JPA EntityManager cache staleness.
                      If the debit succeeds, it publishes <code>fincore.account.debited</code>. If insufficient funds occur, it publishes <code>fincore.account.debit.failed</code>.
                    </p>
                  </div>
                </div>

                <div className="saga-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <div className="step-header">
                      <h4 className="step-title">Phase 3A: Target Account Credit & Transfer Completion</h4>
                      <span className="step-badge tag-emerald">Kafka Event: transfer.completed</span>
                    </div>
                    <p className="step-desc">
                      Transaction Service consumes <code>fincore.account.debited</code> and executes an internal Feign credit call to Account Service: <code>POST /api/v1/accounts/{"{targetId}"}/credit</code>.
                      When credit returns HTTP 200, Transaction Service updates the transfer status to <code>COMPLETED</code> and publishes <code>fincore.transfer.completed</code> to Kafka for downstream audit and notification consumers.
                    </p>
                  </div>
                </div>

                <div className="saga-step saga-step-compensation">
                  <div className="step-number">3B</div>
                  <div className="step-content">
                    <div className="step-header">
                      <h4 className="step-title">Phase 3B: Automated Compensating Transaction (Refund)</h4>
                      <span className="step-badge tag-amber">Saga Compensation</span>
                    </div>
                    <p className="step-desc">
                      <strong>Critical Distributed Failure Guard:</strong> If crediting the target account fails (due to downstream 5xx errors or inactive target accounts), 
                      Transaction Service catches the fault and immediately invokes an <strong>automated compensating refund</strong>:
                      <code>POST /api/v1/accounts/{"{sourceId}"}/credit</code> (restoring the debited amount to the sender).
                      It transitions the transfer status to <code>FAILED</code> with a clear <code>failureReason: "Target credit failed, refunded"</code> and publishes <code>fincore.transfer.cancelled</code>.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: Verified Test Evidence */}
          {activeTab === 'tests' && (
            <div className="tab-pane">
              <div className="pane-intro">
                <div className="evidence-header-flex">
                  <div>
                    <h3 className="pane-heading">Verified Engineering Evidence: Automated Test Suite</h3>
                    <p className="pane-subtext">
                      The core contains <strong>37 automated unit, domain, and web-layer slice tests</strong>. All tests pass with zero failures and zero regressions.
                    </p>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-num">37 / 37</span>
                    <span className="metric-lbl">100% Pass Rate</span>
                  </div>
                </div>
              </div>

              {/* Exact Test Suite Breakdown Table */}
              <div className="table-container">
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Test Suite Class</th>
                      <th>Microservice Module</th>
                      <th>Tests</th>
                      <th>Status</th>
                      <th>Coverage Area & Concurrency Scenarios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flagshipProject.verifiedTests.suites.map((suite) => (
                      <tr key={suite.name}>
                        <td><code>{suite.name}</code></td>
                        <td><span className="tag">{suite.module}</span></td>
                        <td><strong>{suite.count}</strong></td>
                        <td>
                          <span className="tag tag-emerald">
                            <CheckCircle2 size={12} />
                            {suite.result}
                          </span>
                        </td>
                        <td className="text-secondary">{suite.coverage}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: 'rgba(56, 189, 248, 0.05)', fontWeight: '600' }}>
                      <td><strong>Total Verified Automated Tests</strong></td>
                      <td>Multi-module monorepo</td>
                      <td><strong>37</strong></td>
                      <td><span className="tag tag-emerald">100% PASS</span></td>
                      <td>Zero mock leaks, clean isolated execution across Gradle 9.0 test tasks</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="callout-note">
                <AlertCircle size={16} className="text-cyan" />
                <span>
                  <strong>Ethical Engineering Standard:</strong> Test counts and results above reflect actual verified code execution. 
                  No artificial latency reductions or unmeasured performance percentages are fabricated.
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: Key Engineering Decisions & Trade-offs */}
          {activeTab === 'decisions' && (
            <div className="tab-pane">
              <div className="pane-intro">
                <h3 className="pane-heading">Key Senior Backend Engineering Decisions</h3>
                <p className="pane-subtext">
                  Deliberate architectural trade-offs made to ensure data consistency, prevent race conditions, and keep services decoupled.
                </p>
              </div>

              <div className="grid-2 decisions-grid">
                {flagshipProject.engineeringDecisions.map((item, idx) => (
                  <div key={idx} className="card decision-item-card">
                    <div className="decision-header">
                      <FileCode2 size={16} className="text-cyan" />
                      <h4 className="decision-title">{item.decision}</h4>
                    </div>
                    <p className="decision-rationale">{item.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Kafka Topics & Event Contracts */}
          {activeTab === 'kafka' && (
            <div className="tab-pane">
              <div className="pane-intro">
                <h3 className="pane-heading">Kafka Topics, Event Publishers & Consumers</h3>
                <p className="pane-subtext">
                  Durable event streaming backbone enabling temporal decoupling and immutable audit trails across microservices.
                </p>
              </div>

              <div className="table-container">
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Kafka Topic</th>
                      <th>Publishing Service</th>
                      <th>Consuming Services</th>
                      <th>Business Event Trigger</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flagshipProject.kafkaTopics.map((topic) => (
                      <tr key={topic.name}>
                        <td><code>{topic.name}</code></td>
                        <td><span className="tag tag-cyan">{topic.producer}</span></td>
                        <td><span className="tag">{topic.consumers}</span></td>
                        <td>{topic.trigger}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
