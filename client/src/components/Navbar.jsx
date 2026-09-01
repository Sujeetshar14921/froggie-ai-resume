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
} from "lucide-react";
import ProfileModal from "./ProfileModal";
import FrogFace from "./FrogLogo";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isLandingOrFaq = location.pathname === "/" || location.pathname === "/faq";

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
    { name: "Testimonials", href: "/#testimonials", isRoute: false },
    { name: "FAQ", href: "/faq", isRoute: true },
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
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "text-slate-600 hover:text-indigo-600 hover:bg-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-white px-3.5 py-1.5 rounded-full transition-all"
                  >
                    {link.name}
                  </a>
                )
              )}
            </nav>
          )}

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-3">
            {user ? (
              /* AUTHENTICATED USER DROPDOWN */
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2.5 bg-white border border-slate-200/90 p-1.5 sm:pr-3 rounded-2xl shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User Avatar"}
                      className="size-8 sm:size-9 rounded-xl object-cover ring-2 ring-indigo-500/20"
                    />
                  ) : (
                    <div className="size-8 sm:size-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs">
                      {user?.name?.charAt(0)?.toUpperCase() || <User size={15} />}
                    </div>
                  )}

                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                      {user?.name || "Candidate"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium truncate max-w-[110px]">
                      {user?.profession || "My Account"}
                    </p>
                  </div>

                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>

                {/* DROPDOWN POPUP */}
                {open && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 top-12 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
                      
                      {/* USER SUMMARY */}
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center gap-3">
                        {user?.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="size-10 rounded-xl object-cover ring-2 ring-white shadow-xs"
                          />
                        ) : (
                          <div className="size-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || <User size={16} />}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                          {user?.profession && (
                            <span className="inline-block mt-0.5 text-[9px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                              {user.profession}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* PROFILE EDIT BUTTON */}
                      <div className="p-1">
                        <button
                          onClick={() => {
                            setOpen(false);
                            setIsProfileModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100/70 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <UserCheck size={15} className="text-indigo-600" />
                          <span>Edit Profile & Photo</span>
                        </button>
                      </div>

                      <div className="px-1 space-y-0.5">
                        <Link
                          to="/app"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
                        >
                          <LayoutDashboard size={15} className="text-slate-400" />
                          Dashboard
                        </Link>

                        <Link
                          to="/app/my-resumes"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
                        >
                          <FileText size={15} className="text-slate-400" />
                          My Resumes
                        </Link>

                        <Link
                          to="/app/ats-checker"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50/70 rounded-xl transition-colors font-semibold"
                        >
                          <ShieldCheck size={15} className="text-indigo-600" />
                          <span>ATS Resume Checker</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 my-1" />

                      <div className="px-1">
                        <button
                          onClick={logoutUser}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <LogOut size={15} />
                          Sign Out
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
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100/70 rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?state=register"
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
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

