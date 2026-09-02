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
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import FrogFace from "../components/FrogLogo";
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
  const [copiedUpi, setCopiedUpi] = useState(false);

  const currentAmount = customAmount ? Number(customAmount) : selectedTier.amount;

  // Standard UPI URI format
  const upiUri = `upi://pay?pa=${DONATION_CONFIG.upiId}&pn=${encodeURIComponent(
    DONATION_CONFIG.payeeName
  )}&am=${currentAmount}&cu=INR&tn=${encodeURIComponent("Support Froggie AI Platform")}`;

  // High-res QR code image URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    upiUri
  )}&format=svg`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(DONATION_CONFIG.upiId);
    setCopiedUpi(true);
    toast.success("UPI ID copied to clipboard! Paste in any UPI app 🚀", {
      icon: "📋",
      duration: 3500,
    });
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  const communityDonors = [
    { name: "Rahul S.", role: "Frontend Engineer", amount: "₹250", note: "Got a call from Infosys within 3 days of using froggie! Best free tool." },
    { name: "Priya M.", role: "Product Designer", amount: "₹500", note: "Thank you for keeping this free for students. Much love from Pune!" },
    { name: "Amit K.", role: "Full Stack Dev", amount: "₹100", note: "Small chai from a grateful developer. Keep up the awesome work!" },
    { name: "Siddharth D.", role: "DevOps Specialist", amount: "₹500", note: "ATS score audit was shockingly accurate. Truly a lifesaver." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-12 sm:pt-16 pb-16 overflow-hidden bg-slate-950 text-white">
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-10 size-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase shadow-xs">
              <FrogFace size={16} />
              <span>COMMUNITY SUPPORT & DONATION</span>
            </div>

            {/* MAIN HEADLINE */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
              Keep froggie <span className="text-emerald-400 underline decoration-emerald-500/40">100% Free Forever</span>.
            </h1>

            {/* SUBTITLE */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We believe quality career tools and ATS-proof resumes should be accessible to every student and jobseeker, regardless of their financial background.
            </p>

            {/* FOUNDER PLEDGE CALLOUT */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-md">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <span>
                <strong>0% Hidden Fees</strong> • <strong>0% Paywalls</strong> • <strong>0% Commission Gateway</strong> (Direct to Bank)
              </span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DONATION INTERFACE */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-20 relative z-20">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

            {/* LEFT COLUMN: TIER SELECTION (7 COLS) */}
            <div className="p-6 sm:p-10 lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <Coffee size={20} className="text-emerald-600" />
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Choose Your Contribution
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Pick an amount or enter a custom sum. Every rupee directly fuels our AI and cloud hosting.
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
                      className={`relative p-4 rounded-2xl text-left transition-all border-2 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/60 shadow-md shadow-emerald-500/10 scale-[1.01]"
                          : "border-slate-200/90 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                          {tier.badge}
                        </span>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{tier.emoji}</span>
                          <div>
                            <p className="font-extrabold text-sm text-slate-900">{tier.title}</p>
                            <span className="text-emerald-600 font-black text-base">₹{tier.amount}</span>
                          </div>
                        </div>

                        <div className={`size-5 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 bg-white"
                        }`}>
                          {isSelected && <CheckCircle2 size={13} />}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-2.5 leading-snug">
                        {tier.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* CUSTOM AMOUNT INPUT */}
              <div className="pt-2">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Or Enter Custom Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="10"
                    placeholder="Enter any amount (e.g. 150, 300, 2000)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:bg-emerald-50/20 outline-hidden font-bold text-slate-900 placeholder:text-slate-400 transition-all text-sm"
                  />
                </div>
              </div>

              {/* ZERO PLATFORM FEE GUARANTEE */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 space-y-0.5">
                  <p className="font-bold">100% Free Direct UPI Payment Gateway</p>
                  <p className="text-emerald-700 leading-relaxed">
                    Zero gateway cut. 100% of your contribution reaches the creator's bank account directly with no middleman commission.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INSTANT QR CODE & PAYMENT (5 COLS) */}
            <div className="p-6 sm:p-10 lg:col-span-5 bg-slate-50/70 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                    <QrCode size={13} />
                    Instant UPI QR Code
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    ₹{currentAmount || 100}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Scan with any UPI App on your phone
                  </p>
                </div>

                {/* QR CODE CARD */}
                <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500/30 shadow-lg max-w-[260px] mx-auto text-center space-y-3">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center p-2">
                    <img
                      src={qrCodeUrl}
                      alt="Donation UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* ACCEPTED LOGOS HINT */}
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-center gap-2">
                    <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                  </div>
                </div>

                {/* DIRECT UPI ID DISPLAY & COPY BUTTON */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/90 text-xs">
                    <div className="truncate pr-2">
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold block">UPI ID:</span>
                      <span className="font-bold text-slate-800 truncate font-mono">{DONATION_CONFIG.upiId}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-extrabold text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-slate-200"
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

                  {/* MOBILE DEEPLINK BUTTON */}
                  <a
                    href={upiUri}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Zap size={14} />
                    <span>Pay ₹{currentAmount || 100} via Any UPI App</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* FOOTNOTE */}
              <p className="text-[10px] text-center text-slate-400">
                🔒 Safe & encrypted via Bank-grade NPCI UPI protocols.
              </p>
            </div>

          </div>
        </section>

        {/* TRANSPARENCY: WHERE DOES YOUR CONTRIBUTION GO? */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">
              Financial Transparency
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Where Does Your Donation Go?
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              We operate with 100% transparency. Here is the exact breakdown of how community funds maintain Froggie:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DONATION_CONFIG.costBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
                  {item.percentage}
                </div>
                <h3 className="font-extrabold text-base text-slate-900">{item.label}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SUPPORTERS WALL / RECENT BACKERS */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-slate-800">
            <div className="max-w-2xl space-y-4 mb-8">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {communityDonors.map((donor, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-sm text-white">{donor.name}</p>
                      <p className="text-[11px] text-slate-400">{donor.role}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 font-extrabold text-xs border border-emerald-500/30">
                      {donor.amount}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{donor.note}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center mb-20 space-y-4">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Can't donate right now? That's completely fine!
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You can also support us by sharing Froggie with your college friends, batchmates, and LinkedIn network!
          </p>
          <div className="pt-2">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              <span>Build Your Free ATS Resume Now</span>
              <ArrowRight size={14} className="text-emerald-400" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DonatePage;
