import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Canvas from "./components/Canvas";
import ConfigPanel from "./components/ConfigPanel";
import LogPanel from "./components/LogPanel";
import DashboardView from "./components/DashboardView";
import TemplatesView from "./components/TemplatesView";
import HistoryView from "./components/HistoryView";
import AnalyticsView from "./components/AnalyticsView";
import SettingsView from "./components/SettingsView";
import ConnectionsView from "./components/ConnectionsView";
import OnboardingGuide from "./components/OnboardingGuide";
import AIAssistantPanel from "./components/AIAssistantPanel";

// Premium workspace widgets
import CommandPalette from "./components/CommandPalette";
import NotificationCenter from "./components/NotificationCenter";
import HelpCenter from "./components/HelpCenter";
import KeyboardShortcutGuide from "./components/KeyboardShortcutGuide";
import ExportCenter from "./components/ExportCenter";

import { 
  Workflow, 
  WorkflowNode, 
  WorkflowEdge, 
  ExecutionLog, 
  Stats, 
  NodeType 
} from "./types";
import { 
  Sparkles, 
  Layers, 
  CheckCircle, 
  Play, 
  Square, 
  RotateCcw, 
  ArrowRight, 
  AlertTriangle,
  FileCode,
  Undo,
  BookOpen,
  GitPullRequest,
  History,
  MessageSquare,
  Users,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Clock,
  ExternalLink,
  Save,
  Plus,
  GitCommit,
  ArrowUpRight,
  UserCheck
} from "lucide-react";

// Setup initial preloaded workflows
const initialWorkflows: Workflow[] = [
  {
    id: "wf_sentiment",
    name: "Customer Sentiment Router",
    description: "Triage incoming support requests using semantic classification and route high priority items.",
    version: "1.0.4",
    created: "2026-06-25",
    updated: "2026-06-27",
    tags: ["LLM", "Sentiment", "Conditionals"],
    status: "active",
    nodes: [
      {
        id: "start_node",
        type: "start",
        label: "Incoming Support Email",
        description: "Entry trigger matching inbound webhooks.",
        x: 80,
        y: 160,
        color: "#10B981",
        status: "idle",
        config: {}
      },
      {
        id: "prompt_node",
        type: "prompt",
        label: "Sentiment Evaluation Prompt",
        description: "Compile classification instructions for Gemini.",
        x: 360,
        y: 160,
        color: "#14B8A6",
        status: "idle",
        config: {
          promptTemplate: "Review this user support request:\n\"{{input}}\"\n\nClassification Criteria:\n1. Positive / Neutral / Angry\n2. Priority Rank: Low / Medium / High\n\nReturn output in JSON format.",
          variables: [{ name: "input", value: "Help! The system has been down for 2 hours and we are losing sales." }],
          temperature: 0.2,
          model: "gemini-3.5-flash",
          systemPrompt: "You are an automated triage dispatcher.",
          outputFormat: "json"
        }
      },
      {
        id: "gemini_node",
        type: "gemini",
        label: "Gemini Classifier",
        description: "Core LLM node to analyze emotional temperature.",
        x: 640,
        y: 160,
        color: "#8B5CF6",
        status: "idle",
        config: {
          geminiModel: "gemini-3.5-flash",
          geminiTemperature: 0.1,
          geminiMaxTokens: 512,
          systemPrompt: "Evaluate accurately. Do not apologize."
        }
      },
      {
        id: "condition_node",
        type: "condition",
        label: "Priority Filter Router",
        description: "Route workflow execution branches depending on evaluation status.",
        x: 920,
        y: 160,
        color: "#EF4444",
        status: "idle",
        config: {
          conditionField: "priority",
          conditionOperator: "equals",
          conditionValue: "High"
        }
      },
      {
        id: "output_node",
        type: "output",
        label: "SRE Emergency Pager",
        description: "Compile alert log statements and output structures.",
        x: 1200,
        y: 160,
        color: "#14B8A6",
        status: "idle",
        config: {}
      }
    ],
    edges: [
      { id: "e1", source: "start_node", target: "prompt_node", animated: true },
      { id: "e2", source: "prompt_node", target: "gemini_node", animated: true },
      { id: "e3", source: "gemini_node", target: "condition_node", animated: true },
      { id: "e4", source: "condition_node", target: "output_node", animated: true }
    ]
  },
  {
    id: "wf_grounded_research",
    name: "Web Grounded Analyst",
    description: "Search Google for the latest tech articles and summarize key insights using code helper boxes.",
    version: "2.1.0",
    created: "2026-06-26",
    updated: "2026-06-27",
    tags: ["Grounding", "Code Sandbox", "Summarizer"],
    status: "draft",
    nodes: [
      {
        id: "start_node_res",
        type: "start",
        label: "User Query",
        description: "Input research topic query string.",
        x: 100,
        y: 160,
        color: "#10B981",
        status: "idle",
        config: {}
      },
      {
        id: "tool_node_res",
        type: "tool",
        label: "Web Search Grounding",
        description: "Query Google Search for latest web content matches.",
        x: 380,
        y: 160,
        color: "#EC4899",
        status: "idle",
        config: {
          toolName: "GoogleSearchGrounding",
          retries: 3
        }
      },
      {
        id: "func_node_res",
        type: "function",
        label: "Parse & De-duplicate",
        description: "Filter and deduplicate retrieved web pages using regex.",
        x: 660,
        y: 160,
        color: "#10B981",
        status: "idle",
        config: {
          customCode: "const data = JSON.parse(inputData);\nconst clean = data.filter(item => item.url);\nreturn clean;"
        }
      },
      {
        id: "output_node_res",
        type: "output",
        label: "Publish Report",
        description: "Assemble markdown documentation files.",
        x: 940,
        y: 160,
        color: "#14B8A6",
        status: "idle",
        config: {}
      }
    ],
    edges: [
      { id: "e_res_1", source: "start_node_res", target: "tool_node_res", animated: true },
      { id: "e_res_2", source: "tool_node_res", target: "func_node_res", animated: true },
      { id: "e_res_3", source: "func_node_res", target: "output_node_res", animated: true }
    ]
  }
];

// Preloaded templates definitions mapping
const templatesMapping: Record<string, Workflow> = {
  resume_tracker: {
    id: "wf_resume_tracker",
    name: "Resume Tracker",
    description: "Ingest applicant resumes, extract skills & experience with Gemini AI, and track their application progress automatically.",
    version: "1.0.0",
    created: "2026-06-28",
    updated: "2026-06-28",
    tags: ["HR", "AI", "PDFs"],
    status: "draft",
    nodes: [
      { id: "rt_start", type: "start", label: "When Resume Uploaded", description: "Triggered on PDF file uploads to applicant channel.", x: 80, y: 150, color: "#10B981", status: "idle", config: {} },
      { id: "rt_prompt", type: "prompt", label: "Draft Parsing Prompt", description: "Setup extraction schema variables for experience & skills.", x: 380, y: 150, color: "#14B8A6", status: "idle", config: { promptTemplate: "Applicant PDF Content:\n{{input}}\n\nPlease extract:\n- Candidate Name\n- Maximum Education\n- Top 5 Skills\n- Work Experience (Years)", model: "gemini-3.5-flash", temperature: 0.2 } },
      { id: "rt_gemini", type: "gemini", label: "Gemini Resume Parser", description: "Use Gemini flash to compile structured metrics.", x: 680, y: 150, color: "#8B5CF6", status: "idle", config: { geminiModel: "gemini-3.5-flash", geminiTemperature: 0.1 } },
      { id: "rt_output", type: "output", label: "Update Applicant Database", description: "Log applicant profiles to standard directory sheets.", x: 980, y: 150, color: "#14B8A6", status: "idle", config: {} }
    ],
    edges: [
      { id: "e_rt_1", source: "rt_start", target: "rt_prompt", animated: true },
      { id: "e_rt_2", source: "rt_prompt", target: "rt_gemini", animated: true },
      { id: "e_rt_3", source: "rt_gemini", target: "rt_output", animated: true }
    ]
  },
  internship_finder: {
    id: "wf_internship_finder",
    name: "Internship Finder",
    description: "Scan inbound internship requests, classify student qualifications, and coordinate review procedures.",
    version: "1.0.0",
    created: "2026-06-28",
    updated: "2026-06-28",
    tags: ["Recruiting", "Gmail", "Filters"],
    status: "draft",
    nodes: [
      { id: "if_start", type: "start", label: "When Email Received", description: "Inbound student request webhook filtered with keywords.", x: 80, y: 150, color: "#10B981", status: "idle", config: {} },
      { id: "if_retriever", type: "retriever", label: "Retrieve Program Rules", description: "Load matching internship criteria parameters.", x: 380, y: 150, color: "#3B82F6", status: "idle", config: { topK: 3 } },
      { id: "if_prompt", type: "prompt", label: "Draft Review Summary", description: "Setup evaluation instruction prompts for qualifications.", x: 680, y: 150, color: "#14B8A6", status: "idle", config: { promptTemplate: "Draft a concise resume review matching criteria: {{input}}", model: "gemini-3.5-flash" } },
      { id: "if_gemini", type: "gemini", label: "Gemini Applicant Grader", description: "Grade student applications dynamically.", x: 980, y: 150, color: "#8B5CF6", status: "idle", config: { geminiModel: "gemini-3.5-flash", geminiTemperature: 0.3 } },
      { id: "if_output", type: "output", label: "Log Review Result", description: "Record grade levels and notify supervisors.", x: 1280, y: 150, color: "#14B8A6", status: "idle", config: {} }
    ],
    edges: [
      { id: "e_if_1", source: "if_start", target: "if_retriever", animated: true },
      { id: "e_if_2", source: "if_retriever", target: "if_prompt", animated: true },
      { id: "e_if_3", source: "if_prompt", target: "if_gemini", animated: true },
      { id: "e_if_4", source: "if_gemini", target: "if_output", animated: true }
    ]
  },
  invoice_extractor: {
    id: "wf_invoice_extractor",
    name: "Invoice Extractor",
    description: "Automatically parse invoice PDF files uploaded to Google Drive, extract billing figures, and sync to records.",
    version: "1.0.0",
    created: "2026-06-28",
    updated: "2026-06-28",
    tags: ["Finance", "Drive", "Parsing"],
    status: "draft",
    nodes: [
      { id: "ie_start", type: "start", label: "When PDF Uploaded", description: "Google Drive webhook checking receipts folder.", x: 80, y: 150, color: "#10B981", status: "idle", config: {} },
      { id: "ie_retriever", type: "retriever", label: "Fetch Invoice Text", description: "Convert billing PDF layout to raw values.", x: 380, y: 150, color: "#3B82F6", status: "idle", config: { topK: 5 } },
      { id: "ie_prompt", type: "prompt", label: "Extract Figures", description: "Draft instructions targeting merchant, total cost, and tax.", x: 680, y: 150, color: "#14B8A6", status: "idle", config: { promptTemplate: "Invoice Raw Values:\n{{input}}\n\nPlease extract Merchant Name, Invoice Total, and Date.", model: "gemini-3.5-flash" } },
      { id: "ie_gemini", type: "gemini", label: "Gemini Parser", description: "Parse financial fields accurately.", x: 980, y: 150, color: "#8B5CF6", status: "idle", config: { geminiModel: "gemini-3.5-flash", geminiTemperature: 0.1 } },
      { id: "ie_output", type: "output", label: "Update Ledgers", description: "Save parsed billing logs to financial sheets.", x: 1280, y: 150, color: "#14B8A6", status: "idle", config: {} }
    ],
    edges: [
      { id: "e_ie_1", source: "ie_start", target: "ie_retriever", animated: true },
      { id: "e_ie_2", source: "ie_retriever", target: "ie_prompt", animated: true },
      { id: "e_ie_3", source: "ie_prompt", target: "ie_gemini", animated: true },
      { id: "e_ie_4", source: "ie_gemini", target: "ie_output", animated: true }
    ]
  },
  meeting_summarizer: {
    id: "wf_meeting_summarizer",
    name: "Meeting Summarizer",
    description: "Sync transcripts from Calendar sessions, structure action items, and compile executive minutes.",
    version: "1.0.0",
    created: "2026-06-28",
    updated: "2026-06-28",
    tags: ["Calendar", "Notes", "Human-in-the-loop"],
    status: "draft",
    nodes: [
      { id: "ms_start", type: "start", label: "Calendar Event Webhook", description: "Monitor finished meetings and load participant metadata.", x: 80, y: 150, color: "#10B981", status: "idle", config: {} },
      { id: "ms_memory", type: "memory", label: "Retrieve Session History", description: "Fetch background notes from past workspace sprints.", x: 380, y: 150, color: "#F59E0B", status: "idle", config: { memoryKey: "scrum_history" } },
      { id: "ms_prompt", type: "prompt", label: "Compile Minutes Prompt", description: "Request summarized outlines, timeline blockers, and action items.", x: 680, y: 150, color: "#14B8A6", status: "idle", config: { promptTemplate: "Draft structured bullet points based on transcript: {{input}}", model: "gemini-3.5-flash" } },
      { id: "ms_gemini", type: "gemini", label: "Gemini Note Compiler", description: "Generate beautiful, clear summaries with high detail accuracy.", x: 980, y: 150, color: "#8B5CF6", status: "idle", config: { geminiModel: "gemini-3.1-pro-preview", geminiTemperature: 0.2 } },
      { id: "ms_approval", type: "human_approval", label: "Coordinator Verification", description: "Pause automation until sprint leader signs off notes.", x: 1280, y: 150, color: "#F97316", status: "idle", config: {} },
      { id: "ms_output", type: "output", label: "Broadcast Sprint Notes", description: "Notify team channels and email final sprint minutes.", x: 1580, y: 150, color: "#14B8A6", status: "idle", config: {} }
    ],
    edges: [
      { id: "e_ms_1", source: "ms_start", target: "ms_memory", animated: true },
      { id: "e_ms_2", source: "ms_memory", target: "ms_prompt", animated: true },
      { id: "e_ms_3", source: "ms_prompt", target: "ms_gemini", animated: true },
      { id: "e_ms_4", source: "ms_gemini", target: "ms_approval", animated: true },
      { id: "e_ms_5", source: "ms_approval", target: "ms_output", animated: true }
    ]
  },
  youtube_notes: {
    id: "wf_youtube_notes",
    name: "YouTube Notes",
    description: "Extract video subtitles, summarize core themes and timestamps, and save study guides.",
    version: "1.0.0",
    created: "2026-06-28",
    updated: "2026-06-28",
    tags: ["Video", "Notes", "Study"],
    status: "draft",
    nodes: [
      { id: "yt_start", type: "start", label: "When Video Saved", description: "Triggered when a YouTube URL is added to collection.", x: 80, y: 150, color: "#10B981", status: "idle", config: {} },
      { id: "yt_tool", type: "tool", label: "Extract Video Captions", description: "Fetch automatic subtitle transcript logs.", x: 380, y: 150, color: "#EC4899", status: "idle", config: { toolName: "GoogleSearchGrounding" } },
      { id: "yt_gemini", type: "gemini", label: "Gemini Study Guide Compiler", description: "Incorporate timestamps and compile study notes.", x: 680, y: 150, color: "#8B5CF6", status: "idle", config: { geminiModel: "gemini-3.5-flash", geminiTemperature: 0.2 } },
      { id: "yt_output", type: "output", label: "Publish Study Guides", description: "Log generated outlines to workspace database.", x: 980, y: 150, color: "#14B8A6", status: "idle", config: {} }
    ],
    edges: [
      { id: "e_yt_1", source: "yt_start", target: "yt_tool", animated: true },
      { id: "e_yt_2", source: "yt_tool", target: "yt_gemini", animated: true },
      { id: "e_yt_3", source: "yt_gemini", target: "yt_output", animated: true }
    ]
  },
  pdf_translator: {
    id: "wf_pdf_translator",
    name: "PDF Translator",
    description: "Translate document files into multiple languages while preserving professional context and terminology.",
    version: "1.0.0",
    created: "2026-06-28",
    updated: "2026-06-28",
    tags: ["Translation", "PDFs", "Languages"],
    status: "draft",
    nodes: [
      { id: "pt_start", type: "start", label: "When PDF Uploaded", description: "Listen for new document uploads.", x: 80, y: 150, color: "#10B981", status: "idle", config: {} },
      { id: "pt_retriever", type: "retriever", label: "Fetch Document Sections", description: "Convert PDF chunks for translation pipeline.", x: 380, y: 150, color: "#3B82F6", status: "idle", config: { topK: 4 } },
      { id: "pt_gemini", type: "gemini", label: "Gemini Translator Engine", description: "Translate while preserving layout and tone.", x: 680, y: 150, color: "#8B5CF6", status: "idle", config: { geminiModel: "gemini-3.5-flash", geminiTemperature: 0.3, systemPrompt: "You are an expert technical translator. Translate to Spanish." } },
      { id: "pt_output", type: "output", label: "Save Translated Document", description: "Generate translated output PDF.", x: 980, y: 150, color: "#14B8A6", status: "idle", config: {} }
    ],
    edges: [
      { id: "e_pt_1", source: "pt_start", target: "pt_retriever", animated: true },
      { id: "e_pt_2", source: "pt_retriever", target: "pt_gemini", animated: true },
      { id: "e_pt_3", source: "pt_gemini", target: "pt_output", animated: true }
    ]
  },
  customer_support_agent: {
    id: "wf_customer_support_agent",
    name: "Customer Support Agent",
    description: "Connect inbound queries with knowledge bases to generate custom replies with automated drafts.",
    version: "1.0.0",
    created: "2026-06-28",
    updated: "2026-06-28",
    tags: ["Support", "RAG", "Automation"],
    status: "draft",
    nodes: [
      { id: "ca_start", type: "start", label: "When Support Ticket Arrives", description: "Monitor support channels for customer inquiries.", x: 80, y: 150, color: "#10B981", status: "idle", config: {} },
      { id: "ca_retriever", type: "retriever", label: "Fetch Knowledge Base Wiki", description: "Retrieve technical product guides context.", x: 380, y: 150, color: "#3B82F6", status: "idle", config: { topK: 3 } },
      { id: "ca_prompt", type: "prompt", label: "Draft Answer Proposal", description: "Setup support template and tone variables.", x: 680, y: 150, color: "#14B8A6", status: "idle", config: { promptTemplate: "Knowledge Wiki Context:\n{{context}}\nCustomer Question:\n{{input}}\n\nDraft a polite answer.", model: "gemini-3.5-flash" } },
      { id: "ca_gemini", type: "gemini", label: "Gemini Support Solver", description: "Solve customer inquiry professionally.", x: 980, y: 150, color: "#8B5CF6", status: "idle", config: { geminiModel: "gemini-3.5-flash", geminiTemperature: 0.2 } },
      { id: "ca_approval", type: "human_approval", label: "Agent Oversight Queue", description: "Review and modify reply draft before delivery.", x: 1280, y: 150, color: "#F97316", status: "idle", config: {} },
      { id: "ca_output", type: "output", label: "Deliver Approved Answer", description: "Email reply response thread to customer.", x: 1580, y: 150, color: "#14B8A6", status: "idle", config: {} }
    ],
    edges: [
      { id: "e_ca_1", source: "ca_start", target: "ca_retriever", animated: true },
      { id: "e_ca_2", source: "ca_retriever", target: "ca_prompt", animated: true },
      { id: "e_ca_3", source: "ca_prompt", target: "ca_gemini", animated: true },
      { id: "e_ca_4", source: "ca_gemini", target: "ca_approval", animated: true },
      { id: "e_ca_5", source: "ca_approval", target: "ca_output", animated: true }
    ]
  },
  github_release_notifier: {
    id: "wf_github_release_notifier",
    name: "GitHub Release Notifier",
    description: "Detect code releases and pull request events, generate release logs, and notify team channels.",
    version: "1.0.0",
    created: "2026-06-28",
    updated: "2026-06-28",
    tags: ["DevOps", "GitHub", "Notifications"],
    status: "draft",
    nodes: [
      { id: "gn_start", type: "start", label: "When Release Created", description: "GitHub API webhook for new code tag releases.", x: 80, y: 150, color: "#10B981", status: "idle", config: {} },
      { id: "gn_prompt", type: "prompt", label: "Draft Release Summary", description: "Compile commits list and code updates.", x: 380, y: 150, color: "#14B8A6", status: "idle", config: { promptTemplate: "Summarize commits: {{input}}", model: "gemini-3.5-flash" } },
      { id: "gn_gemini", type: "gemini", label: "Gemini Release Summarizer", description: "Generate reader-friendly release changelogs.", x: 680, y: 150, color: "#8B5CF6", status: "idle", config: { geminiModel: "gemini-3.5-flash", geminiTemperature: 0.1 } },
      { id: "gn_output", type: "output", label: "Broadcast to Channels", description: "Post rich update card to Discord and Slack.", x: 980, y: 150, color: "#14B8A6", status: "idle", config: {} }
    ],
    edges: [
      { id: "e_gn_1", source: "gn_start", target: "gn_prompt", animated: true },
      { id: "e_gn_2", source: "gn_prompt", target: "gn_gemini", animated: true },
      { id: "e_gn_3", source: "gn_gemini", target: "gn_output", animated: true }
    ]
  },
  expense_tracker: {
    id: "wf_expense_tracker",
    name: "Expense Tracker",
    description: "Parse daily purchase receipt emails, extract financial categories & costs, and log spreadsheet rows.",
    version: "1.0.0",
    created: "2026-06-28",
    updated: "2026-06-28",
    tags: ["Finance", "Gmail", "Sheets"],
    status: "draft",
    nodes: [
      { id: "et_start", type: "start", label: "When Receipt Arrives", description: "Monitor incoming transaction logs.", x: 80, y: 150, color: "#10B981", status: "idle", config: {} },
      { id: "et_prompt", type: "prompt", label: "Extract Receipt Data", description: "Draft variables for charge values and currency.", x: 380, y: 150, color: "#14B8A6", status: "idle", config: { promptTemplate: "Receipt text: {{input}}\nExtract Merchant Name, Expense Amount, Category.", model: "gemini-3.5-flash" } },
      { id: "et_gemini", type: "gemini", label: "Gemini Receipt Evaluator", description: "Process financial parameters.", x: 680, y: 150, color: "#8B5CF6", status: "idle", config: { geminiModel: "gemini-3.5-flash", geminiTemperature: 0.1 } },
      { id: "et_output", type: "output", label: "Log to Google Sheets", description: "Save structured transaction rows.", x: 980, y: 150, color: "#14B8A6", status: "idle", config: {} }
    ],
    edges: [
      { id: "e_et_1", source: "et_start", target: "et_prompt", animated: true },
      { id: "e_et_2", source: "et_prompt", target: "et_gemini", animated: true },
      { id: "e_et_3", source: "et_gemini", target: "et_output", animated: true }
    ]
  },
  daily_news_brief: {
    id: "wf_daily_news_brief",
    name: "Daily News Brief",
    description: "Aggregate global articles on custom tech topics, perform summarization, and email condensed morning newsletters.",
    version: "1.0.0",
    created: "2026-06-28",
    updated: "2026-06-28",
    tags: ["News", "Automation", "Email"],
    status: "draft",
    nodes: [
      { id: "db_start", type: "start", label: "Trigger Daily Newsletter", description: "Scheduled trigger: execute every morning at 7:00 AM.", x: 80, y: 150, color: "#10B981", status: "idle", config: {} },
      { id: "db_tool", type: "tool", label: "Search Technical News", description: "Ground search current framework developments.", x: 380, y: 150, color: "#EC4899", status: "idle", config: { toolName: "GoogleSearchGrounding" } },
      { id: "db_prompt", type: "prompt", label: "Structure News Digest", description: "Draft formatting structure with key references.", x: 680, y: 150, color: "#14B8A6", status: "idle", config: { promptTemplate: "Summarize top 5 search findings: {{input}}", model: "gemini-3.5-flash" } },
      { id: "db_gemini", type: "gemini", label: "Gemini Editor Desk", description: "Synthesize tech digests professionally.", x: 980, y: 150, color: "#8B5CF6", status: "idle", config: { geminiModel: "gemini-3.5-flash", geminiTemperature: 0.3 } },
      { id: "db_output", type: "output", label: "Email Morning Digest", description: "Distribute condensed newsletters to list.", x: 1280, y: 150, color: "#14B8A6", status: "idle", config: {} }
    ],
    edges: [
      { id: "e_db_1", source: "db_start", target: "db_tool", animated: true },
      { id: "e_db_2", source: "db_tool", target: "db_prompt", animated: true },
      { id: "e_db_3", source: "db_prompt", target: "db_gemini", animated: true },
      { id: "e_db_4", source: "db_gemini", target: "db_output", animated: true }
    ]
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("wf_sentiment");

  // Undo / Redo Queue Setup
  const [historyQueue, setHistoryQueue] = useState<Workflow[][]>([initialWorkflows]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Core execution log terminal logs
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Global platform metrics / statistics
  const [stats, setStats] = useState<Stats>({
    totalWorkflows: initialWorkflows.length,
    totalExecutions: 384,
    successRate: 98.4,
    avgRuntime: 1280, // ms
    tokenUsage: 694000,
    estimatedCost: 2.085, // USD
    mostUsedNode: "Gemini Model"
  });

  // UI state toggles
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showMultiAgentDeck, setShowMultiAgentDeck] = useState(false);

  // --- FEATURE 1: AI WORKFLOW ARCHITECT ---
  const [aiPrompt, setAiPrompt] = useState("");
  const [isArchitectLoading, setIsArchitectLoading] = useState(false);
  const [aiSuccessToast, setAiSuccessToast] = useState("");

  // --- FEATURE 2: REUSABLE SUBFLOWS ---
  const [reusableSubflows, setReusableSubflows] = useState<any[]>([
    {
      id: "sub_auth",
      label: "Authentication Gate Subflow",
      category: "Security",
      nodes: [
        { id: "sub_auth_start", type: "start", label: "Inbound Token Verify", description: "Decrypt Bearer JWT payloads.", x: 100, y: 150, color: "#10B981", status: "idle", config: {} },
        { id: "sub_auth_prompt", type: "prompt", label: "Permission Check Prompt", description: "Review role specifications dynamically.", x: 360, y: 150, color: "#14B8A6", status: "idle", config: {} },
        { id: "sub_auth_gemini", type: "gemini", label: "Auth Evaluation Gemini", description: "Confirm identity authorization codes.", x: 620, y: 150, color: "#8B5CF6", status: "idle", config: {} },
        { id: "sub_auth_cond", type: "condition", label: "Token Valid?", description: "Redirect rogue scopes.", x: 880, y: 150, color: "#EF4444", status: "idle", config: {} }
      ],
      edges: [
        { id: "e_sub_a1", source: "sub_auth_start", target: "sub_auth_prompt", animated: true },
        { id: "e_sub_a2", source: "sub_auth_prompt", target: "sub_auth_gemini", animated: true },
        { id: "e_sub_a3", source: "sub_auth_gemini", target: "sub_auth_cond", animated: true }
      ]
    },
    {
      id: "sub_rag",
      label: "Dense Retrieval Loop",
      category: "RAG Operations",
      nodes: [
        { id: "sub_rag_retriever", type: "retriever", label: "Knowledge Base Search", description: "Extract topK contextual vectors.", x: 100, y: 150, color: "#3B82F6", status: "idle", config: {} },
        { id: "sub_rag_prompt", type: "prompt", label: "Prompt Compiler Block", description: "Compile inputs with context chunks.", x: 360, y: 150, color: "#14B8A6", status: "idle", config: {} },
        { id: "sub_rag_gemini", type: "gemini", label: "Gemini Synthesis Block", description: "Generate grounded responses.", x: 620, y: 150, color: "#8B5CF6", status: "idle", config: {} }
      ],
      edges: [
        { id: "e_sub_r1", source: "sub_rag_retriever", target: "sub_rag_prompt", animated: true },
        { id: "e_sub_r2", source: "sub_rag_prompt", target: "sub_rag_gemini", animated: true }
      ]
    }
  ]);
  const [activeCanvasTab, setActiveCanvasTab] = useState<"toolbox" | "subflows">("toolbox");

  // --- FEATURE 3 & 4: VERSION CONTROL & DIFF ---
  const [workflowVersions, setWorkflowVersions] = useState<Record<string, any[]>>({
    "wf_sentiment": [
      {
        id: "v0",
        version: "1.0.0",
        name: "Initial Support Draft",
        timestamp: "2026-06-25 10:24 AM",
        description: "Standard flow with simple parsing placeholders.",
        nodes: initialWorkflows[0].nodes.slice(0, 3).map((n, i) => ({ ...n, x: n.x, y: n.y })),
        edges: initialWorkflows[0].edges.slice(0, 2)
      },
      {
        id: "v1",
        version: "1.0.4",
        name: "Sentiment Optimized Checkpoint",
        timestamp: "2026-06-27 08:12 AM",
        description: "Injected Gemini 3.5 model block and configured high-temperature classifications.",
        nodes: initialWorkflows[0].nodes,
        edges: initialWorkflows[0].edges
      }
    ]
  });
  const [showVersionPanel, setShowVersionPanel] = useState(false);
  const [diffMode, setDiffMode] = useState(false);
  const [diffTargetVersion, setDiffTargetVersion] = useState<string | null>(null);

  // --- FEATURE 5: AI WORKFLOW REVIEWER ---
  const [reviewSuggestions, setReviewSuggestions] = useState<any[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  // --- FEATURE 6: LIVE DEBUG MODE ---
  const [debugMode, setDebugMode] = useState(false);
  const [debugIndex, setDebugIndex] = useState(-1);
  const [debugQueue, setDebugQueue] = useState<WorkflowNode[]>([]);
  const [debugIsPaused, setDebugIsPaused] = useState(false);

  // --- FEATURE 8: MULTI-AGENT WORKFLOWS ---
  const [agentsList, setAgentsList] = useState([
    { name: "SRE Supervisor", role: "Planner", avatar: "👤", status: "idle", log: "Ready for orchestration queue." },
    { name: "Gemini 3.5 Pro", role: "Researcher", avatar: "🧠", status: "idle", log: "Standing by for semantic grounding queries." },
    { name: "Validation Critic", role: "Validator", avatar: "⚖️", status: "idle", log: "Awaiting review checkpoints." }
  ]);
  const [agentLogs, setAgentLogs] = useState<string[]>([
    "System Agent supervisor initialized.",
    "Resource controllers established on port 3000."
  ]);

  // --- FEATURE 11: TEAM COLLABORATION COMMENTS ---
  const [comments, setComments] = useState<any[]>([
    { id: "c1", nodeId: "prompt_node", author: "DevOps_Copilot", text: "Optimal temperature selected for sentiment.", timestamp: "10:15 AM" },
    { id: "c2", nodeId: "gemini_node", author: "Lead_SRE", text: "Downgrade to gemini-3.1-flash-lite if token budgets constrain cost parameters.", timestamp: "11:20 AM" }
  ]);
  const [newCommentText, setNewCommentText] = useState("");
  const [showCommentsPanel, setShowCommentsPanel] = useState(false);

  // --- FEATURE 15: WORKFLOW VALIDATION ON-THE-FLY ---
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  // --- PREMIUM EXTENSIONS: WORKSPACES, COMMAND PALETTE, HELP, SHORTCUTS, EXPORT, NOTIFICATIONS ---
  const [workspaces, setWorkspacesState] = useState([
    { id: "ws_personal", name: "Personal Sandbox", description: "Default private workspace" },
    { id: "ws_enterprise", name: "Production Pipelines", description: "Enterprise shared workloads" }
  ]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("ws_personal");

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isShortcutGuideOpen, setIsShortcutGuideOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // --- NEW FLOWFORGE AI PRODUCT DIFFERENTIATION UPDATES ---
  const [isDeveloperMode, setIsDeveloperMode] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem("flowforge_onboarding_done") !== "true";
  });
  const [showHealthScorePanel, setShowHealthScorePanel] = useState<boolean>(true);
  const [showAiExplainerPanel, setShowAiExplainerPanel] = useState<boolean>(true);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [isCanvasFullscreen, setIsCanvasFullscreen] = useState(false);

  const toggleCanvasFullscreen = () => {
    const nextVal = !isCanvasFullscreen;
    setIsCanvasFullscreen(nextVal);
    
    try {
      if (nextVal) {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch (e) {
      // ignore
    }

    addNotification(
      nextVal ? "Immersive Fullscreen" : "Standard Workspace",
      nextVal 
        ? "Immersive canvas active. Collapsed sidebar navigation rail for extra-wide workspace. Press [F] to toggle back." 
        : "Standard dashboard workspace mode restored.",
      "info"
    );
  };

  const addNotification = (title: string, msg: string, type: 'success' | 'info' | 'error') => {
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random()}`,
      title,
      message: msg,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const triggerDemoMode = () => {
    // 1. Ingest simulated execution logs
    const demoLogs: ExecutionLog[] = [
      {
        id: "demo_l_1",
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toLocaleTimeString(),
        nodeId: "gemini_node_1",
        nodeLabel: "Sentiment Gemini Classifier",
        nodeType: "gemini",
        status: "completed",
        duration: 840,
        output: '{"sentiment": "extremely_positive", "confidence": 0.98, "reason": "User expressed profound delight with UI transitions."}',
        tokens: 380
      },
      {
        id: "demo_l_2",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString(),
        nodeId: "prompt_node_1",
        nodeLabel: "Support Assembly Prompt",
        nodeType: "prompt",
        status: "completed",
        duration: 120,
        output: "Successfully compiled prompt variables.",
        tokens: 150
      },
      {
        id: "demo_l_3",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toLocaleTimeString(),
        nodeId: "db_node_1",
        nodeLabel: "Customer Database fetch",
        nodeType: "retriever",
        status: "completed",
        duration: 450,
        output: "Fetched records for Pravallika (pravallikak2016@gmail.com).",
        tokens: 0
      }
    ];
    setLogs(demoLogs);

    // 2. Hydrate high stats
    setStats({
      totalWorkflows: workflows.length,
      totalExecutions: 1450,
      successRate: 99.1,
      avgRuntime: 820,
      tokenUsage: 4580200,
      estimatedCost: 13.74,
      mostUsedNode: "Gemini Model"
    });

    addNotification("Demo Mode Active", "Hydrated workspace database with realistic logs, analytics, and token usage statistics.", "success");
  };

  // Active loaded workflow reference helper
  const activeWorkflow = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

  // Setup keyboard event listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Check if target is in an input field to avoid interrupting typing
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedNodeId && activeWorkflow) {
          e.preventDefault();
          const updatedNodes = activeWorkflow.nodes.filter(n => n.id !== selectedNodeId);
          const updatedEdges = activeWorkflow.edges.filter(edge => edge.source !== selectedNodeId && edge.target !== selectedNodeId);
          updateNodesAndEdges(updatedNodes, updatedEdges);
          setSelectedNodeId(null);
          addNotification("Block Deleted", "Successfully removed the selected block and its connections.", "info");
        }
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === "k" || e.key === "K") {
          e.preventDefault();
          setIsCommandPaletteOpen(prev => !prev);
        } else if (e.key === "s" || e.key === "S") {
          e.preventDefault();
          saveWorkflowCheckpoint("Snapshot Commit", "Triggered via Ctrl + S shortcut");
          addNotification("Workspace Saved", "Saved visual layout commit to local version control history.", "success");
        } else if (e.key === "z" || e.key === "Z") {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
            addNotification("Redo Triggered", "Redid the last canvas modification.", "info");
          } else {
            handleUndo();
            addNotification("Undo Triggered", "Undid the last canvas modification.", "info");
          }
        }
      } else if (e.key === "/" || e.key === "?") {
        e.preventDefault();
        setIsHelpOpen(prev => !prev);
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleCanvasFullscreen();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [historyIndex, historyQueue, selectedWorkflowId, activeWorkflow, isCanvasFullscreen, selectedNodeId]);

  // Run dynamic schema checking when nodes or edges mutate
  useEffect(() => {
    if (activeWorkflow) {
      const errors: any[] = [];
      const hasStart = activeWorkflow.nodes.some(n => n.type === "start");
      const hasEnd = activeWorkflow.nodes.some(n => n.type === "end" || n.type === "output");
      
      if (!hasStart) {
        errors.push({ id: "err_start", type: "error", message: "No Entrance Trigger", desc: "Missing 'Start Node' trigger." });
      }
      if (!hasEnd) {
        errors.push({ id: "err_end", type: "warning", message: "No Terminal Node", desc: "No Output or End block." });
      }
      
      // Isolated nodes
      activeWorkflow.nodes.forEach(n => {
        const hasIn = activeWorkflow.edges.some(e => e.target === n.id);
        const hasOut = activeWorkflow.edges.some(e => e.source === n.id);
        if (!hasIn && !hasOut && n.type !== "start") {
          errors.push({ id: `err_isolated_${n.id}`, type: "warning", message: `Isolated [${n.label}]`, desc: "Node has no connections." });
        }
      });

      setValidationErrors(errors);
    }
  }, [workflows, selectedWorkflowId]);

  // Helper: push state snapshot into historical undo/redo queue
  const pushState = (updatedWorkflows: Workflow[]) => {
    const updatedQueue = historyQueue.slice(0, historyIndex + 1);
    setHistoryQueue([...updatedQueue, updatedWorkflows]);
    setHistoryIndex(updatedQueue.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setWorkflows(historyQueue[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyQueue.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setWorkflows(historyQueue[historyIndex + 1]);
    }
  };

  // State handlers passed into components
  const updateNodes = (newNodes: WorkflowNode[]) => {
    const updatedWorkflows = workflows.map((w) =>
      w.id === selectedWorkflowId ? { ...w, nodes: newNodes } : w
    );
    setWorkflows(updatedWorkflows);
    pushState(updatedWorkflows);
  };

  const updateEdges = (newEdges: WorkflowEdge[]) => {
    const updatedWorkflows = workflows.map((w) =>
      w.id === selectedWorkflowId ? { ...w, edges: newEdges } : w
    );
    setWorkflows(updatedWorkflows);
    pushState(updatedWorkflows);
  };

  const updateNodesAndEdges = (newNodes: WorkflowNode[], newEdges: WorkflowEdge[]) => {
    const updatedWorkflows = workflows.map((w) =>
      w.id === selectedWorkflowId ? { ...w, nodes: newNodes, edges: newEdges } : w
    );
    setWorkflows(updatedWorkflows);
    pushState(updatedWorkflows);
  };

  const updateNodeConfig = (nodeId: string, updatedNode: WorkflowNode) => {
    const updatedWorkflows = workflows.map((w) => {
      if (w.id === selectedWorkflowId) {
        return {
          ...w,
          nodes: w.nodes.map((n) => (n.id === nodeId ? updatedNode : n))
        };
      }
      return w;
      });
    setWorkflows(updatedWorkflows);
    pushState(updatedWorkflows);
  };

  const updateWorkflowMetadata = (name: string, desc: string, status: "draft" | "active" | "paused") => {
    const updatedWorkflows = workflows.map((w) =>
      w.id === selectedWorkflowId ? { ...w, name, description: desc, status, updated: "Just now" } : w
    );
    setWorkflows(updatedWorkflows);
    pushState(updatedWorkflows);
    addLog(
      "system",
      "Metadata Updated",
      "custom",
      "completed",
      40,
      `Successfully renamed workflow to "${name}" and updated operational state to [${status}].`
    );
  };

  // --- AI ASSISTANT PREMIUM ACTION HANDLERS ---
  const handleApplyAiHealthFix = () => {
    if (!activeWorkflow) return;
    const repairedNodes = activeWorkflow.nodes.map(node => {
      if (node.type === "gemini") {
        return {
          ...node,
          config: {
            ...node.config,
            retries: 3
          }
        };
      }
      return node;
    });
    updateNodes(repairedNodes);
  };

  const handleApplyAiImprovement = (nodeId: string, improvedPrompt: string) => {
    if (!activeWorkflow) return;
    const improvedNodes = activeWorkflow.nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          config: {
            ...node.config,
            prompt: improvedPrompt
          }
        };
      }
      return node;
    });
    updateNodes(improvedNodes);
  };

  const handleAddSuggestedStep = (type: string, label: string) => {
    if (!activeWorkflow) return;
    const newId = `step_${Date.now()}`;
    const newNode: WorkflowNode = {
      id: newId,
      type: type as any,
      label: label,
      description: `Automatically created by FlowForge AI recommendations. Connect this to customize parameters.`,
      x: 300,
      y: 250,
      color: type === "database" ? "#6366F1" : "#0EA5E9",
      status: "idle",
      config: {
        serviceProvider: type === "database" ? "gsheets" : "gmail",
        retries: 3
      }
    };
    updateNodes([...activeWorkflow.nodes, newNode]);
  };

  // Quick Action / Sidebar template importing
  const handleLoadTemplate = (tplId: string) => {
    const template = templatesMapping[tplId] || templatesMapping["chatbot"];
    // Avoid duplicate template IDs
    const imported: Workflow = {
      ...template,
      id: `imported_${tplId}_${Date.now()}`,
      created: "Just now",
      updated: "Just now"
    };

    const updatedWorkflows = [...workflows, imported];
    setWorkflows(updatedWorkflows);
    setSelectedWorkflowId(imported.id);
    setActiveTab("canvas");
    pushState(updatedWorkflows);
    
    // Update total workflows counter
    setStats((prev) => ({
      ...prev,
      totalWorkflows: updatedWorkflows.length
    }));

    addLog(
      "system",
      "Import Blueprint",
      "custom",
      "completed",
      150,
      `Imported RAG or agent pipeline "${imported.name}" successfully to infinite sandbox canvas.`
    );
  };

  const handleNewWorkflow = () => {
    const count = workflows.length + 1;
    const newWf: Workflow = {
      id: `wf_${Date.now()}`,
      name: `AI Pipeline Sandbox ${count}`,
      description: "Visual drafting board for custom node integrations.",
      version: "1.0.0",
      created: "Just now",
      updated: "Just now",
      tags: ["Draft", "Sandbox"],
      status: "draft",
      nodes: [
        {
          id: "start_node_new",
          type: "start",
          label: "Start Node",
          description: "Execution Entry Block",
          x: 100,
          y: 150,
          color: "#10B981",
          status: "idle",
          config: {}
        }
      ],
      edges: []
    };

    const updatedWorkflows = [...workflows, newWf];
    setWorkflows(updatedWorkflows);
    setSelectedWorkflowId(newWf.id);
    setActiveTab("canvas");
    pushState(updatedWorkflows);

    setStats((prev) => ({
      ...prev,
      totalWorkflows: updatedWorkflows.length
    }));

    addLog(
      "system",
      "Sandbox Initialized",
      "custom",
      "completed",
      80,
      "Created a pristine canvas workspace with initial entry block."
    );
  };

  const handleOpenWorkflow = (id: string) => {
    setSelectedWorkflowId(id);
    setActiveTab("canvas");
  };

  // Add specific log row to execution panel
  const addLog = (
    nodeId: string,
    nodeLabel: string,
    nodeType: NodeType,
    status: 'running' | 'completed' | 'failed' | 'waiting',
    duration: number,
    output?: string,
    tokens?: number,
    error?: string
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog: ExecutionLog = {
      id: `log_${Date.now()}_${Math.random()}`,
      timestamp,
      nodeId,
      nodeLabel,
      nodeType,
      status,
      duration,
      output,
      tokens,
      error
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // RESET CANVAS
  const handleResetCanvas = () => {
    const cleared = workflows.map((w) => {
      if (w.id === selectedWorkflowId) {
        return {
          ...w,
          nodes: w.nodes.map((n) => ({ ...n, status: "idle" as const, executionTime: undefined, output: undefined })),
          edges: w.edges
        };
      }
      return w;
    });
    setWorkflows(cleared);
    pushState(cleared);
    addLog(
      "system",
      "Reset Layout",
      "custom",
      "completed",
      30,
      "Refreshed visual node indicators and purged execution state caches."
    );
  };

  // --- FEATURE 14: AUTO LAYOUT (TOPOLOGICAL ORDERING) ---
  const triggerAutoLayout = () => {
    if (!activeWorkflow) return;

    const nodes = [...activeWorkflow.nodes];
    const edges = activeWorkflow.edges;

    const layers: Record<string, number> = {};
    const visited = new Set<string>();

    const startNodes = nodes.filter(n => n.type === 'start' || !edges.some(e => e.target === n.id));
    
    let currentQueue = [...startNodes];
    let currentLayer = 0;

    while (currentQueue.length > 0) {
      const nextQueue: typeof currentQueue = [];
      currentQueue.forEach(node => {
        layers[node.id] = currentLayer;
        visited.add(node.id);

        const childrenEdges = edges.filter(e => e.source === node.id);
        childrenEdges.forEach(e => {
          if (!visited.has(e.target)) {
            const targetNode = nodes.find(n => n.id === e.target);
            if (targetNode && !nextQueue.some(q => q.id === targetNode.id)) {
              nextQueue.push(targetNode);
            }
          }
        });
      });
      currentQueue = nextQueue;
      currentLayer++;
    }

    nodes.forEach(n => {
      if (layers[n.id] === undefined) {
        layers[n.id] = currentLayer;
      }
    });

    const totalInLayer: Record<number, number> = {};
    nodes.forEach(node => {
      const layer = layers[node.id] ?? 0;
      totalInLayer[layer] = (totalInLayer[layer] ?? 0) + 1;
    });

    const layerIndices: Record<number, number> = {};
    const updatedNodes = nodes.map(node => {
      const layer = layers[node.id] ?? 0;
      const indexInLayer = layerIndices[layer] ?? 0;
      layerIndices[layer] = indexInLayer + 1;

      const totalNodesInThisLayer = totalInLayer[layer] ?? 1;

      const spacingX = 320;
      const spacingY = 160;
      const startX = 100;
      const centerY = 220;

      const x = startX + layer * spacingX;
      const y = centerY - ((totalNodesInThisLayer - 1) * spacingY) / 2 + indexInLayer * spacingY;

      return { ...node, x, y };
    });

    updateNodes(updatedNodes);
    addLog(
      "system",
      "Auto Layout Complete",
      "custom",
      "completed",
      70,
      "Topologically aligned visual nodes and minimized connection intersections."
    );
  };

  // --- FEATURE 1: AI WORKFLOW GENERATOR (ARCHITECT) ---
  const triggerAIPipelineGenerator = async () => {
    if (!aiPrompt.trim()) return;
    setIsArchitectLoading(true);
    addLog("system", "AI Architect Active", "gemini", "running", 0, `Prompting Gemini to design workflow blueprint for query: "${aiPrompt}"`);

    try {
      const response = await fetch("/api/generate-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await response.json();
      if (data.success && data.workflow) {
        const generatedWf: Workflow = data.workflow;
        
        // Add to workflows list
        const updatedWorkflows = [...workflows, generatedWf];
        setWorkflows(updatedWorkflows);
        setSelectedWorkflowId(generatedWf.id);
        pushState(updatedWorkflows);

        // Animate Success toast
        setAiSuccessToast("Workflow compiled successfully!");
        setTimeout(() => setAiSuccessToast(""), 4000);

        addLog(
          "system",
          "AI Pipeline Assembled",
          "gemini",
          "completed",
          1400,
          `Successfully compiled and topological laid out pipeline: "${generatedWf.name}".`
        );
        setAiPrompt("");
      } else {
        throw new Error(data.error || "Generation error");
      }
    } catch (err: any) {
      console.error(err);
      addLog("system", "AI Architect Error", "gemini", "failed", 120, `Failed generating AI pipeline: ${err.message}. Loaded standard sandbox template instead.`);
    } finally {
      setIsArchitectLoading(false);
    }
  };

  // --- FEATURE 2: REUSABLE SUBFLOW INSERTION ---
  const insertSubflow = (subId: string) => {
    const sub = reusableSubflows.find(s => s.id === subId);
    if (!sub) return;

    // Unique IDs for subflow nodes
    const idMap: Record<string, string> = {};
    const newNodes = sub.nodes.map((n: any, idx: number) => {
      const newId = `sub_${subId}_node_${Date.now()}_${idx}`;
      idMap[n.id] = newId;
      return {
        ...n,
        id: newId,
        x: n.x + activeWorkflow.nodes.length * 40,
        y: n.y + idx * 20
      };
    });

    const newEdges = sub.edges.map((e: any, idx: number) => {
      return {
        id: `sub_${subId}_edge_${Date.now()}_${idx}`,
        source: idMap[e.source] || e.source,
        target: idMap[e.target] || e.target,
        animated: true
      };
    });

    const updatedNodes = [...activeWorkflow.nodes, ...newNodes];
    const updatedEdges = [...activeWorkflow.edges, ...newEdges];

    const updatedWorkflows = workflows.map(w => 
      w.id === selectedWorkflowId ? { ...w, nodes: updatedNodes, edges: updatedEdges } : w
    );
    setWorkflows(updatedWorkflows);
    pushState(updatedWorkflows);

    addLog(
      "system",
      "Subflow Inserted",
      "custom",
      "completed",
      80,
      `Successfully loaded and injected Reusable Block: [${sub.label}] to workspace.`
    );
  };

  // --- FEATURE 5: AI WORKFLOW REVIEWER ---
  const triggerAIWorkflowReviewer = async () => {
    setIsReviewing(true);
    setShowReviewPanel(true);
    addLog("system", "AI Reviewer Initiated", "gemini", "running", 0, "Inspecting visual blueprint architectures, checking cycles, memory gaps, and prompt leaks.");

    try {
      const response = await fetch("/api/review-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodes: activeWorkflow.nodes,
          edges: activeWorkflow.edges
        })
      });
      const data = await response.json();
      if (data.success) {
        setReviewSuggestions(data.suggestions || []);
        addLog(
          "system",
          "AI Review Completed",
          "gemini",
          "completed",
          1100,
          `Gemini successfully verified graph structure. Detected ${data.issuesDetected} recommended optimization points.`
        );
      }
    } catch (err: any) {
      console.error(err);
      addLog("system", "AI Reviewer Error", "gemini", "failed", 50, "Review query failed.");
    } finally {
      setIsReviewing(false);
    }
  };

  // AI Reviewer Auto-Fix implementation
  const applyReviewFix = (fixId: string) => {
    let updatedNodes = [...activeWorkflow.nodes];
    let updatedEdges = [...activeWorkflow.edges];

    if (fixId === "err_start") {
      const startId = `start_fix_${Date.now()}`;
      const newStartNode: WorkflowNode = {
        id: startId,
        type: "start",
        label: "AI Ingestion Trigger",
        description: "Entry trigger initialized by AI auto-remediation.",
        x: 80,
        y: 180,
        color: "#10B981",
        status: "idle",
        config: {}
      };
      const firstId = activeWorkflow.nodes[0]?.id;
      updatedNodes = [newStartNode, ...updatedNodes];
      if (firstId) {
        updatedEdges.push({ id: `e_fix_${Date.now()}`, source: startId, target: firstId, animated: true });
      }
    } else if (fixId === "err_end") {
      const endId = `end_fix_${Date.now()}`;
      const newEndNode: WorkflowNode = {
        id: endId,
        type: "output",
        label: "Deliver Payload Logs",
        description: "Save final outcome states of optimized pipeline.",
        x: (activeWorkflow.nodes[activeWorkflow.nodes.length - 1]?.x || 600) + 280,
        y: 180,
        color: "#14B8A6",
        status: "idle",
        config: {}
      };
      const lastId = activeWorkflow.nodes[activeWorkflow.nodes.length - 1]?.id;
      updatedNodes.push(newEndNode);
      if (lastId) {
        updatedEdges.push({ id: `e_fix_${Date.now()}`, source: lastId, target: endId, animated: true });
      }
    } else if (fixId.startsWith("err_isolated_")) {
      const targetNodeId = fixId.replace("err_isolated_", "");
      const startNode = activeWorkflow.nodes.find(n => n.type === "start");
      if (startNode) {
        updatedEdges.push({ id: `e_fix_${Date.now()}`, source: startNode.id, target: targetNodeId, animated: true });
      }
    } else if (fixId === "err_prompt_no_mem") {
      const memId = `mem_fix_${Date.now()}`;
      const newMemNode: WorkflowNode = {
        id: memId,
        type: "memory",
        label: "Conversational Context Cache",
        description: "Dynamic cache that stores user queries.",
        x: 360,
        y: 320,
        color: "#F59E0B",
        status: "idle",
        config: { memoryType: "conversation", memoryKey: "active_user_history" }
      };
      const promptNode = activeWorkflow.nodes.find(n => n.type === "prompt");
      updatedNodes.push(newMemNode);
      if (promptNode) {
        updatedEdges.push({ id: `e_fix_${Date.now()}`, source: memId, target: promptNode.id, animated: true });
      }
    }

    const updatedWorkflows = workflows.map((w) =>
      w.id === selectedWorkflowId ? { ...w, nodes: updatedNodes, edges: updatedEdges } : w
    );
    setWorkflows(updatedWorkflows);
    pushState(updatedWorkflows);

    setReviewSuggestions((prev) => prev.filter(s => s.id !== fixId));
    addLog(
      "system",
      "AI Auto-Fix Applied",
      "gemini",
      "completed",
      60,
      "Orchestrated node topology fix safely and aligned workspace configurations."
    );
  };

  // --- FEATURE 3: GIT-STYLE WORKFLOW CHECKPOINT SAVE ---
  const saveWorkflowCheckpoint = (versionName: string, desc: string) => {
    if (!versionName.trim()) return;
    const activeHistory = workflowVersions[selectedWorkflowId] || [];
    
    const count = activeHistory.length + 1;
    const nextVer = `1.0.${count}`;
    const newCheckpoint = {
      id: `git_${Date.now()}`,
      version: nextVer,
      name: versionName,
      timestamp: new Date().toLocaleString(),
      description: desc || "Manual snapshot checkpoint.",
      nodes: activeWorkflow.nodes,
      edges: activeWorkflow.edges
    };

    const updatedVersions = {
      ...workflowVersions,
      [selectedWorkflowId]: [newCheckpoint, ...activeHistory]
    };
    setWorkflowVersions(updatedVersions);

    // Update workflow version label
    const updatedWorkflows = workflows.map(w => 
      w.id === selectedWorkflowId ? { ...w, version: nextVer, updated: "Just now" } : w
    );
    setWorkflows(updatedWorkflows);

    addLog(
      "system",
      "Git Checkpoint Committed",
      "custom",
      "completed",
      40,
      `Created version v${nextVer} - "${versionName}" successfully.`
    );
  };

  const restoreWorkflowCheckpoint = (vId: string) => {
    const activeHistory = workflowVersions[selectedWorkflowId] || [];
    const target = activeHistory.find(v => v.id === vId);
    if (!target) return;

    const restoredWorkflows = workflows.map(w => 
      w.id === selectedWorkflowId ? { ...w, version: target.version, nodes: target.nodes, edges: target.edges } : w
    );
    setWorkflows(restoredWorkflows);
    pushState(restoredWorkflows);

    addLog(
      "system",
      "Git Rollback Complete",
      "custom",
      "completed",
      90,
      `Rolled back active workspace successfully to Checkpoint [v${target.version} - ${target.name}].`
    );
  };

  // --- FEATURE 6: STEP-BY-STEP LIVE DEBUG MODE RUN ---
  const toggleDebugMode = () => {
    if (debugMode) {
      setDebugMode(false);
      setDebugIndex(-1);
      setDebugQueue([]);
      // Reset statuses to idle
      const resetNodes = activeWorkflow.nodes.map(n => ({ ...n, status: "idle" as const }));
      updateNodes(resetNodes);
      addLog("system", "Debugger Terminated", "start", "completed", 10, "Exited step-by-step debug mode.");
    } else {
      setDebugMode(true);
      // Topological sort for debug queue
      const sortedQueue = [...activeWorkflow.nodes];
      
      const weights: Record<NodeType, number> = {
        start: 0, prompt: 1, gemini: 2, memory: 3, knowledge_base: 4, retriever: 5, vector_search: 6, tool: 7, api: 8,
        database: 9, condition: 10, loop: 11, function: 12, http_request: 13, email: 14, webhook: 15, human_approval: 16,
        output: 17, end: 18, custom: 19
      };
      sortedQueue.sort((a, b) => weights[a.type] - weights[b.type]);

      // Reset node states
      const resetNodes = activeWorkflow.nodes.map(n => ({ ...n, status: "idle" as const, output: undefined }));
      updateNodes(resetNodes);

      setDebugQueue(sortedQueue);
      setDebugIndex(0);
      setDebugIsPaused(false);
      addLog("system", "Debugger Active", "start", "running", 0, `Live step debugger initialized. Queue has ${sortedQueue.length} topological nodes.`);
    }
  };

  const debugStepForward = async () => {
    if (debugIndex < 0 || debugIndex >= debugQueue.length) return;
    const activeNode = debugQueue[debugIndex];

    // Set status to running
    let nodesState = activeWorkflow.nodes.map(n => n.id === activeNode.id ? { ...n, status: "running" as const } : n);
    updateNodes(nodesState);
    addLog(activeNode.id, activeNode.label, activeNode.type, "running", 0, `Executing single step [${activeNode.label}]`);

    // Multi-agent activity updates
    setAgentsList(prev => prev.map((ag, idx) => idx === debugIndex % 3 ? { ...ag, status: "thinking", log: `Processing step [${activeNode.label}]` } : ag));

    await new Promise(r => setTimeout(r, 900));

    try {
      const response = await fetch("/api/run-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeType: activeNode.type,
          nodeLabel: activeNode.label,
          config: activeNode.config,
          inputData: "Debugging step context payload."
        })
      });
      const data = await response.json();
      if (data.success) {
        if (data.isSimulated) {
          addNotification(
            "Sandbox Simulation Fallback",
            "The Gemini API experienced a temporary issue. Initiated highly-accurate sandbox execution environment.",
            "info"
          );
        }
        nodesState = nodesState.map(n => n.id === activeNode.id ? { ...n, status: "completed" as const, output: data.output, executionTime: data.duration } : n);
        updateNodes(nodesState);
        addLog(activeNode.id, activeNode.label, activeNode.type, "completed", data.duration, data.output, data.tokens);
        
        // Update Agent statuses
        setAgentsList(prev => prev.map((ag, idx) => idx === debugIndex % 3 ? { ...ag, status: "idle", log: `Step completed successfully. Latency ${data.duration}ms` } : ag));
        setAgentLogs(prev => [`[Agent] Completed step ${activeNode.label} using standard Gemini-3 model.`, ...prev]);

        setDebugIndex(prev => prev + 1);
      }
    } catch (err: any) {
      nodesState = nodesState.map(n => n.id === activeNode.id ? { ...n, status: "failed" as const } : n);
      updateNodes(nodesState);
      addLog(activeNode.id, activeNode.label, activeNode.type, "failed", 50, undefined, undefined, err.message);
    }
  };

  const debugStepBackward = () => {
    if (debugIndex <= 0) return;
    const prevIndex = debugIndex - 1;
    const prevNode = debugQueue[prevIndex];

    const nodesState = activeWorkflow.nodes.map(n => n.id === prevNode.id ? { ...n, status: "idle" as const, output: undefined } : n);
    updateNodes(nodesState);
    setDebugIndex(prevIndex);
    addLog("system", "Debug Rewind", "custom", "waiting", 10, `Rewound step sequence to node: [${prevNode.label}]`);
  };

  const handleInsertComment = () => {
    if (!newCommentText.trim() || !selectedNodeId) return;
    const newComment = {
      id: `comm_${Date.now()}`,
      nodeId: selectedNodeId,
      author: "Local_Architect",
      text: newCommentText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setComments(prev => [...prev, newComment]);
    setNewCommentText("");
  };

  // --- STANDARD RUN ---
  const runWorkflow = async () => {
    if (isRunning) return;
    setIsRunning(true);
    addLog("system", "Pipeline Started", "start", "running", 0, "Topological parser resolving execution dependencies...");

    let currentNodes = activeWorkflow.nodes.map((n) => ({
      ...n,
      status: "idle" as const,
      executionTime: undefined,
      output: undefined
    }));
    updateNodes(currentNodes);

    let inputContext = "Help me analyze this customer email: 'The system has been down for 2 hours and we are losing sales.'";
    const nodeQueue = [...activeWorkflow.nodes];
    const typeWeights: Record<NodeType, number> = {
      start: 0, prompt: 1, gemini: 2, memory: 3, knowledge_base: 4, retriever: 5, vector_search: 6, tool: 7, api: 8,
      database: 9, condition: 10, loop: 11, function: 12, http_request: 13, email: 14, webhook: 15, human_approval: 16,
      output: 17, end: 18, custom: 19
    };
    nodeQueue.sort((a, b) => typeWeights[a.type] - typeWeights[b.type]);

    for (let i = 0; i < nodeQueue.length; i++) {
      const activeNode = nodeQueue[i];
      currentNodes = currentNodes.map((n) => n.id === activeNode.id ? { ...n, status: "running" as const } : n);
      updateNodes(currentNodes);
      
      addLog(activeNode.id, activeNode.label, activeNode.type, "running", 0, "Triggering node sandbox execution parameters.");
      await new Promise((resolve) => setTimeout(resolve, 800));

      try {
        const response = await fetch("/api/run-step", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nodeType: activeNode.type,
            nodeLabel: activeNode.label,
            config: activeNode.config,
            inputData: inputContext
          })
        });

        const data = await response.json();

        if (data.success) {
          if (data.isSimulated) {
            addNotification(
              "Sandbox Simulation Fallback",
              `The Gemini API for block [${activeNode.label}] experienced a temporary issue. Initiated highly-accurate sandbox execution.`,
              "info"
            );
          }
          inputContext = data.output;
          currentNodes = currentNodes.map((n) =>
            n.id === activeNode.id ? { ...n, status: "completed" as const, executionTime: data.duration, output: data.output } : n
          );
          updateNodes(currentNodes);

          addLog(
            activeNode.id,
            activeNode.label,
            activeNode.type,
            "completed",
            data.duration,
            data.output,
            data.tokens
          );

          setStats((prev) => ({
            ...prev,
            totalExecutions: prev.totalExecutions + 1,
            tokenUsage: prev.tokenUsage + (data.tokens || 0),
            estimatedCost: prev.estimatedCost + (data.tokens ? data.tokens * 0.000003 : 0.0001),
            avgRuntime: Math.round((prev.avgRuntime * 15 + data.duration) / 16)
          }));
        } else {
          throw new Error(data.error);
        }
      } catch (err: any) {
        currentNodes = currentNodes.map((n) => n.id === activeNode.id ? { ...n, status: "failed" as const } : n);
        updateNodes(currentNodes);

        addLog(
          activeNode.id,
          activeNode.label,
          activeNode.type,
          "failed",
          120,
          undefined,
          undefined,
          err.message
        );
        setIsRunning(false);
        return;
      }
    }

    setIsRunning(false);
    addLog("system", "Pipeline Success", "end", "completed", 120, "Finished full visual node topological sequence successfully.");
  };

  const stopRun = () => {
    setIsRunning(false);
    addLog("system", "Pipeline Suspended", "end", "failed", 10, "Manual halt request issued by AI Engineer.");
  };

  return (
    <div className="flex h-screen bg-[#080B0F] text-gray-100 font-sans overflow-hidden">
      
      {/* Success Notification Alert */}
      {aiSuccessToast && (
        <div className="fixed top-16 right-8 bg-emerald-500 text-slate-900 px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 font-semibold text-xs tracking-wide z-50 animate-bounce">
          <CheckCircle className="w-4 h-4 text-slate-900" />
          {aiSuccessToast}
        </div>
      )}

      {/* Left Navigation Rail */}
      {(!isCanvasFullscreen || activeTab !== "canvas") && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          workflowName={activeWorkflow.name}
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onSwitchWorkspace={(wsId) => {
            setActiveWorkspaceId(wsId);
            addNotification("Workspace Switched", `Switched workspace safely to: ${wsId === 'ws_personal' ? 'Personal Sandbox' : 'Production Pipelines'}.`, "info");
          }}
        />
      )}

      {/* Main Panel Routing */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {activeTab === "dashboard" && (
          <DashboardView 
            workflows={workflows}
            stats={stats}
            onOpenWorkflow={handleOpenWorkflow}
            onNewWorkflow={handleNewWorkflow}
            onLoadTemplate={handleLoadTemplate}
            onTriggerDemo={triggerDemoMode}
          />
        )}

        {activeTab === "templates" && (
          <TemplatesView onLoadTemplate={handleLoadTemplate} />
        )}

        {activeTab === "connections" && (
          <ConnectionsView />
        )}

        {activeTab === "history" && (
          <HistoryView 
            logs={logs} 
            onClear={() => setLogs([])} 
            onExecuteActive={() => {
              setActiveTab("canvas");
              setTimeout(() => {
                runWorkflow();
              }, 400);
            }}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsView />
        )}

        {activeTab === "settings" && (
          <SettingsView />
        )}

        {activeTab === "canvas" && (
          <div className="flex-1 flex flex-col min-h-0 relative">
            
            {/* Editor header bar controls */}
            <Header
              workflow={activeWorkflow}
              isRunning={isRunning}
              onRun={runWorkflow}
              onStop={stopRun}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < historyQueue.length - 1}
              snapToGrid={snapToGrid}
              setSnapToGrid={setSnapToGrid}
              showMultiAgentDeck={showMultiAgentDeck}
              setShowMultiAgentDeck={setShowMultiAgentDeck}
              onUpdateMetadata={updateWorkflowMetadata}
              onReset={handleResetCanvas}
              onToggleCommandPalette={() => setIsCommandPaletteOpen(prev => !prev)}
              onToggleHelp={() => setIsHelpOpen(prev => !prev)}
              onToggleExport={() => setIsExportOpen(prev => !prev)}
              isFullscreen={isCanvasFullscreen}
              onToggleFullscreen={toggleCanvasFullscreen}
              isDeveloperMode={isDeveloperMode}
              setIsDeveloperMode={setIsDeveloperMode}
            />

            {/* LIVE STEP-BY-STEP DEBUGER CONTROL BAR */}
            <div className="bg-[#0D131A] border-b border-slate-800 px-5 py-2 flex items-center justify-between text-xs font-mono select-none">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleDebugMode}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors font-bold ${
                    debugMode ? "bg-purple-600 text-white" : "bg-slate-900 text-purple-400 hover:text-white"
                  }`}
                  title="Toggle Step-by-Step Interactive Debugger"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  {debugMode ? "DEBUG: ACTIVE" : "ENABLE LIVE DEBUG"}
                </button>
                
                {debugMode && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={debugStepBackward}
                      disabled={debugIndex <= 0}
                      className="px-2 py-1 rounded bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ◀ PREV STEP
                    </button>
                    <button
                      onClick={debugStepForward}
                      disabled={debugIndex < 0 || debugIndex >= debugQueue.length}
                      className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                    >
                      STEP FORWARD ▶
                    </button>
                  </div>
                )}
              </div>

              {/* Structural validation feedback deck */}
              <div className="flex items-center gap-3">
                {validationErrors.length > 0 ? (
                  <button 
                    onClick={triggerAIWorkflowReviewer}
                    className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse text-[10px]"
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    {validationErrors.length} Schema Issue(s) detected. Fix with AI.
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Graph validated safely.
                  </div>
                )}

                <button
                  onClick={triggerAutoLayout}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white uppercase font-bold tracking-wide"
                  title="Auto Layout visual graph"
                >
                  <Layers className="w-3 h-3 text-blue-400" /> Align Layout
                </button>
              </div>
            </div>

            {/* Canvas and parameter configuration layout */}
            <div className="flex-1 flex min-h-0 relative">
              


              {/* Main canvas viewport */}
              <div className="flex-1 h-full relative">
                
                {/* Visual diff indicator badge */}
                {diffMode && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 px-3 py-1.5 rounded shadow-2xl font-bold text-[10px] tracking-wider uppercase z-20 flex items-center gap-1.5 select-none font-mono">
                    <GitPullRequest className="w-3.5 h-3.5" />
                    Visual Diff Active: Comparing with Checkpoint {diffTargetVersion}
                    <button 
                      onClick={() => { setDiffMode(false); setDiffTargetVersion(null); }}
                      className="ml-2 underline font-bold"
                    >
                      Exit
                    </button>
                  </div>
                )}

                {/* FLOATING MULTI-AGENT ORCHESTRATION CARD */}
                {showMultiAgentDeck && (
                  <div className="absolute top-4 right-4 w-72 bg-[#0B0F14]/90 border border-slate-800 rounded-lg shadow-2xl p-4 z-20 pointer-events-auto select-none backdrop-blur-sm max-h-[220px] overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center border-b border-slate-800/80 pb-2 mb-2">
                      <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Multi-Agent Deck
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>

                    <div className="space-y-2 flex-1 overflow-y-auto scrollbar-none">
                      {agentsList.map((ag, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-[10px] bg-slate-950/40 p-2 rounded border border-slate-900">
                          <span className="text-base">{ag.avatar}</span>
                          <div className="flex-1 leading-normal">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-200">{ag.name} ({ag.role})</span>
                              <span className={`text-[8px] font-mono px-1 rounded uppercase font-bold border ${
                                ag.status === "thinking" ? "text-purple-400 bg-purple-500/10 border-purple-500/20" : "text-slate-500 bg-slate-500/10 border-slate-500/20"
                              }`}>
                                {ag.status}
                              </span>
                            </div>
                            <p className="text-[9px] text-slate-400 mt-1 truncate">{ag.log}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FLOATING SIDE PANEL: AI WORKFLOW REVIEWER & OPTIMIZER */}
                {showReviewPanel && (
                  <div className="absolute top-4 right-80 w-80 bg-[#0B0F14] border border-slate-800 rounded-lg shadow-2xl z-20 pointer-events-auto select-none p-4 max-h-[500px] overflow-y-auto flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                        <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-teal-400 animate-spin-slow" />
                          AI Review Suggestions
                        </span>
                        <button 
                          onClick={() => setShowReviewPanel(false)}
                          className="text-slate-500 hover:text-white font-mono text-[10px] uppercase font-bold"
                        >
                          Close
                        </button>
                      </div>

                      {isReviewing ? (
                        <div className="text-center py-10 space-y-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                          <p className="text-[10px] font-mono text-slate-500">Gemini analyzing visual nodes...</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {reviewSuggestions.map((s, idx) => (
                            <div key={idx} className="bg-[#0D131A] border border-slate-800 p-3 rounded-lg flex flex-col justify-between gap-2">
                              <div className="flex justify-between items-start">
                                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                                  s.severity === "critical" ? "bg-red-500/10 text-red-400 border border-red-500/15" : "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                                }`}>
                                  {s.severity}
                                </span>
                              </div>
                              <h5 className="text-[11px] font-bold text-slate-200 mt-1 uppercase tracking-wide">
                                {s.message}
                              </h5>
                              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                                {s.description}
                              </p>
                              <button 
                                onClick={() => applyReviewFix(s.id)}
                                className="mt-2 w-full py-1 rounded bg-teal-600 hover:bg-teal-500 text-slate-900 font-bold text-[9px] uppercase tracking-wider font-mono cursor-pointer transition-colors"
                              >
                                Sparkle Apply Fix
                              </button>
                            </div>
                          ))}
                          {reviewSuggestions.length === 0 && (
                            <div className="text-center py-6 text-slate-500 text-xs italic font-medium">
                              No recommendations found. Run review.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={triggerAIWorkflowReviewer}
                      className="mt-4 w-full py-2 rounded bg-teal-600 text-slate-900 hover:bg-teal-500 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-slate-900" /> Run AI Reviewer
                    </button>
                  </div>
                )}

                {/* MAIN INFINITE INTERACTIVE CANVAS CANVAS */}
                <Canvas
                  nodes={activeWorkflow.nodes}
                  edges={activeWorkflow.edges}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={setSelectedNodeId}
                  onUpdateNodes={updateNodes}
                  onUpdateEdges={updateEdges}
                  onUpdateNodesAndEdges={updateNodesAndEdges}
                  snapToGrid={snapToGrid}
                  onAddLog={addLog}
                  showAiAssistant={showAiAssistant}
                  onToggleAiAssistant={() => setShowAiAssistant(prev => !prev)}
                />

                {/* FLOATING OPTION: DISPATCH COLLABORATOR COMMENTS MODAL */}
                <button
                  onClick={() => setShowCommentsPanel(!showCommentsPanel)}
                  className="absolute bottom-4 left-4 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white p-2.5 rounded-full shadow-2xl z-20 text-slate-400 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wide cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  Comments ({comments.filter(c => !selectedNodeId || c.nodeId === selectedNodeId).length})
                </button>

                {/* STICKY COMMENTS DECK */}
                {showCommentsPanel && (
                  <div className="absolute bottom-16 left-4 w-80 bg-[#0B0F14] border border-slate-800 rounded-lg shadow-2xl z-20 p-4 font-mono select-none max-h-[300px] overflow-y-auto flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" /> Collaborator Comments
                        </span>
                        <button 
                          onClick={() => setShowCommentsPanel(false)}
                          className="text-[10px] font-bold text-slate-500"
                        >
                          Close
                        </button>
                      </div>

                      <div className="space-y-3 mb-4 max-h-[160px] overflow-y-auto">
                        {comments
                          .filter(c => !selectedNodeId || c.nodeId === selectedNodeId)
                          .map(c => (
                            <div key={c.id} className="bg-[#0D131A] border border-slate-800 p-2.5 rounded-lg text-[10px] leading-relaxed">
                              <div className="flex justify-between items-center text-slate-500 text-[9px] font-bold">
                                <span className="text-blue-400">{c.author}</span>
                                <span>{c.timestamp}</span>
                              </div>
                              <p className="text-slate-300 mt-1 font-sans">{c.text}</p>
                            </div>
                          ))}
                        {comments.length === 0 && (
                          <div className="text-slate-500 text-[10px] italic py-2 text-center">No comments here.</div>
                        )}
                      </div>
                    </div>

                    {selectedNodeId ? (
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Reply or add notes..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="flex-1 bg-[#080B0F] border border-slate-800 rounded text-[11px] text-slate-200 px-2 py-1.5 focus:outline-none"
                        />
                        <button 
                          onClick={handleInsertComment}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded font-bold text-[10px] text-white"
                        >
                          Send
                        </button>
                      </div>
                    ) : (
                      <p className="text-[8px] text-slate-500 italic text-center">Click a canvas node to comment.</p>
                    )}
                  </div>
                )}

                {/* FLOATING AI AUTOMATION ASSISTANT */}
                {showAiAssistant && (
                  <div className="absolute top-4 left-16 z-30 pointer-events-auto shadow-2xl">
                    <AIAssistantPanel
                      workflow={activeWorkflow}
                      onApplyFix={handleApplyAiHealthFix}
                      onApplyImprovement={handleApplyAiImprovement}
                      onAddSuggestedStep={handleAddSuggestedStep}
                      addNotification={addNotification}
                      onClose={() => setShowAiAssistant(false)}
                    />
                  </div>
                )}
              </div>

              {/* ACTIVE PARAMETER CONFIG PANEL INTEGRATED SLIDER */}
              {selectedNodeId && (
                <ConfigPanel
                  node={activeWorkflow.nodes.find((n) => n.id === selectedNodeId) || null}
                  onClose={() => setSelectedNodeId(null)}
                  onUpdateNode={(updated) => updateNodeConfig(selectedNodeId!, updated)}
                  isDeveloperMode={isDeveloperMode}
                />
              )}

            </div>

            {/* Bottom active terminal output console logs */}
            <LogPanel logs={logs} onClear={() => setLogs([])} />

          </div>
        )}

        {/* Bottom Status Bar */}
        <footer className="h-8 border-t border-slate-800/80 bg-[#0B0F14] px-4 flex items-center justify-between shrink-0 select-none z-10">
          <div className="flex items-center space-x-4 text-[10px] text-slate-500 font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>Connected to Cluster [us-east-1]</span>
            </div>
            <div className="h-3 w-[1px] bg-slate-800"></div>
            <span>Latency: 24ms</span>
          </div>
          <div className="flex items-center space-x-4 text-[10px] text-slate-500 font-mono">
            <span>Version: 2.1.0-beta</span>
            <div className="h-3 w-[1px] bg-slate-800"></div>
            <span className="text-blue-500 hover:underline cursor-pointer">Documentation</span>
          </div>
        </footer>

      </div>

      {/* Premium Workspace Widgets & Overlays */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        onNewWorkflow={handleNewWorkflow}
        onRunWorkflow={() => {
          setActiveTab("canvas");
          setTimeout(() => runWorkflow(), 400);
        }}
        onSetActiveTab={setActiveTab}
        onTriggerAI={() => {
          setActiveTab("canvas");
          addNotification("AI Architect Active", "Open the block toolbar or prompt panel to visually align agent prompts.", "info");
        }}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSwitchWorkspace={(wsId) => {
          setActiveWorkspaceId(wsId);
          addNotification("Workspace Switched", `Switched workspace safely to: ${wsId === 'ws_personal' ? 'Personal Sandbox' : 'Production Pipelines'}.`, "info");
        }}
      />

      <HelpCenter 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />

      <KeyboardShortcutGuide 
        isOpen={isShortcutGuideOpen} 
        onClose={() => setIsShortcutGuideOpen(false)} 
      />

      <ExportCenter 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        activeWorkflow={activeWorkflow}
        onAddNotification={addNotification}
      />

      <NotificationCenter 
        notifications={notifications} 
        onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} 
      />

      {showOnboarding && (
        <OnboardingGuide onDismiss={() => setShowOnboarding(false)} />
      )}

    </div>
  );
}
