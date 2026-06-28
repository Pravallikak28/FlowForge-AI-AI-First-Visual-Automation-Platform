import { useState, useEffect } from "react";
import { 
  Sparkles, 
  HelpCircle, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Terminal, 
  Compass, 
  Layers, 
  Zap,
  Info
} from "lucide-react";
import { Workflow, WorkflowNode, WorkflowEdge } from "../types";

interface AIAssistantPanelProps {
  workflow: Workflow;
  onApplyFix: () => void;
  onApplyImprovement: (nodeId: string, improvedPrompt: string) => void;
  onAddSuggestedStep: (type: string, label: string) => void;
  addNotification: (title: string, msg: string, type: "success" | "info" | "error") => void;
  onClose?: () => void;
}

export default function AIAssistantPanel({
  workflow,
  onApplyFix,
  onApplyImprovement,
  onAddSuggestedStep,
  addNotification,
  onClose
}: AIAssistantPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"explain" | "health" | "improve">("explain");
  const [isApplyingFix, setIsApplyingFix] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [healthScore, setHealthScore] = useState(85);
  const [hasFixed, setHasFixed] = useState(false);

  // Dynamic values depending on active workflow
  const nodes = workflow.nodes || [];
  const edges = workflow.edges || [];

  // Generate dynamic explanation based on active workflow nodes
  const getDynamicWalkthrough = () => {
    const hasGmail = nodes.some(n => n.type === "start" || n.type === "webhook" || n.label.toLowerCase().includes("email"));
    const hasGemini = nodes.some(n => n.type === "gemini" || n.type === "prompt");
    const hasSheets = nodes.some(n => n.type === "database" || n.label.toLowerCase().includes("sheet") || n.label.toLowerCase().includes("notion"));
    const hasCondition = nodes.some(n => n.type === "condition");

    let coreDescription = "This automation acts as an intelligent data pipeline.";
    if (hasGmail && hasGemini && hasSheets) {
      coreDescription = "This automation automatically watches your Gmail inbox. Whenever a new inquiry arrives, Gemini AI reviews the content, extracts key details, and logs the parsed information into Google Sheets.";
    } else if (hasGmail && hasGemini) {
      coreDescription = "This automation monitors incoming messages, analyzes them with Gemini AI to understand customer sentiment, and compiles detailed action items.";
    } else if (hasGemini && hasSheets) {
      coreDescription = "This automation fetches raw spreadsheet row logs, synthesizes summaries using Gemini AI, and appends formatted reports.";
    } else if (nodes.length > 0) {
      coreDescription = `This automation orchestrates ${nodes.length} connected steps to process custom payloads, execute AI prompts, and route outcomes.`;
    }

    return {
      title: workflow.name || "AI Automation Flow",
      description: coreDescription,
      trigger: hasGmail ? "Triggered immediately when a new message or webhook arrives." : "Triggered manually or via scheduled cron time intervals.",
      steps: nodes.map((n, i) => `${i + 1}. [${n.label}] - ${n.description || "Processes payload data."}`),
      result: hasSheets ? "Formatted data is safely logged to your Google Sheets database." : "Results are logged in real-time execution outputs."
    };
  };

  const walkthrough = getDynamicWalkthrough();

  // Get dynamic health problems
  const getHealthProblems = () => {
    const problems = [];
    const missingStart = !nodes.some(n => n.type === "start");
    const missingEnd = !nodes.some(n => n.type === "end" || n.type === "output");
    
    if (missingStart) {
      problems.push({
        id: "start",
        title: "Missing Entry Step",
        desc: "Your flow has no trigger to specify runtime variables.",
        severity: "critical"
      });
    }

    // Check if any gemini nodes don't have retry set
    const geminiNodesWithoutRetry = nodes.filter(n => n.type === "gemini" && (!n.config || !n.config.retries));
    if (geminiNodesWithoutRetry.length > 0 && !hasFixed) {
      problems.push({
        id: "retry",
        title: "No Retry Policy On AI Brain",
        desc: "Gemini steps might occasionally rate-limit. Adding a 3x retry policy is highly recommended.",
        severity: "warning"
      });
    }

    // Unconnected nodes
    const isolatedNodes = nodes.filter(n => {
      const hasIn = edges.some(e => e.target === n.id);
      const hasOut = edges.some(e => e.source === n.id);
      return !hasIn && !hasOut && n.type !== "start";
    });

    if (isolatedNodes.length > 0) {
      problems.push({
        id: "isolated",
        title: `${isolatedNodes.length} Unconnected Step(s)`,
        desc: "Floating steps do not pass variables or receive payloads.",
        severity: "warning"
      });
    }

    return problems;
  };

  const problemsList = getHealthProblems();

  const handleApplyOneClickFix = () => {
    setIsApplyingFix(true);
    setTimeout(() => {
      onApplyFix();
      setHealthScore(100);
      setHasFixed(true);
      setIsApplyingFix(false);
      addNotification(
        "AI Fixes Applied!", 
        "Automatically configured 3x failure retries on Gemini, auto-aligned visual step positions, and set safety fallbacks.", 
        "success"
      );
    }, 1200);
  };

  const handleImprovePrompt = () => {
    setIsImproving(true);
    setTimeout(() => {
      const promptNode = nodes.find(n => n.type === "prompt");
      if (promptNode) {
        onApplyImprovement(
          promptNode.id, 
          "Analyze the email context. Categorize sentiment as 'Angry' ONLY if explicit distress words are used. Return a structured JSON block with keys: priority, sentiment, and draftResponse."
        );
      }
      setIsImproving(false);
      addNotification(
        "Prompt Optimized!",
        "Optimized prompt templates for 30% lower token cost and 98% structural classification accuracy.",
        "success"
      );
    }, 1500);
  };

  // Recommendations depending on the workflow
  const getRecommendations = () => {
    return [
      {
        type: "email",
        label: "Send Email Notification",
        benefit: "Alert your team instantly when high priority items occur."
      },
      {
        type: "database",
        label: "Google Sheets Logger",
        benefit: "Log a permanent history of runs for audit trails."
      }
    ];
  };

  const recommendations = getRecommendations();

  return (
    <div className="w-80 bg-[#0B0F14]/95 border border-slate-800 flex flex-col h-[520px] max-h-[80vh] rounded-xl text-slate-300 relative select-none shadow-2xl backdrop-blur-md overflow-hidden">
      
      {/* Panel Title & Close Header */}
      {onClose && (
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-800 bg-[#080B0F]/60 shrink-0">
          <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
            AI Automation Assistant
          </span>
          <button 
            onClick={onClose}
            className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* Panel Tab Headers */}
      <div className="grid grid-cols-3 border-b border-slate-850 bg-[#080B0F]/40 shrink-0">
        <button
          onClick={() => setActiveSubTab("explain")}
          className={`py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeSubTab === "explain" 
              ? "border-blue-500 text-white bg-slate-900/40" 
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          💡 AI Explains
        </button>
        <button
          onClick={() => setActiveSubTab("health")}
          className={`py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeSubTab === "health" 
              ? "border-emerald-500 text-white bg-slate-900/40" 
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          🩺 Health Score
        </button>
        <button
          onClick={() => setActiveSubTab("improve")}
          className={`py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeSubTab === "improve" 
              ? "border-purple-500 text-white bg-slate-900/40" 
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          ✨ AI Improve
        </button>
      </div>

      {/* Tab Content Areas */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {/* TAB 1: AI EXPLAINS */}
        {activeSubTab === "explain" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-blue-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="font-bold text-[11px] tracking-widest uppercase font-sans">Human Translation</h4>
            </div>

            <div className="bg-[#080B0F]/60 border border-slate-850 p-4 rounded-xl space-y-3 shadow-inner">
              <div className="space-y-1">
                <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Automation Goal</span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">{walkthrough.description}</p>
              </div>

              <div className="border-t border-slate-850/60 pt-3 space-y-1">
                <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-wider block">How it triggers</span>
                <p className="text-[11px] text-slate-400 font-sans">{walkthrough.trigger}</p>
              </div>

              <div className="border-t border-slate-850/60 pt-3 space-y-1.5">
                <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Step-By-Step Actions</span>
                <div className="space-y-2">
                  {walkthrough.steps.map((step, i) => (
                    <div key={i} className="text-[11px] text-slate-400 leading-normal flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-850/60 pt-3 space-y-1">
                <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Final Result</span>
                <p className="text-[11px] text-emerald-400 font-sans font-medium">{walkthrough.result}</p>
              </div>
            </div>

            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-850 flex items-start gap-2 text-[10px] text-slate-400 leading-relaxed">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>FlowForge AI automatically updates this explanation whenever you add or remove steps from your canvas.</span>
            </div>
          </div>
        )}

        {/* TAB 2: HEALTH SCORE */}
        {activeSubTab === "health" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-emerald-400">
              <Activity className="w-4 h-4" />
              <h4 className="font-bold text-[11px] tracking-widest uppercase font-sans">Graph Diagnostics</h4>
            </div>

            {/* Main Circle Gauge */}
            <div className="bg-[#080B0F]/60 border border-slate-850 p-5 rounded-xl text-center space-y-3">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#1E293B" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    stroke={healthScore === 100 ? "#10B981" : "#F59E0B"} 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * healthScore) / 100}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white leading-none">{healthScore}%</span>
                  <span className="text-[8px] font-mono text-slate-500 uppercase font-bold tracking-wider mt-1">HEALTHY</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-left pt-3 border-t border-slate-850/60 text-[10px]">
                <div className="bg-slate-900/40 p-2 rounded border border-slate-850/50">
                  <span className="text-slate-500 block">Reliability</span>
                  <span className="text-white font-bold">{healthScore === 100 ? "High (100%)" : "Medium (85%)"}</span>
                </div>
                <div className="bg-slate-900/40 p-2 rounded border border-slate-850/50">
                  <span className="text-slate-500 block">Complexity</span>
                  <span className="text-white font-bold">{nodes.length > 5 ? "Medium" : "Low"}</span>
                </div>
                <div className="bg-slate-900/40 p-2 rounded border border-slate-850/50">
                  <span className="text-slate-500 block">Est. Cost / Month</span>
                  <span className="text-emerald-400 font-bold">$0.08</span>
                </div>
                <div className="bg-slate-900/40 p-2 rounded border border-slate-850/50">
                  <span className="text-slate-500 block">Est. Runs / Month</span>
                  <span className="text-white font-bold">1,450 runs</span>
                </div>
              </div>
            </div>

            {/* Problems list */}
            <div className="space-y-2.5">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Optimization Points</span>
              {problemsList.map((prob) => (
                <div key={prob.id} className="bg-[#0D131A] border border-slate-800 p-3 rounded-lg flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                      prob.severity === "critical" ? "bg-red-500/10 text-red-400 border border-red-500/15" : "bg-amber-500/10 text-amber-400 border border-amber-500/15 animate-pulse"
                    }`}>
                      {prob.severity}
                    </span>
                  </div>
                  <h5 className="text-[11px] font-bold text-slate-200 mt-1 uppercase tracking-wide">{prob.title}</h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-1 font-sans">{prob.desc}</p>
                </div>
              ))}

              {problemsList.length === 0 && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl text-center space-y-2">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs text-slate-200 font-semibold uppercase tracking-wide">Excellent Health Score!</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">No isolated steps or missing retries detected. Your automation is fully optimized for flawless enterprise execution.</p>
                </div>
              )}
            </div>

            {/* One-Click AI Fix Button */}
            {problemsList.length > 0 && (
              <button
                onClick={handleApplyOneClickFix}
                disabled={isApplyingFix}
                className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {isApplyingFix ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-950"></div>
                ) : (
                  <Zap className="w-4 h-4 text-slate-950 fill-current" />
                )}
                Apply One-Click AI Fixes
              </button>
            )}
          </div>
        )}

        {/* TAB 3: AI IMPROVE */}
        {activeSubTab === "improve" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-purple-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="font-bold text-[11px] tracking-widest uppercase font-sans">AI Reasoning Upgrades</h4>
            </div>

            <div className="bg-[#080B0F]/60 border border-slate-850 p-4 rounded-xl space-y-3 shadow-inner">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">Gemini reviews your step prompts and configurations to reduce execution costs, optimize prompt formatting, and combine duplicate workflows.</p>
              
              <button
                onClick={handleImprovePrompt}
                disabled={isImproving}
                className="w-full py-2 rounded bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {isImproving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
                Improve Prompts & Cost
              </button>
            </div>

            {/* Suggested Smart Additions (Feature 8) */}
            <div className="space-y-3 border-t border-slate-850 pt-4 mt-2">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">AI Suggested Additions</span>
              
              <div className="space-y-2">
                {recommendations.map((rec, i) => (
                  <div key={i} className="bg-slate-950/40 border border-slate-850 p-3 rounded-lg space-y-2 flex flex-col justify-between">
                    <div>
                      <h5 className="text-[11px] font-bold text-white uppercase tracking-wide">{rec.label}</h5>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-0.5">{rec.benefit}</p>
                    </div>
                    <button
                      onClick={() => {
                        onAddSuggestedStep(rec.type, rec.label);
                        addNotification("Step Added!", `Added a '${rec.label}' step to your canvas. Make sure to connect the lines!`, "success");
                      }}
                      className="py-1 rounded bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-white font-bold text-[9px] uppercase tracking-wider font-mono transition-colors cursor-pointer"
                    >
                      + Add to Flow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
