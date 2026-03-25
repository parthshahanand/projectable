export const REPORT_COLORS = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
] as const;

export type ReportColor = typeof REPORT_COLORS[number];

export const PICKER_COLOR_CLASSES: Record<ReportColor, string> = {
  red: 'bg-red-500/50 border-red-500/50 hover:bg-red-500/70',
  orange: 'bg-orange-500/50 border-orange-500/50 hover:bg-orange-500/70',
  amber: 'bg-amber-500/50 border-amber-500/50 hover:bg-amber-500/70',
  yellow: 'bg-yellow-500/50 border-yellow-500/50 hover:bg-yellow-500/70',
  lime: 'bg-lime-500/50 border-lime-500/50 hover:bg-lime-500/70',
  green: 'bg-green-500/50 border-green-500/50 hover:bg-green-500/70',
  emerald: 'bg-emerald-500/50 border-emerald-500/50 hover:bg-emerald-500/70',
  teal: 'bg-teal-500/50 border-teal-500/50 hover:bg-teal-500/70',
  cyan: 'bg-cyan-500/50 border-cyan-500/50 hover:bg-cyan-500/70',
  sky: 'bg-sky-500/50 border-sky-500/50 hover:bg-sky-500/70',
  blue: 'bg-blue-500/50 border-blue-500/50 hover:bg-blue-500/70',
  indigo: 'bg-indigo-500/50 border-indigo-500/50 hover:bg-indigo-500/70',
  violet: 'bg-violet-500/50 border-violet-500/50 hover:bg-violet-500/70',
  purple: 'bg-purple-500/50 border-purple-500/50 hover:bg-purple-500/70',
  fuchsia: 'bg-fuchsia-500/50 border-fuchsia-500/50 hover:bg-fuchsia-500/70',
  pink: 'bg-pink-500/50 border-pink-500/50 hover:bg-pink-500/70',
  rose: 'bg-rose-500/50 border-rose-500/50 hover:bg-rose-500/70',
};

export const BADGE_COLOR_CLASSES: Record<ReportColor, string> = {
  red: "bg-red-500/50 border-red-500 text-red-950",
  orange: "bg-orange-500/50 border-orange-500 text-orange-950",
  amber: "bg-amber-500/50 border-amber-500 text-amber-950",
  yellow: "bg-yellow-500/50 border-yellow-500 text-yellow-950",
  lime: "bg-lime-500/50 border-lime-500 text-lime-950",
  green: "bg-green-500/50 border-green-500 text-green-950",
  emerald: "bg-emerald-500/50 border-emerald-500 text-emerald-950",
  teal: "bg-teal-500/50 border-teal-500 text-teal-950",
  cyan: "bg-cyan-500/50 border-cyan-500 text-cyan-950",
  sky: "bg-sky-500/50 border-sky-500 text-sky-950",
  blue: "bg-blue-500/50 border-blue-500 text-blue-950",
  indigo: "bg-indigo-500/50 border-indigo-500 text-indigo-950",
  violet: "bg-violet-500/50 border-violet-500 text-violet-950",
  purple: "bg-purple-500/50 border-purple-500 text-purple-950",
  fuchsia: "bg-fuchsia-500/50 border-fuchsia-500 text-fuchsia-950",
  pink: "bg-pink-500/50 border-pink-500 text-pink-950",
  rose: "bg-rose-500/50 border-rose-500 text-rose-950",
};

export const COLOR_OPTIONS = REPORT_COLORS.map(name => ({
  name,
  pickerClass: PICKER_COLOR_CLASSES[name],
  badgeClass: BADGE_COLOR_CLASSES[name]
}));
