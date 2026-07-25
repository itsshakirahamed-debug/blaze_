# Frontend Build Configuration

## Environment Setup
1. Copy `.env.example` to `.env.local`
2. Fill in your API base URL and configuration

## Scripts

### Development
```bash
npm run dev
```
Starts the development server on http://localhost:5173

### Build
```bash
npm run build
```
Creates optimized production build in `dist/` folder

### Preview
```bash
npm run preview
```
Preview the production build locally

### Lint
```bash
npm run lint
```
Run oxlint for code quality checks

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Docker
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist"]
```

## Performance Optimization

### Current Bundle Size
- **JS**: 776KB (unminified)
- **JS (gzipped)**: 219KB
- **CSS**: 34KB
- **CSS (gzipped)**: 6.47KB

### Recommended Optimizations
1. Code splitting for routes
2. Lazy loading components
3. Image optimization
4. Caching strategies

## API Integration

### Base Configuration
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Example API call
const analyzeContract = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
};
```

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Build Failures
1. Clear `node_modules`: `rm -rf node_modules`
2. Clear cache: `rm -rf .vite`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

### Missing Modules
```bash
npm install --save [module-name]
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Development Tools
- VS Code with Tailwind CSS IntelliSense
- React Developer Tools extension
- ESLint integration
- Prettier code formatter (optional)

## Version Info
- Node: 18+
- npm: 9+
- React: 19
- Vite: 8
- Tailwind CSS: 4
