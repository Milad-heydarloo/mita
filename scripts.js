// ==== منوی موبایل (با دسترسی) ====
(function(){
  var ham = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  if(!ham || !menu) return;

  function lockScroll(lock){
    document.documentElement.style.overflow = lock ? 'hidden' : '';
    document.body.style.overflow = lock ? 'hidden' : '';
  }
  function openMenu(){ menu.hidden = false; ham.setAttribute('aria-expanded','true'); lockScroll(true); }
  function closeMenu(){ menu.hidden = true; ham.setAttribute('aria-expanded','false'); lockScroll(false); }

  ham.addEventListener('click', function(){ menu.hidden ? openMenu() : closeMenu(); });
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !menu.hidden) closeMenu(); });
  document.addEventListener('click', function(e){ if(menu.hidden) return; var within = menu.contains(e.target) || ham.contains(e.target); if(!within) closeMenu(); });
})();

// پالت‌های گرادیان برای لوگو + تایپلاین
const PALETTES = [
  ["#ff4d4d","#ffb84d","#4dd2ff","#b84dff"],
  ["#71dd8a","#3aaed8","#2b6cb0","#845ef7"],
  ["#ff8a00","#e52e71","#7f00ff","#00dbde"],
  ["#ff416c","#ff4b2b","#ffd166","#06d6a0"],
  ["#00c6ff","#0072ff","#7f00ff","#e100ff"]
];
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] }
function paintGrad(gradEl, colors){
  const stops = gradEl.querySelectorAll('stop');
  const c = colors.length >= 3 ? colors : [colors[0], colors[0], colors[0]];
  const mid = c[Math.floor(c.length/2)];
  const end = c[c.length-1];
  stops[0].setAttribute('stop-color', c[0]);
  stops[1].setAttribute('stop-color', mid);
  stops[2].setAttribute('stop-color', end);
  const root = document.documentElement.style; root.setProperty('--g1', c[0]); root.setProperty('--g2', mid); root.setProperty('--g3', end);
}
function recolor(){ paintGrad(document.getElementById('logoGrad'), pick(PALETTES)); }
document.addEventListener('DOMContentLoaded', ()=>{ recolor(); setInterval(recolor, 6000); document.getElementById('y').textContent = new Date().getFullYear(); });

// افکت تایپ دو زبانه با رعایت دسترسی
const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
async function typeText(el,text,speed){ el.textContent=""; for(let i=1;i<=text.length;i++){ el.textContent=text.slice(0,i); await sleep(speed);} }
async function deleteText(el,speed){ for(let i=el.textContent.length;i>=0;i--){ el.textContent=el.textContent.slice(0,i); await sleep(speed);} }
async function startTypeLoop(){
  const el=document.getElementById("typeBox");
  const items=[ {text:"منومیتا", dir:"ltr"}, {text:"menumita", dir:"ltr"} ];
  while(true){ for(const it of items){ el.style.direction = it.dir; el.style.textAlign = "center"; await typeText(el,it.text,120); await sleep(800); await deleteText(el,90); await sleep(400);} }
}
document.addEventListener("DOMContentLoaded",startTypeLoop);

// بارگذاری تدریجی تصاویر (افزودن کلاس loaded هنگام ورود به ویوپورت)
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => { if (entry.isIntersecting) { const img = entry.target; img.classList.add('loaded'); observer.unobserve(img); } });
  }, { rootMargin: '150px 0px' });
  lazyImages.forEach(img => imageObserver.observe(img));
});

// ===== تزریق محتوای داینامیک از content.js =====
document.addEventListener('DOMContentLoaded', function(){
  if(!window.CONTENT) return;
  const C = window.CONTENT;

  // Helper: ساخت URL مطلق از مسیر نسبی
  function abs(path){
    try{ const base = (C.seo && C.seo.siteUrl) ? C.seo.siteUrl : document.baseURI; return new URL(path, base).href; }catch(e){ return path; }
  }

  // SEO: عنوان، توضیحات، کلیدواژه‌ها
  (function applySEO(){
    if(C.seo){
      if(C.seo.title) document.title = C.seo.title;
      const metaDesc = document.getElementById('meta-description') || document.querySelector('meta[name="description"]');
      if(metaDesc && C.seo.description) metaDesc.setAttribute('content', C.seo.description);
      const metaKeywords = document.getElementById('meta-keywords');
      if(metaKeywords && Array.isArray(C.seo.keywords)) metaKeywords.setAttribute('content', C.seo.keywords.join(', '));

      // canonical
      const canonical = document.getElementById('canonical-link');
      if(canonical){ canonical.setAttribute('href', C.seo.canonical || C.seo.siteUrl || canonical.getAttribute('href')); }

      // Open Graph
      const ogTitle = document.getElementById('og-title');
      const ogDesc = document.getElementById('og-description');
      const ogUrl = document.getElementById('og-url');
      const ogImg = document.getElementById('og-image');
      if(ogTitle && (C.seo.og?.title || C.seo.title)) ogTitle.setAttribute('content', C.seo.og?.title || C.seo.title);
      if(ogDesc && (C.seo.og?.description || C.seo.description)) ogDesc.setAttribute('content', C.seo.og?.description || C.seo.description);
      if(ogUrl && (C.seo.canonical || C.seo.siteUrl)) ogUrl.setAttribute('content', C.seo.canonical || C.seo.siteUrl);
      if(ogImg && (C.seo.og?.image || C.seo.logo)) ogImg.setAttribute('content', abs(C.seo.og?.image || C.seo.logo));

      // Twitter
      const twTitle = document.getElementById('tw-title');
      const twDesc = document.getElementById('tw-description');
      const twImg = document.getElementById('tw-image');
      if(twTitle && (C.seo.twitter?.title || C.seo.title)) twTitle.setAttribute('content', C.seo.twitter?.title || C.seo.title);
      if(twDesc && (C.seo.twitter?.description || C.seo.description)) twDesc.setAttribute('content', C.seo.twitter?.description || C.seo.description);
      if(twImg && (C.seo.twitter?.image || C.seo.logo)) twImg.setAttribute('content', abs(C.seo.twitter?.image || C.seo.logo));
    }
  })();

  // ناوبری بالا و موبایل
  (function renderNav(){
    if(Array.isArray(C.nav)){
      const navDesktop = document.querySelector('header .menu');
      const navMobile = document.getElementById('mobileMenu');
      const renderLinks = (parent)=>{
        if(!parent) return;
        parent.innerHTML = '';
        C.nav.forEach(item=>{
          const a = document.createElement('a');
          a.href = item.href;
          a.textContent = item.text;
          parent.appendChild(a);
        });
      };
      renderLinks(navDesktop);
      renderLinks(navMobile);
    }
  })();

  // هیرو
  (function renderHero(){
    const hero = document.getElementById('hero');
    if(!hero || !C.hero) return;
    const badgeSpan = hero.querySelector('.badge span');
    const h1 = hero.querySelector('h1');
    const p = hero.querySelector('p');
    const cta = hero.querySelector('.cta');
    if(C.hero.badge && badgeSpan) badgeSpan.textContent = C.hero.badge;
    if(C.hero.headline && h1) h1.textContent = C.hero.headline;
    if(C.hero.subline && p) p.textContent = C.hero.subline;
    if(Array.isArray(C.hero.ctas) && cta){
      cta.innerHTML = '';
      C.hero.ctas.forEach(btn=>{
        const a = document.createElement('a');
        a.className = 'btn ' + (btn.variant === 'secondary' ? 'secondary' : 'primary');
        a.href = btn.href || '#';
        a.textContent = btn.text || '';
        cta.appendChild(a);
      });
    }
  })();

  // امکانات
  (function renderFeatures(){
    const list = document.querySelector('#features .features');
    const sub = document.querySelector('#features .section-sub');
    if(!list || !Array.isArray(C.features)) return;
    list.innerHTML = '';
    C.features.forEach(f=>{
      const art = document.createElement('article');
      art.className = 'card';
      const h3 = document.createElement('h3'); h3.textContent = f.title || '';
      const p = document.createElement('p'); p.textContent = f.description || '';
      art.appendChild(h3); art.appendChild(p);
      list.appendChild(art);
    });
    if(sub) sub.textContent = 'امکانات کلیدی و مزایای اصلی محصول';
  })();

  // گالری
  (function renderGallery(){
    const g = document.querySelector('#gallery .gallery');
    const titleEl = document.getElementById('gallery-title');
    const subEl = document.querySelector('#gallery .section-sub');
    if(titleEl && C.gallerySection?.title) titleEl.textContent = C.gallerySection.title;
    if(subEl && C.gallerySection?.sub) subEl.textContent = C.gallerySection.sub;
    if(!g || !Array.isArray(C.gallery)) return;
    g.innerHTML = '';
    C.gallery.forEach(img=>{
      if(!img || typeof img.src !== 'string' || !img.src.trim()) return; // skip invalid entries
      const fig = document.createElement('figure');
      const image = document.createElement('img');
      image.src = img.src; image.alt = img.alt || ''; image.loading = 'lazy'; image.decoding = 'async';
      image.width = img.width || 600; image.height = img.height || 400;
      const cap = document.createElement('figcaption'); cap.textContent = img.caption || '';
      image.addEventListener('error', ()=>{
        cap.textContent = (img.caption || '') + ' (تصویر در دسترس نیست)';
      });
      fig.appendChild(image); fig.appendChild(cap);
      g.appendChild(fig);
    });
  })();

  // تعرفه‌ها
  (function renderPricing(){
    const pWrap = document.querySelector('#pricing .pricing');
    if(!pWrap || !Array.isArray(C.pricing)) return;
    pWrap.innerHTML = '';
    C.pricing.forEach(p=>{
      const card = document.createElement('div'); card.className = 'price-card';
      if(p.featured) { card.classList.add('featured'); }
      const h3 = document.createElement('h3'); h3.textContent = p.name || '';
      const meta = document.createElement('div'); meta.className = 'price-meta';
      meta.innerHTML = `${p.group ? `<small>${p.group}</small>`:''} ${p.tag ? `<small>${p.tag}</small>`:''}`;
      const price = document.createElement('div'); price.className = 'price';
      price.innerHTML = `${p.price || ''} <small>/ ${p.priceUnit || ''}</small>`;
      // منابع سرور
      const res = document.createElement('p'); res.textContent = p.resources || '';
      // اعداد و جمع‌ها
      const fmt = (n)=> typeof n==='number' ? n.toLocaleString('fa-IR') : '';
      const totals = document.createElement('div'); totals.className = 'totals';
      const t1 = (p.totalFirstYearRial ? `<div>جمع سال اول: ${fmt(p.totalFirstYearRial)} ریال</div>` : '');
      const t2 = (p.totalRenewYearRial ? `<div>جمع سال تمدید: ${fmt(p.totalRenewYearRial)} ریال</div>` : '');
      const sp = (p.serverMonthlyPayable ? `<small>پرداخت ماهانه سرور ممکن است</small>` : '');
      totals.innerHTML = `${t1}${t2}${sp}`;
      const ul = document.createElement('ul'); ul.className = 'clean';
      (p.benefits||[]).forEach(b=>{ const li=document.createElement('li'); li.textContent=b; ul.appendChild(li); });
      const a = document.createElement('a'); a.className = 'btn ' + (p.variant === 'secondary' ? 'secondary' : 'primary'); a.href = p.buttonHref || '#'; a.textContent = p.buttonText || '';
      card.appendChild(h3); card.appendChild(meta); card.appendChild(price); if(p.resources) card.appendChild(res); card.appendChild(totals); card.appendChild(ul); card.appendChild(a);
      pWrap.appendChild(card);
    });
  })();

  // سوالات پرتکرار
  (function renderFAQ(){
    const faq = document.querySelector('#faq .faq');
    if(!faq || !Array.isArray(C.faq)) return;
    // نگه داشتن عنوان
    const title = faq.querySelector('#faq-title');
    faq.innerHTML = '';
    if(title){ faq.appendChild(title); }
    C.faq.forEach(item=>{
      const details = document.createElement('details');
      const summary = document.createElement('summary'); summary.textContent = item.q || '';
      const p = document.createElement('p'); p.textContent = item.a || '';
      details.appendChild(summary); details.appendChild(p);
      faq.appendChild(details);
    });
  })();

  // اسکیماهای داینامیک (JSON-LD)
  (function buildSchemas(){
    const arr = [];
    const siteUrl = C.seo?.siteUrl || document.baseURI;

    // Organization
    if(C.seo){
      const org = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": C.seo.brandName || C.seo.title || document.title,
        "url": siteUrl,
        "logo": C.seo.logo ? abs(C.seo.logo) : undefined,
        "sameAs": Array.isArray(C.seo.sameAs) ? C.seo.sameAs : undefined,
        "contactPoint": C.seo.contactPoint ? [{
          "@type": "ContactPoint",
          "telephone": C.seo.contactPoint.telephone,
          "email": C.seo.contactPoint.email,
          "contactType": C.seo.contactPoint.contactType,
          "areaServed": C.seo.contactPoint.areaServed
        }] : undefined
      };
      arr.push(org);
    }

    // WebPage
    arr.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": C.seo?.title || document.title,
      "url": C.seo?.canonical || siteUrl,
      "description": C.seo?.description,
      "inLanguage": "fa-IR",
      "isPartOf": {"@type":"WebSite","url": siteUrl}
    });

    // Features as ItemList
    if(Array.isArray(C.features)){
      arr.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Features",
        "itemListElement": C.features.map((f,i)=>({
          "@type": "ListItem",
          "position": i+1,
          "item": {"@type":"Thing","name": f.title, "description": f.description}
        }))
      });
    }

    // Gallery as ItemList of ImageObject
    if(Array.isArray(C.gallery)){
      arr.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Gallery",
        "itemListElement": C.gallery.map((g,i)=>({
          "@type": "ListItem",
          "position": i+1,
          "item": {
            "@type":"ImageObject",
            "contentUrl": abs(g.src),
            "name": g.alt,
            "description": g.caption,
            "keywords": Array.isArray(g.keywords) ? g.keywords.join(', ') : undefined
          }
        }))
      });
    }

    // Pricing as OfferCatalog
    if(Array.isArray(C.pricing)){
      arr.push({
        "@context": "https://schema.org",
        "@type": "OfferCatalog",
        "name": "Plans",
        "itemListElement": C.pricing.map(p=>({
          "@type": "Offer",
          "name": p.name,
          "description": (p.benefits||[]).join("، "),
          "url": (p.buttonHref||'#')
        }))
      });
    }

    // FAQPage
    if(Array.isArray(C.faq)){
      arr.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": C.faq.map(f=>({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {"@type":"Answer","text": f.a}
        }))
      });
    }

    const target = document.getElementById('schema-dynamic');
    if(target){ target.textContent = JSON.stringify(arr, null, 2); }
    else {
      const s = document.createElement('script'); s.type = 'application/ld+json'; s.id='schema-dynamic'; s.textContent = JSON.stringify(arr);
      document.head.appendChild(s);
    }
  })();
});