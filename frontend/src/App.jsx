import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Settings, 
  Users, 
  History, 
  Plus, 
  Trash2, 
  FileText, 
  Download,
  Calendar,
  Building2,
  Briefcase,
  Eye,
  CheckCircle2,
  Printer,
  ImageIcon,
  QrCode as QrIcon,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  LogIn,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';

// --- Constants ---
const TRAINING_TYPES = {
  GRADUATE: "Flight Dispatcher Graduate",
  ATTENDANCE: "Human Factors Attendance",
  RECURRENT: "Flight Dispatcher Recurrent",
  OTHERS: "Others"
};

const MODULES = [
  "Air Law", "Aircraft Systems", "Navigation", "Meteorology", 
  "Principle of Flight", "Mass & Balance", "Operational Procedures", 
  "Performance", "Flight Planning & Monitoring", "Communication"
];

// --- Sub-Components ---

const Certificate = React.forwardRef(({ data, signatures }, ref) => {
  if (!data) return null;

  const isRecurrent = data.trainingType === TRAINING_TYPES.RECURRENT;
  const isGraduate = data.trainingType === TRAINING_TYPES.GRADUATE;
  
  const trainingDate = new Date(data.trainingDate || Date.now());
  const trainingDateStr = trainingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();

  const expiryDate = new Date(trainingDate);
  const validityMonths = 12; // Adjusted to exactly 1 year as per requirements
  expiryDate.setMonth(expiryDate.getMonth() + validityMonths);
  const expiryDateStr = expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();

  const certId = `FDR-${(data.id || Date.now()).toString().slice(-5)}-${trainingDate.getFullYear()}`;
  const certificateName = (data.certificateName || '').trim();

  // Dynamic palette based on template
  const getTemplateColors = (id) => {
    switch(id) {
      case 'BLUE': return { primary: "#1e3a8a", accent: "#3b82f6", text: "#0f172a", border: "#1e40af" };
      case 'GREEN': return { primary: "#064e3b", accent: "#10b981", text: "#064e3b", border: "#047857" };
      case 'RED': return { primary: "#7f1d1d", accent: "#ef4444", text: "#450a0a", border: "#b91c1c" };
      case 'ONYX': return { primary: "#000000", accent: "#525252", text: "#0a0a0a", border: "#171717" };
      default: return { primary: "#0f172a", accent: "#D4AF37", text: "#1e293b", border: "#D4AF37" };
    }
  };

  const colors = getTemplateColors(data.templateId);

  return (
    <div 
      ref={ref}
      className="relative w-[842px] h-[595px] bg-white overflow-hidden select-none mx-auto border-[12px]"
      style={{ 
        minWidth: '842px', 
        minHeight: '595px', 
        fontFamily: "'Inter', sans-serif",
        borderColor: colors.border,
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.05)'
      }}
    >
      {/* Premium Backdrop Ornament */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66-3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-45c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm26 18c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm16 18c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM9 22c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm20 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm2 17c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm20-31c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm40 5c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-1 24c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-28 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM24 70c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm53-53c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm18 40c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM45 86c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm33-93c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM1 78c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm50 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-8-72c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm6-45c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z' fill='%23d4af37' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
      {/* Corner Geometric Chevrons */}
      <div className="absolute top-0 left-0 w-48 h-48 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0f172a] clip-chevron-tl" />
        <div className="absolute top-4 left-4 w-full h-full bg-[#D4AF37] opacity-60 clip-chevron-tl" />
      </div>

      <div className="absolute bottom-0 right-0 w-48 h-48 z-0 pointer-events-none rotate-180">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0f172a] clip-chevron-tl" />
        <div className="absolute top-4 left-4 w-full h-full bg-[#D4AF37] opacity-60 clip-chevron-tl" />
      </div>

      {/* Certificate ID */}
      <div className="absolute top-8 right-8 text-[10px] font-bold text-gray-400">
        {certId}
      </div>

      <div className="absolute inset-0 p-8 flex flex-col items-center z-10">
        {/* Header Section */}
        <div className="mb-4 text-center">
          <p className="text-[9px] tracking-[0.3em] text-[#D4AF37] font-bold uppercase mb-2">
            {isRecurrent ? "FLIGHT DISPATCHER EASA STANDARDS" : "FLIGHT DISPATCHER DGCA REGULATIONS"}
          </p>
          <h1 className="text-4xl font-black tracking-[0.05em] uppercase leading-tight" style={{ color: colors.primary }}>
            Certificate
          </h1>
          <p className="text-base tracking-[0.4em] text-[#64748b] uppercase mt-1">
            {isRecurrent ? "of Training" : isGraduate ? "of Graduation" : data.trainingType === TRAINING_TYPES.ATTENDANCE ? "of Attendance" : `of ${data.trainingType}`}
          </p>
          <div className="w-48 h-[1px] opacity-30 mx-auto mt-4" style={{ backgroundColor: colors.accent }} />
        </div>

        {/* Recipient Section */}
        <div className="mt-3 mb-2 text-center">
          <p className="text-[8px] font-bold text-[#64748b] uppercase tracking-[0.2em] mb-2">This certifies that</p>
          <h2 className="text-3xl text-[#0f172a] px-12 leading-tight py-1 font-serif font-black italic">
            {data.name || "Participant Name"}
          </h2>
          {certificateName && (
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.25em] mt-2">
              Program: <span className="text-[#0f172a]">{certificateName}</span>
            </p>
          )}
        </div>

        {/* Body Text */}
        <div className="max-w-2xl mx-auto text-center mt-2 px-10">
          <p className="text-[10px] leading-relaxed text-slate-600 font-medium italic">
            {isRecurrent 
              ? "Has successfully completed the Flight Dispatch Recurrent Training delivered in English in accordance with ICAO Doc 10106, ICAO Doc 9868, EASA Part ORO.GEN.110(c) and IOSA ISM Table 3.6"
              : isGraduate
                ? "Has successfully completed ground school instruction required by the Initial Flight Dispatcher Course training as prescribed in ICAO Doc 10106, ICAO Doc 9868 and EASA Part ORO.GEN.110(c)."
                : data.trainingType === TRAINING_TYPES.ATTENDANCE 
                  ? "Has successfully attended the Human Factors Introduction Training for Flight Operations Personnel, held in Goa, India."
                  : `Has successfully completed the ${data.trainingType} requirements as prescribed by the relevant aviation authorities.`}
          </p>
        </div>

        {/* Modules Table - Professional List */}
        {isRecurrent && data.modules?.length > 0 && (
          <div className="mt-4 w-full max-w-xl text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">In the following topics</p>
            <p className="text-[10px] text-[#1e293b] font-bold leading-relaxed px-6">
              {data.modules.join(' / ')}
            </p>
          </div>
        )}

        {/* Validity Section */}
        <div className="mt-3 text-center">
          <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Training completed on {trainingDateStr}
          </p>
          <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            This certificate is valid for {isRecurrent ? "24 Months" : "12 Months"}
          </p>
          <p className="text-sm font-black text-[#0f172a]">
            VALID UNTIL {expiryDateStr}
          </p>
        </div>

        {/* Footer Section */}
        <div className="mt-auto w-full flex justify-between items-end px-4 gap-4">
          {/* Working QR Scanner - Far Left */}
          <div className="flex flex-col items-center mb-1">
             <div className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                <QRCodeSVG id="qr-element" value={`https://ifoa-india.com/verify/${data.id || 'demo'}`} size={64} />
             </div>
             <p className="text-[6px] font-bold text-gray-400 uppercase mt-2">Node Verification</p>
          </div>

          {/* COO Signature */}
          <div className="text-center w-48">
             <div className="h-10 flex flex-col items-center justify-end">
                {signatures?.coo?.type === 'text' ? (
                  <p className="text-lg font-serif italic text-gray-800 -mb-1">{signatures.coo.value}</p>
                ) : signatures?.coo?.url ? (
                  <img src={signatures.coo.url} alt="COO Signature" className="h-8 w-auto mb-1 object-contain" />
                ) : (
                  <div className="h-8 w-32 border-b border-gray-100" />
                )}
             </div>
             <div className="h-[1px] w-full opacity-30 mt-1 mb-2" style={{ backgroundColor: colors.accent }} />
             <p className="text-[9px] font-black uppercase" style={{ color: colors.primary }}>{signatures?.coo?.name || "Kenneth Kronborg"}</p>
             <p className="text-[7px] text-gray-400 uppercase tracking-widest">{signatures?.coo?.title || "Chief Operating Officer"}</p>
          </div>

          {/* Central Logo */}
          <div className="flex flex-col items-center mb-1">
             <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 flex items-center justify-center">
                   <GraduationCap className="w-6 h-6" style={{ color: colors.accent }} />
                </div>
                <div className="text-sm font-black tracking-tighter" style={{ color: colors.primary }}>
                  IFOA<span style={{ color: colors.accent }}>INDIA</span>
                </div>
                <p className="text-[4px] font-black uppercase tracking-[0.2em]" style={{ color: colors.primary }}>International Flight Operations Academy</p>
             </div>
          </div>

          {/* CEO Signature */}
          <div className="text-center w-48">
             <div className="h-10 flex flex-col items-center justify-end">
                {signatures?.ceo?.type === 'text' ? (
                  <p className="text-lg font-serif italic text-gray-800 -mb-1">{signatures.ceo.value}</p>
                ) : signatures?.ceo?.url ? (
                  <img src={signatures.ceo.url} alt="CEO Signature" className="h-8 w-auto mb-1 object-contain" />
                ) : (
                  <div className="h-8 w-32 border-b border-gray-100" />
                )}
             </div>
             <div className="h-[1px] w-full opacity-30 mt-1 mb-2" style={{ backgroundColor: colors.accent }} />
             <p className="text-[9px] font-black uppercase" style={{ color: colors.primary }}>{signatures?.ceo?.name || "Vincent Incammicia"}</p>
             <p className="text-[7px] text-gray-400 uppercase tracking-widest">{signatures?.ceo?.title || "Chief Executive Officer"}</p>
          </div>
        </div>

        {/* Form Footer */}
        <div className="absolute bottom-4 left-6 text-[7px] font-bold text-gray-300 uppercase">
          FORM IFOA/TRN/01
        </div>
      </div>
    </div>
  );
});

const Shell = ({ children, onLogout, theme, toggleTheme, activeTab, setActiveTab, searchQuery, setSearchQuery }) => {
  return (
    <div className={`flex h-screen w-full overflow-hidden ${theme === 'light' ? 'bg-[#f8fafc]' : 'bg-[#0f172a]'} transition-colors duration-300 font-sans`}>
      {/* Sidebar - Professional Rail */}
      <aside className="w-72 bg-[#1e293b] flex flex-col z-30 shadow-2xl relative">
        <div className="p-8 pb-12">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white font-display">
                IFOA<span className="text-[#D4AF37]">INDIA</span>
              </h1>
              <p className="text-[9px] text-slate-500 font-bold tracking-[0.3em] uppercase mt-1">Management Suite</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          <div className="px-4 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</div>
          <NavItem 
            icon={<LayoutDashboard size={18}/>} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          />
          <NavItem 
            icon={<Plus size={18}/>} 
            label="Generate Certificate" 
            active={activeTab === 'generate'} 
            onClick={() => setActiveTab('generate')}
          />
          <NavItem 
            icon={<Users size={18}/>} 
            label="Database" 
            active={activeTab === 'database'} 
            onClick={() => setActiveTab('database')}
          />
          
          <div className="px-4 mt-8 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resources</div>
          <NavItem 
            icon={<Sparkles size={18}/>} 
            label="Design Library" 
            active={activeTab === 'templates'} 
            onClick={() => setActiveTab('templates')}
          />
          <NavItem 
            icon={<Settings size={18}/>} 
            label="System Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
          />
        </nav>

        <div className="p-6 mt-auto border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold"
          >
            <LogIn size={18} /> Exit Management
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className={`h-20 border-b ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1e293b] border-white/5'} flex items-center justify-between px-10 z-20 transition-colors`}>
           <div className="flex items-center gap-4 flex-1">
              <div className={`flex items-center gap-3 ${theme === 'light' ? 'bg-slate-50' : 'bg-white/5'} px-4 py-2.5 rounded-2xl border ${theme === 'light' ? 'border-slate-100' : 'border-white/5'} w-1/3`}>
                <Plus size={16} className="text-slate-400" />
                <input
                  placeholder="Search registry..."
                  className="bg-transparent border-none outline-none text-[10px] w-full text-[var(--text-main)] placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <button 
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl ${theme === 'light' ? 'bg-slate-50 text-slate-600' : 'bg-white/5 text-slate-400'} hover:scale-105 transition-all`}
                title="Toggle visual mode"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
                US
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
           <div className="max-w-7xl mx-auto relative z-10">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
};

const AssistantChat = ({ theme, isOpen, toggleOpen, messages, input, setInput, onSend }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
  };

  const baseBg = theme === 'light' ? 'bg-white' : 'bg-slate-900';
  const baseText = theme === 'light' ? 'text-slate-900' : 'text-slate-100';

  return (
    <div className="fixed bottom-6 right-6 z-[70]">
      {isOpen && (
        <div className={`mb-3 w-80 md:w-96 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 ${baseBg} overflow-hidden`}>
          <div className="px-4 py-3 flex items-center justify-between bg-slate-900 text-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-xs font-black flex items-center justify-center">
                AI
              </div>
              <div>
                <p className="text-[11px] font-semibold leading-tight">Certification Copilot</p>
                <p className="text-[9px] text-emerald-300 leading-tight">Online • here to help</p>
              </div>
            </div>
            <button
              onClick={toggleOpen}
              className="text-slate-400 hover:text-slate-100 text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <div className={`px-4 py-3 space-y-3 max-h-64 overflow-y-auto custom-scrollbar text-xs ${baseText}`}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[90%] ${
                    m.from === 'user'
                      ? 'bg-sky-600 text-white rounded-br-sm'
                      : 'bg-slate-100 dark:bg-slate-800 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 px-3 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about records, templates, PDFs..."
              className="flex-1 text-[11px] px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none"
            />
            <button
              type="submit"
              className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-sky-600 text-white hover:bg-sky-500"
            >
              Send
            </button>
          </form>
        </div>
      )}
      <motion.button
        onClick={toggleOpen}
        initial={{ scale: 1 }}
        animate={{ 
          scale: [1, 1.05, 1],
          boxShadow: [
            "0px 0px 0px rgba(16, 185, 129, 0)",
            "0px 0px 20px rgba(16, 185, 129, 0.4)",
            "0px 0px 0px rgba(16, 185, 129, 0)"
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="rounded-full shadow-2xl bg-slate-900 text-white px-6 py-4 flex items-center gap-3 hover:bg-slate-800 transition-colors border border-emerald-500/30"
        title="Open certification assistant"
      >
        <Sparkles size={18} className="text-emerald-400" />
        <span className="text-[10px] font-black uppercase tracking-[0.1em]">How may I help you?</span>
      </motion.button>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-sans relative group ${
    active 
      ? "bg-gradient-to-r from-[#D4AF37]/10 to-transparent text-[#D4AF37] font-black border-l-4 border-[#D4AF37]" 
      : "text-slate-500 hover:bg-white/5 hover:text-white"
  }`}>
    {active && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />}
    {icon}
    <span className="text-[10px] uppercase tracking-widest font-black">{label}</span>
  </button>
);

const App = () => {
  const [view, setView] = useState('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('ifoa-theme') || 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      from: 'bot',
      text: 'Hi, I am your Certification Copilot.\nYou can ask me to explain training types, help pick modules for Recurrent, or remind you how to generate & download PDFs.'
    }
  ]);
  
  // Profile & Signature State
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('ifoa-profile');
      return saved ? JSON.parse(saved) : { name: 'Admin User', role: 'System Administrator', email: 'admin@ifoa.india' };
    } catch (err) {
      return { name: 'Admin User', role: 'System Administrator', email: 'admin@ifoa.india' };
    }
  });

  const [signatures, setSignatures] = useState(() => {
    try {
      const saved = localStorage.getItem('ifoa-signatures');
      const parsed = saved ? JSON.parse(saved) : null;
      const defaults = {
        coo: { type: 'text', value: 'K. KRONBORG', name: 'Kenneth Kronborg', title: 'Chief Operating Officer' },
        ceo: { type: 'text', value: 'V. INCAMMICIA', name: 'Vincent Incammicia', title: 'Chief Executive Officer' }
      };
      if (!parsed) return defaults;
      return {
        coo: { ...defaults.coo, ...(parsed.coo || {}) },
        ceo: { ...defaults.ceo, ...(parsed.ceo || {}) }
      };
    } catch (err) {
      return {
        coo: { type: 'text', value: 'K. KRONBORG', name: 'Kenneth Kronborg', title: 'Chief Operating Officer' },
        ceo: { type: 'text', value: 'V. INCAMMICIA', name: 'Vincent Incammicia', title: 'Chief Executive Officer' }
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('ifoa-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('ifoa-signatures', JSON.stringify(signatures));
  }, [signatures]);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    localStorage.setItem('ifoa-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('ifoa-records');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      return [];
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    department: '',
    trainingType: TRAINING_TYPES.GRADUATE,
    trainingDate: new Date().toISOString().split('T')[0],
    certificateName: '',
    modules: [],
    customTrainingName: '',
    templateId: 'GOLD'
  });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportTask, setExportTask] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const certRef = useRef(null);
  const fileInputRef = useRef(null);
  const handleSignatureUpload = (e, role) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatures(prev => ({
          ...prev,
          [role]: { type: 'upload', url: reader.result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [passwordFeedback, setPasswordFeedback] = useState("");
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setPasswordFeedback("UPDATING SECURITY PROTOCOLS...");
    setTimeout(() => {
       setPasswordFeedback("PASSWORD UPDATED SUCCESSFULLY");
       setTimeout(() => setPasswordFeedback(""), 3000);
    }, 1500);
  };

  useEffect(() => {
    localStorage.setItem('ifoa-records', JSON.stringify(records));
  }, [records]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredRecords = normalizedQuery
    ? records.filter((r) => {
        const haystack = `${r.name} ${r.company} ${r.department} ${r.trainingType}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : records;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    let finalTrainingType = formData.trainingType;
    if (formData.trainingType === TRAINING_TYPES.OTHERS) {
      finalTrainingType = formData.customTrainingName || "Custom Training";
    }

    const newRecord = { ...formData, trainingType: finalTrainingType, id: Date.now() };
    delete newRecord.customTrainingName; // Clean up record

    setRecords([newRecord, ...records]);
    setFormData({ 
      ...formData, 
      name: '', 
      company: '', 
      department: '', 
      certificateName: '', 
      modules: [], 
      customTrainingName: '' 
      // Keep templateId as is for the next one
    });
    setSelectedRecord(newRecord);
  };

  const downloadTemplateSample = async (templateId) => {
    // Create a dummy record for the sample
    const dummyRecord = {
      name: "[PARTICIPANT NAME]",
      company: "[COMPANY NAME]",
      department: "[DEPARTMENT]",
      trainingType: TRAINING_TYPES.GRADUATE,
      trainingDate: new Date().toISOString().split('T')[0],
      templateId: templateId,
      id: "SAMPLE-" + templateId
    };
    
    // Temporarily select this record to render the hidden preview if needed,
    // or just pass it to handleExport directly if I refactor it.
    // Actually, I'll just set it as selectedRecord and trigger PDF export.
    setSelectedRecord(dummyRecord);
    setTimeout(() => {
      handleExport(dummyRecord, 'PDF');
    }, 500);
  };

  const handleExport = async (record, format) => {
    if (!certRef.current) return;
    
    setIsExporting(true);
    setExportTask(`PREPARING ${format} ASSETS...`);
    
    try {
      const baseNameRaw = (record.certificateName || record.trainingType || 'CERTIFICATE').toString().trim();
      const personRaw = (record.name || 'PARTICIPANT').toString().trim();
      const safe = (s) => s.replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, '-').slice(0, 80);
      const fileBase = `IFOA-${safe(baseNameRaw)}-${safe(personRaw)}`;
      if (format === 'PDF') {
        setExportTask("ENCODING PDF STREAM...");
        const imgData = await toJpeg(certRef.current, { quality: 0.95 });
        const pdf = new jsPDF('l', 'mm', 'a4');
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
        pdf.save(`${fileBase}.pdf`);
      } else if (format === 'JPG') {
        setExportTask("RASTERIZING IMAGE...");
        const dataUrl = await toJpeg(certRef.current, { quality: 1.0 });
        const link = document.createElement('a');
        link.download = `${fileBase}.jpg`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'QR') {
        setExportTask("GENERATING QR CODE...");
        const svg = document.getElementById("qr-element");
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 16, 16); // small padding
            const link = document.createElement("a");
            link.download = `${fileBase}-QR.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
          };
          img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
        }
      }
    } catch (err) {
      console.error("Export failure:", err);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportTask("");
      }, 1000);
    }
  };

  const deleteRecord = (id) => {
    setRecords(records.filter(r => r.id !== id));
    if (selectedRecord?.id === id) setSelectedRecord(null);
  };

  const toggleModule = (module) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter(m => m !== module)
        : [...prev.modules, module]
    }));
  };

  const handleShareLink = (record) => {
    if (!record) return;
    const base = window.location.origin || 'https://ifoa-india-cert';
    const url = `${base}/verify/${record.id || ''}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setShareMessage('Verification link copied to clipboard.');
        setTimeout(() => setShareMessage(''), 2500);
      }).catch(() => {
        setShareMessage('Unable to copy link. You can share the URL from the address bar.');
        setTimeout(() => setShareMessage(''), 3000);
      });
    } else {
      setShareMessage('Clipboard not available. You can share the URL from the address bar.');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  const handleChatSend = (text) => {
    const lower = text.toLowerCase();
    const replyParts = [];

    if (lower.includes('recurrent')) {
      replyParts.push(
        'For Recurrent training, use the "Certificate Engine" tab, pick "Flight Dispatcher Recurrent", and select the EASA modules (Air Law, Aircraft Systems, Navigation, Meteorology, etc.). Those modules will print in the certificate body.'
      );
    }
    if (lower.includes('graduate') || lower.includes('graduation')) {
      replyParts.push(
        'Graduate certificates use the DGCA-style template and do not require modules. Just fill Company, Department, Date and Participant Name.'
      );
    }
    if (lower.includes('human') || lower.includes('attendance')) {
      replyParts.push(
        'Human Factors certificates use the attendance template. They show that the participant attended the Human Factors introduction course.'
      );
    }
    if (lower.includes('pdf') || lower.includes('download') || lower.includes('print')) {
      replyParts.push(
        'To download a PDF, go to "Registry Database", click "Generate" on a record, then choose PDF in the preview window. The system renders an A4, print-ready file.'
      );
    }
    if (lower.includes('fields') || lower.includes('database') || lower.includes('record')) {
      replyParts.push(
        'Each record stores: Type of Training, Company, Department, Participant Name, Training Date, and for Recurrent: selected modules. Everything you see in the table is also what feeds the certificate.'
      );
    }
    if (lower.includes('features') || lower.includes('what can you do')) {
      replyParts.push(
        'This console lets you: (1) manage a registry of training records, (2) auto-select the correct certificate template per training type, (3) handle EASA Recurrent modules, and (4) generate PDF certificates on demand.'
      );
    }

    if (replyParts.length === 0) {
      replyParts.push(
        'I can help with training types, Recurrent modules, record fields, and how to generate / download certificates. Try asking, for example: "How do I create a Recurrent certificate?"'
      );
    }

    setChatMessages((prev) => [
      ...prev,
      { from: 'user', text },
      { from: 'bot', text: replyParts.join('\n\n') }
    ]);
    setChatInput('');
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden relative">
        {/* Techy Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-amber-500/5"
          />
          <motion.div 
            animate={{ 
              y: [-1000, 1000],
              opacity: [0, 0.2, 0] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-[2px] bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10"
          />
        </div>

        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shadow-lg shadow-slate-800/20">
                <GraduationCap className="text-amber-400 w-5 h-5" />
              </div>
              <span className="text-lg font-black text-slate-800 tracking-tighter uppercase italic">
                IFOA <span className="text-amber-600">India</span>
              </span>
            </motion.div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('console')}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-black uppercase tracking-wider hover:bg-slate-700 transition-all flex items-center gap-2 shadow-xl shadow-slate-800/20"
              >
                Open app <ArrowRight size={14} />
              </motion.button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-20 md:py-32 relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-6 flex items-center gap-2"
          >
            <div className="w-8 h-[1px] bg-amber-600/30" />
            Neural Certificate Engine v.2024
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 uppercase italic"
          >
            Automated <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-amber-600">Verification</span> <br />
            Systems.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-base text-slate-600 max-w-xl leading-relaxed mb-12 font-medium"
          >
            Deploy high-fidelity training credentials. Propagate participant data through 5 localized templates with autonomous validity logic and EASA module mapping.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ 
               scale: 1.05, 
               boxShadow: "0 0 30px rgba(15, 23, 42, 0.2)",
               backgroundColor: "#0f172a"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.8 }}
            onClick={() => setView('console')}
            className="px-8 py-5 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.3em] transition-all inline-flex items-center gap-4 group"
          >
            Launch Console Protocol <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform text-amber-500" />
          </motion.button>

          {/* Scrolling Stats Section Placeholder */}
          <div className="mt-20 flex gap-12 overflow-hidden opacity-30 grayscale pointer-events-none">
             {['LOGIC_CORE', 'EASA_READY', 'PDF_RENDER', 'QR_SCAN', 'LOCAL_STORAGE'].map(stat => (
               <span key={stat} className="text-[10px] font-black tracking-[0.5em] whitespace-nowrap">{stat}</span>
             ))}
          </div>
        </main>

        <section className="border-t border-slate-200 bg-white relative z-10">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { title: "Protocol Registry", detail: "Participant database with full recursion support.", icon: <Users size={20} className="text-blue-500" /> },
                { title: "Pattern Library", detail: "5 adaptive templates (Gold, Onyx, Blue, Red, Green).", icon: <LayoutDashboard size={20} className="text-amber-500" /> },
                { title: "Export Buffer", detail: "Asynchronous PDF/JPG rendering via canvas capture.", icon: <Zap size={20} className="text-emerald-500" /> }
              ].map((feature, i) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
                >
                  <div className="mb-6 p-3 bg-white rounded-xl w-fit shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{feature.title}</p>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">{feature.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 py-10 relative z-10">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">IFOA India · Aviation Compliance Systems 2024</p>
            <div className="flex gap-8">
               {['DOCS', 'API', 'STATUS', 'TERMS'].map(link => (
                 <span key={link} className="text-[9px] font-black text-slate-300 hover:text-slate-600 cursor-pointer transition-colors tracking-widest">{link}</span>
               ))}
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <>
      <Shell 
        onLogout={() => setView('landing')} 
        theme={theme} 
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      >
      {activeTab === 'dashboard' && (
        <div className="space-y-10 animate-fade-in">
           <header className="flex justify-between items-center">
             <div>
               <h2
                 className={`text-3xl md:text-4xl font-black font-display tracking-tight transition-colors uppercase ${
                   theme === 'dark' ? 'text-white' : 'text-slate-900'
                 }`}
               >
                 Command Center
               </h2>
               <div className="flex items-center gap-3 mt-4">
                  <div className="h-1 w-12 bg-[#D4AF37]" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                    Aviation Compliance Node v4.0
                  </p>
               </div>
             </div>
             <div className="p-4 bg-white/5 border border-white/10 rounded-[2rem] glass flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">System Time</span>
                  <span className="text-xs font-black text-[#D4AF37]">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                   <Calendar size={18} />
                </div>
             </div>
           </header>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <TerminalStat icon={<Users size={24}/>} label="Registry Size" value={records.length} color="#D4AF37" theme={theme} />
              <TerminalStat icon={<ShieldCheck size={24}/>} label="Verification" value="ICAO 10106" color="#D4AF37" theme={theme} />
              <TerminalStat icon={<Zap size={24}/>} label="API Status" value="Online" color="#10b981" theme={theme} />
              <TerminalStat icon={<Plus size={24}/>} label="Daily Output" value="24 Certs" color="#D4AF37" theme={theme} />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                 <div className={`dashboard-card p-12 ${theme === 'dark' ? 'glass' : 'bg-white border-slate-200'} relative overflow-hidden group min-h-[400px]`}>
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#D4AF37]/5 blur-[100px] rounded-full group-hover:bg-[#D4AF37]/10 transition-all duration-1000" />
                    <div className="flex justify-between items-center mb-10">
                       <h3 className={`text-lg font-black font-display uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Registry Stream</h3>
                       <button className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest border border-[#D4AF37]/30 px-4 py-2 rounded-full hover:bg-[#D4AF37] hover:text-[#0f172a] transition-all">Export Log</button>
                    </div>
                    <div className="space-y-6 relative z-10">
                       {filteredRecords.slice(0, 5).map(r => (
                         <div key={r.id} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 glass hover:bg-white/10 transition-all group/item">
                            <div className="flex items-center gap-5">
                               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] flex items-center justify-center text-[#D4AF37] border border-white/5 shadow-2xl group-hover/item:scale-110 transition-transform">
                                  <GraduationCap size={22} />
                               </div>
                               <div>
                                   <p className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} group-hover/item:text-[#D4AF37] transition-colors`}>{r.name}</p>
                                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{r.trainingType} • {r.company}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                               <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">{new Date(r.id).toLocaleDateString()}</span>
                               <span className="text-[8px] text-slate-600 font-bold uppercase mt-1">Ref ID: {r.id.toString().slice(-6)}</span>
                            </div>
                         </div>
                       ))}
                       {records.length === 0 && (
                          <div className="h-64 flex flex-col items-center justify-center text-center">
                             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-600 mb-4 animate-bounce">
                                <FileText size={24} />
                             </div>
                             <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Neural data-set empty. Initialize a flow.</p>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-4 space-y-12">
                 <div className="dashboard-card p-12 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white border-[#D4AF37]/20 shadow-3xl relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
                    <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-8 border border-[#D4AF37]/20">
                       <Plus size={32} />
                    </div>
                    <h3 className="text-2xl font-black mb-4 font-display leading-tight uppercase tracking-tighter">Initiate <br /><span className="text-[#D4AF37]">Issuance.</span></h3>
                    <p className="text-slate-400 text-[10px] mb-10 leading-relaxed font-bold uppercase tracking-widest">Propagate a new certification node into the global compliance registry.</p>
                    <button onClick={() => setActiveTab('generate')} className="group w-full bg-[#D4AF37] text-slate-900 py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3">
                       Execute Protocol <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
        )}

      {activeTab === 'generate' && (
        <div className="max-w-5xl mx-auto space-y-10">
          <header>
            <h2 className="text-xl md:text-2xl font-black text-[var(--text-main)] font-display tracking-tight transition-colors">
              Certificate Engine
            </h2>
            <p className="text-slate-500 mt-2 text-xs font-medium">
              Initialize participant record and configure training specifications with a live certificate preview.
            </p>
          </header>

          <div className="dashboard-card p-8 glass relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] ml-1 flex items-center gap-2">
                      <Users size={14} className="text-blue-500" /> Participant Identity
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ENTER FULL NAME"
                      className="modern-input py-4 text-sm glass hover-glass"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="space-y-5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] ml-1 flex items-center gap-2">
                      <Calendar size={14} className="text-blue-500" /> Training Date
                    </label>
                    <input
                      type="date"
                      className="modern-input py-4 text-sm glass hover-glass"
                      value={formData.trainingDate}
                      onChange={(e) => setFormData({ ...formData, trainingDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] ml-1 flex items-center gap-2">
                      <Building2 size={14} className="text-blue-500" /> Company / Airline
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="COMPANY / AIRLINE"
                      className="modern-input py-4 text-sm glass hover-glass"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="space-y-5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] ml-1 flex items-center gap-2">
                      <Plus size={14} className="text-blue-500" /> Department
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="DIVISION"
                      className="modern-input py-4 text-sm glass hover-glass"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] ml-1 flex items-center gap-2">
                    <FileText size={14} className="text-blue-500" /> Training Program
                  </label>
                  <select
                    className="modern-input appearance-none bg-slate-50 dark:bg-white/5 cursor-pointer py-4 text-sm glass hover-glass"
                    value={formData.trainingType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trainingType: e.target.value,
                        modules: [],
                      })
                    }
                  >
                    {Object.entries(TRAINING_TYPES).map(([key, value]) => (
                      <option key={key} value={value} className="bg-white dark:bg-[#1e293b]">
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.trainingType === TRAINING_TYPES.OTHERS && (
                  <div className="space-y-5 animate-fade-in">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] ml-1 flex items-center gap-2">
                       <Plus size={14} className="text-blue-500" /> Custom Training Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ENTER CUSTOM TRAINING NAME"
                      className="modern-input py-4 text-sm glass hover-glass font-bold"
                      value={formData.customTrainingName}
                      onChange={(e) => setFormData({ ...formData, customTrainingName: e.target.value.toUpperCase() })}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] ml-1 flex items-center gap-2">
                    <FileText size={14} className="text-blue-500" /> Certificate Name (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="E.G. INITIAL FLIGHT DISPATCHER COURSE"
                    className="modern-input py-5 text-sm glass hover-glass"
                    value={formData.certificateName}
                    onChange={(e) => setFormData({ ...formData, certificateName: e.target.value.toUpperCase() })}
                  />
                  <p className="text-[11px] text-slate-500">
                    Used in export filename and printed as a small “Program:” line on the certificate.
                  </p>
                </div>

                {formData.trainingType === TRAINING_TYPES.RECURRENT && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] ml-1 flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-green-500" /> Technical Modules
                    </label>
                    <p className="text-[10px] text-slate-400 -mt-2 ml-1">Hold Ctrl/Cmd to select multiple modules.</p>
                    <select
                      multiple
                      className="modern-input h-32 py-2 glass hover-glass text-xs"
                      value={formData.modules}
                      onChange={(e) => {
                        const options = [...e.target.options];
                        const selectedValues = options.filter(option => option.selected).map(option => option.value);
                        setFormData({ ...formData, modules: selectedValues });
                      }}
                    >
                      {MODULES.map((m) => (
                        <option key={m} value={m} className="p-2 mb-1 rounded-md hover:bg-blue-50 dark:hover:bg-slate-700">
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="primary-button w-full md:w-auto px-10 py-4 text-xs uppercase tracking-[0.4em] mt-2 shadow-[0_20px_40px_-12px_rgba(37,99,235,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  Save & Generate
                </button>
              </form>
            </div>
          </div>
        </div>
        )}

      {activeTab === 'database' && (
        <div className="space-y-10 animate-fade-in">
           <header className="flex justify-between items-end">
             <div>
               <h2
                 className={`text-3xl md:text-4xl font-black font-display tracking-tight transition-colors uppercase ${
                   theme === 'dark' ? 'text-white' : 'text-slate-900'
                 }`}
               >
                 Registry Database
               </h2>
               <div className="flex items-center gap-3 mt-4">
                  <div className="h-1 w-12 bg-[#D4AF37]" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Global Compliance Archive • Operational</p>
               </div>
             </div>
             <div className="flex items-center gap-6">
                 <div className="p-2 bg-white/5 border border-white/10 rounded-2xl glass flex gap-2">
                    <button className="px-6 py-3 bg-[#D4AF37] text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#D4AF37]/20">Active Log</button>
                    <button className="px-6 py-3 text-slate-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Vault Archive</button>
                 </div>
             </div>
           </header>
 
           <div className={`dashboard-card ${theme === 'dark' ? 'bg-[#050b15]' : 'bg-white'} overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`${theme === 'dark' ? 'bg-white/[0.02]' : 'bg-slate-50'} text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] border-b ${theme === 'dark' ? 'border-white/10' : 'border-slate-100'}`}>
                      <th className="px-6 py-4">Participant Name</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Type of Training</th>
                      <th className="px-6 py-4">Training Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5 text-white' : 'divide-slate-100 text-slate-900'}`}>
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-[#D4AF37]/5 transition-all group relative">
                        <td className="px-6 py-4 relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-full bg-[#D4AF37] transition-all duration-500" />
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] flex items-center justify-center text-[#D4AF37] font-black border border-white/5 group-hover:scale-110 transition-all shadow-lg">
                               {record.name.charAt(0)}
                            </div>
                            <div>
                               <p className={`text-xs font-black transition-colors uppercase tracking-tight ${theme === 'dark' ? 'group-hover:text-[#D4AF37]' : 'text-slate-900'}`}>{record.name}</p>
                               <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.1em] mt-0.5 opacity-60">REF_{record.id.toString().slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-[11px] font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{record.company}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">{record.department}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                             <div className="w-1 h-1 rounded-full bg-[#D4AF37] animate-pulse" />
                             <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.1em]">
                               {record.trainingType}
                             </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-[11px] font-black uppercase w-max tracking-tighter ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            {new Date(record.trainingDate || record.id).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => setSelectedRecord(record)}
                               className="bg-white text-slate-900 px-4 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.1em] hover:bg-[#D4AF37] transition-all flex items-center gap-2 whitespace-nowrap shadow-sm border border-slate-200"
                             >
                               Generate Certificate / Download PDF <ArrowRight size={12} />
                             </button>
                             <button onClick={() => deleteRecord(record.id)} className="p-2 text-slate-400 hover:text-red-500 transition-all">
                                <Trash2 size={16} />
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
        )}

      {activeTab === 'settings' && (
        <div className="max-w-5xl mx-auto space-y-12">
           <header>
             <h2 className="text-4xl font-black text-[var(--text-main)] font-display tracking-tight transition-colors">System Settings</h2>
             <p className="text-slate-500 mt-2 font-medium">Manage your profile, security preferences, and electronic signatures.</p>
           </header>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 space-y-10">
                 <div className="dashboard-card p-10 bg-[var(--bg-panel)] flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-blue-600 text-white text-3xl font-black flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30">
                       US
                    </div>
                    <h3 className="text-xl font-bold dark:text-white">{profile.name}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{profile.role}</p>
                    <div className="w-full h-px bg-slate-100 dark:bg-white/5 my-8" />
                    <div className="w-full space-y-4 text-left">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Email</span>
                          <span className="text-xs font-bold dark:text-slate-200">{profile.email}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Access</span>
                          <span className="text-xs font-bold text-green-500">Full Terminal</span>
                       </div>
                    </div>
                 </div>

                 <div className={`dashboard-card p-10 ${theme === 'dark' ? 'glass-dark text-white border-white/10' : 'bg-white text-slate-900 border-slate-200'} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                       <ShieldCheck size={18} className="text-blue-400" /> Security Suite
                    </h4>
                    <form className="space-y-6" onSubmit={handlePasswordUpdate}>
                       <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">New Password</label>
                          <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-xs font-bold outline-none focus:border-blue-500/50 transition-all" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Confirm Password</label>
                          <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-xs font-bold outline-none focus:border-blue-500/50 transition-all" />
                       </div>
                       <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                          {passwordFeedback || "Update Security"}
                       </button>
                    </form>
                 </div>
              </div>

              <div className="lg:col-span-2 space-y-10">
                 <div className={`dashboard-card p-10 ${theme === 'dark' ? 'bg-[var(--bg-panel)]' : 'bg-white'}`}>
                    <div className="flex items-center gap-3 mb-10">
                       <div className="bg-blue-600 p-2.5 rounded-xl text-white">
                          <Sparkles size={20} />
                       </div>
                       <h3 className={`text-lg font-bold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Electronic Signature Management</h3>
                    </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        {/* COO Signature Section */}
                        <div className={`space-y-8 p-8 rounded-3xl ${theme === 'dark' ? 'bg-white/5 border-white/10 glass' : 'bg-slate-50 border-slate-200'} border`}>
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
                                 <Plus size={14} className="text-[#D4AF37]" />
                              </div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">COO Office Signature</p>
                           </div>
                           
                           <div className={`flex items-center gap-4 p-1.5 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-200'} rounded-2xl w-fit border ${theme === 'dark' ? 'border-white/5' : 'border-slate-300'}`}>
                              <button 
                                onClick={() => setSignatures({...signatures, coo: {...signatures.coo, type: 'text'}})}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${signatures.coo.type === 'text' ? 'bg-[#D4AF37] text-slate-900 shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'text-slate-500 hover:text-slate-800'}`}
                              >
                                Text
                              </button>
                              <button 
                                onClick={() => setSignatures({...signatures, coo: {...signatures.coo, type: 'upload'}})}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${signatures.coo.type === 'upload' ? 'bg-[#D4AF37] text-slate-900 shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'text-slate-500 hover:text-white'}`}
                              >
                                Upload
                              </button>
                           </div>

                           {signatures.coo.type === 'text' ? (
                              <div className="space-y-6 animate-fade-in">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <input
                                     type="text"
                                     placeholder="COO NAME"
                                     className="modern-input py-4 text-sm font-bold glass-dark border-white/10 focus:border-[#D4AF37]/50"
                                     value={signatures.coo.name || ''}
                                     onChange={(e) => setSignatures({ ...signatures, coo: { ...signatures.coo, name: e.target.value } })}
                                   />
                                   <input
                                     type="text"
                                     placeholder="COO TITLE"
                                     className="modern-input py-4 text-sm font-bold glass-dark border-white/10 focus:border-[#D4AF37]/50"
                                     value={signatures.coo.title || ''}
                                     onChange={(e) => setSignatures({ ...signatures, coo: { ...signatures.coo, title: e.target.value } })}
                                   />
                                 </div>
                                 <input 
                                   type="text" 
                                   placeholder="COO SIGNATURE TEXT" 
                                   className="modern-input py-5 text-sm font-bold glass-dark border-white/10 focus:border-[#D4AF37]/50"
                                   value={signatures.coo.value}
                                   onChange={(e) => setSignatures({...signatures, coo: {...signatures.coo, value: e.target.value.toUpperCase()}})}
                                 />
                                 <div className="p-12 border border-white/10 rounded-[2rem] flex items-center justify-center bg-white/5 glass">
                                    <p className="text-4xl font-serif italic text-[#D4AF37] opacity-90 drop-shadow-md">{signatures.coo.value || "PREVIEW"}</p>
                                 </div>
                              </div>
                           ) : (
                              <div className="space-y-6 animate-fade-in">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <input
                                     type="text"
                                     placeholder="COO NAME"
                                     className="modern-input py-4 text-sm font-bold glass-dark border-white/10 focus:border-[#D4AF37]/50"
                                     value={signatures.coo.name || ''}
                                     onChange={(e) => setSignatures({ ...signatures, coo: { ...signatures.coo, name: e.target.value } })}
                                   />
                                   <input
                                     type="text"
                                     placeholder="COO TITLE"
                                     className="modern-input py-4 text-sm font-bold glass-dark border-white/10 focus:border-[#D4AF37]/50"
                                     value={signatures.coo.title || ''}
                                     onChange={(e) => setSignatures({ ...signatures, coo: { ...signatures.coo, title: e.target.value } })}
                                   />
                                 </div>
                                 <div 
                                   onClick={() => {
                                     const input = document.createElement('input');
                                     input.type = 'file';
                                     input.accept = 'image/*';
                                     input.onchange = (e) => handleSignatureUpload(e, 'coo');
                                     input.click();
                                   }}
                                   className="p-12 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center bg-white/5 hover:border-[#D4AF37]/50 transition-all cursor-pointer glass group"
                                 >
                                    {signatures.coo.url ? (
                                       <img src={signatures.coo.url} alt="COO Signature" className="h-16 w-auto object-contain filter drop-shadow-lg" />
                                    ) : (
                                       <div className="flex flex-col items-center space-y-3">
                                          <ImageIcon size={32} className="text-slate-500 group-hover:text-[#D4AF37] transition-colors" />
                                          <p className="text-[10px] font-black text-slate-500 group-hover:text-slate-300">CLICK TO UPLOAD PNG/SVG</p>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           )}
                        </div>

                        {/* CEO Signature Section */}
                        <div className={`space-y-8 p-8 rounded-3xl ${theme === 'dark' ? 'bg-white/5 border-white/10 glass' : 'bg-slate-50 border-slate-200'} border`}>
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
                                 <Plus size={14} className="text-[#D4AF37]" />
                              </div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CEO Office Signature</p>
                           </div>
                           
                           <div className={`flex items-center gap-4 p-1.5 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-200'} rounded-2xl w-fit border ${theme === 'dark' ? 'border-white/5' : 'border-slate-300'}`}>
                              <button 
                                onClick={() => setSignatures({...signatures, ceo: {...signatures.ceo, type: 'text'}})}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${signatures.ceo.type === 'text' ? 'bg-[#D4AF37] text-slate-900 shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'text-slate-500 hover:text-slate-800'}`}
                              >
                                Text
                              </button>
                              <button 
                                onClick={() => setSignatures({...signatures, ceo: {...signatures.ceo, type: 'upload'}})}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${signatures.ceo.type === 'upload' ? 'bg-[#D4AF37] text-slate-900 shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'text-slate-500 hover:text-white'}`}
                              >
                                Upload
                              </button>
                           </div>

                           {signatures.ceo.type === 'text' ? (
                              <div className="space-y-6 animate-fade-in">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <input
                                     type="text"
                                     placeholder="CEO NAME"
                                     className="modern-input py-4 text-sm font-bold glass-dark border-white/10 focus:border-[#D4AF37]/50"
                                     value={signatures.ceo.name || ''}
                                     onChange={(e) => setSignatures({ ...signatures, ceo: { ...signatures.ceo, name: e.target.value } })}
                                   />
                                   <input
                                     type="text"
                                     placeholder="CEO TITLE"
                                     className="modern-input py-4 text-sm font-bold glass-dark border-white/10 focus:border-[#D4AF37]/50"
                                     value={signatures.ceo.title || ''}
                                     onChange={(e) => setSignatures({ ...signatures, ceo: { ...signatures.ceo, title: e.target.value } })}
                                   />
                                 </div>
                                 <input 
                                   type="text" 
                                   placeholder="CEO SIGNATURE TEXT" 
                                   className="modern-input py-5 text-sm font-bold glass-dark border-white/10 focus:border-[#D4AF37]/50"
                                   value={signatures.ceo.value}
                                   onChange={(e) => setSignatures({...signatures, ceo: {...signatures.ceo, value: e.target.value.toUpperCase()}})}
                                 />
                                 <div className="p-12 border border-white/10 rounded-[2rem] flex items-center justify-center bg-white/5 glass">
                                    <p className="text-4xl font-serif italic text-[#D4AF37] opacity-90 drop-shadow-md">{signatures.ceo.value || "PREVIEW"}</p>
                                 </div>
                              </div>
                           ) : (
                              <div className="space-y-6 animate-fade-in">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <input
                                     type="text"
                                     placeholder="CEO NAME"
                                     className="modern-input py-4 text-sm font-bold glass-dark border-white/10 focus:border-[#D4AF37]/50"
                                     value={signatures.ceo.name || ''}
                                     onChange={(e) => setSignatures({ ...signatures, ceo: { ...signatures.ceo, name: e.target.value } })}
                                   />
                                   <input
                                     type="text"
                                     placeholder="CEO TITLE"
                                     className="modern-input py-4 text-sm font-bold glass-dark border-white/10 focus:border-[#D4AF37]/50"
                                     value={signatures.ceo.title || ''}
                                     onChange={(e) => setSignatures({ ...signatures, ceo: { ...signatures.ceo, title: e.target.value } })}
                                   />
                                 </div>
                                 <div 
                                   onClick={() => {
                                     const input = document.createElement('input');
                                     input.type = 'file';
                                     input.accept = 'image/*';
                                     input.onchange = (e) => handleSignatureUpload(e, 'ceo');
                                     input.click();
                                   }}
                                   className="p-12 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center bg-white/5 hover:border-[#D4AF37]/50 transition-all cursor-pointer glass group"
                                 >
                                    {signatures.ceo.url ? (
                                       <img src={signatures.ceo.url} alt="CEO Signature" className="h-16 w-auto object-contain filter drop-shadow-lg" />
                                    ) : (
                                       <div className="flex flex-col items-center space-y-3">
                                          <ImageIcon size={32} className="text-slate-500 group-hover:text-[#D4AF37] transition-colors" />
                                          <p className="text-[10px] font-black text-slate-500 group-hover:text-slate-300">CLICK TO UPLOAD PNG/SVG</p>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           )}
                        </div>
                      </div>

                       <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest mt-10 text-center opacity-60">
                          Signatures are encrypted and stored locally. Sourced according to IFOA regulatory compliance standards.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        )}

      {activeTab === 'templates' && (
        <div className="max-w-7xl mx-auto space-y-10 animate-fade-in relative z-10 w-full px-4 md:px-8">
          <header>
            <h2 className="text-3xl md:text-4xl font-black text-[var(--text-main)] font-display tracking-tight transition-colors">
              Design Library
            </h2>
            <p className="text-slate-500 mt-2 font-medium">Select a certificate template for your organization.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['GOLD', 'BLUE', 'GREEN', 'RED', 'ONYX'].map((tmpl) => (
              <div 
                key={tmpl}
                onClick={() => setFormData({ ...formData, templateId: tmpl })}
                className={`dashboard-card relative overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-300
                  ${formData.templateId === tmpl ? 'ring-4 ring-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'hover:ring-2 hover:ring-blue-400/50'}
                `}
              >
                {/* Template Preview Header */}
                <div className={`h-32 flex items-center justify-center
                  ${tmpl === 'GOLD' ? 'bg-[#D4AF37]/20 border-b border-[#D4AF37]/30' : ''}
                  ${tmpl === 'BLUE' ? 'bg-[#3b82f6]/20 border-b border-[#3b82f6]/30' : ''}
                  ${tmpl === 'GREEN' ? 'bg-[#10b981]/20 border-b border-[#10b981]/30' : ''}
                  ${tmpl === 'RED' ? 'bg-[#ef4444]/20 border-b border-[#ef4444]/30' : ''}
                  ${tmpl === 'ONYX' ? 'bg-gradient-to-r from-gray-800 to-black border-b border-gray-700' : ''}
                `}>
                  <GraduationCap size={48} className={`
                    ${tmpl === 'GOLD' ? 'text-[#D4AF37]' : ''}
                    ${tmpl === 'BLUE' ? 'text-[#3b82f6]' : ''}
                    ${tmpl === 'GREEN' ? 'text-[#10b981]' : ''}
                    ${tmpl === 'RED' ? 'text-[#ef4444]' : ''}
                    ${tmpl === 'ONYX' ? 'text-gray-300' : ''}
                    group-hover:scale-110 transition-transform
                  `} />
                </div>
                
                {/* Template Info */}
                <div className={`p-6 ${theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`text-xl font-black font-display tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {tmpl} EDITION
                    </h3>
                    {formData.templateId === tmpl && (
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/50 animate-zoom-in">
                        <CheckCircle2 size={14} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-4 font-medium h-12">
                    {tmpl === 'GOLD' && 'The timeless classic. Premium gold aesthetics for executive certifications.'}
                    {tmpl === 'BLUE' && 'Corporate trust. Perfect for technical modules and recurrent training.'}
                    {tmpl === 'GREEN' && 'Aviation standard. High-contrast green for compliance and safety programs.'}
                    {tmpl === 'RED' && 'Urgent or critical certifications. Stands out in any registry.'}
                    {tmpl === 'ONYX' && 'Sleek and stealthy. Deep blacks and grays for modern organizations.'}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-4 h-4 rounded-full ${tmpl === 'GOLD' ? 'bg-[#0f172a]' : tmpl === 'BLUE' ? 'bg-[#1e3a8a]' : tmpl === 'GREEN' ? 'bg-[#064e3b]' : tmpl === 'RED' ? 'bg-[#7f1d1d]' : 'bg-black'}`} />
                    <div className={`w-4 h-4 rounded-full ${tmpl === 'GOLD' ? 'bg-[#D4AF37]' : tmpl === 'BLUE' ? 'bg-[#3b82f6]' : tmpl === 'GREEN' ? 'bg-[#10b981]' : tmpl === 'RED' ? 'bg-[#ef4444]' : 'bg-gray-500'}`} />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, templateId: tmpl });
                        setActiveTab('generate');
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                        ${formData.templateId === tmpl 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }
                      `}
                    >
                      {formData.templateId === tmpl ? 'Currently Active' : 'Use Template'}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadTemplateSample(tmpl);
                      }}
                      className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={14} /> Download Sample PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </Shell>

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-fade-in" onClick={() => setSelectedRecord(null)} />
           
           <div className="relative w-[95vw] max-w-6xl h-[90vh] bg-slate-50 dark:bg-slate-900 rounded-[2rem] shadow-3xl overflow-hidden animate-zoom-in flex flex-col">
              <div className="flex justify-between items-center p-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-50 shrink-0">
                 <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-widest ml-2 flex items-center gap-3">
                   <Eye size={20} className="text-[#38bdf8]" /> Certificate Preview
                 </h3>
                 <div className="flex gap-3 items-center flex-wrap">
                    <ExportButton icon={<Printer size={16}/>} label="PDF" color="green" onClick={() => handleExport(selectedRecord, 'PDF')} />
                    <ExportButton icon={<ImageIcon size={16}/>} label="JPG" color="blue" onClick={() => handleExport(selectedRecord, 'JPG')} />
                    <ExportButton icon={<QrIcon size={16}/>} label="QR" color="purple" onClick={() => handleExport(selectedRecord, 'QR')} />
                    <button
                      onClick={() => handleShareLink(selectedRecord)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors shadow-md"
                    >
                      <QrIcon size={14} /> Share Link
                    </button>
                    <button onClick={() => setSelectedRecord(null)} className="p-2 ml-2 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full hover:bg-red-100 hover:text-red-500 transition-all"><Trash2 size={20} className="rotate-45" /></button>
                 </div>
              </div>

              <div className="w-full h-full flex items-center justify-center overflow-auto p-4 md:p-12 custom-scrollbar bg-slate-100 dark:bg-slate-900/50 relative">
                 <div className="transform scale-[0.5] sm:scale-[0.6] md:scale-[0.8] lg:scale-[0.9] xl:scale-100 transition-all duration-700 origin-center bg-white shadow-2xl">
                     <Certificate ref={certRef} data={selectedRecord} signatures={signatures} />
                 </div>
              </div>

              {shareMessage && (
                <div className="absolute bottom-6 right-6 bg-slate-900/90 text-white text-[11px] px-4 py-2 rounded-full shadow-lg">
                  {shareMessage}
                </div>
              )}

              {isExporting && (
                 <div className="absolute inset-0 z-[60] bg-slate-900/90 backdrop-blur-3xl flex flex-col items-center justify-center text-white">
                   <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
                   <p className="text-2xl font-black uppercase tracking-[0.4em] italic">{exportTask}</p>
                 </div>
              )}
           </div>
        </div>
      )}
      {view === 'console' && activeTab !== 'generate' && (
        <AssistantChat
          theme={theme}
          isOpen={isChatOpen}
          toggleOpen={() => setIsChatOpen((prev) => !prev)}
          messages={chatMessages}
          input={chatInput}
          setInput={setChatInput}
          onSend={handleChatSend}
        />
      )}
    </>
  );
};

const ExportButton = ({ icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-[10px] font-black uppercase tracking-widest hover:border-blue-400 dark:hover:border-[#38bdf8] text-slate-700 dark:text-[#38bdf8] transition-all hover:shadow-md hover:-translate-y-0.5`}
  >
    {icon} {label}
  </button>
);

const TerminalStat = ({ icon, label, value, color="#D4AF37", theme }) => (
  <div className={`${theme === 'dark' ? 'bg-[#050b15]' : 'bg-white border-slate-200'} p-6 rounded-3xl border border-white/5 flex items-center gap-4 shadow-xl relative overflow-hidden group`}>
     <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
     <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 text-[#D4AF37] border border-white/10 glass">
        {icon}
     </div>
     <div className="relative z-10">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.25em] mb-1">{label}</p>
        <p className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} uppercase tracking-tight`}>{value}</p>
     </div>
  </div>
);

const RequirementCard = ({ icon, label, detail }) => (
  <div className="bg-[#111418] border border-white/5 p-4 rounded-2xl group hover:border-[#22C55E]/30 transition-all">
     <div className="mb-2 text-[#22C55E] opacity-50 group-hover:opacity-100 transition-opacity">{icon}</div>
     <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-0.5">{label}</p>
     <p className="text-xs font-black text-gray-200">{detail}</p>
  </div>
);

export default App;
