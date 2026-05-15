<div align="center">

# ✨ Excel.AI Platform

### AI-Powered Data Analytics & Visualization

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-excelaivansh.netlify.app-6366f1?style=for-the-badge)](https://excelaivansh.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-vansh2772%2FExcel.AI-181717?style=for-the-badge&logo=github)](https://github.com/vansh2772/Excel.AI)
[![Netlify](https://img.shields.io/badge/Deployed_on-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://excelaivansh.netlify.app/)
[![Firebase](https://img.shields.io/badge/Database-Firebase-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

<br/>

> Transform your Excel & CSV files into stunning AI-powered insights with interactive charts, intelligent chat, and a real-time admin dashboard — all in your browser.

<br/>

![Tech Stack](https://skillicons.dev/icons?i=react,typescript,vite,tailwind,firebase&theme=dark)

</div>

---

## 🖥️ Live Demo

**🌐 [https://excelaivansh.netlify.app/](https://excelaivansh.netlify.app/)**

> Login with Google or register with email/password to get started instantly.

---

## 🔐 Admin Panel Access

The platform includes a full-featured **Admin Dashboard** backed by Firebase Firestore.

| Step | Action |
|------|--------|
| 1 | Login with **`vansh6dec@gmail.com`** (Google or email) |
| 2 | The **Admin** tab appears automatically in the Dashboard |
| 3 | View all users, manage roles, and browse uploaded files in real-time |

**To promote any user to admin:**
- Go to **Admin → Users tab** → click the 🛡️ **Shield** icon next to any user
- Role changes are saved to Firestore instantly

---

## ✨ Key Features

### 🤖 AI-Powered Analytics
- **Intelligent Chat Assistant** — Upload files & get instant AI insights via natural language
- **Smart Chart Recommendations** — AI suggests the best visualization for your data
- **Automated Data Analysis** — Generate comprehensive insights automatically
- **Contextual Help** — Ask questions about your specific dataset

### 📊 Advanced Visualizations
- **2D Charts** — Bar, Line, Pie, Scatter, Area (powered by Chart.js & Recharts)
- **3D Visualizations** — Interactive 3D bar charts & scatter plots (Three.js)
- **Real-time Rendering** — Smooth, responsive chart updates
- **Export** — Download charts as PNG or PDF

### 🔐 Firebase Authentication & Database
- **Google OAuth** — One-click sign-in with Google
- **Email/Password** — Traditional registration & login
- **Firestore** — Real-time database for user profiles & upload metadata
- **Firebase Storage** — Actual Excel/CSV files stored in the cloud
- **Role-based Access** — User and Admin roles, managed from the dashboard

### 🛡️ Admin Dashboard
- **Live User Management** — See all registered users from Firestore
- **Upload History** — View every file uploaded across all users
- **Real Stats** — Live counts, storage usage, active users
- **Admin Actions** — Promote/demote roles, delete users & file records
- **Download Files** — Direct links to files stored in Firebase Storage

### 📁 Robust Data Processing
- **Multi-format** — Excel (`.xlsx`, `.xls`) and CSV files
- **Large Datasets** — Up to 100MB, 100,000 rows
- **Smart Detection** — Automatic type inference & validation
- **Statistical Analysis** — Mean, median, mode, std deviation, and more

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS (Deep Space theme) |
| **Authentication** | Firebase Auth (Google + Email) |
| **Database** | Firebase Firestore |
| **File Storage** | Firebase Storage |
| **2D Charts** | Chart.js + Recharts |
| **3D Charts** | Three.js + @react-three/fiber |
| **AI / Insights** | Google Generative AI (Gemini) |
| **File Parsing** | Papa Parse (CSV) + SheetJS (Excel) |
| **Notifications** | React Hot Toast |
| **Deployment** | Netlify |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **Firebase project** (free Spark plan works)
- **Google Cloud Console** account (for OAuth)

### 1. Clone & Install
```bash
git clone https://github.com/vansh2772/Excel.AI.git
cd Excel.AI
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the project root:
```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com

# Google AI (optional — enables AI chat features)
VITE_GOOGLE_AI_API_KEY=your_gemini_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Firebase Setup (5 minutes)
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a project → Add a **Web App** → copy the config
3. Enable **Authentication** → Sign-in Methods → **Email/Password** + **Google**
4. Create **Firestore Database** → Start in production mode
5. Enable **Storage**
6. Apply Firestore rules from `firestore.rules` in this repo

### 4. Google OAuth Setup
1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Go to **Credentials → OAuth 2.0 Client IDs**
3. Add **Authorized JavaScript Origins**:
   ```
   http://localhost:5173
   https://your-netlify-site.netlify.app
   ```

### 5. Run Locally
```bash
npm run dev
# → http://localhost:5173
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/              # AdminDashboard (Firestore-backed)
│   ├── auth/               # LoginForm, RegisterForm, GoogleAuthButton
│   ├── charts/             # AdvancedChartSelector, Chart3D, SmartChartRecommendations
│   ├── chat/               # AI ChatBot + toggle
│   ├── history/            # AnalysisHistory
│   ├── layout/             # Header, Footer
│   └── ui/                 # Button, Card, LoadingSpinner
├── contexts/
│   └── AuthContext.tsx     # Firebase Auth state management
├── hooks/
│   └── useDataStore.ts     # File processing + Firestore upload saving
├── pages/
│   ├── AuthPage.tsx        # Login / Register page
│   └── Dashboard.tsx       # Main app dashboard
├── services/
│   ├── firebase.ts         # Firebase app initialization
│   ├── aiService.ts        # Google Gemini AI integration
│   └── googleAuth.ts       # Legacy Google auth helpers
├── types/                  # TypeScript type definitions
└── utils/                  # dataProcessing, fileProcessing, chartExport
```

---

## 🚀 Deployment on Netlify

### Step 1 — Connect Repository
Link your GitHub repo to Netlify. Build settings:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Step 2 — Set Environment Variables
In **Netlify → Site Settings → Environment Variables**, add all variables from your `.env` file.

### Step 3 — Deploy
Push to `main` branch — Netlify auto-deploys on every push.

### Step 4 — Update OAuth Origins
Add your Netlify domain to Google Cloud Console authorized origins.

---

## 🔒 Firestore Security Rules

The `firestore.rules` file in this repo contains production-ready security rules:

- ✅ Users can only read/write their own profile
- ✅ Users can only read their own uploads
- ✅ Admins can read/write all users and uploads
- ✅ Anyone authenticated can create an upload record

Apply these rules in **Firebase Console → Firestore → Rules**.

---

## 📊 Usage Guide

### Basic Workflow
1. **Sign up** or **sign in with Google**
2. **Upload** an Excel or CSV file (drag & drop)
3. **Review** the data overview — stats, quality assessment
4. **Visualize** — pick a chart type, configure axes
5. **Chat** with the AI assistant for instant insights
6. **Export** your charts as PNG or PDF

### Admin Workflow
1. Login with an admin account
2. Click the **Admin** tab in the dashboard
3. **Overview** — see live user counts and recent uploads
4. **Users** — manage roles, delete accounts
5. **Uploads** — browse all files, download from Firebase Storage

---

## 🔮 Roadmap

- [ ] Real-time collaboration (multi-user editing)
- [ ] Direct SQL database connectivity
- [ ] Scheduled reports & email summaries
- [ ] Custom dashboard sharing (public links)
- [ ] Mobile-responsive native app (React Native)
- [ ] PowerPoint & Word export

---

## 📞 Contact

**LinkedIn:** [Vansh Khandelwal](https://www.linkedin.com/in/vansh-khandelwal-122205324/)

**GitHub:** [@vansh2772](https://github.com/vansh2772)

---

<div align="center">

**Built with ❤️ using React, TypeScript, Firebase & Google AI**

*Transform your data into insights with Excel.AI — where artificial intelligence meets data visualization.*

[![Live Demo](https://img.shields.io/badge/Try_it_Live-6366f1?style=for-the-badge&logo=netlify&logoColor=white)](https://excelaivansh.netlify.app/)

</div>