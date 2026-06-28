import { useState } from "react";
import { 
  History, 
  Trash2, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Cpu, 
  ArrowRight,
  Database,
  Layers
} from "lucide-react";
import { ExecutionLog } from "../types";

interface HistoryViewProps {
  logs: ExecutionLog[];
  onClear: () => void;
  onExecuteActive?: () => void;
}

export default function HistoryView({ logs, onClear, onExecuteActive }: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.nodeLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.output && l.output.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 bg-[#080B0F] text-slate-100 overflow-y-auto p-8 select-none">
      
      {/* Title block */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 uppercase font-sans">
            <History className="w-4.5 h-4.5 text-indigo-400" />
            Execution Transaction History
          </h2>
          <p className="text-slate-500 text-xs mt-1">Audit trail of all visual AI node runs, compiled system answers, and telemetry metrics.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search history records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-[#0D131A] border border-slate-800 rounded text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 w-64"
            />
          </div>

          <button
            onClick={onClear}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-red-950/20 text-red-400 border border-red-500/15 hover:bg-red-950/40 rounded text-xs font-semibold cursor-pointer transition-colors uppercase tracking-wider"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Logs
          </button>
        </div>
      </div>

      {/* History Records List */}
      <div className="bg-[#0D131A] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-6 max-w-lg mx-auto">
            
            {/* Visual Illustration */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-xl w-24 h-24" />
              <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800/80 flex items-center justify-center text-indigo-400/80 relative z-10 shadow-lg">
                <Layers className="w-7 h-7" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0B0F14] border border-slate-850 flex items-center justify-center z-20">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide font-sans">No Transaction Log Batches</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                You haven't initiated node processes in the current session workspace yet. Execute steps or prompt triggers inside the Workflow canvas to populate the transactional database log.
              </p>
            </div>

            {onExecuteActive && (
              <button
                onClick={onExecuteActive}
                className="px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/10 cursor-pointer border border-blue-500/20 hover:scale-[1.02] transition-all"
              >
                Execute Visual Pipeline
              </button>
            )}

          </div>
        ) : (
          <div className="divide-y divide-slate-800/50 font-mono text-xs">
            {filtered.map((log, idx) => (
              <div key={log.id || idx} className="p-4 hover:bg-slate-900/40 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`p-1.5 rounded border ${
                    log.status === 'completed' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {log.status === 'completed' ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                  </div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-white text-[13px] uppercase tracking-tight">{log.nodeLabel}</span>
                      <span className="text-[9px] text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded capitalize font-bold">
                        {log.nodeType}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs font-sans mt-1.5 leading-relaxed truncate max-w-2xl">
                      {log.output || log.error || "Execution completed with no return payload."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 font-mono text-[10px] text-slate-500 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                    {log.duration}ms
                  </span>
                  {log.tokens !== undefined && (
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-slate-600" />
                      {log.tokens} tokens
                    </span>
                  )}
                  <span className="text-slate-600 text-[9px] font-bold">
                    {log.timestamp}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
