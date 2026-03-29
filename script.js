// ── AUDIO ENGINE ──
var audioCtx = null;
function getCtx() {
  if (!audioCtx) {
    var A = window.AudioContext || window.webkitAudioContext;
    if (A) audioCtx = new A();
  }
  return audioCtx;
}

// ── TICK FACTORY ── creates a single modern tick sound with variety
function playTick(style) {
  var ctx = getCtx();
  if (!ctx) return;
  style = style || 'default';

  if (style === 'soft') {
    // Soft muted tick - nav hover
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var filter = ctx.createBiquadFilter();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.04);
    filter.type = 'highpass';
    filter.frequency.value = 800;
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.06);

  } else if (style === 'click') {
    // Sharp digital click - card hover
    var buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.03), ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 4) * 0.3;
    }
    var src = ctx.createBufferSource();
    var filter = ctx.createBiquadFilter();
    var gain = ctx.createGain();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 1;
    gain.gain.value = 0.6;
    src.buffer = buf;
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.start(ctx.currentTime);

  } else if (style === 'open') {
    // THE ONE - chatbot open sound (2 beat modern tick)
    var times = [0, 0.12];
    var freqs = [1200, 1600];
    for (var i = 0; i < 2; i++) {
      (function(freq, t) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var filter = ctx.createBiquadFilter();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.85, ctx.currentTime + t + 0.08);
        filter.type = 'bandpass';
        filter.frequency.value = freq;
        filter.Q.value = 3;
        gain.gain.setValueAtTime(0, ctx.currentTime + t);
        gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.1);
        osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.12);
      })(freqs[i], times[i]);
    }

  } else if (style === 'section') {
    // Section change - single crisp tick with short tail
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var filter = ctx.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.06);
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 4;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.09);

  } else if (style === 'form') {
    // Form sent - 3 ascending ticks
    var ftimes = [0, 0.1, 0.2];
    var ffreqs = [1000, 1400, 1800];
    for (var i = 0; i < 3; i++) {
      (function(freq, t) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var filter = ctx.createBiquadFilter();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + t);
        filter.type = 'bandpass';
        filter.frequency.value = freq;
        filter.Q.value = 5;
        gain.gain.setValueAtTime(0, ctx.currentTime + t);
        gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.1);
        osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.12);
      })(ffreqs[i], ftimes[i]);
    }

  } else {
    // default - subtle tap
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.05);
  }
}

// ── BOOT SEQUENCE - "Welcome to another world" ──
function playBoot() {
  var ctx = getCtx();
  if (!ctx) return;

  // Layer 1: Deep space rumble
  var buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  var data = buf.getChannelData(0);
  for (var i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(i / data.length, 1.5) * (1 - i / data.length) * 0.2;
  }
  var rumble = ctx.createBufferSource();
  var rumbleFilter = ctx.createBiquadFilter();
  var rumbleGain = ctx.createGain();
  rumbleFilter.type = 'lowpass';
  rumbleFilter.frequency.setValueAtTime(60, ctx.currentTime);
  rumbleFilter.frequency.linearRampToValueAtTime(180, ctx.currentTime + 2);
  rumbleGain.gain.setValueAtTime(0, ctx.currentTime);
  rumbleGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.4);
  rumbleGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8);
  rumble.buffer = buf;
  rumble.connect(rumbleFilter);
  rumbleFilter.connect(rumbleGain);
  rumbleGain.connect(ctx.destination);
  rumble.start(ctx.currentTime);

  // Layer 2: Portal opening - rising sine wave
  var portal = ctx.createOscillator();
  var portalGain = ctx.createGain();
  var portalFilter = ctx.createBiquadFilter();
  portal.type = 'sine';
  portal.frequency.setValueAtTime(55, ctx.currentTime + 0.2);
  portal.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.4);
  portalFilter.type = 'lowpass';
  portalFilter.frequency.setValueAtTime(300, ctx.currentTime + 0.2);
  portalFilter.frequency.linearRampToValueAtTime(2000, ctx.currentTime + 1.4);
  portalGain.gain.setValueAtTime(0, ctx.currentTime + 0.2);
  portalGain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.5);
  portalGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
  portal.connect(portalFilter); portalFilter.connect(portalGain); portalGain.connect(ctx.destination);
  portal.start(ctx.currentTime + 0.2); portal.stop(ctx.currentTime + 1.5);

  // Layer 3: Cascading tick sequence - system initializing
  var tickSeq = [0.5, 0.65, 0.75, 0.82, 0.87, 0.91, 0.94, 0.96, 0.98, 1.0];
  var tickFreqs = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1800];
  for (var t = 0; t < tickSeq.length; t++) {
    (function(time, freq) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.value = freq;
      filter.type = 'bandpass';
      filter.frequency.value = freq;
      filter.Q.value = 6;
      gain.gain.setValueAtTime(0.06, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 0.07);
      osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + 0.08);
    })(tickSeq[t], tickFreqs[t]);
  }

  // Layer 4: "Welcome" moment - two tone arrival
  var w1 = ctx.createOscillator();
  var w1g = ctx.createGain();
  w1.type = 'sine';
  w1.frequency.setValueAtTime(880, ctx.currentTime + 1.15);
  w1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 1.25);
  w1g.gain.setValueAtTime(0, ctx.currentTime + 1.15);
  w1g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 1.2);
  w1g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);
  w1.connect(w1g); w1g.connect(ctx.destination);
  w1.start(ctx.currentTime + 1.15); w1.stop(ctx.currentTime + 1.65);

  var w2 = ctx.createOscillator();
  var w2g = ctx.createGain();
  w2.type = 'sine';
  w2.frequency.setValueAtTime(1320, ctx.currentTime + 1.35);
  w2g.gain.setValueAtTime(0, ctx.currentTime + 1.35);
  w2g.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.4);
  w2g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);
  w2.connect(w2g); w2g.connect(ctx.destination);
  w2.start(ctx.currentTime + 1.35); w2.stop(ctx.currentTime + 2.3);

  // Layer 5: ambient shimmer tail
  var shimFreqs = [2093, 2637, 3136];
  for (var s = 0; s < shimFreqs.length; s++) {
    (function(freq, delay) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + 1.5 + delay);
      gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 1.55 + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8 + delay);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + 1.5 + delay);
      osc.stop(ctx.currentTime + 2.9 + delay);
    })(shimFreqs[s], s * 0.08);
  }
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
    try { playTick('click'); } catch(e) {}
  });
  el.addEventListener('mouseleave', function() {
    cur.style.width = '14px'; cur.style.height = '14px';
    cur.style.background = 'var(--accent)';
  });
});

// NAV - soft tick on hover
document.querySelectorAll('.nav-links a').forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    try { playTick('soft'); } catch(e) {}
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
      try { playTick('section'); } catch(err) {}
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
      try { playTick('form'); } catch(err) {}
    } else { btn.textContent = 'Error - Try Again'; }
  }).catch(function() { btn.textContent = 'Error - Try Again'; });
});

// ── CHATBOT ──
var chatToggle = document.getElementById('chatToggle');
var chatWindow = document.getElementById('chatWindow');
var chatClose = document.getElementById('chatClose');
chatToggle.addEventListener('click', function() {
  chatWindow.classList.toggle('open');
  try { playTick('open'); } catch(err) {}
});
chatClose.addEventListener('click', function() {
  chatWindow.classList.remove('open');
  try { playTick('soft'); } catch(err) {}
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
