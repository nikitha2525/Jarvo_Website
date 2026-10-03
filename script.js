/* ═══════════════════════════════════════════════════════
   JARVO — Intelligent Hospitality Operating System
   Interactive Script: Intro, Hero Scratch Reveal, 3D Cards, Robot
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ═══════════════════ 1. HIGH-FIDELITY 16:9 VIDEO INTRO ═══════════════════ */
  const gifOverlay = document.getElementById('gif-intro');
  const introVideo = document.getElementById('intro-video');
  const timelineFill = document.getElementById('timeline-fill');
  const soundIcon = document.getElementById('sound-icon');
  const nav = document.getElementById('main-nav');
  let introDismissed = false;

  function initIntroVideo() {
    if (!introVideo) return;

    // Reset and start from frame 0 entirely
    try {
      introVideo.currentTime = 0;
    } catch (e) {}

    // Ensure immediate autoplay
    introVideo.muted = true;
    const playPromise = introVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Autoplay handled by policy:', err);
        introVideo.muted = true;
        introVideo.play().catch(e => console.warn('Play error:', e));
      });
    }

    // Live timeline synced precisely with video playback
    introVideo.addEventListener('timeupdate', () => {
      if (!timelineFill || !introVideo.duration) return;
      const progress = Math.min((introVideo.currentTime / introVideo.duration) * 100, 100);
      timelineFill.style.width = progress + '%';
    });

    // When the animation completes entirely, smoothly reveal website
    introVideo.addEventListener('ended', () => {
      if (!introDismissed) {
        window.dismissIntro();
      }
    });

    // Safety fallback: if video stalls or encounters error, auto reveal after 10s
    setTimeout(() => {
      if (!introDismissed && introVideo.paused && introVideo.currentTime === 0) {
        window.dismissIntro();
      }
    }, 10000);
  }

  window.toggleIntroSound = function () {
    if (!introVideo) return;
    introVideo.muted = !introVideo.muted;
    if (soundIcon) {
      soundIcon.textContent = introVideo.muted ? '🔇' : '🔊';
    }
  };

  window.replayIntro = function () {
    introDismissed = false;
    if (gifOverlay) {
      gifOverlay.style.display = 'flex';
      gifOverlay.classList.remove('fade-out');
    }
    if (timelineFill) {
      timelineFill.style.width = '0%';
    }
    if (introVideo) {
      introVideo.currentTime = 0;
      introVideo.play().catch(e => console.warn('Replay play error:', e));
    }
  };

  window.dismissIntro = function () {
    if (introDismissed) return;
    introDismissed = true;
    if (introVideo) {
      try { introVideo.pause(); } catch (e) {}
    }
    if (timelineFill) timelineFill.style.width = '100%';
    if (gifOverlay) gifOverlay.classList.add('fade-out');
    setTimeout(() => {
      if (gifOverlay) gifOverlay.style.display = 'none';
      if (nav) nav.classList.remove('nav-hidden');
      triggerRobotEntrance();
      if (typeof resizeCanvas === 'function') resizeCanvas();
    }, 900);
  };

  // Keyboard shortcut: Escape or Space to skip intro
  window.addEventListener('keydown', (e) => {
    if (!introDismissed && (e.key === 'Escape' || e.code === 'Space')) {
      e.preventDefault();
      window.dismissIntro();
    }
  });

  // Launch on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntroVideo);
  } else {
    initIntroVideo();
  }

  /* ═══════════════════ 2. CORNER ROBOT BUDDY ═══════════════════ */
  const robotBuddy = document.getElementById('robot-buddy');
  const robotSpeech = document.getElementById('robot-speech');

  const greetings = [
    "Hello Chef! 👋",
    "Waste down 30%! 📉",
    "All stocks synced! ✨",
    "Need a live demo? 🚀",
    "Kitchen is running fast! ⚡"
  ];
  let greetingIndex = 0;

  function triggerRobotEntrance() {
    setTimeout(() => {
      robotBuddy.classList.remove('robot-hidden');
      robotBuddy.classList.add('robot-visible');
      robotNod();
    }, 800);
  }

  window.robotNod = function () {
    robotBuddy.classList.remove('shaking');
    void robotBuddy.offsetWidth; // trigger reflow
    robotBuddy.classList.add('shaking');
    greetingIndex = (greetingIndex + 1) % greetings.length;
    robotSpeech.textContent = greetings[greetingIndex];
    setTimeout(() => {
      robotBuddy.classList.remove('shaking');
    }, 900);
  };

  // Periodic gentle robot shake
  setInterval(() => {
    if (!robotBuddy.classList.contains('robot-hidden')) {
      robotNod();
    }
  }, 12000);

  /* ═══════════════════ 3. PAGE SWITCHING (HOME & ABOUT US) ═══════════════════ */
  window.showPage = function (page) {
    const home = document.getElementById('page-home');
    const about = document.getElementById('page-about');
    
    if (page === 'about') {
      home.style.display = 'none';
      about.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      about.style.display = 'none';
      home.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      resizeCanvas();
    }
  };

  window.scrollToSection = function (id) {
    const el = document.getElementById(id);
    if (el) {
      if (document.getElementById('page-home').style.display === 'none') {
        window.showPage('home');
      }
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  /* ═══════════════════ 4. BOOK A FREE DEMO MODAL ═══════════════════ */
  const demoModal = document.getElementById('demo-modal');
  const demoForm = document.getElementById('demo-form');
  const demoSuccess = document.getElementById('demo-success');

  window.openDemoModal = function () {
    demoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeDemoModal = function () {
    demoModal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      demoForm.style.display = '';
      demoSuccess.style.display = 'none';
      demoForm.reset();
    }, 300);
  };

  demoModal.addEventListener('click', function (e) {
    if (e.target === demoModal) window.closeDemoModal();
  });

  window.submitDemo = function (e) {
    e.preventDefault();
    demoForm.style.display = 'none';
    demoSuccess.style.display = 'block';
  };

  /* ═══════════════════ 5. 3D FLIP CARDS INTERACTION (TOUCH & CLICK) ═══════════════════ */
  const flipCards = document.querySelectorAll('.feature-flip-card');
  flipCards.forEach(card => {
    // Click or keydown to flip
    card.addEventListener('click', (e) => {
      // Don't flip if user clicked the "Book Demo" button inside
      if (e.target.closest('.btn-card-demo')) return;
      card.classList.toggle('flipped');
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });

  /* ═══════════════════════════════════════════════════════
     6. REAL-TIME CURSOR-CONTROLLED GRUNGE/DRY-BRUSH SCRATCH REVEAL
     IMAGE 1 (jarvo_storefront.jpg) is default top image on canvas
     IMAGE 2 (robot_meadow.jpg) is hidden bottom image underneath
     ═══════════════════════════════════════════════════════ */
  const hero = document.getElementById('hero');
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');

  const imgTop = new Image();    // IMAGE 1 (storefront)
  const imgBottom = new Image(); // IMAGE 2 (robot meadow)
  imgTop.src = 'jarvo_storefront.jpg';
  imgBottom.src = 'robot_meadow.jpg';

  let W = 0, H = 0;
  let dpr = 1;
  let stamps = [];
  const STAMP_LIFETIME = 2.7; // seconds

  function resizeCanvas() {
    if (!hero) return;
    W = hero.clientWidth || window.innerWidth;
    H = hero.clientHeight || window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  /* Helper to draw image matching CSS object-fit: cover and object-position: center */
  function drawCoverImage(context, image, targetWidth, targetHeight) {
    if (!image.naturalWidth || !image.naturalHeight) return;
    const imgRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = targetWidth / targetHeight;
    let sW, sH, sX, sY;

    if (canvasRatio > imgRatio) {
      sW = image.naturalWidth;
      sH = image.naturalWidth / canvasRatio;
      sX = 0;
      sY = (image.naturalHeight - sH) / 2;
    } else {
      sH = image.naturalHeight;
      sW = image.naturalHeight * canvasRatio;
      sX = (image.naturalWidth - sW) / 2;
      sY = 0;
    }

    context.drawImage(image, sX, sY, sW, sH, 0, 0, targetWidth, targetHeight);
  }

  /* Smooth cursor follower with k = 1 - Math.pow(1 - 0.17, dt * 60) */
  let tx = -9999, ty = -9999; // target
  let sx = -9999, sy = -9999; // follower
  let lastStampX = -9999, lastStampY = -9999;
  let isInsideHero = false;
  let hasFirstInteracted = false;

  function setCursorPosition(clientX, clientY, isFirst) {
    const rect = hero.getBoundingClientRect();
    tx = clientX - rect.left;
    ty = clientY - rect.top;

    if (isFirst || !hasFirstInteracted) {
      sx = tx;
      sy = ty;
      lastStampX = tx;
      lastStampY = ty;
      hasFirstInteracted = true;
    }
  }

  hero.addEventListener('mouseenter', (e) => {
    isInsideHero = true;
    setCursorPosition(e.clientX, e.clientY, true);
  });

  hero.addEventListener('mousemove', (e) => {
    isInsideHero = true;
    setCursorPosition(e.clientX, e.clientY, false);
  });

  hero.addEventListener('mouseleave', () => {
    isInsideHero = false;
  });

  // Touch Support
  hero.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    isInsideHero = true;
    setCursorPosition(touch.clientX, touch.clientY, true);
  }, { passive: true });

  hero.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    isInsideHero = true;
    setCursorPosition(touch.clientX, touch.clientY, false);
  }, { passive: true });

  hero.addEventListener('touchend', () => {
    isInsideHero = false;
  });

  /* Procedural irregular dry-brush stamp using Catmull-Rom bezier interpolation */
  function drawProceduralBrush(cx, cy, baseRadius, angle, stretch, seed) {
    const samples = 48;
    const points = [];

    for (let i = 0; i < samples; i++) {
      const a = (i / samples) * Math.PI * 2;
      // Multi-frequency noise modulation for rough, torn, organic boundary
      const radiusMod = 1 + 
        0.085 * Math.sin(3 * a + seed) + 
        0.048 * Math.sin(5 * a - seed * 1.15 + seed * 2.1) + 
        0.022 * Math.sin(9 * a + seed * 0.6 + seed * 3.7) +
        0.038 * Math.sin(7 * a - seed * 1.4) +
        0.016 * Math.sin(13 * a + seed * 4.2);

      let r = baseRadius * radiusMod;

      // Natural directional stretch along motion path
      const stretchX = 1 + stretch * 0.28 * Math.cos(a - angle);
      const stretchY = 1 + stretch * 0.14 * Math.sin(a - angle);

      const px = cx + r * Math.cos(a) * stretchX;
      const py = cy + r * Math.sin(a) * stretchY;
      points.push({ x: px, y: py });
    }

    // Catmull-Rom to Cubic Bezier conversion for organic continuous stroke
    ctx.beginPath();
    for (let i = 0; i < samples; i++) {
      const p0 = points[(i - 1 + samples) % samples];
      const p1 = points[i];
      const p2 = points[(i + 1) % samples];
      const p3 = points[(i + 2) % samples];

      if (i === 0) {
        ctx.moveTo(p1.x, p1.y);
      }

      const tension = 0.5;
      const cp1x = p1.x + (tension * (p2.x - p0.x)) / 3;
      const cp1y = p1.y + (tension * (p2.y - p0.y)) / 3;
      const cp2x = p2.x - (tension * (p3.x - p1.x)) / 3;
      const cp2y = p2.y - (tension * (p3.y - p1.y)) / 3;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    ctx.closePath();
    ctx.fill();

    // Subtle dry-brush internal gaps / holes
    const holeCount = 3;
    for (let h = 0; h < holeCount; h++) {
      const hDist = baseRadius * (0.2 + 0.35 * Math.sin(seed * 3.1 + h * 2.4));
      const hAngle = a_rand(seed * 7.7 + h) * Math.PI * 2;
      const hx = cx + Math.cos(hAngle) * hDist;
      const hy = cy + Math.sin(hAngle) * hDist;
      const hw = baseRadius * 0.08;
      const hh = baseRadius * 0.04;
      ctx.beginPath();
      ctx.ellipse(hx, hy, hw, hh, hAngle, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function a_rand(s) {
    const x = Math.sin(s) * 43758.5453;
    return x - Math.floor(x);
  }

  /* ═══════════════════ MAIN ANIMATION LOOP ═══════════════════ */
  let lastTimestamp = 0;
  let topLoaded = false;

  imgTop.onload = () => { topLoaded = true; resizeCanvas(); };
  if (imgTop.complete) { topLoaded = true; }

  function render(timestamp) {
    requestAnimationFrame(render);
    if (!topLoaded || W === 0 || H === 0) return;

    const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1) || 0.016;
    lastTimestamp = timestamp;
    const now = timestamp / 1000;

    // Follower path update
    if (isInsideHero && hasFirstInteracted) {
      const k = 1 - Math.pow(1 - 0.17, dt * 60);
      sx += (tx - sx) * k;
      sy += (ty - sy) * k;

      const baseBrushRadius = Math.min(W, H) * 0.18;
      const stampSpacing = baseBrushRadius * 0.09;
      const dx = sx - lastStampX;
      const dy = sy - lastStampY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist >= stampSpacing) {
        const steps = Math.ceil(dist / stampSpacing);
        for (let step = 1; step <= steps; step++) {
          const ratio = step / steps;
          const stampX = lastStampX + dx * ratio;
          const stampY = lastStampY + dy * ratio;
          const angle = Math.atan2(dy, dx);
          const stretch = Math.min(dist / (baseBrushRadius * 0.6), 1);

          stamps.push({
            x: stampX,
            y: stampY,
            radius: baseBrushRadius,
            angle: angle,
            stretch: stretch,
            born: now,
            seed: now * 40 + step * 5.12 + stampX * 0.02
          });
        }
        lastStampX = sx;
        lastStampY = sy;
      }
    }

    // Filter active brush stamps within 2.7s lifetime
    stamps = stamps.filter(s => (now - s.born) < STAMP_LIFETIME);

    // Rebuild mask every animation frame from active stamps so there is no permanent ghosting
    ctx.clearRect(0, 0, W, H);

    // 1. Draw IMAGE 1 (jarvo_storefront) fully opaque
    ctx.globalCompositeOperation = 'source-over';
    drawCoverImage(ctx, imgTop, W, H);

    // 2. Cut out active stamps with destination-out so IMAGE 2 shows underneath
    if (stamps.length > 0) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#000000';

      for (let i = 0; i < stamps.length; i++) {
        const s = stamps[i];
        const age = now - s.born;
        const life = Math.max(0, 1 - age / STAMP_LIFETIME);
        const radius = s.radius * Math.pow(life, 0.85);

        if (radius > 1) {
          drawProceduralBrush(s.x, s.y, radius, s.angle, s.stretch, s.seed);
        }
      }
    }

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  }

  requestAnimationFrame(render);
  window.addEventListener('load', resizeCanvas);

})();
