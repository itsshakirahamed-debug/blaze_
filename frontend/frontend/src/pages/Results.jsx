import { motion } from 'framer-motion';
import { FiDownload, FiUpload, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import TrustScoreGauge from '@components/trustguard/TrustScoreGauge';
import ScamProbabilityGauge from '@components/trustguard/ScamProbabilityGauge';
import TrustBreakdownChart from '@components/trustguard/TrustBreakdownChart';
import { DocumentIntegrityCard } from '@components/trustguard/AuthenticityCard';
import CompanyVerificationCard from '@components/trustguard/CompanyVerificationCard';
import { FraudFlagsCard, ClauseChecklistCard, InternalConsistencyCard } from '@components/trustguard/FraudFlagsPanel';
import AIRecommendationCard from '@components/AIRecommendationCard';

export default function Results() {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("analysisResult");
    if (stored) {
      setAnalysisData(JSON.parse(stored));
    }
  }, []);

  if (!analysisData) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FAFBFF] p-6 space-y-4">
        <div className="w-10 h-10 border-2 border-[#5B5FFF]/30 border-t-[#5B5FFF] rounded-full animate-spin"></div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-slate-800">Loading Intelligence Dashboard</p>
          <p className="text-xs text-slate-400">Processing authenticity indicators and document verification files...</p>
        </div>
      </div>
    );
  }

  const trustScore = analysisData.trust_score !== undefined ? analysisData.trust_score : 86;
  const scamProbability = analysisData.scam_probability !== undefined ? analysisData.scam_probability : 11;
  const analysisMode = analysisData.analysis_mode || analysisData._mode || 'fast';
  const overallRisk = analysisData.overall_risk || 'Medium';

  const MODE_META = {
    fast:     { label: '⚡ FAST MODE',     badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    balanced: { label: '⚖️ BALANCED',      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    deep:     { label: '🔬 DEEP ANALYSIS', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  };
  const modeMeta = MODE_META[analysisMode] || MODE_META.fast;

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/download-report',
        analysisData,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      const downloadName = (analysisData.filename ? analysisData.filename.split('.')[0] : 'contract') + '_TrustGuard_Report.pdf';
      link.setAttribute('download', downloadName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to generate PDF report. Make sure backend API is running.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAnalyzeAnother = () => {
    navigate('/upload');
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] py-10">
      <div className="max-w-[1420px] mx-auto px-8 space-y-8">
        
        {/* Top Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight flex items-center gap-2.5">
              <span>🛡️</span> Signo TrustGuard <span className="text-[#5B5FFF]">Dashboard</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Audit for: <span className="font-extrabold text-slate-800">{analysisData.filename || 'SampleContract-Shuttle.pdf'}</span>
            </p>
            <div>
              <span className={`inline-flex items-center justify-center px-6 sm:px-8 py-1.5 text-xs font-extrabold rounded-md border uppercase tracking-wider shadow-2xs min-w-[180px] text-center ${modeMeta.badge}`}>
                {modeMeta.label}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 h-12 text-xs font-bold text-slate-700 bg-white border border-slate-200/90 rounded-md hover:bg-slate-50 shadow-xs transition-colors min-w-[240px]"
          >
            <FiArrowLeft size={15} />
            Analyze Another Document
          </button>
        </motion.div>

        {/* Global AI Recommendation Hero Card */}
        <AIRecommendationCard
          trustScore={trustScore}
          scamProbability={scamProbability}
          overallRisk={overallRisk}
          recommendation={analysisData.recommendation}
          recommendationReason={analysisData.recommendation_reason}
          recommendationExplanation={analysisData.recommendation_explanation}
        />

        {/* MAIN DASHBOARD CONTENT */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pt-2">
          
          {/* ROW 1: 3 Columns Side-by-Side (Document Integrity, Document Authenticity, AI Risk Prediction) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <DocumentIntegrityCard
              duplicateSimilarity={analysisData.duplicate_similarity}
              signatureStatus={analysisData.signature_status}
            />
            <TrustScoreGauge trustScore={trustScore} status={analysisData.authenticity_status} />
            <ScamProbabilityGauge scamProbability={scamProbability} />
          </div>

          {/* ROW 2: 2 Columns Side-by-Side (Trust Breakdown Chart & Company Verification) - Tab Space Gap */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mt-6 sm:mt-8">
            <div className="lg:col-span-2">
              <TrustBreakdownChart
                breakdown={analysisData.trustguard_details && analysisData.trustguard_details.breakdown}
              />
            </div>
            <div>
              <CompanyVerificationCard
                companyVerified={analysisData.company_verified}
                companyInfo={analysisData.trustguard_details && analysisData.trustguard_details.company_info}
              />
            </div>
          </div>

          {/* ROW 3: 3 Columns Side-by-Side (Fraud Flags, Clause Checklist, Internal Consistency) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <FraudFlagsCard fraudFlags={analysisData.fraud_flags || []} />
            <ClauseChecklistCard missingClauses={analysisData.missing_clauses || []} />
            <InternalConsistencyCard contradictions={analysisData.contradictions || []} />
          </div>

        </motion.div>

        {/* Action Controls Footer */}
        <div className="flex flex-wrap gap-5 justify-center pt-8 border-t border-slate-200/60">
          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="inline-flex items-center justify-center gap-2.5 px-12 sm:px-14 h-12 bg-[#5B5FFF] hover:bg-[#4a4deb] text-white text-xs font-bold rounded-md shadow-md disabled:opacity-50 transition-colors min-w-[290px]"
          >
            <FiDownload size={15} />
            {isDownloading ? 'Generating PDF Audit Report...' : 'Download Full PDF Audit Report'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleAnalyzeAnother}
            className="inline-flex items-center justify-center gap-2.5 px-12 sm:px-14 h-12 bg-[#FFFFFF] text-slate-700 text-xs font-bold rounded-md border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs min-w-[290px]"
          >
            <FiUpload size={15} />
            Analyze Another Document
          </motion.button>
        </div>

      </div>
    </div>
  );
}
