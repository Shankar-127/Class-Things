import { useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight,
  Atom,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircuitBoard,
  Clock3,
  Code2,
  Coffee,
  Copy,
  Download,
  Eye,
  FileCode2,
  FileDown,
  FileText,
  Filter,
  FlaskConical,
  FolderOpen,
  GraduationCap,
  HardDrive,
  Heart,
  Languages,
  LayoutGrid,
  ListFilter,
  Menu,
  MessageCircle,
  Laptop,
  MoreHorizontal,
  MoreVertical,
  PencilLine,
  Search,
  Send,
  Share2,
  Sparkles,
  Star,
  Sun,
  Moon,
  Users,
  X,
  Zap,
} from 'lucide-react'
import './styles.css'
import { sourceResources as actualResources, sourceSubjects as actualSubjects, sourceSummary } from './generatedSources'

const classThingsLogo = '/creator/CTL.jpg'
const creatorPhoto = '/creator/shankar.jpg'
const coffeeQr = '/creator/CQFC.jpg'

const subjects = [
  { name: 'SDT', notes: 0, Icon: FileText, tone: 'blue' },
  { name: 'SDE', notes: 0, Icon: BookOpen, tone: 'cyan' },
  { name: 'JAVA', notes: 0, Icon: Coffee, tone: 'orange' },
  { name: 'DBMS', notes: 0, Icon: HardDrive, tone: 'blue' },
  { name: 'DAA', notes: 0, Icon: Code2, tone: 'violet' },
  { name: 'I & E', notes: 0, Icon: Zap, tone: 'amber' },
  { name: 'JAVA LAB', notes: 0, Icon: FileCode2, tone: 'violet' },
  { name: 'CM LAB', notes: 0, Icon: Laptop, tone: 'cyan' },
  { name: 'DBMS LAB', notes: 0, Icon: HardDrive, tone: 'blue' },
  { name: 'DEV LAB', notes: 0, Icon: PencilLine, tone: 'pink' },
]

const recentResources = [
  { title: 'Vector Calculus', subtitle: 'SDT · Unit 3', type: 'Notes', date: 'Added 2h ago', tone: 'blue', Icon: FileText },
  { title: 'Lab Manual — BEEE', subtitle: 'Electrical Engineering', type: 'PDF', date: 'Added yesterday', tone: 'amber', Icon: FileDown },
  { title: 'Stack Implementation', subtitle: 'SDE · Python', type: 'Programs', date: 'Added 2 days ago', tone: 'violet', Icon: FileCode2 },
  { title: 'PN Junction Diode', subtitle: 'CM LAB · Unit 2', type: 'Notes', date: 'Added 3 days ago', tone: 'pink', Icon: FileText },
]

const resources = [
  { id: 1, title: 'Vector Calculus — Divergence & Curl', author: 'Mr. Sharma', time: '2h ago', type: 'Notes', size: '2.4 MB', tone: 'blue', Icon: FileText },
  { id: 2, title: 'Differential Equations — Complete Notes', author: 'Dr. Mehta', time: 'Yesterday', type: 'PDF', size: '4.8 MB', tone: 'pink', Icon: FileDown },
  { id: 3, title: 'Matrices & Determinants Practice Set', author: 'Ms. Priya', time: '2 days ago', type: 'Question Papers', size: '1.6 MB', tone: 'amber', Icon: PencilLine },
  { id: 4, title: 'Python Program — Matrix Operations', author: 'Mr. Sharma', time: '3 days ago', type: 'Programs', size: '1.2 KB', tone: 'violet', Icon: FileCode2 },
  { id: 5, title: 'Laplace Transforms — Formula Sheet', author: 'Dr. Mehta', time: '5 days ago', type: 'PDF', size: '956 KB', tone: 'cyan', Icon: FileDown },
  { id: 6, title: 'Complex Variables — Quick Revision', author: 'Mr. Sharma', time: '1 week ago', type: 'Notes', size: '2.1 MB', tone: 'green', Icon: FileText },
  { id: 7, title: 'Linear Algebra Previous Questions', author: 'Ms. Priya', time: '1 week ago', type: 'Question Papers', size: '1.8 MB', tone: 'orange', Icon: PencilLine },
]

const tocItems = [
  ['introduction', '1. Introduction'],
  ['divergence', '2. Divergence'],
  ['curl', '3. Curl'],
  ['identities', '4. Vector Identities'],
  ['examples', '5. Worked Examples'],
]

const typeClass = {
  Notes: 'tag-blue',
  PDF: 'tag-pink',
  Programs: 'tag-violet',
  'Question Papers': 'tag-amber',
}

const sourceVisuals = {
  'CM LAB': { Icon: Laptop, tone: 'cyan' },
  DAA: { Icon: Code2, tone: 'violet' },
  'DBMS LAB': { Icon: HardDrive, tone: 'blue' },
  DBS: { Icon: FolderOpen, tone: 'green' },
  'DEV LAB': { Icon: PencilLine, tone: 'pink' },
  'I & E': { Icon: Zap, tone: 'amber' },
  JAVA: { Icon: Coffee, tone: 'orange' },
  'JAVA LAB': { Icon: FileCode2, tone: 'violet' },
  SDE: { Icon: BookOpen, tone: 'cyan' },
  SDT: { Icon: FileText, tone: 'blue' },
}

const getSourceVisual = (subject) => sourceVisuals[subject] || { Icon: FolderOpen, tone: 'blue' }
const recentActualResources = actualResources.slice(0, 4)
const populatedFolderCount = actualSubjects.filter((subject) => subject.fileCount > 0).length

function App() {
  const [page, setPage] = useState('home')
  const [activeNav, setActiveNav] = useState('Home')
  const [theme, setTheme] = useState('light')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [subjectSearch, setSubjectSearch] = useState('')
  const [sort, setSort] = useState('Newest')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedResource, setSelectedResource] = useState(() => actualResources[0] || null)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)

  const notify = (message) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 3000)
  }

  const changePage = (next, navLabel) => {
    setPage(next)
    if (navLabel) setActiveNav(navLabel)
    setMobileOpen(false)
    setGlobalSearchOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openSubject = (subject = null, nextFilter = 'All', navLabel = 'Sources') => {
    setSelectedSubject(subject)
    setFilter(nextFilter)
    setSubjectSearch('')
    changePage('subject', navLabel)
  }

  const openPreview = (resource) => {
    if (resource) setSelectedResource(resource)
    changePage('preview')
  }

  const downloadResource = (resource) => {
    if (!resource) return
    const link = document.createElement('a')
    link.href = resource.url
    link.download = resource.filename
    link.click()
    notify(`Downloading ${resource.filename}`)
  }

  const shareResource = async (resource) => {
    if (!resource) return
    const shareData = { title: 'Vector Calculus — Divergence & Curl', text: 'A helpful Class Things resource for your revision.' }
    shareData.title = resource.title
    shareData.text = `${resource.filename} from the Class Things source library.`
    shareData.url = new URL(resource.url, window.location.origin).href
    try {
      if (navigator.share) await navigator.share(shareData)
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText('Vector Calculus — Divergence & Curl · Class Things')
        await navigator.clipboard.writeText(shareData.url)
        notify('Link copied to your clipboard.')
      } else notify('Share link ready to copy.')
    } catch {
      notify('Sharing was cancelled.')
    }
  }

  const submitGlobalSearch = (event) => {
    event.preventDefault()
    openSubject(null, 'All', 'Sources')
    setSubjectSearch(globalSearch)
  }

  const navItems = [
    { label: 'Home', onClick: () => changePage('home', 'Home') },
    { label: 'Sources', onClick: () => openSubject(null, 'All', 'Sources') },
    { label: 'Subjects', onClick: () => openSubject(null, 'All', 'Subjects') },
    { label: 'PDFs', onClick: () => openSubject(null, 'PDF', 'PDFs') },
    { label: 'Creator', onClick: () => changePage('creator', 'Creator') },
  ]

  return (
    <div className={`app-shell ${theme === 'dark' ? 'dark' : ''}`}>
      <Header
        activeNav={activeNav}
        navItems={navItems}
        page={page}
        theme={theme}
        setTheme={setTheme}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        globalSearchOpen={globalSearchOpen}
        setGlobalSearchOpen={setGlobalSearchOpen}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
        submitGlobalSearch={submitGlobalSearch}
        openCreatorSection={(id) => {
          if (page !== 'creator') changePage('creator', 'Creator')
          window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
        }}
      />

      {page === 'home' && <HomePage openSubject={openSubject} openPreview={openPreview} />}
      {page === 'subject' && (
        <SubjectPage
          selectedSubject={selectedSubject}
          filter={filter}
          setFilter={setFilter}
          search={subjectSearch}
          setSearch={setSubjectSearch}
          sort={sort}
          setSort={setSort}
          openPreview={openPreview}
          downloadResource={downloadResource}
          notify={notify}
        />
      )}
      {page === 'preview' && <PreviewPage resource={selectedResource} back={() => openSubject(selectedSubject, 'All', selectedSubject ? 'Subjects' : 'Sources')} downloadResource={downloadResource} shareResource={shareResource} openPreview={openPreview} />}
      {page === 'creator' && <CreatorPage notify={notify} />}

      {toast && <div className="toast" role="status"><CheckCircle2 size={17} />{toast}</div>}
    </div>
  )
}

function Header({ activeNav, navItems, page, theme, setTheme, mobileOpen, setMobileOpen, globalSearchOpen, setGlobalSearchOpen, globalSearch, setGlobalSearch, submitGlobalSearch, openCreatorSection }) {
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <button className="brand" onClick={() => navItems[0].onClick()} aria-label="Class Things home">
          <span className="brand-mark" aria-hidden="true"><img src={classThingsLogo} alt="" /></span>
          <span>Class Things</span>
        </button>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.label} className={`nav-link ${activeNav === item.label ? 'active' : ''}`} onClick={item.onClick}>{item.label}</button>
          ))}
        </nav>

        <div className="nav-actions">
          {page === 'creator' && (
            <div className="creator-quick-links">
              <button onClick={() => openCreatorSection('feedback')}><Heart size={15} /> Support</button>
              <button onClick={() => openCreatorSection('message')}><MessageCircle size={15} /> Message</button>
              <button onClick={() => openCreatorSection('coffee')}><Coffee size={15} /> Coffee</button>
            </div>
          )}
          <button className="icon-button" onClick={() => setGlobalSearchOpen(!globalSearchOpen)} aria-label="Search resources"><Search size={19} /></button>
          <button className="icon-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle color theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="icon-button menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation menu">
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {globalSearchOpen && (
          <form className="global-search" onSubmit={submitGlobalSearch}>
            <Search size={18} />
            <input autoFocus value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder="Search all resources..." />
            <kbd>Enter</kbd>
          </form>
        )}
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => <button key={item.label} className={activeNav === item.label ? 'active' : ''} onClick={item.onClick}>{item.label}<ChevronRight size={17} /></button>)}
        </div>
      )}
    </header>
  )
}

function HomePage({ openSubject, openPreview }) {
  return (
    <main>
      <section className="home-hero container">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={15} /> Your classroom, organized.</span>
          <h1>All class notes &amp; programs <span>in one place.</span></h1>
          <p>Access notes, question papers, PDFs and programs shared by your teachers — anytime, anywhere.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => openSubject(null, 'All', 'Subjects')}>Explore source folders <ArrowRight size={18} /></button>
            <button className="button button-secondary" onClick={() => openSubject(null, 'PDF', 'PDFs')}>View all PDFs</button>
          </div>
          <div className="stat-grid" aria-label="Class Things statistics">
            <Stat icon={<BookOpen size={20} />} value={sourceSummary.subjectCount} label="Source folders" tone="blue" />
            <Stat icon={<FileDown size={20} />} value={sourceSummary.fileCount} label="PDF files" tone="green" />
            <Stat icon={<FolderOpen size={20} />} value={populatedFolderCount} label="With files" tone="amber" />
            <Stat icon={<HardDrive size={20} />} value={sourceSummary.subjectCount - populatedFolderCount} label="Empty folders" tone="violet" />
          </div>
        </div>
        <HeroIllustration />
      </section>

      <section className="content-section container" id="subjects">
        <SectionHeading eyebrow="Your local library" title="Explore source folders" action="View all files" onAction={() => openSubject(null, 'All', 'Sources')} />
        <div className="subject-grid">
          {actualSubjects.map(({ name, fileCount }) => {
            const { Icon, tone } = getSourceVisual(name)
            return (
            <button className="subject-card" key={name} onClick={() => openSubject(name, 'All', 'Subjects')}>
              <span className={`subject-icon tone-${tone}`}><Icon size={23} /></span>
              <span className="subject-name">{name}</span>
              <span className="subject-count">{fileCount ? `${fileCount} ${fileCount === 1 ? 'PDF' : 'PDFs'}` : 'No files yet'}</span>
              <ArrowRight className="subject-arrow" size={17} />
            </button>
            )
          })}
        </div>
      </section>

      <section className="content-section container recent-section">
        <SectionHeading eyebrow="From the Sources folder" title="Recently added files" action="View all files" onAction={() => openSubject(null, 'All', 'Sources')} />
        <div className="recent-grid">
          {recentActualResources.map((resource) => {
            const { Icon, tone } = getSourceVisual(resource.subject)
            return (
            <article className="recent-card" key={resource.id}>
              <div className="recent-top"><span className={`file-icon tone-${tone}`}><Icon size={22} /></span><TypeBadge type={resource.type} /></div>
              <h3>{resource.title}</h3>
              <p>{resource.subject} · {resource.filename}</p>
              <div className="recent-bottom"><span><Clock3 size={14} /> {resource.modifiedAt}</span><button onClick={() => openPreview(resource)} aria-label={`Open ${resource.title}`}><ArrowRight size={18} /></button></div>
            </article>
            )
          })}
        </div>
      </section>

      <section className="container study-banner">
        <div className="study-icon"><GraduationCap size={25} /></div>
        <div><strong>Everything for your next study session.</strong><span>Keep your class materials tidy, useful, and ready when you are.</span></div>
        <button className="text-action" onClick={() => openSubject(null, 'All', 'Sources')}>Browse all files <ArrowRight size={16} /></button>
      </section>
    </main>
  )
}

function Stat({ icon, value, label, tone }) {
  return <div className="stat-card"><span className={`stat-icon tone-${tone}`}>{icon}</span><div><strong>{value}</strong><span>{label}</span></div></div>
}

function SectionHeading({ eyebrow, title, action, onAction }) {
  return <div className="section-heading"><div><span className="section-eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action && <button className="text-action" onClick={onAction}>{action} <ArrowRight size={16} /></button>}</div>
}

function TypeBadge({ type }) {
  return <span className={`type-badge ${typeClass[type] || 'tag-blue'}`}>{type}</span>
}

function HeroIllustration() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="visual-glow glow-one" /><div className="visual-glow glow-two" />
      <div className="floating-card note-float"><FileText size={20} /><span>Notes</span><Check size={16} /></div>
      <div className="floating-card code-float"><Code2 size={20} /><span>{'{ }'}</span></div>
      <div className="hero-scene">
        <div className="cap"><div className="cap-top" /><div className="cap-tassel" /></div>
        <div className="book-stack"><span /><span /><span /></div>
        <div className="laptop-screen"><div className="screen-header"><i /><i /><i /></div><div className="screen-code"><b /><b /><b /><b /></div><div className="screen-chart"><span /><span /><span /></div></div>
        <div className="laptop-base" />
      </div>
      <div className="mini-orb orb-a" /><div className="mini-orb orb-b" />
    </div>
  )
}

function SubjectPage({ selectedSubject, filter, setFilter, search, setSearch, sort, setSort, openPreview, downloadResource, notify }) {
  const filters = ['All', 'PDF']
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const result = actualResources.filter((resource) => (!selectedSubject || resource.subject === selectedSubject) && (filter === 'All' || resource.type === filter) && (!query || resource.title.toLowerCase().includes(query) || resource.filename.toLowerCase().includes(query) || resource.subject.toLowerCase().includes(query)))
    return sort === 'Oldest' ? [...result].reverse() : result
  }, [filter, search, selectedSubject, sort])
  const selectedFolder = actualSubjects.find((subject) => subject.name === selectedSubject)
  const title = selectedSubject || 'All source files'
  const subtitle = selectedSubject
    ? `${selectedFolder?.fileCount || 0} PDF files found in Sources/${selectedSubject}.`
    : `${sourceSummary.fileCount} PDF files across ${sourceSummary.subjectCount} folders in Sources.`

  return (
    <main className="subject-page container">
      <section className="subject-hero source-subject-hero">
        <div className="actual-subject-hero">
          <div>
            <span className="breadcrumb"><FolderOpen size={15} /> Sources <ChevronRight size={14} /> {selectedSubject || 'All folders'}</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
            <div className="subject-summary"><span><FileDown size={15} /> {selectedSubject ? selectedFolder?.fileCount || 0 : sourceSummary.fileCount} PDFs</span><span><FolderOpen size={15} /> {selectedSubject || `${sourceSummary.subjectCount} folders`}</span></div>
          </div>
          <button className="button button-primary" onClick={() => { setFilter('All'); setSearch('') }}><Filter size={18} /> Clear filters</button>
        </div>
        <div><span className="breadcrumb"><FolderOpen size={15} /> Subjects <ChevronRight size={14} /> {selectedSubject || 'Subjects'}</span><h1>{selectedSubject || 'Subjects'}</h1><p>Clear notes, practice material and programs to help you master every unit.</p><div className="subject-summary"><span><FileText size={15} /> {selectedSubject ? '0 resources' : `${sourceSummary.fileCount} resources`}</span><span><Users size={15} /> {selectedSubject ? '0 contributors' : `${sourceSummary.contributorCount} contributors`}</span></div></div>
        <button className="button button-primary" onClick={() => notify(`Your notes request has been sent to the ${selectedSubject || 'Subjects'} team.`)}><MessageCircle size={18} /> Request notes</button>
      </section>

      <section className="resource-panel">
        <div className="filter-tabs" aria-label="Resource categories">
          {filters.map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
        <div className="resource-controls">
          <button className="filter-button"><ListFilter size={17} /> Filters <ChevronDown size={15} /></button>
          <label className="inline-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search in ${selectedSubject || 'Sources'}...`} /><button onClick={() => setSearch('')} aria-label="Clear search">{search && <X size={16} />}</button></label>
          <label className="sort-select">Sort by:<select value={sort} onChange={(event) => setSort(event.target.value)}><option>Newest</option><option>Oldest</option></select><ChevronDown size={15} /></label>
        </div>
        <div className="resource-list-head"><span>{filtered.length} {filtered.length === 1 ? 'file' : 'files'} found</span><span>Actual files from Sources</span></div>
        <div className="resource-list">
          {filtered.map((resource) => <ResourceRow key={resource.id} resource={resource} openPreview={openPreview} downloadResource={downloadResource} />)}
          {!filtered.length && <div className="empty-state"><Search size={26} /><strong>No resources found</strong><p>Try another search or category.</p><button className="button button-secondary" onClick={() => { setFilter('All'); setSearch('') }}>Clear filters</button></div>}
        </div>
      </section>

      <section className="request-strip"><div className="request-strip-icon"><Sparkles size={21} /></div><div><strong>Can’t find what you’re looking for?</strong><span>Tell us what would help your next revision session.</span></div><button onClick={() => notify('Your request has been noted!')}>Make a request <ArrowRight size={16} /></button></section>
    </main>
  )
}

function ResourceRow({ resource, openPreview, downloadResource }) {
  const { title, subject, filename, type, size, modifiedAt } = resource
  const { Icon, tone } = getSourceVisual(subject)
  return <article className="resource-row">
    <span className={`resource-icon tone-${tone}`}><Icon size={23} /></span>
    <div className="resource-info"><h3>{title}</h3><p>{subject}<span className="dot" />{filename}<span className="dot" />{size}<span className="dot" />{modifiedAt}</p></div>
    <TypeBadge type={type} />
    <div className="row-actions"><button onClick={() => downloadResource(resource)} aria-label={`Download ${title}`}><Download size={18} /></button><button onClick={() => openPreview(resource)} aria-label={`View ${title}`}><Eye size={18} /></button><a className="desktop-more" href={resource.url} target="_blank" rel="noreferrer" aria-label={`Open ${title} in a new tab`}><MoreVertical size={18} /></a></div>
  </article>
}

function PreviewPage({ back, downloadResource, shareResource, notify }) {
  const [activeSection, setActiveSection] = useState('introduction')
  const jump = (id) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <main className="preview-page">
      <div className="preview-topbar"><div className="container preview-topbar-inner"><button className="back-button" onClick={back}><ChevronLeft size={20} /> <span>Back to {resource?.subject || 'Subjects'}</span></button><div className="preview-title"><span>{resource?.subject || 'Subjects'} / Notes</span><strong>{resource?.title || 'Document'}</strong></div><div className="preview-actions"><button className="button button-secondary small" onClick={() => downloadResource(resource?.title || 'Document')}><Download size={17} /><span>Download</span></button><button className="icon-button" onClick={shareResource} aria-label="Share document"><Share2 size={18} /></button><button className="icon-button" onClick={() => notify('More file options will appear here.')} aria-label="More document options"><MoreHorizontal size={19} /></button></div></div></div>
      <div className="preview-mobile-tools container"><button onClick={() => document.getElementById('contents')?.scrollIntoView({ behavior: 'smooth' })}><LayoutGrid size={16} /> Contents</button><button onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}><ListFilter size={16} /> Details</button></div>
      <div className="preview-layout container">
        <aside className="toc-card" id="contents"><span className="aside-title">On this page</span>{tocItems.map(([id, label]) => <button key={id} className={activeSection === id ? 'active' : ''} onClick={() => jump(id)}>{label}</button>)}<div className="toc-divider" /><span className="toc-progress"><span /><em>18% read</em></span></aside>
        <article className="document-canvas">
          <div className="paper-meta"><span className="paper-dot" /> {resource && resource.subject ? resource.subject.toUpperCase() : 'SUBJECT'} · UNIT 3 <span>5 min read</span></div>
          <section id="introduction"><h1>Vector Calculus</h1><h2>Divergence &amp; Curl</h2><p className="lead">Vector calculus gives us a beautiful way to describe how a vector field behaves at every point in space. Two of its most useful tools are <b>divergence</b> and <b>curl</b>.</p><div className="callout"><Sparkles size={19} /><p><strong>Key idea</strong> — Divergence measures outflow; curl measures rotation.</p></div></section>
          <section id="divergence"><h3>2. Divergence</h3><p>The divergence of a vector field tells us how much the field spreads outward from a point. For a vector field <i>F</i> = P<i>i</i> + Q<i>j</i> + R<i>k</i>:</p><div className="equation">∇ · <b>F</b> = <span>∂P</span>/<span>∂x</span> + <span>∂Q</span>/<span>∂y</span> + <span>∂R</span>/<span>∂z</span></div><ul><li>Positive divergence: the point behaves like a source.</li><li>Negative divergence: the point behaves like a sink.</li><li>Zero divergence: no net flow leaves the point.</li></ul></section>
          <section id="curl"><h3>3. Curl</h3><p>While divergence captures expansion, curl measures the local tendency of a field to rotate around a point.</p><div className="equation equation-curl">∇ × <b>F</b> = <span className="matrix">| i &nbsp; j &nbsp; k<br />∂/∂x &nbsp; ∂/∂y &nbsp; ∂/∂z<br />P &nbsp; Q &nbsp; R |</span></div></section>
          <section id="identities"><h3>4. Vector identities</h3><div className="identity-grid"><div><span>∇ · (∇ × F)</span><strong>= 0</strong></div><div><span>∇ × (∇φ)</span><strong>= 0</strong></div></div></section>
          <section id="examples"><h3>5. Worked example</h3><p>For <i>F</i> = x²<i>i</i> + yz<i>j</i> + xz<i>k</i>, calculate the divergence by differentiating each component with respect to its matching coordinate.</p><div className="answer-box"><CheckCircle2 size={18} /><span>Answer: ∇ · F = 2x + x + y</span></div></section>
        </article>
        <aside className="details-stack" id="details"><div className="details-card"><span className="aside-title">File details</span><dl><Detail icon={<FileText size={16} />} label="Type" value="Notes" /><Detail icon={<BookOpen size={16} />} label="Subject" value={resource?.subject || 'Unknown'} /><Detail icon={<Users size={16} />} label="Uploaded by" value="Mr. Sharma" /><Detail icon={<CalendarDays size={16} />} label="Uploaded on" value="20 Aug 2026" /><Detail icon={<HardDrive size={16} />} label="Size" value="2.4 MB" /><Detail icon={<Download size={16} />} label="Downloads" value="128" /></dl></div><div className="related-card"><div className="related-head"><span className="aside-title">Related files</span><button>See all</button></div><Related name="Line Integrals — Quick Notes" type="Notes" /><Related name="Vector Calculus Formula Sheet" type="PDF" /><Related name="Gradient & Directional Derivative" type="Notes" /></div></aside>
      </div>
    </main>
  )
}

function Detail({ icon, label, value }) {
  return <div><dt><span>{icon}</span>{label}</dt><dd>{value}</dd></div>
}

function Related({ name, type }) {
  return <button className="related-item"><span className="related-file"><FileText size={17} /></span><span><strong>{name}</strong><em>{type}</em></span><ChevronRight size={16} /></button>
}

function CreatorPage({ notify }) {
  const [rating, setRating] = useState(0)
  const [feedbackType, setFeedbackType] = useState('Idea')
  const [feedback, setFeedback] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const submitFeedback = (event) => { event.preventDefault(); notify(rating ? 'Thanks — your feedback was sent!' : 'Choose a star rating before sending.') }
  const submitMessage = (event) => { event.preventDefault(); if (message.trim()) { notify('Your message is on its way to the creator.'); setMessage('') } else notify('Write a short message first.') }
  return (
    <main className="creator-page container">
      <section className="creator-hero">
        <div className="creator-intro"><span className="eyebrow pink-eyebrow"><Heart size={15} fill="currentColor" /> Thank you for using Class Things!</span><h1>Hi! I’m the creator of <span>Class Things.</span></h1><p>I made this little space to make student life feel a bit more organized, less overwhelming, and easier to share.</p><div className="creator-highlights"><Highlight icon={<Users size={20} />} title="Made for students" text="Built around your study flow." tone="blue" /><Highlight icon={<Zap size={20} />} title="Simple & fast" text="Find what you need, quickly." tone="amber" /><Highlight icon={<Heart size={20} />} title="Always free" text="Learning should stay accessible." tone="pink" /></div></div>
        <CreatorPortrait />
      </section>
      <section className="creator-story-grid">
        <article className="why-card">
          <span className="section-eyebrow">A small idea, made useful</span>
          <h2>Why I built this?</h2>
          <p>Notes often end up scattered across chats, drives and forgotten folders. Class Things brings the useful stuff together so your energy can go into learning, not searching.</p>
          <div className="quote-line"><span>“</span> A calmer desk starts with a calmer digital space.</div>
        </article>
        <aside className="about-card">
          <div className="about-top">
            <img className="creator-avatar" src={creatorPhoto} alt="Shankar, creator of Class Things" />
            <div><span>About</span><h3>Shankar</h3><p>Frontend developer</p></div>
          </div>
          <p className="about-bio">Frontend developer — loves clean UI &amp; UX.</p>
          <ul><li><Code2 size={16} /> Frontend developer</li><li><Sparkles size={16} /> Loves clean UI &amp; UX</li><li><Coffee size={16} /> Coffee lover</li><li><GraduationCap size={16} /> Always learning</li></ul>
        </aside>
      </section>
      <section className="creator-form-grid"><form className="support-card feedback-card" id="feedback" onSubmit={submitFeedback}><CardTop icon={<Star size={20} fill="currentColor" />} title="Share your feedback" text="Your thoughts help make Class Things better." tone="amber" /><fieldset className="rating-field"><legend>How’s your experience?</legend><div className="stars">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} className={value <= rating ? 'selected' : ''} onClick={() => setRating(value)} aria-label={`${value} stars`}><Star size={27} fill={value <= rating ? 'currentColor' : 'none'} /></button>)}</div></fieldset><fieldset className="radio-field"><legend>What would you like to share?</legend><div>{['Idea', 'Bug report', 'Just saying hi'].map((item) => <label key={item}><input type="radio" checked={feedbackType === item} onChange={() => setFeedbackType(item)} /> <span>{item}</span></label>)}</div></fieldset><label className="field-label">Anything else?<textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Tell me what’s on your mind..." /></label><button className="button button-primary full-width" type="submit"><Send size={17} /> Send feedback</button></form>
      <form className="support-card message-card" id="message" onSubmit={submitMessage}><CardTop icon={<MessageCircle size={20} />} title="Message the creator" text="A note, idea, or a friendly hello — I’d love to hear it." tone="blue" /><label className="field-label">Your name <span>(optional)</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="What should I call you?" /></label><label className="field-label">Your message<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write your message here..." /></label><div className="privacy-note"><CheckCircle2 size={17} /><span>This message goes directly to the creator. No spam, ever.</span></div><button className="button button-primary full-width" type="submit"><MessageCircle size={17} /> Send message</button></form>
      <article className="support-card coffee-card" id="coffee"><CardTop icon={<Coffee size={20} />} title="Buy me a coffee" text="If Class Things made your day easier, a little support means a lot." tone="pink" /><div className="coffee-body"><div className="coffee-benefits"><span>What your support helps with</span><ul><li><Check size={15} /> Keeping the site online</li><li><Check size={15} /> Adding useful features</li><li><Check size={15} /> More coffee-fuelled ideas</li></ul></div><div className="qr-wrap"><img src={coffeeQr} alt="UPI QR code to buy Shankar a coffee" /><span>Scan to support Class Things</span></div></div><div className="coffee-thanks"><Coffee size={18} fill="currentColor" /> Thanks a latte! <Heart size={15} fill="currentColor" /></div></article></section>
    </main>
  )
}

function Highlight({ icon, title, text, tone }) {
  return <div className="highlight"><span className={`highlight-icon tone-${tone}`}>{icon}</span><div><strong>{title}</strong><span>{text}</span></div></div>
}

function CardTop({ icon, title, text, tone }) {
  return <div className="card-top"><span className={`card-top-icon tone-${tone}`}>{icon}</span><div><h2>{title}</h2><p>{text}</p></div></div>
}

function CreatorPortrait() {
  return (
    <div className="creator-visual">
      <div className="creator-orb creator-orb-one" />
      <div className="creator-orb creator-orb-two" />
      <div className="creator-photo-frame"><img src={creatorPhoto} alt="Shankar, creator of Class Things" /></div>
      <div className="creator-photo-caption"><span>Creator</span><strong>Shankar</strong><small>Built for better study days</small></div>
      <div className="creator-mini-card"><Code2 size={17} /><span>Student-first design</span></div>
      <div className="creator-love-note"><Heart size={16} fill="currentColor" /> made with care</div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
