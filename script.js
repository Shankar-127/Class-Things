(function () {
  'use strict';

  const app = document.getElementById('app');
  const data = window.CLASS_THINGS_DATA;

  if (!app || !data) {
    return;
  }

  const subjects = data.subjects;
  const resources = data.resources;
  const summary = data.summary;
  const populatedFolderCount = subjects.filter(function (subject) {
    return subject.fileCount > 0;
  }).length;

  const sourceVisuals = {
    'CM LAB': { icon: 'laptop', tone: 'cyan' },
    DAA: { icon: 'code-2', tone: 'violet' },
    'DBMS LAB': { icon: 'hard-drive', tone: 'blue' },
    DBS: { icon: 'folder-open', tone: 'green' },
    'DEV LAB': { icon: 'pencil-line', tone: 'pink' },
    'I & E': { icon: 'zap', tone: 'amber' },
    JAVA: { icon: 'coffee', tone: 'orange' },
    'JAVA LAB': { icon: 'file-code-2', tone: 'violet' },
    SDE: { icon: 'book-open', tone: 'cyan' },
    SDT: { icon: 'file-text', tone: 'blue' }
  };

  const typeClasses = {
    Notes: 'tag-blue',
    PDF: 'tag-pink',
    Programs: 'tag-violet',
    'Question Papers': 'tag-amber'
  };

  const tocItems = [
    ['introduction', '1. Introduction'],
    ['divergence', '2. Divergence'],
    ['curl', '3. Curl'],
    ['identities', '4. Vector Identities'],
    ['examples', '5. Worked Examples']
  ];

  const state = {
    page: 'home',
    activeNav: 'Home',
    theme: readTheme(),
    mobileOpen: false,
    globalSearchOpen: false,
    globalSearch: '',
    filter: 'All',
    subjectSearch: '',
    sort: 'Newest',
    selectedSubject: null,
    selectedResource: resources[0] || null,
    previewOrigin: 'sources',
    activeSection: 'introduction',
    rating: 0,
    feedbackType: 'Idea',
    feedback: '',
    name: '',
    message: ''
  };

  let toastTimer;

  function readTheme() {
    try {
      return localStorage.getItem('class-things-theme') === 'dark' ? 'dark' : 'light';
    } catch (error) {
      return 'light';
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem('class-things-theme', theme);
    } catch (error) {
      // Theme persistence is optional for static hosting.
    }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  function icon(name, size, className) {
    const classAttribute = className ? ' class="' + escapeHtml(className) + '"' : '';
    return '<i data-lucide="' + escapeHtml(name) + '" width="' + size + '" height="' + size + '"' + classAttribute + '></i>';
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({
        attrs: { 'stroke-width': 1.8 }
      });
    }
  }

  function getVisual(subject) {
    return sourceVisuals[subject] || { icon: 'folder-open', tone: 'blue' };
  }

  function typeBadge(type) {
    return '<span class="type-badge ' + (typeClasses[type] || 'tag-blue') + '">' + escapeHtml(type) + '</span>';
  }

  function subjectRoute(subject) {
    return '#/subjects/' + encodeURIComponent(subject);
  }

  function previewRoute(resource) {
    const params = new URLSearchParams();
    params.set('id', resource.id);
    params.set('from', state.previewOrigin || activeOrigin());
    if (state.selectedSubject) {
      params.set('subject', state.selectedSubject);
    }
    return '#/preview?' + params.toString();
  }

  function activeOrigin() {
    if (state.activeNav === 'Subjects') {
      return 'subjects';
    }
    if (state.activeNav === 'PDFs') {
      return 'pdfs';
    }
    return 'sources';
  }

  function filteredResources() {
    const query = state.subjectSearch.trim().toLowerCase();
    const result = resources.filter(function (resource) {
      const inSubject = !state.selectedSubject || resource.subject === state.selectedSubject;
      const matchesType = state.filter === 'All' || resource.type === state.filter;
      const searchable = [resource.title, resource.filename, resource.subject].join(' ').toLowerCase();
      return inSubject && matchesType && (!query || searchable.indexOf(query) !== -1);
    });
    return state.sort === 'Oldest' ? result.slice().reverse() : result;
  }

  function routeTo(route) {
    state.mobileOpen = false;
    state.globalSearchOpen = false;
    if (window.location.hash === route) {
      applyRoute(false);
      return;
    }
    window.location.hash = route;
  }

  function applyRoute(scrollToTop) {
    const raw = window.location.hash.replace(/^#\/?/, '');
    const split = raw.split('?');
    const path = split[0].split('/').filter(Boolean);
    const params = new URLSearchParams(split[1] || '');
    const route = path[0] || 'home';

    state.globalSearchOpen = false;
    state.mobileOpen = false;
    state.activeSection = 'introduction';

    if (route === 'sources') {
      state.page = 'subject';
      state.activeNav = 'Sources';
      state.selectedSubject = null;
      state.filter = 'All';
      state.subjectSearch = params.get('q') || '';
      state.sort = 'Newest';
      state.previewOrigin = 'sources';
    } else if (route === 'subjects') {
      state.page = 'subject';
      state.activeNav = 'Subjects';
      state.selectedSubject = path[1] ? decodeURIComponent(path[1]) : null;
      state.filter = 'All';
      state.subjectSearch = params.get('q') || '';
      state.sort = 'Newest';
      state.previewOrigin = 'subjects';
    } else if (route === 'pdfs') {
      state.page = 'subject';
      state.activeNav = 'PDFs';
      state.selectedSubject = null;
      state.filter = 'PDF';
      state.subjectSearch = params.get('q') || '';
      state.sort = 'Newest';
      state.previewOrigin = 'pdfs';
    } else if (route === 'preview') {
      state.page = 'preview';
      const selected = resources.find(function (resource) {
        return resource.id === params.get('id');
      });
      state.selectedResource = selected || resources[0] || null;
      state.previewOrigin = params.get('from') || 'sources';
      state.selectedSubject = params.get('subject') || null;
      state.activeNav = state.previewOrigin === 'subjects' ? 'Subjects' : state.previewOrigin === 'pdfs' ? 'PDFs' : 'Sources';
    } else if (route === 'creator') {
      state.page = 'creator';
      state.activeNav = 'Creator';
    } else {
      state.page = 'home';
      state.activeNav = 'Home';
      state.selectedSubject = null;
      state.filter = 'All';
      state.subjectSearch = '';
      state.sort = 'Newest';
      state.previewOrigin = 'sources';
    }

    render();

    if (scrollToTop !== false) {
      window.setTimeout(function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
  }

  function header() {
    const navItems = [
      ['Home', '#/home'],
      ['Sources', '#/sources'],
      ['Subjects', '#/subjects'],
      ['PDFs', '#/pdfs'],
      ['Creator', '#/creator']
    ];
    const navMarkup = navItems.map(function (item) {
      return '<button type="button" class="nav-link ' + (state.activeNav === item[0] ? 'active' : '') + '" data-route="' + item[1] + '">' + item[0] + '</button>';
    }).join('');
    const quickLinks = state.page === 'creator'
      ? '<div class="creator-quick-links">' +
          '<button type="button" data-action="creator-section" data-section="feedback">' + icon('heart', 15) + ' Support</button>' +
          '<button type="button" data-action="creator-section" data-section="message">' + icon('message-circle', 15) + ' Message</button>' +
          '<button type="button" data-action="creator-section" data-section="coffee">' + icon('coffee', 15) + ' Coffee</button>' +
        '</div>'
      : '';
    const globalSearch = state.globalSearchOpen
      ? '<form class="global-search" data-form="global-search">' +
          icon('search', 18) +
          '<input id="global-search-input" name="query" value="' + escapeHtml(state.globalSearch) + '" placeholder="Search all resources..." autocomplete="off" />' +
          '<kbd>Enter</kbd>' +
        '</form>'
      : '';
    const mobileMenu = state.mobileOpen
      ? '<div class="mobile-menu">' + navItems.map(function (item) {
          return '<button type="button" class="' + (state.activeNav === item[0] ? 'active' : '') + '" data-route="' + item[1] + '">' + item[0] + icon('chevron-right', 17) + '</button>';
        }).join('') + '</div>'
      : '';

    return '<header class="site-header">' +
      '<div class="nav-wrap">' +
        '<button type="button" class="brand" data-route="#/home" aria-label="Class Things home">' +
          '<span class="brand-mark" aria-hidden="true"><img src="./Creator/CTL.jpg" alt="" /></span><span>Class Things</span>' +
        '</button>' +
        '<nav class="desktop-nav" aria-label="Main navigation">' + navMarkup + '</nav>' +
        '<div class="nav-actions">' +
          quickLinks +
          '<button type="button" class="icon-button" data-action="toggle-global-search" aria-label="Search resources">' + icon('search', 19) + '</button>' +
          '<button type="button" class="icon-button" data-action="toggle-theme" aria-label="Toggle color theme">' + icon(state.theme === 'light' ? 'moon' : 'sun', 18) + '</button>' +
          '<button type="button" class="icon-button menu-toggle" data-action="toggle-mobile-menu" aria-label="Toggle navigation menu">' + icon(state.mobileOpen ? 'x' : 'menu', 21) + '</button>' +
        '</div>' +
        globalSearch +
      '</div>' +
      mobileMenu +
    '</header>';
  }

  function statCard(iconName, value, label, tone) {
    return '<div class="stat-card"><span class="stat-icon tone-' + tone + '">' + icon(iconName, 20) + '</span><div><strong>' + escapeHtml(value) + '</strong><span>' + escapeHtml(label) + '</span></div></div>';
  }

  function sectionHeading(eyebrow, title, route) {
    return '<div class="section-heading"><div><span class="section-eyebrow">' + escapeHtml(eyebrow) + '</span><h2>' + escapeHtml(title) + '</h2></div>' +
      '<button type="button" class="text-action" data-route="' + route + '">View all files ' + icon('arrow-right', 16) + '</button></div>';
  }

  function heroIllustration() {
    return '<div class="hero-visual" aria-hidden="true">' +
      '<div class="visual-glow glow-one"></div><div class="visual-glow glow-two"></div>' +
      '<div class="floating-card note-float">' + icon('file-text', 20) + '<span>Notes</span>' + icon('check', 16) + '</div>' +
      '<div class="floating-card code-float">' + icon('code-2', 20) + '<span>{ }</span></div>' +
      '<div class="hero-scene">' +
        '<div class="cap"><div class="cap-top"></div><div class="cap-tassel"></div></div>' +
        '<div class="book-stack"><span></span><span></span><span></span></div>' +
        '<div class="laptop-screen"><div class="screen-header"><i></i><i></i><i></i></div><div class="screen-code"><b></b><b></b><b></b><b></b></div><div class="screen-chart"><span></span><span></span><span></span></div></div>' +
        '<div class="laptop-base"></div>' +
      '</div>' +
      '<div class="mini-orb orb-a"></div><div class="mini-orb orb-b"></div>' +
    '</div>';
  }

  function homePage() {
    const subjectCards = subjects.map(function (subject) {
      const visual = getVisual(subject.name);
      const count = subject.fileCount
        ? subject.fileCount + ' ' + (subject.fileCount === 1 ? 'PDF' : 'PDFs')
        : 'No files yet';
      return '<button type="button" class="subject-card" data-route="' + subjectRoute(subject.name) + '">' +
        '<span class="subject-icon tone-' + visual.tone + '">' + icon(visual.icon, 23) + '</span>' +
        '<span class="subject-name">' + escapeHtml(subject.name) + '</span>' +
        '<span class="subject-count">' + escapeHtml(count) + '</span>' +
        icon('arrow-right', 17, 'subject-arrow') +
      '</button>';
    }).join('');
    const recentCards = resources.slice(0, 4).map(function (resource) {
      const visual = getVisual(resource.subject);
      return '<article class="recent-card">' +
        '<div class="recent-top"><span class="file-icon tone-' + visual.tone + '">' + icon(visual.icon, 22) + '</span>' + typeBadge(resource.type) + '</div>' +
        '<h3>' + escapeHtml(resource.title) + '</h3>' +
        '<p>' + escapeHtml(resource.subject) + ' &middot; ' + escapeHtml(resource.filename) + '</p>' +
        '<div class="recent-bottom"><span>' + icon('clock-3', 14) + ' ' + escapeHtml(resource.modifiedAt) + '</span>' +
        '<button type="button" data-action="preview" data-resource-id="' + escapeHtml(resource.id) + '" aria-label="Open ' + escapeHtml(resource.title) + '">' + icon('arrow-right', 18) + '</button></div>' +
      '</article>';
    }).join('');

    return '<main>' +
      '<section class="home-hero container">' +
        '<div class="hero-copy">' +
          '<span class="eyebrow">' + icon('sparkles', 15) + ' Your classroom, organized.</span>' +
          '<h1>All class notes &amp; programs <span>in one place.</span></h1>' +
          '<p>Access notes, question papers, PDFs and programs shared by your teachers &mdash; anytime, anywhere.</p>' +
          '<div class="hero-actions">' +
            '<button type="button" class="button button-primary" data-route="#/subjects">Explore source folders ' + icon('arrow-right', 18) + '</button>' +
            '<button type="button" class="button button-secondary" data-route="#/pdfs">View all PDFs</button>' +
          '</div>' +
          '<div class="stat-grid" aria-label="Class Things statistics">' +
            statCard('book-open', summary.subjectCount, 'Source folders', 'blue') +
            statCard('file-down', summary.fileCount, 'PDF files', 'green') +
            statCard('folder-open', populatedFolderCount, 'With files', 'amber') +
            statCard('hard-drive', summary.subjectCount - populatedFolderCount, 'Empty folders', 'violet') +
          '</div>' +
        '</div>' +
        heroIllustration() +
      '</section>' +
      '<section class="content-section container" id="subjects">' +
        sectionHeading('Your local library', 'Explore source folders', '#/sources') +
        '<div class="subject-grid">' + subjectCards + '</div>' +
      '</section>' +
      '<section class="content-section container recent-section">' +
        sectionHeading('From the Sources folder', 'Recently added files', '#/sources') +
        '<div class="recent-grid">' + recentCards + '</div>' +
      '</section>' +
      '<section class="container study-banner">' +
        '<div class="study-icon">' + icon('graduation-cap', 25) + '</div>' +
        '<div><strong>Everything for your next study session.</strong><span>Keep your class materials tidy, useful, and ready when you are.</span></div>' +
        '<button type="button" class="text-action" data-route="#/sources">Browse all files ' + icon('arrow-right', 16) + '</button>' +
      '</section>' +
    '</main>';
  }

  function subjectPage() {
    const selectedFolder = subjects.find(function (subject) {
      return subject.name === state.selectedSubject;
    });
    const title = state.selectedSubject || 'All source files';
    const subtitle = state.selectedSubject
      ? (selectedFolder ? selectedFolder.fileCount : 0) + ' PDF files found in Sources/' + state.selectedSubject + '.'
      : summary.fileCount + ' PDF files across ' + summary.subjectCount + ' folders in Sources.';
    const filters = ['All', 'PDF'].map(function (filter) {
      return '<button type="button" class="' + (state.filter === filter ? 'active' : '') + '" data-action="set-filter" data-filter="' + filter + '">' + filter + '</button>';
    }).join('');

    return '<main class="subject-page container">' +
      '<section class="subject-hero source-subject-hero">' +
        '<div class="actual-subject-hero"><div>' +
          '<span class="breadcrumb">' + icon('folder-open', 15) + ' Sources ' + icon('chevron-right', 14) + ' ' + escapeHtml(state.selectedSubject || 'All folders') + '</span>' +
          '<h1>' + escapeHtml(title) + '</h1><p>' + escapeHtml(subtitle) + '</p>' +
          '<div class="subject-summary"><span>' + icon('file-down', 15) + ' ' + (state.selectedSubject ? (selectedFolder ? selectedFolder.fileCount : 0) : summary.fileCount) + ' PDFs</span><span>' + icon('folder-open', 15) + ' ' + escapeHtml(state.selectedSubject || summary.subjectCount + ' folders') + '</span></div>' +
        '</div>' +
        '<button type="button" class="button button-primary" data-action="clear-filters">' + icon('filter', 18) + ' Clear filters</button></div>' +
      '</section>' +
      '<section class="resource-panel">' +
        '<div class="filter-tabs" aria-label="Resource categories">' + filters + '</div>' +
        '<div class="resource-controls">' +
          '<button type="button" class="filter-button" data-action="filter-info">' + icon('list-filter', 17) + ' Filters ' + icon('chevron-down', 15) + '</button>' +
          '<label class="inline-search">' + icon('search', 18) + '<input id="subject-search" value="' + escapeHtml(state.subjectSearch) + '" placeholder="Search in ' + escapeHtml(state.selectedSubject || 'Sources') + '..." autocomplete="off" />' +
            '<button type="button" data-action="clear-search" aria-label="Clear search">' + (state.subjectSearch ? icon('x', 16) : '') + '</button></label>' +
          '<label class="sort-select">Sort by:<select id="resource-sort"><option' + (state.sort === 'Newest' ? ' selected' : '') + '>Newest</option><option' + (state.sort === 'Oldest' ? ' selected' : '') + '>Oldest</option></select>' + icon('chevron-down', 15) + '</label>' +
        '</div>' +
        '<div id="resource-results">' + resourceResults() + '</div>' +
      '</section>' +
      '<section class="request-strip"><div class="request-strip-icon">' + icon('sparkles', 21) + '</div><div><strong>Can&rsquo;t find what you&rsquo;re looking for?</strong><span>Tell us what would help your next revision session.</span></div><button type="button" data-action="request-resource">Make a request ' + icon('arrow-right', 16) + '</button></section>' +
    '</main>';
  }

  function resourceResults() {
    const filtered = filteredResources();
    const rows = filtered.map(resourceRow).join('');
    const empty = '<div class="empty-state">' + icon('search', 26) + '<strong>No resources found</strong><p>Try another search or category.</p><button type="button" class="button button-secondary" data-action="clear-filters">Clear filters</button></div>';
    return '<div class="resource-list-head"><span>' + filtered.length + ' ' + (filtered.length === 1 ? 'file' : 'files') + ' found</span><span>Actual files from Sources</span></div>' +
      '<div class="resource-list">' + (rows || empty) + '</div>';
  }

  function resourceRow(resource) {
    const visual = getVisual(resource.subject);
    return '<article class="resource-row">' +
      '<span class="resource-icon tone-' + visual.tone + '">' + icon(visual.icon, 23) + '</span>' +
      '<div class="resource-info"><h3>' + escapeHtml(resource.title) + '</h3><p>' + escapeHtml(resource.subject) + '<span class="dot"></span>' + escapeHtml(resource.filename) + '<span class="dot"></span>' + escapeHtml(resource.size) + '<span class="dot"></span>' + escapeHtml(resource.modifiedAt) + '</p></div>' +
      typeBadge(resource.type) +
      '<div class="row-actions">' +
        '<button type="button" data-action="download" data-resource-id="' + escapeHtml(resource.id) + '" aria-label="Download ' + escapeHtml(resource.title) + '">' + icon('download', 18) + '</button>' +
        '<button type="button" data-action="preview" data-resource-id="' + escapeHtml(resource.id) + '" aria-label="View ' + escapeHtml(resource.title) + '">' + icon('eye', 18) + '</button>' +
        '<a class="desktop-more" href="' + escapeHtml(resource.url) + '" target="_blank" rel="noreferrer" aria-label="Open ' + escapeHtml(resource.title) + ' in a new tab">' + icon('more-vertical', 18) + '</a>' +
      '</div>' +
    '</article>';
  }

  function previewPage() {
    const resource = state.selectedResource;
    const details = [
      ['file-text', 'Type', resource ? resource.type : 'PDF'],
      ['book-open', 'Subject', resource ? resource.subject : 'Unknown'],
      ['users', 'Uploaded by', 'Class Things'],
      ['calendar-days', 'Uploaded on', resource ? resource.modifiedAt : '20 Aug 2026'],
      ['hard-drive', 'Size', resource ? resource.size : '—'],
      ['download', 'Downloads', '128']
    ].map(function (detail) {
      return '<div><dt><span>' + icon(detail[0], 16) + '</span>' + detail[1] + '</dt><dd>' + escapeHtml(detail[2]) + '</dd></div>';
    }).join('');
    const toc = tocItems.map(function (item) {
      return '<button type="button" class="' + (state.activeSection === item[0] ? 'active' : '') + '" data-action="jump-section" data-section="' + item[0] + '">' + item[1] + '</button>';
    }).join('');
    const related = resources.filter(function (item) {
      return !resource || item.id !== resource.id;
    }).slice(0, 3).map(function (item) {
      return '<button type="button" class="related-item" data-action="preview" data-resource-id="' + escapeHtml(item.id) + '">' +
        '<span class="related-file">' + icon('file-text', 17) + '</span><span><strong>' + escapeHtml(item.title) + '</strong><em>' + escapeHtml(item.type) + '</em></span>' + icon('chevron-right', 16) +
      '</button>';
    }).join('');

    return '<main class="preview-page">' +
      '<div class="preview-topbar"><div class="container preview-topbar-inner">' +
        '<button type="button" class="back-button" data-action="back-preview">' + icon('chevron-left', 20) + ' <span>Back to ' + escapeHtml(resource && resource.subject ? resource.subject : 'Subjects') + '</span></button>' +
        '<div class="preview-title"><span>' + escapeHtml(resource && resource.subject ? resource.subject : 'Subjects') + ' / Notes</span><strong>' + escapeHtml(resource && resource.title ? resource.title : 'Document') + '</strong></div>' +
        '<div class="preview-actions">' +
          '<button type="button" class="button button-secondary small" data-action="download" data-resource-id="' + escapeHtml(resource ? resource.id : '') + '">' + icon('download', 17) + '<span>Download</span></button>' +
          '<button type="button" class="icon-button" data-action="share" aria-label="Share document">' + icon('share-2', 18) + '</button>' +
          '<button type="button" class="icon-button" data-action="preview-options" aria-label="More document options">' + icon('more-horizontal', 19) + '</button>' +
        '</div>' +
      '</div></div>' +
      '<div class="preview-mobile-tools container"><button type="button" data-action="scroll-to" data-section="contents">' + icon('layout-grid', 16) + ' Contents</button><button type="button" data-action="scroll-to" data-section="details">' + icon('list-filter', 16) + ' Details</button></div>' +
      '<div class="preview-layout container">' +
        '<aside class="toc-card" id="contents"><span class="aside-title">On this page</span>' + toc + '<div class="toc-divider"></div><span class="toc-progress"><span></span><em>18% read</em></span></aside>' +
        '<article class="document-canvas">' +
          '<div class="paper-meta"><span class="paper-dot"></span> ' + escapeHtml(resource && resource.subject ? resource.subject.toUpperCase() : 'SUBJECT') + ' &middot; UNIT 3 <span>5 min read</span></div>' +
          '<section id="introduction"><h1>Vector Calculus</h1><h2>Divergence &amp; Curl</h2><p class="lead">Vector calculus gives us a beautiful way to describe how a vector field behaves at every point in space. Two of its most useful tools are <b>divergence</b> and <b>curl</b>.</p><div class="callout">' + icon('sparkles', 19) + '<p><strong>Key idea</strong> &mdash; Divergence measures outflow; curl measures rotation.</p></div></section>' +
          '<section id="divergence"><h3>2. Divergence</h3><p>The divergence of a vector field tells us how much the field spreads outward from a point. For a vector field <i>F</i> = P<i>i</i> + Q<i>j</i> + R<i>k</i>:</p><div class="equation">&nabla; &middot; <b>F</b> = <span>&part;P</span>/<span>&part;x</span> + <span>&part;Q</span>/<span>&part;y</span> + <span>&part;R</span>/<span>&part;z</span></div><ul><li>Positive divergence: the point behaves like a source.</li><li>Negative divergence: the point behaves like a sink.</li><li>Zero divergence: no net flow leaves the point.</li></ul></section>' +
          '<section id="curl"><h3>3. Curl</h3><p>While divergence captures expansion, curl measures the local tendency of a field to rotate around a point.</p><div class="equation equation-curl">&nabla; &times; <b>F</b> = <span class="matrix">| i &nbsp; j &nbsp; k<br>&part;/&part;x &nbsp; &part;/&part;y &nbsp; &part;/&part;z<br>P &nbsp; Q &nbsp; R |</span></div></section>' +
          '<section id="identities"><h3>4. Vector identities</h3><div class="identity-grid"><div><span>&nabla; &middot; (&nabla; &times; F)</span><strong>= 0</strong></div><div><span>&nabla; &times; (&nabla;&phi;)</span><strong>= 0</strong></div></div></section>' +
          '<section id="examples"><h3>5. Worked example</h3><p>For <i>F</i> = x&sup2;<i>i</i> + yz<i>j</i> + xz<i>k</i>, calculate the divergence by differentiating each component with respect to its matching coordinate.</p><div class="answer-box">' + icon('check-circle-2', 18) + '<span>Answer: &nabla; &middot; F = 2x + x + y</span></div></section>' +
        '</article>' +
        '<aside class="details-stack" id="details"><div class="details-card"><span class="aside-title">File details</span><dl>' + details + '</dl></div><div class="related-card"><div class="related-head"><span class="aside-title">Related files</span><button type="button" data-action="back-preview">See all</button></div>' + related + '</div></aside>' +
      '</div>' +
    '</main>';
  }

  function cardTop(iconName, title, text, tone) {
    return '<div class="card-top"><span class="card-top-icon tone-' + tone + '">' + icon(iconName, 20) + '</span><div><h2>' + escapeHtml(title) + '</h2><p>' + escapeHtml(text) + '</p></div></div>';
  }

  function highlight(iconName, title, text, tone) {
    return '<div class="highlight"><span class="highlight-icon tone-' + tone + '">' + icon(iconName, 20) + '</span><div><strong>' + escapeHtml(title) + '</strong><span>' + escapeHtml(text) + '</span></div></div>';
  }

  function creatorPortrait() {
    return '<div class="creator-visual">' +
      '<div class="creator-orb creator-orb-one"></div><div class="creator-orb creator-orb-two"></div>' +
      '<div class="creator-photo-frame"><img src="./Creator/shankar.jpg" alt="Shankar, creator of Class Things"></div>' +
      '<div class="creator-photo-caption"><span>Creator</span><strong>Shankar</strong><small>Built for better study days</small></div>' +
      '<div class="creator-mini-card">' + icon('code-2', 17) + '<span>Student-first design</span></div>' +
      '<div class="creator-love-note">' + icon('heart', 16) + ' made with care</div>' +
    '</div>';
  }

  function creatorPage() {
    const stars = [1, 2, 3, 4, 5].map(function (value) {
      const selected = value <= state.rating;
      return '<button type="button" class="' + (selected ? 'selected' : '') + '" data-action="set-rating" data-rating="' + value + '" aria-label="' + value + ' stars">' + icon('star', 27) + '</button>';
    }).join('');
    const feedbackChoices = ['Idea', 'Bug report', 'Just saying hi'].map(function (choice) {
      return '<label><input type="radio" name="feedback-type" value="' + escapeHtml(choice) + '" data-action="set-feedback-type"' + (state.feedbackType === choice ? ' checked' : '') + '> <span>' + escapeHtml(choice) + '</span></label>';
    }).join('');

    return '<main class="creator-page container">' +
      '<section class="creator-hero">' +
        '<div class="creator-intro"><span class="eyebrow pink-eyebrow">' + icon('heart', 15) + ' Thank you for using Class Things!</span><h1>Hi! I&rsquo;m the creator of <span>Class Things.</span></h1><p>I made this little space to make student life feel a bit more organized, less overwhelming, and easier to share.</p><div class="creator-highlights">' +
          highlight('users', 'Made for students', 'Built around your study flow.', 'blue') +
          highlight('zap', 'Simple & fast', 'Find what you need, quickly.', 'amber') +
          highlight('heart', 'Always free', 'Learning should stay accessible.', 'pink') +
        '</div></div>' +
        creatorPortrait() +
      '</section>' +
      '<section class="creator-story-grid">' +
        '<article class="why-card"><span class="section-eyebrow">A small idea, made useful</span><h2>Why I built this?</h2><p>Notes often end up scattered across chats, drives and forgotten folders. Class Things brings the useful stuff together so your energy can go into learning, not searching.</p><div class="quote-line"><span>&ldquo;</span> A calmer desk starts with a calmer digital space.</div></article>' +
        '<aside class="about-card"><div class="about-top"><img class="creator-avatar" src="./Creator/shankar.jpg" alt="Shankar, creator of Class Things"><div><span>About</span><h3>Shankar</h3><p>Frontend developer</p></div></div><p class="about-bio">Frontend developer &mdash; loves clean UI &amp; UX.</p><ul><li>' + icon('code-2', 16) + ' Frontend developer</li><li>' + icon('sparkles', 16) + ' Loves clean UI &amp; UX</li><li>' + icon('coffee', 16) + ' Coffee lover</li><li>' + icon('graduation-cap', 16) + ' Always learning</li></ul></aside>' +
      '</section>' +
      '<section class="creator-form-grid">' +
        '<form class="support-card feedback-card" id="feedback" data-form="feedback">' +
          cardTop('star', 'Share your feedback', 'Your thoughts help make Class Things better.', 'amber') +
          '<fieldset class="rating-field"><legend>How&rsquo;s your experience?</legend><div class="stars">' + stars + '</div></fieldset>' +
          '<fieldset class="radio-field"><legend>What would you like to share?</legend><div>' + feedbackChoices + '</div></fieldset>' +
          '<label class="field-label">Anything else?<textarea data-model="feedback" placeholder="Tell me what&rsquo;s on your mind...">' + escapeHtml(state.feedback) + '</textarea></label>' +
          '<button class="button button-primary full-width" type="submit">' + icon('send', 17) + ' Send feedback</button>' +
        '</form>' +
        '<form class="support-card message-card" id="message" data-form="message">' +
          cardTop('message-circle', 'Message the creator', 'A note, idea, or a friendly hello — I&rsquo;d love to hear it.', 'blue') +
          '<label class="field-label">Your name <span>(optional)</span><input data-model="name" value="' + escapeHtml(state.name) + '" placeholder="What should I call you?"></label>' +
          '<label class="field-label">Your message<textarea data-model="message" placeholder="Write your message here...">' + escapeHtml(state.message) + '</textarea></label>' +
          '<div class="privacy-note">' + icon('check-circle-2', 17) + '<span>This message goes directly to the creator. No spam, ever.</span></div>' +
          '<button class="button button-primary full-width" type="submit">' + icon('message-circle', 17) + ' Send message</button>' +
        '</form>' +
        '<article class="support-card coffee-card" id="coffee">' +
          cardTop('coffee', 'Buy me a coffee', 'If Class Things made your day easier, a little support means a lot.', 'pink') +
          '<div class="coffee-body"><div class="coffee-benefits"><span>What your support helps with</span><ul><li>' + icon('check', 15) + ' Keeping the site online</li><li>' + icon('check', 15) + ' Adding useful features</li><li>' + icon('check', 15) + ' More coffee-fuelled ideas</li></ul></div><div class="qr-wrap"><img src="./Creator/CQFC.jpg" alt="UPI QR code to buy Shankar a coffee"><span>Scan to support Class Things</span></div></div>' +
          '<div class="coffee-thanks">' + icon('coffee', 18) + ' Thanks a latte! ' + icon('heart', 15) + '</div>' +
        '</article>' +
      '</section>' +
    '</main>';
  }

  function pageMarkup() {
    if (state.page === 'subject') {
      return subjectPage();
    }
    if (state.page === 'preview') {
      return previewPage();
    }
    if (state.page === 'creator') {
      return creatorPage();
    }
    return homePage();
  }

  function render() {
    app.innerHTML = '<div class="app-shell ' + (state.theme === 'dark' ? 'dark' : '') + '">' + header() + pageMarkup() + '</div>';
    refreshIcons();
    document.querySelector('meta[name="theme-color"]').setAttribute('content', state.theme === 'dark' ? '#0b1220' : '#2563eb');

    if (state.globalSearchOpen) {
      const searchInput = document.getElementById('global-search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }
  }

  function renderSubjectResults() {
    const results = document.getElementById('resource-results');
    if (results) {
      results.innerHTML = resourceResults();
      refreshIcons();
    }
  }

  function notify(message) {
    const shell = document.querySelector('.app-shell');
    if (!shell) {
      return;
    }
    const existing = shell.querySelector('.toast');
    if (existing) {
      existing.remove();
    }
    shell.insertAdjacentHTML('beforeend', '<div class="toast" role="status">' + icon('check-circle-2', 17) + escapeHtml(message) + '</div>');
    refreshIcons();
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      const toast = document.querySelector('.toast');
      if (toast) {
        toast.remove();
      }
    }, 3000);
  }

  function resourceById(id) {
    return resources.find(function (resource) {
      return resource.id === id;
    });
  }

  function downloadResource(resource) {
    if (!resource) {
      return;
    }
    const link = document.createElement('a');
    link.href = resource.url;
    link.download = resource.filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    notify('Downloading ' + resource.filename);
  }

  function shareResource(resource) {
    if (!resource) {
      return;
    }
    const shareData = {
      title: resource.title,
      text: resource.filename + ' from the Class Things source library.',
      url: new URL(resource.url, document.baseURI).href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(function () {
        notify('Sharing was cancelled.');
      });
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url).then(function () {
        notify('Link copied to your clipboard.');
      }).catch(function () {
        notify('Copy the file link from your browser address bar.');
      });
      return;
    }
    notify('Share link ready to copy.');
  }

  function backFromPreview() {
    if (state.previewOrigin === 'subjects') {
      routeTo(state.selectedSubject ? subjectRoute(state.selectedSubject) : '#/subjects');
      return;
    }
    if (state.previewOrigin === 'pdfs') {
      routeTo('#/pdfs');
      return;
    }
    routeTo('#/sources');
  }

  app.addEventListener('click', function (event) {
    const target = event.target.closest('[data-route], [data-action]');
    if (!target || !app.contains(target)) {
      return;
    }

    if (target.dataset.route) {
      event.preventDefault();
      routeTo(target.dataset.route);
      return;
    }

    const action = target.dataset.action;
    const resource = resourceById(target.dataset.resourceId);

    if (action === 'toggle-global-search') {
      state.globalSearchOpen = !state.globalSearchOpen;
      render();
    } else if (action === 'toggle-theme') {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      saveTheme(state.theme);
      render();
    } else if (action === 'toggle-mobile-menu') {
      state.mobileOpen = !state.mobileOpen;
      render();
    } else if (action === 'preview' && resource) {
      state.previewOrigin = activeOrigin();
      routeTo(previewRoute(resource));
    } else if (action === 'download') {
      downloadResource(resource);
    } else if (action === 'share') {
      shareResource(state.selectedResource);
    } else if (action === 'preview-options') {
      notify('More file options will appear here.');
    } else if (action === 'back-preview') {
      backFromPreview();
    } else if (action === 'set-filter') {
      state.filter = target.dataset.filter || 'All';
      render();
    } else if (action === 'clear-filters') {
      state.filter = 'All';
      state.subjectSearch = '';
      render();
    } else if (action === 'clear-search') {
      state.subjectSearch = '';
      const input = document.getElementById('subject-search');
      if (input) {
        input.value = '';
        input.focus();
      }
      renderSubjectResults();
      const clearButton = target;
      clearButton.innerHTML = '';
    } else if (action === 'filter-info') {
      notify('Use the category tabs and search box to narrow the files.');
    } else if (action === 'request-resource') {
      notify('Your request has been noted!');
    } else if (action === 'jump-section') {
      state.activeSection = target.dataset.section || 'introduction';
      const section = document.getElementById(state.activeSection);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      render();
      window.setTimeout(function () {
        const selected = document.getElementById(state.activeSection);
        if (selected) {
          selected.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    } else if (action === 'scroll-to') {
      const section = document.getElementById(target.dataset.section);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (action === 'creator-section') {
      const section = document.getElementById(target.dataset.section);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (action === 'set-rating') {
      state.rating = Number(target.dataset.rating) || 0;
      render();
    } else if (action === 'set-feedback-type') {
      state.feedbackType = target.value;
      render();
    }
  });

  app.addEventListener('input', function (event) {
    if (event.target.id === 'global-search-input') {
      state.globalSearch = event.target.value;
    } else if (event.target.id === 'subject-search') {
      state.subjectSearch = event.target.value;
      renderSubjectResults();
    } else if (event.target.dataset.model) {
      state[event.target.dataset.model] = event.target.value;
    }
  });

  app.addEventListener('change', function (event) {
    if (event.target.id === 'resource-sort') {
      state.sort = event.target.value;
      renderSubjectResults();
    }
  });

  app.addEventListener('submit', function (event) {
    const form = event.target;
    event.preventDefault();
    if (form.dataset.form === 'global-search') {
      const query = state.globalSearch.trim();
      routeTo('#/sources' + (query ? '?q=' + encodeURIComponent(query) : ''));
    } else if (form.dataset.form === 'feedback') {
      notify(state.rating ? 'Thanks — your feedback was sent!' : 'Choose a star rating before sending.');
    } else if (form.dataset.form === 'message') {
      if (state.message.trim()) {
        state.message = '';
        render();
        notify('Your message is on its way to the creator.');
      } else {
        notify('Write a short message first.');
      }
    }
  });

  window.addEventListener('hashchange', function () {
    applyRoute(true);
  });

  if (!window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search + '#/home');
  }
  applyRoute(false);
}());
