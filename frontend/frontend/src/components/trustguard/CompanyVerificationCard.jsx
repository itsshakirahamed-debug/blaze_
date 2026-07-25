export default function CompanyVerificationCard({ companyVerified = true, companyInfo = {} }) {
  const info = companyInfo || {};
  
  const rawName = info.company_name;
  const hasValidCompany = Boolean(
    rawName &&
    rawName !== "Unknown" &&
    rawName !== "Unknown Company" &&
    rawName !== "No company detected" &&
    rawName !== "None"
  );

  const isVerified = Boolean(companyVerified === true && hasValidCompany);
  const companyName = hasValidCompany ? rawName : "No company detected";

  return (
    <div className="bg-white p-7 sm:p-8 rounded-lg border border-slate-200/70 shadow-xs flex flex-col justify-between h-full space-y-4">
      <div className="px-2 py-1 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shadow-2xs ${
            isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}>
            🏢
          </span>
          <h3 className="text-sm font-extrabold text-slate-900">
            Company Verification
          </h3>
        </div>

        {/* Dynamic Content */}
        <div className="space-y-2 pt-1">
          <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            {isVerified ? (
              <>
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                <span>Company Verified</span>
              </>
            ) : (
              <>
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">✕</span>
                <span>Company Not Found</span>
              </>
            )}
          </div>

          <div className="pt-1.5 space-y-1">
            <p className="text-xs font-extrabold text-slate-800">
              {companyName}
            </p>
            <div>
              {isVerified ? (
                <span className="px-3 py-1 text-[9px] font-extrabold rounded-md border uppercase tracking-wider inline-block bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-2xs">
                  🟢 GENUINE
                </span>
              ) : (
                <span className="px-3 py-1 text-[9px] font-extrabold rounded-md border uppercase tracking-wider inline-block bg-amber-50 text-amber-800 border-amber-200/60 shadow-2xs">
                  🟡 NOT DETECTED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-slate-400 text-xs font-medium leading-relaxed border-t border-slate-100 pt-3 mt-1">
          {isVerified
            ? "Company exists and matches trusted public records."
            : "No registered company could be identified in the uploaded contract."}
        </p>
      </div>
    </div>
  );
}
