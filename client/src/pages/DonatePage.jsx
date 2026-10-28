import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import { useSEO } from "../hooks/useSEO";
import { DONATION_CONFIG } from "../constants/donationConfig";
import toast from "react-hot-toast";
import {
  DonateHero,
  DonationTiersSection,
  DonationQrPaymentCard,
  DonationTransparency,
  DonationSupporterWall,
  DonationViralShare,
} from "../components/donate";

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
        <DonateHero />

        {/* INTERACTIVE DONATION CHECKOUT CARD */}
        <section className="w-full px-3.5 sm:px-8 lg:px-12 xl:px-16 -mt-8 sm:-mt-12 mb-14 sm:mb-20 relative z-20 text-left">
          <div className="relative glass-card-elevated bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 group">
            {/* Half circle background auras */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/10 via-teal-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 via-indigo-400/5 to-transparent rounded-tr-full pointer-events-none" />

            {/* LEFT COLUMN: TIER & DETAILS */}
            <DonationTiersSection
              selectedTier={selectedTier}
              setSelectedTier={setSelectedTier}
              customAmount={customAmount}
              setCustomAmount={setCustomAmount}
              supporterName={supporterName}
              setSupporterName={setSupporterName}
              supporterNote={supporterNote}
              setSupporterNote={setSupporterNote}
              impactDescription={getImpactDescription(currentAmount)}
            />

            {/* RIGHT COLUMN: INSTANT QR CODE & PAYMENT APPS */}
            <DonationQrPaymentCard
              currentAmount={currentAmount}
              qrCodeUrl={qrCodeUrl}
              upiUri={upiUri}
              copiedUpi={copiedUpi}
              handleCopyUpi={handleCopyUpi}
            />
          </div>
        </section>

        {/* TRANSPARENCY */}
        <DonationTransparency />

        {/* SUPPORTERS WALL */}
        <DonationSupporterWall />

        {/* VIRAL SPREAD CALLOUT */}
        <DonationViralShare handleShare={handleShare} />
      </main>

      <Footer />
    </div>
  );
};

export default DonatePage;
