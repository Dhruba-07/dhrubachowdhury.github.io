// ── AUDIO ENGINE ──
var audioCtx = null;
function getCtx() {
  if (!audioCtx) {
    var A = window.AudioContext || window.webkitAudioContext;
    if (A) audioCtx = new A();
  }
  return audioCtx;
}

// ── PORTAL - intro landing sound (deep cinematic portal open) ──
function playPortal() {
  var ctx = getCtx();
  if (!ctx) return;

  // Sub bass pulse
  var sub = ctx.createOscillator();
  var subGain = ctx.createGain();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(55, ctx.currentTime);
  sub.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 1.5);
  subGain.gain.setValueAtTime(0, ctx.currentTime);
  subGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.3);
  subGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8);
  sub.connect(subGain); subGain.connect(ctx.destination);
  sub.start(ctx.currentTime); sub.stop(ctx.currentTime + 1.9);

  // Portal shimmer - rising harmonic sweep
  var shimFreqs = [220, 330, 440, 550, 660];
  for (var i = 0; i < shimFreqs.length; i++) {
    (function(freq, delay) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.5, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + delay + 0.8);
      filter.type = 'bandpass';
      filter.frequency.value = freq;
      filter.Q.value = 4;
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + delay + 0.1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + 1.0);
      osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 1.1);
    })(shimFreqs[i], i * 0.12);
  }

  // Cascading ticks - system boot
  var tickTimes = [0.7, 0.82, 0.9, 0.96, 1.01, 1.05, 1.08, 1.10];
  var tickFreqs = [900, 1000, 1100, 1200, 1400, 1600, 1800, 2000];
  for (var t = 0; t < tickTimes.length; t++) {
    (function(time, freq) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 0.06);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + 0.07);
    })(tickTimes[t], tickFreqs[t]);
  }

  // Final arrival tone - warm
  var arr = ctx.createOscillator();
  var arrGain = ctx.createGain();
  arr.type = 'sine';
  arr.frequency.setValueAtTime(1320, ctx.currentTime + 1.15);
  arrGain.gain.setValueAtTime(0, ctx.currentTime + 1.15);
  arrGain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 1.2);
  arrGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.4);
  arr.connect(arrGain); arrGain.connect(ctx.destination);
  arr.start(ctx.currentTime + 1.15); arr.stop(ctx.currentTime + 2.5);
}

// ── CHORD - iPhone chord tone (nav hover) ──
function playChord() {
  var ctx = getCtx();
  if (!ctx) return;
  // Major chord: root, major third, fifth
  var freqs = [523.25, 659.25, 783.99];
  for (var i = 0; i < freqs.length; i++) {
    (function(freq, delay) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.5);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.6);
    })(freqs[i], i * 0.02);
  }
}

// ── DROPLET - iPhone droplet (card hover) ──
function playDroplet() {
  var ctx = getCtx();
  if (!ctx) return;
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.18);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.22);
}

// ── REBOUND - iPhone rebound (chatbot open) ──
function playRebound() {
  var ctx = getCtx();
  if (!ctx) return;
  // Two bounces
  var bounces = [
    { start: 0,    freq1: 800,  freq2: 1200 },
    { start: 0.14, freq1: 1000, freq2: 1400 }
  ];
  for (var b = 0; b < bounces.length; b++) {
    (function(bounce) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(bounce.freq1, ctx.currentTime + bounce.start);
      osc.frequency.exponentialRampToValueAtTime(bounce.freq2, ctx.currentTime + bounce.start + 0.06);
      osc.frequency.exponentialRampToValueAtTime(bounce.freq1 * 0.9, ctx.currentTime + bounce.start + 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime + bounce.start);
      gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + bounce.start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + bounce.start + 0.13);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + bounce.start);
      osc.stop(ctx.currentTime + bounce.start + 0.15);
    })(bounces[b]);
  }
}

// ── CIRCLES - iPhone circles (form submit success) ──
function playCircles() {
  var ctx = getCtx();
  if (!ctx) return;
  // Expanding circle tones - 4 rings rippling out
  var rings = [
    { time: 0,    freq: 880,  dur: 0.6 },
    { time: 0.15, freq: 1108, dur: 0.55 },
    { time: 0.28, freq: 1318, dur: 0.5 },
    { time: 0.38, freq: 1760, dur: 0.45 }
  ];
  for (var r = 0; r < rings.length; r++) {
    (function(ring) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = ring.freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + ring.time);
      gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + ring.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ring.time + ring.dur);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + ring.time);
      osc.stop(ctx.currentTime + ring.time + ring.dur + 0.05);
    })(rings[r]);
  }
}

// ── SECTION TICK - crisp single tick on scroll ──
function playSectionTick() {
  var ctx = getCtx();
  if (!ctx) return;
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  var filter = ctx.createBiquadFilter();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(2400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 3;
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
  osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.08);
}

// ── BOOT ON LOAD ──
window.addEventListener('load', function() {
  setTimeout(function() {
    try { playPortal(); } catch(e) {}
  }, 600);
});

// ── CURSOR ──
var cur = document.getElementById('cursor');
document.addEventListener('mousemove', function(e) {
  cur.style.left = e.clientX + 'px';
  cur.style.top = e.clientY + 'px';
});

// Card/button hover - droplet
document.querySelectorAll('.pc, .sgr, .sc, .ec, .orbit-btn').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    cur.style.width = '22px'; cur.style.height = '22px';
    cur.style.background = 'var(--accent2)';
    try { playDroplet(); } catch(e) {}
  });
  el.addEventListener('mouseleave', function() {
    cur.style.width = '14px'; cur.style.height = '14px';
    cur.style.background = 'var(--accent)';
  });
});

// Other interactive elements - no sound, just cursor
document.querySelectorAll('a, button, .course-chip').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    cur.style.width = '22px'; cur.style.height = '22px';
    cur.style.background = 'var(--accent2)';
  });
  el.addEventListener('mouseleave', function() {
    cur.style.width = '14px'; cur.style.height = '14px';
    cur.style.background = 'var(--accent)';
  });
});

// Nav hover - chord
document.querySelectorAll('.nav-links a').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    try { playChord(); } catch(e) {}
  });
});

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

// ── SCROLL REVEAL + SECTION TICK ──
var lastSection = '';
var obs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.05 });
document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
setTimeout(function() {
  document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('visible'); });
}, 2000);

var sectionObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting && e.target.id && e.target.id !== lastSection) {
      lastSection = e.target.id;
      try { playSectionTick(); } catch(err) {}
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.section-page').forEach(function(el) { sectionObserver.observe(el); });

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
      try { playCircles(); } catch(err) {}
    } else { btn.textContent = 'Error - Try Again'; }
  }).catch(function() { btn.textContent = 'Error - Try Again'; });
});

// ── CHATBOT ──
var chatToggle = document.getElementById('chatToggle');
var chatWindow = document.getElementById('chatWindow');
var chatClose = document.getElementById('chatClose');
chatToggle.addEventListener('click', function() {
  chatWindow.classList.toggle('open');
  try { playRebound(); } catch(err) {}
});
chatClose.addEventListener('click', function() {
  chatWindow.classList.remove('open');
  try { playDroplet(); } catch(err) {}
});

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
  fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: chatHistory, system: CONTEXT })
  }).then(function(res) { return res.json(); })
    .then(function(data) {
      typing.remove();
      var reply = data.reply || 'Sorry, I could not get a response. Please try again.';
      appendMsg(reply, 'bot');
      chatHistory.push({ role: 'assistant', content: reply });
    }).catch(function() {
      typing.remove();
      appendMsg('Connection error. Please try again later.', 'bot');
    });
}
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') sendMessage(); });
