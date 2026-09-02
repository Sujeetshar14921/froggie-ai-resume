/**
 * Froggie 100% Free Donation Configuration
 * Uses Direct Zero-Fee UPI & Global Zero-Commission Options
 */
export const DONATION_CONFIG = {
  // UPI Configuration (0% transaction fee, direct bank transfer)
  upiId: "sujeetsharmadc56@oksbi", // Replace with your exact UPI ID anytime
  payeeName: "Froggie AI Developer",
  currency: "INR",

  // Preset Tiers (INR)
  tiers: [
    {
      id: "tea",
      title: "Cutting Chai",
      emoji: "☕",
      amount: 50,
      description: "Covers 30 AI ATS resume generations on our cloud LLM.",
      badge: "Quick Coffee",
      popular: false,
    },
    {
      id: "coffee",
      title: "Cold Brew",
      emoji: "🧋",
      amount: 100,
      description: "Keeps our high-speed MongoDB database online for 100+ candidates.",
      badge: "Most Popular",
      popular: true,
    },
    {
      id: "meal",
      title: "Dev Pizza",
      emoji: "🍕",
      amount: 250,
      description: "Fuels rapid development of new ATS templates & career tools.",
      badge: "Fuel Dev",
      popular: false,
    },
    {
      id: "cloud",
      title: "Server Booster",
      emoji: "🚀",
      amount: 500,
      description: "Sponsors 1 month of production cloud hosting and domain fees.",
      badge: "Super Backer",
      popular: false,
    },
    {
      id: "patron",
      title: "Froggie Patron",
      emoji: "👑",
      amount: 1000,
      description: "Lifetime shoutout on our Wall of Fame + Special Donor Badge.",
      badge: "Legendary",
      popular: false,
    },
  ],

  // Transparency breakdown of costs
  costBreakdown: [
    {
      percentage: "45%",
      label: "AI LLM Inference",
      description: "OpenAI & Google Gemini tokens for Copilot chat, ATS scoring, and bullet generation.",
      icon: "Sparkles",
    },
    {
      percentage: "35%",
      label: "Cloud & Database",
      description: "High-speed MongoDB Atlas cluster, Vercel/Render servers, and global CDN.",
      icon: "Server",
    },
    {
      percentage: "20%",
      label: "R&D & New Features",
      description: "Designing fresh modern resume templates, cover letter tools, and recruiter filters.",
      icon: "Code",
    },
  ],
};
