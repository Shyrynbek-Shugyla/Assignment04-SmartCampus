import type { ReactNode } from 'react';

type Props = {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  error: string | null;
  icon: ReactNode;
  submitted: boolean;
  inputMode?: 'numeric' | 'text';
};

export default function FieldInput({
  label,
  hint,
  value,
  onChange,
  error,
  icon,
  submitted,
  inputMode = 'numeric',
}: Props) {
  const showError = submitted && !!error;
  return (
    <div>
      <label className="mb-1 flex items-center justify-between text-sm font-medium text-purple-900">
        <span className="flex items-center gap-1.5 text-purple-700">
          {icon}
          {label}
        </span>
        {hint !== undefined && <span className="text-xs font-normal text-pink-500">{hint}</span>}
      </label>
      <input
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'w-full rounded-xl border bg-white px-3 py-2 text-sm text-purple-900 shadow-sm outline-none focus:ring-2',
          showError
            ? 'border-purple-300 focus:border-purple-400 focus:ring-purple-200'
            : 'border-pink-200 focus:border-pink-400 focus:ring-pink-200',
        ].join(' ')}
      />
      {showError && <p className="mt-1 text-xs text-purple-600">{error}</p>}
    </div>
  );
}
