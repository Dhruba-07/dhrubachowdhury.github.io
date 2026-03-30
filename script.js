// ── AUDIO ENGINE ── R&B Bassy Modern ──
var audioCtx = null;
var audioMuted = false;
function getCtx() {
  if (audioMuted) return null;
  if (!audioCtx) {
    var A = window.AudioContext || window.webkitAudioContext;
    if (A) audioCtx = new A();
  }
  return audioCtx;
}

// Shared compressor for all sounds - glues everything together
function makeCompressor(ctx) {
  var comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.knee.value = 8;
  comp.ratio.value = 4;
  comp.attack.value = 0.003;
  comp.release.value = 0.15;
  comp.connect(ctx.destination);
  return comp;
}

// ── INTRO - Deep R&B landing (warm, bassy, soulful) ──
function playPortal() {
  var ctx = getCtx();
  if (!ctx) return;
  var comp = makeCompressor(ctx);

  // Deep 808-style sub bass hit
  var sub = ctx.createOscillator();
  var subGain = ctx.createGain();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(55, ctx.currentTime);
  sub.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 1.2);
  subGain.gain.setValueAtTime(0, ctx.currentTime);
  subGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
  subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);
  sub.connect(subGain); subGain.connect(comp);
  sub.start(ctx.currentTime); sub.stop(ctx.currentTime + 1.7);

  // Mid bass body - warm and round
  var mid = ctx.createOscillator();
  var midGain = ctx.createGain();
  var midFilter = ctx.createBiquadFilter();
  mid.type = 'triangle';
  mid.frequency.setValueAtTime(110, ctx.currentTime);
  mid.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1.0);
  midFilter.type = 'lowpass';
  midFilter.frequency.value = 400;
  midFilter.Q.value = 1;
  midGain.gain.setValueAtTime(0, ctx.currentTime);
  midGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.08);
  midGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
  mid.connect(midFilter); midFilter.connect(midGain); midGain.connect(comp);
  mid.start(ctx.currentTime); mid.stop(ctx.currentTime + 1.5);

  // Warm chord swell - R&B major 7th feel
  var chordFreqs = [130, 164, 196, 246];
  for (var i = 0; i < chordFreqs.length; i++) {
    (function(freq, delay) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      gain.gain.setValueAtTime(0, ctx.currentTime + 0.3 + delay);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5 + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0 + delay);
      osc.connect(filter); filter.connect(gain); gain.connect(comp);
      osc.start(ctx.currentTime + 0.3 + delay);
      osc.stop(ctx.currentTime + 2.1 + delay);
    })(chordFreqs[i], i * 0.06);
  }

  // Soft high note resolve - smooth not bright
  var resolve = ctx.createOscillator();
  var resolveGain = ctx.createGain();
  var resolveFilter = ctx.createBiquadFilter();
  resolve.type = 'sine';
  resolve.frequency.setValueAtTime(392, ctx.currentTime + 1.1);
  resolveFilter.type = 'lowpass';
  resolveFilter.frequency.value = 800;
  resolveGain.gain.setValueAtTime(0, ctx.currentTime + 1.1);
  resolveGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.2);
  resolveGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
  resolve.connect(resolveFilter); resolveFilter.connect(resolveGain); resolveGain.connect(comp);
  resolve.start(ctx.currentTime + 1.1); resolve.stop(ctx.currentTime + 2.6);
}

// ── NAV HOVER - soft warm bass tap ──
function playChord() {
  var ctx = getCtx();
  if (!ctx) return;
  var comp = makeCompressor(ctx);
  var freqs = [130, 164, 196];
  for (var i = 0; i < freqs.length; i++) {
    (function(freq, delay) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 500;
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.35);
      osc.connect(filter); filter.connect(gain); gain.connect(comp);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.4);
    })(freqs[i], i * 0.015);
  }
}

// ── CARD HOVER - deep bass pulse ──
function playDroplet() {
  var ctx = getCtx();
  if (!ctx) return;
  var comp = makeCompressor(ctx);
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  var filter = ctx.createBiquadFilter();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.2);
  filter.type = 'lowpass';
  filter.frequency.value = 300;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
  osc.connect(filter); filter.connect(gain); gain.connect(comp);
  osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.28);
}

// ── CHATBOT OPEN - smooth R&B two-note bass ──
function playRebound() {
  var ctx = getCtx();
  if (!ctx) return;
  var comp = makeCompressor(ctx);
  var notes = [
    { freq: 98,  time: 0    },
    { freq: 130, time: 0.18 }
  ];
  for (var i = 0; i < notes.length; i++) {
    (function(note) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
      osc.frequency.exponentialRampToValueAtTime(note.freq * 0.8, ctx.currentTime + note.time + 0.25);
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      gain.gain.setValueAtTime(0, ctx.currentTime + note.time);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + note.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + 0.3);
      osc.connect(filter); filter.connect(gain); gain.connect(comp);
      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + 0.35);
    })(notes[i]);
  }
}

// ── FORM SUCCESS - warm R&B resolution chord ──
function playCircles() {
  var ctx = getCtx();
  if (!ctx) return;
  var comp = makeCompressor(ctx);
  var chord = [98, 123, 146, 196];
  for (var i = 0; i < chord.length; i++) {
    (function(freq, delay) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.8);
      osc.connect(filter); filter.connect(gain); gain.connect(comp);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.9);
    })(chord[i], i * 0.12);
  }
}

// ── SECTION SCROLL - deep bass tick ──
function playSectionTick() {
  var ctx = getCtx();
  if (!ctx) return;
  var comp = makeCompressor(ctx);
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  var filter = ctx.createBiquadFilter();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
  filter.type = 'lowpass';
  filter.frequency.value = 350;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(filter); filter.connect(gain); gain.connect(comp);
  osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.12);
}

// ── BOOT ON LOAD ──
window.addEventListener('load', function() {
  setTimeout(function() {
    try { playPortal(); } catch(e) {}
  }, 600);
});

// ── AUDIO TOGGLE ──
var audioToggleBtn = document.getElementById('audioToggle');
if (audioToggleBtn) {
  audioToggleBtn.addEventListener('click', function() {
    audioMuted = !audioMuted;
    if (audioMuted) {
      audioToggleBtn.textContent = '\uD83D\uDD07';
      audioToggleBtn.setAttribute('aria-label', 'Unmute audio');
      audioToggleBtn.classList.add('muted');
    } else {
      audioToggleBtn.textContent = '\uD83D\uDD0A';
      audioToggleBtn.setAttribute('aria-label', 'Mute audio');
      audioToggleBtn.classList.remove('muted');
    }
  });
}

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
var CONTEXT = "You are an AI assistant embedded in Dhruba Chowdhury's portfolio website. Answer questions about Dhruba professionally and helpfully. Dhruba Chowdhury is a Chemical Engineering student at University of Illinois Chicago (UIC), Class of 2028. Current GPA: 3.4. He works as Lab Assistant at the ODES Lab (Vivek Sharma Lab) at UIC from January 2026 to present, where he works on polymer and soft matter physics, scaling and dimensional analysis, and rheology and mechanics. Lab website: https://viveksharmalab.com/. He also works as Academic Tutor for K-12 students in Chicago from November 2025 to present. Professors: Prof. Vivek Sharma (ODES Lab, viveksharmalab.com), Prof. Betul Bilgin (CHE, UIC), Prof. Roshan Nemade (CHE, UIC). Skills: Thermodynamics, Chemical Dynamics, Analytical Chemistry, Mass and Energy Balances, Calculus, Differential Equations, Technical Writing, Lab Safety. Courses: CHE 201, CHE 205, CHE 230, CHEM 222, CHEM 112, CHEM 114, MATH 180, MATH 181, MATH 210, MATH 220, PHYS 141, ENGL 160, ENGL 161. Featured Project: Phase-Change Material Smart Bricks for CHE 201 Spring 2026. Hobbies and interests: Singing, playing guitar, socializing, writing, reading books, fishing, working out, swimming, playing badminton (pro level), exploring new skills outside his field. Career goals: Research-focused career; open to industries such as healthcare, pharmaceuticals, sustainability, oil and gas, energy, and environmental engineering. Email: dchow6@uic.edu. Phone: 312-868-9101. LinkedIn: linkedin.com/in/dchowdhury007. Resume: available on LinkedIn or by emailing dchow6@uic.edu. Seeking internships for Summer 2026. Keep answers concise, friendly, and professional.";

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

// ── KEYWORD CHATBOT ──
function getBotReply(msg) {
  var m = msg.toLowerCase();
  if (m.match(/hi|hello|hey|sup|greet/)) return "Hey! Great to meet you. I am Dhruba's assistant. Ask me about his skills, projects, experience, professors, hobbies, or how to contact him!";
  if (m.match(/who|dhruba|about|yourself/)) return "Dhruba Chowdhury is a Chemical Engineering student at UIC (Class of 2028) with a 3.4 GPA. He works as a Lab Assistant at the ODES Lab and as a K-12 tutor in Chicago. He is passionate about sustainable design, research, and thermodynamics.";
  if (m.match(/gpa|grade|academic|score|marks/)) return "Dhruba currently holds a 3.4 GPA at UIC, studying Chemical Engineering. He is committed to academic excellence while balancing research and tutoring roles!";
  if (m.match(/lab|odes|research|polymer|rheology|soft matter|vivek|sharma/)) return "Dhruba works at the ODES Lab under Prof. Vivek Sharma at UIC. His research focuses on polymer and soft matter physics, scaling and dimensional analysis, and rheology and mechanics. Visit viveksharmalab.com to learn more!";
  if (m.match(/professor|prof|faculty|bilgin|betul|nemade|roshan|instructor|teacher/)) return "Dhruba's professors at UIC include Prof. Vivek Sharma (ODES Lab — polymer and soft matter physics), Prof. Betul Bilgin (CHE), and Prof. Roshan Nemade (CHE). Great mentors shaping his engineering journey!";
  if (m.match(/project|pcm|brick|phase|thermal|sustainable/)) return "His featured project is Phase-Change Material Smart Bricks for CHE 201 (Spring 2026). PCM-embedded bricks passively regulate indoor temperature with zero electricity — showing 30% energy reduction and a 9.5 degree temperature drop vs conventional bricks!";
  if (m.match(/skill|know|can|good at|expertise/)) return "Dhruba is skilled in Thermodynamics, Mass and Energy Balances, Analytical Chemistry, Computational Methods, Rheology, Mathematical Modeling, and Technical Writing. Check the Skills section for the full list!";
  if (m.match(/course|class|study|major|che|chem|math/)) return "Dhruba has taken CHE 201, CHE 205, CHE 230, CHEM 222, CHEM 232, MATH 180-220, PHYS 141, and ENGL 160-161. Hover over the course chips in the Skills section to see full names!";
  if (m.match(/intern|job|hire|opportunit|work|recruit|position/)) return "Dhruba is actively seeking internships in chemical engineering, research, or process design for Summer 2026. Reach out at dchow6@uic.edu or connect on LinkedIn!";
  if (m.match(/contact|email|phone|reach|linkedin|connect/)) return "You can reach Dhruba at dchow6@uic.edu, call (312) 868-9101, or connect on LinkedIn at linkedin.com/in/dchowdhury007. Use the contact form on the site too!";
  if (m.match(/resume|cv|curriculum/)) return "Dhruba's resume is available via LinkedIn (linkedin.com/in/dchowdhury007) or you can request a copy directly at dchow6@uic.edu. He is happy to share it with potential employers or collaborators!";
  if (m.match(/tutor|teach|education|student|k-12|school/)) return "Dhruba works as a K-12 Academic Tutor in Chicago since November 2025, providing one-on-one and small group support across multiple subjects. He loves helping students build confidence!";
  if (m.match(/uic|illinois|chicago|university/)) return "Dhruba attends the University of Illinois Chicago (UIC), studying Chemical Engineering with a 3.4 GPA and expected graduation in April 2028.";
  if (m.match(/graduation|graduate|year|class|2028/)) return "Dhruba is expected to graduate in April 2028 with a B.S. in Chemical Engineering from UIC.";
  if (m.match(/hobby|hobbies|interest|fun|free time|personal|outside|guitar|sing|badminton|swim|fish|workout|read|writ/)) return "Outside of engineering, Dhruba loves singing, playing guitar, socializing, writing, reading books, fishing, working out, swimming, and playing badminton at a pro level! He also enjoys exploring new skills outside his field. Quite the Renaissance engineer!";
  if (m.match(/career|goal|future|aspir|dream|plan|industry|health|pharma|oil|energy|environment|sustainab/)) return "Dhruba aspires to a research-focused career and is open to industries including healthcare, pharmaceuticals, sustainability, oil and gas, energy, and environmental engineering. He wants to drive meaningful innovation through science!";
  if (m.match(/sound|music|audio|noise/)) return "The site uses custom Web Audio API sounds inspired by iPhone tones. Portal intro, chord on nav hover, droplet on cards, rebound on chat open, and circles when you submit the contact form!";
  if (m.match(/thank|thanks|cool|great|awesome|nice/)) return "Thank you! Feel free to ask anything else about Dhruba. You can also reach him directly at dchow6@uic.edu!";
  if (m.match(/bye|goodbye|see you|later/)) return "Goodbye! Feel free to come back anytime. You can also reach Dhruba at dchow6@uic.edu!";
  return "Great question! I am not sure about that specific topic. Try asking about Dhruba's skills, projects, professors, hobbies, career goals, or how to contact him. Or reach out directly at dchow6@uic.edu!";
}

function sendMessage() {
  var msg = chatInput.value.trim();
  if (!msg) return;
  chatInput.value = '';
  appendMsg(msg, 'user');
  chatHistory.push({ role: 'user', content: msg });
  var typing = appendTyping();
  setTimeout(function() {
    typing.remove();
    var reply = getBotReply(msg);
    appendMsg(reply, 'bot');
    chatHistory.push({ role: 'assistant', content: reply });
  }, 600);
}
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') sendMessage(); });
