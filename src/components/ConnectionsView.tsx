import { useState } from "react";
import { 
  Link, 
  Unlink, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw, 
  Mail, 
  FileSpreadsheet, 
  Calendar, 
  FileText, 
  Cpu, 
  Sparkles, 
  Globe, 
  Database, 
  ShieldCheck, 
  Search,
  Plus
} from "lucide-react";

interface AppConnection {
  id: string;
  name: string;
  category: "AI" | "Google Apps" | "Websites";
  icon: any;
  status: "connected" | "needs_reconnect" | "disconnected";
  lastSynced: string;
  permissions: string[];
  color: string;
}

export default function ConnectionsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [connections, setConnections] = useState<AppConnection[]>([
    {
      id: "gemini",
      name: "Gemini AI Brain",
      category: "AI",
      icon: Cpu,
      status: "connected",
      lastSynced: "Just now",
      permissions: ["Generate text summaries", "Smart classification", "Translate languages"],
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      id: "openai",
      name: "ChatGPT (OpenAI)",
      category: "AI",
      icon: Sparkles,
      status: "connected",
      lastSynced: "10 mins ago",
      permissions: ["Run prompt instructions", "Extract entities", "Advanced reasoning"],
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      id: "gmail",
      name: "Gmail Inbox Integration",
      category: "Google Apps",
      icon: Mail,
      status: "connected",
      lastSynced: "1 hr ago",
      permissions: ["Read incoming emails", "Send custom messages", "Manage draft items"],
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20"
    },
    {
      id: "gsheets",
      name: "Google Sheets",
      category: "Google Apps",
      icon: FileSpreadsheet,
      status: "needs_reconnect",
      lastSynced: "2 days ago",
      permissions: ["Append new row logs", "Read spreadsheet data", "Over-write tables"],
      color: "text-green-400 bg-green-500/10 border-green-500/20"
    },
    {
      id: "gcal",
      name: "Google Calendar",
      category: "Google Apps",
      icon: Calendar,
      status: "disconnected",
      lastSynced: "Never",
      permissions: ["Create time blocks", "Update meeting details", "List free schedules"],
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      id: "gdocs",
      name: "Google Docs",
      category: "Google Apps",
      icon: FileText,
      status: "connected",
      lastSynced: "4 hrs ago",
      permissions: ["Append draft texts", "Read document content"],
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20"
    },
    {
      id: "webhooks",
      name: "Receive Information (Webhooks)",
      category: "Websites",
      icon: Globe,
      status: "connected",
      lastSynced: "Active listener",
      permissions: ["Accept HTTP payloads", "Listen to trigger events"],
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    }
  ]);

  const toggleStatus = (id: string) => {
    setConnections(prev => prev.map(conn => {
      if (conn.id === id) {
        const nextStatus = conn.status === "connected" ? "disconnected" : "connected";
        return {
          ...conn,
          status: nextStatus,
          lastSynced: nextStatus === "connected" ? "Just now" : "Never"
        };
      }
      return conn;
    }));
  };

  const handleReconnect = (id: string) => {
    setConnections(prev => prev.map(conn => {
      if (conn.id === id) {
        return {
          ...conn,
          status: "connected",
          lastSynced: "Just now"
        };
      }
      return conn;
    }));
  };

  const filtered = connections.filter(conn => 
    conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#080B0F] text-slate-100 overflow-y-auto p-8 select-none">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white uppercase font-sans">App Connection Manager</h2>
          <p className="text-slate-500 text-xs mt-1">Manage all your Google, AI, and custom platform integrations in one unified and secure place.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search integrated services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-[#0D131A] border border-slate-800 rounded text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 w-full md:w-64 transition-all"
            />
          </div>

          <button 
            className="flex items-center gap-2 px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/10 transition-all cursor-pointer border border-blue-500/20"
            onClick={() => alert("Connecting new integrations can be completed immediately in Developer mode or on each step card configuration.")}
          >
            <Plus className="w-3.5 h-3.5" />
            Integrate App
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0B0F14] border border-slate-850 p-4 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest font-bold">Total Services</span>
            <h3 className="text-xl font-black text-white mt-1">{connections.length}</h3>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
            <Link className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0B0F14] border border-slate-850 p-4 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest font-bold">Active Connections</span>
            <h3 className="text-xl font-black text-emerald-400 mt-1">
              {connections.filter(c => c.status === "connected").length}
            </h3>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0B0F14] border border-slate-850 p-4 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest font-bold">Action Required</span>
            <h3 className="text-xl font-black text-amber-400 mt-1">
              {connections.filter(c => c.status !== "connected").length}
            </h3>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Grid of Integrated Apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((conn) => {
          const IconComponent = conn.icon;
          return (
            <div 
              key={conn.id}
              className={`bg-[#0B0F14] border rounded-xl shadow-xl p-5 flex flex-col justify-between transition-all relative overflow-hidden group ${
                conn.status === "connected" 
                  ? "border-slate-850 hover:border-slate-800" 
                  : conn.status === "needs_reconnect"
                  ? "border-amber-500/30 bg-[#120F0B]/80"
                  : "border-slate-900 bg-slate-950/20 opacity-80"
              }`}
            >
              <div>
                {/* Header of card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${conn.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs tracking-wide">{conn.name}</h4>
                      <span className="text-[8px] font-mono uppercase bg-slate-900 text-slate-500 border border-slate-850 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                        {conn.category}
                      </span>
                    </div>
                  </div>

                  {/* Status pills */}
                  {conn.status === "connected" && (
                    <span className="flex items-center gap-1 text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/5 border border-emerald-500/20 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Connected
                    </span>
                  )}
                  {conn.status === "needs_reconnect" && (
                    <span className="flex items-center gap-1 text-[8px] font-mono text-amber-400 font-bold uppercase tracking-wider bg-amber-500/5 border border-amber-500/20 px-2 py-1 rounded-full animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Fix Connection
                    </span>
                  )}
                  {conn.status === "disconnected" && (
                    <span className="flex items-center gap-1 text-[8px] font-mono text-slate-500 font-bold uppercase tracking-wider bg-slate-900 border border-slate-850 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      Inactive
                    </span>
                  )}
                </div>

                {/* Last Synced status */}
                <div className="text-[10px] text-slate-500 mb-3 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-slate-600" />
                  <span>Last Checked: <b>{conn.lastSynced}</b></span>
                </div>

                {/* Permissions section */}
                <div className="space-y-1 mb-5">
                  <div className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                    <ShieldCheck className="w-3 h-3 text-blue-500" />
                    Authorized Capabilities
                  </div>
                  <div className="space-y-1">
                    {conn.permissions.map((perm, i) => (
                      <div key={i} className="text-[10px] text-slate-400 flex items-center gap-1.5 leading-tight">
                        <span className="text-blue-500 text-xs font-bold leading-none">•</span>
                        <span>{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-850 flex items-center gap-2">
                {conn.status !== "connected" ? (
                  <button
                    onClick={() => handleReconnect(conn.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Connect Account
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleReconnect(conn.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-slate-900 hover:bg-slate-850 text-slate-300 font-semibold text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Reconnect
                    </button>
                    <button
                      onClick={() => toggleStatus(conn.id)}
                      className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      title="Disconnect Application"
                    >
                      <Unlink className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
