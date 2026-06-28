import { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Search, 
  Plus, 
  Sparkles, 
  FileCode, 
  Play, 
  Download, 
  ShoppingBag, 
  Grid, 
  Folder, 
  Sliders, 
  HelpCircle, 
  Key,
  X
} from "lucide-react";

interface CommandItem {
  id: string;
  category: "Creation" | "Execution" | "Navigation" | "Workspaces" | "System";
  label: string;
  description: string;
  shortcut?: string[];
  icon: any;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNewWorkflow: () => void;
  onRunWorkflow: () => void;
  onSetActiveTab: (tab: string) => void;
  onTriggerAI: () => void;
  onOpenExport: () => void;
  onOpenHelp: () => void;
  workspaces: { id: string; name: string }[];
  activeWorkspaceId: string;
  onSwitchWorkspace: (id: string) => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onNewWorkflow,
  onRunWorkflow,
  onSetActiveTab,
  onTriggerAI,
  onOpenExport,
  onOpenHelp,
  workspaces,
  activeWorkspaceId,
  onSwitchWorkspace
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    {
      id: "create_wf",
      category: "Creation",
      label: "Create New Workflow",
      description: "Initialize a blank infinite workspace canvas",
      shortcut: ["Ctrl", "N"],
      icon: Plus,
      action: () => { onNewWorkflow(); onClose(); }
    },
    {
      id: "ai_wf",
      category: "Creation",
      label: "Generate Workflow with AI",
      description: "Ask Gemini Copilot to design a complete visual layout pipeline",
      shortcut: ["Ctrl", "I"],
      icon: Sparkles,
      action: () => { onTriggerAI(); onClose(); }
    },
    {
      id: "run_wf",
      category: "Execution",
      label: "Run Workflow Pipeline",
      description: "Trigger standard node topological execution chain",
      shortcut: ["Space"],
      icon: Play,
      action: () => { onRunWorkflow(); onClose(); }
    },
    {
      id: "export_wf",
      category: "System",
      label: "Export Workflow Center",
      description: "Generate JSON, markdown, SVG diagram, or PDF documentation",
      shortcut: ["Ctrl", "E"],
      icon: Download,
      action: () => { onOpenExport(); onClose(); }
    },
    {
      id: "nav_dashboard",
      category: "Navigation",
      label: "Go to Dashboard",
      description: "Overview of pipelines, latency metrics, and core statistics",
      shortcut: ["G", "D"],
      icon: Folder,
      action: () => { onSetActiveTab("dashboard"); onClose(); }
    },
    {
      id: "nav_templates",
      category: "Navigation",
      label: "Open Blueprints & Templates",
      description: "Discover preloaded agent frameworks and RAG nodes",
      shortcut: ["G", "T"],
      icon: FileCode,
      action: () => { onSetActiveTab("templates"); onClose(); }
    },
    {
      id: "nav_marketplace",
      category: "Navigation",
      label: "Open AI Agent Marketplace",
      description: "Explore verified community integrations and models",
      shortcut: ["G", "M"],
      icon: ShoppingBag,
      action: () => { onSetActiveTab("templates"); onClose(); }
    },
    {
      id: "nav_settings",
      category: "Navigation",
      label: "Open Settings",
      description: "Configure fallback models, chunk sizes, and keys",
      shortcut: ["G", "S"],
      icon: Sliders,
      action: () => { onSetActiveTab("settings"); onClose(); }
    },
    {
      id: "nav_help",
      category: "Navigation",
      label: "Open Help & Documentation",
      description: "Study node specs, execution guides, and best practices",
      shortcut: ["Ctrl", "/"],
      icon: HelpCircle,
      action: () => { onOpenHelp(); onClose(); }
    }
  ];

  // Append workspaces
  workspaces.forEach(ws => {
    commands.push({
      id: `ws_switch_${ws.id}`,
      category: "Workspaces",
      label: `Switch to ${ws.name}`,
      description: ws.id === activeWorkspaceId ? "Current active workspace" : `Switch visual context to ${ws.name}`,
      icon: Folder,
      action: () => { onSwitchWorkspace(ws.id); onClose(); }
    });
  });

  const filtered = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filtered, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />

          {/* Dialog Panel */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-xl bg-[#0B0F14]/98 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md flex flex-col"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
              <Search className="w-4 h-4 text-slate-500 mr-3" />
              <input 
                ref={inputRef}
                type="text"
                placeholder="Type a command or search actions..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-600 focus:outline-none text-[13px] font-sans"
              />
              <button 
                onClick={onClose}
                className="p-1 rounded hover:bg-slate-900 text-slate-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Command List grouped */}
            <div className="flex-1 max-h-96 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No commands match your query. Try searching for "RAG", "Create", "Settings", or "Run".
                </div>
              ) : (
                filtered.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                        isSelected 
                          ? "bg-blue-600/15 text-white border border-blue-500/30 font-semibold" 
                          : "text-slate-400 hover:text-slate-200 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded transition-transform ${
                          isSelected ? "bg-blue-600/20 text-blue-400 scale-105" : "bg-slate-950/40 text-slate-500"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-100">{cmd.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 truncate">{cmd.description}</div>
                        </div>
                      </div>

                      {/* Right shortcut guide */}
                      {cmd.shortcut && (
                        <div className="flex items-center gap-1">
                          {cmd.shortcut.map((key, kIdx) => (
                            <kbd 
                              key={kIdx} 
                              className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[9px] font-mono font-bold text-slate-500"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/30 flex items-center justify-between text-[9px] font-mono text-slate-600">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold">▲▼</kbd> Navigate
                <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold">Enter</kbd> Select
              </span>
              <span>
                Shortcut: <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold">Ctrl + K</kbd>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
