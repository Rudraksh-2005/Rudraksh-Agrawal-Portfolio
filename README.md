# Rudraksh Agrawal Portfolio (Player 208)

An interactive, Squid Game-themed developer portfolio featuring a Red Light / Green Light mini-game to unlock the dormitory, dynamic Three.js 3D animations, real-time Socket.IO live player stats, an SQLite leaderboard, and verified projects.

[![GitHub](https://img.shields.io/badge/GitHub-Rudraksh--2005-pink?logo=github)](https://github.com/Rudraksh-2005)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org)
[![Three.js](https://img.shields.io/badge/Three.js-0.128-teal?logo=three.js)](https://threejs.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-orange?logo=socket.io)](https://socket.io)

---

## 🎮 Features
- **Red Light, Green Light Mini-Game**: Interactive canvas & SVG doll game with reaction-time tracking and stage unlock mechanics (or VIP bypass).
- **Three.js 3D Visuals**: Floating 3D geometries that react and change lighting based on the doll's scanning state.
- **Real-Time Multiplayer Stats**: Socket.IO broadcasts live online player count and total eliminations worldwide.
- **Hall of Survivors (Leaderboard)**: Persistent SQLite database storing verified fastest clears.
- **Projects Cleared**:
  - **DocuVerse AI**: AI-powered RAG document platform ([Live Demo](https://docuverse-ai-rag-frontend-theta.vercel.app/))
  - **Chatify**: Real-time full-stack chat application ([Live Demo](https://chatify-7n2s.vercel.app/))
  - **Screen Time Productivity**: ML-based XGBoost prediction dashboard ([Live Demo](https://screen-time-analysis-for-analyzing-predictivity.streamlit.app/))
  - **AlignAV Pty Ltd**: Software Engineering Internship with certificate preview
- **Contact Invitation**: Form storing messages in SQLite with optional SMTP email notifications.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Rudraksh-2005/Rudraksh-Agrawal-Portfolio.git
cd Rudraksh-Agrawal-Portfolio
npm install
```

### 2. Environment Setup (Optional)
```bash
cp .env.example .env
```
Fill in your SMTP credentials in `.env` if you wish to receive incoming contact inquiries via email.

### 3. Run Locally
```bash
npm start
# Server runs at http://localhost:3000
```
Or for development auto-reload:
```bash
npm run dev
```

---

## 🌐 Deployment Guide

Because this application uses a Node.js server with **Socket.IO** (WebSockets) and **SQLite** for real-time stats and messages, deploying to a Node Web Service is recommended:

### Option A: Render (Free Web Service)
1. Push this repository to your GitHub account (`https://github.com/Rudraksh-2005/rudraksh-agrawal-portfolio`).
2. Log into [Render.com](https://render.com) and click **New + > Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Create Web Service**. Render will deploy it with a free `https://<your-app>.onrender.com` URL!

### Option B: Railway
1. Go to [Railway.app](https://railway.app) and create a **New Project > Deploy from GitHub repo**.
2. Select `rudraksh-agrawal-portfolio`.
3. Railway automatically detects Node.js and starts `npm start`.
4. Go to **Settings > Generate Domain** to get your public URL.

---

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Three.js, SVG Animations
- **Backend**: Node.js, Express.js, Socket.IO, Helmet (Security & CSP), Express Rate Limit
- **Database**: SQLite (better-sqlite3)
- **Email**: Nodemailer (SMTP)

---

## 👤 Author
**Rudraksh Agrawal** (Player 208)  
- GitHub: [@Rudraksh-2005](https://github.com/Rudraksh-2005)  
- Email: [rudrakshagrawal58@gmail.com](mailto:rudrakshagrawal58@gmail.com)  
- B.Tech CSE, UPES Dehradun
