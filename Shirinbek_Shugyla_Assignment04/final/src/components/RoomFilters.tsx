import { Users } from 'lucide-react';
import FieldInput from './FieldInput';

type Props = {
  attendeesRaw: string;
  onAttendeesChange: (v: string) => void;
  attendeesError: string | null;
  equipmentOptions: readonly string[];
  selectedEquipment: readonly string[];
  onToggleEquipment: (item: string) => void;
};

export default function RoomFilters({
  attendeesRaw,
  onAttendeesChange,
  attendeesError,
  equipmentOptions,
  selectedEquipment,
  onToggleEquipment,
}: Props) {
  return (
    <fieldset className="grid grid-cols-1 gap-4 border-0 p-0">
      <legend className="mb-2 text-sm font-semibold text-purple-900">Room requirements</legend>
      <FieldInput
        label="Attendees (optional)"
        value={attendeesRaw}
        onChange={onAttendeesChange}
        error={attendeesError}
        icon={<Users className="h-4 w-4" />}
        submitted={true}
      />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Required equipment">
        {equipmentOptions.map((item) => {
          const checked = selectedEquipment.includes(item);
          return (
            <label
              key={item}
              className={[
                'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition',
                checked
                  ? 'border-pink-400 bg-pink-100 text-pink-800'
                  : 'border-pink-200 bg-white text-purple-700',
              ].join(' ')}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => onToggleEquipment(item)}
              />
              {item}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
