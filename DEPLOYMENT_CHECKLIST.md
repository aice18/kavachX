# KavachX Deployment Checklist

**Print this and check off before presentation day**

---

## 📋 Pre-Deployment (Do 1 week before)

- [ ] All code committed to GitHub
- [ ] No hardcoded credentials in code
- [ ] `.gitignore` includes `.env`, `node_modules/`, `dist/`
- [ ] `vercel.json` file exists in root
- [ ] `.env.production` file created
- [ ] Vercel account created (https://vercel.com)
- [ ] GitHub repo connected to Vercel (optional, for automatic deploys)

---

## 🚀 Deployment Day (Do 24-48 hours before presentation)

### Step 1: One-Command Deployment
- [ ] Terminal: `npm install` (local)
- [ ] Terminal: `npm run build` (verify no errors)
- [ ] Terminal: `vercel login` (if not already logged in)
- [ ] Terminal: `vercel --prod` (deploy to production)
- [ ] **Your app is now live!** Copy the URL
- [ ] Expected URL: `https://kavach-x-omega.vercel.app`
- [ ] Wait 2-3 minutes for Vercel build to complete

### Step 2: Test All Screens Load Instantly
- [ ] Browser: Open https://kavach-x-omega.vercel.app/
- [ ] ✅ Login page loads instantly (< 1 sec)
- [ ] Click **Demo Access**
- [ ] Click **Secure SOC Login**
- [ ] ⏱️ Measure: Command Center should load in < 500ms
- [ ] ✅ Command Center loads (no 404)
- [ ] Click **SOC Console** → loads instantly
- [ ] Click **AI Copilot** → loads instantly
- [ ] Click **Data Pipeline** → loads instantly (7 components visible)
- [ ] Click **Risk Analytics** → loads instantly
- [ ] Click **Cryptography Assets** → loads instantly

### Step 3: Verify Data Display
- [ ] Metrics visible on Command Center
- [ ] Event log scrolling in SOC Console
- [ ] All 7 pipeline components show status (Online/Processing/Standby)
- [ ] Metrics display: 4.2M, 14ms, 1,842, 127
- [ ] PQC Score: 100/100
- [ ] Vulnerable Systems: 0
- [ ] HNDL Exposure: ₹0

### Step 4: Check Browser Performance
- [ ] DevTools → Network tab → all requests are 200 status (no 404s)
- [ ] DevTools → Console → no JavaScript errors
- [ ] Page responsiveness: smooth scrolling, instant clicks
- [ ] All images load properly

### Step 5: Mobile/Hotspot Test
- [ ] Disconnect from Wi-Fi
- [ ] Connect to mobile hotspot (simulate on-the-go)
- [ ] App still loads instantly
- [ ] All screens responsive

---

## 🎯 Presentation Day (2 hours before)

### 30 Minutes Before

- [ ] Laptop fully charged (plugged in if possible)
- [ ] Internet tested (Wi-Fi + mobile hotspot both working)
- [ ] Browser cache cleared: `Ctrl+Shift+Delete`
- [ ] Open https://kavach-x-omega.vercel.app/ (pre-load)
- [ ] Test Demo Access login once
- [ ] Navigate through all 6 screens once (verify instant loading)
- [ ] Browser zoom at 100% (not smaller)
- [ ] Print `DEMO_QUICK_REFERENCE.md` (bring with you)

### On Stage (5 minutes before)

- [ ] Projector tested and working
- [ ] HDMI cable connected and working
- [ ] Phone on silent
- [ ] Water bottle ready
- [ ] Quick reference card visible on podium
- [ ] Slides open in separate tab (backup)
- [ ] YouTube backup demo link ready (if needed)

### During Demo

- [ ] Speak slowly and clearly
- [ ] Point at screen frequently to draw attention
- [ ] Narrate every action
- [ ] Follow exact timing: 0:15, 0:45, 1:20, 1:50, 2:15, 2:50, 3:00
- [ ] If anything takes > 2 seconds → move to next screen

---

## 🚨 If Something Goes Wrong

### Demo Moves Slowly (> 3 seconds per screen)
- [ ] Check internet connection (should be > 10Mbps)
- [ ] Switch to mobile hotspot
- [ ] Ask organizers: "Can we use a faster Wi-Fi?"
- [ ] Last resort: Play backup video

### Login doesn't work
- [ ] Demo Access button not populating credentials?
- [ ] Manually type: `demo` / `demo`
- [ ] Click Secure SOC Login

### Screen doesn't load
- [ ] Wait 5 seconds (sometimes needs a moment)
- [ ] If still nothing: Refresh entire page (F5)
- [ ] If still broken: Skip to next screen

### Complete Internet Failure
- [ ] Have backup demo video downloaded on laptop
- [ ] Switch to pre-recorded walkthrough
- [ ] Say: "Let me show you our production demo video"
- [ ] Play from desktop (don't stream from YouTube)

---

## ✅ Final Verification (Day Before)

Run through the entire 3-minute demo:

- [ ] Start timer (00:00)
- [ ] Login (15 sec) → 00:15 ✓
- [ ] Command Center (25 sec) → 00:40 ✓
- [ ] SOC Console (35 sec) → 01:15 ✓
- [ ] AI Copilot (30 sec) → 01:45 ✓
- [ ] Data Pipeline (25 sec) → 02:10 ✓
- [ ] Risk Analytics + Crypto (35 sec) → 02:45 ✓
- [ ] Closing (15 sec) → 03:00 ✓
- [ ] **Total time: Exactly 180 seconds ✅**

---

## 📊 Demo Status Tracker

| Component | Status | Last Tested | Notes |
|-----------|--------|-------------|-------|
| Vercel Deployment | ⬜ | — | |
| All Screens Load Instantly | ⬜ | — | |
| Command Center Data | ⬜ | — | |
| SOC Console Events | ⬜ | — | |
| AI Copilot | ⬜ | — | |
| Data Pipeline | ⬜ | — | |
| Cryptography Assets | ⬜ | — | |
| Full 3-min Demo | ⬜ | — | |
| Backup Video | ⬜ | — | |
| Internet Speed | ⬜ | — | |

**Legend:** ⬜ = Not Started | 🟨 = Testing | ✅ = Ready | ❌ = Issue

---

## 🎬 Backup Plan

Always have these ready:

1. **Backup Demo Video**
   - File: `KavachX_demo_backup.mp4`
   - Location: Desktop (for quick access)
   - Duration: 3-4 minutes
   - Format: MP4 (plays on any laptop)
   - Size: < 100MB

2. **Screenshots of Each Screen**
   - Location: Desktop folder `/Demo_Screenshots/`
   - Use if: Demo completely fails
   - Narrate while showing screenshots

3. **Printed Slides**
   - Copies: 1 per judge + 2 extra
   - Format: Paper

---

## 📞 Emergency Contacts

Have these ready:

- Vercel Status: https://status.vercel.com/
- GitHub Status: https://www.githubstatus.com/
- Google Cloud Status: https://status.cloud.google.com/

---

## ✨ Simple, Reliable, Fast

**Why this approach is better:**
- ✅ No backend to break
- ✅ No API keys needed
- ✅ Loads instantly (< 500ms per screen)
- ✅ 99.9% uptime guaranteed by Vercel
- ✅ Works anywhere (even slow internet)
- ✅ Zero dependencies

**When all checkboxes are ✅:**
- You have a production-grade demo
- All screens load instantly
- Zero 404 errors
- Backup plans ready
- Ready to present

---

**Go crush the presentation! 🚀**

---

*Deployment Checklist v2.0 (Frontend-Only)*
*Print and use on presentation day*

