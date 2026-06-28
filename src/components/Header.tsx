import { useState, useEffect } from "react";
import { 
  Play, 
  Square, 
  Undo2, 
  Redo2, 
  Grid, 
  Compass, 
  Maximize, 
  Minimize,
  Check, 
  Edit3, 
  Save, 
  Activity, 
  Sparkles,
  RefreshCw,
  Cpu,
  Layers,
  Search,
  Users
} from "lucide-react";
import { Workflow } from "../types";

interface HeaderProps {
  workflow: Workflow;
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  snapToGrid: boolean;
  setSnapToGrid: (val: boolean) => void;
  showMultiAgentDeck: boolean;
  setShowMultiAgentDeck: (val: boolean) => void;
  onUpdateMetadata: (name: string, desc: string, status: "draft" | "active" | "paused") => void;
  onReset: () => void;
  onToggleCommandPalette?: () => void;
  onToggleHelp?: () => void;
  onToggleExport?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isDeveloperMode: boolean;
  setIsDeveloperMode: (val: boolean) => void;
}

export default function Header({
  workflow,
  isRunning,
  onRun,
  onStop,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  snapToGrid,
  setSnapToGrid,
  showMultiAgentDeck,
  setShowMultiAgentDeck,
  onUpdateMetadata,
  onReset,
  onToggleCommandPalette,
  onToggleHelp,
  onToggleExport,
  isFullscreen,
  onToggleFullscreen,
  isDeveloperMode,
  setIsDeveloperMode
}: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(workflow.name);
  const [descInput, setDescInput] = useState(workflow.description);
  const [statusVal, setStatusVal] = useState(workflow.status);

  useEffect(() => {
    setNameInput(workflow.name);
    setDescInput(workflow.description);
    setStatusVal(workflow.status);
  }, [workflow]);

  const handleSave = () => {
    onUpdateMetadata(nameInput || "Untitled Workflow", descInput, statusVal);
    setIsEditing(false);
  };

  return (
    <div className="h-14 border-b border-slate-800 bg-[#0B0F14] px-5 flex items-center justify-between text-slate-300 select-none shrink-0">
      
      {/* Workflow Metadata / Title */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded border border-slate-800 flex-1 max-w-xl">
            <input 
              type="text" 
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Automation Flow Name"
              className="bg-transparent border-none text-white text-xs font-semibold focus:outline-none w-1/3"
            />
            <input 
              type="text" 
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              placeholder="Short description of this automation..."
              className="bg-transparent border-none text-slate-400 text-[11px] focus:outline-none flex-1"
            />
            <select 
              value={statusVal}
              onChange={(e) => setStatusVal(e.target.value as any)}
              className="bg-[#0B0F14] text-[11px] text-slate-300 border border-slate-800 rounded px-2 py-1 focus:outline-none font-mono"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
            <button 
              onClick={handleSave}
              className="p-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white tracking-tight truncate max-w-[240px] text-xs uppercase font-sans">
                  {workflow.name}
                </h3>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono capitalize tracking-wider font-bold border ${
                  workflow.status === 'active' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {workflow.status}
                </span>
                <span className="text-[9px] font-mono text-slate-500 font-bold">v{workflow.version}</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-lg mt-0.5 font-medium">{workflow.description}</p>
            </div>
            
            <button 
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded hover:bg-slate-900 text-slate-500 hover:text-white transition-all cursor-pointer"
              title="Edit workflow information"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Editor controls & tools */}
      <div className="flex items-center gap-4">
        
        {/* Toggle Tools: Snap Grid, Mini Map, Reset */}
        <div className="flex items-center gap-1 border-r border-slate-800 pr-4">
          
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`p-2 rounded transition-all ${
              snapToGrid ? "bg-blue-600/15 text-blue-400 border border-blue-500/30" : "text-slate-500 hover:text-slate-200"
            }`}
            title="Snap to Grid (20px)"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowMultiAgentDeck(!showMultiAgentDeck)}
            className={`p-2 rounded transition-all ${
              showMultiAgentDeck ? "bg-purple-600/15 text-purple-400 border border-purple-500/30 animate-pulse" : "text-slate-500 hover:text-slate-200"
            }`}
            title="Toggle Multi-Agent Deck"
          >
            <Users className="w-3.5 h-3.5" />
          </button>

          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className={`p-2 rounded transition-all ${
                isFullscreen ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 animate-pulse" : "text-slate-500 hover:text-slate-200"
              }`}
              title={isFullscreen ? "Exit Fullscreen (F)" : "Immersive Fullscreen Option (F)"}
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={onReset}
            className="p-2 rounded text-slate-500 hover:text-slate-200 transition-all hover:bg-slate-900/40"
            title="Clean workflow layout"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

        </div>

        {/* Premium Quick Tools: Command Palette, Export, Help */}
        <div className="flex items-center gap-1 border-r border-slate-800 pr-4">
          {onToggleCommandPalette && (
            <button
              onClick={onToggleCommandPalette}
              className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-900/40 transition-all font-mono text-[10px] font-bold flex items-center gap-1.5 cursor-pointer"
              title="Open Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline-block border border-slate-700/60 rounded px-1 text-[8px] bg-slate-950 font-mono text-slate-500 font-bold">⌘K</span>
            </button>
          )}

          {onToggleExport && (
            <button
              onClick={onToggleExport}
              className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-900/40 transition-all cursor-pointer"
              title="Export Blueprint (Ctrl+Shift+E)"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}

          {onToggleHelp && (
            <button
              onClick={onToggleHelp}
              className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-900/40 transition-all cursor-pointer"
              title="Help Center / Node Guide (?)"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          )}
        </div>

        {/* Undo & Redo buttons */}
        <div className="flex items-center gap-1 border-r border-slate-800 pr-4">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded transition-all ${
              canUndo ? "text-slate-300 hover:text-white hover:bg-slate-900" : "text-slate-600 cursor-not-allowed"
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded transition-all ${
              canRedo ? "text-slate-300 hover:text-white hover:bg-slate-900" : "text-slate-600 cursor-not-allowed"
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* BEGINNER / DEVELOPER MODE SELECT SWITCH */}
        <div className="flex items-center gap-1 bg-[#080B0F] p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setIsDeveloperMode(false)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              !isDeveloperMode 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                : "text-slate-500 hover:text-slate-300"
            }`}
            title="Beginner Mode: Clear, simple settings for flawless automation"
          >
            Beginner
          </button>
          <button
            onClick={() => setIsDeveloperMode(true)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isDeveloperMode 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                : "text-slate-500 hover:text-slate-300"
            }`}
            title="Developer Mode: Advanced JSON variables, retries, and manual overrides"
          >
            Developer
          </button>
        </div>

        {/* PREVIEW AUTOMATION CTA */}
        <div>
          {isRunning ? (
            <button
              onClick={onStop}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-rose-600 text-white font-semibold text-xs shadow-md shadow-rose-500/10 animate-pulse border border-rose-500/20 cursor-pointer"
            >
              <Square className="w-3 h-3 fill-current" />
              Stop Preview
            </button>
          ) : (
            <button
              onClick={onRun}
              className="flex items-center gap-2 px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/10 cursor-pointer transition-colors group"
            >
              <Play className="w-3 h-3 fill-current group-hover:scale-110 transition-transform" />
              Preview Automation
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
