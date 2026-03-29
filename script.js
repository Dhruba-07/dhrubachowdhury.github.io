// CURSOR
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

// WELCOME SOUND
window.addEventListener('load', function() {
  setTimeout(function() {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      var actx = new AudioCtx();
      var notes = [523, 659, 784, 1047, 784, 1047, 1319];
      var times = [0, 0.12, 0.24, 0.38, 0.5, 0.62, 0.76];
      for (var i = 0; i < notes.length; i++) {
        (function(freq, t, idx) {
          var osc = actx.createOscillator();
          var gain = actx.createGain();
          osc.connect(gain); gain.connect(actx.destination);
          osc.type = idx === 6 ? 'sine' : 'square';
          osc.frequency.setValueAtTime(freq, actx.currentTime + t);
          gain.gain.setValueAtTime(0, actx.currentTime + t);
          gain.gain.linearRampToValueAtTime(0.04, actx.currentTime + t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + t + 0.15);
          osc.start(actx.currentTime + t);
          osc.stop(actx.currentTime + t + 0.2);
        })(notes[i], times[i], i);
      }
      var chord = [523, 659, 784];
      for (var j = 0; j < chord.length; j++) {
        (function(freq) {
          var osc = actx.createOscillator();
          var gain = actx.createGain();
          osc.connect(gain); gain.connect(actx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, actx.currentTime + 1.0);
          gain.gain.setValueAtTime(0, actx.currentTime + 1.0);
          gain.gain.linearRampToValueAtTime(0.05, actx.currentTime + 1.05);
          gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 2.0);
          osc.start(actx.currentTime + 1.0);
          osc.stop(actx.currentTime + 2.1);
        })(chord[j]);
      }
    } catch(e) {}
  }, 800);
});

// PARTICLES
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

// SCROLL REVEAL
var obs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.05 });
document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
setTimeout(function() {
  document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('visible'); });
}, 2000);

// COUNT UP
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

// CONTACT FORM
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
    } else { btn.textContent = 'Error - Try Again'; }
  }).catch(function() { btn.textContent = 'Error - Try Again'; });
});

// CHATBOT
var chatToggle = document.getElementById('chatToggle');
var chatWindow = document.getElementById('chatWindow');
var chatClose = document.getElementById('chatClose');
chatToggle.addEventListener('click', function() { chatWindow.classList.toggle('open'); });
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