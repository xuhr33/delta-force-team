/* ==========================================================================
   main.js — 渲染重复内容 + 全部交互
   依赖 data.js 里的 STATS / HIGHLIGHT / PILLARS / QUOTE
                    ACHIEVEMENTS / STARS / MEMBERS / RECRUIT
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

  /* ---------- 干员头像 ----------
     12 张素材放在 images/avatars/av01.jpg ~ av12.jpg
     按名字哈希稳定分配（刷新不变、加人也不会集体换脸）；
     相邻两个人撞到同一张时自动顺延一张，避免并排出现同一张脸。
     想给某人指定头像：在 data.js 那条里写 avatar: 'images/avatars/av07.jpg'
  */
  var AVATAR_COUNT = 12;

  function hashOf(s) {
    var t = String(s || ''), sum = 0;
    for (var i = 0; i < t.length; i++) sum += t.charCodeAt(i) * (i + 7);
    return sum;
  }

  function avatarFile(n, big) {
    var k = n + 1;
    var name = 'av' + (k < 10 ? '0' : '') + k + '.jpg';
    return big ? 'images/avatars/' + name : 'images/avatars/small/' + name;
  }

  /* big=true 时给弹窗用大图，否则用名单里的小图（省流量） */
  function avatarFor(m, prevFile, big) {
    if (m.avatar) return m.avatar;
    var n = hashOf(m.name || m.gameId) % AVATAR_COUNT;
    var file = avatarFile(n, big);
    if (file === prevFile) file = avatarFile((n + 1) % AVATAR_COUNT, big);
    return file;
  }

  /* ---------------------------------------------------------------------
     1. 首屏数据条
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

  /* ---------------------------------------------------------------------
     2. 队伍简介：三张定位卡 + 引言
     --------------------------------------------------------------------- */
  function renderPillars() {
    var list = $('#pillarList');
    if (list && typeof PILLARS !== 'undefined') {
      list.replaceChildren.apply(list, PILLARS.map(function (p) {
        return h('li', { class: 'pillar' },
          h('p', { class: 'pillar__keyword', text: p.keyword }),
          h('p', { class: 'pillar__label', text: p.label }),
          h('p', { class: 'pillar__text', text: p.text })
        );
      }));
    }

    var q = $('#pullQuote');
    if (q && typeof QUOTE !== 'undefined' && QUOTE) q.textContent = QUOTE;
  }

  /* ---------------------------------------------------------------------
     3. 战绩荣誉
     --------------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------------
     4. 明星队员
     --------------------------------------------------------------------- */
  function renderStars() {
    var list = $('#starList');
    if (!list || typeof STARS === 'undefined' || !STARS) return;

    if ($('#starsEyebrow')) $('#starsEyebrow').textContent = STARS.eyebrow || '';
    if ($('#starsTitle')) $('#starsTitle').textContent = STARS.title || '';
    if ($('#starsLead')) $('#starsLead').textContent = STARS.lead || '';

    var prevStar = null;
    var starList = [];

    list.replaceChildren.apply(list, (STARS.members || []).map(function (m, i) {
      var src = avatarFor(m, prevStar);
      prevStar = src;
      starList.push(m);
      var li = h('li', { class: 'star reveal' },
        h('img', {
          class: 'star__avatar',
          src: src,
          alt: (m.name || m.gameId) + ' 的头像',
          loading: 'lazy'
        }),
        h('div', { class: 'star__body' },
          h('p', { class: 'star__name', text: m.name || m.gameId }),
          m.gameId ? h('p', { class: 'star__gid', text: m.gameId }) : null,
          m.note ? h('p', { class: 'star__note', text: m.note }) : null
        )
      );
      li.setAttribute('data-index', String(i));
      return li;
    }));

    list.addEventListener('click', function (e) {
      var card = e.target.closest('.star');
      if (!card) return;
      openProfile(starList, Number(card.getAttribute('data-index')) || 0);
    });
  }

  /* ---------------------------------------------------------------------
     5. 队员名单（lead:true 的提出来做重点卡）
     --------------------------------------------------------------------- */
  function renderMembers() {
    var list = $('#memberList');
    if (!list || typeof MEMBERS === 'undefined') return;

    var FIELDS = [
      { key: 'role',   label: '位置' },
      { key: 'rank',   label: '段位' },
      { key: 'joined', label: '入队时间' }
    ];

    var nodes = [];
    var prevAvatar = null;
    var rosterList = [];   /* 弹窗里可以左右翻页的次序 */

    /* 重点队员（指挥官等） */
    MEMBERS.filter(function (m) { return m.lead; }).forEach(function (m) {
      var src = avatarFor(m, prevAvatar);
      prevAvatar = src;
      nodes.push(h('li', { class: 'leadcard reveal' },
        h('img', { class: 'leadcard__avatar', src: src, alt: m.name + ' 的头像' }),
        h('div', { class: 'leadcard__body' },
          h('span', { class: 'leadcard__badge', text: m.role || '核心队员' }),
          h('p', { class: 'leadcard__name', text: m.name }),
          m.gameId ? h('p', { class: 'leadcard__gid', text: m.gameId }) : null,
          m.quote ? h('p', { class: 'leadcard__quote', text: '「' + m.quote + '」' }) : null
        )
      ));
    });

    /* 其余队员 */
    MEMBERS.filter(function (m) { return !m.lead; }).forEach(function (m, i) {
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
      var displayName = m.gameId || m.name;

      var mSrc = avatarFor(m, prevAvatar);
      prevAvatar = mSrc;

      var rowKids = [
        h('img', { class: 'member__avatar', src: mSrc, alt: displayName + ' 的头像', loading: 'lazy' }),
        h('div', { class: 'member__id' },
          h('h3', { class: 'member__name', text: displayName })
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

      var li = h('li', { class: 'card card--member reveal' }, kids);
      li.setAttribute('data-index', String(rosterList.length));
      rosterList.push(m);
      nodes.push(li);
    });

    list.replaceChildren.apply(list, nodes);

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

    /* 点整张卡片弹大图（点「展开资料」按钮时不弹） */
    list.addEventListener('click', function (e) {
      if (e.target.closest('.expand')) return;
      var card = e.target.closest('.card--member');
      if (!card) return;
      var i = Number(card.getAttribute('data-index'));
      openProfile(rosterList, isNaN(i) ? 0 : i);
    });
  }

  /* ---------------------------------------------------------------------
     5b. 队员档案弹窗（大图展示）
     --------------------------------------------------------------------- */
  var pfBox, pfArt, pfName, pfGid, pfStats, pfQuote, pfCount;
  var pfList = [];
  var pfIndex = 0;
  var pfLastFocus = null;

  var PF_FIELDS = [
    { key: 'role',   label: '位置' },
    { key: 'rank',   label: '段位' },
    { key: 'joined', label: '入队时间' }
  ];

  function pfRender() {
    var m = pfList[pfIndex];
    if (!m) return;

    pfArt.src = avatarFor(m, null, true);
    pfArt.alt = (m.name || m.gameId) + ' 的干员立绘';

    pfName.textContent = m.name || m.gameId || '—';
    /* 名字和 ID 一样时就不重复显示一行 */
    pfGid.textContent = (m.gameId && m.gameId !== m.name) ? m.gameId : '';

    var stats = PF_FIELDS.map(function (f) {
      var v = m[f.key];
      return h('div', null,
        h('dt', { text: f.label }),
        h('dd', { class: v ? null : 'is-empty', text: v || '待补充' })
      );
    });
    if (m.note) {
      stats.push(h('div', null,
        h('dt', { text: '荣誉' }),
        h('dd', { text: m.note })
      ));
    }
    pfStats.replaceChildren.apply(pfStats, stats);

    pfQuote.textContent = m.quote ? '「' + m.quote + '」' : '';
    pfCount.textContent = (pfIndex + 1) + ' / ' + pfList.length;
  }

  function pfMove(step) {
    if (!pfList.length) return;
    pfIndex = (pfIndex + step + pfList.length) % pfList.length;
    pfRender();
  }

  function openProfile(list, index) {
    if (!pfBox || !list || !list.length) return;
    pfList = list;
    pfIndex = Math.max(0, Math.min(index, list.length - 1));
    pfLastFocus = document.activeElement;

    pfRender();
    $('#profile').hidden = false;
    document.body.style.overflow = 'hidden';
    $('#profileClose').focus();
  }

  function closeProfile() {
    if (!pfBox || $('#profile').hidden) return;
    $('#profile').hidden = true;
    document.body.style.overflow = '';
    if (pfLastFocus && pfLastFocus.focus) pfLastFocus.focus();
  }

  function initProfile() {
    var box = $('#profile');
    if (!box) return;

    pfBox = box;
    pfArt = $('#pfArt');
    pfName = $('#pfName');
    pfGid = $('#pfGid');
    pfStats = $('#pfStats');
    pfQuote = $('#pfQuote');
    pfCount = $('#pfCount');

    $('#profileClose').addEventListener('click', closeProfile);
    $('#profilePrev').addEventListener('click', function () { pfMove(-1); });
    $('#profileNext').addEventListener('click', function () { pfMove(1); });

    box.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) closeProfile();
    });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') closeProfile();
      else if (e.key === 'ArrowLeft') pfMove(-1);
      else if (e.key === 'ArrowRight') pfMove(1);
    });
  }

  /* ---------------------------------------------------------------------
     6. 招新考核标准
     --------------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------------
     7. 滚动淡入
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
     8. 顶部导航：窄屏折叠菜单
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
     9. 滚动高亮：顶部导航当前板块
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
     10. 回到顶部
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
     11. 提示条 + 复制群号
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
  renderPillars();
  renderHighlight();
  renderAchievements();
  renderStars();
  renderMembers();
  renderRecruit();

  initReveal();
  initDrawer();
  initSpy();
  initProfile();
  initToTop();
  initCopy();

  window.addEventListener('scroll', function () {
    if (window.requestAnimationFrame) window.requestAnimationFrame(updateToTop);
  }, { passive: true });
})();
