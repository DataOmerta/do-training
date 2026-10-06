'use strict';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123!@#';

function doAdminLogin() {
  const user = document.getElementById('admin-user')?.value.trim();
  const pass = document.getElementById('admin-pass')?.value;
  const rem  = document.getElementById('admin-remember')?.checked;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    if (rem) localStorage.setItem('do_admin_remember', '1');
    closeAdminLogin();
    showAdminPanel();
  } else {
    if (typeof showToast === 'function') showToast('Incorrect credentials.');
    const p = document.getElementById('admin-pass'); if (p) p.value = '';
  }
}

function showAdminPanel() {
  document.getElementById('main-platform').style.display  = 'none';
  document.getElementById('landing-page').style.display   = 'none';
  document.getElementById('admin-panel').style.display    = 'block';
  const db = document.getElementById('donate-btn');   if (db) db.style.display = 'none';
  const wb = document.getElementById('webview-btn');  if (wb) wb.style.display = 'none';
  if (typeof IMGS !== 'undefined') {
    ['admin-logo','admin-nav-logo'].forEach(id => { const e=document.getElementById(id); if(e&&IMGS.img_do_logo) e.src=IMGS.img_do_logo; });
  }
  renderAdminDashboard();
  renderAdminAppointments();
  renderModulesManager();
  renderServicesManager();
  renderResourcesManager();
  renderTeamManager();
  renderAdsManager();
  renderIssuedCerts();
  updateCertId();
  const d = document.getElementById('cert-date'); if (d) d.value = new Date().toISOString().slice(0,10);
}

function adminLogout() {
  localStorage.removeItem('do_admin_remember');
  document.getElementById('admin-panel').style.display   = 'none';
  document.getElementById('landing-page').style.display  = 'flex';
}

function showAdminTab(name, btn) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
  const tab = document.getElementById('admin-tab-' + name);
  if (tab) tab.classList.add('active');
  if (btn) btn.classList.add('active');
}

// DASHBOARD
function renderAdminDashboard() {
  const g = document.getElementById('admin-stats-grid'); if (!g) return;
  const total     = appointments.length;
  const pending   = appointments.filter(a=>a.status==='pending').length;
  const confirmed = appointments.filter(a=>a.status==='confirmed').length;
  const completed = appointments.filter(a=>a.status==='completed').length;
  const cancelled = appointments.filter(a=>a.status==='cancelled').length;
  let revenue = 0;
  appointments.filter(a=>a.status!=='cancelled').forEach(a=>{
    const mods=[a.module,a.module2,a.module3].filter(Boolean).length;
    const base=mods*200;
    const disc=mods>=3?0.30:mods===2?0.20:0;
    revenue+=base*(1-disc);
  });
  const modCount={};
  appointments.forEach(a=>[a.module,a.module2,a.module3].filter(Boolean).forEach(m=>{modCount[m]=(modCount[m]||0)+1;}));
  const topMod=Object.entries(modCount).sort((a,b)=>b[1]-a[1])[0];
  const certsN=(typeof issuedCerts!=='undefined'?issuedCerts:JSON.parse(localStorage.getItem('do_certs')||'[]')).length;
  const teamN=(typeof getTeam==='function'?getTeam():[]).length;
  const adsN=(typeof getAds==='function'?getAds():[]).length;
  g.innerHTML=`
    <div class="admin-stat-card"><div class="admin-stat-val">${total}</div><div class="admin-stat-label">Total Bookings</div></div>
    <div class="admin-stat-card"><div class="admin-stat-val" style="color:#ffd700">${pending}</div><div class="admin-stat-label">Pending</div></div>
    <div class="admin-stat-card"><div class="admin-stat-val" style="color:#4ade80">${confirmed}</div><div class="admin-stat-label">Confirmed</div></div>
    <div class="admin-stat-card"><div class="admin-stat-val" style="color:#4da6ff">${completed}</div><div class="admin-stat-label">Completed</div></div>
    <div class="admin-stat-card"><div class="admin-stat-val" style="color:#f87171">${cancelled}</div><div class="admin-stat-label">Cancelled</div></div>
    <div class="admin-stat-card"><div class="admin-stat-val">€${revenue.toLocaleString()}</div><div class="admin-stat-label">Est. Revenue</div><div class="admin-stat-sub">€100/hr · 2hr min · discounts applied</div></div>
    <div class="admin-stat-card"><div class="admin-stat-val">${certsN}</div><div class="admin-stat-label">Certificates Issued</div></div>
    <div class="admin-stat-card"><div class="admin-stat-val">${teamN}</div><div class="admin-stat-label">Team Members</div></div>
    <div class="admin-stat-card"><div class="admin-stat-val">${adsN}</div><div class="admin-stat-label">Active Ads</div></div>
    <div class="admin-stat-card"><div class="admin-stat-val" style="font-size:1rem;color:white">${topMod?topMod[0].split(' ').slice(0,2).join(' ')+'…':'N/A'}</div><div class="admin-stat-label">Most Popular Module</div>${topMod?`<div class="admin-stat-sub">${topMod[1]} bookings</div>`:''}</div>
  `;
  const cr=document.getElementById('admin-chart-row'); if(!cr)return;
  const bd=[{l:'Pending',v:pending,c:'#ffd700'},{l:'Confirmed',v:confirmed,c:'#4ade80'},{l:'Completed',v:completed,c:'#4da6ff'},{l:'Cancelled',v:cancelled,c:'#f87171'}];
  const mx=Math.max(...bd.map(b=>b.v),1);
  cr.innerHTML=`<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-lg);padding:1.5rem;margin-top:1rem;">
    <div style="font-size:.88rem;font-weight:600;color:var(--text);margin-bottom:1rem">Bookings by Status</div>
    <div style="display:flex;align-items:flex-end;gap:1rem;height:120px">${bd.map(b=>`<div style="display:flex;flex-direction:column;align-items:center;gap:6px;flex:1"><div style="font-size:11px;color:var(--text-m)">${b.v}</div><div style="width:100%;background:${b.c};border-radius:4px 4px 0 0;height:${Math.round((b.v/mx)*90)+10}px"></div><div style="font-size:10px;color:var(--text-m);text-align:center">${b.l}</div></div>`).join('')}</div>
    <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border);font-size:.82rem;color:var(--text-m)"><strong style="color:var(--do-5)">Pricing:</strong> €100/hr · min 2hrs/module · €400 non-refundable advance for corporate services · 2 modules 20% off · 3+ modules 30% off · First 1,000 users extra 10%.</div>
  </div>`;
}

// APPOINTMENTS ADMIN
function renderAdminAppointments(filtered) {
  const list=document.getElementById('appointments-list'); if(!list)return;
  const data=filtered!==undefined?filtered:appointments;
  if(!data.length){list.innerHTML=`<div class="empty-state"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><h3>No appointments found</h3><p>Bookings appear here.</p></div>`;return;}
  list.innerHTML=data.map(a=>{
    const mods=[a.module,a.module2,a.module3].filter(Boolean).join(' + ');
    const disc=a.discount?` · <span style="color:#ffd700;font-weight:600">${a.discount} off</span>`:'';
    const meet=a.meetLink?`<a href="${a.meetLink}" target="_blank" class="meet-link"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="15" height="10" rx="2"/><path d="M17 9l5-2v10l-5-2V9z"/></svg>Google Meet</a>`:'';
    return`<div class="appt-card"><div class="appt-info"><h4>${a.name}${a.org?` <span style="font-weight:400;color:var(--text-m)">· ${a.org}</span>`:''}</h4><span>${a.email}</span><span>${mods}${disc}</span><span>${a.date} at ${a.time} · ${a.format}</span>${a.notes?`<span style="font-style:italic">${a.notes}</span>`:''} ${meet}</div><div class="appt-meta"><span class="status-badge status-${a.status}">${a.status}</span><div class="appt-actions">${a.status==='pending'?`<button class="appt-btn success" onclick="adminConfirmAppt('${a.id}')">Confirm</button>`:''}${a.status==='confirmed'?`<button class="appt-btn success" onclick="adminUpdateStatus('${a.id}','completed')">Done</button>`:''}${a.status!=='cancelled'&&a.status!=='completed'?`<button class="appt-btn" onclick="openReschedule('${a.id}')">Reschedule</button><button class="appt-btn danger" onclick="adminUpdateStatus('${a.id}','cancelled')">Cancel</button>`:''}${a.status==='completed'?`<button class="appt-btn gold" onclick="prefillCert('${a.id}')">Issue Cert</button>`:''}</div></div></div>`;
  }).join('');
}

function adminConfirmAppt(id){const a=appointments.find(x=>x.id===id);if(!a)return;a.status='confirmed';saveAppointments();if(typeof sendClientConfirmEmail==='function')sendClientConfirmEmail(a);renderAdminAppointments();renderAdminDashboard();if(typeof showToast==='function')showToast(`Confirmed. Email sent to ${a.email}.`);}
function adminUpdateStatus(id,status){const a=appointments.find(x=>x.id===id);if(!a)return;a.status=status;saveAppointments();if(status==='cancelled')notifyClientChange(a,'cancelled');renderAdminAppointments();renderAdminDashboard();if(typeof showToast==='function')showToast(`Appointment ${status}.`);}
function notifyClientChange(appt,type){if(typeof sendClientConfirmEmail!=='function')return;const prev=appt.notes;appt.notes=`[${type.toUpperCase()}] ${prev}`;sendClientConfirmEmail(appt);appt.notes=prev;}

function openReschedule(id){
  const a=appointments.find(x=>x.id===id);if(!a)return;
  const m=document.getElementById('appt-edit-modal'),c=document.getElementById('appt-edit-content');if(!m||!c)return;
  c.innerHTML=`<button class="modal-close" onclick="document.getElementById('appt-edit-modal').style.display='none'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  <div style="font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:1.25rem">Reschedule — ${a.name}</div>
  <div class="form-group"><label>New Date</label><input type="date" id="rs-date" value="${a.date}"></div>
  <div class="form-group"><label>New Time</label><select id="rs-time">${['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00'].map(t=>`<option value="${t}"${t===a.time?' selected':''}>${t}</option>`).join('')}</select></div>
  <div class="form-group"><label>Notes</label><textarea id="rs-notes" rows="2">${a.notes||''}</textarea></div>
  <button class="btn btn-primary btn-full" onclick="saveReschedule('${a.id}')">Save &amp; Notify Client</button>`;
  m.style.display='flex';
}
function saveReschedule(id){
  const a=appointments.find(x=>x.id===id);if(!a)return;
  const nd=document.getElementById('rs-date')?.value,nt=document.getElementById('rs-time')?.value,nn=document.getElementById('rs-notes')?.value;
  if(!nd||!nt)return;
  a.date=nd;a.time=nt;a.notes=nn||a.notes;
  if(a.meetLink)a.meetLink=typeof generateMeetLink==='function'?generateMeetLink(a.id+nd):a.meetLink;
  saveAppointments();notifyClientChange(a,'rescheduled');
  document.getElementById('appt-edit-modal').style.display='none';
  renderAdminAppointments();if(typeof showToast==='function')showToast('Rescheduled. Client notified.');
}

function prefillCert(id){
  const a=appointments.find(x=>x.id===id);if(!a)return;
  showAdminTab('certificates-mgr',null);
  document.querySelectorAll('.admin-nav-btn').forEach(b=>{b.classList.toggle('active',b.textContent.trim()==='Certificates');});
  setTimeout(()=>{
    ['cert-name','cert-module','cert-date','cert-org'].forEach((fid,i)=>{const e=document.getElementById(fid);if(e)e.value=[a.name,a.module,a.date,a.org||''][i];});
    if(typeof updateCertId==='function')updateCertId();
    if(typeof updateCertPreview==='function')updateCertPreview();
  },80);
}

function filterAppointments(){
  const q=(document.getElementById('appt-search')?.value||'').toLowerCase();
  const s=document.getElementById('appt-filter')?.value||'';
  renderAdminAppointments(appointments.filter(a=>(!q||a.name.toLowerCase().includes(q)||a.module.toLowerCase().includes(q)||(a.org||'').toLowerCase().includes(q)||a.id.toLowerCase().includes(q))&&(!s||a.status===s)));
}
function exportAppointments(){
  const h='ID,Name,Email,Module,Module2,Module3,Date,Time,Format,Organisation,Status,Discount,MeetLink,Notes';
  const r=appointments.map(a=>[a.id,`"${a.name}"`,a.email,`"${a.module||''}"`,`"${a.module2||''}"`,`"${a.module3||''}"`,a.date,a.time,`"${a.format||''}"`,`"${a.org||''}"`,a.status,a.discount||'',a.meetLink||'',`"${(a.notes||'').replace(/"/g,"'")}"`].join(','));
  const blob=new Blob([[h,...r].join('\n')],{type:'text/csv'});
  const url=URL.createObjectURL(blob);const l=document.createElement('a');l.href=url;l.download=`appointments_${new Date().toISOString().slice(0,10)}.csv`;l.click();URL.revokeObjectURL(url);
  if(typeof showToast==='function')showToast('Exported as CSV.');
}

// MODULES MANAGER
function renderModulesManager(){
  const list=document.getElementById('modules-manager-list');if(!list)return;
  const mods=typeof getModules==='function'?getModules():[];
  list.innerHTML=mods.map((m,i)=>`<div class="cms-item"><div class="cms-item-info"><strong>${m.title}</strong><span>${m.level} · ${m.tags.join(', ')}</span><span style="font-size:.76rem;color:var(--text-d)">${m.desc.slice(0,80)}…</span></div><div class="cms-item-actions"><button class="cms-toggle ${m.visible!==false?'visible':'hidden'}" onclick="toggleModuleVisible(${i})">${m.visible!==false?'Visible':'Hidden'}</button><button class="appt-btn" onclick="openModuleEditor(${i})">Edit</button><button class="appt-btn danger" onclick="deleteModule(${i})">Delete</button></div></div>`).join('');
}
function toggleModuleVisible(i){const m=getModules();if(m[i])m[i].visible=m[i].visible===false;try{localStorage.setItem('do_modules',JSON.stringify(m));}catch(e){}renderModulesManager();if(typeof renderModules==='function')renderModules();}
function deleteModule(i){if(!confirm('Delete this module?'))return;const m=getModules();m.splice(i,1);try{localStorage.setItem('do_modules',JSON.stringify(m));}catch(e){}renderModulesManager();if(typeof renderModules==='function')renderModules();}
function openModuleEditor(idx){
  const mods=typeof getModules==='function'?getModules():[];
  const m=idx!==null?mods[idx]:{id:'m'+Date.now(),icon:'shield',title:'',desc:'',level:'Foundation',tags:['2 hours','Online / Onsite','Certificate'],visible:true};
  const modal=document.getElementById('edit-modal'),c=document.getElementById('edit-modal-content');if(!modal||!c)return;
  c.innerHTML=`<button class="modal-close" onclick="document.getElementById('edit-modal').style.display='none'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  <div style="font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:1.25rem">${idx!==null?'Edit':'Add'} Module</div>
  <div class="form-group"><label>Title *</label><input type="text" id="me-title" value="${m.title}"></div>
  <div class="form-group"><label>Description *</label><textarea id="me-desc" rows="3">${m.desc}</textarea></div>
  <div class="form-group"><label>Level</label><select id="me-level">${['Foundation','Intermediate','Advanced','Specialist'].map(l=>`<option${m.level===l?' selected':''}>${l}</option>`).join('')}</select></div>
  <div class="form-group"><label>Tags (comma-separated)</label><input type="text" id="me-tags" value="${m.tags.join(', ')}"></div>
  <div class="form-group"><label>Icon key (shield / search / lock / cpu / globe …)</label><input type="text" id="me-icon" value="${m.icon}"></div>
  <button class="btn btn-primary btn-full" onclick="saveModuleEditor(${idx})">Save Module</button>`;
  modal.style.display='flex';
}
function saveModuleEditor(idx){
  const title=document.getElementById('me-title')?.value.trim(),desc=document.getElementById('me-desc')?.value.trim(),level=document.getElementById('me-level')?.value,tags=document.getElementById('me-tags')?.value.split(',').map(s=>s.trim()).filter(Boolean),icon=document.getElementById('me-icon')?.value.trim()||'shield';
  if(!title||!desc){if(typeof showToast==='function')showToast('Title and description required.');return;}
  const m=typeof getModules==='function'?getModules():[];
  if(idx!==null)m[idx]={...m[idx],title,desc,level,tags,icon};else m.push({id:'m'+Date.now(),title,desc,level,tags,icon,visible:true});
  try{localStorage.setItem('do_modules',JSON.stringify(m));}catch(e){}
  document.getElementById('edit-modal').style.display='none';
  renderModulesManager();if(typeof renderModules==='function')renderModules();if(typeof populateModuleDropdowns==='function')populateModuleDropdowns();
  if(typeof showToast==='function')showToast('Module saved.');
}

// SERVICES MANAGER
function renderServicesManager(){
  const list=document.getElementById('services-manager-list');if(!list)return;
  const svc=typeof getServices==='function'?getServices():{individual:[],corporate:[],seminar:[]};
  let html='';
  ['individual','corporate','seminar'].forEach(cat=>{
    html+=`<div style="margin-bottom:1.5rem"><div style="font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--do-5);margin-bottom:.75rem">${cat}</div>`;
    html+=svc[cat].map((s,i)=>`<div class="cms-item"><div class="cms-item-info"><strong>${s.title}</strong><span>${s.dur} · ${s.mode}</span></div><div class="cms-item-actions"><button class="cms-toggle ${s.visible!==false?'visible':'hidden'}" onclick="toggleServiceVisible('${cat}',${i})">${s.visible!==false?'Visible':'Hidden'}</button><button class="appt-btn" onclick="openServiceEditor('${cat}',${i})">Edit</button><button class="appt-btn danger" onclick="deleteService('${cat}',${i})">Delete</button></div></div>`).join('');
    html+=`<button class="btn btn-secondary" onclick="openServiceEditor('${cat}',null)" style="margin-top:.5rem;font-size:12px;padding:6px 14px">+ Add to ${cat}</button></div>`;
  });
  list.innerHTML=html;
}
function toggleServiceVisible(cat,i){const s=typeof getServices==='function'?getServices():{individual:[],corporate:[],seminar:[]};if(s[cat][i])s[cat][i].visible=s[cat][i].visible===false;try{localStorage.setItem('do_services',JSON.stringify(s));}catch(e){}renderServicesManager();if(typeof renderServices==='function')renderServices();}
function deleteService(cat,i){if(!confirm('Delete?'))return;const s=typeof getServices==='function'?getServices():{individual:[],corporate:[],seminar:[]};s[cat].splice(i,1);try{localStorage.setItem('do_services',JSON.stringify(s));}catch(e){}renderServicesManager();if(typeof renderServices==='function')renderServices();}
function openServiceEditor(cat,idx){
  const svc=typeof getServices==='function'?getServices():{individual:[],corporate:[],seminar:[]};
  const s=idx!==null&&cat?svc[cat][idx]:{title:'',desc:'',dur:'2 hours',mode:'Online / Onsite',mc:'mode-both',visible:true};
  const modal=document.getElementById('edit-modal'),c=document.getElementById('edit-modal-content');if(!modal||!c)return;
  c.innerHTML=`<button class="modal-close" onclick="document.getElementById('edit-modal').style.display='none'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  <div style="font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:1.25rem">${idx!==null?'Edit':'Add'} Service</div>
  <div class="form-group"><label>Category</label><select id="se-cat">${['individual','corporate','seminar'].map(c2=>`<option value="${c2}"${c2===cat?' selected':''}>${c2}</option>`).join('')}</select></div>
  <div class="form-group"><label>Title *</label><input type="text" id="se-title" value="${s.title}"></div>
  <div class="form-group"><label>Description</label><textarea id="se-desc" rows="2">${s.desc}</textarea></div>
  <div class="form-group"><label>Duration</label><input type="text" id="se-dur" value="${s.dur}"></div>
  <div class="form-group"><label>Mode</label><select id="se-mc"><option value="mode-online"${s.mc==='mode-online'?' selected':''}>Online</option><option value="mode-onsite"${s.mc==='mode-onsite'?' selected':''}>Onsite</option><option value="mode-both"${s.mc==='mode-both'?' selected':''}>Online / Onsite</option></select></div>
  <button class="btn btn-primary btn-full" onclick="saveServiceEditor('${cat}',${idx})">Save</button>`;
  modal.style.display='flex';
}
function saveServiceEditor(origCat,idx){
  const cat=document.getElementById('se-cat')?.value,title=document.getElementById('se-title')?.value.trim(),desc=document.getElementById('se-desc')?.value.trim(),dur=document.getElementById('se-dur')?.value.trim(),mc=document.getElementById('se-mc')?.value;
  const modeMap={'mode-online':'Online','mode-onsite':'Onsite','mode-both':'Online / Onsite'};
  if(!title){if(typeof showToast==='function')showToast('Title required.');return;}
  const s=typeof getServices==='function'?getServices():{individual:[],corporate:[],seminar:[]};
  const entry={title,desc,dur,mode:modeMap[mc]||'Online / Onsite',mc,visible:true};
  if(idx!==null&&origCat){if(cat===origCat)s[cat][idx]={...s[cat][idx],...entry};else{s[origCat].splice(idx,1);s[cat].push(entry);}}else s[cat||'individual'].push(entry);
  try{localStorage.setItem('do_services',JSON.stringify(s));}catch(e){}
  document.getElementById('edit-modal').style.display='none';
  renderServicesManager();if(typeof renderServices==='function')renderServices();if(typeof showToast==='function')showToast('Service saved.');
}

// RESOURCES MANAGER
function renderResourcesManager(){
  const list=document.getElementById('resources-manager-list');if(!list)return;
  const res=typeof getResources==='function'?getResources():[];
  list.innerHTML=res.map((r,i)=>`<div class="cms-item"><div class="cms-item-info"><strong>${r.title}</strong><span>${r.typeLabel} · ${r.type==='link'?'Link':'File'}</span><span style="font-size:.75rem;color:var(--text-m);word-break:break-all">${r.url}</span><span style="font-size:.75rem">Email gate: <strong style="color:${r.requiresEmail?'#ffd700':'#4ade80'}">${r.requiresEmail?'Yes':'No'}</strong></span></div><div class="cms-item-actions" style="flex-direction:column;gap:5px;align-items:flex-end"><button class="cms-toggle ${r.visible!==false?'visible':'hidden'}" onclick="toggleResourceVisible(${i})">${r.visible!==false?'Visible':'Hidden'}</button><button class="appt-btn" onclick="openResourceEditor(${i})">Edit</button><button class="appt-btn danger" onclick="deleteResource(${i})">Delete</button></div></div>`).join('')
    +`<button class="btn btn-primary" onclick="openResourceEditor(null)" style="margin-top:1rem">+ Add Resource</button>`;
}
function toggleResourceVisible(i){const r=typeof getResources==='function'?getResources():[];if(r[i])r[i].visible=r[i].visible===false;try{localStorage.setItem('do_resources',JSON.stringify(r));}catch(e){}renderResourcesManager();if(typeof renderResources==='function')renderResources();}
function deleteResource(i){if(!confirm('Delete?'))return;const r=typeof getResources==='function'?getResources():[];r.splice(i,1);try{localStorage.setItem('do_resources',JSON.stringify(r));}catch(e){}renderResourcesManager();if(typeof renderResources==='function')renderResources();}
function openResourceEditor(idx){
  const res=typeof getResources==='function'?getResources():[];
  const r=idx!==null?res[idx]:{id:'r'+Date.now(),type:'file',title:'',typeLabel:'',desc:'',url:'',download:true,thumb:'healthcare',requiresEmail:false,visible:true};
  const modal=document.getElementById('edit-modal'),c=document.getElementById('edit-modal-content');if(!modal||!c)return;
  c.innerHTML=`<button class="modal-close" onclick="document.getElementById('edit-modal').style.display='none'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  <div style="font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:1.25rem">${idx!==null?'Edit':'Add'} Resource</div>
  <div class="form-group"><label>Type</label><select id="re-type"><option value="file"${r.type==='file'?' selected':''}>File (PDF, PPTX, ZIP, image)</option><option value="link"${r.type==='link'?' selected':''}>External Link (YouTube, GitHub, LinkedIn, OneDrive…)</option></select></div>
  <div class="form-group"><label>Title *</label><input type="text" id="re-title" value="${r.title}"></div>
  <div class="form-group"><label>Type Label</label><input type="text" id="re-typeLabel" value="${r.typeLabel}" placeholder="e.g. PDF Guide · Bilingual EN/GR"></div>
  <div class="form-group"><label>Description</label><textarea id="re-desc" rows="3">${r.desc}</textarea></div>
  <div class="form-group"><label>URL / Path *</label><input type="text" id="re-url" value="${r.url}" placeholder="https://... or assets/filename.pdf"><div style="margin-top:6px"><label style="font-size:11px;text-transform:none;letter-spacing:0;color:var(--text-m)">Or browse local file:</label><input type="file" id="re-file" accept=".pdf,.pptx,.zip,.png,.jpg,.webp,.mp4,.docx" style="margin-top:4px;font-size:12px" onchange="handleResourceFile(this)"></div></div>
  <div class="form-group"><label>Thumbnail key</label><input type="text" id="re-thumb" value="${r.thumb||'healthcare'}" placeholder="healthcare / worldmonitor / defense / ai_attacks"></div>
  <div class="form-group"><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" id="re-email"${r.requiresEmail?' checked':''} style="width:auto"> Require email to access</label></div>
  <div class="form-group"><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" id="re-download"${r.download?' checked':''} style="width:auto"> Trigger download</label></div>
  <button class="btn btn-primary btn-full" onclick="saveResourceEditor(${idx})">Save Resource</button>`;
  modal.style.display='flex';
}
function handleResourceFile(input){if(input.files&&input.files[0]){const fn=input.files[0].name;const u=document.getElementById('re-url');if(u)u.value='assets/'+fn;if(typeof showToast==='function')showToast(`Selected: ${fn}. Place it in /assets/ folder.`);}}
function saveResourceEditor(idx){
  const type=document.getElementById('re-type')?.value,title=document.getElementById('re-title')?.value.trim(),typeLabel=document.getElementById('re-typeLabel')?.value.trim(),desc=document.getElementById('re-desc')?.value.trim(),url=document.getElementById('re-url')?.value.trim(),thumb=document.getElementById('re-thumb')?.value.trim()||'healthcare',reqEmail=document.getElementById('re-email')?.checked||false,download=document.getElementById('re-download')?.checked||false;
  if(!title||!url){if(typeof showToast==='function')showToast('Title and URL required.');return;}
  const res=typeof getResources==='function'?getResources():[];
  const entry={id:idx!==null?res[idx].id:'r'+Date.now(),type,title,typeLabel,desc,url,download,thumb,requiresEmail:reqEmail,visible:true};
  if(idx!==null)res[idx]=entry;else res.push(entry);
  try{localStorage.setItem('do_resources',JSON.stringify(res));}catch(e){}
  document.getElementById('edit-modal').style.display='none';
  renderResourcesManager();if(typeof renderResources==='function')renderResources();if(typeof showToast==='function')showToast('Resource saved.');
}

// TEAM MANAGER
function renderTeamManager(){
  const list=document.getElementById('team-manager-list');if(!list)return;
  const team=typeof getTeam==='function'?getTeam():[];
  list.innerHTML=(team.length?team.map((m,i)=>`<div class="cms-item"><div class="cms-item-info"><strong>${m.name}</strong><span>${m.specialization||''} ${m.education?'· '+m.education:''}</span>${m.company?`<span>${m.company}</span>`:''}</div><div class="cms-item-actions"><button class="appt-btn" onclick="openTeamEditor(${i})">Edit</button><button class="appt-btn danger" onclick="deleteTeamMember(${i})">Remove</button></div></div>`).join(''):'<p style="color:var(--text-m);margin-bottom:1rem">No team members yet.</p>')
    +`<button class="btn btn-primary" onclick="openTeamEditor(null)" style="margin-top:1rem">+ Add Member</button>`;
}
function deleteTeamMember(i){if(!confirm('Remove?'))return;const t=typeof getTeam==='function'?getTeam():[];t.splice(i,1);try{localStorage.setItem('do_team',JSON.stringify(t));}catch(e){}renderTeamManager();if(typeof renderTeam==='function')renderTeam();}
function openTeamEditor(idx){
  const team=typeof getTeam==='function'?getTeam():[];
  const m=idx!==null?team[idx]:{name:'',specialization:'',education:'',linkedin:'',email:'',phone:'',photo:'',company:'',companyUrl:'',companyDesc:''};
  const modal=document.getElementById('edit-modal'),c=document.getElementById('edit-modal-content');if(!modal||!c)return;
  c.innerHTML=`<button class="modal-close" onclick="document.getElementById('edit-modal').style.display='none'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  <div style="font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:1.25rem">${idx!==null?'Edit':'Add'} Team Member / Partner</div>
  <div class="form-group"><label>Full Name *</label><input type="text" id="tm-name" value="${m.name}"></div>
  <div class="form-group"><label>Specialization / Role *</label><input type="text" id="tm-spec" value="${m.specialization||''}" placeholder="e.g. Cybersecurity Analyst"></div>
  <div class="form-group"><label>Education Title</label><input type="text" id="tm-edu" value="${m.education||''}" placeholder="e.g. MSc Information Security"></div>
  <div class="form-group"><label>Photo URL</label><input type="text" id="tm-photo" value="${m.photo||''}" placeholder="https://... or leave blank"><br><input type="file" id="tm-photo-file" accept="image/*" style="margin-top:4px;font-size:12px" onchange="handleTeamPhoto(this)"></div>
  <div class="form-group"><label>LinkedIn URL</label><input type="text" id="tm-linkedin" value="${m.linkedin||''}"></div>
  <div class="form-group"><label>Email</label><input type="email" id="tm-email" value="${m.email||''}"></div>
  <div class="form-group"><label>Phone (optional)</label><input type="text" id="tm-phone" value="${m.phone||''}"></div>
  <div style="border-top:1px solid var(--border);padding-top:1rem;margin-top:0.5rem">
    <div style="font-size:.82rem;font-weight:600;color:var(--do-5);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.05em">Company (optional — leave blank if none)</div>
    <div class="form-group"><label>Company Name</label><input type="text" id="tm-company" value="${m.company||''}" placeholder="Leave empty if no company" onchange="toggleCompanyFields(this)"></div>
    <div id="tm-company-extra" style="display:${m.company?'block':'none'}">
      <div class="form-group"><label>Company Website</label><input type="text" id="tm-companyUrl" value="${m.companyUrl||''}"></div>
      <div class="form-group"><label>Company Description</label><textarea id="tm-companyDesc" rows="2">${m.companyDesc||''}</textarea></div>
    </div>
  </div>
  <button class="btn btn-primary btn-full" onclick="saveTeamEditor(${idx})" style="margin-top:1rem">Save Member</button>`;
  modal.style.display='flex';
}
function toggleCompanyFields(input){const ex=document.getElementById('tm-company-extra');if(ex)ex.style.display=input.value.trim()?'block':'none';}
function handleTeamPhoto(input){
  if(!input.files||!input.files[0])return;
  const reader=new FileReader();
  reader.onload=e=>{const ph=document.getElementById('tm-photo');if(ph)ph.value=e.target.result;};
  reader.readAsDataURL(input.files[0]);
}
function saveTeamEditor(idx){
  const name=document.getElementById('tm-name')?.value.trim(),spec=document.getElementById('tm-spec')?.value.trim();
  if(!name){if(typeof showToast==='function')showToast('Name required.');return;}
  const company=document.getElementById('tm-company')?.value.trim();
  const entry={name,specialization:spec,education:document.getElementById('tm-edu')?.value.trim()||'',linkedin:document.getElementById('tm-linkedin')?.value.trim()||'',email:document.getElementById('tm-email')?.value.trim()||'',phone:document.getElementById('tm-phone')?.value.trim()||'',photo:document.getElementById('tm-photo')?.value.trim()||'',company:company||'',companyUrl:company?document.getElementById('tm-companyUrl')?.value.trim()||'':'',companyDesc:company?document.getElementById('tm-companyDesc')?.value.trim()||'':''};
  const team=typeof getTeam==='function'?getTeam():[];
  if(idx!==null)team[idx]=entry;else team.push(entry);
  try{localStorage.setItem('do_team',JSON.stringify(team));}catch(e){}
  // Notify new member by email if emailjs configured
  if(idx===null&&entry.email&&typeof sendAdminNotificationEmail!=='undefined'){
    const fakeAppt={id:'TEAM',name:entry.name,email:entry.email,module:'Team/Partner Invitation',module2:'',module3:'',date:new Date().toISOString().slice(0,10),time:'',format:'Digital',org:entry.company||'',notes:`You have been added to the DO Training team. LinkedIn: ${entry.linkedin||'N/A'}`,meetLink:'',discount:''};
    if(typeof sendClientConfirmEmail==='function')sendClientConfirmEmail(fakeAppt);
  }
  document.getElementById('edit-modal').style.display='none';
  renderTeamManager();if(typeof renderTeam==='function')renderTeam();if(typeof showToast==='function')showToast('Member saved.');
}

// ADS MANAGER
function renderAdsManager(){
  const list=document.getElementById('ads-manager-list');if(!list)return;
  const ads=typeof getAds==='function'?getAds():[];
  list.innerHTML=(ads.length?ads.map((a,i)=>`<div class="cms-item"><div class="cms-item-info"><strong>${a.name||'Ad #'+(i+1)}</strong><span>Column: ${a.col} · <a href="${a.url}" target="_blank" style="color:var(--do-5)">${a.url.slice(0,40)}…</a></span></div><div class="cms-item-actions"><button class="cms-toggle ${a.visible!==false?'visible':'hidden'}" onclick="toggleAdVisible(${i})">${a.visible!==false?'Visible':'Hidden'}</button><button class="appt-btn" onclick="openAdEditor(${i})">Edit</button><button class="appt-btn danger" onclick="deleteAd(${i})">Delete</button></div></div>`).join(''):'<p style="color:var(--text-m);margin-bottom:1rem">No ads configured yet.</p>')
    +`<button class="btn btn-primary" onclick="openAdEditor(null)" style="margin-top:1rem">+ Add Ad</button>`;
}
function toggleAdVisible(i){const ads=typeof getAds==='function'?getAds():[];if(ads[i])ads[i].visible=ads[i].visible===false;try{localStorage.setItem('do_ads',JSON.stringify(ads));}catch(e){}renderAdsManager();if(typeof renderAds==='function')renderAds();}
function deleteAd(i){if(!confirm('Delete?'))return;const ads=typeof getAds==='function'?getAds():[];ads.splice(i,1);try{localStorage.setItem('do_ads',JSON.stringify(ads));}catch(e){}renderAdsManager();if(typeof renderAds==='function')renderAds();}
function openAdEditor(idx){
  const ads=typeof getAds==='function'?getAds():[];
  const a=idx!==null?ads[idx]:{name:'',img:'',url:'',col:'left',visible:true};
  const modal=document.getElementById('edit-modal'),c=document.getElementById('edit-modal-content');if(!modal||!c)return;
  c.innerHTML=`<button class="modal-close" onclick="document.getElementById('edit-modal').style.display='none'"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
  <div style="font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:1.25rem">${idx!==null?'Edit':'Add'} Advertisement</div>
  <div class="form-group"><label>Advertiser Name</label><input type="text" id="ad-name" value="${a.name||''}"></div>
  <div class="form-group"><label>Image URL *</label><input type="text" id="ad-img" value="${a.img||''}" placeholder="https://... image URL"><br><label style="font-size:11px;text-transform:none;letter-spacing:0;color:var(--text-m);margin-top:6px;display:block">Or upload image:</label><input type="file" id="ad-img-file" accept="image/*" style="font-size:12px;margin-top:4px" onchange="handleAdImage(this)"></div>
  <div class="form-group"><label>Link URL (when clicked) *</label><input type="text" id="ad-url" value="${a.url||''}" placeholder="https://..."></div>
  <div class="form-group"><label>Column</label><select id="ad-col"><option value="left"${a.col==='left'?' selected':''}>Left sidebar</option><option value="right"${a.col==='right'?' selected':''}>Right sidebar</option></select></div>
  <button class="btn btn-primary btn-full" onclick="saveAdEditor(${idx})" style="margin-top:1rem">Save Ad</button>`;
  modal.style.display='flex';
}
function handleAdImage(input){
  if(!input.files||!input.files[0])return;
  const reader=new FileReader();
  reader.onload=e=>{const img=document.getElementById('ad-img');if(img)img.value=e.target.result;};
  reader.readAsDataURL(input.files[0]);
}
function saveAdEditor(idx){
  const name=document.getElementById('ad-name')?.value.trim(),img=document.getElementById('ad-img')?.value.trim(),url=document.getElementById('ad-url')?.value.trim(),col=document.getElementById('ad-col')?.value;
  if(!img||!url){if(typeof showToast==='function')showToast('Image and URL required.');return;}
  const ads=typeof getAds==='function'?getAds():[];
  const entry={name,img,url,col,visible:true};
  if(idx!==null)ads[idx]=entry;else ads.push(entry);
  try{localStorage.setItem('do_ads',JSON.stringify(ads));}catch(e){}
  document.getElementById('edit-modal').style.display='none';
  renderAdsManager();if(typeof renderAds==='function')renderAds();if(typeof showToast==='function')showToast('Ad saved.');
}

window.addEventListener('DOMContentLoaded',()=>{
  if(localStorage.getItem('do_admin_remember')==='1'){/* ready for Ctrl+Shift+D+O shortcut */}
});
