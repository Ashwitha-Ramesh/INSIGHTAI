import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'info' | 'neutral';
  };
  accentColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  accentColor = 'indigo',
}) => {
  const badgeColors = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    neutral: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-lg hover:border-slate-700/80 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {value}
            </span>
            {badge && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badgeColors[badge.variant]}`}>
                {badge.text}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1.5 text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className="p-2.5 rounded-xl bg-slate-800/90 text-indigo-400 border border-slate-700/50 group-hover:scale-105 group-hover:text-indigo-300 transition-all">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Decorative gradient blur */}
      <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/10 transition-all" />
    </div>
  );
};
