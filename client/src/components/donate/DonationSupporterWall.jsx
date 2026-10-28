import React from "react";
import { Users } from "lucide-react";

const COMMUNITY_DONORS = [
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

const DonationSupporterWall = () => {
  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mb-20 text-left">
      <div className="glass-dark-elevated bg-slate-950 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800 group">
        {/* Half-circle colorful environment auras */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-emerald-500/20 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700 blur-xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/15 via-indigo-400/10 to-transparent rounded-tr-full pointer-events-none blur-xl" />

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
          {COMMUNITY_DONORS.map((donor, i) => (
            <div
              key={i}
              className="relative overflow-hidden p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 group/donor hover:border-slate-700 transition-colors"
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
  );
};

export default DonationSupporterWall;
