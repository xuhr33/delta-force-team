/* ==========================================================================
   main.js — 渲染重复内容 + 全部交互
   依赖 data.js 里的 STATS / ACHIEVEMENTS / MEMBERS / GALLERY
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     小工具：用 DOM API 建节点（不用 innerHTML，避免内容里的特殊字符出问题）
     --------------------------------------------------------------------- */
  function h(tag, attrs) {
    var node = document.createElement(tag);

    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var val = attrs[key];
        if (val === null || val === undefined || val === false) return;
        if (key === 'class') node.className = val;
        else if (key === 'text') node.textContent = val;
        else node.setAttribute(key, val);
      });
    }

    function append(c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    }

    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];
      if (Array.isArray(child)) child.forEach(append);
      else append(child);
    }

    return node;
  }

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* ---------------------------------------------------------------------
     1. 渲染数据驱动的内容
     --------------------------------------------------------------------- */
  function renderStats() {
    var list = $('#statsList');
    if (!list || typeof STATS === 'undefined') return;

    list.replaceChildren.apply(list, STATS.map(function (s) {
      return h('li', { class: 'hero__stat' },
        h('span', { class: 'hero__stat-value', text: s.value }),
        h('span', { class: 'hero__stat-label', text: s.label })
      );
    }));
  }

  function renderHighlight() {
    var host = $('#honorHighlight');
    if (!host) return;

    if (typeof HIGHLIGHT === 'undefined' || !HIGHLIGHT) {
      host.remove();
      return;
    }

    host.replaceChildren(
      h('span', { class: 'honor__label', text: HIGHLIGHT.label }),
      h('p', { class: 'honor__text', text: HIGHLIGHT.text })
    );
  }

  function renderAchievements() {
    var list = $('#achievementList');
    if (!list || typeof ACHIEVEMENTS === 'undefined') return;

    list.replaceChildren.apply(list, ACHIEVEMENTS.map(function (a) {
      var kids = [];

      /* date 不写就不显示日期方块，卡片自动变两栏 */
      if (a.date) {
        var parts = String(a.date).split('-');
        var month = parts[1] ? String(Number(parts[1])) + '月' : '';
        kids.push(h('div', { class: 'achv__date' },
          month ? h('span', { class: 'achv__month', text: month }) : null,
          h('span', { class: 'achv__year', text: parts[0] || '' })
        ));
      }

      kids.push(h('div', { class: 'achv__info' },
        h('h3', { class: 'achv__title', text: a.title }),
        a.desc ? h('p', { class: 'achv__desc', text: a.desc }) : null
      ));

      if (a.rank) kids.push(h('span', { class: 'pill', text: a.rank }));

      return h('li', {
        class: 'card card--achv reveal' + (a.date ? '' : ' card--nodate')
      }, kids);
    }));
  }

  /* 有头像图就用图，没有就用名字第一个字做色块头像 */
  function memberAvatar(m) {
    if (m.avatar) {
      return h('img', {
        class: 'member__avatar',
        src: m.avatar,
        alt: (m.name || m.gameId) + ' 的头像',
        loading: 'lazy',
        onerror: 'this.onerror=null;this.src="images/members/default.svg"'
      });
    }
    var ch = String(m.name || m.gameId || '?').trim().charAt(0);
    return h('span', { class: 'member__avatar member__avatar--mark', 'aria-hidden': 'true', text: ch });
  }

  function renderMembers() {
    var list = $('#memberList');
    if (!list || typeof MEMBERS === 'undefined') return;

    var FIELDS = [
      { key: 'role',   label: '位置' },
      { key: 'rank',   label: '段位' },
      { key: 'joined', label: '入队时间' }
    ];

    list.replaceChildren.apply(list, MEMBERS.map(function (m, i) {
      var detailId = 'memberDetail' + i;
      var rows = [];

      FIELDS.forEach(function (f) {
        if (m[f.key]) {
          rows.push(h('div', null,
            h('span', { class: 'detail__label', text: f.label }),
            h('span', { class: 'detail__value', text: m[f.key] })
          ));
        }
      });

      if (m.quote) {
        rows.push(h('div', { class: 'detail--wide' },
          h('span', { class: 'detail__label', text: '一句话' }),
          h('span', { class: 'detail__value detail__value--quote', text: '「' + m.quote + '」' })
        ));
      }

      var hasDetail = rows.length > 0;
      var displayName = m.name || m.gameId;

      var rowKids = [
        memberAvatar(m),
        h('div', { class: 'member__id' },
          h('h3', { class: 'member__name', text: displayName }),
          (m.gameId && m.gameId !== displayName)
            ? h('p', { class: 'member__gid', text: m.gameId })
            : null
        )
      ];

      if (hasDetail) {
        rowKids.push(h('button', {
          class: 'expand',
          type: 'button',
          'aria-expanded': 'false',
          'aria-controls': detailId,
          'data-target': detailId
        },
          h('span', { class: 'expand__label', text: '展开资料' }),
          h('span', { class: 'expand__icon', 'aria-hidden': 'true', text: '▾' })
        ));
      }

      var kids = [h('div', { class: 'member__row' }, rowKids)];

      if (hasDetail) {
        kids.push(h('div', { class: 'member__detail', id: detailId, hidden: 'hidden' }, rows));
      }

      return h('li', { class: 'card card--member reveal' }, kids);
    }));

    /* 「展开资料」手风琴（事件委托，一次绑定） */
    list.addEventListener('click', function (e) {
      var btn = e.target.closest('.expand');
      if (!btn) return;

      var detail = document.getElementById(btn.getAttribute('data-target'));
      if (!detail) return;

      var willOpen = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      detail.hidden = !willOpen;

      var label = btn.querySelector('.expand__label');
      if (label) label.textContent = willOpen ? '收起资料' : '展开资料';
    });
  }

  function renderRecruit() {
    if (typeof RECRUIT === 'undefined') return;

    var introEl = $('#stdIntro');
    var groupsEl = $('#stdGroups');

    if (introEl && RECRUIT.intro) {
      introEl.replaceChildren.apply(introEl, RECRUIT.intro.map(function (t) {
        return h('li', { text: t });
      }));
    }

    if (groupsEl && RECRUIT.groups) {
      groupsEl.replaceChildren.apply(groupsEl, RECRUIT.groups.map(function (g) {
        var kids = [h('div', { class: 'std-group__head', text: g.title })];

        if (g.note) kids.push(h('p', { class: 'std-note', text: g.note }));

        (g.blocks || []).forEach(function (b) {
          if (b.label) kids.push(h('p', { class: 'std-sub', text: b.label }));

          kids.push(h('ul', { class: 'std-cards' }, (b.items || []).map(function (it) {
            return h('li', { class: 'std-card' },
              h('p', { class: 'std-card__name', text: it.name }),
              h('ol', { class: 'std-card__reqs' }, (it.reqs || []).map(function (r) {
                return h('li', { text: r });
              }))
            );
          })));
        });

        return h('div', { class: 'std-group' }, kids);
      }));
    }
  }

  function renderGallery() {
    var list = $('#galleryList');
    if (!list || typeof GALLERY === 'undefined') return;

    list.replaceChildren.apply(list, GALLERY.map(function (g, i) {
      return h('li', { class: 'gallery__cell' },
        h('button', {
          class: 'gallery__item reveal',
          type: 'button',
          'data-index': String(i),
          'aria-label': '查看大图：' + (g.caption || '图片 ' + (i + 1))
        },
          h('img', { src: g.src, alt: g.caption || '', loading: 'lazy' }),
          g.caption ? h('span', { class: 'gallery__cap', text: g.caption }) : null
        )
      );
    }));
  }

  /* ---------------------------------------------------------------------
     2. 滚动淡入
     --------------------------------------------------------------------- */
  function initReveal() {
    var items = $$('.reveal');

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------
     3. 顶部导航：窄屏折叠菜单
     --------------------------------------------------------------------- */
  function initDrawer() {
    var btn = $('#menuBtn');
    var menu = $('#navMenu');
    if (!btn) return;

    function setOpen(open) {
      document.body.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    btn.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('nav-open'));
    });

    if (menu) {
      menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) setOpen(false);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) setOpen(false);
    });
  }

  /* ---------------------------------------------------------------------
     4. 滚动高亮：顶部导航当前板块
     --------------------------------------------------------------------- */
  function initSpy() {
    var links = $$('.topnav__menu a');
    var hero = $('.hero');
    if (!links.length) return;

    var sections = [];
    links.forEach(function (a) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) sections.push(el);
    });

    function setActive(id) {
      links.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
      });
    }

    /* 还在首屏里就高亮「首页」 */
    function clearIfInHero() {
      if (!hero) return false;
      var limit = hero.offsetTop + hero.offsetHeight - 120;
      if (window.scrollY < limit) { setActive('top'); return true; }
      return false;
    }

    if ('IntersectionObserver' in window && sections.length) {
      var spy = new IntersectionObserver(function (entries) {
        if (clearIfInHero()) return;
        var hit = null;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) hit = entry.target.id;
        });
        if (hit) setActive(hit);
      }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

      sections.forEach(function (s) { spy.observe(s); });
    }

    window.addEventListener('scroll', function () {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(clearIfInHero);
      }
    }, { passive: true });

    setActive('top');
  }

  /* ---------------------------------------------------------------------
     5. 图集灯箱
     --------------------------------------------------------------------- */
  function initLightbox() {
    var box = $('#lightbox');
    if (!box || typeof GALLERY === 'undefined') return;

    var imgEl = $('#lightboxImg');
    var capEl = $('#lightboxCaption');
    var list = $('#galleryList');
    var current = 0;
    var lastFocused = null;

    function show(index) {
      if (!GALLERY.length) return;
      current = (index + GALLERY.length) % GALLERY.length;
      var item = GALLERY[current];
      imgEl.src = item.src;
      imgEl.alt = item.caption || '';
      capEl.textContent = item.caption || '';
    }

    function open(index) {
      lastFocused = document.activeElement;
      show(index);
      box.hidden = false;
      document.body.style.overflow = 'hidden';
      $('#lightboxClose').focus();
    }

    function close() {
      box.hidden = true;
      document.body.style.overflow = '';
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    if (list) {
      list.addEventListener('click', function (e) {
        var btn = e.target.closest('.gallery__item');
        if (btn) open(Number(btn.getAttribute('data-index')) || 0);
      });
    }

    $('#lightboxClose').addEventListener('click', close);
    $('#lightboxPrev').addEventListener('click', function () { show(current - 1); });
    $('#lightboxNext').addEventListener('click', function () { show(current + 1); });

    box.addEventListener('click', function (e) {
      if (e.target === box) close();
    });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------------------------------------------------------------------
     6. 回到顶部
     --------------------------------------------------------------------- */
  var toTopBtn;

  function updateToTop() {
    if (toTopBtn) toTopBtn.classList.toggle('is-visible', window.scrollY > 600);
  }

  function initToTop() {
    toTopBtn = $('#toTop');
    if (!toTopBtn) return;

    toTopBtn.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

    updateToTop();
  }

  /* ---------------------------------------------------------------------
     7. 提示条 + 复制群号
     --------------------------------------------------------------------- */
  var toastEl;
  var toastTimer;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    /* 用 file:// 直接打开时没有 clipboard API，走老办法兜底 */
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function initCopy() {
    toastEl = $('#toast');
    var btn = $('#copyQq');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';
      copyText(text)
        .then(function () { showToast('群号已复制：' + text); })
        .catch(function () { showToast('复制失败，请手动选中群号复制'); });
    });
  }

  /* ---------------------------------------------------------------------
     启动
     --------------------------------------------------------------------- */
  renderStats();
  renderHighlight();
  renderAchievements();
  renderMembers();
  renderRecruit();
  renderGallery();

  initReveal();
  initDrawer();
  initSpy();
  initLightbox();
  initToTop();
  initCopy();

  window.addEventListener('scroll', function () {
    if (window.requestAnimationFrame) window.requestAnimationFrame(updateToTop);
  }, { passive: true });
})();
