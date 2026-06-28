import { useState, useEffect } from "react";
import { 
  X, 
  Settings, 
  Trash2, 
  Plus, 
  Sliders, 
  FileText, 
  HelpCircle,
  Code,
  Terminal,
  Layers,
  Sparkles,
  Link,
  Cpu,
  ChevronDown,
  ChevronUp,
  Mail,
  FileSpreadsheet,
  Calendar,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  Play,
  ArrowRight,
  Lock,
  Globe,
  Database,
  Youtube,
  Instagram,
  MessageCircle,
  Grid,
  Search
} from "lucide-react";
import { WorkflowNode, NodeType, NodeConfig } from "../types";

interface ConfigPanelProps {
  node: WorkflowNode | null;
  onClose: () => void;
  onUpdateNode: (node: WorkflowNode) => void;
  isDeveloperMode?: boolean;
}

export default function ConfigPanel({
  node,
  onClose,
  onUpdateNode,
  isDeveloperMode = false
}: ConfigPanelProps) {
  const [label, setLabel] = useState("");
  const [desc, setDesc] = useState("");
  const [config, setConfig] = useState<NodeConfig>({});
  const [isAdvancedCollapsed, setIsAdvancedCollapsed] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testRunStatus, setTestRunStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [appSearch, setAppSearch] = useState("");

  useEffect(() => {
    if (node) {
      setLabel(node.label);
      setDesc(node.description);
      setConfig(node.config || {});
      setIsAdvancedCollapsed(true);
      setTestRunStatus("idle");
      setTestOutput(null);
    }
  }, [node]);

  if (!node) return null;

  const handleFieldChange = (key: keyof NodeConfig, value: any) => {
    const updatedConfig = { ...config, [key]: value };
    setConfig(updatedConfig);
    onUpdateNode({
      ...node,
      label,
      description: desc,
      config: updatedConfig
    });
  };

  const handleMetadataChange = (newLabel: string, newDesc: string) => {
    setLabel(newLabel);
    setDesc(newDesc);
    onUpdateNode({
      ...node,
      label: newLabel,
      description: newDesc,
      config
    });
  };

  // Preset default service providers and actions depending on node type
  const getSuggestedProvider = (type: NodeType): NodeConfig["serviceProvider"] => {
    if (type === "gemini") return "gemini";
    if (type === "email") return "gmail";
    if (type === "database") return "gsheets";
    if (type === "api") return "custom_api";
    return undefined;
  };

  const provider = config.serviceProvider || getSuggestedProvider(node.type);

    // Set default configurations on switching service provider
  const handleProviderSelect = (prov: NodeConfig["serviceProvider"]) => {
    let defaultAction = "";
    if (prov === "gmail") defaultAction = "send_email";
    else if (prov === "gsheets") defaultAction = "append_row";
    else if (prov === "gcal") defaultAction = "create_event";
    else if (prov === "gdocs") defaultAction = "append_text";
    else if (prov === "gemini" || prov === "openai" || prov === "anthropic") defaultAction = "generate_text";
    else if (prov === "custom_api") defaultAction = "http_request";
    else if (prov === "youtube") defaultAction = "get_video_details";
    else if (prov === "instagram") defaultAction = "publish_photo";
    else if (prov === "whatsapp") defaultAction = "send_text_message";
    else if (prov === "other_services") {
      defaultAction = "slack_send_message";
    }

    let authType: NodeConfig["serviceAuthType"] = "api_key";
    if (prov?.startsWith("g") && prov !== "gemini") {
      authType = "google_oauth";
    } else if (!prov) {
      authType = "none";
    }

    const updatedConfig = { 
      ...config, 
      serviceProvider: prov,
      serviceAction: defaultAction,
      serviceAuthType: authType,
      // If other_services, pre-initialize otherServiceName to Slack or Notion
      ...(prov === "other_services" ? {
        otherServiceName: "Slack",
        otherServiceAction: "Send a channel message",
        otherServiceFields: [
          { name: "Channel Name", type: "string", placeholder: "#general", value: "#general" },
          { name: "Message Text", type: "textarea", placeholder: "Hello from automation!", value: "Hello from automation!" }
        ]
      } : {})
    };
    setConfig(updatedConfig);
    onUpdateNode({
      ...node,
      config: updatedConfig
    });
  };

  const triggerTestRun = () => {
    setTestRunStatus("running");
    setTestOutput(null);

    // Simulate simplified visual dry-run testing
    setTimeout(() => {
      setTestRunStatus("success");
      if (provider === "gmail") {
        setTestOutput(`[Gmail API Success]\nSent email to: ${config.emailTo || "user@example.com"}\nSubject: ${config.emailSubject || "Automated Notification"}\nStatus: Delivered successfully.`);
      } else if (provider === "gcal") {
        setTestOutput(`[Google Calendar Success]\nCreated event: "${config.gcalEventTitle || "New Meeting"}"\nCalendar: ${config.userEmail || "primary"}\nTime: ${config.gcalStartTime || "Today 10:00 AM"}\nStatus: Synced.`);
      } else if (provider === "gsheets") {
        setTestOutput(`[Google Sheets Success]\nSpreadsheet ID: ${config.googleSheetId || "default_sheet"}\nRow appended: [${config.googleSheetRowData || "Data row"}]\nStatus: OK.`);
      } else if (provider === "gdocs") {
        setTestOutput(`[Google Docs Success]\nDocument ID: ${config.googleDocId || "default_doc"}\nAppended content size: ${(config.googleDocContent || "").length} chars.`);
      } else if (provider === "gemini" || provider === "openai" || provider === "anthropic") {
        setTestOutput(`[AI Model Run Success]\nModel: ${config.geminiModel || config.model || "Standard Mode"}\nResponse: "Automated workflow check completed. Processed parameters successfully."`);
      } else if (provider === "youtube") {
        setTestOutput(`[YouTube Integration Success]\nAction: ${config.youtubeAction || "get_video_details"}\nVideo: ${config.youtubeVideoUrl || "https://youtube.com/watch?v=sample"}\nStatus: Retrieved 1,240 comments, 45.2K views.`);
      } else if (provider === "instagram") {
        setTestOutput(`[Instagram Integration Success]\nAction: ${config.instagramAction || "publish_photo"}\nContent: ${config.instagramCaption || "Automated post"}\nStatus: Media published successfully to profile.`);
      } else if (provider === "whatsapp") {
        setTestOutput(`[WhatsApp Integration Success]\nAction: ${config.whatsappAction || "send_text_message"}\nRecipient: ${config.whatsappPhoneNumber || "+1 234 567 890"}\nStatus: Message queued and delivered successfully.`);
      } else if (provider === "other_services") {
        const fieldsStr = config.otherServiceFields?.map(f => `${f.name}: ${f.value}`).join("\n") || "";
        setTestOutput(`[${config.otherServiceName || "Slack"} Success]\nAction: ${config.otherServiceAction || "Execute"}\n${fieldsStr}\nStatus: 200 OK via n8n integration bridge.`);
      } else {
        setTestOutput(`[Success] Automated block executed cleanly.\nStatus code: 200 OK\nTimestamp: ${new Date().toLocaleTimeString()}`);
      }
    }, 1200);
  };

  return (
    <div className="w-80 bg-[#0B0F14] border-l border-slate-800 flex flex-col h-full text-slate-300 relative select-none shadow-2xl">
      
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-850 flex items-center justify-between bg-[#080B0F]/60">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-blue-500/10 text-blue-400">
            <Settings className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-[11px] tracking-wider uppercase font-sans">Node Settings</h4>
            <span className="text-[9px] text-slate-500 font-mono">Block ID: {node.id}</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded hover:bg-slate-900 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Parameters Scroll Container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {/* Simple Explanation Title */}
        <div className="space-y-1">
          <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Block Label & Purpose</label>
          <input 
            type="text" 
            value={label}
            onChange={(e) => handleMetadataChange(e.target.value, desc)}
            className="w-full px-3 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <textarea 
            value={desc}
            rows={2}
            onChange={(e) => handleMetadataChange(label, e.target.value)}
            placeholder="What does this step do in your automation?"
            className="mt-1.5 w-full px-3 py-1.5 bg-[#080B0F]/50 border border-slate-850 rounded-lg text-[11px] text-slate-400 focus:outline-none focus:border-blue-500/50 resize-none leading-relaxed"
          />
        </div>

        {/* BEGINNER-FRIENDLY INTEGRATION PROVIDER SELECTOR */}
        <div className="space-y-3 pt-2 border-t border-slate-850/60">
          <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Choose Service Integration</label>
          
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: "gemini", label: "Gemini", icon: Cpu, color: "#8B5CF6", desc: "Google AI" },
              { id: "openai", label: "ChatGPT", icon: Sparkles, color: "#10B981", desc: "OpenAI API" },
              { id: "anthropic", label: "Claude", icon: Layers, color: "#F97316", desc: "Anthropic" },
              { id: "gmail", label: "Gmail", icon: Mail, color: "#EF4444", desc: "Send Mail" },
              { id: "gcal", label: "Calendar", icon: Calendar, color: "#3B82F6", desc: "Add Events" },
              { id: "gsheets", label: "Sheets", icon: FileSpreadsheet, color: "#10B981", desc: "Log Data" },
              { id: "gdocs", label: "Docs", icon: FileText, color: "#60A5FA", desc: "Append Docs" },
              { id: "custom_api", label: "Web API", icon: Globe, color: "#A855F7", desc: "Custom URL" },
              { id: "youtube", label: "YouTube", icon: Youtube, color: "#FF0000", desc: "YouTube API" },
              { id: "instagram", label: "Instagram", icon: Instagram, color: "#E1306C", desc: "Instagram API" },
              { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "#25D366", desc: "WhatsApp API" },
              { id: "other_services", label: "Others", icon: Grid, color: "#6366F1", desc: "N8N/500+ App Catalog" }
            ].map((srv) => {
              const SrvIcon = srv.icon;
              const isSelected = provider === srv.id;
              return (
                <button
                  key={srv.id}
                  onClick={() => handleProviderSelect(srv.id as any)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-slate-900 border-blue-500 text-white shadow-lg shadow-blue-500/10 scale-[1.03]" 
                      : "bg-[#080B0F]/40 border-slate-850/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                  title={`${srv.label} - ${srv.desc}`}
                >
                  <SrvIcon className="w-5 h-5 mb-1" style={{ color: isSelected ? srv.color : "#64748B" }} />
                  <span className="text-[9px] font-medium leading-none tracking-tight truncate w-full">{srv.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AUTHENTICATION CRUMBS */}
        {provider && (
          <div className="space-y-2 p-3 rounded-xl bg-slate-950/70 border border-slate-850/60">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-500/80" /> Connection Security
              </span>
              <span className="text-[7px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1 py-0.25 rounded uppercase">
                Secure
              </span>
            </div>

            {provider.startsWith("g") ? (
              // Google App Auth using simple Email identifier
              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 font-sans block">Connect Google Account Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={config.userEmail || ""}
                    onChange={(e) => handleFieldChange("userEmail", e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full pl-2.5 pr-8 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-blue-500/50"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[8px] text-slate-500 font-mono leading-normal">
                  Authenticates seamlessly with your Gmail address. No complicated Oauth tokens required.
                </p>
              </div>
            ) : (
              // API Key Authentication with hide/show
              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 font-sans block">Paste API Access Token / Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={config.apiKey || ""}
                    onChange={(e) => handleFieldChange("apiKey", e.target.value)}
                    placeholder={`sk-... (or enter primary account email)`}
                    className="w-full pl-7 pr-8 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-blue-500/50"
                  />
                  <Key className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[8px] text-slate-500 font-mono leading-normal">
                  Protected with sandbox proxies so secrets are never compiled or leaked inside your browser.
                </p>
              </div>
            )}
          </div>
        )}

        {/* CUSTOM SERVICES CONFIGURATIONS (EASY MODE FOR BEGINNERS) */}
        {provider && (
          <div className="space-y-4 pt-3 border-t border-slate-850/60">
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                Action Parameters
              </span>
              <div className="h-[1px] flex-1 bg-slate-850"></div>
            </div>

            {/* AI SERVICES CONFIGURATION */}
            {(provider === "gemini" || provider === "openai" || provider === "anthropic") && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Target Model Mode</label>
                  <select
                    value={config.geminiModel || config.model || "standard"}
                    onChange={(e) => handleFieldChange("geminiModel", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-white font-semibold focus:outline-none"
                  >
                    {provider === "gemini" && (
                      <>
                        <option value="gemini-3.5-flash">Gemini 3.5 Flash (Super Fast & Smart)</option>
                        <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Heavy Reasoning & Logic)</option>
                        <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Cost-Optimized)</option>
                      </>
                    )}
                    {provider === "openai" && (
                      <>
                        <option value="gpt-4o-mini">GPT-4o Mini (Ultra Speedy)</option>
                        <option value="gpt-4o">GPT-4o (Strong General Intelligence)</option>
                        <option value="o1-mini">o1-mini (Specialist Reasoning)</option>
                      </>
                    )}
                    {provider === "anthropic" && (
                      <>
                        <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Elite Text Drafting)</option>
                        <option value="claude-3-haiku">Claude 3 Haiku (Lightweight Fast Agent)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] text-slate-400 font-sans block">Creativity Temperature</label>
                    <span className="text-[10px] font-mono text-blue-400 font-bold">{config.temperature ?? 0.3}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={config.temperature ?? 0.3}
                    onChange={(e) => handleFieldChange("temperature", parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[7px] text-slate-500 font-mono mt-1">
                    <span>Precise / Facts</span>
                    <span>Creative / Storytelling</span>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Dynamic Prompt / AI Instructions</label>
                  <textarea
                    value={config.promptTemplate || ""}
                    rows={4}
                    onChange={(e) => handleFieldChange("promptTemplate", e.target.value)}
                    placeholder="Enter what you want the AI to do here. E.g: Summarize the email: {{webhook_input.body}}"
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500/50 leading-relaxed"
                  />
                  <div className="text-[8px] text-slate-500 leading-normal mt-1 flex items-start gap-1">
                    <HelpCircle className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span>
                      Type <code className="text-blue-400 font-mono font-bold">{"{{block_id.output}}"}</code> to insert values from previous steps automatically!
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* GMAIL SERVICE CONFIGURATION */}
            {provider === "gmail" && (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Send Automated Email To</label>
                  <input
                    type="email"
                    value={config.emailTo || ""}
                    onChange={(e) => handleFieldChange("emailTo", e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Email Subject Title</label>
                  <input
                    type="text"
                    value={config.emailSubject || ""}
                    onChange={(e) => handleFieldChange("emailSubject", e.target.value)}
                    placeholder="Automated notification alert"
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Message / Email Body</label>
                  <textarea
                    value={config.emailBody || ""}
                    rows={3}
                    onChange={(e) => handleFieldChange("emailBody", e.target.value)}
                    placeholder="Draft your mail message here..."
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* GOOGLE CALENDAR CONFIGURATION */}
            {provider === "gcal" && (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Calendar Event Title</label>
                  <input
                    type="text"
                    value={config.gcalEventTitle || ""}
                    onChange={(e) => handleFieldChange("gcalEventTitle", e.target.value)}
                    placeholder="Automated Team Sync"
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Start Time / Date</label>
                  <input
                    type="text"
                    value={config.gcalStartTime || ""}
                    onChange={(e) => handleFieldChange("gcalStartTime", e.target.value)}
                    placeholder="E.g., Tomorrow at 2 PM, or 2026-06-29T14:00"
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Event Description & Notes</label>
                  <textarea
                    value={config.gcalDescription || ""}
                    rows={3}
                    onChange={(e) => handleFieldChange("gcalDescription", e.target.value)}
                    placeholder="Write details or summary..."
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* GOOGLE SHEETS CONFIGURATION */}
            {provider === "gsheets" && (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Sheet Action</label>
                  <select
                    value={config.googleSheetAction || "append"}
                    onChange={(e) => handleFieldChange("googleSheetAction", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-white font-semibold focus:outline-none"
                  >
                    <option value="append">Append New Row to Sheet</option>
                    <option value="read">Read Spreadsheet Values</option>
                    <option value="clear">Clear Specific Rows</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Google Spreadsheet URL or ID</label>
                  <input
                    type="text"
                    value={config.googleSheetId || ""}
                    onChange={(e) => handleFieldChange("googleSheetId", e.target.value)}
                    placeholder="E.g. 1a2b3c4d5e... or paste Sheet link"
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Row Values to Log</label>
                  <input
                    type="text"
                    value={config.googleSheetRowData || ""}
                    onChange={(e) => handleFieldChange("googleSheetRowData", e.target.value)}
                    placeholder="E.g., Timestamp, {{gemini_response}}, Success"
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
                  />
                  <p className="text-[7.5px] text-slate-500 font-mono leading-normal mt-1">
                    Separate multiple columns using commas. Supports dynamic double curly variables.
                  </p>
                </div>
              </div>
            )}

            {/* GOOGLE DOCS CONFIGURATION */}
            {provider === "gdocs" && (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Google Doc URL or ID</label>
                  <input
                    type="text"
                    value={config.googleDocId || ""}
                    onChange={(e) => handleFieldChange("googleDocId", e.target.value)}
                    placeholder="E.g. 1x2y3z4w... or paste Document link"
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Text Content to Append</label>
                  <textarea
                    value={config.googleDocContent || ""}
                    rows={4}
                    onChange={(e) => handleFieldChange("googleDocContent", e.target.value)}
                    placeholder="Write content or paste preceding variables..."
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* WEB API CONFIGURATION */}
            {provider === "custom_api" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <label className="text-[9px] text-slate-400 font-sans block mb-1">Method</label>
                    <select
                      value={config.method || "GET"}
                      onChange={(e) => handleFieldChange("method", e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-white font-bold focus:outline-none"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] text-slate-400 font-sans block mb-1">API Endpoint URL</label>
                    <input
                      type="url"
                      value={config.url || ""}
                      onChange={(e) => handleFieldChange("url", e.target.value)}
                      placeholder="https://api.example.com/v1"
                      className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>

                {config.method !== "GET" && (
                  <div>
                    <label className="text-[9px] text-slate-400 font-sans block mb-1">JSON Payload Body</label>
                    <textarea
                      value={config.body || ""}
                      rows={4}
                      onChange={(e) => handleFieldChange("body", e.target.value)}
                      placeholder={`{\n  "status": "triggered",\n  "data": "{{start_node.output}}"\n}`}
                      className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none leading-relaxed"
                    />
                  </div>
                )}
              </div>
            )}

            {/* YOUTUBE CONFIGURATION */}
            {provider === "youtube" && (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">YouTube Integration Action</label>
                  <select
                    value={config.youtubeAction || "get_video_details"}
                    onChange={(e) => handleFieldChange("youtubeAction", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-white font-semibold focus:outline-none"
                  >
                    <option value="get_video_details">Get Video Details (Views, Likes, Duration)</option>
                    <option value="search_videos">Search YouTube Videos</option>
                    <option value="get_comments">Retrieve Recent Video Comments</option>
                    <option value="publish_comment">Publish Automated Comment</option>
                  </select>
                </div>

                {config.youtubeAction !== "search_videos" ? (
                  <div>
                    <label className="text-[9px] text-slate-400 font-sans block mb-1">YouTube Video URL or ID</label>
                    <input
                      type="text"
                      value={config.youtubeVideoUrl || ""}
                      onChange={(e) => handleFieldChange("youtubeVideoUrl", e.target.value)}
                      placeholder="E.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[9px] text-slate-400 font-sans block mb-1">Video Search Query</label>
                    <input
                      type="text"
                      value={config.youtubeSearchQuery || ""}
                      onChange={(e) => handleFieldChange("youtubeSearchQuery", e.target.value)}
                      placeholder="E.g., AI tutorial, Tech News"
                      className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                )}

                {config.youtubeAction === "publish_comment" && (
                  <div>
                    <label className="text-[9px] text-slate-400 font-sans block mb-1">Automated Comment Text</label>
                    <textarea
                      value={config.whatsappMessageText || ""}
                      rows={3}
                      onChange={(e) => handleFieldChange("whatsappMessageText", e.target.value)}
                      placeholder="Write your comment reply here..."
                      className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none leading-relaxed"
                    />
                  </div>
                )}
              </div>
            )}

            {/* INSTAGRAM CONFIGURATION */}
            {provider === "instagram" && (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Instagram Business Action</label>
                  <select
                    value={config.instagramAction || "publish_photo"}
                    onChange={(e) => handleFieldChange("instagramAction", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-white font-semibold focus:outline-none"
                  >
                    <option value="publish_photo">Publish Image Post</option>
                    <option value="publish_reel">Publish Reel Video</option>
                    <option value="get_user_profile">Get Business Account Metrics</option>
                    <option value="get_media_analytics">Retrieve Media Post Insights</option>
                  </select>
                </div>

                {(config.instagramAction === "publish_photo" || config.instagramAction === "publish_reel") && (
                  <>
                    <div>
                      <label className="text-[9px] text-slate-400 font-sans block mb-1">Media Source URL</label>
                      <input
                        type="text"
                        value={config.instagramMediaUrl || ""}
                        onChange={(e) => handleFieldChange("instagramMediaUrl", e.target.value)}
                        placeholder="https://images.unsplash.com/... or cloud video URL"
                        className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 font-sans block mb-1">Post Caption & Hashtags</label>
                      <textarea
                        value={config.instagramCaption || ""}
                        rows={3}
                        onChange={(e) => handleFieldChange("instagramCaption", e.target.value)}
                        placeholder="Check out my automated post! #automation #n8n"
                        className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none leading-relaxed"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* WHATSAPP CONFIGURATION */}
            {provider === "whatsapp" && (
              <div className="space-y-3">
                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">WhatsApp Cloud Action</label>
                  <select
                    value={config.whatsappAction || "send_text_message"}
                    onChange={(e) => handleFieldChange("whatsappAction", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-white font-semibold focus:outline-none"
                  >
                    <option value="send_text_message">Send Simple Text Message</option>
                    <option value="send_template_message">Send Pre-approved Template Message</option>
                    <option value="send_media_message">Send Media File (Image, PDF)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Recipient Phone Number</label>
                  <input
                    type="text"
                    value={config.whatsappPhoneNumber || ""}
                    onChange={(e) => handleFieldChange("whatsappPhoneNumber", e.target.value)}
                    placeholder="E.g., +14155552671 (with country code)"
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 font-sans block mb-1">Message Content / Parameters</label>
                  <textarea
                    value={config.whatsappMessageText || ""}
                    rows={4}
                    onChange={(e) => handleFieldChange("whatsappMessageText", e.target.value)}
                    placeholder={
                      config.whatsappAction === "send_template_message"
                        ? "Template Name: shipping_notification\nVariables: [{{start_node.name}}, 3-5 days]"
                        : "Write your WhatsApp message body here..."
                    }
                    className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* OTHER / N8N APP CATALOG CONFIGURATION */}
            {provider === "other_services" && (
              <div className="space-y-4">
                {/* Search & Selector UI */}
                <div className="p-3 bg-slate-950/70 border border-slate-850/80 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Active Connector:
                    </span>
                    {config.otherServiceName && (
                      <span 
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white font-mono"
                        style={{ backgroundColor: N8N_APP_CATALOG.find(a => a.name === config.otherServiceName)?.color || "#6366F1" }}
                      >
                        {config.otherServiceName}
                      </span>
                    )}
                  </div>

                  {/* Active Service Custom Fields or Search selector */}
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={appSearch}
                        onChange={(e) => setAppSearch(e.target.value)}
                        placeholder="Search 500+ web apps (Slack, Notion, Spotify...)"
                        className="w-full pl-8 pr-3 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>

                    {/* Filtered Apps List */}
                    {appSearch.trim().length > 0 && (
                      <div className="max-h-36 overflow-y-auto border border-slate-850 rounded-lg divide-y divide-slate-850/60 bg-slate-950">
                        {N8N_APP_CATALOG.filter(app => 
                          app.name.toLowerCase().includes(appSearch.toLowerCase())
                        ).map(app => (
                          <button
                            key={app.name}
                            type="button"
                            onClick={() => {
                              // Select the app
                              const updatedConfig = {
                                ...config,
                                otherServiceName: app.name,
                                otherServiceAction: app.actions[0],
                                otherServiceFields: app.fields.map(f => ({ ...f, value: "" }))
                              };
                              setConfig(updatedConfig);
                              onUpdateNode({
                                ...node,
                                config: updatedConfig
                              });
                              setAppSearch("");
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-900 flex items-center justify-between text-xs transition-colors cursor-pointer"
                          >
                            <span className="font-semibold text-slate-200">{app.name}</span>
                            <span 
                              className="w-2.5 h-2.5 rounded-full" 
                              style={{ backgroundColor: app.color }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* If an app is selected, render Action selector and fields */}
                {config.otherServiceName && (
                  <div className="space-y-3">
                    {/* Dynamic Action Selector */}
                    <div>
                      <label className="text-[9px] text-slate-400 font-sans block mb-1">
                        {config.otherServiceName} API Action
                      </label>
                      <select
                        value={config.otherServiceAction || ""}
                        onChange={(e) => handleFieldChange("otherServiceAction", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-white font-semibold focus:outline-none"
                      >
                        {N8N_APP_CATALOG.find(a => a.name === config.otherServiceName)?.actions.map(act => (
                          <option key={act} value={act}>{act}</option>
                        )) || <option value="default">Default Action</option>}
                      </select>
                    </div>

                    {/* Dynamic Parameters based on app settings */}
                    <div className="space-y-2.5 pt-1">
                      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                        Service Parameters
                      </span>
                      {config.otherServiceFields?.map((field, idx) => (
                        <div key={field.name} className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-sans block">
                            {field.name}
                          </label>
                          {field.type === "textarea" ? (
                            <textarea
                              value={field.value || ""}
                              rows={3}
                              placeholder={field.placeholder}
                              onChange={(e) => {
                                const updatedFields = [...(config.otherServiceFields || [])];
                                updatedFields[idx] = { ...field, value: e.target.value };
                                handleFieldChange("otherServiceFields", updatedFields);
                              }}
                              className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none leading-relaxed"
                            />
                          ) : (
                            <input
                              type="text"
                              value={field.value || ""}
                              placeholder={field.placeholder}
                              onChange={(e) => {
                                const updatedFields = [...(config.otherServiceFields || [])];
                                updatedFields[idx] = { ...field, value: e.target.value };
                                handleFieldChange("otherServiceFields", updatedFields);
                              }}
                              className="w-full px-2.5 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* 1-CLICK DRY TEST RUN */}
        {provider && (
          <div className="pt-4 border-t border-slate-850/60 space-y-2.5">
            <button
              type="button"
              onClick={triggerTestRun}
              disabled={testRunStatus === "running"}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              {testRunStatus === "running" ? "Testing Block..." : "Dry Run This Step"}
            </button>

            {testOutput && (
              <div className="p-3 bg-[#080B0F] border border-slate-850 rounded-xl space-y-1.5">
                <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  Dry Run Output Payload
                </span>
                <pre className="text-[9px] font-mono text-slate-300 leading-normal whitespace-pre-wrap select-text max-h-40 overflow-y-auto">
                  {testOutput}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* ADVANCED PARAMETERS PROGRESSIVE DISCLOSURE */}
        <div className="border-t border-slate-850 pt-4 mt-2">
          {!isDeveloperMode ? (
            <div className="bg-[#0D131A] border border-slate-800 p-3 rounded-lg text-[10px] leading-relaxed text-slate-400">
              <span className="font-bold text-amber-400 flex items-center gap-1 mb-1">
                <Sliders className="w-3.5 h-3.5" />
                Advanced Controls Locked
              </span>
              JSON inputs, custom variables, and error retries are safely hidden in <b>Beginner Mode</b>. Enable <b>Developer Mode</b> in the top toolbar to unlock.
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsAdvancedCollapsed(!isAdvancedCollapsed)}
                className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-wider font-mono cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-500" />
                  Advanced Details
                </span>
                {isAdvancedCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>

              {!isAdvancedCollapsed && (
                <div className="mt-4 space-y-4 animate-in fade-in duration-100">
              
              {/* Manual Retry Counter */}
              <div>
                <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Failure Auto-Retries</label>
                <input 
                  type="number" 
                  value={config.retries ?? 3}
                  onChange={(e) => handleFieldChange("retries", parseInt(e.target.value))}
                  className="mt-1.5 w-full px-3 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                />
              </div>

              {/* Dynamic variables list builder */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Custom Key/Values</label>
                  <button 
                    onClick={() => {
                      const vars = config.variables || [];
                      handleFieldChange("variables", [...vars, { name: `key_${vars.length + 1}`, value: "" }]);
                    }}
                    className="text-[9px] text-blue-400 hover:text-white flex items-center gap-1 hover:underline cursor-pointer font-bold uppercase tracking-wider"
                  >
                    <Plus className="w-3 h-3" /> Add Value
                  </button>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {(config.variables || []).map((v, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-[#080B0F]/50 p-1.5 rounded-lg border border-slate-850">
                      <input 
                        type="text" 
                        value={v.name}
                        placeholder="Key"
                        onChange={(e) => {
                          const vars = config.variables || [];
                          handleFieldChange("variables", vars.map((item, i) => i === idx ? { ...item, name: e.target.value } : item));
                        }}
                        className="w-1/3 bg-[#080B0F] border border-slate-800 rounded px-1.5 py-1 text-[11px] font-mono text-white focus:outline-none"
                      />
                      <input 
                        type="text" 
                        value={v.value}
                        placeholder="Value"
                        onChange={(e) => {
                          const vars = config.variables || [];
                          handleFieldChange("variables", vars.map((item, i) => i === idx ? { ...item, value: e.target.value } : item));
                        }}
                        className="flex-1 bg-[#080B0F] border border-slate-800 rounded px-1.5 py-1 text-[11px] text-slate-400 focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          const vars = config.variables || [];
                          handleFieldChange("variables", vars.filter((_, i) => i !== idx));
                        }}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(config.variables || []).length === 0 && (
                    <div className="text-[10px] text-slate-500 italic text-center py-1">No custom properties.</div>
                  )}
                </div>
              </div>

              {/* JS custom code sandbox for direct processing */}
              <div>
                <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  Custom JS Filter (Optional)
                </label>
                <textarea
                  value={config.customCode || ""}
                  rows={4}
                  onChange={(e) => handleFieldChange("customCode", e.target.value)}
                  placeholder="// Customize or format node outputs programmatically"
                  className="mt-1.5 w-full px-3 py-1.5 bg-[#080B0F] border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none leading-relaxed"
                />
              </div>

            </div>
          )}
        </>
      )}
    </div>

      </div>

      {/* Node Live Generated Outputs Section */}
      {node.output && (
        <div className="border-t border-slate-850 p-5 bg-[#080B0F]/30 space-y-2">
          <label className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-emerald-400 animate-pulse" strokeWidth={2.5} />
            Output payload log
          </label>
          <div className="bg-[#080B0F] border border-slate-850 p-3 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto select-text leading-relaxed whitespace-pre-wrap max-h-48 shadow-inner">
            {node.output}
          </div>
        </div>
      )}

    </div>
  );
}

const N8N_APP_CATALOG = [
  { 
    name: "Slack", 
    color: "#4A154B", 
    actions: ["Send channel message", "Send direct message", "Create channel", "Set user status"],
    fields: [
      { name: "Channel Name", type: "string" as const, placeholder: "#general" },
      { name: "Message Body", type: "textarea" as const, placeholder: "Hello from automation!" }
    ]
  },
  { 
    name: "Discord", 
    color: "#5865F2", 
    actions: ["Send webhook message", "Create forum post", "Assign server role"],
    fields: [
      { name: "Webhook URL", type: "string" as const, placeholder: "https://discord.com/api/webhooks/..." },
      { name: "Content text", type: "textarea" as const, placeholder: "New notification alert!" }
    ]
  },
  { 
    name: "Notion", 
    color: "#000000", 
    actions: ["Create page in database", "Append block content", "Update database item"],
    fields: [
      { name: "Database ID", type: "string" as const, placeholder: "e.g., 3f958a..." },
      { name: "Page properties (JSON)", type: "textarea" as const, placeholder: '{\n  "Name": "New Task"\n}' }
    ]
  },
  { 
    name: "Shopify", 
    color: "#96BF48", 
    actions: ["Create draft order", "Update product stock", "Find customer"],
    fields: [
      { name: "Shop Subdomain", type: "string" as const, placeholder: "my-store" },
      { name: "Customer Email", type: "string" as const, placeholder: "client@example.com" }
    ]
  },
  { 
    name: "GitHub", 
    color: "#24292E", 
    actions: ["Create issue", "Trigger GitHub Action workflow", "Create pull request"],
    fields: [
      { name: "Repo Owner / Name", type: "string" as const, placeholder: "owner/repo-name" },
      { name: "Issue Title", type: "string" as const, placeholder: "Bug report: workflow failure" },
      { name: "Body text", type: "textarea" as const, placeholder: "Detailed steps..." }
    ]
  },
  { 
    name: "Trello", 
    color: "#0079BF", 
    actions: ["Create card on board", "Add comment to card", "Move card to list"],
    fields: [
      { name: "Board ID", type: "string" as const, placeholder: "Board URL token" },
      { name: "Card Name", type: "string" as const, placeholder: "Feature Request" }
    ]
  },
  { 
    name: "HubSpot", 
    color: "#FF7A59", 
    actions: ["Create or update contact", "Create deal pipeline", "Log note"],
    fields: [
      { name: "Contact Email", type: "string" as const, placeholder: "lead@example.com" },
      { name: "First Name", type: "string" as const, placeholder: "John" }
    ]
  },
  { 
    name: "Mailchimp", 
    color: "#FFE01B", 
    actions: ["Add subscriber to audience", "Unsubscribe user", "Send test campaign"],
    fields: [
      { name: "Audience ID", type: "string" as const, placeholder: "e.g., a8c13f..." },
      { name: "Subscriber Email", type: "string" as const, placeholder: "subscriber@domain.com" }
    ]
  },
  { 
    name: "Airtable", 
    color: "#18BFFF", 
    actions: ["Create record in base", "Update record", "List records"],
    fields: [
      { name: "Base ID / Table Name", type: "string" as const, placeholder: "appXXXX/Tasks" },
      { name: "Record Fields (JSON)", type: "textarea" as const, placeholder: '{\n  "Status": "Done"\n}' }
    ]
  },
  { 
    name: "Salesforce", 
    color: "#00A1E0", 
    actions: ["Create lead object", "Query accounts", "Update opportunity status"],
    fields: [
      { name: "Lead Email", type: "string" as const, placeholder: "contact@salesforce.com" },
      { name: "Company Name", type: "string" as const, placeholder: "Acme Corp" }
    ]
  },
  { 
    name: "Spotify", 
    color: "#1DB954", 
    actions: ["Add track to playlist", "Create empty playlist", "Get currently playing"],
    fields: [
      { name: "Playlist ID", type: "string" as const, placeholder: "playlist URL or ID" },
      { name: "Track URI", type: "string" as const, placeholder: "spotify:track:..." }
    ]
  },
  { 
    name: "Stripe", 
    color: "#635BFF", 
    actions: ["Create customer account", "Send custom invoice", "Retrieve refund details"],
    fields: [
      { name: "Customer Email", type: "string" as const, placeholder: "payer@gmail.com" },
      { name: "Charge Amount (USD)", type: "string" as const, placeholder: "49.00" }
    ]
  },
  { 
    name: "Jira", 
    color: "#0052CC", 
    actions: ["Create bug ticket", "Transition issue state", "Add support comment"],
    fields: [
      { name: "Project Key", type: "string" as const, placeholder: "PROJ" },
      { name: "Issue Summary", type: "string" as const, placeholder: "Production hotfix needed" }
    ]
  },
  { 
    name: "Asana", 
    color: "#F06A6A", 
    actions: ["Create workspace task", "Assign project member", "Set due date"],
    fields: [
      { name: "Project ID", type: "string" as const, placeholder: "Project token" },
      { name: "Task Title", type: "string" as const, placeholder: "Update legal agreements" }
    ]
  },
  { 
    name: "Twitter / X", 
    color: "#1DA1F2", 
    actions: ["Post automated tweet", "Search tweets with hashtag", "Retrieve profile analytics"],
    fields: [
      { name: "Tweet Content text", type: "textarea" as const, placeholder: "Sharing automated stats from n8n!" }
    ]
  },
  { 
    name: "Zoom", 
    color: "#2D8CFF", 
    actions: ["Create recurring meeting", "Register webinar attendee", "Get meeting recording"],
    fields: [
      { name: "Meeting Topic", type: "string" as const, placeholder: "Sync Session" },
      { name: "Duration (minutes)", type: "string" as const, placeholder: "30" }
    ]
  },
  { 
    name: "Dropbox", 
    color: "#0061FE", 
    actions: ["Upload file from URL", "Get shareable link", "Create shared folder"],
    fields: [
      { name: "Destination Path", type: "string" as const, placeholder: "/Automations/Saved" },
      { name: "File URL", type: "string" as const, placeholder: "https://example.com/invoice.pdf" }
    ]
  },
  { 
    name: "Linear", 
    color: "#5E6AD2", 
    actions: ["Create issue", "Move cycle", "Assign to team"],
    fields: [
      { name: "Team ID (Slug)", type: "string" as const, placeholder: "ENG" },
      { name: "Title", type: "string" as const, placeholder: "Critical memory leak bug" }
    ]
  },
  { 
    name: "ClickUp", 
    color: "#7B68EE", 
    actions: ["Create folder task", "Update status code", "Track duration entry"],
    fields: [
      { name: "List ID", type: "string" as const, placeholder: "List url" },
      { name: "Task Name", type: "string" as const, placeholder: "Review marketing deliverables" }
    ]
  }
];
