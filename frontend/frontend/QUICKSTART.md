# Quick Start Guide

## ⚡ Run the Frontend in 3 Steps

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Open [http://localhost:5173](http://localhost:5173)

That's it! 🎉

---

## 📋 Available Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run code quality checks
npm run lint
```

---

## 🎯 What to Do in the App

1. **Home Page** - See features and project overview
2. **Upload Page** - Drag & drop a PDF/DOCX file
3. **Results Page** - View analysis dashboard with charts
4. **About Page** - Learn about the project and team

---

## 🔧 Development Tips

### Hot Module Replacement (HMR)
- All changes auto-reload in browser
- No need to refresh manually

### Browser DevTools
- React Developer Tools (Chrome extension)
- Use Inspect Element for styling

### Console Logs
- Open browser DevTools (F12)
- Check Console tab for any errors

---

## 📱 Test Responsive Design

Press F12 to open DevTools, then:
1. Click Device Toggle (Ctrl+Shift+M)
2. Choose device (iPhone, iPad, etc.)
3. Test layout and interactions

---

## ❌ Troubleshooting

### Port 5173 Already in Use
```bash
npm run dev -- --port 3000
```

### Clear Cache & Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build Errors
```bash
npm run build  # Check error messages
```

---

## 🚀 Next Steps

1. **Test with Mock API** - Use included mock API service
2. **Build for Production** - `npm run build`
3. **Deploy** - See FRONTEND_SETUP.md for hosting options

---

**Ready? Run `npm run dev` and start exploring!** 🌟
