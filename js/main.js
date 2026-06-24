// ============================================
// ⚙️ Main JavaScript — ครูคอม เทคโนโลยี
// Theme toggle, Navigation, Scroll effects,
// Filters, Lightbox, and Dynamic rendering
// ============================================

let SITE_DATA = {};

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initNavigation();
  initScrollEffects();
  initBackToTop();
  
  await loadAllData();
  
  // Page-specific init
  if (document.getElementById('subjects-content')) initSubjects();
  if (document.getElementById('materials-grid')) initMaterials();
  if (document.getElementById('schedule-body')) initSchedule();
  if (document.getElementById('gallery-grid')) initGallery();
  if (document.getElementById('links-content')) initLinks();
  if (document.getElementById('news-list')) initNews();
  if (document.getElementById('home-subjects')) initHomeSubjects();
  if (document.getElementById('contact-form')) initContactForm();
});

async function loadAllData() {
  try {
    const [teacher, subjects, materials, schedule, links, news, gallery] = await Promise.all([
      fetch('data/teacher.json').then(r => r.json()),
      fetch('data/subjects.json').then(r => r.json()),
      fetch('data/materials.json').then(r => r.json()),
      fetch('data/schedule.json').then(r => r.json()),
      fetch('data/links.json').then(r => r.json()),
      fetch('data/news.json').then(r => r.json()),
      fetch('data/gallery.json').then(r => r.json())
    ]);
    
    SITE_DATA = {
      teacher: teacher || {},
      subjects: subjects ? subjects.items : [],
      materials: materials ? materials.items : [],
      schedule: schedule || {},
      links: links ? links.categories : [],
      news: news ? news.items : [],
      gallery: gallery ? gallery.items : []
    };
  } catch (err) {
    console.error("Error loading data from JSON:", err);
  }
}

// ============ Theme Toggle ============
function initTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
}

// ============ Navigation ============
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
  
  // Highlight active page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }
}

// ============ Scroll Animations ============
function initScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });
}

// ============ Back to Top ============
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============ Home Page — Subjects Cards ============
function initHomeSubjects() {
  const container = document.getElementById('home-subjects');
  if (!container || typeof SITE_DATA === 'undefined') return;
  
  const groups = [
    { id: 'computing', name: 'วิทยาการคำนวณ', icon: '💻', desc: 'แนวคิดเชิงคำนวณ อัลกอริทึม การเขียนโปรแกรม ม.1-ม.6', count: 6 },
    { id: 'design', name: 'การออกแบบและเทคโนโลยี', icon: '🎨', desc: 'กระบวนการออกแบบเชิงวิศวกรรม นวัตกรรม ม.1-ม.6', count: 6 },
    { id: 'computer', name: 'คอมพิวเตอร์', icon: '🖥️', desc: 'พื้นฐานคอมพิวเตอร์ กราฟิก เว็บไซต์ (เพิ่มเติม)', count: 3 }
  ];
  
  container.innerHTML = groups.map(g => `
    <div class="card subject-card fade-in" onclick="window.location.href='subjects.html?group=${g.id}'">
      <div class="card-icon">${g.icon}</div>
      <span class="badge">${g.count} ระดับชั้น</span>
      <h3>${g.name}</h3>
      <p>${g.desc}</p>
      <span class="material-link">ดูรายละเอียด →</span>
    </div>
  `).join('');
  
  initScrollEffects();
}

// ============ Home Page — News ============
function initNews() {
  const container = document.getElementById('news-list');
  if (!container || typeof SITE_DATA === 'undefined') return;
  
  container.innerHTML = SITE_DATA.news.map(n => `
    <div class="card news-card fade-in">
      <div class="news-date">
        <div class="day">${n.date}</div>
        <div class="month">${n.month}</div>
      </div>
      <div class="news-content">
        <h4>${n.title}</h4>
        <p>${n.content}</p>
      </div>
    </div>
  `).join('');
  
  initScrollEffects();
}

// ============ Subjects Page ============
function initSubjects() {
  const container = document.getElementById('subjects-content');
  if (!container || typeof SITE_DATA === 'undefined') return;
  
  // Check URL params for default group
  const params = new URLSearchParams(window.location.search);
  const defaultGroup = params.get('group') || 'all';
  
  // Create tabs
  const tabsHtml = `
    <div class="tabs" id="subject-tabs">
      <button class="tab-btn ${defaultGroup === 'all' ? 'active' : ''}" data-group="all">📚 ทั้งหมด</button>
      <button class="tab-btn ${defaultGroup === 'computing' ? 'active' : ''}" data-group="computing">💻 วิทยาการคำนวณ</button>
      <button class="tab-btn ${defaultGroup === 'design' ? 'active' : ''}" data-group="design">🎨 การออกแบบฯ</button>
      <button class="tab-btn ${defaultGroup === 'computer' ? 'active' : ''}" data-group="computer">🖥️ คอมพิวเตอร์</button>
    </div>
    <div id="subjects-list" class="grid-2 stagger-children"></div>
  `;
  
  container.innerHTML = tabsHtml;
  
  renderSubjects(defaultGroup);
  
  // Tab click
  document.querySelectorAll('#subject-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#subject-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSubjects(btn.dataset.group);
    });
  });
}

function renderSubjects(group) {
  const list = document.getElementById('subjects-list');
  if (!list) return;
  
  const filtered = group === 'all' 
    ? SITE_DATA.subjects 
    : SITE_DATA.subjects.filter(s => s.group === group);
  
  list.innerHTML = filtered.map(s => `
    <div class="subject-detail fade-in" id="subject-${s.id}">
      <div class="subject-detail-header">
        <span style="font-size: 1.5rem;">${s.icon}</span>
        <h3>${s.name}</h3>
        <p style="opacity: 0.9; font-size: 0.85rem;">${s.level} — ${s.description}</p>
      </div>
      <div class="subject-detail-body">
        <div class="topic-list">
          ${s.topics.map((t, i) => `
            <div class="topic-item">
              <span class="topic-number">${i + 1}</span>
              <div>
                <span style="font-weight: 500;">${t}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 1.5rem; text-align: right;">
          <a href="materials.html?subject=${s.id}" class="btn btn-blue" style="font-size: 0.8rem;">📦 สื่อการสอน</a>
        </div>
      </div>
    </div>
  `).join('');
  
  initScrollEffects();
}

// ============ Materials Page ============
function initMaterials() {
  const grid = document.getElementById('materials-grid');
  if (!grid || typeof SITE_DATA === 'undefined') return;
  
  // Check URL params
  const params = new URLSearchParams(window.location.search);
  const defaultSubject = params.get('subject') || 'all';
  
  // Create filters
  const filterContainer = document.getElementById('materials-filters');
  if (filterContainer) {
    // Level filter
    const levels = ['all', 'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6', 'เพิ่มเติม'];
    const types = ['all', 'video', 'pdf', 'quiz', 'slides', 'worksheet', 'game'];
    const typeLabels = { all: '📦 ทั้งหมด', video: '🎬 วิดีโอ', pdf: '📄 เอกสาร', quiz: '📝 แบบทดสอบ', slides: '📊 สไลด์', worksheet: '📋 ใบงาน', game: '🎮 โปรแกรม' };
    
    filterContainer.innerHTML = `
      <div class="filter-bar">
        <div class="filter-group" id="level-filter">
          ${levels.map(l => `<button class="filter-btn ${l === 'all' ? 'active' : ''}" data-level="${l}">${l === 'all' ? '📚 ทุกชั้น' : l}</button>`).join('')}
        </div>
      </div>
      <div class="filter-bar" style="margin-top: -1rem;">
        <div class="filter-group" id="type-filter">
          ${types.map(t => `<button class="filter-btn ${t === 'all' ? 'active' : ''}" data-type="${t}">${typeLabels[t]}</button>`).join('')}
        </div>
      </div>
    `;
    
    // Filter event listeners
    let activeLevel = 'all';
    let activeType = 'all';
    
    // If coming from subjects page
    if (defaultSubject !== 'all') {
      const subjectData = SITE_DATA.subjects.find(s => s.id === defaultSubject);
      if (subjectData) {
        activeLevel = subjectData.level;
        document.querySelectorAll('#level-filter .filter-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.level === activeLevel);
        });
      }
    }
    
    document.querySelectorAll('#level-filter .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#level-filter .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeLevel = btn.dataset.level;
        renderMaterials(grid, activeLevel, activeType);
      });
    });
    
    document.querySelectorAll('#type-filter .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#type-filter .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeType = btn.dataset.type;
        renderMaterials(grid, activeLevel, activeType);
      });
    });
    
    renderMaterials(grid, activeLevel, activeType);
  }
}

function renderMaterials(grid, level, type) {
  let filtered = SITE_DATA.materials;
  
  if (level !== 'all') {
    filtered = filtered.filter(m => m.level === level);
  }
  if (type !== 'all') {
    filtered = filtered.filter(m => m.type === type);
  }
  
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">📭</div>
        <h3>ไม่พบสื่อการสอน</h3>
        <p>ลองเปลี่ยนตัวกรอง หรือดูสื่อทั้งหมด</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = filtered.map(m => `
    <div class="card material-card fade-in" data-level="${m.level}" data-type="${m.type}">
      <span class="material-type ${m.type}">${m.typeLabel}</span>
      <h3 style="font-size: var(--fs-base); margin-bottom: 0.25rem;">${m.title}</h3>
      <p style="font-size: var(--fs-sm); color: var(--text-secondary);">${m.description}</p>
      <div class="material-meta">
        <span>📚 ${m.level}</span>
        <span>•</span>
        <span>${SITE_DATA.subjects.find(s => s.id === m.subject)?.groupName || ''}</span>
      </div>
      <a href="${m.url}" target="_blank" rel="noopener" class="material-link">เปิดดู →</a>
    </div>
  `).join('');
  
  initScrollEffects();
}

// ============ Schedule Page ============
function initSchedule() {
  const tbody = document.getElementById('schedule-body');
  if (!tbody || typeof SITE_DATA === 'undefined') return;
  
  const { periods, timetable } = SITE_DATA.schedule;
  const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
  
  // Update semester text
  const semesterEl = document.getElementById('schedule-semester');
  if (semesterEl) semesterEl.textContent = SITE_DATA.schedule.semester;
  
  periods.forEach((period, idx) => {
    const isBreak = period.num === 'พัก';
    const row = document.createElement('tr');
    
    if (isBreak) {
      row.innerHTML = `
        <td colspan="${days.length + 2}" style="background: var(--gradient-subtle); font-weight: 600; color: var(--primary-500);">
          🍽️ พักกลางวัน (${period.time})
        </td>
      `;
    } else {
      let cells = `
        <td class="period-num">${period.num}</td>
        <td style="font-size: var(--fs-xs); white-space: nowrap;">${period.time}</td>
      `;
      
      days.forEach(day => {
        const data = timetable[day][idx];
        if (data) {
          cells += `
            <td>
              <div class="schedule-cell has-class">
                <div class="subject-name">${data.subject}</div>
                <div class="class-name">${data.class}</div>
              </div>
            </td>
          `;
        } else {
          cells += `<td><div class="schedule-cell">—</div></td>`;
        }
      });
      
      row.innerHTML = cells;
    }
    
    tbody.appendChild(row);
  });
}

// ============ Gallery Page ============
function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid || typeof SITE_DATA === 'undefined') return;
  
  grid.innerHTML = SITE_DATA.gallery.map(item => `
    <div class="gallery-item fade-in" data-id="${item.id}">
      <div class="gallery-placeholder">
        <span class="placeholder-icon">${item.placeholder}</span>
        <span>${item.title}</span>
        <span style="font-size: 0.7rem; opacity: 0.7;">${item.category}</span>
      </div>
      <div class="gallery-overlay">
        <span class="gallery-caption">${item.title}</span>
      </div>
    </div>
  `).join('');
  
  initScrollEffects();
}

// ============ Links Page ============
function initLinks() {
  const container = document.getElementById('links-content');
  if (!container || typeof SITE_DATA === 'undefined') return;
  
  container.innerHTML = SITE_DATA.links.map(cat => `
    <div class="link-category fade-in">
      <h3>${cat.category}</h3>
      <div class="grid-2 stagger-children">
        ${cat.items.map(link => `
          <a href="${link.url}" target="_blank" rel="noopener" class="card link-card fade-in">
            <div class="link-icon">${link.icon}</div>
            <div class="link-info">
              <h4>${link.name}</h4>
              <p>${link.desc}</p>
            </div>
            <span class="link-arrow">→</span>
          </a>
        `).join('')}
      </div>
    </div>
  `).join('');
  
  initScrollEffects();
}

// ============ Contact Form ============
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = form.querySelector('#contact-name').value;
    const email = form.querySelector('#contact-email').value;
    const subject = form.querySelector('#contact-subject').value;
    const message = form.querySelector('#contact-message').value;
    
    if (!name || !email || !message) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    // For now, show success message
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ ส่งข้อความเรียบร้อย!';
    btn.style.background = 'var(--success)';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}
