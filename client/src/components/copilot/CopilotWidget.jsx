import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Copilot3DIcon } from "../FrogLogo";
import { useCopilot } from "../../hooks/useCopilot";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";

/**
 * CopilotWidget
 * Mobile: Native Draggable & Droppable Floating Window Icon (Chat Head).
 * Desktop: Elegant Floating Aurora Pill.
 */
const CopilotWidget = () => {
  const { user } = useSelector((state) => state.auth);
  const { isOpen, openCopilot } = useCopilot();
  const navigate = useNavigate();

  const widgetRef = useRef(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 1024
  );

  // Position on mobile (x, y coordinates)
  const [mobilePos, setMobilePos] = useState(() => {
    if (typeof window === "undefined") return { x: 20, y: 500 };
    const savedY = Number(localStorage.getItem("froggie_copilot_y"));
    const defaultY = Math.max(100, window.innerHeight - 145);
    const y = savedY && savedY > 70 && savedY < window.innerHeight - 120 ? savedY : defaultY;
    const x = window.innerWidth - 68; // Start on right edge
    return { x, y };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0, hasMoved: false });

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setMobilePos((prev) => ({
          x: Math.min(prev.x, window.innerWidth - 68),
          y: Math.min(Math.max(prev.y, 70), window.innerHeight - 135),
        }));
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = useCallback(() => {
    if (!user) {
      toast.success("Welcome! Sign in or create a free account to chat with froggie AI Copilot!", {
        icon: "🐸",
      });
      navigate("/login?state=register&redirect=copilot");
      return;
    }
    openCopilot();
  }, [user, navigate, openCopilot]);

  // Touch Handlers for Mobile Drag and Drop
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startPosX: mobilePos.x,
      startPosY: mobilePos.y,
      hasMoved: false,
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isMobile) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.startX;
    const dy = touch.clientY - dragStartRef.current.startY;

    if (Math.hypot(dx, dy) > 6) {
      dragStartRef.current.hasMoved = true;
    }

    const minX = 8;
    const maxX = window.innerWidth - 64;
    const minY = 65; // Below top header
    const maxY = window.innerHeight - 130; // Above bottom nav bar

    const nextX = Math.max(minX, Math.min(maxX, dragStartRef.current.startPosX + dx));
    const nextY = Math.max(minY, Math.min(maxY, dragStartRef.current.startPosY + dy));

    setMobilePos({ x: nextX, y: nextY });
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    setIsDragging(false);

    if (dragStartRef.current.hasMoved) {
      // Snap smoothly to nearest edge (left or right) like AssistiveTouch / Messenger chat heads
      const snapX = mobilePos.x < window.innerWidth / 2 ? 10 : window.innerWidth - 64;
      setMobilePos((prev) => ({ ...prev, x: snapX }));
      localStorage.setItem("froggie_copilot_y", String(mobilePos.y));
    } else {
      // Clean tap without drag
      handleClick();
    }
  };

  // Mouse Handlers (Support mouse drag on mobile simulator or desktop testing)
  const handleMouseDown = (e) => {
    if (!isMobile) return;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: mobilePos.x,
      startPosY: mobilePos.y,
      hasMoved: false,
    };
    setIsDragging(true);

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - dragStartRef.current.startX;
      const dy = moveEvent.clientY - dragStartRef.current.startY;

      if (Math.hypot(dx, dy) > 6) {
        dragStartRef.current.hasMoved = true;
      }

      const minX = 8;
      const maxX = window.innerWidth - 64;
      const minY = 65;
      const maxY = window.innerHeight - 130;

      const nextX = Math.max(minX, Math.min(maxX, dragStartRef.current.startPosX + dx));
      const nextY = Math.max(minY, Math.min(maxY, dragStartRef.current.startPosY + dy));

      setMobilePos({ x: nextX, y: nextY });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      setIsDragging(false);

      if (dragStartRef.current.hasMoved) {
        const snapX = mobilePos.x < window.innerWidth / 2 ? 10 : window.innerWidth - 64;
        setMobilePos((prev) => ({ ...prev, x: snapX }));
        localStorage.setItem("froggie_copilot_y", String(mobilePos.y));
      } else {
        handleClick();
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  if (isOpen) return null;

  return (
    <aside
      id="copilot-widget"
      ref={widgetRef}
      className={`fixed z-40 no-print select-none ${
        isMobile ? "" : "bottom-6 right-6"
      }`}
      style={
        isMobile
          ? {
              left: `${mobilePos.x}px`,
              top: `${mobilePos.y}px`,
              touchAction: "none",
              transition: isDragging ? "none" : "left 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s ease",
            }
          : undefined
      }
      aria-label="froggie AI Career Copilot Launcher"
    >
      {/* MOBILE FLOATING WINDOW ICON (DRAGGABLE CHAT HEAD) */}
      <div className="lg:hidden">
        <button
          type="button"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          className={`relative group size-13 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300 bg-slate-950/95 border border-slate-700/60 hover:border-emerald-500/60 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_24px_-2px_rgba(16,185,129,0.35)] backdrop-blur-xl ${
            isDragging ? "scale-110 shadow-2xl" : "active:scale-95"
          }`}
          title="Drag anywhere or tap to open AI Copilot"
          aria-label="Open Froggie AI Copilot"
        >
          {/* Glowing Aura Ring (ONLY on hover / active) */}
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-0 group-hover:opacity-50 blur-md pointer-events-none transition-opacity duration-300" />

          {/* 3D Copilot Icon */}
          <div className="relative z-10 shrink-0 pointer-events-none">
            <Copilot3DIcon size="sm" showGlow={false} showStatus={false} animated={false} />
          </div>
        </button>
      </div>

      {/* DESKTOP FLOATING PILL */}
      <div className="hidden lg:block">
        <button
          type="button"
          onClick={handleClick}
          className="relative group flex items-center gap-2.5 pl-2.5 pr-4.5 py-2 rounded-full text-white cursor-pointer select-none transition-all duration-300 bg-slate-950/90 dark:bg-slate-900/95 border border-slate-700/60 dark:border-slate-800 hover:border-emerald-500/60 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_28px_-2px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95 backdrop-blur-xl"
          title="Chat with Froggie AI Copilot"
          aria-label="Open Froggie AI Copilot"
        >
          {/* Ambient Aurora Glow (ONLY on hover) */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300 pointer-events-none" />

          {/* 3D Holographic Icon */}
          <div className="relative z-10 shrink-0">
            <Copilot3DIcon size="sm" showGlow={false} showStatus={false} animated={false} />
          </div>

          {/* Labels */}
          <div className="relative z-10 text-left flex flex-col justify-center leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Copilot
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <span className="group-hover:text-slate-200 transition-colors">Ask anything</span>
              <Sparkles size={9} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default CopilotWidget;
