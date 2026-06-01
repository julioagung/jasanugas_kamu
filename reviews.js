// ============================================================
// FIREBASE REVIEW SYSTEM — jasanugas_kamu
// ============================================================
// SETUP: Ganti nilai di bawah dengan config Firebase kamu.
// Cara dapat config:
//   1. Buka https://console.firebase.google.com
//   2. Buat project baru → tambah Web App
//   3. Copy firebaseConfig yang diberikan ke sini
//   4. Di Firestore → Rules, set:
//      allow read: if true;
//      allow create: if request.resource.data.name is string
//                    && request.resource.data.text is string
//                    && request.resource.data.rating is number;
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, query,
  orderBy, limit, startAfter, getDocs,
  serverTimestamp, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── GANTI INI DENGAN CONFIG FIREBASE KAMU ──────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyBxczxyOfpu0J0SB--eC2_5yV6J7qSYqaQ",
  authDomain:        "Gjasanugas-d3232.firebaseapp.com",
  projectId:         "jasanugas-d3232",
  storageBucket:     "jasanugas-d3232.firebasestorage.app",
  messagingSenderId: "260827422214",
  appId:             "G-C18JVGJBLQ"
};
// ───────────────────────────────────────────────────────────

const PAGE_SIZE = 6;
const RATE_LIMIT_MS = 60 * 60 * 1000; // 1 jam per sesi

let app, db;
let lastDoc = null;
let allReviews = [];
let selectedRating = 0;

const starLabels = ["", "Sangat Buruk", "Buruk", "Cukup", "Bagus", "Sangat Bagus!"];

// ── INIT ────────────────────────────────────────────────────
function isConfigured() {
  return firebaseConfig.apiKey !== "GANTI_API_KEY";
}

function initFirebase() {
  if (!isConfigured()) {
    showConfigWarning();
    return false;
  }
  try {
    app = initializeApp(firebaseConfig);
    db  = getFirestore(app);
    return true;
  } catch (e) {
    console.error("Firebase init error:", e);
    showConfigWarning();
    return false;
  }
}

function showConfigWarning() {
  const list = document.getElementById("reviewsList");
  const summary = document.getElementById("ratingSummary");
  const loading = document.getElementById("reviewsLoading");
  if (loading) loading.hidden = true;
  if (summary) summary.innerHTML = `
    <div class="config-warning">
      <span>⚙️</span>
      <strong>Firebase belum dikonfigurasi</strong>
      <p>Buka file <code>reviews.js</code> dan isi <code>firebaseConfig</code> dengan data project Firebase kamu.</p>
      <a href="https://console.firebase.google.com" target="_blank">Buka Firebase Console →</a>
    </div>`;
  if (list) list.innerHTML = "";
}

// ── STAR PICKER ─────────────────────────────────────────────
function initStarPicker() {
  const picker = document.getElementById("starPicker");
  const label  = document.getElementById("starLabel");
  if (!picker) return;

  picker.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("mouseenter", () => highlightStars(+btn.dataset.val));
    btn.addEventListener("mouseleave", () => highlightStars(selectedRating));
    btn.addEventListener("click", () => {
      selectedRating = +btn.dataset.val;
      highlightStars(selectedRating);
      label.textContent = starLabels[selectedRating];
    });
  });
}

function highlightStars(val) {
  document.querySelectorAll("#starPicker button").forEach(btn => {
    btn.classList.toggle("active", +btn.dataset.val <= val);
  });
}

// ── CHAR COUNTER ─────────────────────────────────────────────
function initCharCounter() {
  const ta = document.getElementById("reviewText");
  const cc = document.getElementById("charCount");
  if (!ta || !cc) return;
  ta.addEventListener("input", () => {
    cc.textContent = `${ta.value.length} / 500`;
    cc.style.color = ta.value.length > 450 ? "#ef4444" : "";
  });
}

// ── RATE LIMIT ───────────────────────────────────────────────
function canSubmit() {
  const last = localStorage.getItem("jk_last_review");
  if (!last) return true;
  return Date.now() - parseInt(last) > RATE_LIMIT_MS;
}

function markSubmitted() {
  localStorage.setItem("jk_last_review", Date.now().toString());
}

// ── SANITIZE ─────────────────────────────────────────────────
function sanitize(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML.trim();
}

// ── SUBMIT FORM ──────────────────────────────────────────────
async function handleSubmit(e) {
  e.preventDefault();
  const errEl   = document.getElementById("formError");
  const success = document.getElementById("formSuccess");
  const btn     = document.getElementById("submitBtn");
  const spinner = document.getElementById("submitSpinner");
  const btnText = document.getElementById("submitText");

  // Pastikan Firebase sudah siap
  if (!db) {
    errEl.textContent = "Sistem belum dikonfigurasi. Hubungi admin.";
    errEl.hidden = false;
    return;
  }

  errEl.hidden = true;
  success.hidden = true;

  const name   = document.getElementById("reviewName").value.trim();
  const univ   = document.getElementById("reviewUniv").value.trim();
  const text   = document.getElementById("reviewText").value.trim();
  const rating = selectedRating;

  // Validasi
  if (!name) return showError(errEl, "Nama tidak boleh kosong.");
  if (name.length < 2) return showError(errEl, "Nama terlalu pendek.");
  if (!rating) return showError(errEl, "Pilih rating bintang terlebih dahulu.");
  if (!text) return showError(errEl, "Komentar tidak boleh kosong.");
  if (text.length < 10) return showError(errEl, "Komentar terlalu pendek (minimal 10 karakter).");

  // Rate limit
  if (!canSubmit()) {
    const last = parseInt(localStorage.getItem("jk_last_review"));
    const minsLeft = Math.ceil((RATE_LIMIT_MS - (Date.now() - last)) / 60000);
    return showError(errEl, `Kamu sudah mengirim ulasan. Coba lagi dalam ${minsLeft} menit.`);
  }

  // Submit
  btn.disabled = true;
  btnText.hidden = true;
  spinner.hidden = false;

  try {
    await addDoc(collection(db, "reviews"), {
      name:      sanitize(name),
      univ:      sanitize(univ),
      text:      sanitize(text),
      rating,
      createdAt: serverTimestamp()
    });
    markSubmitted();
    document.getElementById("reviewForm").reset();
    selectedRating = 0;
    highlightStars(0);
    document.getElementById("starLabel").textContent = "Pilih rating";
    document.getElementById("charCount").textContent = "0 / 500";
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (err) {
    console.error(err);
    showError(errEl, "Gagal mengirim ulasan. Coba lagi.");
  } finally {
    btn.disabled = false;
    btnText.hidden = false;
    spinner.hidden = true;
  }
}

function showError(el, msg) {
  el.textContent = msg;
  el.hidden = false;
}

// ── RENDER REVIEW CARD ───────────────────────────────────────
function renderCard(data) {
  const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);
  const initial = (data.name || "?")[0].toUpperCase();
  const date = data.createdAt?.toDate
    ? data.createdAt.toDate().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "Baru saja";

  const card = document.createElement("div");
  card.className = "testi-card live-review";
  card.innerHTML = `
    <div class="testi-stars" style="color:${data.rating >= 4 ? '#f59e0b' : data.rating === 3 ? '#94a3b8' : '#ef4444'}">${stars}</div>
    <p>"${data.text}"</p>
    <div class="testi-author">
      <div class="testi-avatar">${initial}</div>
      <div>
        <strong>${data.name}</strong>
        <span>${data.univ || "Anonim"}</span>
      </div>
      <time class="review-date">${date}</time>
    </div>`;
  return card;
}

// ── LOAD REVIEWS ─────────────────────────────────────────────
async function loadReviews(isLoadMore = false) {
  if (!db) return;
  const list    = document.getElementById("reviewsList");
  const loading = document.getElementById("reviewsLoading");
  const moreBtn = document.getElementById("loadMoreWrap");

  if (!isLoadMore) {
    loading.hidden = false;
    list.innerHTML = "";
    list.appendChild(loading);
    allReviews = [];
    lastDoc = null;
  }

  try {
    let q = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE)
    );
    if (lastDoc) q = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE)
    );

    const snap = await getDocs(q);
    loading.hidden = true;

    if (snap.empty && !isLoadMore) {
      list.innerHTML = `<p class="no-reviews">Belum ada ulasan. Jadilah yang pertama!</p>`;
      moreBtn.hidden = true;
      return;
    }

    const grid = isLoadMore
      ? list.querySelector(".reviews-grid")
      : (() => { const g = document.createElement("div"); g.className = "reviews-grid"; list.appendChild(g); return g; })();

    snap.forEach(doc => {
      const data = doc.data();
      allReviews.push(data);
      grid.appendChild(renderCard(data));
      lastDoc = doc;
    });

    moreBtn.hidden = snap.size < PAGE_SIZE;
    updateSummary();
  } catch (err) {
    console.error(err);
    loading.hidden = true;
    list.innerHTML = `<p class="no-reviews">Gagal memuat ulasan.</p>`;
  }
}

// ── LIVE LISTENER (untuk review baru masuk real-time) ────────
function listenNewReviews() {
  if (!db) return;
  const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(1));
  onSnapshot(q, snap => {
    snap.docChanges().forEach(change => {
      if (change.type === "added") {
        const data = change.doc.data();
        // Cek apakah sudah ada di list (hindari duplikat saat load awal)
        const grid = document.querySelector(".reviews-grid");
        if (!grid) return;
        // Hanya tambahkan jika ini benar-benar baru (ada timestamp)
        if (!data.createdAt) return;
        const existing = allReviews.find(r =>
          r.name === data.name && r.text === data.text
        );
        if (!existing) {
          allReviews.unshift(data);
          const card = renderCard(data);
          card.classList.add("review-new");
          grid.prepend(card);
          updateSummary();
        }
      }
    });
  });
}

// ── RATING SUMMARY ───────────────────────────────────────────
function updateSummary() {
  if (!allReviews.length) return;
  const counts = [0, 0, 0, 0, 0, 0]; // index 1-5
  allReviews.forEach(r => { if (r.rating >= 1 && r.rating <= 5) counts[r.rating]++; });
  const total = allReviews.length;
  const sum   = counts.reduce((a, v, i) => a + v * i, 0);
  const avg   = (sum / total).toFixed(1);

  document.getElementById("avgRating").textContent = avg;
  document.getElementById("reviewCount").textContent = `${total} ulasan`;
  document.getElementById("avgStars").innerHTML =
    Array.from({ length: 5 }, (_, i) =>
      `<span style="color:${i < Math.round(avg) ? '#f59e0b' : '#e2e8f0'}">★</span>`
    ).join("");

  for (let i = 1; i <= 5; i++) {
    const pct = total ? (counts[i] / total) * 100 : 0;
    const bar = document.getElementById(`bar${i}`);
    const cnt = document.getElementById(`cnt${i}`);
    if (bar) bar.style.width = pct + "%";
    if (cnt) cnt.textContent = counts[i];
  }
}

// ── BOOT ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initStarPicker();
  initCharCounter();

  if (!initFirebase()) return;

  loadReviews();
  listenNewReviews();

  document.getElementById("reviewForm")?.addEventListener("submit", handleSubmit);
  document.getElementById("loadMoreBtn")?.addEventListener("click", () => loadReviews(true));
});
