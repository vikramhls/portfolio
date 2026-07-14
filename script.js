/* ================================================
   PORTFOLIO v2 — JavaScript
   TV boot sequence, rainbow cursor, side progress line,
   bouncy scroll reveals, mobile nav, marquee,
   Galekto-style interactions:
     - Lerp-based hero 3D tilt
     - Cursor-following project preview images
     - Scroll-driven timeline fill with dot activation
     - Magnetic cursor with VIEW label
     - Scroll parallax layers
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════════
  // 1. BOOT SEQUENCE (TV Test Pattern)
  // ═══════════════════════════════════════════════
  const tvLoading = document.getElementById('tv-loading');
  const mainContent = document.getElementById('main-content');
  const loadingBlocks = document.querySelectorAll('.tv-loading-block');
  
  const hasVisited = sessionStorage.getItem('portfolio-visited-v2');

  if (hasVisited) {
    tvLoading.classList.add('hidden');
    mainContent.classList.add('visible');
    document.body.style.overflow = '';
    initAfterLoad();
  } else {
    document.body.style.overflow = 'hidden';
    
    // Animate loading blocks
    let blockIndex = 0;
    const blockInterval = setInterval(() => {
      if (blockIndex < loadingBlocks.length) {
        loadingBlocks[blockIndex].classList.add('active');
        blockIndex++;
      } else {
        clearInterval(blockInterval);
        
        // Initiate shutdown sequence
        setTimeout(() => {
          tvLoading.classList.add('shutting-down');
          
          setTimeout(() => {
            tvLoading.classList.add('hidden');
            mainContent.classList.add('visible');
            document.body.style.overflow = '';
            sessionStorage.setItem('portfolio-visited-v2', 'true');
            initAfterLoad();
          }, 600); // Matches shutdown animation duration
        }, 800);
      }
    }, 250);
  }

  function initAfterLoad() {
    initTypingEffect();
    initScrollReveals();
    initSideLine();
    initAsciiEffect();
    initCarGame();
    initScrollParallax();
  }

  // ═══════════════════════════════════════════════
  // 2. RAINBOW CURSOR, MAGNETIC PULL & PROJECT PREVIEW
  // ═══════════════════════════════════════════════
  const cursorRing = document.getElementById('cursor-ring');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorLabel = document.getElementById('cursor-label');
  const trailsContainer = document.getElementById('cursor-trails-container');
  
  // Project preview elements
  const previewContainer = document.getElementById('project-preview-container');
  const previewImg = document.getElementById('project-preview-img');
  const projectRows = document.querySelectorAll('.project-row');
  
  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;
    // Separate lerp targets for preview (smoother following)
    let previewX = mouseX;
    let previewY = mouseY;
    
    let isMoving = false;
    let trailTimer;
    
    // Magnetic cursor state
    let magnetTarget = null; // The element being magneted toward
    let magnetForceX = 0;
    let magnetForceY = 0;
    
    // Project preview state
    let activePreview = null; // Currently hovered project row

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;
      
      clearTimeout(trailTimer);
      trailTimer = setTimeout(() => { isMoving = false; }, 50);
      
      // Create trails occasionally when moving
      if (Math.random() > 0.6) {
        createTrail(mouseX, mouseY);
      }
      
      // Magnetic cursor check — find nearest magnetic element
      updateMagneticForce(mouseX, mouseY);
    });

    document.addEventListener('mousedown', () => cursorRing.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursorRing.classList.remove('clicking'));

    function createTrail(x, y) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = x + 'px';
      trail.style.top = y + 'px';
      trail.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--cursor-color').trim();
      trailsContainer.appendChild(trail);
      
      setTimeout(() => {
        trail.remove();
      }, 600);
    }
    
    // ── Magnetic Cursor Logic ──
    const magneticElements = document.querySelectorAll('.project-row, .contact-link, .nav-resume-btn, .nav-link-item');
    const MAGNET_DISTANCE = 100; // pixels — range of influence
    const MAGNET_STRENGTH = 0.3; // 0-1, how strongly it pulls
    
    function updateMagneticForce(mx, my) {
      magnetForceX = 0;
      magnetForceY = 0;
      magnetTarget = null;
      
      let closestDist = MAGNET_DISTANCE;
      
      magneticElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;
        const dx = elCenterX - mx;
        const dy = elCenterY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < closestDist) {
          closestDist = dist;
          magnetTarget = el;
          // Force increases as cursor gets closer
          const force = (1 - dist / MAGNET_DISTANCE) * MAGNET_STRENGTH;
          magnetForceX = dx * force;
          magnetForceY = dy * force;
        }
      });
    }

    function animateCursor() {
      // Target positions (with magnetic offset applied)
      const targetRingX = mouseX + magnetForceX;
      const targetRingY = mouseY + magnetForceY;
      
      // Lerp for smooth follow
      ringX += (targetRingX - ringX) * 0.15;
      ringY += (targetRingY - ringY) * 0.15;
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';
      
      // ── Project Preview Following ──
      if (activePreview) {
        previewX += (mouseX - previewX) * 0.1; // Slower follow for preview
        previewY += (mouseY - previewY) * 0.1;
        previewContainer.style.left = (previewX + 24) + 'px'; // Offset to the right of cursor
        previewContainer.style.top = (previewY - 110) + 'px'; // Offset above center
      }

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // ── Project Row Hover → Show Preview Image ──
    projectRows.forEach(row => {
      row.addEventListener('mouseenter', (e) => {
        const previewSrc = row.getAttribute('data-preview');
        if (!previewSrc) return;
        
        activePreview = row;
        previewImg.src = previewSrc;
        
        // Reset position immediately so it doesn't lerp from the old spot
        previewX = e.clientX;
        previewY = e.clientY;
        previewContainer.style.left = (previewX + 24) + 'px';
        previewContainer.style.top = (previewY - 110) + 'px';
        
        // Show after a tiny delay for image load
        requestAnimationFrame(() => {
          previewContainer.classList.add('visible');
        });
        
        // Cursor → project-hover mode (big ring with "VIEW")
        cursorRing.classList.add('project-hover');
        cursorRing.classList.remove('hovering');
        cursorLabel.textContent = 'VIEW';
      });
      
      row.addEventListener('mouseleave', () => {
        activePreview = null;
        previewContainer.classList.remove('visible');
        cursorRing.classList.remove('project-hover');
        cursorLabel.textContent = '';
      });
    });

    // Hover effect on other interactive elements (not project rows)
    const hoverTargets = document.querySelectorAll('a:not(.project-row), button, .paperclip-note');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (!cursorRing.classList.contains('project-hover')) {
          cursorRing.classList.add('hovering');
        }
      });
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });

    document.addEventListener('mouseleave', () => {
      cursorRing.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorRing.style.opacity = '1';
      cursorDot.style.opacity = '1';
    });
  }

  // ═══════════════════════════════════════════════
  // 3. TYPING EFFECT
  // ═══════════════════════════════════════════════
  function initTypingEffect() {
    const typedElement = document.getElementById('typed-text');
    if (!typedElement) return;
    
    const phrases = [
      'full-stack applications.',
      'AI / ML models.',
      'blockchain solutions.',
      'clean, elegant code.',
      'things that matter.',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 30;
      } else {
        typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 300;
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 800);
  }

  // ═══════════════════════════════════════════════
  // 4. SCROLL REVEALS (Bouncy)
  // ═══════════════════════════════════════════════
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // ═══════════════════════════════════════════════
  // 5. SIDE PROGRESS LINE & DYNAMIC COLORS
  // ═══════════════════════════════════════════════
  function initSideLine() {
    const sideProgress = document.getElementById('side-progress');
    const sideDot = document.getElementById('side-dot');
    const sections = document.querySelectorAll('.section-marker');
    
    if (!sideProgress || !sideDot) return;

    // Update progress bar based on scroll
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      sideProgress.style.height = scrollPercent + '%';
      sideDot.style.top = scrollPercent + '%';
      
      // Dynamic color change based on section
      let currentSection = sections[0];
      
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        // If section is in the upper half of viewport
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
          currentSection = sec;
        }
      });

      if (currentSection) {
        const newColor = currentSection.getAttribute('data-color');
        document.documentElement.style.setProperty('--cursor-color', newColor);
      }
    });
    
    // Trigger scroll event once to set initial state
    window.dispatchEvent(new Event('scroll'));
  }

  // ═══════════════════════════════════════════════
  // 6. NAVBAR & MOBILE TOGGLE
  // ═══════════════════════════════════════════════
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link-item').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ═══════════════════════════════════════════════
  // 7. SMOOTH SCROLL ANCHORS
  // ═══════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ═══════════════════════════════════════════════
  // 8. SPLIT AND JOIN COLLAGE ANIMATION
  // ═══════════════════════════════════════════════
  const collageSection = document.getElementById('collage-section');
  if (collageSection) {
    const collageItems = collageSection.querySelectorAll('.paper-scrap, .doodle');
    
    // Set initial positions
    collageItems.forEach(item => {
      const splitX = parseFloat(item.getAttribute('data-split-x') || 0);
      const splitY = parseFloat(item.getAttribute('data-split-y') || 0);
      item.style.transform = `translate(${splitX}px, ${splitY}px) rotate(15deg)`;
      item.style.opacity = '0';
    });

    window.addEventListener('scroll', () => {
      const rect = collageSection.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      
      // Calculate progress based on distance to viewport center
      const centerPos = rect.top + rect.height / 2;
      const viewCenter = viewHeight / 2;
      
      // Distance from center (-1 to 1 roughly)
      let distance = (centerPos - viewCenter) / (viewHeight * 0.7);
      if (distance < -1) distance = -1;
      if (distance > 1) distance = 1;
      
      // Progress: 1 when distance is 0, approaches 0 as distance grows
      let progress = 1 - Math.abs(distance);
      // Easing for smoother join
      progress = Math.pow(progress, 1.5);
      
      const splitFactor = 1 - progress; 

      collageItems.forEach(item => {
        const splitX = parseFloat(item.getAttribute('data-split-x') || 0);
        const splitY = parseFloat(item.getAttribute('data-split-y') || 0);
        const speed = parseFloat(item.getAttribute('data-speed') || 1);
        
        // Move towards 0,0 as progress -> 1
        const x = splitX * splitFactor;
        const y = (splitY * splitFactor) + (distance * 60 * speed);
        
        // Rotation goes to 0 as it joins
        const rotate = (splitX > 0 ? 1 : -1) * (splitFactor * 25);
        
        // Fade in as it comes into view
        const opacity = Math.min(1, progress * 2.5);
        
        item.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
        item.style.opacity = opacity.toString();
      });
    });
    
    // Trigger once to set initial state
    window.dispatchEvent(new Event('scroll'));
  }

  // ═══════════════════════════════════════════════
  // 9. HERO PARALLAX, 3D TILT & COLOR MASK (Galekto Style)
  //    Uses requestAnimationFrame lerp for buttery smooth movement
  // ═══════════════════════════════════════════════
  const heroSection = document.getElementById('hero');
  const heroFaceContainer = document.getElementById('hero-face-container');
  const heroNameParallax = document.getElementById('hero-name-parallax');
  const heroFaceMask = document.getElementById('hero-face-mask');
  
  // Select the side texts and background numbers
  const leftSideText = document.querySelector('.hero-side-text.left-side');
  const rightSideText = document.querySelector('.hero-side-text.right-side');
  const bgNumber1 = document.getElementById('bg-number-1');
  const bgNumber2 = document.getElementById('bg-number-2');

  if (heroSection && heroFaceContainer && heroNameParallax && heroFaceMask) {
    // Lerp state for hero parallax (all driven by rAF, not directly in mousemove)
    const heroState = {
      // Raw mouse input (set in mousemove)
      targetMoveX: 0,
      targetMoveY: 0,
      targetNameMoveX: 0,
      targetNameMoveY: 0,
      targetBgMoveX: 0,
      targetBgMoveY: 0,
      // Smoothed output (lerped each frame)
      currentMoveX: 0,
      currentMoveY: 0,
      currentNameMoveX: 0,
      currentNameMoveY: 0,
      currentBgMoveX: 0,
      currentBgMoveY: 0,
      // Mask position (lerped for silkiness)
      targetMaskX: -500,
      targetMaskY: -500,
      currentMaskX: -500,
      currentMaskY: -500,
      // Is mouse inside hero?
      active: false
    };

    heroSection.addEventListener('mousemove', (e) => {
      heroState.active = true;
      const rect = heroFaceContainer.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      
      // Mask position relative to face container
      heroState.targetMaskX = e.clientX - rect.left;
      heroState.targetMaskY = e.clientY - rect.top;

      // ── Side Text & Name Interaction (Left / Center / Right zones) ──
      const mousePercentX = e.clientX / screenWidth;
      
      if (mousePercentX < 0.4) {
        if (leftSideText) { leftSideText.classList.add('active'); leftSideText.classList.remove('hidden'); }
        if (rightSideText) { rightSideText.classList.remove('active'); rightSideText.classList.add('hidden'); }
        if (bgNumber1) bgNumber1.classList.add('active');
        if (bgNumber2) bgNumber2.classList.remove('active');
        heroNameParallax.innerText = "HARSH";
      } else if (mousePercentX > 0.6) {
        if (rightSideText) { rightSideText.classList.add('active'); rightSideText.classList.remove('hidden'); }
        if (leftSideText) { leftSideText.classList.remove('active'); leftSideText.classList.add('hidden'); }
        if (bgNumber2) bgNumber2.classList.add('active');
        if (bgNumber1) bgNumber1.classList.remove('active');
        heroNameParallax.innerText = "VIKRAM";
      } else {
        if (leftSideText) leftSideText.classList.remove('active', 'hidden');
        if (rightSideText) rightSideText.classList.remove('active', 'hidden');
        if (bgNumber1) bgNumber1.classList.remove('active');
        if (bgNumber2) bgNumber2.classList.remove('active');
        heroNameParallax.innerText = "HARSH";
      }

      // ── Calculate parallax targets ──
      const centerX = screenWidth / 2;
      const centerY = window.innerHeight / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      // Photo translation — pure movement, no tilt (Galekto style)
      heroState.targetMoveX = distanceX * 0.2;
      heroState.targetMoveY = distanceY * 0.15;
      
      // Name movement (reversed direction, creates depth)
      heroState.targetNameMoveX = distanceX * -0.1;
      heroState.targetNameMoveY = distanceY * -0.08;
      
      // Background numbers (reverse parallax)
      heroState.targetBgMoveX = heroState.targetMoveX * -0.8;
      heroState.targetBgMoveY = heroState.targetMoveY * -0.8;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroState.active = false;
      // Set all targets to 0 — the lerp loop will smoothly animate back
      heroState.targetMoveX = 0;
      heroState.targetMoveY = 0;
      heroState.targetNameMoveX = 0;
      heroState.targetNameMoveY = 0;
      heroState.targetBgMoveX = 0;
      heroState.targetBgMoveY = 0;
      heroState.targetMaskX = -500;
      heroState.targetMaskY = -500;
      
      // Reset text states
      if (leftSideText) leftSideText.classList.remove('active', 'hidden');
      if (rightSideText) rightSideText.classList.remove('active', 'hidden');
      if (bgNumber1) bgNumber1.classList.remove('active');
      if (bgNumber2) bgNumber2.classList.remove('active');
      heroNameParallax.innerText = "HARSH";
    });

    // ── Hero Lerp Animation Loop (rAF) ──
    const LERP_SPEED = 0.08; // Lower = smoother but slower
    const LERP_SPEED_FAST = 0.12;
    
    function animateHero() {
      // Lerp all values toward their targets
      heroState.currentMoveX += (heroState.targetMoveX - heroState.currentMoveX) * LERP_SPEED;
      heroState.currentMoveY += (heroState.targetMoveY - heroState.currentMoveY) * LERP_SPEED;
      heroState.currentNameMoveX += (heroState.targetNameMoveX - heroState.currentNameMoveX) * LERP_SPEED;
      heroState.currentNameMoveY += (heroState.targetNameMoveY - heroState.currentNameMoveY) * LERP_SPEED;
      heroState.currentBgMoveX += (heroState.targetBgMoveX - heroState.currentBgMoveX) * LERP_SPEED;
      heroState.currentBgMoveY += (heroState.targetBgMoveY - heroState.currentBgMoveY) * LERP_SPEED;
      heroState.currentMaskX += (heroState.targetMaskX - heroState.currentMaskX) * LERP_SPEED_FAST;
      heroState.currentMaskY += (heroState.targetMaskY - heroState.currentMaskY) * LERP_SPEED_FAST;
      
      // Apply transforms — pure translation, no tilt (Galekto style)
      heroFaceContainer.style.transform = 
        `translate(${heroState.currentMoveX}px, ${heroState.currentMoveY}px)`;
      
      heroNameParallax.style.transform = 
        `translate(${heroState.currentNameMoveX}px, ${heroState.currentNameMoveY}px)`;
      
      // Mask follows cursor (smoothly)
      heroFaceMask.style.setProperty('--mouse-x', `${heroState.currentMaskX}px`);
      heroFaceMask.style.setProperty('--mouse-y', `${heroState.currentMaskY}px`);
      
      // Background numbers
      if (bgNumber1) bgNumber1.style.transform = `translateY(-50%) translate(${heroState.currentBgMoveX}px, ${heroState.currentBgMoveY}px)`;
      if (bgNumber2) bgNumber2.style.transform = `translateY(-50%) translate(${heroState.currentBgMoveX}px, ${heroState.currentBgMoveY}px)`;
      
      requestAnimationFrame(animateHero);
    }
    animateHero();
  }

  // ═══════════════════════════════════════════════
  // 10. ASCII FACE EFFECT
  // ═══════════════════════════════════════════════
  function initAsciiEffect() {
    const canvas = document.getElementById('ascii-canvas');
    const overlay = document.getElementById('ascii-face-overlay');
    const bwFace = document.getElementById('bw-face');
    const colorMask = document.getElementById('hero-face-mask');
    if (!canvas || !overlay || !bwFace) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = new Image();
    img.src = 'vikram-face.jpg';
    
    img.onload = () => {
      const cols = 60;
      const aspect = img.height / img.width;
      const rows = Math.floor(cols * aspect * 0.5);
      
      canvas.width = cols;
      canvas.height = rows;
      ctx.drawImage(img, 0, 0, cols, rows);
      
      try {
        const imgData = ctx.getImageData(0, 0, cols, rows).data;
        const chars = ['&', '{', '}', '0', '1', '<', '>', '=', '+', ';', '-', '_', '.', ' '];
        
        overlay.innerHTML = '';
        
        for (let y = 0; y < rows; y++) {
          const rowDiv = document.createElement('div');
          rowDiv.className = 'ascii-row';
          rowDiv.style.opacity = '0';
          
          for (let x = 0; x < cols; x++) {
            const i = (y * cols + x) * 4;
            const r = imgData[i];
            const g = imgData[i+1];
            const b = imgData[i+2];
            
            const brightness = (r + g + b) / 3;
            const charIdx = Math.floor((brightness / 255) * (chars.length - 1));
            
            const span = document.createElement('span');
            span.textContent = chars[charIdx] || ' ';
            span.style.color = `rgb(${r},${g},${b})`;
            rowDiv.appendChild(span);
          }
          overlay.appendChild(rowDiv);
        }
        
        const asciiRows = overlay.querySelectorAll('.ascii-row');
        asciiRows.forEach((row, idx) => {
          setTimeout(() => {
            row.style.opacity = '1';
          }, idx * 40 + 300);
        });
        
        // Continuous Matrix Effect
        const allSpans = overlay.querySelectorAll('span');
        setInterval(() => {
          // Change ~5% of characters every 50ms
          const numToChange = Math.floor(allSpans.length * 0.05);
          for (let i = 0; i < numToChange; i++) {
            const randomIdx = Math.floor(Math.random() * allSpans.length);
            const randomChar = chars[Math.floor(Math.random() * chars.length)];
            allSpans[randomIdx].textContent = randomChar;
          }
        }, 50);

        setTimeout(() => {
          bwFace.classList.add('ascii-revealed');
          bwFace.classList.remove('ascii-hidden');
          colorMask.classList.add('ascii-revealed');
          colorMask.classList.remove('ascii-hidden');
          
          // Keep the continuous effect visible over the image
          overlay.style.opacity = '0.7';
          overlay.style.mixBlendMode = 'overlay';
        }, rows * 40 + 1500);
      } catch (e) {
        // Fallback if running via file:// protocol (CORS error on getImageData)
        bwFace.classList.add('ascii-revealed');
        bwFace.classList.remove('ascii-hidden');
        colorMask.classList.add('ascii-revealed');
        colorMask.classList.remove('ascii-hidden');
      }
    };
  }

  // ═══════════════════════════════════════════════
  // 11. CAR DRIVING JOURNEY GAME
  // ═══════════════════════════════════════════════
  function initCarGame() {
    const canvas = document.getElementById('car-game-canvas');
    const container = document.getElementById('car-game-scroll-container');
    const sticky = document.getElementById('car-game-sticky');
    const popup = document.getElementById('milestone-popup');
    const popupYear = document.getElementById('popup-year');
    const popupTitle = document.getElementById('popup-title');
    const counter = document.getElementById('milestone-counter');
    const gameHint = document.getElementById('game-hint');
    
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    
    let width = sticky.clientWidth;
    let height = sticky.clientHeight;
    
    function resize() {
      width = sticky.clientWidth;
      height = sticky.clientHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();
    
    const milestones = [
      { year: "2020", title: "🏫 Class 10 — Scored 94.4%" },
      { year: "2022", title: "🎓 Class 12 — Scored 85.5%" },
      { year: "2023", title: "🏛️ Started B.Tech CSE at VIT Chennai" },
      { year: "2024", title: "💰 Head of Finance, Sangam Cultural Club" },
      { year: "2024", title: "🔒 Built Cyber Secure Vault" },
      { year: "2025", title: "⚡ Glitchathon Hackathon — Campus portal in 24hrs" },
      { year: "2025", title: "🎪 Student Coordinator, VIT Vibrance" },
      { year: "2025", title: "🔗 Built NFT Rental Platform" },
      { year: "2026", title: "🧠 350+ LeetCode Problems Solved" },
      { year: "2026", title: "🛡️ Built FinProtect AI — Fraud Detection" },
      { year: "2026", title: "🚀 Launched CodeFlow at codski.qzz.io" },
      { year: "2027", title: "🎯 Graduation — What's Next?" }
    ];
    
    let carX = width * 0.2;
    let distance = 0;
    let targetDistance = 0;
    const milestoneSpacing = 3000;
    const totalDistance = (milestones.length + 1) * milestoneSpacing;
    
    window.addEventListener('scroll', () => {
      const rect = container.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;
      if (scrollableDist <= 0) return;
      
      let p = -rect.top / scrollableDist;
      p = Math.max(0, Math.min(1, p));
      targetDistance = p * totalDistance;
      
      if (p > 0.05) gameHint.style.opacity = '0';
    });
    
    const colors = {
      skyStartDay: [135, 206, 235],
      skyEndDay: [25, 25, 112],
      groundDay: [34, 139, 34],
      groundNight: [15, 60, 15]
    };
    
    function lerpColor(c1, c2, factor) {
      const r = Math.round(c1[0] + (c2[0] - c1[0]) * factor);
      const g = Math.round(c1[1] + (c2[1] - c1[1]) * factor);
      const b = Math.round(c1[2] + (c2[2] - c1[2]) * factor);
      return `rgb(${r},${g},${b})`;
    }
    
    let activeMilestone = -1;
    let isPaused = false;
    let pauseTimeout = null;
    
    function draw() {
      const carY = height * 0.75;
      if (!isPaused) {
        distance += (targetDistance - distance) * 0.1;
      }
      
      const timeOfDay = Math.min(1, distance / totalDistance);
      
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, lerpColor(colors.skyStartDay, colors.skyEndDay, timeOfDay));
      skyGradient.addColorStop(1, lerpColor([200, 230, 255], [10, 10, 40], timeOfDay));
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = lerpColor([150, 160, 170], [30, 40, 50], timeOfDay);
      for(let i = 0; i < 5; i++) {
        const mx = ((i * 400) - (distance * 0.2)) % 2000;
        const adjustedMx = mx < -400 ? mx + 2000 : mx;
        ctx.beginPath();
        ctx.moveTo(adjustedMx, height * 0.65);
        ctx.lineTo(adjustedMx + 200, height * 0.3);
        ctx.lineTo(adjustedMx + 400, height * 0.65);
        ctx.fill();
      }
      
      ctx.fillStyle = lerpColor(colors.groundDay, colors.groundNight, timeOfDay);
      ctx.fillRect(0, height * 0.65, width, height * 0.35);
      
      ctx.fillStyle = '#333';
      ctx.fillRect(0, height * 0.7, width, height * 0.15);
      
      ctx.fillStyle = '#fff';
      for(let i = 0; i < Math.ceil(width / 100) + 1; i++) {
        const lineX = ((i * 100) - (distance % 100));
        ctx.fillRect(lineX, height * 0.77, 40, 4);
      }
      
      let newActive = -1;
      milestones.forEach((m, idx) => {
        const mDist = (idx + 1) * milestoneSpacing;
        const mX = (width * 0.5) + (mDist - distance);
        
        if (mX > carX - 100 && mX < carX + 100) {
          newActive = idx;
        }
        
        if (mX > -200 && mX < width + 200) {
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(mX - 5, height * 0.5, 10, height * 0.2);
          
          ctx.fillStyle = '#fff';
          ctx.fillRect(mX - 60, height * 0.45, 120, 60);
          ctx.strokeStyle = '#00ff88';
          ctx.lineWidth = 4;
          ctx.strokeRect(mX - 60, height * 0.45, 120, 60);
          
          ctx.fillStyle = '#111';
          ctx.font = 'bold 20px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(m.year, mX, height * 0.49);
          ctx.font = '12px sans-serif';
          ctx.fillText("MILESTONE", mX, height * 0.53);
        }
      });
      
      if (newActive !== activeMilestone) {
        activeMilestone = newActive;
        if (activeMilestone >= 0) {
          popupYear.textContent = milestones[activeMilestone].year;
          popupTitle.textContent = milestones[activeMilestone].title;
          popup.classList.remove('hidden');
          popup.classList.add('visible');
          counter.textContent = `${activeMilestone + 1} / ${milestones.length}`;
          
          isPaused = true;
          clearTimeout(pauseTimeout);
          pauseTimeout = setTimeout(() => {
            isPaused = false;
          }, 1400);
        } else {
          popup.classList.remove('visible');
          popup.classList.add('hidden');
        }
      }
      
      const speed = isPaused ? 0 : Math.abs(targetDistance - distance);
      const bounce = Math.sin(Date.now() / 100) * Math.min(2, speed * 0.1);
      const cy = carY + bounce;
      
      ctx.fillStyle = '#ff0040';
      ctx.fillRect(carX, cy - 30, 80, 25);
      ctx.fillRect(carX + 15, cy - 50, 45, 20);
      
      ctx.fillStyle = '#88ccff';
      ctx.fillRect(carX + 20, cy - 45, 15, 15);
      ctx.fillRect(carX + 40, cy - 45, 15, 15);
      
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(carX + 20, cy - 5, 10, 0, Math.PI * 2);
      ctx.arc(carX + 60, cy - 5, 10, 0, Math.PI * 2);
      ctx.fill();
      
      if (timeOfDay > 0.5) {
        ctx.fillStyle = 'rgba(255, 255, 150, 0.4)';
        ctx.beginPath();
        ctx.moveTo(carX + 80, cy - 20);
        ctx.lineTo(carX + 300, cy - 10);
        ctx.lineTo(carX + 300, cy - 30);
        ctx.fill();
      }
      
      requestAnimationFrame(draw);
    }
    
    draw();
  }


  // ═══════════════════════════════════════════════
  // 11. SCROLL PARALLAX LAYERS
  // ═══════════════════════════════════════════════
  function initScrollParallax() {
    // Create parallax data for elements
    const parallaxLayers = [
      { el: document.querySelector('.hero-glow'), speed: 0.3 },
      { el: document.querySelector('.hero-grid'), speed: 0.15 },
      { el: document.querySelector('.hero-abstract-bg'), speed: 0.2 },
    ].filter(layer => layer.el !== null);
    
    // Section titles get subtle parallax
    document.querySelectorAll('.section-title').forEach(el => {
      parallaxLayers.push({ el, speed: 0.05, offsetBased: true });
    });
    
    // Section labels get subtle parallax
    document.querySelectorAll('.section-label').forEach(el => {
      parallaxLayers.push({ el, speed: 0.03, offsetBased: true });
    });
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          parallaxLayers.forEach(layer => {
            if (layer.offsetBased) {
              // Offset-based: parallax relative to element's position in viewport
              const rect = layer.el.getBoundingClientRect();
              const distFromCenter = rect.top - window.innerHeight / 2;
              const offset = distFromCenter * layer.speed;
              layer.el.style.transform = `translateY(${offset}px)`;
            } else {
              // Global scroll-based
              const offset = scrollY * layer.speed;
              layer.el.style.transform = `translateY(${offset}px)`;
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    });
  }

});
