/* ================= WHATSAPP =================
   Semua kategori sekarang masuk ke nomor yang sama (WA_DEFAULT).
   Mau pisah nomor per kategori? Isi "number" di kategori itu,
   misalnya number: "62812xxxxxxx". Kosongkan untuk pakai WA_DEFAULT. */
const WA_DEFAULT = "6282111947584";
const CHAT = {
  event: {
    number: "",
    text: "Halo Didalam Potret! 👋\nSaya mau sewa photobooth untuk *private event*.\n\nJenis acara:\nTanggal:\nLokasi:\nJumlah tamu:\nPaket yang diminati:"
  },
  partner: {
    number: "",
    text: "Halo Didalam Potret! 👋\nSaya tertarik untuk *kerja sama / partnership*.\n\nNama brand / instansi:\nBentuk kolaborasi:\nTanggal / periode:"
  },
  admin: {
    number: "",
    text: "Halo Didalam Potret! 👋\nSaya mau tanya-tanya dulu ke admin."
  },
  package: {
    number: "",
    text: (nama) => `Halo Didalam Potret! 👋\nSaya mau tanya ketersediaan jadwal untuk *Paket ${nama}*.\n\nTanggal acara:\nLokasi:`
  }
};
const $ = (id) => document.getElementById(id);
function waLink(key, arg) {
  const c = CHAT[key] || CHAT.admin;
  const text = typeof c.text === "function" ? c.text(arg) : c.text;
  return `https://wa.me/${c.number || WA_DEFAULT}?text=${encodeURIComponent(text)}`;
}

/* ---- Properti: strip foto, polaroid, selotip, paperclip ---- */
const CLIP = '<svg class="clip" viewBox="0 0 18 42" aria-hidden="true"><path d="M5 30V9a4 4 0 0 1 8 0v24a6 6 0 0 1-12 0V12"/></svg>';
function loadImg(box, srcs) {
  const im = new Image(); let i = 0;
  im.alt = "";
  im.onerror = () => { i++; if (i < srcs.length) im.src = srcs[i]; else im.remove(); };
  im.src = srcs[0];
  box.appendChild(im);
}
function makeStrip(src, pal, w) {
  const s = document.createElement("div");
  s.className = "strip " + pal;
  s.style.setProperty("--w", w + "px");
  for (let i = 0; i < 4; i++) { const d = document.createElement("i"); d.className = "slot"; s.appendChild(d); }
  if (src) loadImg(s, [src]);
  return s;
}
function stripProp(o) {
  const d = document.createElement("div");
  d.className = "prop strip-prop";
  d.style.cssText = `left:${o.l}%; top:${o.t}px; --r:${o.r}deg;`;
  if (o.deco === "tape") d.insertAdjacentHTML("beforeend", `<span class="tape ${o.tape || ""}"></span>`);
  if (o.deco === "clip") d.insertAdjacentHTML("beforeend", CLIP);
  d.appendChild(makeStrip(o.src, o.pal, o.w));
  return d;
}
function polaProp(o) {
  const d = document.createElement("div");
  d.className = "prop pola";
  d.style.cssText = `left:${o.center ? `calc(50% - ${o.w / 2}px)` : o.l + "%"}; top:${o.t}px; width:${o.w}px; --r:${o.r}deg;`;
  d.innerHTML = `<div class="ph"><i class="sil"></i></div><span class="cap">${o.cap}</span>`;
  if (o.deco === "tape") d.insertAdjacentHTML("afterbegin", `<span class="tape ${o.tape || ""}"></span>`);
  if (o.deco === "clip") d.insertAdjacentHTML("beforeend", CLIP);
  loadImg(d.querySelector(".ph"), o.srcs);
  return d;
}

/* ---- Hero: satu foto di tengah (taruh foto pilihanmu di img/header.jpg) ---- */
$("collage").appendChild(polaProp({
  center: true, t: 18, w: 232, r: -3, cap: "capture your best vibe",
  srcs: ["img/header.jpg", "img/photo-1.jpg", "img/strip-1.jpg"], deco: "tape", tape: "pink"
}));

/* ---- Tombol WhatsApp ---- */
document.querySelectorAll("[data-chat]").forEach((a) => { a.href = waLink(a.dataset.chat); });
document.querySelectorAll("[data-pkg]").forEach((b) => {
  b.onclick = () => window.open(waLink("package", b.dataset.pkg), "_blank");
});
const row = $("pkgRow"), dots = [...$("pkgDots").children];
row.addEventListener("scroll", () => {
  const i = Math.round(row.scrollLeft / (row.scrollWidth / 3));
  dots.forEach((d, k) => d.classList.toggle("on", k === i));
}, { passive: true });

/* ---- Event (CONTOH: ganti dengan data asli) ---- */
const events = [
  { date: "12 Okt", name: "Wedding Rina & Dimas", place: "Serpong, Tangsel",   city: "Tangsel", type: "Wedding",     pkg: "Golden 5 jam" },
  { date: "28 Sep", name: "Dies Natalis Kampus",  place: "BSD, Tangsel",       city: "Tangsel", type: "Kampus",      pkg: "Silver 3 jam" },
  { date: "14 Sep", name: "Gathering Kantor",     place: "Sudirman, Jakarta",  city: "Jakarta", type: "Corporate",   pkg: "Silver 3 jam" },
  { date: "30 Agu", name: "Bazar Komunitas",      place: "Depok",              city: "Depok",   type: "Bazar",       pkg: "Basic 3 jam" },
  { date: "09 Agu", name: "Birthday Nadia",       place: "Bintaro",            city: "Bintaro", type: "Ulang tahun", pkg: "Silver 3 jam" }
];
$("eventList").innerHTML = events.map((e) => `
  <article class="ev-card">
    <div class="ev-top">
      <h3 class="ev-name">${e.name}</h3>
      <span class="ev-date">${e.date}</span>
    </div>
    <p class="ev-place">${e.place}</p>
    <p class="ev-meta"><i class="fas fa-camera"></i>${e.pkg}</p>
    <div class="ev-foot">
      <span class="ev-type">${e.type} <small>/ event</small></span>
      <a class="ev-link" href="#gallery">Lihat foto <i class="fas fa-arrow-up-right-from-square" style="font-size:11px"></i></a>
    </div>
  </article>`).join("");
$("evCount").textContent = `${events.length}+ event di ${new Set(events.map((e) => e.city)).size} kota`;

/* ---- Kipas strip di atas sosmed ---- */
[
  { l: 22,  r: -14, w: 48, pal: "p-pink", src: "img/strip-6.jpg" },
  { l: 76,  r: 0,   w: 54, pal: "p-blue", src: "img/strip-1.jpg" },
  { l: 134, r: 14,  w: 48, pal: "p-gold", src: "img/strip-4.jpg" }
].forEach((f) => {
  const s = makeStrip(f.src, f.pal, f.w);
  s.style.left = f.l + "px"; s.style.transform = `rotate(${f.r}deg)`; s.style.transformOrigin = "bottom center";
  $("fan").appendChild(s);
});

/* ---- Galeri ---- */
const photos = [
  { src: "img/strip-1.jpg", cls: "tall" }, { src: "img/strip-3.jpg", cls: "sq" },
  { src: "img/strip-2.jpg", cls: "sq" },   { src: "img/strip-5.jpg", cls: "tall" },
  { src: "img/strip-4.jpg", cls: "tall" }, { src: "img/strip-7.jpg", cls: "sq" },
  { src: "img/strip-6.jpg", cls: "sq" }
];
photos.forEach((p, i) => {
  const b = document.createElement("button");
  b.className = "shot " + p.cls;
  b.setAttribute("aria-label", "Buka foto " + (i + 1));
  const ph = document.createElement("span"); ph.className = "ph";
  const img = new Image(); img.src = p.src; img.alt = "Foto event " + (i + 1); img.loading = "lazy";
  img.onerror = () => img.remove();
  ph.appendChild(img); b.appendChild(ph);
  b.onclick = () => { $("lbImg").src = p.src; $("lb").classList.add("show"); };
  $("masonry").appendChild(b);
});
const closeLb = () => $("lb").classList.remove("show");
$("lbClose").onclick = closeLb;
$("lb").onclick = (e) => { if (e.target.id === "lb") closeLb(); };
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });

/* ---- Share ---- */
const url = location.href.split("#")[0];
$("shareUrl").textContent = url.replace(/^https?:\/\//, "").replace(/\/index\.html$/, "");
function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2000); }
$("shareBtn").onclick = async () => {
  const data = { title: "Didalam Potret Photobooth", text: "Cek photobooth ini, lucu banget!", url };
  try {
    if (navigator.share) { await navigator.share(data); return; }
    await navigator.clipboard.writeText(url);
    toast("Link disalin");
  } catch (e) { if (e.name !== "AbortError") toast("Salin manual: " + url); }
};