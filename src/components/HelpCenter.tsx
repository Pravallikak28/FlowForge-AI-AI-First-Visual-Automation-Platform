import { useState } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Search, 
  BookOpen, 
  Compass, 
  Cpu, 
  Settings, 
  HelpCircle, 
  X, 
  Play, 
  GitBranch, 
  Layers, 
  Sparkles,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface HelpSection {
  id: string;
  category: "Overview" | "Nodes" | "Execution" | "Platform";
  title: string;
  subtitle: string;
  content: string;
}

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpCenter({ isOpen, onClose }: HelpCenterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>("getting_started");

  const helpDocs: HelpSection[] = [
    {
      id: "getting_started",
      category: "Overview",
      title: "FlowForge Platform Overview",
      subtitle: "Enterprise visual AI workflow designer and execution engine",
      content: `FlowForge is a visual orchestration tool designed to streamline multi-step AI reasoning pipelines. 
AI Engineers can layout graph-based flow diagrams, inject live conversational memories, connect private database models, run API integrations, and debug individual nodes in real-time. 
The canvas translates visual layouts into a direct acyclic topological queue processed entirely on our high-performance Node environment.`
    },
    {
      id: "nodes_explained",
      category: "Nodes",
      title: "Understanding Workflow Nodes",
      subtitle: "The functional building blocks of your AI pipeline",
      content: `Each node represents a distinct processing sandbox:
• Input / Gateways (Start Node, Webhook): Initialize execution parameters and listen for inbound request payloads.
• AI Reasoning (Gemini Node, Custom Model): Core LLM engines running state-of-the-art models like Gemini-3.5.
• RAG & Memory (Knowledge Base, Semantic Retriever): Deconstruct PDFs into chunks and query vector storages.
• Logic & Routing (If/Else, Loop): Create complex loops, iterators, and logical condition routing.
• Utilities (API Integrator, SQL Database, Javascript Code): Connect database environments and execute secure sandbox codes.`
    },
    {
      id: "connections_explained",
      category: "Nodes",
      title: "Connecting Graph Edges",
      subtitle: "How data flows topological between sandboxes",
      content: `Connections link outputs of source nodes directly into parameters of destination nodes. 
In a standard run, the topological compiler resolves references (e.g. {{input}} variables) and pipes outputs forward. 
Wires animate dynamically during live runs, displaying status packets and color-coding execution successes (Green), running steps (Blue), or failures (Red).`
    },
    {
      id: "execution_modes",
      category: "Execution",
      title: "Orchestration & Live Execution",
      subtitle: "Standard, Debug, and Dry Run sequences",
      content: `Choose from multiple execution configurations:
• Run Workflow: Topological parser triggers sequential runs, reporting average latency and token foot-costs.
• Interactive Live Debug: Step-by-step controller that lets you walk forward and backward through the execution queue, inspecting intermediary variable registers.
• Dry-Run Sandbox: Safely test prompts without persisting tokens to production data pools.`
    },
    {
      id: "ai_generation",
      category: "Platform",
      title: "AI Pipeline Architect & Generator",
      subtitle: "Build entire workflows instantly with Gemini",
      content: `FlowForge features an AI Architect panel powered by Gemini. 
Type a prompt description (e.g., 'Build an automated email support ticket responder with vector RAG checks') and click 'Generate'. 
Gemini will analyze your requirements, assemble a valid topological graph of nodes and connections, auto-layout the visual coordinates, and load it straight to your canvas.`
    },
    {
      id: "subflows_explained",
      category: "Platform",
      title: "Reusable Blocks & Subflows",
      subtitle: "Modularizing complex pipelines into sub-graphs",
      content: `Subflows allow you to save a pre-built sub-graph of nodes and drag them directly into larger pipelines. 
This avoids repeating complex prompt compilers or database lookups across different workflows. 
Open the 'Reusable Subflows' tab on the sidebar to inspect saved configurations.`
    },
    {
      id: "version_control",
      category: "Platform",
      title: "Git-Style Checkpoints & Rollbacks",
      subtitle: "Tracking visual model prompts versioning",
      content: `FlowForge integrates a Git checkpoint database:
• Commit Checkpoint: Save a point-in-time snapshot of prompt weights, node configurations, and wires.
• Visual Diff Compare: Toggle side-by-side comparative views highlighting modified coordinates or configurations.
• Instant Revert: Safely restore past snapshots to undo prompt regressions.`
    }
  ];

  const filtered = helpDocs.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Back Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
          />

          {/* Help Drawer Panel */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[420px] bg-[#0B0F14] border-l border-slate-800 shadow-2xl z-50 flex flex-col p-5 select-none text-slate-300"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-850">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-blue-600/15 border border-blue-500/20 text-blue-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">FlowForge Help Center</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest font-bold">Manual & Docs</p>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="p-1.5 rounded hover:bg-slate-900 text-slate-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Help Search Input */}
            <div className="relative my-4">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search manual or concepts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0D131A] border border-slate-800 rounded text-xs font-semibold text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-[#111827] transition-all"
              />
            </div>

            {/* Document Accordion List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {filtered.map((doc) => {
                const isExpanded = expandedSection === doc.id;
                return (
                  <div 
                    key={doc.id}
                    className="border border-slate-800/80 rounded-lg overflow-hidden bg-slate-950/20 transition-all"
                  >
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : doc.id)}
                      className={`w-full flex items-center justify-between p-3.5 text-left transition-colors ${
                        isExpanded ? "bg-slate-900/40 text-blue-400" : "hover:bg-slate-900/20 text-slate-200"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[8px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {doc.category}
                        </span>
                        <h4 className="font-bold text-[12px] leading-tight mt-2 uppercase tracking-wide">{doc.title}</h4>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{doc.subtitle}</p>
                      </div>

                      <div className="text-slate-500">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-4 bg-[#080B0F]/40 border-t border-slate-850 text-[11px] text-slate-400 leading-relaxed font-sans whitespace-pre-line select-text selection:bg-blue-500/30">
                            {doc.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs italic">
                  No manuals match your search query. Try typing "RAG", "Connections", or "Version".
                </div>
              )}
            </div>

            {/* Manual Footer */}
            <div className="p-3 bg-[#0D131A] border border-slate-800 rounded-lg mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500 font-bold">
              <span>SDK: v3.4.1</span>
              <a 
                href="https://ai.studio" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Developer APIs <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
