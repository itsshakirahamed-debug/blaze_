import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiUploadCloud, FiX, FiFile } from "react-icons/fi";

export default function DragDropUpload({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const isValidFile = (file) => {
    return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile);
      onFileSelect(droppedFile);
    } else {
      alert("Please upload a PDF document.");
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    } else if (selectedFile) {
      alert("Please upload a PDF document.");
    }
  };

  const removeFile = () => {
    setFile(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div style={{ width: '100%' }}>
      {!file ? (
        <motion.div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            backgroundColor: isDragging ? '#f5f3ff' : '#ffffff',
            borderColor: isDragging ? '#5B5FFF' : '#e2e8f0',
            scale: isDragging ? 1.01 : 1,
          }}
          transition={{ duration: 0.15 }}
          style={{
            border: '1.5px dashed #e2e8f0',
            borderRadius: 20,
            padding: '48px 32px',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
          className="group hover:border-[#5B5FFF] hover:bg-indigo-50/20 transition-colors"
        >
          {/* Icon */}
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: '#eef2ff', border: '1px solid rgba(91,95,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FiUploadCloud size={22} style={{ color: '#5B5FFF' }} />
          </div>

          {/* Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
              Upload Your PDF Contract
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
              Drag & drop your PDF file here, or{' '}
              <span style={{ color: '#5B5FFF', fontWeight: 700 }}>browse files</span>
            </p>
          </div>

          <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
            Supported format: PDF (.pdf) · Max 10 MB
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInput}
            className="hidden"
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 16,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: '#eef2ff', border: '1px solid rgba(91,95,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <FiFile size={18} style={{ color: '#5B5FFF' }} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}
                className="line-clamp-1">
                {file.name}
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 2 }}>
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={removeFile}
            style={{
              width: 32, height: 32, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', background: 'transparent',
              color: '#94a3b8', cursor: 'pointer', flexShrink: 0,
            }}
            className="hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <FiX size={16} />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}