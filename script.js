// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('[data-aos]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.querySelectorAll('[data-aos]')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ===== SMOOTH ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 100) current = sec.id; });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

// ===== WORKER IMAGE FALLBACK =====
const workerEmojis = { owl: '🦉', raven: '🐦‍⬛', ant: '🐜', bee: '🐝', eagle: '🦅' };
document.querySelectorAll('.wk-img').forEach(img => {
  img.addEventListener('error', () => {
    const name = img.alt.toLowerCase();
    const wrap = img.closest('.wk-img-wrap');
    img.style.display = 'none';
    const ph = document.createElement('div');
    ph.className = 'wk-img-fallback';
    ph.textContent = workerEmojis[name] || '👤';
    wrap.prepend(ph);
  });
});

// ===== WORKER DATA =====
const workerData = {
  owl: {
    name: 'Owl',
    role: 'Admin & All Role',
    badge: 'Ahli',
    badgeClass: 'badge-gold',
    emoji: '🦉',
    tagline: '"Aktif saat dunia tidur."',
    bio: 'Dikenal sebagai burung hantu karena jam kerjanya yang melampaui tengah malam, Owl adalah tulang punggung tim sekaligus admin utama jasanugas_kamu. Dengan kemampuan yang luas di berbagai bidang, Owl bisa menangani hampir semua jenis tugas — dari riset akademik mendalam hingga pengembangan web dan editing video.',
    stats: [
      { label: 'Tugas Selesai', value: '200+' },
      { label: 'Jam Kerja / Minggu', value: '60+' },
      { label: 'Kepuasan Klien', value: '99%' },
    ],
    expertise: [
      { icon: '📝', title: 'Riset & Penulisan Ilmiah', desc: 'Makalah, skripsi, tinjauan pustaka, laporan penelitian dengan referensi lengkap.' },
      { icon: '💻', title: 'Web Development', desc: 'Frontend development, HTML/CSS/JS, framework modern, dan tugas pemrograman web.' },
      { icon: '🎬', title: 'Video Editing', desc: 'Editing video tugas, konten, dokumentasi, dan presentasi dengan hasil profesional.' },
      { icon: '⚙️', title: 'Manajemen Tim', desc: 'Koordinasi pengerjaan, quality control, dan memastikan semua tugas selesai tepat waktu.' },
    ],
    skills: ['Analisis', 'Penulisan', 'Web Dev', 'Video Editing', 'Frontend', 'Riset', 'Admin'],
    wa: 'Halo%20Owl%2C%20saya%20mau%20konsultasi%20tugas'
  },
  raven: {
    name: 'Raven',
    role: 'All Role',
    badge: 'Pro',
    badgeClass: 'badge-blue',
    emoji: '🐦‍⬛',
    tagline: '"Logika tajam, hasil presisi."',
    bio: 'Raven adalah sosok multitalenta dengan kemampuan analitis yang kuat. Seperti burung gagak yang cerdas, Raven mampu memecahkan masalah kompleks — dari karya ilmiah yang membutuhkan argumen mendalam, hingga logika pemrograman yang rumit, animasi, dan pengembangan backend.',
    stats: [
      { label: 'Tugas Selesai', value: '150+' },
      { label: 'Bahasa Pemrograman', value: '5+' },
      { label: 'Kepuasan Klien', value: '98%' },
    ],
    expertise: [
      { icon: '📚', title: 'Karya Ilmiah', desc: 'Esai, makalah, dan tulisan akademik dengan argumen yang terstruktur dan referensi valid.' },
      { icon: '🖥️', title: 'Backend Development', desc: 'Pengembangan server-side, API, database, dan logika aplikasi yang kompleks.' },
      { icon: '✨', title: 'Animasi', desc: 'Pembuatan animasi 2D, motion graphic, dan konten visual yang menarik.' },
      { icon: '🗄️', title: 'Database', desc: 'Desain dan manajemen database, query SQL, dan optimasi performa data.' },
    ],
    skills: ['Esai', 'Copywriting', 'Web Dev', 'Database', 'Animation', 'Backend'],
    wa: 'Halo%20Raven%2C%20saya%20mau%20konsultasi%20tugas'
  },
  ant: {
    name: 'Ant',
    role: 'All Role',
    badge: 'Pro',
    badgeClass: 'badge-blue',
    emoji: '🐜',
    tagline: '"Kecil tapi tidak ada yang terlewat."',
    bio: 'Jangan remehkan ukurannya — Ant adalah pekerja paling teliti di tim. Dengan keahlian di bidang statistik, animasi, dan fullstack development, Ant mampu menangani tugas dengan detail yang sangat presisi. Tidak ada angka yang salah, tidak ada baris kode yang terlewat.',
    stats: [
      { label: 'Tugas Selesai', value: '130+' },
      { label: 'Tools Dikuasai', value: '8+' },
      { label: 'Kepuasan Klien', value: '97%' },
    ],
    expertise: [
      { icon: '📊', title: 'Analisis Statistik', desc: 'Pengolahan data SPSS, Excel, interpretasi hasil uji, dan laporan penelitian kuantitatif.' },
      { icon: '✨', title: 'Animasi', desc: 'Animasi 2D, whiteboard animation, dan motion graphic untuk presentasi atau konten.' },
      { icon: '🌐', title: 'Fullstack Development', desc: 'Pengembangan aplikasi web dari frontend hingga backend secara menyeluruh.' },
      { icon: '📋', title: 'Laporan Penelitian', desc: 'Penyusunan laporan kualitatif dan kuantitatif yang sistematis dan mudah dipahami.' },
    ],
    skills: ['Statistik', 'Excel', 'SPSS', 'Animation', 'Fullstack', 'Python', 'R'],
    wa: 'Halo%20Ant%2C%20saya%20mau%20konsultasi%20tugas'
  },
  bee: {
    name: 'Bee',
    role: 'Journal Specialist',
    badge: 'Specialist',
    badgeClass: 'badge-purple',
    emoji: '🐝',
    tagline: '"Rajin mengumpulkan referensi terbaik."',
    bio: 'Bee adalah spesialis jurnal dan artikel ilmiah di tim. Seperti lebah yang rajin mengumpulkan sari bunga, Bee tekun mencari dan mengolah referensi jurnal dari berbagai sumber terpercaya. Keahliannya dalam penulisan akademik dan analisis data menjadikannya andalan untuk tugas-tugas publikasi ilmiah.',
    stats: [
      { label: 'Jurnal Dikerjakan', value: '80+' },
      { label: 'Database Jurnal', value: '10+' },
      { label: 'Kepuasan Klien', value: '99%' },
    ],
    expertise: [
      { icon: '📰', title: 'Penulisan Jurnal', desc: 'Artikel ilmiah, jurnal penelitian, dan paper akademik sesuai standar publikasi.' },
      { icon: '🔍', title: 'Riset Referensi', desc: 'Pencarian referensi dari Scopus, Google Scholar, dan database jurnal internasional.' },
      { icon: '📈', title: 'Analisis Data Jurnal', desc: 'Pengolahan dan interpretasi data statistik untuk mendukung argumen penelitian.' },
      { icon: '✏️', title: 'Proofreading & Editing', desc: 'Penyuntingan tulisan ilmiah agar sesuai kaidah bahasa dan format jurnal.' },
    ],
    skills: ['Journal', 'Article', 'Writing', 'Referensi', 'Proofreading', 'Statistik'],
    wa: 'Halo%20Bee%2C%20saya%20mau%20konsultasi%20tugas%20jurnal'
  },
  eagle: {
    name: 'Eagle',
    role: 'Design Specialist',
    badge: 'Specialist',
    badgeClass: 'badge-purple',
    emoji: '🦅',
    tagline: '"Mata tajam untuk detail visual."',
    bio: 'Eagle melihat apa yang orang lain lewatkan. Dengan mata elang untuk estetika dan detail, Eagle mengerjakan semua kebutuhan desain — dari PowerPoint yang memukau, desain grafis, hingga layout jurnal yang rapi. Setiap piksel diperhatikan, setiap warna dipilih dengan cermat.',
    stats: [
      { label: 'Desain Selesai', value: '120+' },
      { label: 'Tools Desain', value: '6+' },
      { label: 'Kepuasan Klien', value: '100%' },
    ],
    expertise: [
      { icon: '🎨', title: 'Desain Grafis', desc: 'Poster, infografis, banner, dan materi visual untuk keperluan akademik maupun umum.' },
      { icon: '📊', title: 'PowerPoint Premium', desc: 'Slide presentasi profesional dengan animasi, layout modern, dan visual yang konsisten.' },
      { icon: '🖼️', title: 'Layout & Tata Letak', desc: 'Pengaturan layout dokumen, jurnal, dan laporan agar terlihat rapi dan profesional.' },
      { icon: '🌐', title: 'UI Design', desc: 'Desain antarmuka aplikasi dan website dengan pendekatan modern dan user-friendly.' },
    ],
    skills: ['Graphic Design', 'UI/UX', 'PowerPoint', 'Journal Layout', 'Illustrator', 'Figma'],
    wa: 'Halo%20Eagle%2C%20saya%20mau%20konsultasi%20tugas%20desain'
  }
};

// ===== WORKER MODAL =====
const backdrop = document.getElementById('wkBackdrop');
const modal    = document.getElementById('wkModal');
const modalInner = document.getElementById('wkModalInner');
const closeBtn = document.getElementById('wkModalClose');

function buildModal(key) {
  const d = workerData[key];
  if (!d) return;

  const statsHtml = d.stats.map(s => `
    <div class="wm-stat">
      <span class="wm-stat-val">${s.value}</span>
      <span class="wm-stat-label">${s.label}</span>
    </div>`).join('');

  const expertiseHtml = d.expertise.map(e => `
    <div class="wm-exp-card">
      <span class="wm-exp-icon">${e.icon}</span>
      <div>
        <strong>${e.title}</strong>
        <p>${e.desc}</p>
      </div>
    </div>`).join('');

  const skillsHtml = d.skills.map(s => `<span>${s}</span>`).join('');

  modalInner.innerHTML = `
    <div class="wm-hero">
      <div class="wm-img-wrap">
        <img src="public/image/workers/${key}.png" alt="${d.name}"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
        <div class="wm-img-fallback" style="display:none">${d.emoji}</div>
      </div>
      <div class="wm-hero-info">
        <span class="wk-badge ${d.badgeClass}">${d.badge}</span>
        <h2 id="wkModalName">${d.name}</h2>
        <span class="wm-role">${d.role}</span>
        <em class="wm-tagline">${d.tagline}</em>
        <div class="wm-stats">${statsHtml}</div>
      </div>
    </div>
    <div class="wm-bio">
      <h4>Tentang ${d.name}</h4>
      <p>${d.bio}</p>
    </div>
    <div class="wm-expertise">
      <h4>Keahlian Utama</h4>
      <div class="wm-exp-grid">${expertiseHtml}</div>
    </div>
    <div class="wm-skills-wrap">
      <h4>Skills</h4>
      <div class="wm-skills">${skillsHtml}</div>
    </div>
    <a href="https://wa.me/62895329361249?text=${d.wa}" target="_blank" class="wm-cta">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.5l5.797-1.522A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.49-5.19-1.348l-.372-.22-3.44.903.918-3.352-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
      Hubungi ${d.name} via WhatsApp
    </a>`;
}

function openModal(key) {
  buildModal(key);
  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // scroll modal to top
  setTimeout(() => { modal.scrollTop = 0; }, 10);
}

function closeModal() {
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Attach card clicks
document.querySelectorAll('.wk-card').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.worker));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(card.dataset.worker); });
});

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
