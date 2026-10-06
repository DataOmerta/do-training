'use strict';
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));

// THEME
function setTheme(t){
  localStorage.setItem('do_theme',t);
  document.body.className='theme-'+t;
  document.querySelectorAll('.theme-btn').forEach(b=>b.classList.toggle('active',b.title.toLowerCase().includes(t)));
}
(()=>{setTheme(localStorage.getItem('do_theme')||'blue');})();

function toggleFullscreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen().catch(()=>{});else document.exitFullscreen().catch(()=>{});}

// NAV
function showTab(name,el){
  document.querySelectorAll('#main-platform .tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  const tab=document.getElementById('tab-'+name);
  if(tab)tab.classList.add('active');
  if(el)el.classList.add('active');
  else document.querySelectorAll('.nav-link').forEach(l=>{if(l.getAttribute('href')==='#'+name)l.classList.add('active');});
  window.scrollTo(0,0);
}
function toggleMobileNav(){document.getElementById('nav-links').classList.toggle('open');}

// LANDING
function enterSite(){
  document.getElementById('landing-page').style.display='none';
  document.getElementById('main-platform').style.display='block';
  document.getElementById('donate-btn').style.display='flex';
  document.getElementById('webview-btn').style.display='flex';
  renderAds();
}
function enterSiteBook(){enterSite();setTimeout(()=>showTab('calendar',null),80);}

// TOAST
function showToast(msg,dur=3500){const t=document.getElementById('toast');t.textContent=msg;t.style.display='block';clearTimeout(window._tt);window._tt=setTimeout(()=>t.style.display='none',dur);}

// IMAGES
function applyImages(){
  if(typeof IMGS==='undefined')return;
  const s=(id,k)=>{const e=document.getElementById(id);if(e&&IMGS[k])e.src=IMGS[k];};
  s('landing-bg-sine','img_do_orange');
  s('landing-logo-watermark','img_do_logo');
  s('landing-logo-top','img_do_logo');
  s('nav-logo','img_do_logo');
  s('hero-logo-wm','img_do_logo');
  s('footer-logo','img_do_logo');
  s('res-do-img','img_do_logo');
  s('admin-logo','img_do_logo');
  s('admin-nav-logo','img_do_logo');
  s('cv-hero-img','img_hacker');
  s('footer-do-text','img_do_text_logo');
}

// TICKER — 20 items, track tripled for seamless loop
const TICKER_ITEMS=[
  {v:'36.2M',l:'CSAM reports to NCMEC CyberTipline in 2023'},
  {v:'300M+',l:'Children affected by online exploitation annually'},
  {v:'89%',l:'Rise in online grooming crimes 2017–2024 (NSPCC)'},
  {v:'440K',l:'AI-generated CSAM reports in 2024 — up 6,344%'},
  {v:'50%+',l:'Greek teenagers exposed to online violence (Greek SIC)'},
  {v:'21%',l:'Healthcare is the most cyber-attacked sector globally'},
  {v:'53%',l:'Hospital attacks increase patient mortality rates'},
  {v:'43%',l:'Hospitals hit by at least one ransomware attack'},
  {v:'155+',l:'Professionals trained by Dimitrios Paraschidis'},
  {v:'60K+',l:'Beneficiaries protected through digital security'},
  {v:'26',l:'Institutional databases designed and deployed in the field'},
  {v:'20%',l:'European children exposed to online harm annually'},
  {v:'51%',l:'Parents globally not using parental control tools'},
  {v:'€100',l:'Per hour — professional 1-on-1 training rate'},
  {v:'€400',l:'Non-refundable advance for corporate service delivery'},
  {v:'30%',l:'Discount when booking 3 or more training modules'},
  {v:'1 in 5',l:'Children aged 10-17 receive unwanted sexual solicitations online'},
  {v:'30.5%',l:'Adolescents bullied across 83-country study (PACER)'},
  {v:'MSc',l:'Dimitrios Paraschidis — Digital Forensics specialist'},
  {v:'3',l:'Academic books in progress: drones, cybersecurity, corporate training'},
];
function renderTicker(){
  const track=document.getElementById('ticker-track');
  if(!track)return;
  // Triple the items for seamless loop (CSS animates -33.333%)
  const html=TICKER_ITEMS.map(i=>`<span class="ticker-item"><strong>${i.v}</strong>${i.l}</span><span class="ticker-sep">|</span>`).join('');
  track.innerHTML=html+html+html;
}

// WHO CARDS
function renderWhoCards(){
  const g=document.getElementById('who-cards');if(!g)return;
  const T=k=>typeof t==='function'?t(k):k;
  const cards=[
    {icon:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',tk:'who_corp',td:'who_corp_d'},
    {icon:'<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',tk:'who_edu',td:'who_edu_d'},
    {icon:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',tk:'who_ind',td:'who_ind_d'},
    {icon:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',tk:'who_ngo',td:'who_ngo_d'},
  ];
  const defaults={who_corp:'Corporates & SMEs',who_corp_d:'Department-by-department training and ISO 27001/3 security policy implementation.',who_edu:'Educational Institutions',who_edu_d:'Seminars on safe digital behaviour, cyberbullying, and child online safety.',who_ind:'Individuals & Families',who_ind_d:'1-on-1 sessions on personal digital safety, privacy, and online threat awareness.',who_ngo:'NGOs & Humanitarian Orgs',who_ngo_d:'Anti-trafficking digital tools, secure data handling, and field digital safety protocols.'};
  g.innerHTML=cards.map(c=>`<div class="card"><div class="card-icon-wrap"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${c.icon}</svg></div><h3 data-i18n="${c.tk}">${defaults[c.tk]}</h3><p data-i18n="${c.td}">${defaults[c.td]}</p></div>`).join('');
}

function renderFormats(){
  const g=document.getElementById('formats-grid');if(!g)return;
  const items=[
    {icon:'<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',tk:'fmt_online',ts:'fmt_online_s'},
    {icon:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',tk:'fmt_onsite',ts:'fmt_onsite_s'},
    {icon:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',tk:'fmt_group',ts:'fmt_group_s'},
    {icon:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',tk:'fmt_cert',ts:'fmt_cert_s'},
  ];
  const def={fmt_online:'Live Online (1-on-1 or Group)',fmt_online_s:'Zoom / Teams / Google Meet',fmt_onsite:'Onsite — Thessaloniki & Region',fmt_onsite_s:'Your premises or agreed venue',fmt_group:'Group Seminars',fmt_group_s:'Department or team cohorts',fmt_cert:'Certified Completion',fmt_cert_s:'Professional certificate every module'};
  g.innerHTML=items.map(i=>`<div class="format-item"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4da6ff" stroke-width="1.5">${i.icon}</svg><div class="format-text"><strong data-i18n="${i.tk}">${def[i.tk]}</strong><span data-i18n="${i.ts}">${def[i.ts]}</span></div></div>`).join('');
}

// 16 NUMBERS (different from ticker)
const NUMBERS_16=[
  {v:'1 in 8',l:'Children globally affected by online sexual exploitation (Childlight 2023)'},
  {v:'6,344%',l:'Increase in AI-generated CSAM reports from 2023 to 2024'},
  {v:'7,000+',l:'Police-recorded online grooming offences in the UK in 2023-24'},
  {v:'1.17M',l:'CyberTipline reports submitted by Snapchat to NCMEC in 2024'},
  {v:'72%',l:'Of Omegle traffic involved sexual content before its closure'},
  {v:'$500K+',l:'Average ransomware demand to hospitals (Cynerio survey)'},
  {v:'34%',l:'Health sector respondents who paid the demanded ransom'},
  {v:'48%',l:'Medical device breaches leading to patient data theft'},
  {v:'39.4%',l:'Hospitality firms at cyber risk — medium-sized organisations'},
  {v:'52.3%',l:'Insurance sector at highest cyber risk — large organisations'},
  {v:'160K',l:'Lines of code in Dimitrios Paraschidis personal SOC build'},
  {v:'12',l:'Applications introduced during pandemic remote transition training'},
  {v:'9',l:'Field locations managed with zero-downtime digital infrastructure'},
  {v:'1,200+',l:'Level 1/2 IT support requests resolved in 12 months, zero unanswered'},
  {v:'150+',l:'Managers certified through TÜV Nord examination sessions'},
  {v:'400K+',l:'VoIP, PSTN and broadband connections maintained during OTE internship'},
];
function renderNumbers(){
  const g=document.getElementById('numbers-grid');if(!g)return;
  g.innerHTML=NUMBERS_16.map(n=>`<div class="number-card"><div class="number-val">${n.v}</div><div class="number-label">${n.l}</div></div>`).join('');
}

// MODULES — 15 total
const DEFAULT_MODULES=[
  {id:'m1',icon:'shield',title:'Cybersecurity Fundamentals',desc:'Core concepts: threats, attack vectors, defence strategies, safe digital habits. Real case studies from the field.',level:'Foundation',tags:['3-4 hours','Online / Onsite','Certificate'],visible:true},
  {id:'m2',icon:'search',title:'Digital Forensics Introduction',desc:'How digital investigations are conducted: evidence collection, chain of custody, open-source forensic tools.',level:'Intermediate',tags:['4 hours','Online / Onsite','Certificate'],visible:true},
  {id:'m3',icon:'wifi',title:'Network Security Essentials',desc:'Firewalls, VPNs, intrusion detection, network hardening. Practical exposure with real tools.',level:'Intermediate',tags:['3 hours','Online / Onsite','Certificate'],visible:true},
  {id:'m4',icon:'file-text',title:'GDPR & Data Protection',desc:'Practical GDPR compliance: rights, obligations, breach procedures, DPO basics.',level:'Foundation',tags:['2 hours','Online / Onsite','Certificate'],visible:true},
  {id:'m5',icon:'alert-triangle',title:'Social Engineering & Phishing Defence',desc:'Recognising, simulating, and defeating social attacks. Includes live phishing demonstration.',level:'Foundation',tags:['2-3 hours','Online / Onsite','Certificate'],visible:true},
  {id:'m6',icon:'activity',title:'Incident Response & Crisis Management',desc:'Step-by-step breach response: legal obligations, forensic preservation, communication plan.',level:'Advanced',tags:['3 hours','Online / Onsite','Certificate'],visible:true},
  {id:'m7',icon:'users',title:'Cyberbullying Awareness & Prevention',desc:'Recognition, documentation, legal response, and psychological impact. For schools, parents, HR.',level:'Foundation',tags:['90 min','Online / Onsite','Certificate'],visible:true},
  {id:'m8',icon:'heart',title:'Anti-Trafficking Digital Safety',desc:'Digital grooming recognition, secure communication for at-risk individuals, NGO field protocols.',level:'Specialist',tags:['90 min','Online / Onsite','Certificate'],visible:true},
  {id:'m9',icon:'lock',title:'Personal Digital Safety Audit',desc:'Full 1-on-1 audit: devices, accounts, passwords, digital footprint. Action plan provided.',level:'Foundation',tags:['90 min','1-on-1','Certificate'],visible:true},
  {id:'m10',icon:'briefcase',title:'Corporate Department Security Onboarding',desc:'Tailored per-department: HR, Finance, IT, Operations. Role-specific threat awareness.',level:'Intermediate',tags:['Half-day','Onsite / Online','Certificate'],visible:true},
  {id:'m11',icon:'settings',title:'Security Policy Implementation',desc:'Building SOPs, ISO 27001/3 alignment, staff compliance rollout. Ideal for SMEs and NGOs.',level:'Advanced',tags:['Full-day','Onsite / Online','Certificate'],visible:true},
  {id:'m12',icon:'trending-up',title:'Executive Digital Safety Briefing',desc:'Board/CEO-level: threat landscape, delegation of security, data protection responsibilities.',level:'Specialist',tags:['60 min','Online / Onsite','Certificate'],visible:true},
  {id:'m13',icon:'globe',title:'Cybersecurity for NGOs & Humanitarians',desc:'Field-ready digital safety: secure comms, data for beneficiaries, incident response.',level:'Specialist',tags:['Half-day','Online / Onsite','Certificate'],visible:true},
  {id:'m14',icon:'eye',title:'Privacy & GDPR for Individuals',desc:'Personal data rights under GDPR, how to exercise them, privacy controls for everyday life.',level:'Foundation',tags:['60 min','Online','Certificate'],visible:true},
  {id:'m15',icon:'cpu',title:'AI Threats & Defence in the Digital Age',desc:'How AI is used in cyberattacks: phishing mutation, deepfakes, autonomous malware. Defence strategies for organisations and individuals in an AI-accelerated threat landscape.',level:'Advanced',tags:['3 hours','Online / Onsite','Certificate'],visible:true},
];
function getModules(){try{const s=localStorage.getItem('do_modules');return s?JSON.parse(s):DEFAULT_MODULES;}catch(e){return DEFAULT_MODULES;}}

const ICONS={
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  search:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  wifi:'<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>',
  'file-text':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  'alert-triangle':'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  activity:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  heart:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  briefcase:'<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  'trending-up':'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  globe:'<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  cpu:'<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
};
function iconSVG(k){return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${ICONS[k]||ICONS['shield']}</svg>`;}
const LEVEL_CLS={Foundation:'level-foundation',Intermediate:'level-intermediate',Advanced:'level-advanced',Specialist:'level-specialist'};

function renderModules(){
  const g=document.getElementById('modules-grid');if(!g)return;
  const mods=getModules().filter(m=>m.visible!==false);
  g.innerHTML=mods.map(m=>`<div class="module-card" onclick="bookModule('${m.title.replace(/'/g,"\\'")}')"><span class="module-level ${LEVEL_CLS[m.level]||''}">${m.level}</span><div class="module-icon">${iconSVG(m.icon)}</div><h3>${m.title}</h3><p>${m.desc}</p><div class="module-meta">${m.tags.map(t=>`<span class="module-tag">${t}</span>`).join('')}</div></div>`).join('');
}
function bookModule(title){showTab('calendar',null);setTimeout(()=>{const s=document.getElementById('book-module');if(s){for(const o of s.options){if(o.value===title){o.selected=true;break;}}updateDiscountPreview();}showToast('Module selected. Choose a date and time.');},120);}

// SERVICES — ensure Online/Onsite not duplicated
const DEFAULT_SERVICES={
  individual:[
    {title:'Personal Digital Safety Audit',desc:'Full review of devices, accounts, and online presence. Action plan included.',dur:'90 min',mode:'Online / Onsite',mc:'mode-both',visible:true},
    {title:'Cyberbullying Awareness & Response',desc:'Understanding, documenting, and legally responding to cyberbullying incidents.',dur:'60 min',mode:'Online',mc:'mode-online',visible:true},
    {title:'Anti-Trafficking Digital Safety',desc:'Recognising digital grooming, secure communication for at-risk individuals.',dur:'90 min',mode:'Online / Onsite',mc:'mode-both',visible:true},
    {title:'Privacy & GDPR for Individuals',desc:'Practical privacy controls and data rights under GDPR.',dur:'60 min',mode:'Online',mc:'mode-online',visible:true},
  ],
  corporate:[
    {title:'Department Cybersecurity Onboarding',desc:'Per-department tailored training: HR, Finance, IT, Operations, Management.',dur:'Half-day',mode:'Online / Onsite',mc:'mode-both',visible:true},
    {title:'Security Policy Implementation',desc:'SOP writing, ISO 27001/3 alignment, staff compliance training rollout.',dur:'Full-day',mode:'Onsite',mc:'mode-onsite',visible:true},
    {title:'Executive Digital Safety Briefing',desc:'CEO/board-level briefing: threat landscape, data protection duties, security delegation.',dur:'60 min',mode:'Online / Onsite',mc:'mode-both',visible:true},
    {title:'Incident Response Training',desc:'What to do when a breach happens: steps, contacts, legal obligations, forensic preservation.',dur:'3 hours',mode:'Online / Onsite',mc:'mode-both',visible:true},
  ],
  seminar:[
    {title:'Cybersecurity Fundamentals (Full Seminar)',desc:'Complete introduction: threats, defences, safe practices, real case studies.',dur:'Full-day',mode:'Online / Onsite',mc:'mode-both',visible:true},
    {title:'Digital Forensics Introduction',desc:'How digital investigations work. Ideal for legal, HR, and compliance teams.',dur:'Half-day',mode:'Onsite',mc:'mode-onsite',visible:true},
    {title:'Social Engineering & Phishing Defence',desc:'Hands-on awareness: recognising, avoiding, and reporting social engineering attacks.',dur:'3 hours',mode:'Online / Onsite',mc:'mode-both',visible:true},
    {title:'Child Online Safety Seminar',desc:'65-slide comprehensive seminar: grooming, CSAM, cyberbullying, platform risks.',dur:'Half-day',mode:'Online / Onsite',mc:'mode-both',visible:true},
  ]
};
function getServices(){try{const s=localStorage.getItem('do_services');return s?JSON.parse(s):DEFAULT_SERVICES;}catch(e){return DEFAULT_SERVICES;}}

function svcItemHTML(svc){
  if(svc.visible===false)return'';
  return`<div class="service-item" onclick="bookServiceDirect('${svc.title.replace(/'/g,"\\'")}')"><div class="service-info"><div class="svc-title">${svc.title}</div><p>${svc.desc}</p></div><div class="service-meta"><span class="duration">${svc.dur}</span><span class="mode ${svc.mc}">${svc.mode}</span></div></div>`;
}

function renderServices(){
  const c=document.getElementById('services-container');if(!c)return;
  const svc=getServices();
  const def=typeof IMGS!=='undefined'?IMGS:{};
  c.innerHTML=`
<div class="service-category">
  <div class="service-cat-header"><span class="cat-badge cat-blue" data-i18n="individual_label">Individual</span><h3 data-i18n="svc_ind_title">1-on-1 Personal Sessions</h3></div>
  <div class="service-list">${svc.individual.map(svcItemHTML).join('')}</div>
</div>
<div class="service-category">
  <div class="service-cat-header"><span class="cat-badge cat-silver" data-i18n="corporate_label">Corporate</span><h3 data-i18n="svc_corp_title">Corporate Internal Training</h3></div>
  <div class="svc-img-wrap">
    <div class="svc-side-img-wrap"><img src="${def.img_defense||''}" alt="Defense in Depth" class="svc-side-img"></div>
    <div class="svc-items-col service-list">${svc.corporate.map(svcItemHTML).join('')}</div>
  </div>
</div>
<div class="service-category">
  <div class="service-cat-header"><span class="cat-badge cat-white" data-i18n="seminar_label">Seminar</span><h3 data-i18n="svc_sem_title">Public &amp; Group Seminars</h3></div>
  <div class="svc-img-wrap">
    <div class="svc-items-col service-list">${svc.seminar.map(svcItemHTML).join('')}</div>
    <div class="svc-side-img-wrap"><img src="${def.img_ai_attacks||''}" alt="AI Attacks" class="svc-side-img"></div>
  </div>
</div>`;
  applyTranslations();
}

function bookServiceDirect(title){showTab('calendar',null);setTimeout(()=>{const s=document.getElementById('book-module');if(s){for(const o of s.options){if(o.value===title){o.selected=true;break;}}updateDiscountPreview();}showToast(`"${title}" selected. Choose a date and time.`);},120);}

function populateModuleDropdowns(){
  const all=getModules().filter(m=>m.visible!==false).map(m=>m.title);
  const svc=getServices();
  const st=[...svc.individual,...svc.corporate,...svc.seminar].filter(s=>s.visible!==false).map(s=>s.title);
  const combined=[...new Set([...all,...st])];
  ['book-module','book-module2','book-module3'].forEach((id,i)=>{
    const el=document.getElementById(id);if(!el)return;
    const ph=i===0?(typeof t==='function'?t('form_select_module'):'— Select a module —'):(typeof t==='function'?t('form_none'):'— None —');
    el.innerHTML=`<option value="">${ph}</option>`+combined.map(tt=>`<option value="${tt}">${tt}</option>`).join('');
  });
  const fmt=document.getElementById('book-format');
  if(fmt){
    const fo=typeof t==='function'?[t('format_online'),t('format_onsite_th'),t('format_onsite_other')]:['Online (Zoom / Teams / Meet)','Onsite — Thessaloniki','Onsite — Other location (arrange)'];
    fmt.innerHTML=`<option value="">${typeof t==='function'?t('form_select_format'):'— Select format —'}</option>`+fo.map(f=>`<option>${f}</option>`).join('');
  }
}

function updateDiscountPreview(){
  const m1=document.getElementById('book-module')?.value;
  const m2=document.getElementById('book-module2')?.value;
  const m3=document.getElementById('book-module3')?.value;
  const el=document.getElementById('discount-preview');if(!el)return;
  const count=[m1,m2,m3].filter(Boolean).length;
  if(count>=3){el.style.display='block';el.textContent='3+ modules selected — 30% discount applies. First 1,000 users get an extra 10%.';}
  else if(count===2){el.style.display='block';el.textContent='2 modules selected — 20% discount applies. First 1,000 users get an extra 10%.';}
  else el.style.display='none';
}

// APPOINTMENTS
let appointments=[];
try{appointments=JSON.parse(localStorage.getItem('do_appointments')||'[]');}catch(e){appointments=[];}
if(!appointments.length){
  appointments=[
    {id:'APT001',name:'Maria Economou',email:'maria@example.com',module:'Cybersecurity Fundamentals',module2:'',module3:'',date:'2026-10-15',time:'10:00',format:'Online (Zoom / Teams / Meet)',org:'Eurobank HR',status:'confirmed',notes:'',meetLink:'https://meet.google.com/apt-001d-emox'},
    {id:'APT002',name:'Nikos Stavros',email:'nikos@example.com',module:'GDPR & Data Protection',module2:'Social Engineering & Phishing Defence',module3:'',date:'2026-10-18',time:'14:00',format:'Online (Zoom / Teams / Meet)',org:'',status:'pending',notes:'20% discount applied.',meetLink:'https://meet.google.com/apt-002n-ikst'},
    {id:'APT003',name:'Eleni Papadaki',email:'eleni@example.com',module:'Child Online Safety Seminar',module2:'',module3:'',date:'2026-09-20',time:'11:00',format:'Onsite — Thessaloniki',org:'2nd High School Thessaloniki',status:'completed',notes:'',meetLink:''},
  ];
  saveAppointments();
}
function saveAppointments(){try{localStorage.setItem('do_appointments',JSON.stringify(appointments));}catch(e){}}

function generateMeetLink(apptId){
  const h=apptId.toLowerCase().replace(/[^a-z0-9]/g,'').padEnd(10,'x').slice(0,10);
  return`https://meet.google.com/${h.slice(0,3)}-${h.slice(3,7)}-${h.slice(7,10)}x`;
}

// BOOKING
let selectedDate=null,selectedTime=null;
function submitBooking(){
  const name=document.getElementById('book-name')?.value.trim();
  const email=document.getElementById('book-email')?.value.trim();
  const mod=document.getElementById('book-module')?.value;
  const fmt=document.getElementById('book-format')?.value;
  if(!name){showToast('Please enter your full name.');return;}
  if(!email||!email.includes('@')){showToast('Please enter a valid email.');return;}
  if(!mod){showToast('Please select a training module.');return;}
  if(!fmt){showToast('Please select a format.');return;}
  if(!selectedDate){showToast('Please select a date.');return;}
  if(!selectedTime){showToast('Please select a time slot.');return;}
  const mod2=document.getElementById('book-module2')?.value||'';
  const mod3=document.getElementById('book-module3')?.value||'';
  const id='APT'+Date.now().toString().slice(-7);
  const mods=[mod,mod2,mod3].filter(Boolean);
  const disc=mods.length>=3?'30%':mods.length===2?'20%':'';
  const meetLink=fmt.toLowerCase().includes('online')?generateMeetLink(id):'';
  const appt={id,name,email,module:mod,module2:mod2,module3:mod3,date:selectedDate,time:selectedTime,format:fmt,org:document.getElementById('book-org')?.value.trim()||'',notes:document.getElementById('book-notes')?.value.trim()||'',status:'pending',meetLink,discount:disc,bookedAt:new Date().toISOString()};
  appointments.unshift(appt);saveAppointments();
  showToast(`Booking submitted. ID: ${id}${disc?' — '+disc+' discount noted.':''}`);
  sendAdminNotificationEmail(appt);
  ['book-name','book-email','book-phone','book-org','book-notes'].forEach(i=>{const e=document.getElementById(i);if(e)e.value='';});
  ['book-module','book-module2','book-module3','book-format'].forEach(i=>{const e=document.getElementById(i);if(e)e.value='';});
  const dp=document.getElementById('discount-preview');if(dp)dp.style.display='none';
  const bs=document.getElementById('booking-summary');if(bs)bs.style.display='none';
  selectedDate=null;selectedTime=null;renderCalendar();
  setTimeout(()=>showUpsell(mod,id),1200);
}

// EMAILJS
const EMAILJS_CONFIG={publicKey:'YOUR_EMAILJS_PUBLIC_KEY',serviceId:'YOUR_EMAILJS_SERVICE_ID',adminTemplateId:'YOUR_ADMIN_NOTIFICATION_TEMPLATE_ID',clientConfirmTemplateId:'YOUR_CLIENT_CONFIRM_TEMPLATE_ID'};
function loadEmailJS(){if(window.emailjs)return Promise.resolve();return new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';s.onload=()=>{window.emailjs.init(EMAILJS_CONFIG.publicKey);res();};s.onerror=rej;document.head.appendChild(s);});}
function sendAdminNotificationEmail(appt){if(EMAILJS_CONFIG.publicKey==='YOUR_EMAILJS_PUBLIC_KEY')return;loadEmailJS().then(()=>{const mods=[appt.module,appt.module2,appt.module3].filter(Boolean).join(' + ');window.emailjs.send(EMAILJS_CONFIG.serviceId,EMAILJS_CONFIG.adminTemplateId,{to_email:'gds_gr@hotmail.gr',booking_id:appt.id,client_name:appt.name,client_email:appt.email,client_org:appt.org||'Not specified',modules:mods,date:appt.date,time:appt.time,format:appt.format,meet_link:appt.meetLink||'N/A (onsite)',discount:appt.discount||'None',notes:appt.notes||'None'}).catch(()=>{}); }).catch(()=>{});}
function sendClientConfirmEmail(appt){if(EMAILJS_CONFIG.publicKey==='YOUR_EMAILJS_PUBLIC_KEY')return;loadEmailJS().then(()=>{const mods=[appt.module,appt.module2,appt.module3].filter(Boolean).join(' + ');window.emailjs.send(EMAILJS_CONFIG.serviceId,EMAILJS_CONFIG.clientConfirmTemplateId,{to_email:appt.email,client_name:appt.name,modules:mods,date:appt.date,time:appt.time,format:appt.format,meet_link:appt.meetLink||'Will be confirmed onsite',discount:appt.discount?appt.discount+' discount applied':'Standard pricing',trainer_name:'Dimitrios Paraschidis',trainer_email:'gds_gr@hotmail.gr',trainer_phone:'+30 6947 424 107'}).catch(()=>{}); }).catch(()=>{});}
function sendContactEmail(name,email,subject,message){if(EMAILJS_CONFIG.publicKey==='YOUR_EMAILJS_PUBLIC_KEY')return;loadEmailJS().then(()=>{window.emailjs.send(EMAILJS_CONFIG.serviceId,EMAILJS_CONFIG.adminTemplateId,{to_email:'gds_gr@hotmail.gr',client_name:name,client_email:email,booking_id:'CONTACT',modules:subject,date:new Date().toISOString().slice(0,10),time:'',format:'Contact Form',meet_link:'',discount:'',notes:message}).catch(()=>{}); }).catch(()=>{});}

// CONTACT FORM
function submitContact(){
  const name=document.getElementById('contact-name')?.value.trim();
  const email=document.getElementById('contact-email')?.value.trim();
  const subject=document.getElementById('contact-subject')?.value.trim();
  const msg=document.getElementById('contact-message')?.value.trim();
  if(!name||!email||!msg){showToast('Please fill in name, email and message.');return;}
  sendContactEmail(name,email,subject,msg);
  showToast('Message sent. You will hear back within 24 hours.');
  ['contact-name','contact-email','contact-subject','contact-message'].forEach(i=>{const e=document.getElementById(i);if(e)e.value='';});
}

// UPSELL
const UPSELL_DEF=[{title:'Social Engineering & Phishing Defence',note:'Pairs perfectly with any security training'},{title:'GDPR & Data Protection',note:'Essential for organisations handling personal data'},{title:'Incident Response & Crisis Management',note:'Know what to do when things go wrong'}];
function showUpsell(booked){
  const sug=UPSELL_DEF.filter(s=>s.title!==booked).slice(0,3);
  document.getElementById('upsell-content').innerHTML=`<div class="upsell-title">Enhance your training</div><div class="upsell-sub">You booked <strong>${booked}</strong>. Add more modules and save up to 30%.</div><div class="upsell-options">${sug.map(s=>`<div class="upsell-option" onclick="closeUpsell();bookServiceDirect('${s.title.replace(/'/g,"\\'")}')"><div><strong>${s.title}</strong><br><span style="font-size:11px;color:var(--text-m)">${s.note}</span></div><span>Add</span></div>`).join('')}</div><div class="upsell-discount-note">2 modules = <strong>20% off</strong> &nbsp;|&nbsp; 3+ = <strong>30% off</strong><br><span style="color:#ffd700;font-size:12px">First 1,000 users: extra 10%</span></div>`;
  document.getElementById('upsell-modal').style.display='flex';
}
function closeUpsell(){document.getElementById('upsell-modal').style.display='none';}

// RESOURCES
const DEFAULT_RESOURCES=[
  {id:'r1',type:'file',title:'CyberSafe Guardian — Basics',typeLabel:'PDF Guide · Bilingual EN/GR',desc:'Comprehensive bilingual educational guide on child online safety: grooming, CSAM, cyberbullying, legal frameworks, platform risks. 2020-2024 data.',url:'assets/Cybersafe_Guardian_Basics.pdf',download:true,thumb:'healthcare',requiresEmail:false,visible:true},
  {id:'r2',type:'file',title:'Child Cybersafety — Full Seminar Presentation',typeLabel:'PowerPoint · 65 Slides · Greek',desc:'65-slide professional presentation: digital landscape, platform risks, grooming stages, CSAM, sextortion, cyberbullying, legal framework, emergency contacts.',url:'assets/CyberSafety_Children_Presentation.pptx',download:true,thumb:'worldmonitor',requiresEmail:false,visible:true},
];
function getResources(){try{const s=localStorage.getItem('do_resources');return s?JSON.parse(s):DEFAULT_RESOURCES;}catch(e){return DEFAULT_RESOURCES;}}
function renderResources(){
  const g=document.getElementById('resources-grid');if(!g)return;
  const res=getResources().filter(r=>r.visible!==false);
  if(!res.length){g.innerHTML='<p style="color:var(--text-m)">No resources currently available.</p>';return;}
  const def=typeof IMGS!=='undefined'?IMGS:{};
  g.innerHTML=res.map(r=>{
    const th=def['img_'+(r.thumb||'healthcare')]||'';
    if(r.type==='link')return`<div class="resource-url-card"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--do-5)" stroke-width="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg><div><div class="ru-title">${r.title}</div><a href="${r.url}" target="_blank" class="ru-url">${r.url}</a>${r.desc?`<p style="font-size:.8rem;color:var(--text-m);margin-top:4px">${r.desc}</p>`:''}</div></div>`;
    return`<div class="resource-card"><div class="resource-thumb">${th?`<img src="${th}" alt="${r.title}">`:''}<div class="resource-thumb-badge">${r.typeLabel}</div></div><div class="resource-info"><div class="resource-type-badge">${r.typeLabel}</div><h3>${r.title}</h3><p>${r.desc}</p><a href="${r.url}" ${r.download?'download':'target="_blank"'} class="btn-download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>${r.download?'Download Free':'Open Resource'}</a></div></div>`;
  }).join('');
}

// LINKEDIN
const LI_POSTS=[
  {date:'Dec 2024',title:'CyberSafe Guardian — Free Bilingual Guide',desc:'A comprehensive bilingual (EN/GR) educational resource on child online safety — threats, grooming, CSAM, legal frameworks. Free to share.',url:'https://www.linkedin.com/in/dimitris-p-timeless'},
  {date:'Nov 2024',title:'Secure File Sharing with Filemail',desc:'Practical guide on using Filemail for secure, large-file sharing without exposing sensitive data via email attachments.',url:'https://www.linkedin.com/posts/dimitris-p-timeless_secure-file-sharing-filemail-activity-7466232743698513920-20wT'},
  {date:'Oct 2024',title:'AI-Powered Threats: What Organisations Must Know',desc:'AI-aided and AI-embedded attacks are no longer theoretical. Phishing mutation, malware bypass, machine-speed attacks — and what new defences are required.',url:'https://www.linkedin.com/in/dimitris-p-timeless'},
  {date:'Sep 2024',title:'Child Safety Online — 65-Slide Seminar (Greek)',desc:'Full Greek-language seminar on child cybersafety — used in schools, parent associations, and NGO workshops across Greece.',url:'https://www.linkedin.com/in/dimitris-p-timeless'},
  {date:'Aug 2024',title:'Defense-in-Depth: A Bird\'s Eye View',desc:'End-user protection through to SIEM and governance — a complete walkthrough of enterprise defence architecture.',url:'https://www.linkedin.com/in/dimitris-p-timeless'},
  {date:'Jul 2024',title:'Healthcare Cybersecurity — The Alarming Numbers',desc:'Healthcare is the most targeted sector at 21% — 90% increase. 53% of hospital attacks increase mortality rates.',url:'https://www.linkedin.com/in/dimitris-p-timeless'},
];
function renderLinkedIn(){
  const g=document.getElementById('linkedin-posts-grid');if(!g)return;
  g.innerHTML=LI_POSTS.map(p=>`<div class="li-post-card"><div class="li-date">${p.date}</div><h4>${p.title}</h4><p>${p.desc}</p><a href="${p.url}" target="_blank">View on LinkedIn</a></div>`).join('');
}

// TEAM
function getTeam(){try{const s=localStorage.getItem('do_team');return s?JSON.parse(s):[];}catch(e){return[];}}
function renderTeam(){
  const g=document.getElementById('team-grid');if(!g)return;
  const team=getTeam();
  if(!team.length){g.innerHTML='<div class="empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><h3>Team members coming soon</h3><p>Partners and collaborators will appear here.</p></div>';return;}
  const hasBooking=false; // visitors always see blurred contacts
  g.innerHTML=team.map(m=>`<div class="team-card"><div>${m.photo?`<img class="team-photo" src="${m.photo}" alt="${m.name}">`:`<div class="team-photo-placeholder">${m.name.slice(0,2).toUpperCase()}</div>`}</div><div class="team-name">${m.name}</div><div class="team-title">${m.specialization||''}</div><div class="team-edu">${m.education||''}</div>${m.company?`<div class="team-company">${m.company}</div>`:''}<div class="team-contacts"><span class="team-contact-blur ${hasBooking?'unblurred':''}">${m.linkedin||'LinkedIn'}</span><span class="team-contact-blur ${hasBooking?'unblurred':''}">${m.email||'Email'}</span></div><div class="team-locked-note" style="${hasBooking?'display:none':''}">Contact details visible after confirmed booking.</div></div>`).join('');
}

// ADS
function getAds(){try{const s=localStorage.getItem('do_ads');return s?JSON.parse(s):[];}catch(e){return[];}}
function renderAds(){
  const ads=getAds();
  const left=ads.filter(a=>a.col==='left'&&a.visible!==false);
  const right=ads.filter(a=>a.col==='right'&&a.visible!==false);
  const lc=document.getElementById('ad-col-left');
  const rc=document.getElementById('ad-col-right');
  const mp=document.getElementById('main-platform');
  if(lc)lc.innerHTML=left.map(a=>`<a class="ad-item" href="${a.url}" target="_blank" title="${a.name||''}"><img src="${a.img}" alt="${a.name||'Ad'}"></a>`).join('');
  if(rc)rc.innerHTML=right.map(a=>`<a class="ad-item" href="${a.url}" target="_blank" title="${a.name||''}"><img src="${a.img}" alt="${a.name||'Ad'}"></a>`).join('');
  if(mp&&(left.length||right.length))mp.classList.add('has-ads');
  else if(mp)mp.classList.remove('has-ads');
}

// CV
function renderCV(){
  const s=document.getElementById('cv-section-content');if(!s)return;
  const src=typeof IMGS!=='undefined'&&IMGS.img_hacker?IMGS.img_hacker:'';
  s.innerHTML=`<div class="cv-hero-wrap"><img class="cv-hero-img" src="${src}" alt="Cybersecurity Operations"><div class="cv-hero-overlay"><div class="cv-hero-badge">MSc Digital Forensics &middot; Cybersecurity Educator</div></div></div><div class="cv-header"><div class="cv-avatar">DP</div><div class="cv-identity"><h1>Dimitrios Paraschidis</h1><p class="cv-title-line">MSc Applied Informatics &middot; BSc Informatics &amp; Telecommunications</p><p class="cv-subtitle-line">Cybersecurity Specialist &middot; Digital Forensics Expert &middot; IT Educator &middot; Author</p><div class="cv-contacts"><span>Thessaloniki, Greece</span><span>gds_gr@hotmail.gr</span><span>+30 6947 424 107</span><a href="https://www.linkedin.com/in/dimitris-p-timeless" target="_blank">LinkedIn</a></div></div></div><div class="cv-body"><div class="cv-col-main"><div class="cv-block"><h2>Professional Summary</h2><p>IT professional and educator specialising in digital security, digital forensics, and organisational cybersecurity training. MSc in Applied Informatics (IT Security, Digital Forensics, e-Discovery) and BSc in Informatics and Telecommunications.</p><p>Dissertation: <em>Digital Forensics Techniques using Open-Source Software and Case Management for Digital Crimes.</em> Currently authoring 3 academic books. Personal SOC built with custom OS and AI integrations (~160,000 lines of code).</p></div><div class="cv-block"><h2>Professional Experience</h2><div class="cv-job"><div class="cv-job-header"><strong>Education Executive</strong><span class="cv-job-org">KMOP — Ministry of Social Cohesion / Ministry of Digital Governance, Greece</span></div><ul><li>Digital skills training for the public: OS, government digital systems, internet applications.</li><li>All Digital programme targeting elderly and people with disabilities (EDYTE network).</li></ul></div><div class="cv-job"><div class="cv-job-header"><strong>Adjunct Professor</strong><span class="cv-job-org">University of Derby at Mediterranean College Greece &middot; 2023–Present</span></div><ul><li>Cybersecurity and Network Protocols; Virtual Environments &amp; Game Design for Education.</li><li>Systems Programming, Language Design &amp; Implementation; Dissertation supervision.</li></ul></div><div class="cv-job"><div class="cv-job-header"><strong>IT Instructor</strong><span class="cv-job-org">IEK Delta 360 &middot; 2025–2026, Thessaloniki</span></div><ul><li>Applied Information Systems, DBMS/SQL, Programming (C, C++, C#, OpenGL).</li><li>IT in Healthcare, Computer Architecture, Game Development.</li></ul></div><div class="cv-job"><div class="cv-job-header"><strong>Data Management Supervisor / Head of National Digital Security / National Trainer</strong><span class="cv-job-org">Swiss NGO, Thessaloniki &middot; 2019–2021</span></div><ul><li>Managed sensitive digital data across 9 locations for ~60,000 beneficiaries.</li><li>Deployed GDPR governance, cloud applications, and 26 core databases.</li><li>Trained 155 colleagues over 2 months; introduced 12 applications for pandemic remote transition.</li><li>Handled 1,200+ Level 1/2 IT support requests in 12 months with zero unanswered emails.</li></ul></div><div class="cv-job"><div class="cv-job-header"><strong>Certification Examiner</strong><span class="cv-job-org">TÜV Nord, Macedonia &middot; 2017–2018</span></div><ul><li>Professional certification exams for 150+ managers across Thessaloniki.</li></ul></div><div class="cv-job"><div class="cv-job-header"><strong>IT Support / Security Incident Response</strong><span class="cv-job-org">Lixsys, Thessaloniki &middot; 2015–2016</span></div><ul><li>CRM systems, digital telephony, security incident first response.</li></ul></div><div class="cv-job"><div class="cv-job-header"><strong>Telecommunications Engineer (Internship)</strong><span class="cv-job-org">OTE Group, Thessaloniki &middot; 2014</span></div><ul><li>Central hub maintenance for 400,000+ VoIP, PSTN, ADSL, VDSL, ISDN connections.</li></ul></div></div></div><div class="cv-col-side"><div class="cv-block"><h2>Education</h2><div class="cv-edu"><strong>MSc Applied Informatics</strong><span>International Hellenic University &middot; 2017</span><em>IT Security, Digital Forensics, e-Discovery, Business Intelligence, Training</em></div><div class="cv-edu"><strong>BSc Informatics &amp; Telecommunications</strong><span>International Hellenic University &middot; 2012</span><em>Network Security, Telecommunications.</em></div></div><div class="cv-block"><h2>Certifications</h2><ul class="cv-list"><li>Train the Trainer — TÜV Nord</li><li>ECDL — European Computer Driving License</li><li>Cambridge English Certification</li><li>Michigan English Certification</li><li>IELTS — Professional English</li></ul></div><div class="cv-block"><h2>Technical Skills</h2><div class="skill-tags"><span class="skill-tag">Network Security</span><span class="skill-tag">Cybersecurity</span><span class="skill-tag">Digital Forensics</span><span class="skill-tag">GDPR</span><span class="skill-tag">Python</span><span class="skill-tag">PowerShell</span><span class="skill-tag">SQL / DBMS</span><span class="skill-tag">Moodle / LMS</span><span class="skill-tag">ISO 27001/3</span><span class="skill-tag">Social Engineering</span><span class="skill-tag">Incident Response</span><span class="skill-tag">SOC Operations</span><span class="skill-tag">OSINT</span><span class="skill-tag">PhotoDNA</span><span class="skill-tag">Drone Engineering</span><span class="skill-tag">AI Threat Analysis</span></div></div><div class="cv-block"><h2>Languages</h2><ul class="cv-list"><li>Greek — Native</li><li>English — Fluent (Cambridge, Michigan, IELTS)</li></ul></div><div class="cv-block"><h2>Notable Achievements</h2><ul class="cv-list"><li>60,000+ beneficiaries protected</li><li>155+ professionals trained</li><li>26 institutional databases deployed</li><li>Personal SOC: ~160,000 lines of custom code</li><li>3 academic books in progress</li><li>Author: CyberSafe Guardian bilingual guide</li><li>65-slide child cybersafety seminar in active use in schools</li></ul></div></div></div>`;
}

// KEYBOARD SHORTCUT: Ctrl+Shift+D+O
let _kSeq='';
document.addEventListener('keydown',e=>{
  if(e.shiftKey&&(e.key==='D'||e.key==='d'||e.key==='O'||e.key==='o')){
    _kSeq+=e.key.toUpperCase();
    if(_kSeq.endsWith('DO')){_kSeq='';openAdminLogin();}
    if(_kSeq.length>6)_kSeq='';
  } else if(!e.shiftKey){_kSeq='';}
});
function openAdminLogin(){
  if(localStorage.getItem('do_admin_remember')==='1'){showAdminPanel();return;}
  const ol=document.getElementById('admin-login-overlay');
  if(ol){ol.style.display='flex';setTimeout(()=>document.getElementById('admin-user')?.focus(),100);}
}
function closeAdminLogin(){const ol=document.getElementById('admin-login-overlay');if(ol)ol.style.display='none';}

// INIT
document.addEventListener('DOMContentLoaded',()=>{
  detectLanguage().then(()=>{
    applyImages();
    renderTicker();
    renderWhoCards();
    renderFormats();
    renderNumbers();
    renderModules();
    renderServices();
    renderResources();
    renderLinkedIn();
    renderTeam();
    renderAds();
    renderCV();
    populateModuleDropdowns();
    renderCalendar();
    updateCertId();
    const d=document.getElementById('cert-date');if(d)d.value=new Date().toISOString().slice(0,10);
    renderIssuedCerts();
    document.getElementById('lang-bar').style.display='flex';
    applyTranslations();
  });
});
