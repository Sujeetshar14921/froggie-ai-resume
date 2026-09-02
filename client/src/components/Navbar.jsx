import React, { useEffect, useState } from "react";
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
  Menu,
  X,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  Coffee,
} from "lucide-react";
import ProfileModal from "./ProfileModal";
import FrogFace from "./FrogLogo";
import { NotificationBell } from "./notifications";
import { useCopilot } from "../hooks/useCopilot";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { openCopilot } = useCopilot();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isLandingOrFaq =
    location.pathname === "/" ||
    location.pathname === "/faq" ||
    location.pathname === "/donate";

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
    { name: "Features", href: "/#features", isRoute: false },
    { name: "How It Works", href: "/#how-it-works", isRoute: false },
    { name: "Templates", href: "/#templates", isRoute: false },
    { name: "FAQ", href: "/faq", isRoute: true },
    { name: "Support Us ☕", href: "/donate", isRoute: true },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-xs"
            : "bg-white/70 backdrop-blur-md border-b border-slate-200/40"
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">

          {/* BRAND NAME IDENTITY WITH FROGGIE LOGO */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-emerald-400 p-[2px] shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                <FrogFace size={26} className="group-hover:rotate-6 transition-transform duration-300" />
              </div>
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  froggie<span className="text-emerald-500">.</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70 uppercase tracking-wider">
                  AI ATS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Smart Resume Studio
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          {isLandingOrFaq && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60 backdrop-blur-sm shadow-2xs">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${
                      location.pathname === link.href
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : "text-slate-600 hover:text-emerald-700 hover:bg-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-white px-3.5 py-1.5 rounded-full transition-all"
                  >
                    {link.name}
                  </a>
                )
              )}
            </nav>
          )}

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* NOTIFICATION BELL & DESKTOP ALERTS */}
            <NotificationBell />

            {user ? (
              /* AUTHENTICATED USER DROPDOWN */
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-slate-200/90 p-1.5 sm:pr-3 rounded-2xl shadow-xs hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/10 transition-all cursor-pointer group"
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
                      <div className="size-8 sm:size-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-xs group-hover:scale-105 transition-transform">
                        {user?.name?.charAt(0)?.toUpperCase() || <User size={15} />}
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px] group-hover:text-emerald-700 transition-colors">
                      {user?.name || "Candidate"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium truncate max-w-[120px] flex items-center gap-1">
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
                    <div className="absolute right-0 top-12 mt-2 w-72 bg-white/95 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl shadow-2xl shadow-emerald-950/15 z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-150">
                      
                      {/* USER SUMMARY HEADER */}
                      <div className="px-4 py-3.5 border-b border-slate-100 bg-gradient-to-br from-emerald-50/80 via-slate-50/60 to-teal-50/40 flex items-center gap-3">
                        <div className="relative shrink-0">
                          {user?.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="size-11 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-xs"
                            />
                          ) : (
                            <div className="size-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                              {user?.name?.charAt(0)?.toUpperCase() || <User size={16} />}
                            </div>
                          )}
                          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                            <span className="px-1.5 py-0.2 text-[9px] font-black rounded-md bg-emerald-500/20 text-emerald-700 uppercase tracking-wider">
                              PRO
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                          {user?.profession && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200/50 truncate max-w-full">
                              <FrogFace size={10} />
                              <span className="truncate">{user.profession}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* PROFILE EDIT QUICK BUTTON */}
                      <div className="p-1.5">
                        <button
                          onClick={() => {
                            setOpen(false);
                            setIsProfileModalOpen(true);
                          }}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50/90 hover:bg-emerald-100/90 rounded-2xl transition-all border border-emerald-200/60 cursor-pointer group shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <UserCheck size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                            <span>Edit Profile & Photo</span>
                          </div>
                          <ArrowRight size={13} className="text-emerald-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      </div>

                      {/* NAVIGATION LINKS */}
                      <div className="px-1.5 space-y-0.5">
                        <Link
                          to="/app"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50/60 hover:text-emerald-900 rounded-xl transition-colors group"
                        >
                          <div className="size-7 rounded-lg bg-slate-100 group-hover:bg-emerald-100/80 flex items-center justify-center text-slate-500 group-hover:text-emerald-700 transition-colors">
                            <LayoutDashboard size={15} />
                          </div>
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          to="/app/my-resumes"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50/60 hover:text-emerald-900 rounded-xl transition-colors group"
                        >
                          <div className="size-7 rounded-lg bg-slate-100 group-hover:bg-emerald-100/80 flex items-center justify-center text-slate-500 group-hover:text-emerald-700 transition-colors">
                            <FileText size={15} />
                          </div>
                          <span>My Resumes</span>
                        </Link>

                        {/* ATS RESUME CHECKER (FEATURED LINK) */}
                        <Link
                          to="/app/ats-checker"
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-emerald-900 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent hover:from-emerald-500/20 hover:to-teal-500/15 rounded-xl border border-emerald-500/20 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
                              <ShieldCheck size={15} />
                            </div>
                            <span>ATS Resume Checker</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-emerald-600 text-white rounded-md tracking-wider">
                            AI
                          </span>
                        </Link>

                        {/* CAREER COPILOT QUICK LAUNCHER */}
                        <button
                          onClick={() => {
                            setOpen(false);
                            openCopilot();
                          }}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50/60 hover:text-emerald-900 rounded-xl transition-colors text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-7 rounded-lg bg-slate-100 group-hover:bg-emerald-100/80 flex items-center justify-center text-slate-500 group-hover:text-emerald-700 transition-colors">
                              <Sparkles size={15} />
                            </div>
                            <span>Ask Froggie Copilot</span>
                          </div>
                          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                        </button>

                        {/* SUPPORT FROGGIE LINK */}
                        <Link
                          to="/donate"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-amber-900 bg-amber-500/10 hover:bg-amber-500/15 rounded-xl border border-amber-500/20 transition-colors group"
                        >
                          <div className="size-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
                            <Coffee size={15} />
                          </div>
                          <span className="font-bold">Support Froggie ☕</span>
                        </Link>
                      </div>

                      {/* DIVIDER */}
                      <div className="border-t border-slate-100 my-1" />

                      {/* SIGN OUT */}
                      <div className="px-1.5">
                        <button
                          onClick={logoutUser}
                          className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-colors text-left cursor-pointer group"
                        >
                          <div className="size-7 rounded-lg bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center text-rose-500 group-hover:text-rose-700 transition-colors">
                            <LogOut size={15} />
                          </div>
                          <span>Sign Out</span>
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </div>
            ) : (
              /* GUEST ACTIONS */
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?state=register"
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-md shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Sparkles size={14} />
                  <span>Get Started</span>
                  <ArrowRight size={13} className="hidden sm:inline" />
                </Link>
              </div>
            )}

            {/* MOBILE MENU TOGGLE */}
            {isLandingOrFaq && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* MOBILE MENU DRAWER */}
        {isLandingOrFaq && mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  {link.name}
                </a>
              )
            )}
          </div>
        )}
      </header>

      {/* PROFILE EDIT MODAL */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default Navbar;

