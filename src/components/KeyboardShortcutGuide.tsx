import { 
  X, 
  Keyboard 
} from "lucide-react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";

interface KeyboardShortcutGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutGuide({ isOpen, onClose }: KeyboardShortcutGuideProps) {
  const shortcutList = [
    { keys: ["Ctrl", "K"], label: "Open Command Palette", desc: "Access all search actions & workspace switches instantly" },
    { keys: ["Ctrl", "S"], label: "Commit Snapshot Checkpoint", desc: "Commit visual node variables to git history store" },
    { keys: ["Ctrl", "Z"], label: "Undo Operation", desc: "Revert the last visual drag, connection, or setting" },
    { keys: ["Ctrl", "Shift", "Z"], label: "Redo Operation", desc: "Redo the last reverted visual action" },
    { keys: ["Delete"], label: "Delete Selected Node", desc: "Deletes selected node or connection immediately" },
    { keys: ["Ctrl", "D"], label: "Duplicate Selected Node", desc: "Clones active node with all configuration parameters" },
    { keys: ["Ctrl", "C"], label: "Copy Node Configurations", desc: "Copy active node properties to clipboard buffer" },
    { keys: ["Ctrl", "V"], label: "Paste Node Configurations", desc: "Paste copied node buffer onto active mouse coordinates" },
    { keys: ["Space"], label: "Hold Space to Pan", desc: "Hold spacebar while dragging mouse to scroll infinite workspace" },
    { keys: ["Ctrl", "/"], label: "Open Documentation", desc: "Slide out built-in help guide" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal card */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative w-full max-w-lg bg-[#0B0F14] border border-slate-800 rounded-xl shadow-2xl p-6 backdrop-blur-md flex flex-col select-none"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-850">
              <div className="flex items-center gap-2 text-indigo-400">
                <Keyboard className="w-5 h-5" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Keyboard Keybinds & Shortcuts</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded hover:bg-slate-900 text-slate-500 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="mt-4 space-y-2.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
              {shortcutList.map((sc, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded bg-slate-950/30 border border-slate-850/50 hover:border-slate-800 transition-colors"
                >
                  <div className="min-w-0 pr-4">
                    <div className="text-xs font-bold text-slate-200">{sc.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{sc.desc}</div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {sc.keys.map((key, kIdx) => (
                      <span key={kIdx} className="flex items-center gap-1">
                        {kIdx > 0 && <span className="text-slate-600 text-[10px] font-bold">+</span>}
                        <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[9px] font-mono font-bold text-slate-300 shadow-md">
                          {key}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-5 text-center text-[10px] font-mono text-slate-600 border-t border-slate-850 pt-3">
              Press <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 font-bold">Esc</kbd> to exit this view.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
