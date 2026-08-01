/* ═══════════════════════════════════════════════════════════════════════
   navbar.js — topbar + navbar + dropdown + #st-nav-peek + drawer + VI/EN
   Xem docs/03-components.md §3.1-3.2, §3.12-3.13
   ═══════════════════════════════════════════════════════════════════════ */
window.ST = window.ST || {};

(function () {
  'use strict';

  var D = ST.data, I = ST.i18n;
  var header, navbar, peek, drawer;
  var showTimer = null;

  function icon(id, cls) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') +
           '><use href="#' + id + '"/></svg>';
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  /* Q22 = (b): href thật vẫn lưu trong data, nhưng render ra '#' + toast */
  function hrefOf(item) { return D.LINKS_LIVE ? (item.href || '#') : '#'; }

  /* ══ TOPBAR ════════════════════════════════════════════════════════════ */
  /* Icon nằm trong vòng tròn sáng — copy đúng site chính */
  function tbIcon(id) { return '<span class="st-tb-ic">' + icon(id) + '</span>'; }
  function flag(l) {
    /* viewBox 24×18 = kích thước gốc vi.png/en.png của site chính */
    return '<svg class="st-flag" viewBox="0 0 24 18" aria-hidden="true"><use href="#i-flag-' + l + '"/></svg>';
  }

  function renderTopbar() {
    var c = D.CONTACT;
    document.querySelector('.st-tb-contact').innerHTML =
      '<li><span>' + tbIcon('i-fa-pin') + esc(c.address) + '</span></li>' +
      '<li class="st-tb-phone"><a href="tel:' + c.hotlineTel + '">' + tbIcon('i-fa-phone') + esc(c.hotline) + '</a></li>' +
      '<li><a href="mailto:' + c.email + '">' + tbIcon('i-fa-mail') + esc(c.email) + '</a></li>';

    document.querySelector('.st-tb-social').innerHTML = D.SOCIAL.map(function (s) {
      return '<li><a href="' + esc(s.href) + '" target="_blank" rel="noopener" ' +
             'aria-label="' + esc(s.name) + '" title="' + esc(s.name) + '">' + tbIcon(s.icon) + '</a></li>';
    }).join('');

    /* Cờ VN / UK — site chính dùng ảnh cờ, không phải chữ VI/EN */
    var lang = document.getElementById('st-lang');
    lang.innerHTML = ['vi', 'en'].map(function (l) {
      return '<button type="button" class="st-lang-btn" data-lang="' + l + '" ' +
             'aria-label="' + (l === 'vi' ? 'Tiếng Việt' : 'English') + '" ' +
             'aria-pressed="' + (I.lang === l ? 'true' : 'false') + '">' + flag(l) + '</button>';
    }).join('');
    lang.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lang]');
      if (!b) return;
      I.set(b.getAttribute('data-lang'));
    });
  }

  function syncLangButtons() {
    var btns = document.querySelectorAll('.st-lang-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-lang') === I.lang ? 'true' : 'false');
    }
  }

  /* ══ NAVBAR ════════════════════════════════════════════════════════════ */
  /* Không icon mũi tên — site chính không có */
  function ddSimple(children) {
    return '<div class="st-nav-dd">' + children.map(function (c) {
      return '<a href="' + hrefOf(c) + '" data-href="' + esc(c.href || '') + '">' +
             '<span>' + esc(I.navLabel(c)) + '</span></a>';
    }).join('') + '</div>';
  }

  function ddCols(children) {
    return '<div class="st-nav-dd st-dd-cols">' + children.map(function (grp) {
      var sub = (grp.children || []).map(function (c) {
        return '<a href="' + hrefOf(c) + '" data-href="' + esc(c.href || '') + '">' +
               '<span>' + esc(I.navLabel(c)) + '</span></a>';
      }).join('');
      return '<div class="st-dd-col"><h3>' + esc(I.navLabel(grp)) + '</h3>' + sub + '</div>';
    }).join('') + '</div>';
  }

  function navItem(item) {
    var hasDD = !!(item.children && item.children.length);
    var attrs = item.id ? ' id="' + item.id + '"' : '';
    var cur = item.current ? ' aria-current="page"' : '';

    /* KHÔNG có mũi tên ▾ — site chính không có. Dropdown vẫn mở bằng hover/click. */
    return '<li class="st-nav-item"' + attrs + '>' +
      '<a class="st-nav-link" href="' + hrefOf(item) + '" data-href="' + esc(item.href || '') + '"' + cur +
      (hasDD ? ' aria-expanded="false" aria-haspopup="true"' : '') + '>' +
      '<span>' + esc(I.navLabel(item)) + '</span></a>' +
      (hasDD ? (item.cols ? ddCols(item.children) : ddSimple(item.children)) : '') +
    '</li>';
  }

  function renderNav() {
    var menu = D.NAV_MENU;
    /* 5 trái | logo | 4 phải — cân chiều rộng 2 bên nên logo không đè chữ.
       (Site gốc là 4|4; ta thêm tab VR360 nên dồn thành 5|4.) */
    var mid = 5;
    document.querySelector('.st-nav-left').innerHTML  = menu.slice(0, mid).map(navItem).join('');
    document.querySelector('.st-nav-right').innerHTML = menu.slice(mid).map(navItem).join('');

    var logo = document.getElementById('st-logo');
    var img = logo.querySelector('img');
    img.src = D.LINKS.logo;
    img.onerror = function () { logo.classList.add('st-fallback'); };
    logo.href = hrefOf({ href: D.LINKS.home });
    logo.setAttribute('data-href', D.LINKS.home);

    bindDropdowns();
  }

  function bindDropdowns() {
    var items = navbar.querySelectorAll('.st-nav-item');
    Array.prototype.forEach.call(items, function (li) {
      var link = li.querySelector('.st-nav-link');
      var dd = li.querySelector('.st-nav-dd');
      if (!dd) return;
      var inT = null, outT = null;

      function open() {
        closeAllDD(li);
        li.classList.add('st-open');
        link.setAttribute('aria-expanded', 'true');
      }
      function close() {
        li.classList.remove('st-open');
        link.setAttribute('aria-expanded', 'false');
      }

      li.addEventListener('mouseenter', function () {
        clearTimeout(outT);
        inT = setTimeout(open, 120);
      });
      li.addEventListener('mouseleave', function () {
        clearTimeout(inT);
        outT = setTimeout(close, 240);
      });
      /* Hover-only fail a11y → click/Enter cũng mở được */
      link.addEventListener('click', function (e) {
        if (window.matchMedia('(hover: none)').matches || !li.classList.contains('st-open')) {
          e.preventDefault();
          li.classList.contains('st-open') ? close() : open();
        }
      });
      li.addEventListener('focusout', function (e) {
        if (!li.contains(e.relatedTarget)) close();
      });
    });
  }

  function closeAllDD(except) {
    Array.prototype.forEach.call(navbar.querySelectorAll('.st-nav-item.st-open'), function (li) {
      if (li === except) return;
      li.classList.remove('st-open');
      var a = li.querySelector('.st-nav-link');
      if (a) a.setAttribute('aria-expanded', 'false');
    });
  }

  /* ══ Ẩn / hiện header (Q20 = c + d) ════════════════════════════════════ */
  function hide() {
    if (ST.store.get('navHideLock') || ST.store.get('navHidden')) return;
    clearTimeout(showTimer);
    closeAllDD();
    document.documentElement.classList.add('st-nav-hidden');
    peek.setAttribute('aria-expanded', 'false');
    ST.store.set('navHidden', true);
  }

  function show() {
    if (!ST.store.get('navHidden')) return;
    document.documentElement.classList.remove('st-nav-hidden');
    peek.setAttribute('aria-expanded', 'true');
    ST.store.set('navHidden', false);
  }

  /* ══ DRAWER mobile ═════════════════════════════════════════════════════ */
  function drawerRows(items, level) {
    return items.map(function (it, i) {
      var hasSub = !!(it.children && it.children.length);
      var id = 'st-dnav-' + level + '-' + i + '-' + Math.random().toString(36).slice(2, 6);
      var row =
        '<div class="st-dnav-row st-lv' + level + (it.current ? ' st-current' : '') + '">' +
          '<a href="' + hrefOf(it) + '" data-href="' + esc(it.href || '') + '">' + esc(I.navLabel(it)) + '</a>' +
          (hasSub ? '<button class="st-dnav-toggle" type="button" aria-expanded="false" aria-controls="' + id +
                    '" aria-label="' + esc(I.navLabel(it)) + '">' + icon('i-chevron-down') + '</button>' : '') +
        '</div>' +
        (hasSub ? '<div class="st-dnav-sub" id="' + id + '">' + drawerRows(it.children, level + 1) + '</div>' : '');
      return row;
    }).join('');
  }

  function renderDrawer() {
    var img = drawer.querySelector('.st-drawer-logo');
    img.src = D.LINKS.logo;
    img.onerror = function () { img.style.display = 'none'; };

    drawer.querySelector('.st-drawer-nav').innerHTML = drawerRows(D.NAV_MENU, 0);

    var c = D.CONTACT;
    drawer.querySelector('.st-drawer-foot').innerHTML =
      '<div class="st-df-links">' +
        '<a href="tel:' + c.hotlineTel + '">' + icon('i-phone') + esc(c.hotline) + '</a>' +
        '<a href="mailto:' + c.email + '">' + icon('i-mail') + esc(c.email) + '</a>' +
      '</div>' +
      '<div class="st-df-social">' + D.SOCIAL.map(function (s) {
        return '<a href="' + esc(s.href) + '" target="_blank" rel="noopener" aria-label="' + esc(s.name) + '">' +
               icon(s.icon) + '</a>';
      }).join('') + '</div>' +
      '<a class="st-btn st-btn-primary" style="justify-content:center" href="' + esc(D.LINKS.ticket) +
        '" target="_blank" rel="noopener">' + icon('i-ticket') +
        '<span data-i18n="cta.ticket"></span></a>';

    drawer.addEventListener('click', function (e) {
      var t = e.target.closest('.st-dnav-toggle');
      if (!t) return;
      var sub = document.getElementById(t.getAttribute('aria-controls'));
      var open = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', open ? 'false' : 'true');
      sub.classList.toggle('st-open', !open);
    });

    I.apply(drawer);
  }

  /* ══ INIT ══════════════════════════════════════════════════════════════ */
  var N = {
    init: function () {
      header = document.getElementById('st-header');
      navbar = document.getElementById('st-navbar');
      peek   = document.getElementById('st-nav-peek');
      drawer = document.getElementById('st-drawer');

      renderTopbar();
      renderNav();
      renderDrawer();

      /* Ẩn header khi bắt đầu kéo panorama */
      ST.store.on('drag:start', hide);

      /* Mở lại: bấm peek.
         KHÔNG dùng "hover sát đỉnh màn hình tự hiện" — nó làm nút peek không
         bao giờ bấm được bằng chuột (đưa chuột tới nút là header đã bung ra,
         nút biến mất). Khách yêu cầu rõ là có NÚT để bấm → giữ đúng vậy. */
      peek.addEventListener('click', show);

      /* Mở lại: Tab focus vào header — BẮT BUỘC cho a11y */
      header.addEventListener('focusin', show);

      /* Khoá khi modal mở */
      ST.store.on('modal:open',  function () { ST.store.set('navHideLock', true); show(); });
      ST.store.on('modal:close', function () { ST.store.set('navHideLock', false); });

      /* Click ngoài → đóng dropdown */
      document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target)) closeAllDD();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') closeAllDD();
      });

      /* Nút hamburger */
      document.getElementById('st-btn-menu').addEventListener('click', function () {
        ST.overlays.open('st-drawer');
      });
      document.getElementById('st-btn-search').addEventListener('click', function () {
        ST.toast('toast.wip');
      });

      /* Đổi ngôn ngữ → render lại menu (label EN) */
      ST.store.on('lang:change', function () {
        renderTopbar();
        renderNav();
        renderDrawer();
        syncLangButtons();
        I.apply();
      });
    },

    hide: hide,
    show: show
  };

  ST.navbar = N;
})();
