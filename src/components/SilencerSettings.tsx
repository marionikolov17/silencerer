import useHandleClickOutside from '@/hooks/useHandleClickOutside';
import { SilenceDetectionAlgorithm } from '@/types/silencer-params';
import { useRef } from 'react';

interface InputProps {
  closeSettings: () => void;
}

export default function SilencerSettings({ closeSettings }: InputProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useHandleClickOutside(formRef, closeSettings);

  const handleCancel = () => {
    closeSettings();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
  };

  return (
    <div className="fixed z-[65] top-0 left-0 w-full min-h-full bg-black/30 flex items-center justify-center p-4 sm:p-0">
      <form
        className="w-[450px] h-max bg-white rounded-lg px-8 py-8 flex flex-col gap-y-4 overflow-hidden"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <h3 className="text-xl font-bold text-center mb-4">Silence Settings</h3>
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-y-2">
          <label htmlFor="algorithm" className="w-32 text-sm text-gray-600">
            Algorithm
          </label>
          <select
            name="algorithm"
            id="algorithm"
            className="grow w-full sm:w-auto border border-gray-200 rounded-lg px-2 py-1 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          >
            <option value={SilenceDetectionAlgorithm.STE}>
              Short Time Energy
            </option>
          </select>
        </div>
        <SettingsInputField
          label="Threshold"
          name="threshold"
          id="threshold"
          type="number"
          value="0.01"
          metric="dB"
          onChange={() => {}}
        />
        <SettingsInputField
          label="Min Duration"
          name="minimumSilenceDuration"
          id="minimumSilenceDuration"
          type="number"
          value="200"
          metric="ms"
          onChange={() => {}}
        />
        <SettingsInputField
          label="Frame Time"
          name="frameTime"
          id="frameTime"
          type="number"
          value="20"
          metric="ms"
          onChange={() => {}}
        />
        <SettingsInputField
          label="Crossfade"
          name="crossfadeDuration"
          id="crossfadeDuration"
          type="number"
          value="50"
          metric="ms"
          onChange={() => {}}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 mt-4 hover:bg-blue-600 transition-all duration-300 cursor-pointer"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="w-full flex items-center justify-center rounded-lg px-4 cursor-pointer"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

function SettingsInputField({
  label,
  name,
  id,
  type,
  value,
  metric,
  onChange,
}: {
  label: string;
  name: string;
  id: string;
  type: string;
  value: string;
  metric: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-y-2">
      <label htmlFor={id} className="w-32 text-sm shrink-0 text-gray-600">
        {label}
      </label>
      <div className="grow w-full sm:w-auto flex items-center border border-gray-200 rounded-lg gap-2 px-2 py-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          name={name}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className="grow outline-none"
        />
        <span className="text-sm text-gray-500">{metric}</span>
      </div>
    </div>
  );
}
