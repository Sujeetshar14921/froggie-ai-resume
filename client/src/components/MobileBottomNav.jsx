import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Briefcase,
  Settings,
  Home,
  Users,
  HelpCircle,
  LogIn,
} from "lucide-react";

/**
 * MobileBottomNav
 * Native mobile application bottom navigation bar.
 * Replaces old hamburger menus with native tactile controls.
 */
const MobileBottomNav = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const pathname = location.pathname;

  // Authenticated user navigation tabs
  const authNavItems = [
    {
      label: "Home",
      to: "/app",
      icon: LayoutDashboard,
      isActive: pathname === "/app",
    },
    {
      label: "Resumes",
      to: "/app/my-resumes",
      icon: FileText,
      isActive:
        pathname === "/app/my-resumes" ||
        pathname.startsWith("/app/builder") ||
        pathname.startsWith("/app/resumes"),
    },
    {
      label: "ATS AI",
      to: "/app/ats-checker",
      icon: Sparkles,
      isActive: pathname === "/app/ats-checker" || pathname === "/ats-checker",
      isCenter: true,
    },
    {
      label: "Tracker",
      to: "/app/applications",
      icon: Briefcase,
      isActive: pathname === "/app/applications",
    },
    {
      label: "Settings",
      to: "/app/settings",
      icon: Settings,
      isActive: pathname === "/app/settings",
    },
  ];

  // Guest navigation tabs
  const guestNavItems = [
    {
      label: "Home",
      to: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Talent",
      to: "/talent",
      icon: Users,
      isActive: pathname.startsWith("/talent"),
    },
    {
      label: "AI ATS",
      to: "/app/ats-checker",
      icon: Sparkles,
      isActive: pathname === "/app/ats-checker" || pathname === "/ats-checker",
      isCenter: true,
    },
    {
      label: "FAQ",
      to: "/faq",
      icon: HelpCircle,
      isActive: pathname === "/faq",
    },
    {
      label: "Sign In",
      to: "/login",
      icon: LogIn,
      isActive: pathname.startsWith("/login") || pathname.startsWith("/signup"),
    },
  ];

  const items = user ? authNavItems : guestNavItems;

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Bottom App Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 no-print select-none"
    >
      {/* Frosted Glass Mobile Nav Shell */}
      <div className="bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-2xl border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.65)] px-3 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.65rem)]">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            // Elevated Center AI Action Pod
            if (item.isCenter) {
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="flex flex-col items-center -mt-5 relative group"
                  aria-label={item.label}
                >
                  <div
                    className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                      active
                        ? "bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white shadow-emerald-500/40 scale-105 ring-3 ring-emerald-400/40"
                        : "bg-slate-950 dark:bg-emerald-600 text-white shadow-slate-900/30 group-hover:scale-105 active:scale-95 border border-emerald-500/30"
                    }`}
                  >
                    <Icon size={22} className="animate-pulse-subtle lucide-3d" />
                  </div>
                  <span
                    className={`text-[10px] font-black mt-1 tracking-tight transition-colors ${
                      active
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            }

            // Standard Tab Items
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition-all duration-200 active:scale-90 ${
                  active
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
                aria-label={item.label}
              >
                <div
                  className={`size-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    active
                      ? "icon-3d-pod icon-3d-pod-emerald scale-105 text-emerald-600 dark:text-emerald-300 shadow-xs"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <Icon
                    size={19}
                    className={active ? "lucide-3d stroke-[2.4]" : "stroke-[1.8]"}
                  />
                </div>
                <span
                  className={`text-[10px] tracking-tight transition-all mt-0.5 ${
                    active
                      ? "font-black text-emerald-600 dark:text-emerald-400 scale-105"
                      : "font-semibold text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <span className="size-1 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
