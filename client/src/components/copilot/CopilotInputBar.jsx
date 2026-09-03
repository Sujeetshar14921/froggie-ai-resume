import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Loader2, Wand2, ShieldCheck, HelpCircle, Mic, MicOff, Briefcase, FileText, Zap, CornerDownLeft } from "lucide-react";
import { useCopilot } from "../../hooks/useCopilot";
import toast from "react-hot-toast";

const CHIPS = [
  { label: "ATS Health Audit", icon: ShieldCheck, prompt: "Perform a deep health audit and ATS check on my resume. Highlight strengths, weak verbs, and missing high-demand keywords." },
  { label: "Enhance Bullets (STAR)", icon: Zap, prompt: "Rewrite my work experience bullet points using the STAR method with quantifiable metric achievements (e.g. % performance, latency, scale)." },
  { label: "What Jobs Match Me?", icon: Briefcase, prompt: "Based on my resume skills and experience, what job roles and career paths am I the best match for?" },
  { label: "Add In-Demand Skills", icon: Wand2, prompt: "Suggest top 5 missing in-demand skills for my role and add them to my resume." },
  { label: "Mock Interview", icon: HelpCircle, prompt: "Start an interactive technical mock interview based on my resume projects. Ask one question at a time and evaluate my answers." },
  { label: "Tailor Cover Letter", icon: FileText, prompt: "Write a high-converting, personalized cover letter based on my active resume experience." },
];

const CopilotInputBar = () => {
  const { sendMessage, isTyping } = useCopilot();
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API for voice input
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        toast.success("Listening... Speak clearly into your mic 🎙️", { id: "voice-toast", duration: 2500 });
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error !== "no-speech") {
          toast.error("Could not capture voice. Please type your prompt.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser. Please type your prompt.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Speech recognition start error:", err);
      }
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl space-y-3 shrink-0">
      
      {/* QUICK SUGGESTION CHIPS HORIZONTAL SCROLL */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {CHIPS.map((chip, i) => {
          const Icon = chip.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={() => sendMessage(chip.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200/80 hover:border-emerald-300 text-[11px] font-bold text-slate-600 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-2xs group"
            >
              <Icon size={12} className="text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* INPUT BAR BOX */}
      <form onSubmit={handleSubmit} className="space-y-1.5">
        <div
          className={`relative flex items-center bg-slate-50/90 rounded-2xl sm:rounded-3xl border transition-all duration-200 ${
            isListening
              ? "border-emerald-500 ring-4 ring-emerald-200/60 bg-emerald-50/30"
              : "border-slate-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100/80 shadow-xs"
          }`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? "Listening... Speak now..."
                : "Ask froggie: 'Audit my ATS score', 'Paste a job description', 'Fix bullet points'..."
            }
            disabled={isTyping}
            className="w-full pl-4 sm:pl-5 pr-24 py-3 sm:py-3.5 bg-transparent rounded-2xl text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 font-medium"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {/* VOICE INPUT BUTTON */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30 ring-2 ring-rose-300"
                  : "text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/80"
              }`}
              title={isListening ? "Stop voice listening" : "Voice dictation"}
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>

            {/* SEND BUTTON */}
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white transition-all shadow-md shadow-slate-950/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center border border-emerald-500/30 hover:scale-105 active:scale-95 group"
              title="Send prompt"
            >
              {isTyping ? (
                <Loader2 size={15} className="animate-spin text-emerald-400" />
              ) : (
                <Send size={15} className="text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </div>
        </div>

        {/* KEYBOARD SHORTCUT HELPER */}
        <div className="flex items-center justify-between px-2 text-[10px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <span>Press</span>
            <kbd className="px-1 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono font-bold">
              Enter ↵
            </kbd>
            <span>to send</span>
          </span>
          <span className="hidden sm:inline text-slate-400">Shift + Enter for new line</span>
        </div>
      </form>
    </div>
  );
};

export default CopilotInputBar;
