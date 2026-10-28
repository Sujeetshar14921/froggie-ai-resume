import React from "react";
import { QrCode, CheckCircle2, Copy, Zap, ExternalLink } from "lucide-react";
import { DONATION_CONFIG } from "../../constants/donationConfig";

const DonationQrPaymentCard = ({
  currentAmount,
  qrCodeUrl,
  upiUri,
  copiedUpi,
  handleCopyUpi,
}) => {
  return (
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
  );
};

export default DonationQrPaymentCard;
