// ── AUDIO ENGINE ──
var audioCtx = null;
function getCtx() {
  if (!audioCtx) {
    var A = window.AudioContext || window.webkitAudioContext;
    if (A) audioCtx = new A();
  }
  return audioCtx;
}

// BOOT SEQUENCE - cinematic sci-fi startup
function playBoot() {
  var ctx = getCtx();
  if (!ctx) return;

  // Layer 1: deep rumble fade in
  var buf = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
  var data = buf.getChannelData(0);
  for (var i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(i / data.length, 2) * 0.15;
  }
  var rumble = ctx.createBufferSource();
  var rumbleFilter = ctx.createBiquadFilter();
  var rumbleGain = ctx.createGain();
  rumbleFilter.type = 'lowpass';
  rumbleFilter.frequency.setValueAtTime(80, ctx.currentTime);
  rumbleFilter.frequency.linearRampToValueAtTime(200, ctx.currentTime + 1.5);
  rumbleGain.gain.setValueAtTime(0, ctx.currentTime);
  rumbleGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.3);
  rumbleGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.4);
  rumble.buffer = buf;
  rumble.connect(rumbleFilter);
  rumbleFilter.connect(rumbleGain);
  rumbleGain.connect(ctx.destination);
  rumble.start(ctx.currentTime);

  // Layer 2: frequency sweep (power-on rise)
  var sweep = ctx.createOscillator();
  var sweepGain = ctx.createGain();
  var sweepFilter = ctx.createBiquadFilter();
  sweep.type = 'sawtooth';
  sweep.frequency.setValueAtTime(40, ctx.currentTime + 0.1);
  sweep.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.2);
  sweepFilter.type = 'bandpass';
  sweepFilter.frequency.setValueAtTime(200, ctx.currentTime);
  sweepFilter.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 1.2);
  sweepFilter.Q.value = 3;
  sweepGain.gain.setValueAtTime(0, ctx.currentTime + 0.1);
  sweepGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.3);
  sweepGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.3);
  sweep.connect(sweepFilter);
  sweepFilter.connect(sweepGain);
  sweepGain.connect(ctx.destination);
  sweep.start(ctx.currentTime + 0.1);
  sweep.stop(ctx.currentTime + 1.3);

  // Layer 3: digital stutter ticks (system loading)
  var tickTimes = [0.4, 0.55, 0.65, 0.73, 0.79, 0.84, 0.88, 0.91, 0.94];
  for (var t = 0; t < tickTimes.length; t++) {
    (function(time) {
      var tick = ctx.createOscillator();
      var tickGain = ctx.createGain();
      tick.type = 'square';
      tick.frequency.value = 1200 + Math.random() * 400;
      tickGain.gain.setValueAtTime(0.05, ctx.currentTime + time);
      tickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 0.04);
      tick.connect(tickGain);
      tickGain.connect(ctx.destination);
      tick.start(ctx.currentTime + time);
      tick.stop(ctx.currentTime + time + 0.05);
    })(tickTimes[t]);
  }

  // Layer 4: final confirmation PING
  var ping = ctx.createOscillator();
  var pingGain = ctx.createGain();
  var pingFilter = ctx.createBiquadFilter();
  ping.type = 'sine';
  ping.frequency.setValueAtTime(1800, ctx.currentTime + 1.1);
  ping.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 1.15);
  pingFilter.type = 'highpass';
  pingFilter.frequency.value = 1000;
  pingGain.gain.setValueAtTime(0, ctx.currentTime + 1.1);
  pingGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.15);
  pingGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
  ping.connect(pingFilter);
  pingFilter.connect(pingGain);
  pingGain.connect(ctx.destination);
  ping.start(ctx.currentTime + 1.1);
  ping.stop(ctx.currentTime + 2.1);

  // Layer 5: warm welcome chord underneath the ping
  var chordFreqs = [261, 329, 392, 523];
  for (var c = 0; c < chordFreqs.length; c++) {
    (function(freq) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + 1.1);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + 1.1);
      osc.stop(ctx.currentTime + 2.6);
    })(chordFreqs[c]);
  }
}

// LASER CLICK - orbit button
function playLaser() {
  var ctx = getCtx();
  if (!ctx) return;
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  var filter = ctx.createBiquadFilter();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);
  filter.type = 'bandpass';
  filter.frequency.value = 800;
  filter.Q.value = 2;
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.26);
}

// BLIP - chatbot open
function playBlip() {
  var ctx = getCtx();
  if (!ctx) return;
  var freqs = [440, 660];
  for (var i = 0; i < freqs.length; i++) {
    (function(freq, delay) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.07, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.13);
    })(freqs[i], i * 0.1);
  }
}

// SUCCESS CHIME - form sent
function playChime() {
  var ctx = getCtx();
  if (!ctx) return;
  var notes = [523, 659, 784, 1047];
  for (var i = 0; i < notes.length; i++) {
    (function(freq, delay) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.5);
    })(notes[i], i * 0.1);
  }
}

// NAV TICK - subtle hover tick
function playTick() {
  var ctx = getCtx();
  if (!ctx) return;
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 1400;
  gain.gain.setValueAtTime(0.03, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.06);
}

// WHOOSH - section scroll
function playWhoosh() {
  var ctx = getCtx();
  if (!ctx) return;
  var buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
  var data = buf.getChannelData(0);
  for (var i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * 0.15;
  }
  var src = ctx.createBufferSource();
  var filter = ctx.createBiquadFilter();
  var gain = ctx.createGain();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2000, ctx.currentTime);
  filter.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.3);
  filter.Q.value = 1;
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
  src.buffer = buf;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start(ctx.currentTime);
}

// ── BOOT ON LOAD ──
window.addEventListener('load', function() {
  setTimeout(function() {
    try { playBoot(); } catch(e) {}
  }, 600);
});

// ── CURSOR ──
var cur = document.getElementById('cursor');
document.addEventListener('mousemove', function(e) {
  cur.style.left = e.clientX + 'px';
  cur.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button, .pc, .sgr, .sc, .ec, .course-chip, .orbit-btn').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    cur.style.width = '22px'; cur.style.height = '22px';
    cur.style.background = 'var(--accent2)';
  });
  el.addEventListener('mouseleave', function() {
    cur.style.width = '14px'; cur.style.height = '14px';
    cur.style.background = 'var(--accent)';
  });
});

// NAV TICK on hover
document.querySelectorAll('.nav-links a').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    try { playTick(); } catch(e) {}
  });
});

// ORBIT BUTTON laser click
var orbitBtn = document.querySelector('.orbit-btn');
if (orbitBtn) {
  orbitBtn.addEventListener('click', function() {
    try { playLaser(); } catch(e) {}
  });
}

// ── PARTICLES ──
var canvas = document.getElementById('bg-canvas');
var ctx = canvas.getContext('2d');
var W, H, pts = [];
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);
function Particle() {
  this.x = Math.random() * W; this.y = Math.random() * H;
  this.vx = (Math.random() - 0.5) * 0.35; this.vy = (Math.random() - 0.5) * 0.35;
  this.r = Math.random() * 1.3 + 0.3; this.a = Math.random() * 0.45 + 0.1;
  var r = Math.random();
  this.c = r > 0.6 ? '0,212,255' : r > 0.3 ? '255,107,43' : '0,255,136';
}
for (var i = 0; i < 100; i++) pts.push(new Particle());
function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  for (var i = 0; i < pts.length; i++) {
    var p = pts[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + p.c + ',' + p.a + ')'; ctx.fill();
  }
  for (var i = 0; i < pts.length; i++) {
    for (var j = i + 1; j < pts.length; j++) {
      var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = 'rgba(0,212,255,' + (0.05 * (1 - d / 110)) + ')';
        ctx.lineWidth = 0.5; ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── SCROLL REVEAL + WHOOSH ──
var lastSection = '';
var obs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });
document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
setTimeout(function() {
  document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('visible'); });
}, 2000);

// Section whoosh on scroll
var sectionObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting && e.target.id && e.target.id !== lastSection) {
      lastSection = e.target.id;
      try { playWhoosh(); } catch(err) {}
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.section-page').forEach(function(el) {
  sectionObserver.observe(el);
});

// ── COUNT UP ──
function countUp(el) {
  var target = parseInt(el.getAttribute('data-target'));
  var dur = 1600, start = performance.now();
  function step(now) {
    var p = Math.min((now - start) / dur, 1);
    var ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(step); else el.textContent = target;
  }
  requestAnimationFrame(step);
}
var cobs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.count-up[data-target]').forEach(countUp);
      cobs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.about-stats').forEach(function(el) { cobs.observe(el); });

// ── CONTACT FORM ──
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var form = this;
  var btn = form.querySelector('.form-submit');
  btn.textContent = 'Sending...';
  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  }).then(function(res) {
    if (res.ok) {
      document.getElementById('formSuccess').style.display = 'block';
      form.reset();
      btn.textContent = 'Sent!';
      try { playChime(); } catch(err) {}
    } else { btn.textContent = 'Error - Try Again'; }
  }).catch(function() { btn.textContent = 'Error - Try Again'; });
});

// ── CHATBOT ──
var chatToggle = document.getElementById('chatToggle');
var chatWindow = document.getElementById('chatWindow');
var chatClose = document.getElementById('chatClose');
chatToggle.addEventListener('click', function() {
  chatWindow.classList.toggle('open');
  try { playBlip(); } catch(err) {}
});
chatClose.addEventListener('click', function() { chatWindow.classList.remove('open'); });

var chatMessages = document.getElementById('chatMessages');
var chatInput = document.getElementById('chatInput');
var chatSend = document.getElementById('chatSend');
var chatHistory = [];
var CONTEXT = "You are an AI assistant embedded in Dhruba Chowdhury portfolio website. Answer questions about Dhruba professionally and helpfully. Dhruba Chowdhury is a Chemical Engineering student at University of Illinois Chicago UIC, Class of 2028. He works as Lab Assistant at the ODES Lab (Vivek Sharma Lab) at UIC from January 2026 to present, where he works on polymer and soft matter physics, scaling and dimensional analysis, and rheology and mechanics. Lab website: https://viveksharmalab.com/. He also works as Academic Tutor for K-12 students in Chicago from November 2025 to present. Skills: Thermodynamics, Chemical Dynamics, Analytical Chemistry, Mass and Energy Balances, Calculus, Differential Equations, Technical Writing, Lab Safety. Courses: CHE 201, CHE 205, CHE 230, CHEM 222, CHEM 112, CHEM 114, MATH 180, MATH 181, MATH 210, MATH 220, PHYS 141, ENGL 160, ENGL 161. Featured Project: Phase-Change Material Smart Bricks for CHE 201 Spring 2026. Email: dchow6@uic.edu. Phone: 312-868-9101. LinkedIn: linkedin.com/in/dchowdhury007. Seeking internships for Summer 2026. Keep answers concise, friendly, and professional.";

function appendMsg(text, type) {
  var d = document.createElement('div');
  d.className = 'chat-msg ' + type;
  d.textContent = text;
  chatMessages.appendChild(d);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return d;
}
function appendTyping() {
  var d = document.createElement('div');
  d.className = 'chat-typing';
  d.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(d);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return d;
}
function sendMessage() {
  var msg = chatInput.value.trim();
  if (!msg) return;
  chatInput.value = '';
  appendMsg(msg, 'user');
  chatHistory.push({ role: 'user', content: msg });
  var typing = appendTyping();
  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: CONTEXT,
      messages: chatHistory
    })
  }).then(function(res) { return res.json(); })
    .then(function(data) {
      typing.remove();
      var reply = (data.content && data.content[0] && data.content[0].text)
        ? data.content[0].text : 'Sorry, I could not get a response. Please try again.';
      appendMsg(reply, 'bot');
      chatHistory.push({ role: 'assistant', content: reply });
    }).catch(function() {
      typing.remove();
      appendMsg('Connection error. Please try again later.', 'bot');
    });
}
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') sendMessage(); });
