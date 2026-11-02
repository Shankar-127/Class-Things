(function () {
  'use strict';

  const app = document.getElementById('app');
  const data = window.CLASS_THINGS_DATA;

  if (!app || !data) {
    return;
  }

  const subjects = data.subjects;
  const resources = data.resources;
  const subjectGuides = data.subjectGuides || {};
  const summary = data.summary;
  const populatedFolderCount = subjects.filter(function (subject) {
    return subject.fileCount > 0;
  }).length;

  function makeMathQuestion() {
    const left = Math.floor(Math.random() * 12) + 1;
    const right = Math.floor(Math.random() * 12) + 1;
    const operator = ['+', '-', '×'][Math.floor(Math.random() * 3)];
    const first = operator === '-' && right > left ? right : left;
    const second = operator === '-' && right > left ? left : right;
    return {
      text: first + ' ' + operator + ' ' + second,
      answer: operator === '+' ? first + second : operator === '-' ? first - second : first * second
    };
  }

  function makeMemoryCards() {
    const symbols = ['🍎', '⭐', '🎈', '🌙'];
    return symbols.concat(symbols).map(function (symbol, index) {
      return { id: index, symbol: symbol };
    }).sort(function () {
      return Math.random() - 0.5;
    });
  }

  const scrambleWords = ['planet', 'garden', 'school', 'pencil', 'orange', 'rocket', 'window', 'bridge'];
  const hangmanWords = ['PLANET', 'GARDEN', 'PUZZLE', 'ROCKET', 'ORANGE', 'STREAM'];

  function makeScrambleRound() {
    const word = scrambleWords[Math.floor(Math.random() * scrambleWords.length)];
    let scrambled = word.split('').sort(function () {
      return Math.random() - 0.5;
    }).join('');
    if (scrambled === word) {
      scrambled = word.slice(1) + word[0];
    }
    return { word: word, scrambled: scrambled };
  }

  function makeHangmanWord() {
    return hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
  }

  function ticTacToeWinner(board) {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (board[line[0]] && board[line[0]] === board[line[1]] && board[line[0]] === board[line[2]]) {
        return board[line[0]];
      }
    }
    return null;
  }

  const games = [
    { id: 'guess', icon: 'search', name: 'Number Guess', description: 'Find the hidden number from 1 to 100. Get a hint after each guess.', tone: 'blue', art: ['?', '1-100', 'HIGH / LOW'] },
    { id: 'rps', icon: 'dices', name: 'Rock Paper Scissors', description: 'Choose your move and see if you can beat the computer.', tone: 'violet', art: ['ROCK', 'PAPER', 'SCISSORS'] },
    { id: 'math', icon: 'atom', name: 'Quick Math', description: 'Solve bite-sized addition, subtraction and multiplication questions.', tone: 'amber', art: ['+', '-', 'x'] },
    { id: 'tic', icon: 'layout-grid', name: 'Tic-Tac-Toe', description: 'Take turns with a friend and try to get three marks in a row.', tone: 'blue', art: ['X', 'O', '3 IN A ROW'] },
    { id: 'memory', icon: 'sparkles', name: 'Memory Match', description: 'Flip the cards and find all four matching pairs in as few moves as you can.', tone: 'violet', art: ['?', '*', '?'] },
    { id: 'coin', icon: 'dices', name: 'Coin Flip', description: 'Make a quick call and let a virtual coin decide heads or tails.', tone: 'amber', art: ['H', '50/50', 'T'] },
    { id: 'dice', icon: 'dices', name: 'Dice Roll', description: 'Roll a six-sided die and see what number comes up.', tone: 'blue', art: ['1', '2', '6'] },
    { id: 'scramble', icon: 'book-open', name: 'Word Scramble', description: 'Rearrange the mixed-up letters into a familiar word.', tone: 'violet', art: ['A', 'B', 'Z'] },
    { id: 'hangman', icon: 'pencil-line', name: 'Hangman', description: 'Guess the hidden word one letter at a time. You have six misses.', tone: 'amber', art: ['A', 'B', 'C'] },
    { id: 'reaction', icon: 'clock-3', name: 'Reaction Test', description: 'Wait for the signal, then tap as quickly as you can.', tone: 'blue', art: ['WAIT', 'GO!', 'MS'] },
    { id: 'higher', icon: 'trending-up', name: 'Higher or Lower', description: 'Guess whether the next number will be higher or lower.', tone: 'green', art: ['7', '↑', '12'] },
    { id: 'color', icon: 'palette', name: 'Color Match', description: 'Match the color swatch to its name before the next round.', tone: 'pink', art: ['BLUE', 'RED', 'GREEN'] },
    { id: 'odd', icon: 'scan-search', name: 'Odd One Out', description: 'Spot the one shape that does not belong in the grid.', tone: 'cyan', art: ['●', '●', '▲'] }
  ];

  function gameArtwork(game) {
    const tileColors = game.id === 'color' ? ['#dbeafe', '#fee2e2', '#dcfce7'] : ['#dbeafe', '#ede9fe', '#fef3c7'];
    const inkColors = game.id === 'color' ? ['#1d4ed8', '#b91c1c', '#15803d'] : ['#1d4ed8', '#6d28d9', '#b45309'];
    const tiles = game.art.map(function (label, index) {
      const x = 20 + index * 100;
      const fontSize = label.length > 7 ? 12 : label.length > 3 ? 15 : 30;
      return '<rect x="' + x + '" y="17" width="82" height="76" rx="16" fill="' + tileColors[index] + '"/>' +
        '<text x="' + (x + 41) + '" y="64" text-anchor="middle" fill="' + inkColors[index] + '" font-size="' + fontSize + '" font-weight="800" font-family="system-ui, sans-serif">' + escapeHtml(label) + '</text>';
    }).join('');
    return '<svg class="game-art" viewBox="0 0 320 110" role="img" aria-label="' + escapeHtml(game.name) + ' game illustration" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="110" rx="14" fill="#f8fafc"/>' + tiles + '</svg>';
  }

  const colorPalette = [
    { name: 'Blue', value: '#2563eb' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Purple', value: '#9333ea' }
  ];

  function makeColorRound() {
    const target = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    return {
      target: target,
      choices: colorPalette.slice().sort(function () {
        return Math.random() - 0.5;
      })
    };
  }

  function makeOddRound() {
    const shapes = ['●', '▲', '■', '◆'];
    const commonIndex = Math.floor(Math.random() * shapes.length);
    let oddIndex = Math.floor(Math.random() * shapes.length);
    while (oddIndex === commonIndex) {
      oddIndex = Math.floor(Math.random() * shapes.length);
    }
    return {
      common: shapes[commonIndex],
      odd: shapes[oddIndex],
      oddIndex: Math.floor(Math.random() * 9)
    };
  }

  const sourceVisuals = {
    'CM LAB': { icon: 'laptop', tone: 'cyan' },
    DAA: { icon: 'code-2', tone: 'violet' },
    'DBMS LAB': { icon: 'hard-drive', tone: 'blue' },
    DBS: { icon: 'folder-open', tone: 'green' },
    'DEV LAB': { icon: 'pencil-line', tone: 'pink' },
    'I & E': { icon: 'zap', tone: 'amber' },
    JAVA: { icon: 'coffee', tone: 'orange' },
    'JAVA LAB': { icon: 'file-code-2', tone: 'violet' },
    LABS: { icon: 'flask-conical', tone: 'green' },
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
    ['overview', 'Overview'],
    ['topics', 'Key topics'],
    ['focus', 'Focus'],
    ['tip', 'Study tip'],
    ['status', 'Status']
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
    message: '',
    gameChoice: '',
    guessSecret: Math.floor(Math.random() * 100) + 1,
    guessInput: '',
    guessCount: 0,
    guessMessage: 'Pick a number from 1 to 100 to get started.',
    guessWon: false,
    rpsWins: 0,
    rpsLosses: 0,
    rpsDraws: 0,
    rpsMessage: 'Choose rock, paper or scissors.',
    mathQuestion: makeMathQuestion(),
    mathInput: '',
    mathScore: 0,
    mathMessage: 'Solve the problem, then check your answer.',
    ticBoard: Array(9).fill(null),
    ticTurn: 'X',
    memoryCards: makeMemoryCards(),
    memorySelected: [],
    memoryMatched: [],
    memoryMoves: 0,
    memoryLocked: false,
    coinResult: '',
    diceResult: null,
    scrambleRound: makeScrambleRound(),
    scrambleInput: '',
    scrambleMessage: 'Unscramble the letters to find the word.',
    hangmanWord: makeHangmanWord(),
    hangmanGuesses: [],
    reactionStatus: 'idle',
    reactionResult: '',
    reactionStarted: 0,
    higherNumber: Math.floor(Math.random() * 13) + 1,
    higherScore: 0,
    higherMessage: 'Will the next number be higher or lower?',
    colorRound: makeColorRound(),
    colorScore: 0,
    colorMessage: 'Match the swatch to its color name.',
    oddRound: makeOddRound(),
    oddScore: 0,
    oddMessage: 'Tap the one shape that is different.'
  };

  let toastTimer;
  let memoryTimer;
  let reactionTimer;

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
    window.clearTimeout(reactionTimer);
    state.reactionStatus = 'idle';
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
    state.gameChoice = '';

    if (route === 'recents') {
      state.page = 'home';
      state.activeNav = 'Recents';
      state.selectedSubject = null;
      state.filter = 'All';
      state.subjectSearch = '';
      state.sort = 'Newest';
      state.previewOrigin = 'sources';
    } else if (route === 'sources') {
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
    } else if (route === 'games') {
      state.page = 'games';
      state.activeNav = 'Games';
      const game = path[1];
      state.gameChoice = games.some(function (item) { return item.id === game; }) ? game : '';
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
        if (route === 'recents') {
          const recentFiles = document.querySelector('.recent-section');
          if (recentFiles) {
            recentFiles.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
  }

  function header() {
    const navItems = [
      ['Home', '#/home'],
      ['Recents', '#/recents'],
      ['Games', '#/games'],
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
    const recentCards = resources.slice().sort(function (first, second) {
      return second.modifiedMs - first.modifiedMs;
    }).slice(0, 5).map(function (resource) {
      const visual = getVisual(resource.subject);
      return '<article class="recent-card">' +
        '<div class="recent-top"><span class="file-icon tone-' + visual.tone + '">' + icon(visual.icon, 22) + '</span>' + typeBadge(resource.type) + '</div>' +
        '<h3>' + escapeHtml(resource.title) + '</h3>' +
        '<p>' + escapeHtml(resource.subject) + ' &middot; ' + escapeHtml(resource.filename) + '</p>' +
        '<div class="recent-bottom"><span>' + icon('clock-3', 14) + ' ' + escapeHtml(resource.modifiedAt) + '</span>' +
        '<button type="button" data-action="preview" data-resource-id="' + escapeHtml(resource.id) + '" aria-label="Open ' + escapeHtml(resource.title) + '">' + icon('arrow-right', 18) + '</button></div>' +
      '</article>';
    }).join('');
    const featuredGames = ['math', 'memory', 'scramble'].map(function (id) {
      const game = games.find(function (item) { return item.id === id; });
      return '<article class="home-game-card">' +
        gameArtwork(game) +
        '<h3>' + game.name + '</h3><p>' + game.description + '</p>' +
        '<button type="button" class="text-action" data-route="#/games/' + game.id + '">Play now ' + icon('arrow-right', 16) + '</button>' +
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
      '<section class="content-section container home-games-section">' +
        '<div class="section-heading"><div><span class="section-eyebrow">Take a study break</span><h2>Quick games</h2></div>' +
        '<button type="button" class="text-action" data-route="#/games">Explore all games ' + icon('arrow-right', 16) + '</button></div>' +
        '<div class="home-games-grid">' + featuredGames + '</div>' +
      '</section>' +
      '<section class="container study-banner">' +
        '<div class="study-icon">' + icon('graduation-cap', 25) + '</div>' +
        '<div><strong>Everything for your next study session.</strong><span>Keep your class materials tidy, useful, and ready when you are.</span></div>' +
        '<button type="button" class="text-action" data-route="#/sources">Browse all files ' + icon('arrow-right', 16) + '</button>' +
      '</section>' +
    '</main>';
  }

  function footer() {
    return '<footer class="site-footer">' +
      '<div class="container footer-main">' +
        '<div class="footer-about"><p>Your class notes, programs, and study breaks — all in one place.</p></div>' +
        '<div class="footer-links"><span class="footer-label">Explore</span>' +
          '<button type="button" data-route="#/sources">Study resources</button>' +
          '<button type="button" data-route="#/games">Quick games</button>' +
          '<button type="button" data-route="#/creator">About the creator</button></div>' +
        '<div class="footer-note"><span class="footer-label">A little reminder</span>' +
          '<p>Take it one topic at a time. You&rsquo;ve got this.</p></div>' +
      '</div>' +
      '<div class="container footer-bottom"><span>&copy; ' + new Date().getFullYear() + ' Class Things</span><span>Made for learning, one page at a time.</span></div>' +
    '</footer>';
  }

  function subjectPage() {
    const selectedFolder = subjects.find(function (subject) {
      return subject.name === state.selectedSubject;
    });
    const selectedGuide = state.selectedSubject ? (subjectGuides[state.selectedSubject] || {}) : {};
    const faculty = selectedGuide.faculty || '';
    const title = state.selectedSubject || 'All source files';
    const subtitle = state.selectedSubject
      ? (selectedFolder ? selectedFolder.fileCount : 0) + ' PDF files found in Sources/' + state.selectedSubject + '.'
      : summary.fileCount + ' PDF files across ' + summary.subjectCount + ' folders in Sources.';
    const filters = ['All', 'PDF'].map(function (filter) {
      return '<button type="button" class="' + (state.filter === filter ? 'active' : '') + '" data-action="set-filter" data-filter="' + filter + '">' + filter + '</button>';
    }).join('');
    const facultyMarkup = faculty
      ? '<div class="subject-faculty"><span class="subject-faculty-label">Faculty</span><strong>' + escapeHtml(faculty) + '</strong></div>'
      : '';

    return '<main class="subject-page container">' +
      '<section class="subject-hero source-subject-hero">' +
        '<div class="actual-subject-hero"><div>' +
          '<span class="breadcrumb">' + icon('folder-open', 15) + ' Sources ' + icon('chevron-right', 14) + ' ' + escapeHtml(state.selectedSubject || 'All folders') + '</span>' +
          '<h1>' + escapeHtml(title) + '</h1><p>' + escapeHtml(subtitle) + '</p>' +
          '<div class="subject-summary"><span>' + icon('file-down', 15) + ' ' + (state.selectedSubject ? (selectedFolder ? selectedFolder.fileCount : 0) : summary.fileCount) + ' PDFs</span><span>' + icon('folder-open', 15) + ' ' + escapeHtml(state.selectedSubject || summary.subjectCount + ' folders') + '</span></div>' +
          facultyMarkup +
        '</div>' +
      '</div>' +
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
    const empty = '<div class="empty-state">' + icon('search', 26) + '<strong>No resources found</strong><p>Try another search or category.</p></div>';
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

    var mainContent = '';
    if (resource && resource.type === 'PDF') {
      // Embed the PDF directly for a focused preview. Use an iframe so the browser's PDF viewer handles rendering.
      mainContent = '<div class="pdf-embed-wrap">' +
        '<iframe class="pdf-embed" src="' + escapeHtml(resource.url) + '" frameborder="0" allowfullscreen></iframe>' +
      '</div>';
    } else {
      var guide = subjectGuides[resource && resource.subject ? resource.subject : ''] || {};
      mainContent = '<article class="document-canvas">' +
        '<div class="paper-meta"><span class="paper-dot"></span> ' + escapeHtml(resource && resource.subject ? resource.subject.toUpperCase() : 'SUBJECT') + '</div>' +
        '<section id="overview"><h1>' + escapeHtml(guide.title || (resource && resource.subject) || 'Subject') + '</h1><p class="lead">' + escapeHtml(guide.summary || 'No overview available for this subject yet.') + '</p></section>' +
        '<section id="topics"><h3>Key topics</h3>' + (guide.topics && guide.topics.length ? ('<ul>' + guide.topics.map(function(t){ return '<li>' + escapeHtml(t) + '</li>'; }).join('') + '</ul>') : '<p>No topics listed yet.</p>') + '</section>' +
        '<section id="focus"><h3>Focus</h3><p>' + escapeHtml(guide.focus || '—') + '</p></section>' +
        '<section id="tip"><h3>Study tip</h3><p>' + escapeHtml(guide.tip || '—') + '</p></section>' +
        '<section id="status"><h3>Status</h3><p>' + escapeHtml(guide.status || 'No files yet for this subject.') + '</p></section>' +
      '</article>';
    }

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
        mainContent +
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

  function gamesPage() {
    const cards = state.gameChoice ? '' : games.map(function (game) {
      return '<article class="game-card' + (state.gameChoice === game.id ? ' selected' : '') + '">' +
        gameArtwork(game) +
        '<span class="game-card-icon tone-' + game.tone + '">' + icon(game.icon, 22) + '</span>' +
        '<h2>' + game.name + '</h2><p>' + game.description + '</p>' +
        '<button type="button" class="button button-secondary" data-action="select-game" data-game="' + game.id + '">Play game ' + icon('arrow-right', 16) + '</button>' +
      '</article>';
    }).join('');

    let panel = '';
    if (state.gameChoice === 'guess') {
      panel = '<section class="game-play-panel"><div class="game-panel-heading"><div><span class="section-eyebrow">Number Guess</span><h2>What&rsquo;s your guess?</h2></div><button type="button" class="button button-secondary small" data-action="reset-guess">New number</button></div>' +
        '<form class="game-form" data-game-form="guess"><label for="number-guess">Your number</label><div><input id="number-guess" type="number" min="1" max="100" step="1" data-model="guessInput" value="' + escapeHtml(state.guessInput) + '"' + (state.guessWon ? ' disabled' : '') + '><button class="button button-primary" type="submit"' + (state.guessWon ? ' disabled' : '') + '>Guess</button></div></form>' +
        '<p class="game-feedback" role="status">' + escapeHtml(state.guessMessage) + '</p><p class="game-score">Guesses: ' + state.guessCount + '</p></section>';
    } else if (state.gameChoice === 'rps') {
      panel = '<section class="game-play-panel"><div class="game-panel-heading"><div><span class="section-eyebrow">Rock Paper Scissors</span><h2>Make your move</h2></div><button type="button" class="button button-secondary small" data-action="reset-rps">Reset score</button></div>' +
        '<div class="game-choice-row"><button type="button" class="button button-secondary" data-action="play-rps" data-choice="Rock">Rock</button><button type="button" class="button button-secondary" data-action="play-rps" data-choice="Paper">Paper</button><button type="button" class="button button-secondary" data-action="play-rps" data-choice="Scissors">Scissors</button></div>' +
        '<p class="game-feedback" role="status">' + escapeHtml(state.rpsMessage) + '</p><p class="game-score">Wins: ' + state.rpsWins + ' · Losses: ' + state.rpsLosses + ' · Draws: ' + state.rpsDraws + '</p></section>';
    } else if (state.gameChoice === 'math') {
      panel = '<section class="game-play-panel"><div class="game-panel-heading"><div><span class="section-eyebrow">Quick Math</span><h2>Solve: ' + escapeHtml(state.mathQuestion.text) + ' = ?</h2></div><span class="game-score">Score: ' + state.mathScore + '</span></div>' +
        '<form class="game-form" data-game-form="math"><label for="math-answer">Your answer</label><div><input id="math-answer" type="number" step="1" data-model="mathInput" value="' + escapeHtml(state.mathInput) + '"><button class="button button-primary" type="submit">Check</button></div></form><p class="game-feedback" role="status">' + escapeHtml(state.mathMessage) + '</p></section>';
    } else if (state.gameChoice === 'tic') {
      const winner = ticTacToeWinner(state.ticBoard);
      const gameStatus = winner ? winner + ' wins!' : state.ticBoard.every(Boolean) ? 'It&rsquo;s a draw!' : state.ticTurn + '&rsquo;s turn';
      panel = '<section class="game-play-panel"><div class="game-panel-heading"><div><span class="section-eyebrow">Tic-Tac-Toe</span><h2>' + gameStatus + '</h2></div><button type="button" class="button button-secondary small" data-action="reset-tic">New game</button></div>' +
        '<div class="tic-board" role="group" aria-label="Tic-Tac-Toe board">' + state.ticBoard.map(function (mark, index) {
          return '<button type="button" class="tic-cell" data-action="tic-cell" data-cell="' + index + '" aria-label="Cell ' + (index + 1) + (mark ? ': ' + mark : '') + '"' + (mark || winner || state.ticBoard.every(Boolean) ? ' disabled' : '') + '>' + (mark || '') + '</button>';
        }).join('') + '</div></section>';
    } else if (state.gameChoice === 'memory') {
      const complete = state.memoryMatched.length === state.memoryCards.length;
      panel = '<section class="game-play-panel"><div class="game-panel-heading"><div><span class="section-eyebrow">Memory Match</span><h2>' + (complete ? 'All pairs found!' : 'Find the matching pairs') + '</h2></div><button type="button" class="button button-secondary small" data-action="reset-memory">New game</button></div>' +
        '<p class="game-score">Moves: ' + state.memoryMoves + '</p><div class="memory-board">' + state.memoryCards.map(function (card, index) {
          const revealed = state.memorySelected.indexOf(index) !== -1 || state.memoryMatched.indexOf(index) !== -1;
          const matched = state.memoryMatched.indexOf(index) !== -1;
          return '<button type="button" class="memory-card' + (revealed ? ' revealed' : '') + '" data-action="memory-card" data-cell="' + index + '" aria-label="Card ' + (index + 1) + (revealed ? ': ' + card.symbol : '') + '"' + (matched ? ' disabled' : '') + '>' + (revealed ? card.symbol : '?') + '</button>';
        }).join('') + '</div></section>';
    } else if (state.gameChoice === 'coin') {
      panel = '<section class="game-play-panel"><div class="game-panel-heading"><div><span class="section-eyebrow">Coin Flip</span><h2>' + (state.coinResult || 'Ready to flip?') + '</h2></div><button type="button" class="button button-primary" data-action="flip-coin">Flip coin</button></div><p class="game-feedback" role="status">' + (state.coinResult ? 'Flip again for another result.' : 'Call it in the air.') + '</p></section>';
    } else if (state.gameChoice === 'dice') {
      panel = '<section class="game-play-panel"><div class="game-panel-heading"><div><span class="section-eyebrow">Dice Roll</span><h2>' + (state.diceResult === null ? 'Ready to roll?' : 'You rolled a ' + state.diceResult + '!') + '</h2></div><button type="button" class="button button-primary" data-action="roll-dice">Roll die</button></div><p class="game-feedback" role="status">A fair six-sided roll, from 1 to 6.</p></section>';
    } else if (state.gameChoice === 'scramble') {
      panel = '<section class="game-play-panel"><div class="game-panel-heading"><div><span class="section-eyebrow">Word Scramble</span><h2 class="scramble-word">' + escapeHtml(state.scrambleRound.scrambled.toUpperCase()) + '</h2></div><button type="button" class="button button-secondary small" data-action="new-scramble">New word</button></div><form class="game-form" data-game-form="scramble"><label for="scramble-answer">Your word</label><div><input id="scramble-answer" data-model="scrambleInput" value="' + escapeHtml(state.scrambleInput) + '" autocomplete="off"><button class="button button-primary" type="submit">Check</button></div></form><p class="game-feedback" role="status">' + escapeHtml(state.scrambleMessage) + '</p></section>';
    } else if (state.gameChoice === 'hangman') {
      const wrong = state.hangmanGuesses.filter(function (letter) { return state.hangmanWord.indexOf(letter) === -1; }).length;
      const solved = state.hangmanWord.split('').every(function (letter) { return state.hangmanGuesses.indexOf(letter) !== -1; });
      const lost = wrong >= 6;
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function (letter) {
        const guessed = state.hangmanGuesses.indexOf(letter) !== -1;
        return '<button type="button" class="button button-secondary small" data-action="hangman-letter" data-letter="' + letter + '"' + (guessed || solved || lost ? ' disabled' : '') + '>' + letter + '</button>';
      }).join('');
      const wordTitle = solved ? 'You got it!' : lost ? 'The word was ' + state.hangmanWord + '.' : 'Guess the word';
      const word = state.hangmanWord.split('').map(function (letter) {
        return '<span>' + (state.hangmanGuesses.indexOf(letter) !== -1 || lost ? letter : '_') + '</span>';
      }).join('');
      panel = '<section class="game-play-panel"><div class="game-panel-heading"><div><span class="section-eyebrow">Hangman</span><h2>' + wordTitle + '</h2></div><button type="button" class="button button-secondary small" data-action="new-hangman">New word</button></div><p class="hangman-word">' + word + '</p><p class="game-score">Wrong guesses: ' + wrong + ' / 6</p><div class="hangman-letters">' + letters + '</div></section>';
    } else if (state.gameChoice === 'reaction') {
      const reactionTitle = state.reactionStatus === 'waiting' ? 'Wait for green…' : state.reactionStatus === 'ready' ? 'Tap now!' : state.reactionStatus === 'early' ? 'Too soon! Try again.' : state.reactionResult ? 'Your time: ' + state.reactionResult : 'Test your reflexes';
      const padText = state.reactionStatus === 'waiting' ? 'Wait…' : state.reactionStatus === 'ready' ? 'TAP!' : state.reactionStatus === 'early' ? 'Too soon' : 'Start the test above';
      const padClass = state.reactionStatus === 'ready' ? ' ready' : '';
      const reactionMessage = state.reactionResult ? 'Reaction time: ' + state.reactionResult : state.reactionStatus === 'early' ? 'Wait until the pad turns green before tapping.' : 'The signal appears after a random delay.';
      const startLabel = state.reactionStatus === 'waiting' || state.reactionStatus === 'ready' ? 'Try again' : 'Start test';
      panel = '<section class="game-play-panel"><div class="game-panel-heading"><div><span class="section-eyebrow">Reaction Test</span><h2>' + reactionTitle + '</h2></div><button type="button" class="button button-secondary small" data-action="start-reaction">' + startLabel + '</button></div><button type="button" class="reaction-pad' + padClass + '" data-action="reaction-click"' + (state.reactionStatus === 'waiting' || state.reactionStatus === 'ready' ? '' : ' disabled') + '>' + padText + '</button><p class="game-feedback" role="status">' + reactionMessage + '</p></section>';
    } else if (state.gameChoice === 'higher') {
      panel = '<section class="game-play-panel"><div class="game-panel-heading"><div><span class="section-eyebrow">Higher or Lower</span><h2>What comes next?</h2></div><span class="game-score">Score: ' + state.higherScore + '</span></div>' +
        '<div class="higher-card"><span>Current number</span><strong>' + state.higherNumber + '</strong></div>' +
        '<div class="game-choice-row"><button type="button" class="button button-secondary" data-action="higher-choice" data-choice="higher">Higher</button><button type="button" class="button button-secondary" data-action="higher-choice" data-choice="lower">Lower</button></div>' +
        '<p class="game-feedback" role="status">' + escapeHtml(state.higherMessage) + '</p><button type="button" class="button button-secondary small" data-action="reset-higher">Start over</button></section>';
    } else if (state.gameChoice === 'color') {
      panel = '<section class="game-play-panel"><div class="game-panel-heading"><div><span class="section-eyebrow">Color Match</span><h2>Which color is this?</h2></div><span class="game-score">Score: ' + state.colorScore + '</span></div>' +
        '<div class="color-target" style="background-color:' + state.colorRound.target.value + '" role="img" aria-label="Color swatch"></div>' +
        '<div class="game-choice-row color-choices">' + state.colorRound.choices.map(function (choice) {
          return '<button type="button" class="button button-secondary" data-action="color-choice" data-choice="' + choice.name + '">' + choice.name + '</button>';
        }).join('') + '</div>' +
        '<p class="game-feedback" role="status">' + escapeHtml(state.colorMessage) + '</p><button type="button" class="button button-secondary small" data-action="reset-color">Reset score</button></section>';
    } else if (state.gameChoice === 'odd') {
      panel = '<section class="game-play-panel"><div class="game-panel-heading"><div><span class="section-eyebrow">Odd One Out</span><h2>Find the different shape</h2></div><span class="game-score">Score: ' + state.oddScore + '</span></div>' +
        '<div class="odd-board" role="group" aria-label="Choose the shape that is different">' + Array.from({ length: 9 }, function (_, index) {
          const shape = index === state.oddRound.oddIndex ? state.oddRound.odd : state.oddRound.common;
          return '<button type="button" class="odd-cell" data-action="odd-choice" data-cell="' + index + '" aria-label="Shape ' + (index + 1) + ': ' + shape + '">' + shape + '</button>';
        }).join('') + '</div>' +
        '<p class="game-feedback" role="status">' + escapeHtml(state.oddMessage) + '</p><button type="button" class="button button-secondary small" data-action="reset-odd">Reset score</button></section>';
    }

    const selectedGame = games.find(function (game) { return game.id === state.gameChoice; });
    const heading = selectedGame ? selectedGame.name : 'Quick games';
    const intro = state.gameChoice ? 'Play a quick round, then head back to choose another game.' : 'Take a short brain break with these simple, free-to-play games.';
    const back = state.gameChoice ? '<button type="button" class="back-button games-back" data-route="#/games">' + icon('chevron-left', 18) + ' All games</button>' : '';
    return '<main class="games-page container"><section class="games-heading"><span class="eyebrow">' + icon('gamepad-2', 16) + ' A little break</span><h1>' + heading + '</h1><p>' + intro + '</p></section>' + back + (state.gameChoice ? '' : '<div class="games-grid">' + cards + '</div>') + panel + '</main>';
  }

  function pageMarkup() {
    if (state.page === 'games') {
      return gamesPage();
    }
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
    app.innerHTML = '<div class="app-shell ' + (state.theme === 'dark' ? 'dark' : '') + '">' + header() + pageMarkup() + footer() + '</div>';
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

    if (action === 'select-game') {
      routeTo('#/games/' + target.dataset.game);
    } else if (action === 'higher-choice') {
      const nextNumber = Math.floor(Math.random() * 13) + 1;
      const wasHigher = nextNumber > state.higherNumber;
      const wasLower = nextNumber < state.higherNumber;
      if (!wasHigher && !wasLower) {
        state.higherMessage = 'It was a tie! Try the next number.';
      } else {
        const correct = target.dataset.choice === 'higher' ? wasHigher : wasLower;
        state.higherMessage = correct ? 'Correct! It was ' + (wasHigher ? 'higher' : 'lower') + '.' : 'Not quite — it was ' + (wasHigher ? 'higher' : 'lower') + '.';
        if (correct) {
          state.higherScore += 1;
        }
      }
      state.higherNumber = nextNumber;
      render();
    } else if (action === 'reset-higher') {
      state.higherNumber = Math.floor(Math.random() * 13) + 1;
      state.higherScore = 0;
      state.higherMessage = 'Will the next number be higher or lower?';
      render();
    } else if (action === 'color-choice') {
      if (target.dataset.choice === state.colorRound.target.name) {
        state.colorScore += 1;
        state.colorMessage = 'Correct! Find the next color.';
      } else {
        state.colorMessage = 'Not quite — the swatch was ' + state.colorRound.target.name + '.';
      }
      state.colorRound = makeColorRound();
      render();
    } else if (action === 'reset-color') {
      state.colorScore = 0;
      state.colorMessage = 'Match the swatch to its color name.';
      state.colorRound = makeColorRound();
      render();
    } else if (action === 'odd-choice') {
      if (Number(target.dataset.cell) === state.oddRound.oddIndex) {
        state.oddScore += 1;
        state.oddMessage = 'You found it! Here comes another grid.';
        state.oddRound = makeOddRound();
      } else {
        state.oddMessage = 'Not that one — look for the different shape.';
      }
      render();
    } else if (action === 'reset-odd') {
      state.oddScore = 0;
      state.oddMessage = 'Tap the one shape that is different.';
      state.oddRound = makeOddRound();
      render();
    } else if (action === 'flip-coin') {
      state.coinResult = Math.random() < 0.5 ? 'Heads!' : 'Tails!';
      render();
    } else if (action === 'roll-dice') {
      state.diceResult = Math.floor(Math.random() * 6) + 1;
      render();
    } else if (action === 'new-scramble') {
      state.scrambleRound = makeScrambleRound();
      state.scrambleInput = '';
      state.scrambleMessage = 'Unscramble the letters to find the word.';
      render();
    } else if (action === 'hangman-letter') {
      if (state.hangmanGuesses.indexOf(target.dataset.letter) === -1) {
        state.hangmanGuesses.push(target.dataset.letter);
        render();
      }
    } else if (action === 'new-hangman') {
      state.hangmanWord = makeHangmanWord();
      state.hangmanGuesses = [];
      render();
    } else if (action === 'start-reaction') {
      window.clearTimeout(reactionTimer);
      state.reactionStatus = 'waiting';
      state.reactionResult = '';
      render();
      reactionTimer = window.setTimeout(function () {
        state.reactionStarted = performance.now();
        state.reactionStatus = 'ready';
        render();
      }, 1000 + Math.floor(Math.random() * 2500));
    } else if (action === 'reaction-click') {
      if (state.reactionStatus === 'waiting') {
        window.clearTimeout(reactionTimer);
        state.reactionStatus = 'early';
        state.reactionResult = '';
        render();
      } else if (state.reactionStatus === 'ready') {
        state.reactionResult = Math.round(performance.now() - state.reactionStarted) + ' ms';
        state.reactionStatus = 'done';
        render();
      }
    } else if (action === 'tic-cell') {
      const cell = Number(target.dataset.cell);
      if (!state.ticBoard[cell] && !ticTacToeWinner(state.ticBoard) && !state.ticBoard.every(Boolean)) {
        state.ticBoard[cell] = state.ticTurn;
        state.ticTurn = state.ticTurn === 'X' ? 'O' : 'X';
        render();
      }
    } else if (action === 'reset-tic') {
      state.ticBoard = Array(9).fill(null);
      state.ticTurn = 'X';
      render();
    } else if (action === 'memory-card') {
      const cell = Number(target.dataset.cell);
      if (!state.memoryLocked && state.memorySelected.indexOf(cell) === -1 && state.memoryMatched.indexOf(cell) === -1) {
        if (!state.memorySelected.length) {
          state.memorySelected = [cell];
        } else {
          const first = state.memorySelected[0];
          state.memorySelected = [first, cell];
          state.memoryMoves += 1;
          if (state.memoryCards[first].symbol === state.memoryCards[cell].symbol) {
            state.memoryMatched = state.memoryMatched.concat([first, cell]);
            state.memorySelected = [];
          } else {
            state.memoryLocked = true;
            memoryTimer = window.setTimeout(function () {
              state.memorySelected = [];
              state.memoryLocked = false;
              render();
            }, 750);
          }
        }
        render();
      }
    } else if (action === 'reset-memory') {
      window.clearTimeout(memoryTimer);
      state.memoryLocked = false;
      state.memoryCards = makeMemoryCards();
      state.memorySelected = [];
      state.memoryMatched = [];
      state.memoryMoves = 0;
      render();
    } else if (action === 'reset-guess') {
      state.guessSecret = Math.floor(Math.random() * 100) + 1;
      state.guessInput = '';
      state.guessCount = 0;
      state.guessMessage = 'Pick a number from 1 to 100 to get started.';
      state.guessWon = false;
      render();
    } else if (action === 'play-rps') {
      const player = target.dataset.choice;
      const choices = ['Rock', 'Paper', 'Scissors'];
      const computer = choices[Math.floor(Math.random() * choices.length)];
      if (player === computer) {
        state.rpsDraws += 1;
        state.rpsMessage = 'It’s a draw — you both chose ' + player + '.';
      } else if ((player === 'Rock' && computer === 'Scissors') || (player === 'Paper' && computer === 'Rock') || (player === 'Scissors' && computer === 'Paper')) {
        state.rpsWins += 1;
        state.rpsMessage = 'You win! ' + player + ' beats ' + computer + '.';
      } else {
        state.rpsLosses += 1;
        state.rpsMessage = 'Computer wins — ' + computer + ' beats ' + player + '.';
      }
      render();
    } else if (action === 'reset-rps') {
      state.rpsWins = 0;
      state.rpsLosses = 0;
      state.rpsDraws = 0;
      state.rpsMessage = 'Choose rock, paper or scissors.';
      render();
    } else if (action === 'toggle-global-search') {
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
    if (form.dataset.gameForm === 'guess') {
      const guess = Number(state.guessInput);
      if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
        state.guessMessage = 'Enter a whole number from 1 to 100.';
      } else {
        state.guessCount += 1;
        if (guess === state.guessSecret) {
          state.guessWon = true;
          state.guessMessage = 'You got it in ' + state.guessCount + (state.guessCount === 1 ? ' guess!' : ' guesses!');
        } else {
          state.guessMessage = guess < state.guessSecret ? 'Too low — try a higher number.' : 'Too high — try a lower number.';
        }
        state.guessInput = '';
      }
      render();
    } else if (form.dataset.gameForm === 'math') {
      if (!state.mathInput.trim()) {
        state.mathMessage = 'Enter an answer before checking.';
      } else if (Number(state.mathInput) === state.mathQuestion.answer) {
        state.mathScore += 1;
        state.mathMessage = 'Correct! Here comes another one.';
        state.mathQuestion = makeMathQuestion();
        state.mathInput = '';
      } else {
        state.mathMessage = 'Not quite — try again.';
      }
      render();
    } else if (form.dataset.gameForm === 'scramble') {
      if (state.scrambleInput.trim().toLowerCase() === state.scrambleRound.word) {
        state.scrambleMessage = 'Correct! Great unscrambling.';
      } else {
        state.scrambleMessage = 'Not quite — give it another try.';
      }
      render();
    } else if (form.dataset.form === 'global-search') {
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
