/* =====================================================
   موقع SHOSHO — سكربت الحب 💖
   كلمة السر: I LOVE YOU
===================================================== */

const PASSWORD = "I LOVE YOU";
const lockScreen = document.getElementById("lock-screen");
const mainSite = document.getElementById("main-site");
const passwordInput = document.getElementById("password-input");
const unlockBtn = document.getElementById("unlock-btn");
const errorMsg = document.getElementById("error-msg");

/* ---------- فتح الموقع بالباسورد ---------- */
function tryUnlock() {
  const value = passwordInput.value.trim().toUpperCase();
  if (value === PASSWORD.toUpperCase()) {
    lockScreen.classList.add("hidden");
    mainSite.classList.remove("hidden");
    startHearts();
    revealOnScroll();
    startCounter();
    if (currentDateStored) updateCounter();
    // انفجار قلوب احتفال 🎉
    burstHearts();
  } else {
    errorMsg.classList.remove("hidden");
    passwordInput.value = "";
    passwordInput.classList.add("shake");
    passwordInput.focus();
    setTimeout(() => passwordInput.classList.remove("shake"), 500);
  }
}

unlockBtn.addEventListener("click", tryUnlock);
passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
  if (e.key === "Enter") e.preventDefault();
});

/* ---------- قلوب عند الغلط (اهتزاز) ---------- */
const styleShake = document.createElement("style");
styleShake.textContent = `
  .shake { animation: shake 0.45s ease; }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-7px); }
    80% { transform: translateX(7px); }
  }
`;
document.head.appendChild(styleShake);

/* ---------- إضافة أماكن صور زيادة ---------- */
const addSlotBtn = document.getElementById("add-slot-btn");
let slotCount = 6;
const captions = [
  "لحظة من أحلى اللحظات 🌸",
  "عيونك أجمل حاجة 🌙",
  "معاكي الدنيا حلوة 🍭",
  "حكايتنا لسه بتبدأ 📖",
  "قلبي معاكي في أي مكان 💓",
  "حبيبتي شوشو الوحيدة 👑",
  "أجمل أيام عمري معاكي 💕",
  "أنتي كل حاجة ✨",
  "ضحكنا ومش هنوقف 😄",
  "نصي التاني دايمًا 🤝",
];

addSlotBtn.addEventListener("click", () => {
  slotCount++;
  const title = captions[(slotCount - 1) % captions.length];
  const grid = document.querySelector(".photo-grid");
  const slot = document.createElement("div");
  slot.className = "photo-slot";
  slot.innerHTML = `
    <img src="photos/photo-${slotCount}.jpg" alt="صورة لنا ${slotCount}" class="photo-img" />
    <div class="photo-placeholder">🖼️ <span>صورة رقم ${slotCount}</span><small>حطّي صورتنا هنا</small></div>
    <p class="photo-caption">${title}</p>
  `;
  grid.appendChild(slot);
  attachPhotoLoader(slot);
});

/* ---------- تحميل الصور تلقائيًا لو موجودة ---------- */
function attachPhotoLoader(slot) {
  const img = slot.querySelector("img");
  if (!img) return;
  if (img.complete && img.naturalWidth > 0) {
    slot.classList.add("loaded");
  } else {
    img.addEventListener("load", () => slot.classList.add("loaded"));
    img.addEventListener("error", () => { /* مفيش صورة، نسيب البلاس هولدر */ });
  }
}

document.querySelectorAll(".photo-slot").forEach(attachPhotoLoader);

/* ---------- تأثير الظهور عند السكرول ---------- */
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => observer.observe(el));
}

/* ---------- عداد الوقت من أول يوم ---------- */
const dateInput = document.getElementById("start-date");
let currentDateStored = false;

// لو حبيتِ تخلي العداد يشتغل: اختاري التاريخ من الموقع
const savedDate = localStorage.getItem("loveStartDate");
if (savedDate) {
  dateInput.value = savedDate;
  currentDateStored = true;
}

dateInput.addEventListener("change", () => {
  if (dateInput.value) {
    localStorage.setItem("loveStartDate", dateInput.value);
    currentDateStored = true;
    updateCounter();
  }
});

function updateCounter() {
  const start = new Date(dateInput.value + "T00:00:00");
  const now = new Date();
  let diff = now - start;
  if (diff < 0) diff = 0;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}

function startCounter() {
  if (currentDateStored) {
    updateCounter();
    setInterval(updateCounter, 1000);
  }
}

/* ---------- خلفية قلوب متحركة (Canvas) ---------- */
const canvas = document.getElementById("hearts-canvas");
const ctx = canvas.getContext("2d");
let hearts = [];
let heartsRunning = false;

function sizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", sizeCanvas);

function makeHeart() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + 20,
    size: Math.random() * 22 + 8,
    speed: Math.random() * 1.6 + 0.6,
    sway: Math.random() * Math.PI * 2,
    color: ["#e91e63", "#ff4081", "#ff80ab", "#ad1457", "#f06292"][Math.floor(Math.random() * 5)],
    alpha: Math.random() * 0.5 + 0.3,
  };
}

function drawHeartPath(x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 3);
  ctx.bezierCurveTo(x - size / 2, y + (size / 3) * 1.6, x, y + size / 2, x, y + size / 1.8);
  ctx.bezierCurveTo(x, y + size / 2, x + size / 2, y + (size / 3) * 1.6, x + size / 2, y + size / 3);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
  ctx.closePath();
}

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach((h, i) => {
    h.y -= h.speed;
    h.sway += 0.02;
    const x = h.x + Math.sin(h.sway) * 18;
    ctx.globalAlpha = h.alpha;
    ctx.fillStyle = h.color;
    drawHeartPath(x, h.y, h.size);
    ctx.fill();
    if (h.y < -60) hearts[i] = makeHeart();
  });
  requestAnimationFrame(animateHearts);
}

function startHearts() {
  if (heartsRunning) return;
  heartsRunning = true;
  sizeCanvas();
  hearts = Array.from({ length: 26 }, () => makeHeart());
  animateHearts();
}

/* ---------- انفجار قلوب عند فتح القفل ---------- */
function burstHearts() {
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.textContent = ["💖", "💕", "💗", "❤️", "💘", "💝"][Math.floor(Math.random() * 6)];
      heart.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        font-size: ${Math.random() * 30 + 16}px;
        z-index: 9999;
        pointer-events: none;
        animation: burst-heart 1.2s ease-out forwards;
        transition: none;
      `;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1300);
    }, Math.random() * 300);
  }
}

const burstStyle = document.createElement("style");
burstStyle.textContent = `
  @keyframes burst-heart {
    0% { transform: scale(0) translateY(0); opacity: 1; }
    60% { transform: scale(1.6) translateY(-40px); opacity: 1; }
    100% { transform: scale(1) translateY(-90px); opacity: 0; }
  }
`;
document.head.appendChild(burstStyle);

/* ---------- زر الموسيقى (حط أغنية في photos/love-song.mp3) ---------- */
const musicToggle = document.getElementById("music-toggle");
const song = document.getElementById("love-song");
let playing = false;

musicToggle.addEventListener("click", () => {
  if (song.src && !song.src.endsWith("undefined")) {
    if (playing) {
      song.pause();
      musicToggle.textContent = "🎵 شغلي الموسيقى";
    } else {
      song.play().catch(() => {
        musicToggle.textContent = "🎵 (ضيفي أغنية أولًا)";
      });
      musicToggle.textContent = "⏸️ وقفي الموسيقى";
    }
    playing = !playing;
  } else {
    musicToggle.textContent = "🎵 (ضيفي أغنية أولًا)";
  }
});

/* رسالة ترحيب صغيرة */
console.log("%c💖 تم فتح الموقع يا شوشو — I LOVE YOU 💖", "color:#e91e63;font-size:20px;font-weight:bold;");
