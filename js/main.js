/**
 * MEWURK - MYNTRA THEMED FRONTEND SCRIPT
 * Handles interactivity, live theme switching, animations, and mobile drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. LIVE THEME SWITCHER LOGIC
  // =========================================================================
  const themeTrigger = document.getElementById('themeTrigger');
  const themePanel = document.getElementById('themePanel');
  const themeClose = document.getElementById('themeClose');
  const presetButtons = document.querySelectorAll('.theme-preset-btn');
  const customColorInput = document.getElementById('customColorInput');

  // Load saved theme from LocalStorage if available
  const savedTheme = localStorage.getItem('mewurk_selected_theme');
  const savedCustomColor = localStorage.getItem('mewurk_custom_color');

  if (savedCustomColor) {
    applyCustomColor(savedCustomColor);
    if (customColorInput) customColorInput.value = savedCustomColor;
  } else if (savedTheme) {
    applyThemeClass(savedTheme);
  }

  // Toggle Theme Panel
  if (themeTrigger && themePanel) {
    themeTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      themePanel.classList.toggle('active');
    });

    if (themeClose) {
      themeClose.addEventListener('click', (e) => {
        e.stopPropagation();
        themePanel.classList.remove('active');
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!themePanel.contains(e.target) && !themeTrigger.contains(e.target)) {
        themePanel.classList.remove('active');
      }
    });
  }

  // Handle Preset Theme Clicks
  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const themeName = btn.getAttribute('data-theme');
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Clear custom color overrides
      resetCustomColors();
      localStorage.removeItem('mewurk_custom_color');

      applyThemeClass(themeName);
    });
  });

  function applyThemeClass(themeName) {
    // Remove existing theme classes
    document.body.classList.remove(
      'theme-mewurk',
      'theme-flipkart',
      'theme-amazon',
      'theme-emerald',
      'theme-purple'
    );

    if (themeName && themeName !== 'myntra') {
      document.body.classList.add(`theme-${themeName}`);
      localStorage.setItem('mewurk_selected_theme', themeName);
    } else {
      localStorage.setItem('mewurk_selected_theme', 'myntra');
    }

    // Update active button state
    presetButtons.forEach((btn) => {
      if (btn.getAttribute('data-theme') === (themeName || 'myntra')) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Handle Custom Color Picker
  if (customColorInput) {
    customColorInput.addEventListener('input', (e) => {
      const color = e.target.value;
      presetButtons.forEach(b => b.classList.remove('active'));
      applyCustomColor(color);
      localStorage.setItem('mewurk_custom_color', color);
    });
  }

  function applyCustomColor(hexColor) {
    document.documentElement.style.setProperty('--primary-color', hexColor);
    document.documentElement.style.setProperty('--primary-hover', adjustColorBrightness(hexColor, -20));
    document.documentElement.style.setProperty('--primary-light', hexColor + '18');
    document.documentElement.style.setProperty('--primary-glow', hexColor + '40');
    document.documentElement.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${hexColor} 0%, ${adjustColorBrightness(hexColor, 25)} 100%)`);
    document.documentElement.style.setProperty('--border-focus', hexColor);
  }

  function resetCustomColors() {
    document.documentElement.style.removeProperty('--primary-color');
    document.documentElement.style.removeProperty('--primary-hover');
    document.documentElement.style.removeProperty('--primary-light');
    document.documentElement.style.removeProperty('--primary-glow');
    document.documentElement.style.removeProperty('--gradient-primary');
    document.documentElement.style.removeProperty('--border-focus');
  }

  function adjustColorBrightness(hex, percent) {
    let num = parseInt(hex.replace('#', ''), 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let G = (num >> 8 & 0x00FF) + amt;
    let B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
  }

  // =========================================================================
  // 2. MOBILE MENU DRAWER LOGIC
  // =========================================================================
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileClose = document.getElementById('mobileClose');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });

    // Close on navigation click inside drawer
    const drawerLinks = mobileDrawer.querySelectorAll('.mobile-nav-link');
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));
  }

  // =========================================================================
  // 3. STATS NUMBER COUNTER ANIMATION
  // =========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const countUp = (el, target, suffix = '') => {
    let start = 0;
    const duration = 1500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(timer);
        el.textContent = target.toLocaleString() + suffix;
      } else {
        el.textContent = Math.floor(start).toLocaleString() + suffix;
      }
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach((stat) => {
          const valText = stat.getAttribute('data-value');
          if (valText) {
            if (valText.includes('k')) {
              const num = parseInt(valText);
              countUp(stat, num, 'k');
            } else if (valText.includes('M')) {
              const num = parseInt(valText);
              countUp(stat, num, 'M');
            } else {
              const num = parseInt(valText.replace(/,/g, ''));
              countUp(stat, num);
            }
          }
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection) {
    observer.observe(statsSection);
  }

  // =========================================================================
  // 4. SMOOTH SCROLL FOR IN-PAGE ANCHORS
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
