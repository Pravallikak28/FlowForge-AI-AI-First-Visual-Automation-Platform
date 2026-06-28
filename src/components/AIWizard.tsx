import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Wand2, 
  Check, 
  X, 
  Brain, 
  Cpu, 
  MessageSquare, 
  Database, 
  Settings, 
  Zap, 
  Mail, 
  FolderSync, 
  FileCheck, 
  Flame, 
  Play, 
  CheckCircle,
  HelpCircle,
  Code
} from "lucide-react";
import { Workflow, WorkflowNode, WorkflowEdge, NodeType, NodeConfig } from "../types";

interface AIWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateWorkflow: (name: string, description: string, nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
}

const SUGGESTIONS = [
  {
    title: "Save internship emails to Notion",
    description: "Scan incoming emails from interns, extract key applicant information, and create a modern candidate index in Notion automatically.",
    category: "Recruiting",
    tags: ["Gmail", "Notion", "AI Classifier"],
    nodes: [
      { type: "start", label: "When Email Received", desc: "Gmail trigger: monitor messages with subject 'Internship'", x: 80, y: 150, color: "#10B981" },
      { type: "prompt", label: "Extract Applicant Details", desc: "Define template variables for applicant name, resume, skills, and summary", x: 380, y: 150, color: "#14B8A6" },
      { type: "gemini", label: "Gemini AI Brain Classifier", desc: "Use high-reasoning Gemini models to parse candidate profiles as JSON", x: 680, y: 150, color: "#8B5CF6" },
      { type: "database", label: "Notion Applicant Database", desc: "Append structured record rows directly to Notion dashboard", x: 980, y: 150, color: "#6366F1" },
      { type: "email", label: "Send Auto-Reply Confirmation", desc: "Send thank-you email back to candidate acknowledging submission", x: 1280, y: 150, color: "#0EA5E9" },
      { type: "end", label: "Success Archive Log", desc: "Finalize pipeline log details", x: 1580, y: 150, color: "#F43F5E" }
    ],
    edges: [
      { source: "When Email Received", target: "Extract Applicant Details" },
      { source: "Extract Applicant Details", target: "Gemini AI Brain Classifier" },
      { source: "Gemini AI Brain Classifier", target: "Notion Applicant Database" },
      { source: "Notion Applicant Database", target: "Send Auto-Reply Confirmation" },
      { source: "Send Auto-Reply Confirmation", target: "Success Archive Log" }
    ]
  },
  {
    title: "Summarize every PDF uploaded to Drive",
    description: "Listen for new document uploads, parse text contents with cognitive semantic models, and post executive bullet point summaries to Slack.",
    category: "Productivity",
    tags: ["Google Drive", "Gemini AI", "Slack"],
    nodes: [
      { type: "start", label: "When PDF Uploaded", desc: "Google Drive trigger: monitor new documents in '/Reports' folder", x: 80, y: 150, color: "#10B981" },
      { type: "retriever", label: "Fetch Document Content", desc: "Convert PDF files to text and extract knowledge-base context", x: 380, y: 150, color: "#3B82F6" },
      { type: "prompt", label: "Draft Bullet Point Summary", desc: "Construct prompt template requesting key insights, statistics, and risks", x: 680, y: 150, color: "#14B8A6" },
      { type: "gemini", label: "Gemini Summary Compiler", desc: "Compile highly-optimized summaries using gemini-3.5-flash", x: 980, y: 150, color: "#8B5CF6" },
      { type: "api", label: "Post Update to Slack", desc: "Deliver summary text with beautiful rich-text blocks to team channel", x: 1280, y: 150, color: "#06B6D4" },
      { type: "end", label: "Automation Complete", desc: "Close file lock and log success", x: 1580, y: 150, color: "#F43F5E" }
    ],
    edges: [
      { source: "When PDF Uploaded", target: "Fetch Document Content" },
      { source: "Fetch Document Content", target: "Draft Bullet Point Summary" },
      { source: "Draft Bullet Point Summary", target: "Gemini Summary Compiler" },
      { source: "Gemini Summary Compiler", target: "Post Update to Slack" },
      { source: "Post Update to Slack", target: "Automation Complete" }
    ]
  },
  {
    title: "Generate meeting notes automatically",
    description: "When a Calendar event ends, gather participant list, process voice transcripts, structure action-items, and request human review before sending.",
    category: "Collaboration",
    tags: ["Google Calendar", "Transcripts", "Human Approval"],
    nodes: [
      { type: "start", label: "When Calendar Event Ends", desc: "Google Calendar webhook: sync transcripts and attendee metadata", x: 80, y: 150, color: "#10B981" },
      { type: "memory", label: "AI Conversation Context", desc: "Fetch notes, decisions, and action-items from previous sessions", x: 380, y: 150, color: "#F59E0B" },
      { type: "prompt", label: "Draft Action-Items Prompt", desc: "Request bulleted agenda items, decisions made, and assigned owners", x: 680, y: 150, color: "#14B8A6" },
      { type: "gemini", label: "Gemini Meeting Compiler", desc: "Process transcript data to output fully structured minutes", x: 980, y: 150, color: "#8B5CF6" },
      { type: "human_approval", label: "Review Minutes & Agenda", desc: "Pause automation and request human coordinator to review action items", x: 1280, y: 150, color: "#F97316" },
      { type: "email", label: "Broadcast Approved Notes", desc: "Email polished notes and action items to all calendar attendees", x: 1580, y: 150, color: "#0EA5E9" },
      { type: "end", label: "Workspace Synchronized", desc: "Archived meeting logs to file", x: 1880, y: 150, color: "#F43F5E" }
    ],
    edges: [
      { source: "When Calendar Event Ends", target: "AI Conversation Context" },
      { source: "AI Conversation Context", target: "Draft Action-Items Prompt" },
      { source: "Draft Action-Items Prompt", target: "Gemini Meeting Compiler" },
      { source: "Gemini Meeting Compiler", target: "Review Minutes & Agenda" },
      { source: "Review Minutes & Agenda", target: "Broadcast Approved Notes" },
      { source: "Broadcast Approved Notes", target: "Workspace Synchronized" }
    ]
  },
  {
    title: "Reply to customer support emails using AI",
    description: "Scan customer emails, perform semantic search on product manuals, draft professional solutions, and require agent approval before replying.",
    category: "Customer Service",
    tags: ["Inbound Mail", "Smart Retrieval", "Human Approved"],
    nodes: [
      { type: "start", label: "When Support Ticket Arrives", desc: "Monitor incoming helpdesk emails for new support questions", x: 80, y: 150, color: "#10B981" },
      { type: "knowledge_base", label: "Search Technical Docs", desc: "Query internal product wikis and PDF knowledge-bases semantically", x: 380, y: 150, color: "#6366F1" },
      { type: "prompt", label: "Draft Helpful Response", desc: "Assemble custom template including product guidelines and helpful links", x: 680, y: 150, color: "#14B8A6" },
      { type: "gemini", label: "Gemini Helpdesk Solver", desc: "Generate professional answer with zero fluff using gemini-3.5-flash", x: 980, y: 150, color: "#8B5CF6" },
      { type: "human_approval", label: "Review Generated Response", desc: "Enable support agents to modify response, rate quality, or rewrite", x: 1280, y: 150, color: "#F97316" },
      { type: "email", label: "Send Solution to User", desc: "Deliver approved reply back to the user via original mail thread", x: 1580, y: 150, color: "#0EA5E9" },
      { type: "end", label: "Resolved Ticket Logs", desc: "Update support desk status to solved", x: 1880, y: 150, color: "#F43F5E" }
    ],
    edges: [
      { source: "When Support Ticket Arrives", target: "Search Technical Docs" },
      { source: "Search Technical Docs", target: "Draft Helpful Response" },
      { source: "Draft Helpful Response", target: "Gemini Helpdesk Solver" },
      { source: "Gemini Helpdesk Solver", target: "Review Generated Response" },
      { source: "Review Generated Response", target: "Send Solution to User" },
      { source: "Send Solution to User", target: "Resolved Ticket Logs" }
    ]
  },
  {
    title: "Notify me when a GitHub issue is created",
    description: "Monitor code repositories for new bug reports, use Gemini to automatically tag the technical stack involved, and send emergency alerts.",
    category: "DevOps",
    tags: ["GitHub API", "AI Stack Tagging", "Discord Notification"],
    nodes: [
      { type: "start", label: "When GitHub Issue Opened", desc: "GitHub Webhook: listen for new bug reports or feature requests", x: 80, y: 150, color: "#10B981" },
      { type: "gemini", label: "Gemini Code Analyzer", desc: "Determine stack tags (React, Node, DB) and evaluate urgency levels", x: 380, y: 150, color: "#8B5CF6" },
      { type: "condition", label: "If Priority is High", desc: "Split path based on whether code error requires hotfix", x: 680, y: 150, color: "#EF4444" },
      { type: "api", label: "Post Discord Alert Channel", desc: "Send rich red bug report embedding directly to dev channel", x: 980, y: 120, color: "#06B6D4" },
      { type: "end", label: "Log Standard Alert State", desc: "Create silent backlog notification record", x: 980, y: 280, color: "#F43F5E" }
    ],
    edges: [
      { source: "When GitHub Issue Opened", target: "Gemini Code Analyzer" },
      { source: "Gemini Code Analyzer", target: "If Priority is High" },
      { source: "If Priority is High", target: "Post Discord Alert Channel" },
      { source: "If Priority is High", target: "Log Standard Alert State" }
    ]
  },
  {
    title: "Organize expenses from Gmail",
    description: "Scan daily inbox receipts and tax invoices, parse total charges, category, tax rates and merchant names, then append rows to Sheets.",
    category: "Finance",
    tags: ["Receipt Trigger", "AI Invoice Parser", "Google Sheets"],
    nodes: [
      { type: "start", label: "When Invoice Arrives", desc: "Scan emails containing key terms like 'invoice', 'receipt', 'charge'", x: 80, y: 150, color: "#10B981" },
      { type: "prompt", label: "Draft Expense Summary", desc: "Create structure with merchant name, invoice date, charge and tax category", x: 380, y: 150, color: "#14B8A6" },
      { type: "gemini", label: "Gemini Financial Parser", desc: "Read unstructured receipt layouts and compile standardized metrics", x: 680, y: 150, color: "#8B5CF6" },
      { type: "database", label: "Google Sheets expense log", desc: "Add formatted expense row directly to Finance tracking sheet", x: 980, y: 150, color: "#6366F1" },
      { type: "end", label: "Update Budget Status", desc: "Notify budget supervisor and close transaction audit", x: 1280, y: 150, color: "#F43F5E" }
    ],
    edges: [
      { source: "When Invoice Arrives", target: "Draft Expense Summary" },
      { source: "Draft Expense Summary", target: "Gemini Financial Parser" },
      { source: "Gemini Financial Parser", target: "Google Sheets expense log" },
      { source: "Google Sheets expense log", target: "Update Budget Status" }
    ]
  }
];

export default function AIWizard({ isOpen, onClose, onGenerateWorkflow }: AIWizardProps) {
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [activeSuggestion, setActiveSuggestion] = useState<any>(null);

  const steps = [
    "Interpreting natural language goals...",
    "Designing logical nodes structure...",
    "Configuring app connection credentials...",
    "Compiling optimized prompt templates...",
    "Linking dependencies & parameters rules...",
    "Finalizing high-performance AI flow..."
  ];

  useEffect(() => {
    let timer: any;
    if (isGenerating) {
      timer = setInterval(() => {
        setGenerationStep(prev => {
          if (prev >= steps.length - 1) {
            clearInterval(timer);
            // complete generation!
            handleCompleteGeneration();
            return prev;
          }
          return prev + 1;
        });
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  if (!isOpen) return null;

  const handleSelectSuggestion = (suggestion: any) => {
    setActiveSuggestion(suggestion);
    setPromptInput(suggestion.title);
  };

  const triggerDynamicGeneration = () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setGenerationStep(0);
  };

  const handleCompleteGeneration = () => {
    setTimeout(() => {
      // Find matching template or generate customized nodes
      let targetName = promptInput;
      let targetDesc = "AI-Generated automation designed to achieve: " + promptInput;
      let targetNodes: any[] = [];
      let targetEdges: any[] = [];

      const matched = SUGGESTIONS.find(s => s.title.toLowerCase() === promptInput.toLowerCase() || s.title.includes(promptInput));
      
      if (matched) {
        targetName = matched.title;
        targetDesc = matched.description;
        targetNodes = matched.nodes;
        targetEdges = matched.edges;
      } else {
        // Fallback to dynamic template generation based on input keywords!
        const hasSheets = promptInput.toLowerCase().includes("sheet") || promptInput.toLowerCase().includes("table");
        const hasNotion = promptInput.toLowerCase().includes("notion") || promptInput.toLowerCase().includes("database");
        const hasSlack = promptInput.toLowerCase().includes("slack") || promptInput.toLowerCase().includes("telegram") || promptInput.toLowerCase().includes("discord");
        const hasEmail = promptInput.toLowerCase().includes("email") || promptInput.toLowerCase().includes("gmail") || promptInput.toLowerCase().includes("send");

        targetNodes = [
          { type: "start", label: "When Triggered", desc: `Intelligent trigger: monitor events for: ${promptInput}`, x: 80, y: 150, color: "#10B981" },
          { type: "prompt", label: "AI Instruction Template", desc: "Construct context prompts and template data bindings", x: 380, y: 150, color: "#14B8A6" },
          { type: "gemini", label: "Gemini Intelligent Agent", desc: "Generate expert reasoning solutions using AI Brain", x: 680, y: 150, color: "#8B5CF6" }
        ];

        let nextX = 980;
        if (hasSheets || hasNotion) {
          targetNodes.push({
            type: "database",
            label: hasNotion ? "Notion Database Writer" : "Google Sheets Logger",
            desc: "Save generated content automatically",
            x: nextX,
            y: 150,
            color: "#6366F1"
          });
          nextX += 300;
        }

        if (hasSlack || hasEmail) {
          targetNodes.push({
            type: hasEmail ? "email" : "api",
            label: hasEmail ? "Send Automated Email" : "Notify Slack Workspace",
            desc: "Post compiled reports to communication channels",
            x: nextX,
            y: 150,
            color: hasEmail ? "#0EA5E9" : "#06B6D4"
          });
          nextX += 300;
        }

        targetNodes.push({ type: "end", label: "Automation Finished", desc: "End automation safely", x: nextX, y: 150, color: "#F43F5E" });

        // Build edges sequentially
        for (let i = 0; i < targetNodes.length - 1; i++) {
          targetEdges.push({
            source: targetNodes[i].label,
            target: targetNodes[i+1].label
          });
        }
      }

      // Map positions & configs properly to real WorkflowNode structures
      const compiledNodes: WorkflowNode[] = targetNodes.map((n, idx) => {
        const id = `node_${Date.now()}_${idx}`;
        return {
          id,
          type: n.type as NodeType,
          label: n.label,
          description: n.desc,
          x: n.x,
          y: n.y,
          color: n.color,
          status: "idle",
          config: getPresetConfig(n.type, promptInput)
        };
      });

      // Remap edges to use compiled node ids
      const compiledEdges: WorkflowEdge[] = [];
      targetEdges.forEach((edge, idx) => {
        const srcNode = compiledNodes.find(n => n.label === edge.source);
        const tgtNode = compiledNodes.find(n => n.label === edge.target);
        if (srcNode && tgtNode) {
          compiledEdges.push({
            id: `edge_${Date.now()}_${idx}`,
            source: srcNode.id,
            target: tgtNode.id,
            animated: true
          });
        }
      });

      onGenerateWorkflow(targetName, targetDesc, compiledNodes, compiledEdges);
      setIsGenerating(false);
      onClose();
    }, 1000);
  };

  const getPresetConfig = (type: string, goal: string): NodeConfig => {
    switch (type) {
      case "prompt":
        return {
          promptTemplate: `Goal analysis: ${goal}\n\nPlease filter and structure all parameters:\n- Key priorities\n- Next milestones\n- Deliverables\n\nFormat output cleanly.`,
          variables: [{ name: "input", value: "" }],
          temperature: 0.7,
          model: "gemini-3.5-flash",
          systemPrompt: "You are an expert AI coordinator."
        };
      case "gemini":
        return {
          geminiModel: "gemini-3.5-flash",
          geminiTemperature: 0.3,
          geminiMaxTokens: 2048,
          systemPrompt: "Solve this task with rigorous logic."
        };
      case "memory":
        return {
          memoryType: "conversation",
          memoryKey: "automation_memory",
          knowledgeSource: "System buffer variables"
        };
      case "retriever":
        return {
          topK: 4,
          embeddingSearch: true,
          chunkSize: 1024,
          similarityThreshold: 0.82
        };
      case "tool":
        return {
          toolName: "GoogleSearchGrounding",
          retries: 3,
          timeout: 8000
        };
      default:
        return {};
    }
  };

  return (
    <div className="fixed inset-0 bg-[#06080C]/95 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#090D14] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] max-h-[750px]">
        
        {/* Left Info Column */}
        <div className="md:w-[35%] bg-gradient-to-b from-blue-600/10 via-[#0B1017] to-[#080B0F] p-6 border-r border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
              FlowForge AI
            </div>
            
            <h3 className="text-xl font-bold text-white tracking-tight leading-snug">AI-First Automation Platform</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Skip manually connecting visual boxes. Describe your automation goals in humble, plain English, and let Gemini build the entire node blueprint automatically.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-800/60">
            <div className="flex gap-2 text-[11px] text-slate-400">
              <div className="w-4 h-4 rounded bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-bold font-mono">1</div>
              <span>Describe what you want to achieve</span>
            </div>
            <div className="flex gap-2 text-[11px] text-slate-400">
              <div className="w-4 h-4 rounded bg-blue-500/15 flex items-center justify-center text-blue-400 font-bold font-mono">2</div>
              <span>Gemini automatically drafts nodes & wires</span>
            </div>
            <div className="flex gap-2 text-[11px] text-slate-400">
              <div className="w-4 h-4 rounded bg-purple-500/15 flex items-center justify-center text-purple-400 font-bold font-mono">3</div>
              <span>Open the canvas for precise refinements</span>
            </div>
          </div>
        </div>

        {/* Right Interactor Column */}
        <div className="flex-1 p-8 flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white font-sans uppercase">What would you like to automate?</h2>
              <p className="text-slate-500 text-xs mt-1">Harness advanced language models to create complete workflows in seconds.</p>
            </div>
            <button 
              onClick={onClose}
              disabled={isGenerating}
              className="p-1.5 rounded hover:bg-slate-800/80 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Prompt Form or Generator Animation */}
          {isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-6">
              {/* Spinner */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 opacity-20 animate-pulse"></div>
                <Brain className="w-8 h-8 text-blue-400 animate-bounce" />
              </div>

              {/* Progress step */}
              <div className="space-y-2 text-center max-w-sm">
                <h4 className="text-sm font-semibold text-white animate-pulse">Orchestrating Blueprint Workflow...</h4>
                <div className="text-xs font-mono text-blue-400 font-semibold">{steps[generationStep]}</div>
                
                {/* Visual grid status bars */}
                <div className="flex justify-center gap-1.5 pt-2">
                  {steps.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1 w-6 rounded-full transition-colors duration-300 ${
                        idx <= generationStep ? "bg-blue-500" : "bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-6">
              
              {/* Giant Textbox */}
              <div className="relative">
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g., Save internship emails to Notion and notify Slack budget channel..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[#06080C] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 leading-relaxed shadow-inner font-sans font-medium"
                />
                
                <button
                  onClick={triggerDynamicGeneration}
                  disabled={!promptInput.trim()}
                  className="absolute bottom-4 right-4 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/10"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Generate Flow
                </button>
              </div>

              {/* Examples suggestions header */}
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Example Suggestions & Presets</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2.5">
                  {SUGGESTIONS.map((s) => {
                    const isSelected = promptInput === s.title;
                    return (
                      <button
                        key={s.title}
                        onClick={() => handleSelectSuggestion(s)}
                        className={`p-3.5 rounded-xl border text-left transition-all hover:bg-slate-900/40 cursor-pointer group ${
                          isSelected 
                            ? "bg-blue-600/10 border-blue-500/50" 
                            : "bg-[#06080C]/80 border-slate-800/80"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono font-bold text-blue-400">{s.category}</span>
                          <span className="text-[8px] border border-slate-800 rounded px-1 py-0.5 bg-slate-950 text-slate-500 font-mono">
                            {s.nodes.length} steps
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-xs mt-1 group-hover:text-blue-400 transition-colors">{s.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-normal truncate">{s.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Footer banner */}
          <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between text-[10px] text-slate-500 mt-4">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Powered by server-side Gemini 3.5 Models
            </span>
            <span>FlowForge AI © 2026</span>
          </div>

        </div>

      </div>
    </div>
  );
}
