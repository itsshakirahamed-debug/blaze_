# How to Run This Frontend - Complete Guide

## 🎯 The Quickest Way to Get Started

```bash
cd frontend
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser. **That's it!** ✨

---

## 📋 Detailed Steps

### Step 1: Navigate to Frontend Folder
```bash
cd Smart-Contract-Risk-Analyzer/frontend
```

### Step 2: Install Dependencies (First Time Only)
```bash
npm install
```
This installs all 33 npm packages listed in `package.json`.

**What's installed:**
- React 19 & React Router
- Vite (build tool)
- Tailwind CSS
- Framer Motion (animations)
- Recharts (charts)
- React Icons
- And more...

### Step 3: Start Development Server
```bash
npm run dev
```

**Output should look like:**
```
  VITE v8.1.5  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 4: Open in Browser
Click the link or paste `http://localhost:5173` into your browser.

**You should see the landing page with:**
- Beautiful hero section
- Feature cards
- How it works section
- Team section

---

## 🚀 What to Try in the App

### 1. **Navigation**
- Click "Get Started" button → Goes to Upload page
- Click navbar links to navigate
- Mobile menu (on small screens) - click hamburger icon

### 2. **Upload Page**
- Drag a PDF or DOCX file into the upload area
- OR click the area to browse and select a file
- Click "Analyze Contract" button
- Wait for loading animation (5 seconds with mock API)

### 3. **Results Page**
- View risk score gauge (animated)
- See pie chart of risk distribution
- View bar chart of clause types
- See risky clauses listed
- Click "Download Report" to export
- Click "Analyze Another" to upload again

### 4. **About Page**
- Learn about the project
- See tech stack
- View team members
- Check workflow

---

## 💾 File Size Reference

**After `npm install`:**
- `node_modules/` folder: ~500MB (don't track in git, already in `.gitignore`)
- `package-lock.json`: ~300KB (tracks exact versions)

**Development build:**
- `dist/` folder: ~1.2MB (created by `npm run build`)

---

## 🔥 Hot Module Replacement (HMR)

Edit any file and see changes **instantly** in browser:

1. Edit `src/components/Navbar.jsx` - Button changes immediately
2. Edit `src/pages/Home.jsx` - Content updates instantly
3. Edit CSS classes - Styles apply without reload

**No manual refresh needed!** ✨

---

## 🛑 Stopping the Server

Press `Ctrl+C` in terminal to stop the dev server.

```
^C  # Ctrl+C stops the server
```

---

## ⚙️ Available Commands Reference

```bash
# Start development (with live reload)
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview

# Run code quality checks
npm run lint

# Install new package
npm install package-name

# Uninstall package
npm uninstall package-name

# Update packages
npm update
```

---

## 📱 Testing Mobile View

### Option 1: Browser DevTools
1. Open DevTools: `F12` or `Ctrl+Shift+I`
2. Click device icon (top-left corner) or `Ctrl+Shift+M`
3. Select device: iPhone, iPad, etc.
4. Scroll and test on different screen sizes

### Option 2: Phone on Same Network
1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. On phone, open: `http://YOUR_IP:5173`
3. Test on actual device

---

## 🐛 Troubleshooting

### Problem: Port 5173 Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```
Then open `http://localhost:3000`

### Problem: Blank Page or 404
1. Stop dev server: `Ctrl+C`
2. Clear browser cache: `Ctrl+Shift+Delete`
3. Hard refresh: `Ctrl+Shift+R`
4. Restart dev server: `npm run dev`

### Problem: Module Not Found Error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problem: High Memory Usage
The dev server uses ~300-400MB RAM. If slow:
1. Close other apps
2. Restart terminal: `npm run dev`
3. Check system resources (Task Manager on Windows)

### Problem: Network Requests Failing
Check if you need to set API URL:
1. Copy `.env.example` to `.env.local`
2. Update `VITE_API_BASE_URL` if backend is running
3. Restart: `npm run dev`

---

## 📊 What's Running

When you run `npm run dev`, this is happening:

```
┌─────────────────────────────────────┐
│  Vite Dev Server (localhost:5173)   │
├─────────────────────────────────────┤
│ • Hot Module Reload (HMR)           │
│ • File Watcher (auto-rebuild)       │
│ • TypeScript/JSX Compiler           │
│ • Tailwind CSS Processor            │
│ • PostCSS Pipeline                  │
│ • Browser LiveReload                │
└─────────────────────────────────────┘
         ↓
    Your Browser
```

---

## 🚀 Next Steps

### To Test with Mock API
See `API_INTEGRATION.md` for:
- How to use mock API service
- How to switch to real backend
- Backend endpoint specifications

### To Build for Production
```bash
npm run build
```

Creates optimized files in `dist/` folder:
- `dist/index.html` - Main page
- `dist/assets/` - JS, CSS bundles
- Ready to deploy to any static host

### To Deploy
See `FRONTEND_SETUP.md` for deployment guides:
- **Vercel** - 1-click deployment from git
- **Netlify** - Drag-and-drop or git connected
- **Docker** - Containerized deployment
- **Traditional hosting** - Copy `dist/` folder

---

## 💡 Pro Tips

### 1. Keep DevTools Open
```
F12 - Keep it open to see errors in Console tab
```

### 2. Use React DevTools Extension
Install "React Developer Tools" Chrome extension for easier debugging.

### 3. Check Network Tab
View all HTTP requests and responses in DevTools Network tab.

### 4. Use Browser Lighthouse
1. F12 → Lighthouse tab
2. Click "Analyze page"
3. View performance metrics

### 5. Test Different Browsers
- Chrome/Edge/Firefox all work
- Mobile browsers work with network IP

---

## 📚 Project Links

- **Code**: `d:\personal\blaze_a_trial\Smart-Contract-Risk-Analyzer\frontend\`
- **Documentation**: See README_FRONTEND.md
- **API Guide**: See API_INTEGRATION.md
- **Setup Guide**: See FRONTEND_SETUP.md
- **Quick Start**: See QUICKSTART.md

---

## ✅ Verification Checklist

After running `npm run dev`, verify:

- [ ] Page opens at http://localhost:5173
- [ ] No errors in browser console (F12)
- [ ] Hero section displays
- [ ] Navigation links work
- [ ] Mobile menu works on small screen
- [ ] Buttons are clickable
- [ ] Animations are smooth
- [ ] File upload works (drag or click)

---

## 🎉 You're All Set!

Your production-quality Smart Contract Risk Analyzer frontend is ready to go! 

**Run this command and start exploring:**
```bash
npm run dev
```

Questions? Check the documentation files in the frontend folder! 📖

---

## 🔗 Quick Links

| What You Want | Command | URL |
|---|---|---|
| **Start developing** | `npm run dev` | http://localhost:5173 |
| **Build for production** | `npm run build` | - |
| **Test production build** | `npm run preview` | http://localhost:4173 |
| **Check code quality** | `npm run lint` | - |

---

**Happy coding!** 🚀✨
