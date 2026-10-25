import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../app/features/authSlice";
import {
  LogOut,
  User,
  LayoutDashboard,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  Coffee,
  Briefcase,
  Users,
  Settings,
} from "lucide-react";
import FrogFace, { BrandIcon } from "./FrogLogo";
import { NotificationBell } from "./notifications";
import { initNavbarAnimation } from "../animations";
import { applyTheme, isDarkEffective } from "../utils/theme";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => isDarkEffective());
  const headerRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const isTalentPage = location.pathname.startsWith("/talent");
  const isFileStudioPage = location.pathname.startsWith("/file-studio");
  const isLandingOrFaq =
    (location.pathname === "/" ||
      location.pathname === "/faq" ||
      location.pathname === "/donate" ||
      isFileStudioPage) &&
    !isTalentPage;

  // React to theme changes across application
  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail) {
        setIsDark(e.detail.isDark);
      }
    };
    window.addEventListener("froggie-theme-change", handleThemeChange);
    return () => window.removeEventListener("froggie-theme-change", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    setIsDark(!isDark);
  };

  // Auto-close all dropdowns on route navigation
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  // Auto-close on click-outside, Escape key, and scroll
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const handleScrollClose = () => {
      if (open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("scroll", handleScrollClose, { passive: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollClose);
    };
  }, [open]);

  useEffect(() => {
    const cleanup = initNavbarAnimation(headerRef.current);
    return cleanup;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    setOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Find Talent", href: "/talent", isRoute: true },
    { name: "File Studio", href: "/file-studio", isRoute: true },
    { name: "Features", href: "/#features", isRoute: false },
    { name: "Templates", href: "/#templates", isRoute: false },
    { name: "How It Works", href: "/#how-it-works", isRoute: false },
  ];

  const userMenuItems = [
    {
      name: "Settings & Preferences",
      href: "/app/settings",
      icon: Settings,
      isActive: location.pathname === "/app/settings",
    },
    {
      name: "Dashboard",
      href: "/app",
      icon: LayoutDashboard,
      isActive: location.pathname === "/app",
    },
    {
      name: "My Resumes",
      href: "/app/my-resumes",
      icon: FileText,
      isActive:
        location.pathname === "/app/my-resumes" ||
        location.pathname.startsWith("/app/resumes"),
    },
    {
      name: "Job Tracker CRM",
      href: "/app/applications",
      icon: Briefcase,
      isActive: location.pathname.startsWith("/app/applications"),
    },
    {
      name: "ATS Resume Checker",
      href: "/app/ats-checker",
      icon: ShieldCheck,
      badge: "AI",
      isActive: location.pathname.startsWith("/app/ats-checker"),
    },
    {
      name: "File & Media Studio",
      href: "/file-studio",
      icon: Sparkles,
      badge: "STUDIO",
      badgeColor: "indigo",
      isActive: location.pathname.startsWith("/file-studio"),
    },
    {
      name: "Support Froggie ☕",
      href: "/donate",
      icon: Coffee,
      isActive: location.pathname === "/donate",
    },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/85 dark:bg-[#090d16]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]"
            : "bg-white/70 dark:bg-[#090d16]/70 backdrop-blur-md border-b border-slate-200/40 dark:border-slate-800/40"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-18 sm:h-20 flex items-center justify-between">

          {/* BRAND NAME IDENTITY WITH FROGGIE LOGO */}
          <Link to="/" className="nav-brand flex items-center gap-2.5 group shrink-0">
            <BrandIcon
              size="md"
              className="group-hover:shadow-emerald-500/30 transition-all group-hover:scale-105"
              iconClassName="group-hover:rotate-6 transition-transform duration-300"
            />

            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                  froggie<span className="text-emerald-500">.</span>
                </span>
                {isTalentPage && (
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-lg uppercase tracking-wider bg-slate-950 dark:bg-emerald-600 text-white shadow-xs">
                    Talent Hub 🌐
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                {isTalentPage ? "Verified Candidate Showcase" : "Smart Resume Studio"}
              </p>
            </div>
          </Link>

          {/* TALENT PAGE CENTER STATUS PILL */}
          {isTalentPage && (
            <div className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-2xs backdrop-blur-sm">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Public Candidate Showcase & Resume Directory</span>
            </div>
          )}

          {/* DESKTOP NAV LINKS (VISIBLE ON LANDING / FAQ ONLY) */}
          {isLandingOrFaq && (
            <nav className="nav-links-pill hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-800/80 backdrop-blur-sm shadow-2xs">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`nav-link-item text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${
                      location.pathname === link.href
                        ? "bg-slate-950 dark:bg-emerald-600 text-white"
                        : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="nav-link-item text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-800 px-3.5 py-1.5 rounded-full transition-all"
                  >
                    {link.name}
                  </a>
                )
              )}
            </nav>
          )}

          {/* RIGHT SIDE ACTIONS */}
          <div className="nav-actions flex items-center gap-1.5 sm:gap-2.5">
            {/* QUICK 1-CLICK THEME TOGGLE (DESKTOP ONLY) */}
            <button
              onClick={toggleTheme}
              className="hidden lg:inline-flex p-2 sm:p-2.5 rounded-2xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-800/80"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun size={17} className="text-amber-400 animate-pulse-subtle" />
              ) : (
                <Moon size={17} className="text-slate-700 dark:text-slate-200" />
              )}
            </button>

            {/* NOTIFICATION BELL (Visible strictly only when user is logged in) */}
            {user && <NotificationBell />}

            {user ? (
              /* AUTHENTICATED USER DROPDOWN */
              <div ref={profileDropdownRef} className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 p-1.5 sm:pr-3 rounded-2xl hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-colors cursor-pointer group"
                  aria-expanded={open}
                  aria-haspopup="true"
                >
                  <div className="relative shrink-0">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User Avatar"}
                        className="size-8 sm:size-9 rounded-xl object-cover ring-2 ring-emerald-500/30"
                      />
                    ) : (
                      <div className="size-8 sm:size-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center font-black text-xs sm:text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || <User size={15} />}
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[120px] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {user?.name || "Candidate"}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[120px] flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">{user?.profession || "My Account"}</span>
                    </p>
                  </div>

                  <ChevronDown
                    size={14}
                    className={`text-slate-400 group-hover:text-emerald-600 transition-all duration-200 ${
                      open ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>

                {/* DROPDOWN POPUP */}
                {open && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 top-12 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
                      
                      {/* USER SUMMARY HEADER */}
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 flex items-center gap-3">
                        <div className="relative shrink-0">
                          {user?.image ? (
                            <img
                              src={user.image}
                              alt={user.name || "User Avatar"}
                              className="size-10 rounded-xl object-cover ring-2 ring-emerald-500/30 shadow-2xs"
                            />
                          ) : (
                            <div className="size-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                              {user?.name?.charAt(0)?.toUpperCase() || <User size={16} />}
                            </div>
                          )}
                          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                              {user?.name || "Candidate"}
                            </p>
                            <span className="px-1.5 py-0.5 text-[9px] font-black rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                              PRO
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {user?.email}
                          </p>
                          {user?.profession && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-500/30 truncate max-w-full">
                              <FrogFace size={10} />
                              <span className="truncate">{user.profession}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* NAVIGATION ITEMS */}
                      <div className="p-1.5 space-y-0.5">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          const isSelected = item.isActive;

                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setOpen(false)}
                              className={`group flex items-center justify-between px-3 py-2 rounded-xl transition-all text-sm font-semibold ${
                                isSelected
                                  ? "bg-emerald-50/90 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 border border-emerald-500/30 shadow-2xs"
                                  : "text-slate-700 dark:text-slate-200 hover:text-emerald-950 dark:hover:text-emerald-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 border border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                    isSelected
                                      ? "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xs shadow-emerald-500/25"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-300"
                                  }`}
                                >
                                  <Icon size={16} />
                                </div>
                                <span className="truncate text-sm font-semibold">{item.name}</span>
                              </div>

                              {item.badge ? (
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wider shrink-0 ${
                                    isSelected
                                      ? "bg-emerald-600 text-white"
                                      : item.badgeColor === "indigo"
                                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              ) : isSelected ? (
                                <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                              ) : null}
                            </Link>
                          );
                        })}
                      </div>

                      {/* DIVIDER */}
                      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                      {/* SIGN OUT */}
                      <div className="p-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={logoutUser}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer border border-transparent hover:border-rose-200/70 dark:hover:border-rose-900/40 group"
                        >
                          <div className="size-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/60 transition-colors">
                            <LogOut size={16} />
                          </div>
                          <span className="text-sm font-semibold">Sign Out</span>
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </div>
            ) : isTalentPage ? (
              /* TALENT PAGE DEDICATED GUEST ACTIONS */
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <ArrowLeft size={13} />
                  <span>Home</span>
                </Link>

                <Link
                  to="/login?state=register"
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-xl transition-colors border border-emerald-500/40"
                >
                  <Sparkles size={13} className="text-emerald-400" />
                  <span>Post Your Resume</span>
                </Link>
              </div>
            ) : (
              /* STANDARD GUEST ACTIONS */
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?state=register"
                  className="shimmer-button inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Get Started Free</span>
                  <ArrowRight size={13} className="hidden sm:inline" />
                </Link>
              </div>
            )}

          </div>
        </div>
      </header>


    </>
  );
};

export default Navbar;

