import { useState } from "react";
import { 
  Terminal, 
  Trash2, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Cpu, 
  AlertTriangle 
} from "lucide-react";
import { ExecutionLog } from "../types";

interface LogPanelProps {
  logs: ExecutionLog[];
  onClear: () => void;
}

export default function LogPanel({ logs, onClear }: LogPanelProps) {
  const [filterText, setFilterText] = useState("");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const filteredLogs = logs.filter(
    (l) =>
      l.nodeLabel.toLowerCase().includes(filterText.toLowerCase()) ||
      (l.output && l.output.toLowerCase().includes(filterText.toLowerCase())) ||
      (l.error && l.error.toLowerCase().includes(filterText.toLowerCase()))
  );

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className={`${isCollapsed ? "h-11" : "h-64"} border-t border-slate-800 bg-[#0B0F14] flex flex-col text-slate-300 font-mono select-none transition-all duration-200`}>
      
      {/* Terminal Title Bar */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="px-5 py-2.5 border-b border-slate-800 bg-[#080B0F]/60 flex items-center justify-between cursor-pointer hover:bg-[#080B0F]/80 transition-colors"
      >
        <div className="flex items-center gap-2.5 text-xs font-semibold">
          <Terminal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-white uppercase font-sans tracking-wider text-[11px] font-bold">Automation Run Logs</span>
          <span className="text-[9px] text-slate-500 font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            {filteredLogs.length} entries
          </span>
        </div>

        {/* Console Actions */}
        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter logs..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-8 pr-3 py-1 bg-[#111827]/80 border border-slate-800 rounded text-[9px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 w-44"
            />
          </div>

          <button
            onClick={onClear}
            className="p-1.5 rounded hover:bg-slate-850 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
            title="Flush logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded hover:bg-slate-850 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isCollapsed ? "Expand logs" : "Collapse logs"}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Statement Rows */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-1 select-text">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-600">
            Console idle. Run a workflow pipeline to capture execution signals.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div 
                key={log.id} 
                className="border border-slate-900 rounded bg-[#080B0F]/30"
              >
                
                {/* Log Line header row */}
                <div 
                  onClick={() => toggleExpand(log.id)}
                  className={`flex items-center justify-between p-2 text-[10px] hover:bg-slate-900/40 transition-colors cursor-pointer ${
                    log.status === "failed" 
                      ? "text-red-400" 
                      : log.status === "running" 
                      ? "text-purple-400" 
                      : "text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-gray-500 text-[9px]">{log.timestamp}</span>
                    <span className="font-semibold text-white bg-gray-900 border border-gray-800/80 px-1.5 py-0.5 rounded text-[9px]">
                      {log.nodeLabel}
                    </span>
                    <span className="text-gray-400 capitalize">({log.nodeType})</span>
                    <span className="truncate max-w-sm md:max-w-md text-gray-500 text-[9px]">
                      - {log.output || log.error || "Step triggered successfully."}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-[9px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      {log.duration}ms
                    </span>
                    {log.tokens !== undefined && (
                      <span className="flex items-center gap-1 text-gray-500">
                        <Cpu className="w-3 h-3 text-gray-500" />
                        {log.tokens} tkn
                      </span>
                    )}
                    {log.status === "completed" ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : log.status === "failed" ? (
                      <XCircle className="w-3.5 h-3.5 text-red-500" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                    )}
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                  </div>
                </div>

                {/* Log Line expanded data body */}
                {isExpanded && (
                  <div className="px-4 py-3 bg-[#080B0F]/90 border-t border-slate-900 space-y-2 text-[10px] leading-relaxed">
                    <div className="grid grid-cols-2 gap-4 text-slate-500 font-semibold border-b border-slate-900 pb-1.5 mb-1.5">
                      <div>Execution status: <span className={log.status === "completed" ? "text-emerald-400" : "text-red-400"}>{log.status}</span></div>
                      <div className="text-right">Transaction Token Cost: ${(log.tokens ? log.tokens * 0.000003 : 0).toFixed(6)} USD</div>
                    </div>
                    {log.output && (
                      <div className="space-y-1">
                        <div className="text-slate-400 font-semibold">Output context:</div>
                        <pre className="bg-slate-900/70 p-2.5 rounded border border-slate-800 text-slate-300 overflow-x-auto select-text whitespace-pre-wrap max-h-48">
                          {log.output}
                        </pre>
                      </div>
                    )}
                    {log.error && (
                      <div className="space-y-1">
                        <div className="text-red-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                          Fatal compiler exception:
                        </div>
                        <pre className="bg-red-500/5 p-2.5 rounded border border-red-500/20 text-red-400 overflow-x-auto select-text whitespace-pre-wrap">
                          {log.error}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>
      )}
    </div>
  );
}
