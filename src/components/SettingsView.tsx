import { 
  Settings, 
  Key, 
  Mail, 
  Webhook, 
  CheckCircle, 
  Layers, 
  HelpCircle,
  Database,
  Cpu,
  RefreshCw,
  Clock,
  Eye,
  Sliders,
  Keyboard,
  ShieldAlert,
  BarChart2,
  Bell,
  Sparkles
} from "lucide-react";
import { useState } from "react";

type SettingsTab = "workspace" | "appearance" | "execution" | "performance" | "keyboard" | "theme" | "analytics" | "notifications" | "experimental";

export default function SettingsView() {
  const [activeSubTab, setActiveSubTab] = useState<SettingsTab>("workspace");
  const [defaultModel, setDefaultModel] = useState("gemini-3.5-flash");
  const [defaultTemp, setDefaultTemp] = useState(0.5);
  const [chunkSize, setChunkSize] = useState(512);
  const [isSaved, setIsSaved] = useState(false);

  // Appearance State
  const [gridStyle, setGridStyle] = useState("dots");
  const [snapGrid, setSnapGrid] = useState(true);

  // Execution State
  const [dryRun, setDryRun] = useState(false);
  const [timeoutMs, setTimeoutMs] = useState(15000);

  // Performance State
  const [canvasFps, setCanvasFps] = useState("60");

  // Keyboard Prefix
  const [shortcutPrefix, setShortcutPrefix] = useState("Ctrl");

  // Selected Theme
  const [currentTheme, setCurrentTheme] = useState("cosmic_slate");

  // Analytics Settings
  const [telemetry, setTelemetry] = useState(true);

  // Notification slider
  const [toastDuration, setToastDuration] = useState(4);

  // Experimental Toggle
  const [copilotAssist, setCopilotAssist] = useState(true);

  const handleSaveSettings = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const tabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: "workspace", label: "Workspace & Models", icon: Database },
    { id: "appearance", label: "Canvas Appearance", icon: Eye },
    { id: "execution", label: "Execution Sandbox", icon: Clock },
    { id: "performance", label: "Performance Profile", icon: Cpu },
    { id: "keyboard", label: "Keyboard & Binds", icon: Keyboard },
    { id: "theme", label: "Color Themes", icon: Sliders },
    { id: "analytics", label: "Telemetry & Logs", icon: BarChart2 },
    { id: "notifications", label: "Notifications Center", icon: Bell },
    { id: "experimental", label: "Beta & AI Features", icon: Sparkles }
  ];

  return (
    <div className="flex-1 bg-[#080B0F] text-slate-100 overflow-y-auto p-8 select-none flex flex-col">
      
      {/* Settings Title Header */}
      <div className="mb-6 border-b border-slate-850 pb-5">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 uppercase font-sans">
          <Settings className="w-5 h-5 text-indigo-450" />
          Workspace Settings Configurations
        </h2>
        <p className="text-slate-500 text-xs mt-1">Configure visual parameters, sandbox LLM models, keystroke bindings, and performance metrics.</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Side Sub-Navigation Tabs */}
        <div className="w-full md:w-56 shrink-0 flex flex-col gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left text-xs font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 font-bold" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-400 font-bold" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side Settings Panel Area */}
        <div className="flex-1 bg-[#0D131A] border border-slate-850 rounded-xl p-6 shadow-2xl space-y-6 w-full max-w-2xl">
          
          {/* TAB 1: WORKSPACE */}
          {activeSubTab === "workspace" && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-500" />
                Workspace Default Configurations
              </h4>

              {/* API Key Security Box */}
              <div className="bg-[#080B0F]/80 border border-slate-850 p-4 rounded flex items-start gap-4">
                <Key className="w-4.5 h-4.5 text-emerald-400 mt-0.5 shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h5 className="text-[10px] font-bold text-white uppercase font-sans">Google Gemini API Connection</h5>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    FlowForge utilizes the preloaded environment Gemini secret. Access the <span className="text-blue-400 font-bold">Secrets</span> drawer to configure private custom production accounts.
                  </p>
                  <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono pt-1 font-bold">
                    <CheckCircle className="w-3 h-3" />
                    Key Verified (process.env.GEMINI_API_KEY)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Global Fallback Model</label>
                  <select 
                    value={defaultModel}
                    onChange={(e) => setDefaultModel(e.target.value)}
                    className="mt-1.5 w-full px-3 py-1.5 bg-[#080B0F] border border-slate-800 rounded text-xs font-semibold text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="gemini-3.5-flash">gemini-3.5-flash (Fast Reasoning)</option>
                    <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Tasks)</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Cost Effective)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Global Temperature</label>
                    <span className="text-xs font-mono text-blue-400 font-bold">{defaultTemp}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={defaultTemp}
                    onChange={(e) => setDefaultTemp(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-3"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Default Document Chunk Size</label>
                <input 
                  type="number" 
                  value={chunkSize}
                  onChange={(e) => setChunkSize(parseInt(e.target.value))}
                  className="mt-1.5 w-full px-3 py-1.5 bg-[#080B0F] border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-blue-500/50 font-mono font-bold"
                />
                <p className="text-[9px] text-slate-500 mt-1">Decompose raw PDFs or text blocks into target character counts prior to database vector searches.</p>
              </div>
            </div>
          )}

          {/* TAB 2: APPEARANCE */}
          {activeSubTab === "appearance" && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" />
                Canvas Appearance Config
              </h4>

              <div>
                <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Grid Background Pattern</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {["dots", "lines", "none"].map(style => (
                    <button
                      key={style}
                      onClick={() => setGridStyle(style)}
                      className={`px-3 py-2 rounded text-[10px] uppercase tracking-wider font-mono font-bold border transition-all ${
                        gridStyle === style 
                          ? "bg-blue-600/15 border-blue-500 text-blue-400" 
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950/20 border border-slate-850 rounded-lg">
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Magnetic Snapping Grid</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">Snap node cards dynamically to 20px grid intersections during drag actions.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={snapGrid}
                  onChange={(e) => setSnapGrid(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-800 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* TAB 3: EXECUTION */}
          {activeSubTab === "execution" && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Execution Sandbox Settings
              </h4>

              <div className="flex items-center justify-between p-3.5 bg-slate-950/20 border border-slate-850 rounded-lg">
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Dry-run Simulation Mode</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">Simulate topological processing loops without consuming production token keys.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-800 rounded focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Max Execution Timeout (ms)</label>
                <input 
                  type="number" 
                  value={timeoutMs}
                  onChange={(e) => setTimeoutMs(parseInt(e.target.value))}
                  className="mt-1.5 w-full px-3 py-1.5 bg-[#080B0F] border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-blue-500/50 font-mono"
                />
                <p className="text-[9px] text-slate-500 mt-1">Maximum lifetime allowed for singular loop execution cascades before safety break termination.</p>
              </div>
            </div>
          )}

          {/* TAB 4: PERFORMANCE */}
          {activeSubTab === "performance" && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                Performance Optimization Profiles
              </h4>

              <div>
                <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Canvas Target Refresh Rate</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    { id: "30", label: "30 FPS (Saver Mode)" },
                    { id: "60", label: "60 FPS (Default Ultra)" }
                  ].map(fps => (
                    <button
                      key={fps.id}
                      onClick={() => setCanvasFps(fps.id)}
                      className={`px-3 py-2.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold border transition-all ${
                        canvasFps === fps.id 
                          ? "bg-blue-600/15 border-blue-500 text-blue-400" 
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {fps.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-blue-500/5 border border-blue-500/10 rounded-lg text-[11px] text-slate-400 leading-normal font-sans">
                💡 FlowForge automatically deploys WebGL canvas pooling and component virtualization to preserve ultra 60FPS fluid pan metrics on workflows exceeding 120+ active nodes.
              </div>
            </div>
          )}

          {/* TAB 5: KEYBOARD */}
          {activeSubTab === "keyboard" && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-blue-500" />
                Keystroke Configurations
              </h4>

              <div>
                <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Global Modifier Key</label>
                <select 
                  value={shortcutPrefix}
                  onChange={(e) => setShortcutPrefix(e.target.value)}
                  className="mt-1.5 w-full px-3 py-1.5 bg-[#080B0F] border border-slate-800 rounded text-xs font-semibold text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="Ctrl">Control / Cmd (Default)</option>
                  <option value="Alt">Alt / Option</option>
                  <option value="Shift">Shift Option</option>
                </select>
              </div>

              <div className="space-y-1.5 font-mono text-[10px] text-slate-400">
                <div className="flex justify-between border-b border-slate-850 pb-1.5">
                  <span className="text-slate-500 font-bold">Operation</span>
                  <span className="text-white font-bold">Keyboard Binding</span>
                </div>
                <div className="flex justify-between">
                  <span>Open Command Palette</span>
                  <span className="text-indigo-400 font-bold">{shortcutPrefix} + K</span>
                </div>
                <div className="flex justify-between">
                  <span>Commit Snapshot</span>
                  <span className="text-indigo-400 font-bold">{shortcutPrefix} + S</span>
                </div>
                <div className="flex justify-between">
                  <span>Undo Canvas Alteration</span>
                  <span className="text-indigo-400 font-bold">{shortcutPrefix} + Z</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: THEME */}
          {activeSubTab === "theme" && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-500" />
                Visual Color Themes
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "cosmic_slate", label: "Cosmic Slate Dark" },
                  { id: "midnight_obsidian", label: "Midnight Obsidian" }
                ].map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setCurrentTheme(theme.id)}
                    className={`px-3 py-3 rounded-lg border text-left text-xs font-semibold transition-all ${
                      currentTheme === theme.id 
                        ? "bg-blue-600/10 border-blue-500 text-white font-bold" 
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ANALYTICS */}
          {activeSubTab === "analytics" && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-500" />
                Telemetry & Analytics Metrics
              </h4>

              <div className="flex items-center justify-between p-3.5 bg-slate-950/20 border border-slate-850 rounded-lg">
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Anonymized Performance Reports</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">Collect telemetry on latency rates to guide automated loop optimizations.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={telemetry}
                  onChange={(e) => setTelemetry(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-800 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* TAB 8: NOTIFICATIONS */}
          {activeSubTab === "notifications" && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                Notification System Control
              </h4>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Toast Dismiss Delay (seconds)</label>
                  <span className="text-xs font-mono text-blue-400 font-bold">{toastDuration}s</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="10" 
                  step="1"
                  value={toastDuration}
                  onChange={(e) => setToastDuration(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-3"
                />
              </div>
            </div>
          )}

          {/* TAB 9: EXPERIMENTAL */}
          {activeSubTab === "experimental" && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Beta Features & AI Assistant
              </h4>

              <div className="flex items-center justify-between p-3.5 bg-slate-950/20 border border-slate-850 rounded-lg">
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Gemini-assisted Prompt Repair</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">Auto-repair structural prompt syntax errors when processing model calls.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={copilotAssist}
                  onChange={(e) => setCopilotAssist(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-800 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Save Configurations Footer Bar */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-800/60">
            <button
              onClick={handleSaveSettings}
              className="px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/10 cursor-pointer border border-blue-500/20 transition-all uppercase tracking-wider"
            >
              Save Configuration Files
            </button>
            
            {isSaved && (
              <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
                <CheckCircle className="w-4 h-4" />
                Settings active in runtime.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
