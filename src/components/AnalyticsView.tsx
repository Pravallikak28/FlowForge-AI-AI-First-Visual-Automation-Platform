import { 
  TrendingUp, 
  Cpu, 
  Clock, 
  DollarSign,
  Activity,
  Award,
  Zap,
  Sparkles,
  Layers,
  CheckCircle,
  AlertOctagon
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
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from "recharts";

export default function AnalyticsView() {
  const dailyMetrics = [
    { name: "06/21", tokens: 42000, latency: 1200, cost: 0.126, successRate: 98 },
    { name: "06/22", tokens: 68000, latency: 1450, cost: 0.204, successRate: 97 },
    { name: "06/23", tokens: 85000, latency: 1100, cost: 0.255, successRate: 99 },
    { name: "06/24", tokens: 55000, latency: 1600, cost: 0.165, successRate: 95 },
    { name: "06/25", tokens: 140000, latency: 1300, cost: 0.420, successRate: 98 },
    { name: "06/26", tokens: 110000, latency: 1050, cost: 0.330, successRate: 100 },
    { name: "06/27", tokens: 195000, latency: 1250, cost: 0.585, successRate: 99 },
  ];

  const nodePerformance = [
    { node: "Gemini Synthesis", avgTime: 1240, errorRate: 1.2, fill: "#8B5CF6" },
    { node: "Prompt Compiler", avgTime: 80, errorRate: 0.0, fill: "#14B8A6" },
    { node: "Vector Retriever", avgTime: 310, errorRate: 0.5, fill: "#3B82F6" },
    { node: "Database Lookup", avgTime: 45, errorRate: 0.8, fill: "#0EA5E9" },
    { node: "Webhook Listener", avgTime: 12, errorRate: 2.1, fill: "#10B981" },
    { node: "HTTP Request", avgTime: 850, errorRate: 4.8, fill: "#F59E0B" }
  ];

  const costBreakdown = [
    { name: "gemini-3.5-flash", value: 72, color: "#10B981" },
    { name: "gemini-3.1-pro-preview", value: 21, color: "#8B5CF6" },
    { name: "Google Embeddings", value: 7, color: "#3B82F6" },
  ];

  return (
    <div className="flex-1 bg-[#080B0F] text-slate-100 overflow-y-auto p-8 select-none">
      
      {/* Title */}
      <div className="mb-8 border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 uppercase font-sans">
          <TrendingUp className="w-4.5 h-4.5 text-blue-400" />
          Analytics & Usage Dashboard
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Real-time resource utilization, token costs, model latency profiles, error trends, and step orchestration metrics.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Token Efficiency */}
        <div className="bg-[#0D131A] border border-slate-800 p-5 rounded">
          <p className="text-[9px] font-mono tracking-wider text-slate-500 uppercase font-bold">Token Efficiency Index</p>
          <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2 font-sans">
            94.2%
            <span className="text-xs text-emerald-400 font-mono font-bold">+1.4%</span>
          </h3>
          <p className="text-[9px] text-slate-500 mt-2 font-mono leading-relaxed font-bold">Optimal variable substitution minimizes prompt overhead costs.</p>
        </div>

        {/* Consolidated Spends */}
        <div className="bg-[#0D131A] border border-slate-800 p-5 rounded">
          <p className="text-[9px] font-mono tracking-wider text-slate-500 uppercase font-bold">Consolidated Spends</p>
          <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2 font-sans">
            $2.085
            <span className="text-xs text-blue-400 font-mono font-bold">Budget Safe</span>
          </h3>
          <p className="text-[9px] text-slate-500 mt-2 font-mono leading-relaxed font-bold">Calculated dynamically based on active token weights.</p>
        </div>

        {/* Latency Jitter */}
        <div className="bg-[#0D131A] border border-slate-800 p-5 rounded">
          <p className="text-[9px] font-mono tracking-wider text-slate-500 uppercase font-bold">Success Execution Rate</p>
          <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2 font-sans">
            98.3%
            <span className="text-xs text-emerald-400 font-mono font-bold">High Quality</span>
          </h3>
          <p className="text-[9px] text-slate-500 mt-2 font-mono leading-relaxed font-bold">Only 12 pipeline failures over the past 10,000 requests.</p>
        </div>

        {/* Cache Hit Rate */}
        <div className="bg-[#0D131A] border border-slate-800 p-5 rounded">
          <p className="text-[9px] font-mono tracking-wider text-slate-500 uppercase font-bold">Vector Cache Hit Rate</p>
          <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2 font-sans">
            81.4%
            <span className="text-xs text-indigo-400 font-mono font-bold font-sans">High Hit</span>
          </h3>
          <p className="text-[9px] text-slate-500 mt-2 font-mono leading-relaxed font-bold">In-memory Redis buffers conversational context loops.</p>
        </div>

      </div>

      {/* Recharts Graphs */}
      <div className="space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cost Profile over time */}
          <div className="lg:col-span-2 bg-[#0D131A] border border-slate-800 p-5 rounded flex flex-col justify-between">
            <h4 className="font-semibold text-white text-xs uppercase font-sans mb-6 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Consolidated Spent Distribution & Telemetry Latency (USD / ms)
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyMetrics}>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0D131A", borderColor: "#334155", borderRadius: "4px", fontSize: "11px" }} />
                  <Area type="monotone" dataKey="cost" stroke="#10B981" strokeWidth={1.5} fillOpacity={0.15} fill="#10B981" name="Est. Cost (USD)" />
                  <Area type="monotone" dataKey="latency" stroke="#3B82F6" strokeWidth={1.5} fillOpacity={0.05} fill="#3B82F6" name="Latency (ms)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model distribution pie chart */}
          <div className="bg-[#0D131A] border border-slate-800 p-5 rounded flex flex-col justify-between">
            <h4 className="font-semibold text-white text-xs uppercase font-sans mb-4">API Model Tokens Breakdown</h4>
            <div className="h-44 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ backgroundColor: "#0D131A", borderColor: "#334155", borderRadius: "4px", fontSize: "11px" }} />
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-4 border-t border-slate-800/60 pt-4">
              {costBreakdown.map((b) => (
                <div key={b.name} className="flex justify-between items-center text-[10px] font-mono font-bold">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: b.color }}></span>
                    {b.name}
                  </span>
                  <span className="text-slate-400 font-bold">{b.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Latency & Node Reliability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Node Execution Latency Bar Chart */}
          <div className="bg-[#0D131A] border border-slate-800 p-5 rounded flex flex-col justify-between">
            <h4 className="font-semibold text-white text-xs uppercase font-sans mb-6 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Node Average Ingestion Latency (ms)
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nodePerformance}>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="node" stroke="#475569" fontSize={9} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0D131A", borderColor: "#334155", borderRadius: "4px", fontSize: "11px" }} />
                  <Bar dataKey="avgTime" radius={[4, 4, 0, 0]}>
                    {nodePerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Success vs Error Trends Over Time */}
          <div className="bg-[#0D131A] border border-slate-800 p-5 rounded flex flex-col justify-between">
            <h4 className="font-semibold text-white text-xs uppercase font-sans mb-6 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              Ingestion Success vs Reliability Telemetry (%)
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyMetrics}>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} domain={[90, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "#0D131A", borderColor: "#334155", borderRadius: "4px", fontSize: "11px" }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Line type="monotone" dataKey="successRate" stroke="#10B981" strokeWidth={2} name="Success Rate %" activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
