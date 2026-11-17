require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const Database = require('better-sqlite3');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const MIN_POSSIBLE_TIME = 3.5; // the fastest honest clear is about 3.8s

/* ---------- Database ---------- */
const db = new Database(path.join(__dirname, 'data.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, time REAL NOT NULL, deaths INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, email TEXT, body TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS counters (key TEXT PRIMARY KEY, value INTEGER NOT NULL);
  INSERT OR IGNORE INTO counters (key, value) VALUES ('eliminations', 0);
`);
const topScores = db.prepare('SELECT name, time, deaths FROM scores ORDER BY time ASC LIMIT 10');
const addScore = db.prepare('INSERT INTO scores (name, time, deaths) VALUES (?, ?, ?)');
const addMessage = db.prepare('INSERT INTO messages (name, email, body) VALUES (?, ?, ?)');
const bumpElims = db.prepare("UPDATE counters SET value = value + 1 WHERE key = 'eliminations'");
const getElims = db.prepare("SELECT value FROM counters WHERE key = 'eliminations'");

/* ---------- Email (optional) ---------- */
const mailer = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

/* ---------- App ---------- */
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('trust proxy', 1);
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: { 'upgrade-insecure-requests': null },
    },
  })
);
app.use(express.json({ limit: '10kb' }));

const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });
const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, max: 8, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a few minutes.' },
});
app.use('/api', apiLimiter);

const clean = (v, max) => String(v || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max);

app.get('/api/scores', (req, res) => res.json(topScores.all()));

app.post('/api/scores', writeLimiter, (req, res) => {
  const name = clean(req.body.name, 20);
  const time = Number(req.body.time);
  const deaths = Math.max(0, Math.min(999, parseInt(req.body.deaths, 10) || 0));
  if (!name) return res.status(400).json({ error: 'Enter a player name.' });
  if (!Number.isFinite(time) || time < MIN_POSSIBLE_TIME || time > 3600)
    return res.status(400).json({ error: 'That time is not valid.' });
  addScore.run(name, Math.round(time * 100) / 100, deaths);
  res.status(201).json({ ok: true });
});

app.post('/api/contact', writeLimiter, async (req, res) => {
  if (req.body.website) return res.json({ ok: true }); // honeypot: bots fill this
  const name = clean(req.body.name, 60);
  const email = clean(req.body.email, 120);
  const message = clean(req.body.message, 1500);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Please fill in every field with a valid email.' });
  addMessage.run(name, email, message);
  if (mailer && process.env.CONTACT_TO) {
    try {
      await mailer.sendMail({
        from: process.env.SMTP_USER, to: process.env.CONTACT_TO, replyTo: email,
        subject: `Portfolio message from ${name}`, text: `${name} <${email}>\n\n${message}`,
      });
    } catch (err) { console.error('Mail failed:', err.message); }
  }
  res.status(201).json({ ok: true });
});

/* ---------- Static files ---------- */
app.use('/vendor/three', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- Live stats ---------- */
let online = 0;
const broadcast = () => io.emit('stats', { online, eliminations: getElims.get().value });
io.on('connection', (socket) => {
  online++; broadcast();
  let last = 0;
  socket.on('eliminated', () => {
    const now = Date.now();
    if (now - last < 500) return; // ignore spam
    last = now; bumpElims.run(); broadcast();
  });
  socket.on('disconnect', () => { online = Math.max(0, online - 1); broadcast(); });
});

server.listen(PORT, () => console.log(`Portfolio running at http://localhost:${PORT}`));
