import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Coffee,
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Server,
  Zap,
  Gift,
  ArrowRight,
  QrCode,
  Users,
  Award,
  Share2,
  MessageSquare,
  Lock,
  Globe,
  Flame,
  Check,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import FrogFace, { BrandIcon } from "../components/FrogLogo";
import { useSEO } from "../hooks/useSEO";
import { DONATION_CONFIG } from "../constants/donationConfig";
import toast from "react-hot-toast";

const DonatePage = () => {
  useSEO({
    title: "Support froggie — Keep AI Resume Builder 100% Free Forever",
    description:
      "Support froggie AI. Help us keep world-class ATS resume building 100% free for students and jobseekers worldwide with zero platform fees.",
    keywords:
      "support froggie, donate to froggie, buy me a coffee, free resume maker, open source support, keep froggie free",
    canonical: "https://froggie.site/donate",
  });

  const [selectedTier, setSelectedTier] = useState(DONATION_CONFIG.tiers[1]); // Default ₹100
  const [customAmount, setCustomAmount] = useState("");
  const [supporterName, setSupporterName] = useState("");
  const [supporterNote, setSupporterNote] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  const currentAmount = customAmount ? Math.max(1, Number(customAmount)) : selectedTier.amount;

  // Build note text for UPI transaction
  const noteText = supporterName
    ? `Froggie AI Support from ${supporterName}`
    : "Support Froggie AI Free Platform";

  // Standard UPI URI format with payee and amount
  const upiUri = `upi://pay?pa=${DONATION_CONFIG.upiId}&pn=${encodeURIComponent(
    DONATION_CONFIG.payeeName
  )}&am=${currentAmount}&cu=INR&tn=${encodeURIComponent(noteText)}`;

  // High-res QR code image URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
    upiUri
  )}&format=svg`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(DONATION_CONFIG.upiId);
    setCopiedUpi(true);
    toast.success("UPI ID copied! Paste in GPay, PhonePe, or Paytm 🚀", {
      icon: "📋",
      duration: 3500,
    });
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  const handleShare = (platform) => {
    const text =
      "Check out @froggie_ai — an incredible 100% free AI resume builder & ATS checker helping students and jobseekers land interviews! 🐸🚀 https://froggie.site";
    const url = "https://froggie.site";

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        "_blank"
      );
    } else if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const communityDonors = [
    {
      name: "Rahul S.",
      role: "Frontend Engineer @ Top Startup",
      amount: "₹250",
      note: "Got shortlisted for 4 interviews within a week of rebuilding my resume with Froggie! Absolutely worth supporting.",
      time: "2 hours ago",
      avatar: "from-blue-600 to-indigo-600",
    },
    {
      name: "Priya M.",
      role: "Product Designer",
      amount: "₹500",
      note: "Thank you so much for keeping this 100% free for college students. Sending love from Pune!",
      time: "Yesterday",
      avatar: "from-emerald-600 to-teal-600",
    },
    {
      name: "Amit K.",
      role: "Full Stack Developer",
      amount: "₹100",
      note: "Small chai from a grateful developer. The ATS scoring is surprisingly accurate.",
      time: "3 days ago",
      avatar: "from-amber-500 to-orange-600",
    },
    {
      name: "Siddharth D.",
      role: "DevOps Specialist",
      amount: "₹1,000",
      note: "Sponsoring server hosting for the community. Keep up the incredible work!",
      time: "5 days ago",
      avatar: "from-purple-600 to-pink-600",
    },
  ];

  // Dynamic Impact Description based on selected amount
  const getImpactDescription = (amount) => {
    if (amount >= 1000) return "👑 Sponsors 1 full month of global cloud hosting + domain fees for 5,000+ candidates.";
    if (amount >= 500) return "🚀 Covers 1,000+ high-accuracy AI ATS keyword scans and token inferences.";
    if (amount >= 250) return "🍕 Fuels 2 weeks of rapid development for new ATS templates and export engines.";
    if (amount >= 100) return "🧋 Keeps our high-speed MongoDB Atlas database running for 200+ resumes.";
    return "☕ Covers 30 AI ATS resume generations on our cloud LLM.";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO HEADER */}
        <section className="relative pt-12 sm:pt-16 pb-20 overflow-hidden bg-slate-950 text-white text-left group">
          {/* Ambient Glows & Half-circle environment auras */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-emerald-500/25 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/20 via-indigo-400/10 to-transparent rounded-tr-full pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 text-center">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase shadow-xs">
              <FrogFace size={15} />
              <span>COMMUNITY SUPPORT & DONATION</span>
            </div>

            {/* MAIN HEADLINE */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
              Keep froggie{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300">
                100% Free Forever
              </span>
              .
            </h1>

            {/* SUBTITLE */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              We believe quality career tools and ATS-friendly resumes should be accessible to every student and jobseeker worldwide with zero paywalls.
            </p>

            {/* TRUST HIGHLIGHTS BAR */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-semibold shadow-xs">
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>0% Hidden Fees</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-semibold shadow-xs">
                <Zap size={15} className="text-amber-400" />
                <span>Instant Direct UPI</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-semibold shadow-xs">
                <Lock size={15} className="text-blue-400" />
                <span>Direct Bank Transfer</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DONATION CHECKOUT CARD */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-20 relative z-20 text-left">
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 group">
            {/* Half circle background auras */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/10 via-teal-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 via-indigo-400/5 to-transparent rounded-tr-full pointer-events-none" />

            {/* LEFT COLUMN: TIER & DETAILS (7 COLS) */}
            <div className="relative z-10 p-6 sm:p-8 lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-slate-950">
                  <Coffee size={20} className="text-emerald-600" />
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    Choose Your Contribution
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  Every rupee directly covers AI tokens and cloud database bandwidth.
                </p>
              </div>

              {/* TIER CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DONATION_CONFIG.tiers.map((tier) => {
                  const isSelected = selectedTier?.id === tier.id && !customAmount;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => {
                        setSelectedTier(tier);
                        setCustomAmount("");
                      }}
                      className={`relative overflow-hidden p-4 rounded-2xl text-left transition-all border-2 cursor-pointer flex flex-col justify-between group/tier ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/70 shadow-md shadow-emerald-500/10 scale-101"
                          : "border-slate-200/90 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                      }`}
                    >
                      {/* Corner half-circle aura */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/20 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none group-hover/tier:scale-125 transition-transform duration-500" />

                      {tier.popular && (
                        <span className="relative z-10 self-end -mt-1 mb-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                          {tier.badge}
                        </span>
                      )}

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{tier.emoji}</span>
                          <div>
                            <p className="font-black text-sm text-slate-900 group-hover/tier:text-emerald-700 transition-colors">
                              {tier.title}
                            </p>
                            <span className="text-emerald-600 font-black text-base">
                              ₹{tier.amount}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`size-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>

                      <p className="relative z-10 text-[11px] text-slate-500 mt-2 leading-snug font-medium">
                        {tier.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* CUSTOM AMOUNT & QUICK INCREMENTS */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Or Enter Custom Amount (₹)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-base">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="10"
                      placeholder="e.g. 150, 300, 1500"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-bold text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm bg-slate-50 focus:bg-white transition-all"
                    />
                  </div>

                  {/* QUICK INCREMENT PILLS */}
                  <div className="flex items-center gap-1.5">
                    {[150, 300, 750].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCustomAmount(String(amt))}
                        className="px-2.5 py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition-all border border-slate-200/80 cursor-pointer"
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* OPTIONAL SUPPORTER MESSAGE */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Your Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul S."
                      value={supporterName}
                      onChange={(e) => setSupporterName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">A Short Note / Cheerful Message</label>
                    <input
                      type="text"
                      placeholder="e.g. Keep up the awesome work!"
                      value={supporterNote}
                      onChange={(e) => setSupporterNote(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* REAL-TIME IMPACT CALLOUT */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                <Sparkles size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 space-y-0.5">
                  <p className="font-extrabold text-emerald-900">Your Community Impact</p>
                  <p className="text-emerald-700 leading-relaxed font-medium">
                    {getImpactDescription(currentAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INSTANT QR CODE & PAYMENT APPS (5 COLS) */}
            <div className="p-6 sm:p-8 lg:col-span-5 bg-slate-50/60 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                    <QrCode size={13} />
                    Instant Direct UPI Payment
                  </span>
                  <h3 className="text-3xl font-black text-slate-950 mt-2 tracking-tight">
                    ₹{currentAmount || 100}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Scan with any UPI App on your phone
                  </p>
                </div>

                {/* QR CODE CARD */}
                <div className="p-4 bg-white rounded-3xl border-2 border-emerald-500/30 shadow-lg max-w-[260px] mx-auto text-center space-y-3">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center p-2">
                    <img
                      src={qrCodeUrl}
                      alt="Donation UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* ACCEPTED APP BADGES */}
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-center gap-2">
                    <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                  </div>
                </div>

                {/* DIRECT UPI ID & 1-CLICK COPY */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/90 text-xs">
                    <div className="truncate pr-2">
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold block">
                        Direct Bank UPI ID
                      </span>
                      <span className="font-bold text-slate-900 truncate font-mono text-xs">
                        {DONATION_CONFIG.upiId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-extrabold text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-slate-200/80"
                    >
                      {copiedUpi ? (
                        <>
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* MOBILE & APP DEEPLINK BUTTON */}
                  <a
                    href={upiUri}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-102 active:scale-98"
                  >
                    <Zap size={14} />
                    <span>Pay ₹{currentAmount || 100} via Any UPI App</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* SECURITY ASSURANCE */}
              <p className="text-[10px] text-center text-slate-400 font-medium">
                🔒 Safe & verified via NPCI direct bank-to-bank UPI protocol. Zero middleman cut.
              </p>
            </div>
          </div>
        </section>

        {/* TRANSPARENCY: WHERE DOES YOUR CONTRIBUTION GO? */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-left">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
              Financial Transparency
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Where Does Your Donation Go?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-medium">
              We operate with 100% open transparency. Here is the exact breakdown of how community funds sustain Froggie:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DONATION_CONFIG.costBreakdown.map((item, idx) => {
              const gradients = [
                "from-emerald-500/15 via-teal-400/5",
                "from-blue-500/15 via-cyan-400/5",
                "from-purple-500/15 via-pink-400/5",
              ];
              const cornerGradient = gradients[idx % gradients.length];
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3 relative overflow-hidden group hover:shadow-md transition-all"
                >
                  {/* Half-circle colorful corner */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${cornerGradient} to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                  />

                  <div className="relative z-10 size-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                    {item.percentage}
                  </div>
                  <h3 className="relative z-10 font-black text-base text-slate-950">{item.label}</h3>
                  <p className="relative z-10 text-xs text-slate-500 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SUPPORTERS WALL / HALL OF FAME */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-left">
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800 group">
            {/* Half-circle colorful environment auras */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-emerald-500/20 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/15 via-indigo-400/10 to-transparent rounded-tr-full pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-3 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Users size={14} />
                Supporters Hall of Fame
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Shoutout to Our Community Heroes
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Meet some of the generous candidates who helped keep Froggie free for the next jobseeker.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {communityDonors.map((donor, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 group/donor"
                >
                  {/* Subtle corner aura */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/15 to-transparent rounded-bl-full pointer-events-none group-hover/donor:scale-125 transition-transform" />

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl bg-gradient-to-br ${donor.avatar} text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs`}
                      >
                        {donor.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-extrabold text-xs text-white">{donor.name}</p>
                        <p className="text-[10px] text-slate-400">{donor.role}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/30">
                      {donor.amount}
                    </span>
                  </div>
                  <p className="relative z-10 text-xs text-slate-300 italic bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                    "{donor.note}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAN'T DONATE? VIRAL SPREAD CALLOUT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="relative overflow-hidden bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-2xs group text-center space-y-6">
            {/* Half-circle colorful environment auras */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-500/15 via-teal-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 via-purple-400/5 to-transparent rounded-tr-full pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200/80">
                <Heart size={13} className="text-emerald-600 fill-emerald-600" />
                <span>Spread the Word</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Can't donate right now? That's totally okay!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-medium">
                You can support us just as much by sharing Froggie with your college friends, WhatsApp groups, and LinkedIn network!
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleShare("whatsapp")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <MessageSquare size={15} />
                <span>Share on WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare("linkedin")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Share2 size={15} />
                <span>Share on LinkedIn</span>
              </button>

              <button
                onClick={() => handleShare("twitter")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Globe size={15} />
                <span>Post on X (Twitter)</span>
              </button>
            </div>

            <div className="relative z-10 pt-2">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                <span>Or continue building your free ATS resume</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DonatePage;
