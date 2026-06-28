import { 
  FileCode, 
  ArrowRight, 
  Clock, 
  Cpu, 
  Database, 
  CheckCircle, 
  Settings, 
  Star,
  Search,
  Plus,
  Compass,
  ShoppingBag,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Sliders,
  DollarSign
} from "lucide-react";
import { useState } from "react";

interface TemplatesViewProps {
  onLoadTemplate: (templateId: string) => void;
}

export default function TemplatesView({ onLoadTemplate }: TemplatesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "HR & Hiring",
    "Finance",
    "Productivity",
    "Customer Service",
    "DevOps"
  ];

  const templatesList = [
    {
      id: "resume_tracker",
      title: "Resume Tracker",
      desc: "Ingest applicant resumes, extract skills & experience with Gemini AI, and track their application progress automatically.",
      difficulty: "Beginner",
      nodesCount: 4,
      tokensEst: "1.2K / run",
      costEst: "$0.003",
      latencyEst: "0.8s",
      category: "HR & Hiring",
      rating: 4.9,
      downloads: "12.4k",
      author: "FlowForge HR",
      features: ["PDF Parsing", "Skills Extraction", "Applicant Sorting", "Gmail Sync"],
    },
    {
      id: "internship_finder",
      title: "Internship Finder",
      desc: "Scan inbound internship requests, classify student qualifications, and coordinate review procedures.",
      difficulty: "Intermediate",
      nodesCount: 5,
      tokensEst: "2.5K / run",
      costEst: "$0.007",
      latencyEst: "1.5s",
      category: "HR & Hiring",
      rating: 4.8,
      downloads: "8.5k",
      author: "FlowForge HR",
      features: ["Gmail Filtering", "Gemini Evaluator", "Slack Notifications", "Sheets Logging"],
    },
    {
      id: "invoice_extractor",
      title: "Invoice Extractor",
      desc: "Automatically parse invoice PDF files uploaded to Google Drive, extract billing figures, and sync to records.",
      difficulty: "Intermediate",
      nodesCount: 5,
      tokensEst: "3.2K / run",
      costEst: "$0.010",
      latencyEst: "2.1s",
      category: "Finance",
      rating: 4.9,
      downloads: "15.8k",
      author: "Finance Labs",
      features: ["Google Drive Trigger", "PDF Ingestion", "AI Value Extraction", "Finance CRM"],
    },
    {
      id: "meeting_summarizer",
      title: "Meeting Summarizer",
      desc: "Sync transcripts from Calendar sessions, structure action items, and compile executive minutes.",
      difficulty: "Advanced",
      nodesCount: 7,
      tokensEst: "8.4K / run",
      costEst: "$0.025",
      latencyEst: "4.5s",
      category: "Productivity",
      rating: 5.0,
      downloads: "24.1k",
      author: "FlowForge Core",
      features: ["Calendar Webhook", "Context Assembly", "Gemini Pro Notes", "Human Approval"],
    },
    {
      id: "youtube_notes",
      title: "YouTube Notes",
      desc: "Extract video subtitles, summarize core themes and timestamps, and save study guides.",
      difficulty: "Beginner",
      nodesCount: 4,
      tokensEst: "2.0K / run",
      costEst: "$0.006",
      latencyEst: "1.1s",
      category: "Productivity",
      rating: 4.7,
      downloads: "18.2k",
      author: "StudyHelper AI",
      features: ["Transcript Fetch", "Bullet Point Summary", "Key Timestamps", "Notion Export"],
    },
    {
      id: "pdf_translator",
      title: "PDF Translator",
      desc: "Translate document files into multiple languages while preserving professional context and terminology.",
      difficulty: "Beginner",
      nodesCount: 4,
      tokensEst: "4.5K / run",
      costEst: "$0.013",
      latencyEst: "2.3s",
      category: "Productivity",
      rating: 4.8,
      downloads: "9.9k",
      author: "GlobeTranslate",
      features: ["Document Upload", "Contextual Translation", "Preserve Layout", "Google Drive Sync"],
    },
    {
      id: "customer_support_agent",
      title: "Customer Support Agent",
      desc: "Connect inbound queries with knowledge bases to generate custom replies with automated drafts.",
      difficulty: "Advanced",
      nodesCount: 6,
      tokensEst: "5.1K / run",
      costEst: "$0.015",
      latencyEst: "3.2s",
      category: "Customer Service",
      rating: 4.9,
      downloads: "21.5k",
      author: "FlowForge Support",
      features: ["Mail Listener", "Knowledge Retrieval", "Draft Generation", "Agent Oversight"],
    },
    {
      id: "github_release_notifier",
      title: "GitHub Release Notifier",
      desc: "Detect code releases and pull request events, generate release logs, and notify team channels.",
      difficulty: "Intermediate",
      nodesCount: 5,
      tokensEst: "2.8K / run",
      costEst: "$0.008",
      latencyEst: "1.2s",
      category: "DevOps",
      rating: 4.7,
      downloads: "6.3k",
      author: "DevOps Tools",
      features: ["GitHub Webhook", "AI Release Logger", "Discord Webhook", "Slack Broadcast"],
    },
    {
      id: "expense_tracker",
      title: "Expense Tracker",
      desc: "Parse daily purchase receipt emails, extract financial categories & costs, and log spreadsheet rows.",
      difficulty: "Intermediate",
      nodesCount: 5,
      tokensEst: "2.1K / run",
      costEst: "$0.006",
      latencyEst: "1.4s",
      category: "Finance",
      rating: 4.9,
      downloads: "14.7k",
      author: "Finance Labs",
      features: ["Inbound Receipt Parser", "AI Financial Sorting", "Google Sheets Sync", "Slack Alert"],
    },
    {
      id: "daily_news_brief",
      title: "Daily News Brief",
      desc: "Aggregate global articles on custom tech topics, perform summarization, and email condensed morning newsletters.",
      difficulty: "Advanced",
      nodesCount: 6,
      tokensEst: "12.0K / run",
      costEst: "$0.036",
      latencyEst: "5.8s",
      category: "Productivity",
      rating: 4.9,
      downloads: "11.2k",
      author: "FlowForge Core",
      features: ["Web Grounding Search", "Semantic Aggregator", "Gemini Editor", "Mailchimp / SMTP Blast"],
    }
  ];

  const filtered = templatesList.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 bg-[#080B0F] text-slate-100 overflow-y-auto p-8 select-none">
      
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-500 font-mono text-[10px] uppercase font-bold tracking-widest mb-1.5">
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            FlowForge Enterprise Marketplace
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase font-sans">
            AI Blueprint & Agent Marketplace
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Instantly discover, preview, duplicate, and configure production-ready workflows built by Google AI architects and global partners.
          </p>
        </div>
        
        {/* Marketplace Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search agents, prompts, or algorithms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#0D131A] border border-slate-800 rounded text-xs font-semibold text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 w-72 transition-colors focus:bg-[#111827]"
          />
        </div>
      </div>

      {/* Category Tab Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-slate-900">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer border shrink-0 ${
              activeCategory === cat
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/10"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid List of Blueprint Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered.map((tpl) => (
          <div 
            key={tpl.id}
            onClick={() => onLoadTemplate(tpl.id)}
            className="bg-[#0D131A] border border-slate-800/80 p-6 rounded-lg hover:border-blue-500/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-0.5 relative overflow-hidden"
          >
            {/* Visual subtle card ambient glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full filter blur-xl group-hover:bg-blue-500/10 transition-colors pointer-events-none"></div>

            <div>
              {/* Header metadata row */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                    {tpl.category}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-slate-500">
                    by {tpl.author}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold font-mono">
                    <Star className="w-3 h-3 fill-current" />
                    {tpl.rating.toFixed(1)}
                  </div>
                  <span className="text-[8px] font-mono text-slate-600">({tpl.downloads})</span>
                </div>
              </div>

              {/* Title & Desc */}
              <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors uppercase font-sans tracking-wide">
                {tpl.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-sans">{tpl.desc}</p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {tpl.features.map((f, i) => (
                  <span key={i} className="text-[8px] font-mono text-slate-400 bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance profiles and load CTA */}
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Metrix metrics */}
              <div className="grid grid-cols-4 gap-3 text-[9px] font-mono text-slate-500 font-bold">
                <div className="flex flex-col">
                  <span className="text-slate-600 text-[8px] uppercase tracking-wider">Topology</span>
                  <span className="text-slate-300 mt-0.5 flex items-center gap-1">
                    <Database className="w-3 h-3 text-blue-400" />
                    {tpl.nodesCount} nodes
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-slate-600 text-[8px] uppercase tracking-wider">Estimate Cost</span>
                  <span className="text-emerald-400 mt-0.5 flex items-center gap-0.5">
                    <DollarSign className="w-3 h-3" />
                    {tpl.costEst}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-slate-600 text-[8px] uppercase tracking-wider">Est. Latency</span>
                  <span className="text-slate-300 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {tpl.latencyEst}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-slate-600 text-[8px] uppercase tracking-wider">Complexity</span>
                  <span className={`mt-0.5 uppercase tracking-wider text-[8px] ${
                    tpl.difficulty === "Advanced" ? "text-red-400" : tpl.difficulty === "Intermediate" ? "text-blue-400" : "text-emerald-400"
                  }`}>
                    {tpl.difficulty}
                  </span>
                </div>
              </div>

              {/* Install button trigger */}
              <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-blue-600/10 border border-blue-500/20 text-[10px] font-mono font-bold text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all uppercase tracking-wider cursor-pointer">
                Install Pipeline
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-1 xl:col-span-2 text-center p-16 bg-[#0D131A] border border-slate-800 border-dashed rounded-xl flex flex-col items-center justify-center gap-5 max-w-md mx-auto my-10">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-xl w-20 h-20" />
              <div className="w-14 h-14 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center text-amber-400 relative z-10 shadow-lg">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">No Matching Blueprints</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                We couldn't find any pre-built pipelines matching your criteria. Try adjusting your query or resetting filters.
              </p>
            </div>

            <button
              onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}
              className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-850 transition-colors cursor-pointer"
            >
              Reset Filters & Search
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
