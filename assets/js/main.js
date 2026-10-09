/* ===== HACK TO FEED – MAIN JS ===== */

// ===== NAV SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
  const bars = hamburger.querySelectorAll('span');
  bars.forEach(b => b.classList.toggle('active'));
});
document.addEventListener('click', (e) => {
  if (!hamburger?.contains(e.target) && !mobileMenu?.contains(e.target)) {
    mobileMenu?.classList.remove('open');
  }
});

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ===== ANIMATED COUNTER =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const decimals = el.dataset.decimals || 0;
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = prefix + current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ===== INTERSECTION OBSERVER =====
const observerOptions = { threshold: 0.15 };

// Fade-in animations
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
  fadeObserver.observe(el);
});

// Counter animation
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// Progress bars
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.progress-fill');
      if (fill) {
        const width = fill.dataset.width;
        fill.style.width = width;
      }
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.progress-bar').forEach(el => {
  progressObserver.observe(el);
});

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3800);
}

// ===== FORM HANDLING =====
document.querySelectorAll('form[data-form]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      form.reset();
      showToast('Thank you! We\'ll be in touch soon. 🙏');
    }, 1600);
  });
});

// ===== SMOOTH STAGGER =====
function staggerChildren(parentSelector, delay = 100) {
  const parents = document.querySelectorAll(parentSelector);
  parents.forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * delay}ms`;
    });
  });
}
staggerChildren('.services-grid', 80);
staggerChildren('.activities-grid', 80);
staggerChildren('.team-grid', 80);
staggerChildren('.testimonials-grid', 80);

// ===== BACK TO TOP =====
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop?.style.setProperty('opacity', window.scrollY > 400 ? '1' : '0');
  backTop?.style.setProperty('pointer-events', window.scrollY > 400 ? 'all' : 'none');
});
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== TAB SWITCHER =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.group;
    const target = btn.dataset.tab;
    document.querySelectorAll(`.tab-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`.tab-panel[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.tab-panel[data-group="${group}"][data-tab="${target}"]`)?.classList.add('active');
  });
});

// ===== SIMPLE CHART (Canvas) =====
function drawBarChart(canvasId, labels, data, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const padding = { top: 30, right: 20, bottom: 50, left: 50 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;
  const max = Math.max(...data) * 1.15;
  const barW = (chartW / data.length) * 0.55;
  const gap = (chartW / data.length) * 0.45;

  ctx.clearRect(0, 0, W, H);
  ctx.font = '11px Inter, sans-serif';
  ctx.fillStyle = '#888';

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + chartH - (chartH * i / 4);
    ctx.strokeStyle = 'rgba(0,0,0,0.07)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(W - padding.right, y);
    ctx.stroke();
    ctx.fillText(Math.round((max * i / 4) / 1000) + 'k', 5, y + 4);
  }

  // Bars
  data.forEach((val, i) => {
    const x = padding.left + i * (barW + gap) + gap / 2;
    const barH = (val / max) * chartH;
    const y = padding.top + chartH - barH;
    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, colors[i % colors.length]);
    grad.addColorStop(1, colors[i % colors.length] + '77');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 6);
    ctx.fill();
    // Label
    ctx.fillStyle = '#555';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barW / 2, H - 10);
    // Value
    ctx.fillStyle = '#333';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText(val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val, x + barW / 2, y - 6);
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#888';
  });
}

function drawDonutChart(canvasId, data, colors, labels) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.38, ir = r * 0.52;
  const total = data.reduce((a, b) => a + b, 0);
  let start = -Math.PI / 2;

  ctx.clearRect(0, 0, W, H);
  data.forEach((val, i) => {
    const angle = (val / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    start += angle;
  });

  // Inner hole
  ctx.beginPath();
  ctx.arc(cx, cy, ir, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();

  // Center text
  ctx.fillStyle = '#1A1A2E';
  ctx.font = 'bold 20px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(total.toLocaleString(), cx, cy - 2);
  ctx.fillStyle = '#888';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('Total', cx, cy + 16);

  // Legend (below)
  ctx.textAlign = 'left';
  const lx = 20, ly = H - labels.length * 24 - 10;
  labels.forEach((label, i) => {
    const y = ly + i * 24;
    ctx.fillStyle = colors[i];
    ctx.fillRect(lx, y, 14, 14);
    ctx.fillStyle = '#555';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(label + ': ' + data[i].toLocaleString(), lx + 20, y + 11);
  });
}

// Initialize charts if on transparency page
window.addEventListener('DOMContentLoaded', () => {
  drawBarChart('mealsChart',
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    [8000, 10500, 12000, 9800, 14000, 16500, 13200, 15800, 18000, 20000, 17500, 22000],
    ['#FF6B2B', '#FF8C5A', '#2ECC71', '#FF6B2B', '#FF8C5A', '#2ECC71',
     '#FF6B2B', '#FF8C5A', '#2ECC71', '#FF6B2B', '#FF8C5A', '#2ECC71']
  );
  drawDonutChart('donorChart',
    [45000, 28000, 18000, 12000, 7000],
    ['#FF6B2B', '#2ECC71', '#3498DB', '#9B59B6', '#F39C12'],
    ['Individual', 'Corporate', 'Events', 'Grants', 'Other']
  );
  drawBarChart('volunteerChart',
    ['Hyd', 'Sec', 'Wgl', 'Vjd', 'Krkm', 'Nizb', 'Knt'],
    [420, 310, 180, 150, 120, 90, 70],
    ['#FF6B2B', '#FF8C5A', '#FF6B2B', '#FF8C5A', '#FF6B2B', '#FF8C5A', '#2ECC71']
  );
});
