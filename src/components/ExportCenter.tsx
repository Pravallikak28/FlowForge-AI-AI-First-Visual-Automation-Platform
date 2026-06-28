import { 
  X, 
  Download, 
  FileJson, 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Table, 
  BookOpen,
  CheckCircle2
} from "lucide-react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { useState } from "react";
import { Workflow } from "../types";

interface ExportCenterProps {
  isOpen: boolean;
  onClose: () => void;
  activeWorkflow: Workflow | null;
  onAddNotification: (title: string, msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function ExportCenter({
  isOpen,
  onClose,
  activeWorkflow,
  onAddNotification
}: ExportCenterProps) {
  const [exportingType, setExportingType] = useState<string | null>(null);

  if (!activeWorkflow) return null;

  const handleExportJSON = () => {
    setExportingType("json");
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeWorkflow, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${activeWorkflow.name.toLowerCase().replace(/\s+/g, '_')}_workflow.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExportingType(null);
      onAddNotification("Export Successful", "Workflow JSON downloaded directly.", "success");
      onClose();
    }, 800);
  };

  const handleExportMarkdown = () => {
    setExportingType("markdown");
    setTimeout(() => {
      const mdContent = `# FlowForge AI Workflow: ${activeWorkflow.name}
> ${activeWorkflow.description || "No description provided."}

## Metadata
- **Version**: ${activeWorkflow.version || "1.0.0"}
- **Created**: ${activeWorkflow.created || "2026-06-27"}
- **Last Updated**: ${activeWorkflow.updated || "2026-06-27"}
- **Status**: ${activeWorkflow.status || "active"}

## Pipeline Graph
### Nodes List
${activeWorkflow.nodes.map((node, index) => `${index + 1}. **${node.label}** (${node.type.toUpperCase()})
   - *Description*: ${node.description}
   - *Coordinates*: [X: ${node.x}, Y: ${node.y}]`).join('\n')}

### Connections List
${activeWorkflow.edges.map((edge, index) => `- Connection ${index + 1}: Node \`${edge.source}\` → Node \`${edge.target}\``).join('\n')}

---
Generated via FlowForge AI Platform.
`;
      const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(mdContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${activeWorkflow.name.toLowerCase().replace(/\s+/g, '_')}_documentation.md`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExportingType(null);
      onAddNotification("Export Successful", "Markdown documentation file downloaded.", "success");
      onClose();
    }, 800);
  };

  const handleExportMock = (type: 'svg' | 'png' | 'pdf') => {
    setExportingType(type);
    setTimeout(() => {
      setExportingType(null);
      onAddNotification("Export Successful", `${type.toUpperCase()} generation complete.`, "success");
      onClose();
    }, 1200);
  };

  const exportFormats = [
    {
      id: "json",
      title: "Workflow JSON config",
      desc: "Full serialized node & edge configuration parameters suitable for hosting and direct production deployments.",
      icon: FileJson,
      action: handleExportJSON
    },
    {
      id: "markdown",
      title: "Markdown Documentation",
      desc: "Formatted technical specification containing model configurations, temperatures, prompts, and pipeline graph paths.",
      icon: FileText,
      action: handleExportMarkdown
    },
    {
      id: "svg",
      title: "SVG Canvas Vector Diagram",
      desc: "Resolution-independent scalable vector graphic layout of node cards and curved connection wires.",
      icon: Code,
      action: () => handleExportMock('svg')
    },
    {
      id: "png",
      title: "PNG High-Resolution Image",
      desc: "Static screenshot file of active workspace layout at standard zoom scales.",
      icon: ImageIcon,
      action: () => handleExportMock('png')
    },
    {
      id: "pdf",
      title: "PDF Pipeline Documentation",
      desc: "Complete executive summary deck including token costs, performance logs, and edge topological tables.",
      icon: BookOpen,
      action: () => handleExportMock('pdf')
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Panel */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative w-full max-w-lg bg-[#0B0F14] border border-slate-800 rounded-xl shadow-2xl p-6 backdrop-blur-md flex flex-col select-none text-slate-300"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-850">
              <div className="flex items-center gap-2 text-blue-400">
                <Download className="w-4.5 h-4.5 animate-bounce" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Workflow Export Center</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded hover:bg-slate-900 text-slate-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2.5 text-[11px] text-slate-400 leading-normal mb-4 font-sans">
              Deploy, document, or capture your visual pipeline diagram. Select a file format target for <span className="text-white font-bold">{activeWorkflow.name}</span>.
            </div>

            {/* Formats Grid */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {exportFormats.map((fmt) => {
                const Icon = fmt.icon;
                const isExportingCurrent = exportingType === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    disabled={exportingType !== null}
                    onClick={fmt.action}
                    className={`w-full flex items-start gap-4 p-3 rounded-lg border text-left transition-all ${
                      exportingType !== null 
                        ? "opacity-40 cursor-not-allowed border-transparent bg-slate-950/20" 
                        : "border-slate-850 bg-slate-950/20 hover:border-slate-700 hover:bg-slate-900/35 cursor-pointer"
                    }`}
                  >
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-400 shrink-0">
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                        <span>{fmt.title}</span>
                        {isExportingCurrent && (
                          <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest animate-pulse">
                            Processing...
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal mt-1">{fmt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-5 text-center text-[10px] font-mono text-slate-600 border-t border-slate-850 pt-3 flex items-center justify-between">
              <span>Pipeline: {activeWorkflow.id}</span>
              <span>Version: {activeWorkflow.version}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
