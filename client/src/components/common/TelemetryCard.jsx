import React from 'react';

const COLOR_STYLES = {
  emerald: {
    pod: 'icon-3d-pod-emerald',
    gradient: 'from-emerald-500/15 via-emerald-500/5',
    dot: 'bg-emerald-500',
    valueText: 'text-slate-950 dark:text-white',
    subText: 'text-emerald-700 dark:text-emerald-400 font-bold',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
  },
  blue: {
    pod: 'icon-3d-pod-blue',
    gradient: 'from-blue-500/15 via-blue-500/5',
    dot: 'bg-blue-500',
    valueText: 'text-blue-600 dark:text-blue-400',
    subText: 'text-slate-500 dark:text-slate-400 font-medium',
    badgeText: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    pod: 'icon-3d-pod-purple',
    gradient: 'from-purple-500/15 via-purple-500/5',
    dot: 'bg-purple-500',
    valueText: 'text-purple-600 dark:text-purple-400',
    subText: 'text-slate-500 dark:text-slate-400 font-medium',
    badgeText: 'text-purple-600 dark:text-purple-400',
  },
  amber: {
    pod: 'icon-3d-pod-amber',
    gradient: 'from-amber-500/15 via-amber-500/5',
    dot: 'bg-amber-500',
    valueText: 'text-amber-600 dark:text-amber-400',
    subText: 'text-slate-500 dark:text-slate-400 font-medium',
    badgeText: 'text-amber-600 dark:text-amber-400',
  },
  rose: {
    pod: 'icon-3d-pod-rose',
    gradient: 'from-rose-500/15 via-rose-500/5',
    dot: 'bg-rose-500',
    valueText: 'text-rose-600 dark:text-rose-400',
    subText: 'text-slate-500 dark:text-slate-400 font-medium',
    badgeText: 'text-rose-600 dark:text-rose-400',
  },
  cyan: {
    pod: 'icon-3d-pod-cyan',
    gradient: 'from-cyan-500/15 via-cyan-500/5',
    dot: 'bg-cyan-500',
    valueText: 'text-cyan-600 dark:text-cyan-400',
    subText: 'text-slate-500 dark:text-slate-400 font-medium',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
  },
};

const TelemetryCard = ({
  label,
  value,
  badge,
  icon: Icon,
  color = 'emerald',
  subtext,
  subtextColor,
  valueColor,
  pulseDot = false,
  hasCornerGlow = true,
  onClick,
  className = '',
}) => {
  const c = COLOR_STYLES[color] || COLOR_STYLES.emerald;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {hasCornerGlow && (
        <div
          className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${c.gradient} to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500`}
        />
      )}

      <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2">
        <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
          {label}
        </span>
        {Icon && (
          <div className={`icon-3d-pod ${c.pod} p-1.5 rounded-lg sm:rounded-xl shrink-0`}>
            {React.isValidElement(Icon) ? (
              Icon
            ) : (
              <Icon size={14} className="lucide-3d sm:w-4 sm:h-4" />
            )}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className={`text-xl sm:text-2xl lg:text-3xl font-black ${valueColor || c.valueText}`}>
          {value}
        </span>
        {badge && (
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate">
            {badge}
          </span>
        )}
      </div>

      {subtext && (
        <p className={`text-[10px] sm:text-[11px] mt-1 flex items-center gap-1 truncate ${subtextColor || c.subText}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot} ${pulseDot ? 'animate-pulse' : ''}`} />
          <span className="truncate">{subtext}</span>
        </p>
      )}
    </div>
  );
};

export default TelemetryCard;
