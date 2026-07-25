# API Integration Guide

## 🔌 Using the Mock API Service

The frontend includes a **mock API service** for testing without a backend. When your backend is ready, simply replace the mock functions with real API calls.

---

## 📍 Quick Start: Use Mock API

### 1. In Upload.jsx - Replace the simulated analysis with real mock API

Current code in Upload.jsx:
```javascript
const handleAnalyze = () => {
  setIsAnalyzing(true);
  // Simulated 5-second timeout
  setTimeout(() => {
    navigate('/results');
    setIsAnalyzing(false);
  }, 5000);
};
```

**Update to use mock API:**
```javascript
import { analyzeContract } from '../services/mockApi';

const handleAnalyze = async () => {
  setIsAnalyzing(true);
  try {
    const result = await analyzeContract(file, (progress) => {
      console.log(`Upload progress: ${progress}%`);
    });
    
    if (result.success) {
      // Store result in context or localStorage for Results page
      localStorage.setItem('analysisResult', JSON.stringify(result.data));
      navigate('/results');
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    alert(`Upload failed: ${error.message}`);
  } finally {
    setIsAnalyzing(false);
  }
};
```

---

## 📊 Using Mock Data in Results.jsx

### Current Mock Data (hardcoded):
```javascript
const dummyData = {
  riskScore: 72,
  totalClauses: 47,
  highRiskItems: 12,
  analysisTime: 3.2,
  // ... more data
};
```

### Switch to Mock API Results:
```javascript
import { useEffect, useState } from 'react';

export default function Results() {
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    // Get analysis result from localStorage (set by Upload page)
    const stored = localStorage.getItem('analysisResult');
    if (stored) {
      setAnalysisData(JSON.parse(stored));
    }
  }, []);

  if (!analysisData) {
    return <div>Loading analysis data...</div>;
  }

  return (
    <div>
      <RiskGauge riskScore={analysisData.riskScore} />
      {/* Use analysisData instead of dummyData */}
    </div>
  );
}
```

---

## 🔄 Mock API Functions

### `analyzeContract(file, onProgress)`
Analyzes a contract file and returns results.

**Usage:**
```javascript
const result = await analyzeContract(file, (progress) => {
  console.log(`Progress: ${progress}%`);
});

if (result.success) {
  console.log(result.data); // Contains analysis results
} else {
  console.error(result.error);
}
```

**Response Structure:**
```javascript
{
  fileName: string,
  riskScore: number,
  totalClauses: number,
  highRiskClauses: number,
  analysisTime: number,
  riskDistribution: { low, medium, high },
  clauseTypes: Array<{ type, risk, count }>,
  riskyClauses: Array<{ id, clauseName, risk, summary, recommendation }>,
  aiInsights: Array<{ title, description, icon }>,
}
```

### `downloadReport(analysisData)`
Downloads analysis as CSV (replace with PDF in production).

**Usage:**
```javascript
const result = await downloadReport(analysisData);
if (result.success) {
  console.log('Report downloaded');
} else {
  console.error(result.error);
}
```

### `validateFile(file)`
Validates file before upload.

**Usage:**
```javascript
const validation = validateFile(file);
if (!validation.valid) {
  alert(validation.error);
} else {
  console.log('File is valid');
}
```

### `formatFileSize(bytes)`
Formats bytes to human-readable size.

**Usage:**
```javascript
const size = formatFileSize(1024 * 1024); // "1 MB"
```

---

## 🔌 Switching to Real Backend API

When your backend is ready, create a new file `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const analyzeContract = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData (browser will set it)
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const downloadReport = async (analysisData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/report/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(analysisData),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.pdf';
    a.click();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Export rest of functions...
```

Then update imports:
```javascript
// Change this:
import { analyzeContract } from '../services/mockApi';

// To this:
import { analyzeContract } from '../services/api';
```

---

## 📝 Environment Variables

Create `.env.local` in the frontend folder:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Smart Contract Risk Analyzer
VITE_ENABLE_DEBUG=false
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const timeout = import.meta.env.VITE_API_TIMEOUT;
```

---

## ⚙️ Backend API Endpoints (Expected)

When building the backend, implement these endpoints:

### POST `/api/analyze`
Analyzes a contract file.

**Request:**
```
Content-Type: multipart/form-data
Body: file (PDF or DOCX)
```

**Response:**
```json
{
  "fileName": "contract.pdf",
  "riskScore": 72,
  "totalClauses": 47,
  "highRiskClauses": 12,
  "analysisTime": 3.2,
  "riskDistribution": {
    "low": 35,
    "medium": 45,
    "high": 20
  },
  "clauseTypes": [...],
  "riskyClauses": [...],
  "aiInsights": [...]
}
```

### POST `/api/report/download`
Generates and downloads analysis report.

**Request:**
```json
{
  "fileName": "contract.pdf",
  "riskScore": 72,
  "totalClauses": 47,
  ...
}
```

**Response:** Binary PDF file

---

## 🧪 Testing Workflow

### 1. With Mock API (Current)
```bash
npm run dev
# Upload file → Mock API processes → See results
```

### 2. With Real Backend
```bash
# Start backend
cd backend
python -m uvicorn main:app --reload

# In new terminal, start frontend
cd frontend
npm run dev

# Upload file → Real API processes → See results
```

---

## 🐛 Debugging API Calls

### Enable Debug Mode
```env
VITE_ENABLE_DEBUG=true
```

### Check Browser Console
Press F12 in browser and check:
1. **Console tab** - Error messages and logs
2. **Network tab** - API requests and responses
3. **Application > Local Storage** - Stored analysis data

### Mock API Logs
```javascript
import { analyzeContract } from '../services/mockApi';

const result = await analyzeContract(file, (progress) => {
  console.log(`Progress: ${progress}%`); // Logs to console
});

console.log('Analysis result:', result);
```

---

## ✅ Checklist

- [ ] Mock API working in development
- [ ] Results persist between page navigation
- [ ] Download report functionality works
- [ ] Error handling shows user-friendly messages
- [ ] Backend API endpoints implemented
- [ ] Switch to real API by updating imports
- [ ] Environment variables configured
- [ ] Test end-to-end workflow
- [ ] Production build tested

---

## 📚 Additional Resources

- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [FormData Documentation](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Axios Documentation](https://axios-http.com/)
- [Environment Variables in Vite](https://vitejs.dev/guide/env-and-modes.html)
