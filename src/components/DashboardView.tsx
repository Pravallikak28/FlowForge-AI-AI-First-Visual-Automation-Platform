import { useState } from "react";
import { 
  Plus, 
  Play, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Database, 
  Cpu, 
  TrendingUp, 
  Workflow as WorkflowIcon, 
  Star, 
  Flame,
  Search,
  FileCode,
  Globe,
  Settings
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { Workflow, Stats } from "../types";

interface DashboardViewProps {
  workflows: Workflow[];
  stats: Stats;
  onOpenWorkflow: (id: string) => void;
  onNewWorkflow: () => void;
  onLoadTemplate: (templateId: string) => void;
  onTriggerDemo?: () => void;
}

export default function DashboardView({ 
  workflows, 
  stats, 
  onOpenWorkflow, 
  onNewWorkflow,
  onLoadTemplate,
  onTriggerDemo
}: DashboardViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample historical data for the charts
  const historyData = [
    { name: "Mon", executions: 120, tokens: 42000, cost: 0.12 },
    { name: "Tue", executions: 180, tokens: 68000, cost: 0.18 },
    { name: "Wed", executions: 220, tokens: 85000, cost: 0.24 },
    { name: "Thu", executions: 150, tokens: 55000, cost: 0.15 },
    { name: "Fri", executions: 340, tokens: 140000, cost: 0.45 },
    { name: "Sat", executions: 290, tokens: 110000, cost: 0.35 },
    { name: "Sun", executions: 410, tokens: 195000, cost: 0.58 },
  ];

  const nodeStatsData = [
    { name: "Start", count: 24, color: "#3B82F6" },
    { name: "Prompt", count: 42, color: "#10B981" },
    { name: "Gemini", count: 56, color: "#8B5CF6" },
    { name: "Retriever", count: 31, color: "#F59E0B" },
    { name: "Tool", count: 18, color: "#EC4899" },
    { name: "Condition", count: 15, color: "#EF4444" },
    { name: "Output", count: 22, color: "#06B6D4" },
  ];

  // Templates list
  const popularTemplates = [
    {
      id: "chatbot",
      title: "RAG Assistant with Memory",
      desc: "Retrieve knowledge from private PDFs and inject custom instructions to Gemini with conversation memory.",
      nodes: 6,
      complexity: "Intermediate",
      color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400"
    },
    {
      id: "agent",
      title: "Self-Improving Research Agent",
      desc: "Orchestrate an agent that queries the web, extracts information, criticizes results, and reformulates prompts.",
      nodes: 8,
      complexity: "Advanced",
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400"
    },
    {
      id: "customer_support",
      title: "E-Commerce Support Loop",
      desc: "Intelligently routing incoming emails with sentiment classification, database lookup, and auto-generated responses.",
      nodes: 7,
      complexity: "Advanced",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400"
    }
  ];

  const filteredWorkflows = workflows.filter(
    w => w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         w.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#080B0F] text-slate-100 overflow-y-auto p-8 select-none">
      
      {/* Top Welcome Bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white uppercase font-sans">FlowForge AI</h2>
          <p className="text-slate-500 text-xs mt-1">The AI Automation Platform — Describe it. AI builds it. AI explains it. You refine it.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search automations, steps, runs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-[#0D131A] border border-slate-800 rounded text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 w-64 transition-all"
            />
          </div>

          {onTriggerDemo && (
            <button
              onClick={onTriggerDemo}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-transparent transition-all font-semibold text-xs cursor-pointer shadow-lg shadow-emerald-500/5"
            >
              <Flame className="w-3.5 h-3.5 animate-pulse text-emerald-400 group-hover:text-white" />
              Demo Mode
            </button>
          )}
          
          <button 
            onClick={onNewWorkflow}
            className="flex items-center gap-2 px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/10 transition-all cursor-pointer border border-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            New Automation
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Total Workflows */}
        <div className="bg-[#0D131A] border border-slate-800 p-5 rounded relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] font-mono tracking-wider text-slate-500 uppercase font-bold">Orchestrated</p>
              <h3 className="text-xl font-bold text-white mt-1.5 font-sans">{stats.totalWorkflows}</h3>
            </div>
            <div className="p-1.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <WorkflowIcon className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[9px] text-slate-500 font-mono font-bold">
            <span className="text-emerald-400 font-bold">+2 today</span>
            <span>•</span>
            <span>Local Sync Active</span>
          </div>
        </div>

        {/* Executions */}
        <div className="bg-[#0D131A] border border-slate-800 p-5 rounded relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] font-mono tracking-wider text-slate-500 uppercase font-bold">Runs Completed</p>
              <h3 className="text-xl font-bold text-white mt-1.5 font-sans">{stats.totalExecutions}</h3>
            </div>
            <div className="p-1.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Play className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[9px] text-slate-500 font-mono font-bold">
            <span className="text-emerald-400 font-bold">98.4% Success</span>
            <span>•</span>
            <span>34 Active Loops</span>
          </div>
        </div>

        {/* Avg Runtime */}
        <div className="bg-[#0D131A] border border-slate-800 p-5 rounded relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] font-mono tracking-wider text-slate-500 uppercase font-bold">Avg Core Latency</p>
              <h3 className="text-xl font-bold text-white mt-1.5 font-sans">{(stats.avgRuntime / 1000).toFixed(2)}s</h3>
            </div>
            <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[9px] text-slate-500 font-mono font-bold">
            <span className="text-blue-400 font-bold">-120ms Drop</span>
            <span>•</span>
            <span>Optimized Core</span>
          </div>
        </div>

        {/* Cost / Resource Usage */}
        <div className="bg-[#0D131A] border border-slate-800 p-5 rounded relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] font-mono tracking-wider text-slate-500 uppercase font-bold">Total Token Cost</p>
              <h3 className="text-xl font-bold text-white mt-1.5 font-sans">${stats.estimatedCost.toFixed(4)}</h3>
            </div>
            <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[9px] text-slate-500 font-mono font-bold">
            <span className="text-slate-400">{stats.tokenUsage.toLocaleString()} tokens</span>
            <span>•</span>
            <span className="text-emerald-400">100% Secure</span>
          </div>
        </div>

      </div>

      {/* Visual Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Core Execution Volume Chart */}
        <div className="lg:col-span-2 bg-[#0D131A] border border-slate-800 p-5 rounded flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-semibold text-white text-xs uppercase font-sans">Execution Volume & Token Footprint</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Historical activity for the visual AI network.</p>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-mono font-bold">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2 h-2 rounded bg-blue-500 inline-block"></span>
                Runs
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2 h-2 rounded bg-indigo-500 inline-block"></span>
                Tokens
              </span>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorExecutions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0D131A", borderColor: "#334155", borderRadius: "4px", fontSize: "11px", color: "#F3F4F6" }} 
                  labelClassName="text-slate-400 font-semibold"
                />
                <Area type="monotone" dataKey="executions" stroke="#3B82F6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorExecutions)" />
                <Area type="monotone" dataKey="tokens" stroke="#8B5CF6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorTokens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Node Popularity Distribution Bar Chart */}
        <div className="bg-[#0D131A] border border-slate-800 p-5 rounded flex flex-col justify-between">
          <div>
            <h4 className="font-semibold text-white text-xs uppercase font-sans">Node Type Popularity</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Most frequently utilized architecture blocks.</p>
          </div>

          <div className="h-56 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nodeStatsData} layout="vertical" margin={{ left: -15, right: 10 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                <XAxis type="number" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0D131A", borderColor: "#334155", borderRadius: "4px", fontSize: "11px" }}
                />
                <Bar dataKey="count" radius={[0, 2, 2, 0]} barSize={10}>
                  {nodeStatsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-4 border-t border-slate-800/60 pt-3 font-bold">
            <span>High: Gemini Model</span>
            <span>Total: 209 blocks</span>
          </div>
        </div>

      </div>

      {/* Popular Templates & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Templates Quick Start */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-white text-xs uppercase font-sans">Premium Blueprint Templates</h4>
            <span className="text-[11px] text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
              View all blueprints <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularTemplates.map((tpl) => (
              <div 
                key={tpl.id}
                onClick={() => onLoadTemplate(tpl.id)}
                className="bg-[#0D131A] border border-slate-800 p-4 rounded hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-gradient-to-r ${tpl.color} border w-fit mb-3`}>
                    {tpl.complexity}
                  </div>
                  <h5 className="font-semibold text-white text-[13px] group-hover:text-blue-400 transition-colors leading-snug">{tpl.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed truncate-2-lines">{tpl.desc}</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800/40 text-[9px] font-mono text-slate-500 font-bold">
                  <span>{tpl.nodes} standard nodes</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div>
          <h4 className="font-semibold text-white text-xs uppercase font-sans mb-4">Core Actions</h4>
          <div className="bg-[#0D131A] border border-slate-800 p-4 rounded space-y-3">
            
            <button 
              onClick={onNewWorkflow}
              className="w-full flex items-center gap-3 p-2.5 rounded text-left bg-blue-600/10 hover:bg-blue-600/15 text-blue-400 border border-blue-500/20 transition-all cursor-pointer group"
            >
              <div className="p-1.5 rounded bg-blue-600/20 text-blue-400 group-hover:scale-105 transition-transform">
                <WorkflowIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-white">Create Sandbox</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Initialize a blank infinite canvas.</div>
              </div>
            </button>

            <button 
              onClick={() => onLoadTemplate("chatbot")}
              className="w-full flex items-center gap-3 p-2.5 rounded text-left bg-slate-900 hover:bg-slate-900/80 border border-slate-800 transition-all cursor-pointer group"
            >
              <div className="p-1.5 rounded bg-indigo-600/10 text-indigo-400">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-white">Inject RAG Blueprints</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Quickly import vector storage node loops.</div>
              </div>
            </button>

            <button 
              className="w-full flex items-center gap-3 p-2.5 rounded text-left bg-slate-900 hover:bg-slate-900/80 border border-slate-800 transition-all cursor-pointer group"
            >
              <div className="p-1.5 rounded bg-emerald-600/10 text-emerald-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-white">Offline Synchronization</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Sync database context to local state store.</div>
              </div>
            </button>

          </div>
        </div>

      </div>

      {/* Recent Active Workflows List */}
      <div>
        <h4 className="font-semibold text-white text-xs uppercase font-sans mb-4">My visual AI pipelines ({filteredWorkflows.length})</h4>
        <div className="bg-[#0D131A] border border-slate-800 rounded overflow-hidden">
          {filteredWorkflows.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No workflows found. Click "New Workflow" to build one!
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {filteredWorkflows.map((wf) => (
                <div 
                  key={wf.id}
                  className="p-4 hover:bg-slate-900/40 transition-colors flex items-center justify-between group cursor-pointer"
                  onClick={() => onOpenWorkflow(wf.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      <WorkflowIcon className="w-4.5 h-4.5 text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors truncate">{wf.name}</h5>
                        <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 font-bold">v{wf.version}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-xl mt-1">{wf.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-[10px] font-mono font-bold">
                    
                    {/* Status badge */}
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        wf.status === "active" ? "bg-emerald-500" : "bg-yellow-500"
                      }`}></span>
                      <span className="text-slate-300 capitalize">{wf.status}</span>
                    </div>

                    {/* Nodes counter */}
                    <div className="text-slate-400 hidden sm:block">
                      {wf.nodes.length} nodes • {wf.edges.length} edges
                    </div>

                    {/* Last Updated */}
                    <div className="text-slate-500 hidden md:block">
                      Updated {wf.updated}
                    </div>

                    {/* Open Arrow */}
                    <div className="p-1 rounded bg-slate-900 border border-slate-800 group-hover:border-slate-700 group-hover:bg-slate-850 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
