// ===== helpers =====
const root = document.documentElement;

function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 2400);
}

// ===== year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== theme toggle (saved) =====
const saved = localStorage.getItem("theme");
if (saved) root.setAttribute("data-theme", saved);

document.getElementById("themeBtn").addEventListener("click", ()=>{
  const now = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", now);
  localStorage.setItem("theme", now);
});

// ===== mobile menu =====
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", ()=> menu.classList.toggle("show"));
menu.querySelectorAll("a").forEach(a=>{
  a.addEventListener("click", ()=> menu.classList.remove("show"));
});

// ===== typing effect =====
const typingEl = document.getElementById("typing");
const phrases = [
  "Fokus di Web Developer",
  "Suka Proyek CRUD MySQL",
  "Belajar OOP (Java/Python)",
  "UI Modern & Responsive"
];

let pi = 0, ci = 0, deleting = false;

function typeLoop(){
  const current = phrases[pi];
  typingEl.textContent = current.slice(0, ci);

  if (!deleting) {
    ci++;
    if (ci > current.length + 8) deleting = true; // pause a bit
  } else {
    ci--;
    if (ci <= 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
  }

  const speed = deleting ? 35 : 55;
  setTimeout(typeLoop, speed);
}
typeLoop();

// ===== scroll reveal + animate skill bars =====
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("show");
      e.target.querySelectorAll("[data-bar]").forEach(el=>{
        el.style.width = el.getAttribute("data-bar") + "%";
      });
      io.unobserve(e.target);
    }
  });
},{threshold:.15});

document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

// ===== filter projects =====
const filters = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll(".project[data-tag]");

filters.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    filters.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

    const tag = btn.getAttribute("data-filter");
    cards.forEach(c=>{
      const t = c.getAttribute("data-tag");
      c.style.display = (tag === "All" || tag === t) ? "" : "none";
    });
  });
});

// ===== modal detail project =====
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

const modalContent = {
  penjualan: {
    title: "Sistem Informasi Penjualan",
    body: `
      <ul>
        <li>Fitur: CRUD produk, pelanggan, transaksi.</li>
        <li>Pencarian + validasi input.</li>
        <li>Laporan sederhana (harian/bulanan).</li>
      </ul>
    `
  },
  perkantoran: {
    title: "Aplikasi Sistem Informasi Perkantoran",
    body: `
      <ul>
        <li>Kelola: pegawai, inventaris, surat masuk, jadwal rapat.</li>
        <li>Tampilan desktop rapi dan mudah digunakan.</li>
      </ul>
    `
  },
  kelontong: {
    title: "Aplikasi Toko Kelontong (Java OOP)",
    body: `
      <ul>
        <li>Menu: sembako, sayur, buah, pulsa/e-wallet.</li>
        <li>Menerapkan OOP: class, inheritance, polymorphism, error handling.</li>
      </ul>
    `
  },
  buku: {
    title: "Website CRUD Master Buku",
    body: `
      <ul>
        <li>Combobox dinamis: kategori, pengarang, penerbit.</li>
        <li>Fitur pencarian data real-time.</li>
      </ul>
    `
  },
  design: {
    title: "UI Design Landing Page",
    body: `
      <ul>
        <li>Desain modern, grid-based, responsive.</li>
        <li>Cocok untuk profil bisnis / personal brand.</li>
      </ul>
    `
  }
};

document.querySelectorAll("[data-modal]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const key = btn.getAttribute("data-modal");
    const item = modalContent[key];
    modalTitle.textContent = item?.title || "Detail Project";
    modalBody.innerHTML = item?.body || "Tidak ada detail.";
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  });
});

function hideModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}
closeModal.addEventListener("click", hideModal);
modal.addEventListener("click", (e)=>{ if(e.target === modal) hideModal(); });
document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") hideModal(); });

// ===== contact form (mailto + whatsapp) =====
const CONTACT_EMAIL = "emailkamu@domain.com";
const WA_NUMBER = "62812xxxxxxx";

const form = document.getElementById("contactForm");
const waBtn = document.getElementById("waBtn");

form.addEventListener("submit", (e)=>{
  e.preventDefault();
  const fd = new FormData(form);
  const name = fd.get("name");
  const email = fd.get("email");
  const message = fd.get("message");

  const subject = encodeURIComponent("Pesan Portofolio dari " + name);
  const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`);

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  toast("Membuka Email… ✅");
});

waBtn.addEventListener("click", ()=>{
  const fd = new FormData(form);
  const name = fd.get("name") || "";
  const email = fd.get("email") || "";
  const message = fd.get("message") || "";

  const text = encodeURIComponent(`Halo, saya ${name} (${email}).\n\n${message}`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
  toast("Membuka WhatsApp… ✅");
});
