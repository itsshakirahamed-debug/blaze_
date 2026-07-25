export function DocumentIntegrityCard({ duplicateSimilarity = 6, signatureStatus = "Not Present" }) {
  const isSignaturePresent = signatureStatus === "Valid" || signatureStatus === "Present" || signatureStatus === "Not Applicable";

  return (
    <div className="bg-white p-7 sm:p-8 rounded-lg border border-slate-200/70 shadow-xs flex flex-col justify-between h-full space-y-4 min-h-[220px]">
      <div className="px-2 py-1 space-y-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shadow-2xs">🔍</span>
          <h3 className="text-sm font-extrabold text-slate-900">
            Document Integrity
          </h3>
        </div>

        {/* Subgrid: 2 Side-by-Side Items */}
        <div className="grid grid-cols-2 gap-4 items-center pt-1">
          {/* Similarity Item */}
          <div className="space-y-1 px-1">
            <span className="text-3xl font-extrabold text-slate-900 block tracking-tight">
              {duplicateSimilarity}%
            </span>
            <p className="text-xs font-extrabold text-slate-800">
              Similarity Check
            </p>
            <p className="text-xs text-slate-400 font-medium leading-normal pt-0.5">
              Low similarity detected
            </p>
          </div>

          {/* Divider & Signature Item */}
          <div className="border-l border-slate-100 pl-5 space-y-1.5 px-1">
            <div>
              <span className={`inline-block px-3.5 py-1.5 text-xs font-extrabold rounded-md shadow-2xs ${
                isSignaturePresent
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {isSignaturePresent ? 'Present' : 'Not Present'}
              </span>
            </div>
            <p className="text-xs font-extrabold text-slate-800 pt-1">
              Document Signatures
            </p>
            <p className="text-xs text-slate-400 font-medium leading-normal">
              {isSignaturePresent ? 'Signature is present' : 'Signature is not present'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthenticityCard({ duplicateSimilarity = 6, signatureStatus = "Not Present" }) {
  return <DocumentIntegrityCard duplicateSimilarity={duplicateSimilarity} signatureStatus={signatureStatus} />;
}
