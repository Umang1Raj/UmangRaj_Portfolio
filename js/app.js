/**
 * Main Application Logic for Umang Raj Minimalist 3D Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D WebGL Scene
  let sceneInstance = null;
  try {
    if (typeof WebGLPortfolioScene !== 'undefined') {
      sceneInstance = new WebGLPortfolioScene();
    }
  } catch (err) {
    console.error('WebGL initialization notice:', err);
  }

  // 2. Audio Control
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isNowEnabled = window.soundEngine.toggle();
      soundBtn.classList.toggle('active', isNowEnabled);
      soundBtn.textContent = isNowEnabled ? 'Sound: On' : 'Sound: Off';
    });
  }

  // Subtle audio hover & click feedback
  const interactiveSelector = 'a, button, .tilt-card, .skill-item, .timeline-row';
  document.querySelectorAll(interactiveSelector).forEach((elem) => {
    elem.addEventListener('mouseenter', () => {
      if (window.soundEngine) window.soundEngine.play('hover');
    });
    elem.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.play('click');
    });
  });

  // 3. Refined, subtle 3D tilt on cards
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle tilt: max 5 degrees
      const rotX = ((y - centerY) / centerY) * -5;
      const rotY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 4. Certificate Preview Modal
  const certModal = document.getElementById('cert-modal');
  const certModalImg = document.getElementById('cert-modal-img');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certModalIssuer = document.getElementById('cert-modal-issuer');
  const certModalDate = document.getElementById('cert-modal-date');
  const certModalLink = document.getElementById('cert-modal-link');
  const certModalClose = document.getElementById('cert-modal-close');
  const certModalBackdrop = document.getElementById('cert-modal-backdrop');

  const certData = {
    'python-linkedin': {
      title: 'Learning Python',
      issuer: 'LinkedIn Learning',
      date: 'Jul 2026',
      img: 'assets/certificates/linkedin-learning-python-umang-raj.jpg',
      link: 'https://www.linkedin.com/learning/certificates/d4f5edf13e15a0a732c1dc88923ff3db32185290901154a2532e871b5788fae1/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3B0B1D%2BsePSnePd3mJ0KIxjw%3D%3D'
    },
    'python-kaggle': {
      title: 'Python',
      issuer: 'Kaggle Learn',
      date: 'Jul 2026',
      img: 'assets/certificates/kaggle-python-umang-raj.png',
      link: 'https://www.kaggle.com/learn/certification/umangraj1/python'
    },
    'modern-ai-cisco': {
      title: 'Introduction to Modern AI',
      issuer: 'Cisco Networking Academy',
      date: 'Feb 2026',
      img: 'assets/certificates/introduction-modern-ai-umang-raj.jpg',
      link: 'https://www.credly.com/badges/cf52b8d5-cd51-47bd-914d-ec13456e7e37'
    },
    'ey-ms-ai-passport': {
      title: 'EY–Microsoft AI Skills Passport',
      issuer: 'EY & Microsoft',
      date: 'Certificate of Completion',
      img: 'assets/certificates/ey-microsoft-ai-skills-passport.jpg',
      link: 'assets/certificates/ey-microsoft-ai-skills-passport.jpg'
    }
  };

  document.querySelectorAll('[data-cert-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-cert-id');
      const data = certData[id];
      if (data && certModal) {
        certModalTitle.textContent = data.title;
        certModalIssuer.textContent = data.issuer;
        certModalDate.textContent = data.date;
        certModalImg.src = data.img;
        certModalImg.alt = `${data.title} Certificate - Umang Raj`;
        certModalLink.href = data.link;

        certModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.soundEngine) window.soundEngine.play('modal');
      }
    });
  });

  const closeCertModal = () => {
    if (certModal) {
      certModal.classList.remove('active');
      document.body.style.overflow = '';
      if (window.soundEngine) window.soundEngine.play('click');
    }
  };

  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
  if (certModalBackdrop) certModalBackdrop.addEventListener('click', closeCertModal);

  // 5. CV Preview Modal
  const cvModal = document.getElementById('cv-modal');
  const cvModalOpenBtns = document.querySelectorAll('.open-cv-modal');
  const cvModalClose = document.getElementById('cv-modal-close');
  const cvModalBackdrop = document.getElementById('cv-modal-backdrop');

  const openCvModal = (e) => {
    if (e) e.preventDefault();
    if (cvModal) {
      cvModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.soundEngine) window.soundEngine.play('modal');
    }
  };

  const closeCvModal = () => {
    if (cvModal) {
      cvModal.classList.remove('active');
      document.body.style.overflow = '';
      if (window.soundEngine) window.soundEngine.play('click');
    }
  };

  cvModalOpenBtns.forEach(btn => btn.addEventListener('click', openCvModal));
  if (cvModalClose) cvModalClose.addEventListener('click', closeCvModal);
  if (cvModalBackdrop) cvModalBackdrop.addEventListener('click', closeCvModal);

  // Global Escape Key Closer
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCertModal();
      closeCvModal();
    }
  });

  // 6. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el, idx) => {
    el.style.transitionDelay = `${(idx % 3) * 60}ms`;
    revealObserver.observe(el);
  });

  // 7. Mobile Navigation
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('site-nav');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('nav-open');
      if (window.soundEngine) window.soundEngine.play('click');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-open');
      });
    });
  }
});
