import { useState } from "react";
import { Sparkles, ArrowRight, Play, CheckCircle2, Award, Zap, Smile } from "lucide-react";

interface OnboardingGuideProps {
  onDismiss: () => void;
}

export default function OnboardingGuide({ onDismiss }: OnboardingGuideProps) {
  const [step, setStep] = useState(1);

  const steps = [
    {
      title: "Welcome to FlowForge!",
      desc: "FlowForge is the easiest AI Automation Platform on earth. Here, you don't build complex pipelines — you tell our AI what you want, and it orchestrates the steps.",
      icon: Smile,
      color: "text-blue-400"
    },
    {
      title: "Add Steps on the Left",
      desc: "Need to watch an inbox, ask Gemini a question, or log row details to Google Sheets? Drag or tap blocks from the steps tray to build your custom automation instantly.",
      icon: Zap,
      color: "text-amber-400"
    },
    {
      title: "Safe Real-Time Previewing",
      desc: "Press the 'Preview Automation' button in the header anytime. We run a secure simulation so you can check payloads, logs, and speed without breaking live products.",
      icon: Play,
      color: "text-emerald-400"
    },
    {
      title: "Plain-English Translations",
      desc: "Never look at complex code arrays again. Expand 'AI Explains' on the right sidebar anytime to see a beautiful, human-readable breakdown of what your flow does.",
      icon: Sparkles,
      color: "text-purple-400"
    }
  ];

  const current = steps[step - 1];
  const CurrentIcon = current.icon;

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      localStorage.setItem("flowforge_onboarding_done", "true");
      onDismiss();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 select-none">
      <div className="bg-[#0B0F14] border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl relative space-y-6 text-center animate-in zoom-in-95 duration-200">
        
        {/* Step dots */}
        <div className="flex justify-center gap-1.5">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 === step ? "w-6 bg-blue-500" : "w-1.5 bg-slate-800"
              }`}
            />
          ))}
        </div>

        {/* Header Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800/80 shadow-inner">
          <CurrentIcon className={`w-8 h-8 ${current.color} animate-pulse`} />
        </div>

        {/* Description details */}
        <div className="space-y-2">
          <h3 className="text-lg font-black text-white tracking-wide uppercase font-sans">
            {current.title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-xs mx-auto">
            {current.desc}
          </p>
        </div>

        {/* Navigation Action CTA */}
        <div className="pt-2">
          <button
            onClick={handleNext}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/10 transition-all hover:scale-[1.02]"
          >
            {step === steps.length ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                Let's Build!
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>

          <button
            onClick={() => {
              localStorage.setItem("flowforge_onboarding_done", "true");
              onDismiss();
            }}
            className="mt-3 text-[10px] text-slate-500 hover:text-slate-300 font-bold uppercase tracking-wider font-mono cursor-pointer"
          >
            Skip Tutorial
          </button>
        </div>

      </div>
    </div>
  );
}
