import { useState } from "react";
import { 
  LayoutDashboard, 
  GitFork, 
  FileCode, 
  History, 
  TrendingUp, 
  Settings, 
  ChevronDown,
  FolderDot,
  Pin,
  Star,
  Users,
  Building,
  UserCheck,
  Link
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  workflowName: string;
  workspaces?: { id: string; name: string; description: string }[];
  activeWorkspaceId?: string;
  onSwitchWorkspace?: (id: string) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  workflowName,
  workspaces = [
    { id: "ws_personal", name: "Personal Sandbox", description: "Default private workspace" },
    { id: "ws_enterprise", name: "Production Flows", description: "Enterprise shared workloads" }
  ],
  activeWorkspaceId = "ws_personal",
  onSwitchWorkspace
}: SidebarProps) {
  const [showWsDropdown, setShowWsDropdown] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "canvas", label: "Automation Canvas", icon: GitFork, subtitle: workflowName },
    { id: "connections", label: "Connected Apps", icon: Link },
    { id: "templates", label: "Templates Library", icon: FileCode },
    { id: "history", label: "Automation Runs", icon: History },
    { id: "analytics", label: "Analytics & Cost", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  const handleSelectWorkspace = (id: string) => {
    if (onSwitchWorkspace) {
      onSwitchWorkspace(id);
    }
    setShowWsDropdown(false);
  };

  const favoriteWorkflows = [
    { id: "wf_sentiment", name: "Customer Sentiment Router" },
    { id: "wf_grounded_research", name: "Web Grounded Analyst" }
  ];

  return (
    <div className="w-64 bg-[#080B0F] border-r border-slate-850 flex flex-col h-full text-slate-300 relative select-none">
      
      {/* Brand logo & Workspace Switcher */}
      <div className="p-4 border-b border-slate-850 flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/15">
            F
          </div>
          <div>
            <h1 className="font-extrabold text-white tracking-tight leading-none text-xs uppercase">
              FLOWFORGE <span className="text-blue-500 text-[8px] font-mono px-1 py-0.5 rounded bg-blue-500/10 ml-0.5 font-bold">AI</span>
            </h1>
          </div>
        </div>

        {/* Workspace Switcher Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowWsDropdown(!showWsDropdown)}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#0D131A] border border-slate-800 rounded-lg text-left text-xs font-semibold text-slate-200 hover:border-slate-700 transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center gap-2 truncate">
              <Building className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <div className="truncate">
                <div className="font-bold text-slate-100 leading-none truncate">{activeWorkspace.name}</div>
                <div className="text-[9px] text-slate-500 font-normal leading-none mt-1 truncate">{activeWorkspace.description}</div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors shrink-0" />
          </button>

          {showWsDropdown && (
            <div className="absolute top-11 left-0 right-0 z-45 bg-[#0B0F14] border border-slate-800 rounded-lg shadow-2xl p-1.5 space-y-1 backdrop-blur-md">
              <div className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest px-2.5 py-1.5 border-b border-slate-850 pb-1.5 mb-1 flex items-center justify-between">
                <span>Switch Workspace</span>
                <Users className="w-3 h-3 text-slate-500" />
              </div>
              {workspaces.map(ws => (
                <button
                  key={ws.id}
                  onClick={() => handleSelectWorkspace(ws.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-left text-xs font-semibold transition-all cursor-pointer ${
                    ws.id === activeWorkspaceId 
                      ? "bg-blue-600/10 text-white font-bold border border-blue-500/20" 
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <FolderDot className={`w-3.5 h-3.5 ${ws.id === activeWorkspaceId ? "text-blue-400" : "text-slate-500"}`} />
                  <div className="truncate">
                    <div className="leading-tight truncate">{ws.name}</div>
                    <div className="text-[8px] text-slate-500 font-normal leading-tight mt-0.5 truncate">{ws.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 group text-left ${
                isActive
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 font-bold shadow-sm shadow-blue-500/5"
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-100 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors duration-150 shrink-0 ${
                isActive ? "text-blue-400 font-bold" : "text-slate-500 group-hover:text-slate-200"
              }`} />
              <div className="flex-1 leading-tight min-w-0">
                <div className="text-[12px] tracking-tight">{item.label}</div>
                {item.subtitle && (
                  <div className="text-[9px] text-slate-500 truncate mt-0.5 max-w-[150px] font-mono">
                    {item.subtitle}
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Favorite/Pinned items list */}
        <div className="pt-5 border-t border-slate-850/50 mt-4 space-y-1.5">
          <div className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest px-3 flex items-center gap-1">
            <Pin className="w-2.5 h-2.5 text-blue-500" />
            <span>Pinned Flows</span>
          </div>
          {favoriteWorkflows.map((fav) => (
            <button
              key={fav.id}
              onClick={() => {
                // If dashboard trigger selected, or trigger switch
                setActiveTab("canvas");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[11px] font-medium text-slate-400 hover:bg-slate-900/45 hover:text-slate-200 text-left cursor-pointer group"
            >
              <Star className="w-3 h-3 text-amber-500/80 group-hover:text-amber-400 transition-colors shrink-0" />
              <span className="truncate leading-none">{fav.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer / Account status */}
      <div className="p-3 border-t border-slate-850 bg-[#06090D]">
        <div className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-900/30 transition-all cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-indigo-600 border border-indigo-500/10 flex items-center justify-center font-bold text-[10px] text-white uppercase shadow-md shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1">
              <span>Admin Sandbox</span>
              <UserCheck className="w-3 h-3 text-blue-400 shrink-0" />
            </div>
            <p className="text-[8px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1 font-bold">
              <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              CONNECTED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
