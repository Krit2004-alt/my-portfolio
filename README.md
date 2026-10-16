# Kritika Khandelwal — Developer Portfolio & Management System

> **Production-grade personal engineering portfolio** tailored for competitive government and enterprise technology fellowships (including the Bharat Digital Fellowship) and backend engineering internship evaluations.

---

## 1. Two Separated Experiences

### Experience 1: Public Recruiter Portfolio
- **Audience:** Fellowship evaluators, technical recruiters, hiring managers.
- **Strict Quality Guarantees:**
  - **Zero Raw Placeholders:** Never displays `[ADD_EMAIL]`, `[ADD_LINKEDIN_URL]`, `[ADD_RESUME_URL]`, `[ADD_ARTHSETU_DEPLOYMENT_URL]`, or brackets anywhere.
  - **Polished Fallbacks:** If a link or document is not yet configured, the public view shows a polite, professional state (e.g. *"Official Curriculum Vitae available upon recruiter request"* or *"Core Monorepo on GitHub · AWS Deployment Blueprint Documented"*).
  - **Read-Only:** No edit, delete, or file-upload controls are exposed to public visitors.

### Experience 2: Private Owner-Only Administration Console
- **Audience:** Kritika Khandelwal (Portfolio Owner).
- **Access Route:** Click **"Owner Access"** in the footer or visit `http://localhost:5173/#/admin`.
- **Real Server-Side Authentication:** Protected by bcrypt password verification and signed JSON Web Tokens (JWT). Passwords and JWT secrets remain strictly on the server in `.env`.
- **Management Capabilities:**
  1. **Profile & Contacts:** Update headline, bio, official email, LinkedIn, LeetCode, and GitHub URLs.
  2. **Project URLs:** Update ArthSetu deployment URL, TruthTrace repository/docs, and LifeLedger repository/docs.
  3. **Resume Asset Management:** Upload your official PDF resume directly. It is saved to persistent server disk storage at `/public/uploads/` and immediately linked to the public portfolio.
  4. **Certificates & Documents:** Upload official scorecard PDFs/images for GATE CSE 2026, TCS selection letter, Hackathons, or add new certificates. Toggle whether individual credentials appear on the public page.
  5. **Publishing & Deployment Center:** View real-time sync status, export backup JSON, and review deployment commands.

---

## 2. Publishing Workflow & Storage Architecture

### Mode A: Full-Stack / Persistent Server Deployment (Express / Node / Docker / VPS / Render)
When you run the portfolio with its backend server:
1. Log in to the Owner Console at `/#/admin`.
2. Edit your profile, project URLs, or upload a new resume PDF / certificate.
3. Click **"Save & Publish to Disk"**.
4. The server saves your changes directly to `server/data/portfolioData.json` and copies uploaded files to `public/uploads/`.
5. **Result:** Changes and uploaded files are **instantly live** on the public portfolio for all visitors with zero downtime and no rebuild required.

### Mode B: Static Git-Based Hosting (GitHub Pages / Vercel / Netlify)
If deploying to a static host without a long-running Node server:
1. Run the portfolio locally (`npm run dev` and `npm run server`).
2. Log in at `http://localhost:5173/#/admin` and make your updates or file uploads.
3. Click **"Save & Publish to Disk"** (this saves `src/data/portfolioData.json` and files in `public/uploads/`).
4. Commit and push the updated files to your GitHub repository:
   ```bash
   git add public/uploads src/data
   git commit -m "Publish updated resume and credentials"
   git push origin main
   ```
5. Your static host (Vercel, GitHub Pages, or Netlify) detects the Git push, automatically runs `npm run build`, and publishes the live changes within seconds.

---

## 3. Server Configuration & Owner Credentials

Credentials and server secrets are configured in a private `.env` file in the root directory (never committed to Git):

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
OWNER_USERNAME=kritika
OWNER_PASSWORD_HASH=your_bcrypt_hash_here
```

### Changing Your Owner Password
To generate a new BCrypt hash for a custom password, run:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourNewPasswordHere', 10));"
```
Copy the generated hash into `OWNER_PASSWORD_HASH` in `.env` and restart the server.

---

## 4. How to Run Locally

### Terminal 1: Backend Server (Handles Auth, Persistent Storage, File Uploads)
```bash
cd C:\Users\DELL\Documents\my-portfolio
npm run server
# Runs on http://localhost:5000
```

### Terminal 2: Frontend Vite Development Server
```bash
cd C:\Users\DELL\Documents\my-portfolio
npm run dev
# Runs on http://localhost:5173 (proxies /api and /uploads to port 5000)
```

### Production Build & Standalone Run
```bash
# Build the optimized production bundle
npm run build

# Start the standalone server serving both frontend and API
npm start
# Runs on http://localhost:5000
```

---

## 5. Verified Technical Credentials & Projects Summary

- **Candidate:** Kritika Khandelwal — B.Tech CSE, JECRC University, Jaipur ('27)
- **Status:** Selected at TCS (*System Engineer*) · **GATE CSE 2026 Qualified**
- **Flagship Project:** **ArthSetu** (Distributed Digital Banking Platform)
  - Java 21, Spring Boot 3.3.5, Spring Cloud Gateway, Apache Kafka, PostgreSQL 15, Redis 7 & Redisson 3.31, JWT RS256.
  - **37 verified automated tests passing** across 7 test suites (100% pass rate).
  - Saga choreography across Kafka with automated compensating refunds on downstream failure.
  - Concurrency guards: Redisson distributed lock (`lock:account:{id}`) + JPA `@Version` optimistic locking.
- **TruthTrace & LifeLedger:** Full-stack architecture blueprints with documented functional modules, OCR/NLP pipelines, and user data isolation.
