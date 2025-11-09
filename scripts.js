(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const C = window.CONTENT || {};

  document.addEventListener('DOMContentLoaded', () => {
    // سال فوتر
    const y = new Date().getFullYear();
    const yEl = $('#y'); if (yEl) yEl.textContent = y;

    // ===== متا و OG/Twitter از CONTENT.seo =====
    if (C.seo) {
      document.title = C.seo.title || document.title;
      setMeta('#meta-description', C.seo.description);
      setMeta('#meta-keywords', (C.seo.keywords || []).join(','));
      setAttr('#canonical-link', 'href', C.seo.canonical || C.seo.siteUrl);

      setMeta('#og-title', C.seo.og?.title || C.seo.title);
      setMeta('#og-description', C.seo.og?.description || C.seo.description);
      setMeta('#og-url', C.seo.canonical || C.seo.siteUrl);
      setMeta('#og-image', absUrl(C.seo.og?.image || C.seo.logo));

      setMeta('#tw-title', C.seo.twitter?.title || C.seo.title);
      setMeta('#tw-description', C.seo.twitter?.description || C.seo.description);
      setMeta('#tw-image', absUrl(C.seo.twitter?.image || C.seo.logo));

      injectSchemas();
    }

    // ===== ناوبری =====
    renderNav();

    // ===== هیرو =====
    const hero = $('#hero');
    if (hero && C.hero) {
      $('.badge span', hero).textContent = C.hero.badge || '';
      $('h1', hero).textContent = C.hero.headline || '';
      $('p', hero).textContent = C.hero.subline || '';
      const ctaBox = $('.cta', hero); ctaBox.innerHTML = '';
      (C.hero.ctas || []).forEach(cta => {
        const a = document.createElement('a');
        a.className = `btn ${cta.variant || 'primary'}`;
        a.href = cta.href; a.textContent = cta.text;
        ctaBox.appendChild(a);
      });
    }

    // ===== Features =====
    const featuresWrap = $('.features');
    if (featuresWrap && Array.isArray(C.features)) {
      featuresWrap.innerHTML = '';
      C.features.forEach(f => {
        const art = document.createElement('article');
        art.className = 'card'; art.setAttribute('role', 'listitem');
        art.innerHTML = `<h3>${escapeHtml(f.title)}</h3><p>${escapeHtml(f.description)}</p>`;
        featuresWrap.appendChild(art);
      });
    }

    // ===== Gallery =====
    const gal = $('#gallery .gallery');
    if (gal && Array.isArray(C.gallery)) {
      gal.innerHTML = '';
      C.gallery.forEach(g => {
        const fig = document.createElement('figure');
        fig.innerHTML = `
          <img src="${g.src}" alt="${escapeHtml(g.alt)}" loading="lazy" decoding="async" width="600" height="400" />
          <figcaption>${escapeHtml(g.caption)}</figcaption>
        `;
        gal.appendChild(fig);
      });
    }

    // ===== Pricing =====
    const priceWrap = $('#pricing .pricing');
    if (priceWrap && Array.isArray(C.pricing)) {
      priceWrap.innerHTML = '';
      C.pricing.forEach(p => {
        const card = document.createElement('div');
        card.className = 'price-card' + (p.featured ? ' featured' : '');
        card.setAttribute('aria-label', p.name);
        card.innerHTML = `
          <h3>${escapeHtml(p.name)}</h3>
          <div class="price">${escapeHtml(p.price)} <small>/${escapeHtml(p.priceUnit || '')}</small></div>
          <p class="tag">${escapeHtml(p.tag || '')}</p>
          <ul class="clean">${(p.benefits||[]).map(li => `<li>${escapeHtml(li)}</li>`).join('')}</ul>
          <div class="meta">
            <p class="resources">${escapeHtml(p.resources || '')}</p>
          </div>
          <a class="btn ${p.featured ? 'primary' : 'secondary'}" href="${p.buttonHref || '#contact'}">${escapeHtml(p.buttonText || 'انتخاب')}</a>
        `;
        priceWrap.appendChild(card);
      });
    }

    // ===== FAQ =====
    const faqWrap = $('#faq .container.faq');
    if (faqWrap && Array.isArray(C.faq)) {
      $$('#faq details').forEach(d => d.remove()); // پاک‌سازی نمونه‌های استاتیک
      C.faq.forEach(item => {
        const det = document.createElement('details');
        const sum = document.createElement('summary');
        sum.textContent = item.q; det.appendChild(sum);
        const p = document.createElement('p'); p.textContent = item.a; det.appendChild(p);
        faqWrap.appendChild(det);
      });
    }

    // ===== Contact Note =====
    const note = $('.form-note');
    if (note && C.contact?.formNote) note.textContent = C.contact.formNote;

    // ===== منوی موبایل =====
    const hamb = $('#hamburger');
    const mobileMenu = $('#mobileMenu');
    if (hamb && mobileMenu) {
      hamb.addEventListener('click', () => {
        const isHidden = mobileMenu.hasAttribute('hidden');
        if (isHidden) mobileMenu.removeAttribute('hidden'); else mobileMenu.setAttribute('hidden', '');
        hamb.setAttribute('aria-expanded', String(isHidden));
      });
      mobileMenu.addEventListener('click', e => {
        if (e.target.tagName === 'A') mobileMenu.setAttribute('hidden', '');
      });
    }
  });

  // ===== Helpers =====
  function setMeta(sel, val) {
    const el = $(sel);
    if (el && val) el.setAttribute('content', val);
  }
  function setAttr(sel, attr, val) {
    const el = $(sel);
    if (el && val) el.setAttribute(attr, val);
  }
  function absUrl(p) {
    if (!p) return '';
    try { return new URL(p, location.origin).href; } catch { return p; }
  }
  function escapeHtml(s='') {
    return s.replace(/[&<>\"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function renderNav(){
    const navDesk = document.querySelector('header nav.menu');
    const navMob = document.querySelector('#mobileMenu');
    if (!C.nav) return;
    [navDesk, navMob].forEach(nav => {
      if (!nav) return;
      nav.innerHTML = '';
      C.nav.forEach(i => {
        const a = document.createElement('a');
        a.href = i.href; a.textContent = i.text;
        nav.appendChild(a);
      });
    });
  }

  function injectSchemas(){
    const blocks = [];
    // Organization
    blocks.push({
      '@context': 'https://schema.org', '@type': 'Organization',
      name: C.seo.brandName || 'منومیتا', url: C.seo.siteUrl,
      logo: absUrl(C.seo.logo), sameAs: C.seo.sameAs || [],
      contactPoint: [{ '@type': 'ContactPoint', ...C.seo.contactPoint }]
    });
    // FAQPage
    if (Array.isArray(C.faq) && C.faq.length) {
      blocks.push({
        '@context': 'https://schema.org','@type': 'FAQPage',
        mainEntity: C.faq.map(f => ({
          '@type':'Question', name: f.q,
          acceptedAnswer: { '@type':'Answer', text: f.a }
        }))
      });
    }
    const holder = document.getElementById('schema-dynamic');
    if (holder) holder.textContent = JSON.stringify(blocks.length === 1 ? blocks[0] : blocks);
  }
})();
