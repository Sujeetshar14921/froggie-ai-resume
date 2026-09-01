import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Loader2, Wand2, ShieldCheck, HelpCircle, Mic, MicOff, Briefcase, FileText, Zap } from "lucide-react";
import { useCopilot } from "../../hooks/useCopilot";
import toast from "react-hot-toast";

const CHIPS = [
  { label: "Analyze & Health Check", icon: ShieldCheck, prompt: "Perform a deep health audit and ATS check on my resume. Highlight strengths, weak verbs, and missing high-demand keywords." },
  { label: "Add Skills to Resume", icon: Wand2, prompt: "Add Docker, Kubernetes, Next.js, and TypeScript to my skills and update my resume directly." },
  { label: "What Jobs Match Me?", icon: Briefcase, prompt: "Based on my resume skills and experience, what job roles and career paths am I the best match for?" },
  { label: "Enhance with Metrics", icon: Zap, prompt: "Rewrite my work experience bullet points using the STAR method with quantifiable metric achievements (e.g. % performance, latency, users)." },
  { label: "Mock Interview", icon: HelpCircle, prompt: "Start an interactive technical mock interview based on my resume projects. Ask one question at a time and evaluate my answers." },
  { label: "Write Cover Letter", icon: FileText, prompt: "Write a high-converting, personalized cover letter based on my resume experience." },
];

const CopilotInputBar = () => {
  const { sendMessage, isTyping, messages } = useCopilot();
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
        toast.success("Listening... Speak now 🎙️", { id: "voice-toast", duration: 2500 });
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
    <div className="p-3 sm:p-4 border-t border-slate-100 bg-white/90 backdrop-blur-xl space-y-2.5 shrink-0">
      
      {/* QUICK SUGGESTION CHIPS */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {CHIPS.map((chip, i) => {
          const Icon = chip.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={() => sendMessage(chip.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200/70 hover:border-emerald-300 text-[11px] font-bold text-slate-600 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-2xs group"
            >
              <Icon size={12} className="text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* INPUT BAR */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening... Speak now..." : "Ask froggie anything: 'Add Docker', 'ATS audit', 'Paste a job description'..."}
          disabled={isTyping}
          className={`w-full pl-4 pr-24 py-3 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/70 outline-none transition-all placeholder:text-slate-400 font-medium ${
            isListening ? "border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/20" : "border-slate-200/90"
          }`}
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          {/* VOICE INPUT BUTTON */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
              isListening
                ? "bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
            title={isListening ? "Stop listening" : "Voice input"}
          >
            {isListening ? <MicOff size={15} /> : <Mic size={15} />}
          </button>

          {/* SEND BUTTON */}
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white transition-all shadow-md shadow-slate-950/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center border border-emerald-500/30 hover:scale-105 active:scale-95"
            title="Send message"
          >
            {isTyping ? (
              <Loader2 size={15} className="animate-spin text-emerald-400" />
            ) : (
              <Send size={15} className="text-emerald-400" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CopilotInputBar;
