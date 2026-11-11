const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const wa = (num, text) => `https://wa.me/${num || CONFIG.defaultWhatsApp}?text=${encodeURIComponent(text)}`;

/* ---- بيانات الشركة ---- */
document.title = CONFIG.company;
$$("[data-company]").forEach(e => e.textContent = CONFIG.company);
$$("[data-tagline]").forEach(e => e.textContent = CONFIG.tagline);
$$("[data-logo]").forEach(img => {
  img.src = CONFIG.logo;
  img.alt = "شعار " + CONFIG.company;
  img.onerror = () => { img.style.visibility = "hidden"; };
});
$("#year").textContent = new Date().getFullYear();

// إظهار/إخفاء البيانات الاختيارية
const optional = {license: CONFIG.license, address: CONFIG.address, phone: CONFIG.phone, email: CONFIG.email};
Object.entries(optional).forEach(([key, val]) => {
  $$(`[data-${key}]`).forEach(e => { if (val) e.textContent = val; });
  $$(`[data-show-${key}]`).forEach(e => e.classList.toggle("hidden", !val));
});
if (CONFIG.phone) $("[data-phone-link]").href = "tel:" + CONFIG.phone;
if (CONFIG.email) $("[data-email-link]").href = "mailto:" + CONFIG.email;
$$("[data-wa-default]").forEach(a => a.href = wa("", a.dataset.msg || "مرحباً"));

/* ---- الإحصائيات (محسوبة تلقائياً) ---- */
const allCountries = COUNTRY_GROUPS.flatMap(g => g.countries);
$("#statsGrid").innerHTML = [
  [allCountries.length, "دول متاحة"],
  [SERVICES.length, "خدمات متنوعة"],
  [STEPS.length, "خطوات واضحة"],
  ["واتساب", "تواصل سريع"],
].map(([n, l]) => `<div><strong>${n}</strong><span>${l}</span></div>`).join("");

/* ---- الأقسام ---- */
$("#serviceCards").innerHTML = SERVICES.map(s => `
  <div class="card"><div class="icon">${s.icon}</div><h3>${s.title}</h3><p>${s.desc}</p>
  <a class="btn btn-outline" href="#contact">طلب الخدمة</a></div>`).join("");

$("#transferFeatures").innerHTML = TRANSFER_FEATURES.map(f =>
  `<div class="feature"><h4>${f.title}</h4><p>${f.text}</p></div>`).join("");

$("#whyCards").innerHTML = WHY_US.map(w =>
  `<div class="card plain"><div class="icon">${w.icon}</div><h3>${w.title}</h3><p>${w.text}</p></div>`).join("");

$("#stepsGrid").innerHTML = STEPS.map(s =>
  `<div class="step"><h3>${s.title}</h3><p>${s.text}</p></div>`).join("");

$("#countryGroups").innerHTML = COUNTRY_GROUPS.map(g => `
  <div class="country-group"><h3>${g.name}</h3><div class="countries">
  ${g.countries.map(c => `<a class="country" target="_blank" rel="noopener"
    href="${wa(c.whatsapp, `مرحباً، أرغب في استقدام عمالة من ${c.ar}، والمواصفات التي أبحث عنها هي:`)}">
    <img src="https://flagcdn.com/w80/${c.code}.png" alt="علم ${c.ar}" loading="lazy">
    <span>${c.ar} - ${c.en}</span></a>`).join("")}
  </div></div>`).join("");

$("#faqList").innerHTML = FAQ.map(f =>
  `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join("");

if (GALLERY.length) {
  $("#galleryGrid").innerHTML = GALLERY.map(g => `<img src="${g.src}" alt="${g.alt || ""}" loading="lazy">`).join("");
} else { $("#gallery").classList.add("hidden"); $$("[data-nav-gallery]").forEach(e => e.classList.add("hidden")); }

if (REVIEWS.length) {
  $("#reviewCards").innerHTML = REVIEWS.map(r =>
    `<div class="card quote"><p>"${r.text}"</p><footer>${r.name}</footer></div>`).join("");
} else { $("#reviews").classList.add("hidden"); }

/* ---- النموذج ---- */
$("#f-country").innerHTML = '<option value="">اختر الدولة</option>' +
  COUNTRY_GROUPS.map(g => `<optgroup label="${g.name}">${g.countries.map(c => `<option>${c.ar}</option>`).join("")}</optgroup>`).join("") +
  "<option>أخرى / غير محدد</option>";
$("#f-job").innerHTML = '<option value="">اختر المهنة</option>' + JOBS.map(j => `<option>${j}</option>`).join("");

$("#orderForm").addEventListener("submit", e => {
  e.preventDefault();
  const country = $("#f-country").value;
  const c = allCountries.find(x => x.ar === country);
  const msg = `طلب استقدام جديد\nالاسم: ${$("#f-name").value}\nالجوال: ${$("#f-phone").value}\nالدولة: ${country}\nالمهنة: ${$("#f-job").value}\nالمواصفات: ${$("#f-notes").value || "-"}`;
  window.open(wa(c && c.whatsapp, msg), "_blank");
});

/* ---- القائمة ---- */
$("#menuBtn").addEventListener("click", () => $("#menu").classList.toggle("open"));
$$("#menu a").forEach(a => a.addEventListener("click", () => $("#menu").classList.remove("open")));
