'use client';

import { AppMachineContext } from '@/state-machine/app';
import useHandleClickOutside from '@/hooks/useHandleClickOutside';
import { SilenceDetectionAlgorithm } from '@/types/silencer-params';
import { useRef, useState } from 'react';
import { convertMsToSeconds, convertSecondsToMs } from '@/utils/time';

interface InputProps {
  closeSettings: () => void;
}

export default function SilencerSettings({ closeSettings }: InputProps) {
  const silencerParams = AppMachineContext.useSelector(
    (state) => state.context.silencerParams,
  );

  const [algorithm, setAlgorithm] = useState<SilenceDetectionAlgorithm>(
    silencerParams.algorithm,
  );
  const [threshold, setThreshold] = useState<number>(silencerParams.threshold);
  const [minimumSilenceDuration, setMinimumSilenceDuration] = useState<number>(
    convertSecondsToMs(silencerParams.minimumSilenceDuration),
  );
  const [frameTime, setFrameTime] = useState<number>(
    convertSecondsToMs(silencerParams.frameTime),
  );
  const [crossfadeDuration, setCrossfadeDuration] = useState<number>(
    convertSecondsToMs(silencerParams.crossfadeDuration),
  );

  const formRef = useRef<HTMLFormElement>(null);

  const appMachineActorRef = AppMachineContext.useActorRef();

  useHandleClickOutside(formRef, closeSettings);

  const handleCancel = () => {
    closeSettings();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    appMachineActorRef.send({
      type: 'event.update_silencer_params',
      silencerParams: {
        algorithm,
        threshold,
        minimumSilenceDuration: convertMsToSeconds(minimumSilenceDuration),
        frameTime: convertMsToSeconds(frameTime),
        crossfadeDuration: convertMsToSeconds(crossfadeDuration),
      },
    });
    closeSettings();
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
            value={algorithm}
            onChange={(e) =>
              setAlgorithm(e.target.value as SilenceDetectionAlgorithm)
            }
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
          value={threshold}
          metric="dB"
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
        <SettingsInputField
          label="Min Duration"
          name="minimumSilenceDuration"
          id="minimumSilenceDuration"
          type="number"
          value={minimumSilenceDuration}
          metric="ms"
          onChange={(e) => setMinimumSilenceDuration(Number(e.target.value))}
        />
        <SettingsInputField
          label="Frame Time"
          name="frameTime"
          id="frameTime"
          type="number"
          value={frameTime}
          metric="ms"
          onChange={(e) => setFrameTime(Number(e.target.value))}
        />
        <SettingsInputField
          label="Crossfade"
          name="crossfadeDuration"
          id="crossfadeDuration"
          type="number"
          value={crossfadeDuration}
          metric="ms"
          onChange={(e) => setCrossfadeDuration(Number(e.target.value))}
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
  value: string | number;
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
