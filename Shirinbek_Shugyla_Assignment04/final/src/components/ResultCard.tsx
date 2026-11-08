import { CalendarCheck, CalendarX } from 'lucide-react';

// One component, two visual variants (replaces two near-identical JSX blocks).
const VARIANTS = {
  available: {
    Icon: CalendarCheck,
    title: 'Available',
    box: 'border-pink-200 from-pink-50 to-fuchsia-50',
    badge: 'bg-pink-500 shadow-pink-300/50',
    titleColor: 'text-pink-700',
    reasonColor: 'text-pink-600/90',
  },
  unavailable: {
    Icon: CalendarX,
    title: 'Unavailable',
    box: 'border-purple-200 from-purple-50 to-violet-50',
    badge: 'bg-purple-600 shadow-purple-300/50',
    titleColor: 'text-purple-700',
    reasonColor: 'text-purple-600/90',
  },
} as const;

export default function ResultCard({ available, reason }: { available: boolean; reason: string }) {
  const v = available ? VARIANTS.available : VARIANTS.unavailable;
  return (
    <div
      role="status"
      data-testid="result-card"
      className={`mt-5 flex items-start gap-3 rounded-2xl border bg-gradient-to-br p-4 shadow-sm ${v.box}`}
    >
      <div className={`rounded-xl p-2 text-white shadow-md ${v.badge}`}>
        <v.Icon className="h-5 w-5" />
      </div>
      <div>
        <p className={`text-base font-semibold ${v.titleColor}`}>{v.title}</p>
        <p className={`text-sm ${v.reasonColor}`}>{reason}</p>
      </div>
    </div>
  );
}
