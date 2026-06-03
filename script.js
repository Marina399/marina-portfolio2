/* ── CURSOR (hide on touch) ── */
const cursor=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
const isTouch=window.matchMedia('(hover:none)').matches;
if(isTouch){cursor.style.display='none';ring.style.display='none';}
let mx=0,my=0,rx=0,ry=0;
if(!isTouch){
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px'});
  (function tick(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(tick)})();
}

/* ── PROGRESS + NAV SCROLL ── */
const prog=document.getElementById('progress'),navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  const pct=Math.min(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100,100);
  prog.style.width=pct+'%';
  navbar.classList.toggle('scrolled',window.scrollY>40);
},{passive:true});

/* ── HERO WORD ANIMATION (GSAP) ── */
const lines=["I turn complex systems","into simple, intuitive","experiences."];
const heroH1=document.getElementById('hero-heading');
// Build DOM first so text is always visible (no-JS fallback)
lines.forEach(line=>{
  const words=line.split(' ');
  const div=document.createElement('div');div.style.lineHeight='1.1';
  words.forEach((w,i)=>{
    const span=document.createElement('span');span.className='word';
    const inner=document.createElement('span');inner.className='word-inner';
    if(w==='simple,'||w==='intuitive'){inner.style.fontStyle='italic';inner.style.color='var(--ink-60)'}
    inner.textContent=w;span.appendChild(inner);div.appendChild(span);
    if(i<words.length-1)div.appendChild(document.createTextNode('\u00A0'));
  });
  heroH1.appendChild(div);
});
// Animate with GSAP if available and motion not reduced
if(typeof gsap!=='undefined'&&!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
  gsap.registerPlugin(ScrollTrigger);
  const wordInners=heroH1.querySelectorAll('.word-inner');
  gsap.fromTo(wordInners,
    {y:'105%',opacity:0},
    {y:'0%',opacity:1,duration:.75,ease:'power3.out',stagger:.07,delay:.15}
  );
} else {
  // Fallback: just show everything
  heroH1.querySelectorAll('.word-inner').forEach(el=>{el.style.transform='translateY(0)';el.style.opacity='1'});
}

/* ── MARQUEE ── */
const skills=['Figma','Framer','Adobe Suite','VS Code','Design Systems','UAT & Handoff','User Research','Accessibility','RTL Arabic','Prototyping','Stakeholder Mgmt','Fast Execution','Developer Handoff','B2B SaaS'];
const track=document.getElementById('marquee-track');
const items=[...skills,...skills].map(s=>`<div class="marquee-item"><span class="marquee-dot"></span>${s}</div>`).join('');
track.innerHTML=items+items;

/* ── INTERSECTION OBSERVER FOR REVEALS ── */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
function observeReveal(){
  document.querySelectorAll('.reveal,.reveal-left,.reveal-scale').forEach(el=>{
    if(!el.classList.contains('visible'))io.observe(el);
  });
}
observeReveal();

/* ── STATS COUNTER (GSAP ScrollTrigger) ── */
function initCounters(){
  if(typeof gsap==='undefined'||window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  document.querySelectorAll('.stat-num[data-count]').forEach(el=>{
    const target=parseFloat(el.dataset.count);
    const suffix=el.dataset.suffix||'';
    const prefix=el.dataset.prefix||'';
    ScrollTrigger.create({
      trigger:el,
      start:'top 85%',
      once:true,
      onEnter:()=>{
        gsap.fromTo({val:0},{val:target},{
          duration:1.8,ease:'power2.out',
          onUpdate:function(){
            el.textContent=prefix+Math.round(this.targets()[0].val)+suffix;
          }
        });
      }
    });
  });
}
initCounters();

/* ── MAGNETIC BUTTONS (GSAP) ── */
function initMagnetic(){
  if(typeof gsap==='undefined'||isTouch||window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  document.querySelectorAll('.btn-primary,.btn-outline,.nav-cta').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{
      const r=btn.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*.25;
      const y=(e.clientY-r.top-r.height/2)*.25;
      gsap.to(btn,{x,y,duration:.3,ease:'power2.out'});
    });
    btn.addEventListener('mouseleave',()=>{
      gsap.to(btn,{x:0,y:0,duration:.5,ease:'elastic.out(1,.4)'});
    });
  });
}
initMagnetic();

/* ── HERO BLOB MOUSE PARALLAX ── */
function initParallax(){
  if(isTouch||window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const blob1=document.querySelector('.bg-blob-1');
  const blob2=document.querySelector('.bg-blob-2');
  if(!blob1||!blob2)return;
  document.querySelector('.hero')?.addEventListener('mousemove',e=>{
    const {clientX:x,clientY:y}=e;
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    const dx=(x-cx)/cx,dy=(y-cy)/cy;
    if(typeof gsap!=='undefined'){
      gsap.to(blob1,{x:dx*24,y:dy*18,duration:1.2,ease:'power2.out'});
      gsap.to(blob2,{x:dx*-14,y:dy*-10,duration:1.4,ease:'power2.out'});
    }
  });
}
initParallax();

/* ── HAMBURGER ── */
const hamburger=document.getElementById('hamburger');
const drawer=document.getElementById('nav-drawer');
function toggleMenu(){
  const open=navbar.classList.toggle('open');
  drawer.classList.toggle('open',open);
  hamburger.setAttribute('aria-expanded',String(open));
  document.body.style.overflow=open?'hidden':'';
}
function closeMenu(){
  navbar.classList.remove('open');
  drawer.classList.remove('open');
  hamburger.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}

/* ── PAGE NAV ── */
function showPage(id){
  closeMenu();
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active','page-enter'));
  const p=document.getElementById('page-'+id);
  p.classList.add('active');
  requestAnimationFrame(()=>p.classList.add('page-enter'));
  window.scrollTo({top:0,behavior:'instant'});
  setTimeout(()=>{observeReveal();initMagnetic();initCounters();},120);
}
function scrollToWork(){showPage('home');setTimeout(()=>document.getElementById('work')?.scrollIntoView({behavior:'smooth'}),80)}
function scrollToProcess(){showPage('home');setTimeout(()=>document.getElementById('process')?.scrollIntoView({behavior:'smooth'}),80)}

/* ══════════════════════════════════════
   MODULE DATA
══════════════════════════════════════ */
const modules={
  'report-builder':{
    title:'Report Builder',
    subtitle:'Giving non-technical admins the power of a data analyst, without making them feel like one.',
    role:'Senior Product Designer . End-to-end ownership',
    duration:'',
    heroImg:'/src/images/Report-Builder-final-UI.png.png',
    tags:['40+ local components','5 data entities','Export & recurring','Live preview'],
    tagStyle:'tag-orange',
    problem:'Nursery admins needed custom reports daily but had no way to build them without technical help. Every new report request meant writing SQL queries and building a new UI, blocking developers. Users exported from 5 separate entities (Children, Contacts, Staff, Finance, Schedule) and merged manually in Excel. It was slow, error-prone, and the data was never current.',
    question:'"How do you give a nursery admin the power of a data analyst, without making them feel like one?"',
    problemImg: '/src/images/rb-Challenge.png', 
    myRole:['End-to-end ownership: research, design, prototyping, handoff, UAT','Built 40+ local components for different data types (text, number, date, select, multi-select)','Collaborated with backend engineers to define filter logic and export formats','Conducted UAT sessions with nursery admins to validate usability'],
    decisions:[
      {num:'01',title:'Warn, don\'t block',body:'If a report is missing data or a filter is invalid, show a warning but let the user continue. Never discard their work.'},
      {num:'02',title:'Live preview',body:'Every change to columns, filters, or grouping reflects instantly in the table. No "Preview" button, no reload. What you set is what you see.'},
      {num:'03',title:'40+ local components',body:'Built custom input components for each data type, each with validation, error states, and consistent styling. The builder feels native, not like a generic form.'}
    ],
    flow:[
      {label:'Choose data entity', desc:'Select from Children, Contacts, Staff, Finance, or Schedule.', img:'/src/images/rb-step1.png.png'},
      {label:'Add filters & columns',desc:'Pick fields, set conditions (equals, contains, greater than, etc.).',img:'/src/images/rb-step2.png.png'},
      {label:'Preview, export or schedule',desc:'See the table live. Export to CSV/Excel/PDF or save as a recurring report.',img:'/src/images/rb-step3.png.png'}
    ],
    stats:[{num:'40+',label:'Local components'},{num:'5',label:'Data entities'},{num:'0',label:'Developer requests'},{num:'∞',label:'Report variations'}],
    outcome:'No more Excel merging. Admins build their own reports in minutes. Developer requests for custom reports dropped to zero. Reports can be exported on demand or scheduled to run automatically, weekly, monthly, or per entity.',
    outcomeQuote:'"No more Excel merging. Admins build their own reports in minutes."',
    uat:'Tested with 5 nursery admins across different roles (finance, management, operations). Handoff included component specifications (states, interactions, error messages), filter logic decision tree, responsive behavior on tablet and desktop, and RTL support for Arabic.',
    prev:'global-search',next:'schedule-plan'
  },
  'schedule-plan':{
    title:'Schedule Plan',
    subtitle:'From hours of manual work to minutes of bulk planning. One plan for hundreds of children.',
    role:'Senior Product Designer – End-to-end ownership',
    duration:'15 Days',
    heroImg:'/src/images/SP Hero.png',
    tags:['500 children','+500 payers','Split payments','Canada & Middle East'],
    tagStyle:'tag-orange',
    problem:'Teachers monthly created a full plan for each child +20 children meant 20 separate plans with sessions, items, and billing details. Manual entry for each payer, discount, and subsidy per child. No flexibility for split payments or edge cases. No scalable solution.',
    problemImg: '/src/images/SP-Problem.png', 
    question:'"How do you design a system that\'s bulk by default but flexible by exception?"',
    myRole:['Led design from stakeholder alignment to developer handoff','Mapped edge cases: missing payers, split payments (Canada vs. Middle East), per-child overrides','Designed the bulk assignment interface and warning system','Coordinated UAT with teachers and finance admins from both regions'],
    decisions:[
      {num:'01',title:'Warn, don\'t block',body:'If a child has no assigned payer, show a warning and allow the user to exclude that child or add a payer later. The bulk action is never stopped.'},
      {num:'02',title:'Regional flexibility',body:'Canada splits by session or item (up to 5 payers). Middle East splits by percentage. Same UI components, different logic underneath. Users never see the complexity.'},
      {num:'03',title:'Override without breaking',body:'Editing one child\'s plan (e.g. custom payers or discounts) never affects the rest of the bulk. Group logic and individual logic are completely separated.'}
    ],
    flow:[
      {label:'Setup & Build Your Plan',desc:'Define dates, pricing group, sessions, items, taxes.',img:'/src/images/SP-step1.png'},
      {label:'Assign Children & Payers',desc:'Bulk assign to a room, then customize exceptions. 500 children, 400 payers at a glance.',img:'/src/images/SP-step2.png'},
      {label:'Customize Payers',desc:'Edit individual payer splits per child (percentage or session-based). Override without breaking the bulk plan.',img:'/src/images/SP-step3.png'},
      {label:'Review & Generate',desc:'Handle edge cases. Generate all plans in minutes.',img:'/src/images/SP-step4.png'}
    ],
    stats:[{num:'500+',label:'Children in under 10 min'},{num:'500+',label:'Payers handled'},{num:'15+',label:'Hours saved per week'},{num:'2',label:'Regions supported'}],
    outcome:'500 children\'s plans created in under 10 minutes. Teachers save 15+ hours per week. Works seamlessly across Canada (session/item split) and Middle East (percentage split) billing models.',
    outcomeQuote:'"From hours to minutes. Teachers finally have time to teach."',
    uat:'Tested with teachers and finance admins from Canada and the Middle East. Handoff included flow diagrams for each edge case, validation rules (e.g. no negative splits, percentages = 100%), and responsive views for tablet (teachers in classrooms).',
    prev:'report-builder',next:'child-development'
  },
  'child-development':{
    title:'Child Development Dashboard',
    subtitle:'Complex child progress data, made simple across every device and language.',
    role:'Senior Product Designer . End-to-end ownership',
    duration:'',
    heroImg:'/src/images/cd-hero.png',
    tags:['3 platforms','RTL Arabic','16+ columns','2 new features'],
    tagStyle:'tag-orange',
    problem:'Empty tables on arrival. Users had to manually configure filters just to see any data. 16+ columns in the progress report table, impossible to scan. Desktop-only design on a platform used by teachers on tablets and parents on mobile.',
    problemImg:'/src/images/cd-problem.png',
    question:'"How do you make a teacher instantly see which child needs attention, without touching a single filter?"',
    myRole:['Full redesign for 3 platforms (desktop, tablet, mobile)','Added 2 new features: bulk approve observations + activity log','Designed cascading filters (Curriculum → Areas → Subareas)','Implemented full RTL mirror layout for Arabic users'],
    decisions:[
      {num:'01',title:'Zero state fix',body:'Default curriculum pre-selected on load. Teachers see data immediately. No empty table, no manual configuration required.'},
      {num:'02',title:'Cascading filters',body:'Choosing a curriculum automatically shows only its areas and subareas. Users never see invalid combinations. Filter logic is guided, not free-form.'},
      {num:'03',title:'RTL mirroring',body:'Full layout reversal for Arabic: tables, buttons, icons, and navigation all flipped correctly. Not just text direction. The entire spatial logic.'}
    ],
    flow:[
      {label:'Observations & Assessments',desc:'See Ahead, Behind, On track for the whole class at a glance.',img:'/src/images/cd-step2.png'},
      {label:'Advanced filter bar',desc:'Refine by curriculum, area, subarea, date range, child name.',img:'/src/images/cd-step3.png'},
      {label:'Detailed table + export',desc:'Show/hide 16+ columns, bulk approve, export or log.',img:'/src/images/cd-step4.png'}
    ],
    stats:[{num:'3',label:'Platforms'},{num:'2',label:'Languages (LTR + RTL)'},{num:'2',label:'New features added'},{num:'0',label:'Empty states on load'}],
    outcome:'Teachers see at-risk children in 2 seconds without clicking a single filter. Bulk approve observations in one click. Activity log tracks every change automatically.',
    outcomeQuote:'"Teachers see at-risk children in 2 seconds, without clicking a single filter."',
    uat:'Tested with teachers on actual devices (iPad, iPhone, Android tablets, desktops). Handoff included responsive breakpoints, RTL CSS specifications (mirrored margins, paddings, flex directions), keyboard navigation, and screen reader annotations.',
    prev:'schedule-plan',next:'invoice-automations'
  },
  'invoice-automations':{
    title:'Invoice Automations',
    subtitle:'Automated payment reminders and recurring billing , built for complex childcare billing scenarios.',
    role:'Senior Product Designer . End-to-end ownership',
    duration:'',
    heroImg:'/src/images/Invoice Automations (1).png',
    tags:['6 billing cycles','Smart reminders','Full audit trail','Shipped to production'],
    tagStyle:'tag-sage',
    problem:'Every payment reminder was manual. Admins personally contacted parents for every invoice cycle. No automation existed. Term-based, twice-per-month, and custom-day billing had no structured solution. Zero audit trail.',
    problemImg: '/src/images/Invoice Automations (2).png', 
    question:'"How do you automate billing across multiple payment cultures , without losing flexibility or accountability?"',
    myRole:['Owned the full product cycle: research → design → handoff → UAT → production → customer feedback','Designed smart reminder rules (before due, on due, after overdue)','Created the recurring logic engine interface','Built the audit trail view with timestamp and user logging'],
    decisions:[
      {num:'01',title:'Smart reminders',body:'Automated notifications before due date, on due date, and after overdue. Timing and message content are fully customizable per nursery.'},
      {num:'02',title:'Recurring logic engine',body:'Supports term-based, twice-per-month, and custom X-day cycles. Set once, runs forever with automatic pro-rata adjustments.'},
      {num:'03',title:'Full audit trail',body:'Every reminder sent, every payment received, every setting change: all logged with a timestamp and user account. Full accountability.'}
    ],
    flow:[
      {label:'Select billing cycle',desc:'Choose from 6 presets or create a custom cycle.',img:'/src/images/Invoice Automations (3).png'},
      {label:'Set reminder schedule',desc:'Define when to send and to whom (primary payer, secondary, both).',img:'/src/images/Invoice Automations (4).png'},
      {label:'Review & activate',desc:'See a live preview, then activate. Editable anytime.',img:'/src/images/Invoice Automations (5).png'}
    ],
    stats:[{num:'6',label:'Billing cycles supported'},{num:'500+',label:'Parents notified weekly'},{num:'20+',label:'Hours saved per month'},{num:'✅',label:'Customer feedback'}],
    outcome:'Admins save 20+ hours per month. The only module that completed the full product cycle: handoff → UAT → production → customer feedback with zero critical bugs.',
    outcomeQuote:'"The only module that went from spec to live with zero critical bugs."',
    uat:'Tested with finance admins across Canada and the Middle East. Handoff included edge cases (pro-rata, mid-cycle cancellations, multi-payer splits), schedule conflict resolution, and email template specs with dynamic variable mapping.',
    prev:'child-development',next:'waitlist'
  },
  'waitlist':{
    title:'Waitlist Management',
    subtitle:'A flexible, fair admissions pipeline with custom priorities, bulk actions, and personalised table views - from first inquiry to enrolled.',
    role:'Senior Product Designer – End-to-end ownership',
    duration:'',
    heroImg:'/src/images/WaitList.png',
    tags:['Auto-enrollment','Priority management','Real-time updates','Nursery admissions'],
    tagStyle:'tag-orange',
    problem:'Waitlists were messy and unfair. Nurseries used first‑come, first‑served FIFO ordering – a child with an enrolled sibling or urgent need had no way to jump the queue. Every staff member saw the same rigid table (too many columns for some, not enough for others). Manual work multiplied when dozens of children needed the same priority assignment',
    problemImg:'/src/images/WaitList (2).png',
    question:'“How do you turn a basic waitlist into a transparent, rule‑based system where every nursery can define its own priorities, and every user can see only the data they need?”',
    myRole:['Redesigned the waitlist module end‑to‑end','Built priority management from scratch (rules, colours, drag‑drop)','Added customisable columns for every user','Enabled bulk priority assignment in seconds','Polished UI (table, tabs, search, filters) for clarity and speed'],
    decisions:[
      {num:'01',title:'Priority Management System',body:'Admins create named priorities (e.g. “Sibling Enrolled”, “Urgent Need”, “Staff Child”), assign a distinct colour, and reorder them via drag & drop. The rank determines which children are suggested first when a spot opens.'},
      {num:'02',title:'Customisable Columns',body:'Every user can choose which columns to display (e.g. hide “Birthday”, show “Assigned to”) and drag columns to reorder them. The layout persists per user – no more information overload.'},
      {num:'03',title:'Bulk Actions',body:'Instead of opening each child’s profile, staff select multiple inquiries and assign a priority in one click. Bulk actions also support status changes and mass messaging, saving hours every week.'}
    ],
    flow:[
      {label:'Apply & join waitlist',desc:'Parent applies online, automatically added with timestamp and desired start date.',img:'/src/images/WaitList (3).png'},
      {label:'Spot opens: 48h window',desc:'System notifies the next family. 48 hours to accept or the spot moves on.',img:'/src/images/WaitList (4).png'},
      {label:'Accept or pass',desc:'Auto-enroll if accepted. Auto-move if declined or timeout.',img:'/src/images/WaitList (5).png'}
    ],
    stats:[{num:'15+',label:'Admin hours saved/week'},{num:'3x',label:'Faster enrollment'},{num:'48h',label:'Response window'},{num:'80%',label:'Less time per child'}],
    outcome:'Admissions teams save 15+ hours per week. Parents always know where they stand. Nurseries fill open spots 3x faster than before.',
    outcomeQuote:'“From a rigid list to a flexible, fair system – nurseries finally control their own admission rules.”',
    uat:'Tested with nursery admissions staff across different roles. Handoff included: priority calculation logic, drag‑drop behaviour, column persistence (localStorage), and bulk action edge cases (e.g. partial selections, validation errors). The existing pipeline structure was kept intact – only UI and the new priority/column features shipped as the core upgrade.',
    prev:'invoice-automations',next:'global-search'
  },
  'global-search':{
    title:'Global Search',
    subtitle:'One search bar. Every entity. Instant results across the entire platform.',
    role:'Senior Product Designer – End-to-end ownership',
    duration:'',
    heroImg:'/src/images/Global Search.png',
    tags:['Cross-entity search','Keyboard shortcuts','Location switch','70% time saved'],
    tagStyle:'tag-orange',
    problem:'7+ entities (Children, Payers, Staff, Billing, Rooms, Inquiries, Documents), each with its own search. Users had to know exactly where to look. No shortcuts for power users. Finding a child\'s invoice or a staff member\'s schedule meant jumping between modules. Time wasted, context lost.',
    problemImg:'/src/images/Global Search (2).png',
    question:'"How do you let users find anything (a child, a payment, a room, an inquiry) from one place, in seconds?"',
    myRole:['Designed the global search entry point and results page','Defined result ranking algorithm (priority to exact matches, recent activity)','Added keyboard shortcuts (Ctrl+K / Cmd+K) and location-aware switching','Worked with backend to unify search across 7 entities'],
    decisions:[
      {num:'01',title:'Single entry point',body:'One global search bar in the top nav. Ctrl+K / Cmd+K opens search from anywhere. Autocomplete suggests top matches as you type.'},
      {num:'02',title:'Tabbed results',body:'Results grouped by entity type (Children, Staff, Billing, etc.). Users can filter by tab without retyping the query.'},
      {num:'03',title:'Location-aware',body:'Search includes current nursery location. One-click to switch locations and see cross-site results, which is critical for multi-site organizations.'}
    ],
    flow:[
      {label:'Type anywhere',desc:'Autocomplete shows top 3 matches per entity as you type.',img:'/src/images/Global Search (3).png'},
      {label:'Results grouped by entity',desc:'Hit Enter to see full results with previews (age, invoice amount, room details).',img:'/src/images/Global Search (4).png'},
      {label:'Jump directly',desc:'Click any result to go directly to that record.',img:'/src/images/Global Search (5).png'}
    ],
    stats:[{num:'70%',label:'Search time reduced'},{num:'85%',label:'Keyboard shortcut adoption'},{num:'10+',label:'Admin hours saved/week'},{num:'7+',label:'Entities unified'}],
    outcome:'Search time reduced by 70%. Admins save 10+ hours per week. Keyboard shortcuts adopted by 85% of daily users within 2 weeks of launch.',
    outcomeQuote:'"Search is finally fast. No more guessing which module to open."',
    uat:'Tested with nursery admins, finance staff, and teachers. Handoff included debouncing logic, result ranking algorithm documentation, location-switch edge cases, and a keyboard shortcut guide for power users.',
    prev:'waitlist',next:'report-builder'
  }
};

const moduleOrder=['report-builder','schedule-plan','child-development','invoice-automations','waitlist','global-search'];
const moduleTitles={'report-builder':'Report Builder','schedule-plan':'Schedule Plan','child-development':'Child Development','invoice-automations':'Invoice Automations','waitlist':'Waitlist','global-search':'Global Search'};

function showModule(slug){
  const d=modules[slug];
  if(!d) return;

  let prevSlug=d.prev, nextSlug=d.next;

  /* ── Build circular nav — every module always has both directions ── */
  const prevBtn=`<button class="case-nav-btn" data-nav="${prevSlug}">← ${moduleTitles[prevSlug]}</button>`;
  const nextBtn=`<button class="case-nav-btn" data-nav="${nextSlug}">${moduleTitles[nextSlug]} →</button>`;
  let nav=prevBtn+nextBtn;

  const tagsHTML=d.tags.map(t=>`<span class="tag ${d.tagStyle}">${t}</span>`).join('');
  const roleHTML=d.myRole.map(r=>`<li>${r}</li>`).join('');
  const decsHTML=d.decisions.map(dc=>`
    <div class="dec-card reveal d${d.decisions.indexOf(dc)+1}">
      <div class="dec-num">${dc.num}</div>
      <div class="dec-title">${dc.title}</div>
      <div class="dec-body">${dc.body}</div>
    </div>`).join('');
  const flowHTML=d.flow.map((s,i)=>`
    <div class="flow-step">
      <div class="flow-num">${i+1}</div>
      <div class="flow-ph"><img src="${s.img}" alt="${s.label}" onerror="this.style.background='var(--blue-50)';this.style.height='160px'"></div>
      <div class="flow-label">${s.label}</div>
    </div>`).join('');
  const statsHTML=d.stats.map(s=>`<div class="stat-item"><div class="stat-num">${s.num}</div><div class="stat-label">${s.label}</div></div>`).join('');

  /* ── Inject HTML ── */
  document.getElementById('module-content').innerHTML=`
    <div class="cs-hero" style="background:var(--surface)">
      <div class="cs-hero-inner">
        <div>
          <div class="breadcrumb">
            <button class="bc-btn" onclick="showPage('home')">Home</button> /
            <button class="bc-btn" onclick="showPage('parent')">Parent</button> /
            <span>${d.title}</span>
          </div>
          <div class="tags">${tagsHTML}</div>
          <h1 class="cs-h1">${d.title}</h1>
          <p class="cs-sub">${d.subtitle}</p>
          <div class="cs-role">${d.role} · ${d.duration}</div>
        </div>
        <div style="border-radius:var(--r-md);overflow:hidden">
          <img src="${d.heroImg}" style="width:100%;display:block" alt="${d.title}">
        </div>
      </div>
    </div>

    <div class="sticky-sec"><span class="sticky-num">01</span><span class="sticky-title">The Problem</span></div>
    <div class="section" style="background:var(--surface)">
      <div class="container">
        <div class="two-col two-col-center">
          <div class="reveal-left">
            <div class="sec-label">The Challenge</div>
            <h2 class="sec-h2" style="margin-bottom:16px">Before. <em>What wasn't working.</em></h2>
            <p style="font-size:15px;color:var(--ink-60);line-height:1.8;margin-bottom:20px">${d.problem}</p>
            <div class="sec-label" style="margin-top:8px">My Role</div>
            <ul class="bullet-list" style="margin-top:10px">${roleHTML}</ul>
          </div>
          <div class="reveal d2">
            <div class="highlight" style="max-width:100%;margin:0 0 24px">${d.question}</div>
            <div style="border-radius:var(--r-lg);overflow:hidden;border:1px solid var(--border)">
              <img src="${d.problemImg || d.heroImg}" style="width:100%;display:block" alt="The challenge for ${d.title}">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="sticky-sec"><span class="sticky-num">02</span><span class="sticky-title">Key Design Decisions</span></div>
    <div class="section">
      <div class="container">
        <div class="sec-label reveal">How I solved it</div>
        <h2 class="sec-h2 reveal d1">Three decisions that <em>shaped everything.</em></h2>
        <div class="dec-grid">${decsHTML}</div>
      </div>
    </div>

    <div class="sticky-sec"><span class="sticky-num">03</span><span class="sticky-title">The Flow</span></div>
    <div class="section" style="background:var(--surface)">
      <div class="container">
        <div class="sec-label reveal">Step by step</div>
        <h2 class="sec-h2 reveal d1">How it <em>works.</em></h2>
        <div class="flow-row reveal d2">${flowHTML}</div>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <div class="outcome-dark reveal">
          <div class="sec-label">Outcome</div>
          <div class="stats-row">${statsHTML}</div>
          <p class="outcome-quote">${d.outcomeQuote}</p>
        </div>
        <div class="uat-block reveal">
          <div class="sec-label" style="justify-content:center">UAT &amp; Handoff</div>
          <p class="uat-text">${d.uat}</p>
        </div>
        <div class="case-nav">${nav}</div>
      </div>
    </div>`;

  /* ── Attach nav button listeners (event delegation, no inline onclick) ── */
  document.getElementById('module-content').querySelectorAll('[data-nav]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const target=btn.dataset.nav;
      if(target==='parent') showPage('parent');
      else showModule(target);
    });
  });

  /* ── Navigate: if already on module page update in place; otherwise show page ── */
  const modulePage=document.getElementById('page-module');
  if(modulePage.classList.contains('active')){
    window.scrollTo({top:0,behavior:'instant'});
    setTimeout(()=>{observeReveal();},100);
  } else {
    showPage('module');
  }
}
