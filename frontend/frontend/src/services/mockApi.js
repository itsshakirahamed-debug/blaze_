/**
 * Mock API Service for Frontend Testing
 * Simulates backend responses without a real server
 * Replace these functions with real API calls when backend is ready
 */

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock analysis result data
const generateMockAnalysisResult = (fileName) => {
  return {
    fileName,
    uploadDate: new Date().toISOString(),
    riskScore: Math.floor(Math.random() * 100),
    totalClauses: Math.floor(Math.random() * 50) + 20,
    highRiskClauses: Math.floor(Math.random() * 15) + 2,
    analysisTime: (Math.random() * 5 + 1).toFixed(2),
    riskDistribution: {
      low: Math.floor(Math.random() * 40) + 20,
      medium: Math.floor(Math.random() * 50) + 25,
      high: Math.floor(Math.random() * 30) + 10,
    },
    clauseTypes: [
      { type: 'Payment', risk: Math.floor(Math.random() * 100), count: Math.floor(Math.random() * 10) + 2 },
      { type: 'Liability', risk: Math.floor(Math.random() * 100), count: Math.floor(Math.random() * 10) + 2 },
      { type: 'Termination', risk: Math.floor(Math.random() * 100), count: Math.floor(Math.random() * 8) + 1 },
      { type: 'Confidentiality', risk: Math.floor(Math.random() * 100), count: Math.floor(Math.random() * 8) + 1 },
      { type: 'Indemnity', risk: Math.floor(Math.random() * 100), count: Math.floor(Math.random() * 5) + 1 },
      { type: 'Arbitration', risk: Math.floor(Math.random() * 100), count: Math.floor(Math.random() * 5) + 1 },
    ],
    riskyClauses: [
      {
        id: 1,
        clauseName: 'Unlimited Liability',
        risk: 'HIGH',
        summary: 'No cap on liability exposure',
        recommendation: 'Add liability cap or insurance requirement',
      },
      {
        id: 2,
        clauseName: 'Automatic Renewal',
        risk: 'MEDIUM',
        summary: 'Contract auto-renews without explicit approval',
        recommendation: 'Require explicit renewal consent',
      },
      {
        id: 3,
        clauseName: 'Broad Confidentiality',
        risk: 'MEDIUM',
        summary: 'Overly broad confidentiality obligations',
        recommendation: 'Narrow scope to specific business information',
      },
      {
        id: 4,
        clauseName: 'Termination Penalties',
        risk: 'HIGH',
        summary: 'Excessive penalties for early termination',
        recommendation: 'Negotiate reasonable termination fees',
      },
    ],
    aiInsights: [
      {
        title: 'Liability Exposure',
        description: 'The contract contains unlimited liability clauses that could expose your organization to significant financial risk. Consider adding liability caps.',
        icon: '⚠️',
      },
      {
        title: 'Favorable Payment Terms',
        description: 'Payment terms are relatively standard and favorable. Net-30 payment schedule is reasonable for business continuity.',
        icon: '✅',
      },
      {
        title: 'Termination Risk',
        description: 'Termination clauses include penalties that may limit flexibility. Negotiate for more favorable exit conditions.',
        icon: '📋',
      },
    ],
  };
};

/**
 * Mock: Upload and analyze contract
 * @param {File} file - The contract file to analyze
 * @param {Function} onProgress - Callback for progress updates (0-100)
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeContract = async (file, onProgress) => {
  try {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 20) {
      onProgress?.(i);
      await delay(300);
    }

    // Simulate processing
    await delay(2000);

    // Return mock analysis result
    return {
      success: true,
      data: generateMockAnalysisResult(file.name),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Mock: Download analysis report as PDF
 * @param {Object} analysisData - The analysis data to include in report
 * @returns {Promise<void>}
 */
export const downloadReport = async (analysisData) => {
  try {
    // Simulate download delay
    await delay(800);

    // Create a simple CSV report (in real app, this would be PDF)
    const csv = generateCSVReport(analysisData);
    
    // Create download link
    const link = document.createElement('a');
    const blob = new Blob([csv], { type: 'text/csv' });
    link.href = URL.createObjectURL(blob);
    link.download = `analysis-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Mock: Get analysis history
 * @returns {Promise<Array>} List of previous analyses
 */
export const getAnalysisHistory = async () => {
  try {
    await delay(500);

    return {
      success: true,
      data: [
        {
          id: 1,
          fileName: 'service-agreement-2024.pdf',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          riskScore: 62,
        },
        {
          id: 2,
          fileName: 'vendor-contract.docx',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          riskScore: 45,
        },
        {
          id: 3,
          fileName: 'nda-agreement.pdf',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          riskScore: 28,
        },
      ],
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Helper: Generate CSV report from analysis data
 */
const generateCSVReport = (analysisData) => {
  const headers = ['Analysis Report', analysisData.fileName];
  const rows = [
    headers.join(','),
    '',
    ['Metric', 'Value'].join(','),
    ['Total Clauses', analysisData.totalClauses].join(','),
    ['High Risk Clauses', analysisData.highRiskClauses].join(','),
    ['Overall Risk Score', analysisData.riskScore].join(','),
    ['Analysis Time (seconds)', analysisData.analysisTime].join(','),
    '',
    ['Risky Clauses'].join(','),
    ...analysisData.riskyClauses.map(c => [c.clauseName, c.risk, c.summary].join(',')),
  ];

  return rows.join('\n');
};

/**
 * Mock: Validate file before upload
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateFile = (file) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only PDF and DOCX files are supported' };
  }

  return { valid: true };
};

/**
 * Mock: Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export default {
  analyzeContract,
  downloadReport,
  getAnalysisHistory,
  validateFile,
  formatFileSize,
};
