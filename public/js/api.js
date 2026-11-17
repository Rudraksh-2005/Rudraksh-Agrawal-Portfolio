// Talks to the Node/Express backend: leaderboard, contact form and live socket stats.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var lastResult = null;

  /* ---------- Leaderboard ---------- */
  function loadBoard() {
    fetch('/api/scores').then(function (r) { return r.json(); }).then(function (rows) {
      var list = $('boardList'); list.textContent = '';
      if (!rows.length) {
        var e = document.createElement('li'); e.className = 'empty'; e.textContent = 'No survivors yet. Be the first!';
        list.appendChild(e); return;
      }
      rows.forEach(function (s, i) {
        var li = document.createElement('li');
        var a = document.createElement('span'); a.className = 'rank'; a.textContent = '#' + (i + 1);
        var b = document.createElement('span'); b.textContent = s.name + '  (' + s.deaths + ' eliminations)';
        var c = document.createElement('span'); c.className = 't'; c.textContent = s.time.toFixed(2) + 's';
        li.append(a, b, c); list.appendChild(li);
      });
    }).catch(function () {});
  }

  window.addEventListener('survived', function (e) {
    lastResult = e.detail;
    $('yourTime').textContent = 'You cleared it in ' + lastResult.time.toFixed(2) + 's. Put your name on the board:';
    $('scoreForm').hidden = false;
  });

  $('scoreForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!lastResult) return;
    var msg = $('scoreMsg'); msg.textContent = 'Submitting…';
    fetch('/api/scores', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: $('scoreName').value, time: lastResult.time, deaths: lastResult.deaths })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        msg.textContent = res.ok ? 'You’re on the board!' : (res.d.error || 'Could not submit.');
        if (res.ok) { lastResult = null; $('scoreForm').hidden = true; loadBoard(); }
      }).catch(function () { msg.textContent = 'Network error. Try again.'; });
  });

  /* ---------- Contact form ---------- */
  $('contactForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var f = ev.target, msg = $('contactMsg'); msg.textContent = 'Sending…';
    fetch('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: f.name.value, email: f.email.value, message: f.message.value, website: f.website.value })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (res.ok) { msg.textContent = 'Invitation accepted. I’ll reply soon!'; f.reset(); }
        else msg.textContent = res.d.error || 'Something went wrong.';
      }).catch(function () { msg.textContent = 'Network error. Try again.'; });
  });

  /* ---------- Live stats (Socket.io) ---------- */
  if (window.io) {
    var socket = io();
    socket.on('stats', function (s) {
      $('live').textContent = '● ' + s.online + ' player' + (s.online === 1 ? '' : 's') + ' online';
      $('elims').textContent = s.eliminations + ' eliminations worldwide so far.';
    });
    window.addEventListener('eliminated', function () { socket.emit('eliminated'); });
  } else { $('live').textContent = ''; }

  loadBoard();
})();
