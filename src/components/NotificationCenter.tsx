import { useEffect, useState } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  CheckCircle, 
  XCircle, 
  Info, 
  AlertTriangle, 
  Sparkles, 
  X 
} from "lucide-react";

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'ai';
  title: string;
  message: string;
  duration?: number; // ms
}

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
}

export default function NotificationCenter({ notifications, onDismiss }: NotificationCenterProps) {
  return (
    <div className="fixed top-16 right-6 z-50 flex flex-col gap-3 w-80 max-h-[80vh] overflow-y-auto pointer-events-none select-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <NotificationCard 
            key={notif.id}
            item={notif}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationCard({ 
  item, 
  onDismiss 
}: { 
  key?: string;
  item: NotificationItem; 
  onDismiss: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = item.duration || 4000;
  
  useEffect(() => {
    if (isHovered) return;
    
    const interval = 15; // ms
    const step = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - step;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [isHovered, duration]);

  useEffect(() => {
    if (progress <= 0) {
      onDismiss(item.id);
    }
  }, [progress, item.id, onDismiss]);

  const config = {
    success: { icon: CheckCircle, color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20", bar: "bg-emerald-500" },
    error: { icon: XCircle, color: "text-red-400 border-red-500/20 bg-red-950/20", bar: "bg-red-500" },
    info: { icon: Info, color: "text-blue-400 border-blue-500/20 bg-blue-950/20", bar: "bg-blue-500" },
    warning: { icon: AlertTriangle, color: "text-amber-400 border-amber-500/20 bg-amber-950/20", bar: "bg-amber-500" },
    ai: { icon: Sparkles, color: "text-purple-400 border-purple-500/20 bg-purple-950/20", bar: "bg-purple-500" }
  }[item.type];

  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ x: 100, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 120, opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto flex flex-col rounded-xl border p-3.5 shadow-2xl backdrop-blur-md ${config.color} relative overflow-hidden`}
    >
      {/* Content */}
      <div className="flex items-start gap-3">
        <div className={`p-1 rounded bg-slate-950/30 ${item.type === 'ai' ? 'animate-pulse' : ''}`}>
          <Icon className="w-4 h-4 shrink-0" />
        </div>
        <div className="flex-1 pr-4 min-w-0">
          <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide leading-tight">{item.title}</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-1">{item.message}</p>
        </div>
        <button
          onClick={() => onDismiss(item.id)}
          className="p-1 rounded hover:bg-slate-950/20 text-slate-500 hover:text-white transition-all cursor-pointer shrink-0"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Progress Timers */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800/40">
        <div 
          className={`h-full transition-all duration-75 ${config.bar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}
