# DO Training — Complete Deployment Guide
## From GitHub to Live PWA and Google Play (AAB/APK)

---

## PART 1 — NAMING CONVENTION (chained, no conflicts)

| Layer | Name | Why |
|---|---|---|
| GitHub Organisation | `DataOmerta` | Already exists at github.com/DataOmerta |
| GitHub Repository | `do-training` | github.com/DataOmerta/do-training |
| GitHub Pages URL | `dataomerta.github.io/do-training` | Auto-generated, free hosting |
| PWA App Name | `DO Professional Trainings in Cybersecurity` | Full name in manifest |
| PWA Short Name | `DO Training` | Shown under launcher icon |
| Android App ID | `com.dataomerta.dotraining` | Google Play unique identifier |
| Android App Name | `DO Training` | Shown on phone home screen |
| Google Play Store | `DO Training — Cybersecurity` | Store listing name |
| Google Console Project | `dimipara` (Account ID: 5357844958666965334) | Your existing account |

---

## PART 2 — GITHUB SETUP (10 minutes)

### Step 1 — Create the repository
1. Go to https://github.com/DataOmerta
2. Click **New repository**
3. Name: `do-training` (exactly, lowercase, hyphen)
4. Set to **Public** (required for free GitHub Pages)
5. Do NOT initialise with README — you will push your files
6. Click **Create repository**

### Step 2 — Upload all project files
Option A — GitHub web interface (easiest):
1. On the new empty repo page, click **uploading an existing file**
2. Drag and drop the entire `do-training/` folder contents
3. Commit message: `Initial release — DO Training Platform v1.0`
4. Click **Commit changes**

Option B — Git command line:
```bash
cd /path/to/do-training
git init
git remote add origin https://github.com/DataOmerta/do-training.git
git add .
git commit -m "Initial release — DO Training Platform v1.0"
git branch -M main
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages** (left sidebar)
2. Under **Source**: select **GitHub Actions**
3. The workflow file (`.github/workflows/deploy.yml`) will auto-run
4. Wait ~60 seconds, then visit: **https://dataomerta.github.io/do-training**
5. Your live site is online

### Step 4 — Verify the PWA
1. Open Chrome on your phone
2. Go to `https://dataomerta.github.io/do-training`
3. Tap the browser menu (three dots) → **Add to Home Screen**
4. Name it `DO Training` → Add
5. The app now appears on your Android home screen as a standalone app

---

## PART 3 — EMAILJS SETUP (5 minutes, free)

### Step 1 — Create account
1. Go to https://www.emailjs.com
2. Sign up with `gds_gr@hotmail.gr`
3. Free plan: 200 emails/month (upgrade if needed)

### Step 2 — Add your email service
1. Dashboard → **Email Services** → **Add New Service**
2. Choose **Outlook / Hotmail**
3. Connect your `gds_gr@hotmail.gr` account
4. Note your **Service ID** (e.g. `service_abc123`)

### Step 3 — Create Template 1: Admin notification (new booking)
1. **Email Templates** → **Create New Template**
2. Name it: `Admin — New Booking`
3. Subject: `New Booking: {{booking_id}} — {{client_name}}`
4. Body:
```
New booking received on DO Training Platform.

Booking ID: {{booking_id}}
Client: {{client_name}} ({{client_org}})
Email: {{client_email}}
Modules: {{modules}}
Date: {{date}} at {{time}}
Format: {{format}}
Google Meet: {{meet_link}}
Discount: {{discount}}
Notes: {{notes}}
```
5. **To email**: `gds_gr@hotmail.gr`
6. Save → note the **Template ID** (e.g. `template_xyz789`)

### Step 4 — Create Template 2: Client confirmation
1. Create another template: `Client — Booking Confirmation`
2. Subject: `Your Training Session Confirmed — {{modules}}`
3. **To email**: `{{to_email}}`
4. Body:
```
Dear {{client_name}},

Your training session has been confirmed.

Modules: {{modules}}
Date: {{date}} at {{time}}
Format: {{format}}
Google Meet Link: {{meet_link}}
Pricing note: {{discount}}

Trainer: {{trainer_name}}
Contact: {{trainer_email}} | {{trainer_phone}}

Looking forward to training with you.

Dimitrios Paraschidis
MSc Digital Forensics | Cybersecurity Educator
```
5. Save → note the **Template ID**

### Step 5 — Get your Public Key
1. Dashboard → **Account** → **General**
2. Copy your **Public Key** (e.g. `user_AbCdEfGhIjKl`)

### Step 6 — Paste into the site
Open `js/app.js`, find `EMAILJS_CONFIG` near the top and replace:
```javascript
const EMAILJS_CONFIG = {
  publicKey:   'user_AbCdEfGhIjKl',       // your Public Key
  serviceId:   'service_abc123',           // your Service ID
  adminTemplateId:  'template_xyz789',     // Admin notification template
  clientConfirmTemplateId: 'template_abc', // Client confirmation template
};
```
Push the updated file to GitHub. Done.

---

## PART 4 — ANDROID APP (AAB for Google Play + APK for testing)

### Method: Bubblewrap (Google's official tool — simplest path)

### Prerequisites (one-time setup on your PC):
1. Install **Node.js LTS** from https://nodejs.org
2. Install **Java JDK 11+** from https://adoptium.net
3. Install Android Studio from https://developer.android.com/studio
   - During install, also install **Android SDK** and **Build Tools**

### Step 1 — Install Bubblewrap
Open a terminal (Command Prompt or PowerShell on Windows):
```bash
npm install -g @bubblewrap/cli
```

### Step 2 — Initialise your app
```bash
mkdir do-training-android
cd do-training-android
bubblewrap init --manifest https://dataomerta.github.io/do-training/manifest.json
```
When prompted:
- **Package ID**: `com.dataomerta.dotraining`
- **App name**: `DO Training`
- **Short name**: `DO Training`
- **Start URL**: `https://dataomerta.github.io/do-training/`
- **Icon URL**: `https://dataomerta.github.io/do-training/assets/icons/icon-512x512.png`
- **Signing key**: press Enter to generate a new one
  - Store password: choose a strong password, write it down
  - Key alias: `do-training`
  - Key password: same as store password
- **Theme colour**: `#0a1628`
- **Background colour**: `#0a1628`

### Step 3 — Build the AAB and APK
```bash
bubblewrap build
```
This takes 2-5 minutes. It produces:
- `app-release-bundle.aab` — upload to Google Play
- `app-release-signed.apk` — install directly on Android for testing

### Step 4 — Test the APK on your phone
1. Transfer `app-release-signed.apk` to your Android phone
2. On the phone: Settings → Security → Allow installs from unknown sources
3. Open the APK file and install
4. The app appears as **DO Training** with the D.O. globe icon

---

## PART 5 — GOOGLE PLAY CONSOLE UPLOAD

### Step 1 — Create the app
1. Go to https://play.google.com/console
2. Sign in with `dimipara2017@gmail.com`
3. Click **Create app**
4. App name: `DO Training — Cybersecurity`
5. Default language: English (United Kingdom)
6. App or game: **App**
7. Free or paid: **Free** (you can add in-app purchases later)
8. Accept policies → **Create app**

### Step 2 — Fill in the store listing
**Short description** (80 chars):
```
Expert cybersecurity, digital forensics & child safety training by MSc specialist.
```

**Full description** (4000 chars):
```
DO Training — Professional Cybersecurity Education by Dimitrios Paraschidis MSc

Expert-led 1-on-1 and group training in:
- Cybersecurity Fundamentals
- Digital Forensics
- Anti-Trafficking Digital Safety
- Cyberbullying Prevention & Response
- GDPR & Data Protection
- Social Engineering & Phishing Defence
- Incident Response
- Corporate Security Onboarding

ABOUT THE TRAINER
Dimitrios Paraschidis holds an MSc in Applied Informatics specialising in IT Security and Digital Forensics. He has trained 155+ professionals, protected 60,000+ humanitarian beneficiaries through digital security infrastructure, and teaches at university level. Author of the CyberSafe Guardian bilingual guide and a 65-slide child cybersafety seminar used in schools across Greece.

FEATURES
- Book 1-on-1 or group sessions directly from the app
- Automatic Google Meet link for every online session
- 6 languages: English, Greek, German, Italian, French, Russian
- Free downloadable resources (PDF guides, presentations)
- Professional certificates of participation for every module
- Discount system: 2 modules = 20% off, 3+ = 30% off

Onsite (Thessaloniki & region) and fully online worldwide.
```

### Step 3 — Upload your AAB
1. **Release** → **Production** → **Create new release**
2. Upload `app-release-bundle.aab`
3. Release name: `1.0.0`
4. Release notes:
```
Initial release of DO Training platform.
Book cybersecurity training sessions, access free resources, and receive professional certificates.
```
5. Click **Save**

### Step 4 — Content rating
1. **Policy** → **App content** → **Content rating**
2. Complete the questionnaire (Education category, no violence, no adult content)
3. Rating will be: **Everyone**

### Step 5 — Privacy policy
You need a URL for your privacy policy. Use this simple one — create a file `privacy.html` in your repo:
```
https://dataomerta.github.io/do-training/privacy.html
```
(A basic privacy.html template is included in this package)

### Step 6 — Submit for review
1. Go through all the checklist items in Play Console (they show green checkmarks)
2. Click **Send for review**
3. Google reviews new apps in 1-7 days
4. You will receive an email at `dimipara2017@gmail.com` when approved

---

## PART 6 — YOUR ADMIN PANEL

### Accessing admin (desktop/laptop):
- Press **Shift + D + O** simultaneously on any page of the site
- Login: username `admin`, password `adminADMIN123!@#`
- Tick "Remember me" on your own device — you won't need to log in again

### Accessing admin (mobile/phone):
- Since there's no keyboard shortcut on mobile, navigate to:
  `https://dataomerta.github.io/do-training/#admin` in your browser
  then navigate back — this will trigger the login overlay
- Or: add `/admin-login` to the URL bar after the domain

### What you can do in admin:
- **Dashboard**: live stats, revenue estimate, most popular module, booking chart
- **Appointments**: view all bookings, confirm/reschedule/cancel, issue certificates, export CSV
- **Modules**: add, edit, delete, hide/show training modules — reflects live on public site
- **Services**: same for the services tab
- **Resources**: add PDFs, PPTXs, ZIPs, YouTube links, GitHub links, OneDrive — toggle free vs email-gated
- **Certificates**: generate print-ready A4 PDFs with your D.O. logo and watermark

---

## PART 7 — FUTURE UPDATES

### To update the site:
1. Edit files locally
2. Go to your GitHub repo → the file → click pencil (edit) icon
3. Make changes → **Commit changes**
4. GitHub Actions redeploys automatically in ~30 seconds
5. The PWA and web app update on next visitor load

### To update the Android app:
1. Re-run `bubblewrap build` after any significant changes
2. In Play Console → **Production** → **Create new release**
3. Upload the new AAB → bump version to `1.0.1`, `1.1.0`, etc.
4. Submit for review (updates review much faster, usually hours)

---

## SUPPORT CONTACTS

- EmailJS: https://www.emailjs.com/docs/
- GitHub Pages: https://docs.github.com/pages
- Bubblewrap: https://github.com/GoogleChromeLabs/bubblewrap
- Google Play Console Help: https://support.google.com/googleplay/android-developer/
- PWA documentation: https://web.dev/progressive-web-apps/
