'use strict';
let issuedCerts=[];try{issuedCerts=JSON.parse(localStorage.getItem('do_certs')||'[]');}catch(e){issuedCerts=[];}

function updateCertId(){const el=document.getElementById('cert-id');if(!el)return;el.value='CERT-DP-'+Date.now().toString(36).toUpperCase().slice(-8);}

function updateCertPreview(){
  const name=document.getElementById('cert-name')?.value||'';
  const module=document.getElementById('cert-module')?.value||'';
  const date=document.getElementById('cert-date')?.value||'';
  const duration=document.getElementById('cert-duration')?.value||'';
  const org=document.getElementById('cert-org')?.value||'';
  const certId=document.getElementById('cert-id')?.value||'';
  const preview=document.getElementById('cert-preview');if(!preview)return;
  if(!name&&!module){preview.innerHTML='<div class="cert-preview-placeholder">Fill in the details to preview</div>';return;}
  const displayDate=date?new Date(date+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'___________';
  const logoSrc=(typeof IMGS!=='undefined'&&IMGS['img_do_logo'])?IMGS['img_do_logo']:'';
  preview.innerHTML=`<div style="width:100%;height:100%;background:linear-gradient(135deg,#0a1628 0%,#0d2040 50%,#0a1628 100%);padding:1.1rem;position:relative;font-family:'Space Grotesk',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border:2.5px solid #1e56c8;box-sizing:border-box;overflow:hidden;">
    <!-- DATA OMERTA watermark - full text centered -->
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;overflow:hidden;">
      <div style="font-family:'Space Grotesk',sans-serif;font-size:1.6rem;font-weight:800;color:rgba(77,166,255,0.06);letter-spacing:.3em;white-space:nowrap;transform:rotate(-15deg);line-height:1.6">DATA OMERTA</div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:1.6rem;font-weight:800;color:rgba(77,166,255,0.04);letter-spacing:.3em;white-space:nowrap;transform:rotate(-15deg);line-height:1.6">DATA OMERTA</div>
    </div>
    <div style="position:absolute;inset:5px;border:1px solid rgba(30,86,200,.5);pointer-events:none;"></div>
    <div style="position:absolute;top:5px;left:5px;width:10px;height:10px;border-top:2px solid #1e56c8;border-left:2px solid #1e56c8;"></div>
    <div style="position:absolute;top:5px;right:5px;width:10px;height:10px;border-top:2px solid #1e56c8;border-right:2px solid #1e56c8;"></div>
    <div style="position:absolute;bottom:5px;left:5px;width:10px;height:10px;border-bottom:2px solid #1e56c8;border-left:2px solid #1e56c8;"></div>
    <div style="position:absolute;bottom:5px;right:5px;width:10px;height:10px;border-bottom:2px solid #1e56c8;border-right:2px solid #1e56c8;"></div>
    ${logoSrc?`<img src="${logoSrc}" style="width:32px;height:32px;object-fit:contain;margin-bottom:4px;filter:drop-shadow(0 0 6px #4da6ff)">`:'<div style="font-weight:800;font-size:13px;color:#1e56c8;margin-bottom:4px">D.O.</div>'}
    <div style="font-size:7.5px;font-weight:700;color:#4da6ff;letter-spacing:.15em;text-transform:uppercase;margin-bottom:4px">Certificate of Participation</div>
    <div style="width:28px;height:1.5px;background:linear-gradient(90deg,#1e56c8,#4da6ff);margin:0 auto 5px;"></div>
    <div style="font-size:7px;color:#7a8fa8;margin-bottom:3px">This certifies that</div>
    <div style="font-size:14px;font-weight:700;color:#ffffff;margin-bottom:2px">${name||'___________'}</div>
    ${org?`<div style="font-size:7px;color:#7a8fa8;margin-bottom:4px">${org}</div>`:'<div style="margin-bottom:4px"></div>'}
    <div style="font-size:7px;color:#7a8fa8;margin-bottom:3px">has successfully completed</div>
    <div style="font-size:9.5px;font-weight:600;color:#4da6ff;margin-bottom:3px;padding:0 .5rem;line-height:1.3">${module||'___________'}</div>
    ${duration?`<div style="font-size:6.5px;color:#7a8fa8;margin-bottom:3px">Duration: ${duration}</div>`:''}
    <div style="font-size:6.5px;color:#a8b8cc;margin-bottom:5px">on ${displayDate} &nbsp;&middot;&nbsp; Thessaloniki, Greece</div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;width:100%;border-top:1px solid rgba(30,86,200,.4);padding-top:5px;margin-top:2px;gap:8px">
      <div style="text-align:center;flex:1">
        <div style="width:44px;height:.5px;background:#e8edf5;margin:0 auto 2px;"></div>
        <div style="font-size:5.5px;font-weight:700;color:#e8edf5">Dimitrios Paraschidis</div>
        <div style="font-size:5px;color:#7a8fa8">MSc Digital Forensics</div>
      </div>
      <div style="text-align:right;font-size:5px;color:#3d5068;flex:1">
        <div style="font-weight:600;color:#7a8fa8">${certId}</div>
        <div>Verified Certificate</div>
        <div>${new Date().toLocaleDateString('en-GB')}</div>
      </div>
    </div>
  </div>`;
}

function generateCertificate(){
  const name=document.getElementById('cert-name')?.value.trim();
  const module=document.getElementById('cert-module')?.value.trim();
  const date=document.getElementById('cert-date')?.value;
  const duration=document.getElementById('cert-duration')?.value.trim();
  const org=document.getElementById('cert-org')?.value.trim();
  const certId=document.getElementById('cert-id')?.value;
  if(!name){if(typeof showToast==='function')showToast('Please enter participant name.');return;}
  if(!module){if(typeof showToast==='function')showToast('Please enter module title.');return;}
  if(!date){if(typeof showToast==='function')showToast('Please select completion date.');return;}
  const displayDate=new Date(date+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  const logoSrc=(typeof IMGS!=='undefined'&&IMGS['img_do_logo'])?IMGS['img_do_logo']:'';
  const html=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Certificate — ${name}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
@page{size:A4 landscape;margin:0;}
body{width:297mm;height:210mm;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0a1628 0%,#0d2040 50%,#0a1628 100%);font-family:'Inter',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.cert{width:272mm;height:188mm;background:linear-gradient(135deg,#0a1628 0%,#0d2040 60%,#0a1628 100%);position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:14mm 20mm;border:3px solid #1e56c8;overflow:hidden;}
.outer{position:absolute;inset:4mm;border:1px solid rgba(77,166,255,.4);pointer-events:none;}
.corner{position:absolute;width:14mm;height:14mm;}
.tl{top:2.5mm;left:2.5mm;border-top:3px solid #4da6ff;border-left:3px solid #4da6ff;}
.tr{top:2.5mm;right:2.5mm;border-top:3px solid #4da6ff;border-right:3px solid #4da6ff;}
.bl{bottom:2.5mm;left:2.5mm;border-bottom:3px solid #4da6ff;border-left:3px solid #4da6ff;}
.br{bottom:2.5mm;right:2.5mm;border-bottom:3px solid #4da6ff;border-right:3px solid #4da6ff;}
/* DATA OMERTA watermark — DA.......TA spread across the certificate */
.wm-text{position:absolute;left:50%;top:52%;transform:translate(-50%,-50%) rotate(-15deg);font-family:'Space Grotesk';font-size:52pt;font-weight:800;color:rgba(77,166,255,0.055);letter-spacing:.4em;white-space:nowrap;pointer-events:none;user-select:none;}
.wm-text2{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%) rotate(-15deg);font-family:'Space Grotesk';font-size:32pt;font-weight:800;color:rgba(30,86,200,0.035);letter-spacing:.4em;white-space:nowrap;pointer-events:none;}
.logo{width:58px;height:58px;object-fit:contain;margin-bottom:3mm;filter:drop-shadow(0 0 12px #4da6ff);}
.logo-text{font-family:'Space Grotesk';font-weight:800;font-size:18pt;color:#1e56c8;margin-bottom:3mm;}
.badge{font-family:'Space Grotesk';font-size:8.5pt;font-weight:700;color:#4da6ff;letter-spacing:.2em;text-transform:uppercase;margin-bottom:2.5mm;}
.divider{width:20mm;height:2px;background:linear-gradient(90deg,#1e56c8,#4da6ff,#1e56c8);margin:0 auto 4.5mm;}
.sub{font-size:8.5pt;color:#7a8fa8;margin-bottom:2.5mm;}
.name{font-family:'Space Grotesk';font-size:26pt;font-weight:800;color:#ffffff;margin-bottom:2mm;letter-spacing:-.3px;text-shadow:0 0 20px rgba(77,166,255,.3);}
.org{font-size:9pt;color:#7a8fa8;margin-bottom:4mm;}
.completed{font-size:8.5pt;color:#7a8fa8;margin-bottom:2mm;}
.module{font-family:'Space Grotesk';font-size:13pt;font-weight:600;color:#4da6ff;margin-bottom:2mm;max-width:160mm;line-height:1.35;text-shadow:0 0 10px rgba(77,166,255,.2);}
.dur{font-size:8.5pt;color:#7a8fa8;margin-bottom:1.5mm;}
.dateline{font-size:8.5pt;color:#a8b8cc;margin-bottom:5mm;}
.footer{display:flex;justify-content:space-between;align-items:flex-end;width:100%;border-top:1px solid rgba(30,86,200,.4);padding-top:4mm;margin-top:auto;}
.sig{text-align:center;}
.sig-line{width:52mm;height:.5mm;background:#e8edf5;margin:0 auto 2mm;}
.sig-name{font-family:'Space Grotesk';font-size:9.5pt;font-weight:700;color:#e8edf5;}
.sig-title{font-size:7pt;color:#7a8fa8;margin-top:1mm;}
.issuer{text-align:center;}
.issuer-name{font-family:'Space Grotesk';font-weight:700;font-size:9pt;color:#e8edf5;}
.issuer-sub{font-size:7pt;color:#7a8fa8;margin-top:1mm;}
.cert-id-blk{text-align:right;font-size:6.5pt;color:#3d5068;}
.cert-id-blk .id-label{font-weight:700;color:#7a8fa8;font-size:7pt;}
@media print{body{background:linear-gradient(135deg,#0a1628 0%,#0d2040 50%,#0a1628 100%);}}
</style>
</head>
<body>
<div class="cert">
  <div class="outer"></div>
  <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
  <!-- DATA OMERTA watermark -->
  <div class="wm-text">DATA OMERTA</div>
  <div class="wm-text2">DATA OMERTA</div>
  ${logoSrc?`<img src="${logoSrc}" class="logo" alt="D.O.">`:'<div class="logo-text">D.O.</div>'}
  <div class="badge">Certificate of Participation</div>
  <div class="divider"></div>
  <div class="sub">This is to certify that</div>
  <div class="name">${name}</div>
  ${org?`<div class="org">${org}</div>`:''}
  <div class="completed">has successfully completed the training programme</div>
  <div class="module">${module}</div>
  ${duration?`<div class="dur">Duration: ${duration}</div>`:''}
  <div class="dateline">Completed on <strong style="color:#c8d6e5">${displayDate}</strong> &nbsp;&middot;&nbsp; Thessaloniki, Greece</div>
  <div class="footer">
    <div class="sig">
      <div class="sig-line"></div>
      <div class="sig-name">Dimitrios Paraschidis</div>
      <div class="sig-title">MSc Applied Informatics &middot; Digital Forensics Specialist</div>
      <div class="sig-title">Cybersecurity Educator &amp; IT Trainer</div>
    </div>
    <div class="issuer">
      ${logoSrc?`<img src="${logoSrc}" style="width:32px;height:32px;object-fit:contain;margin-bottom:3px;filter:drop-shadow(0 0 8px #4da6ff)">`:''}
      <div class="issuer-name">D. Paraschidis Training Services</div>
      <div class="issuer-sub">Thessaloniki, Greece &nbsp;&middot;&nbsp; gds_gr@hotmail.gr</div>
      <div class="issuer-sub">+30 6947 424 107</div>
    </div>
    <div class="cert-id-blk">
      <div class="id-label">Certificate ID</div>
      <div>${certId}</div>
      <div style="margin-top:2mm">Issued: ${new Date().toLocaleDateString('en-GB')}</div>
      <div style="margin-top:1mm;font-size:6pt;color:#1a2a42">dataomerta.github.io/do-training</div>
    </div>
  </div>
</div>
<script>window.onload=()=>{setTimeout(()=>window.print(),400);};<\/script>
</body>
</html>`;
  const blob=new Blob([html],{type:'text/html'});
  const url=URL.createObjectURL(blob);
  window.open(url,'_blank');
  const cert={id:certId,name,module,date,org:org||'',issuedAt:new Date().toISOString()};
  issuedCerts.unshift(cert);
  try{localStorage.setItem('do_certs',JSON.stringify(issuedCerts));}catch(e){}
  renderIssuedCerts();updateCertId();
  if(typeof showToast==='function')showToast('Certificate generated — print dialog opening.');
}

function renderIssuedCerts(){
  const section=document.getElementById('issued-certs-section'),list=document.getElementById('issued-certs-list');
  if(!section||!list)return;
  if(!issuedCerts.length){section.style.display='none';return;}
  section.style.display='block';
  list.innerHTML=issuedCerts.slice(0,20).map(c=>`<div class="issued-cert-row"><div class="cert-info"><strong>${c.name} — ${c.module}</strong><span>${c.id} &middot; ${new Date(c.issuedAt).toLocaleDateString('en-GB')}${c.org?' &middot; '+c.org:''}</span></div></div>`).join('');
}
