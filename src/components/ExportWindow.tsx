import { useRef } from 'react';
import RangeController from './utils/RangeController';
import useHandleClickOutside from '@/hooks/useHandleClickOutside';

interface InputProps {
  closeExportWindow: () => void;
}

export default function ExportWindow({ closeExportWindow }: InputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useHandleClickOutside(containerRef, closeExportWindow);

  return (
    <div className="w-full min-h-full bg-black/30 flex items-center justify-center z-[65] fixed top-0 left-0">
      <div
        ref={containerRef}
        className="w-96 h-max bg-white rounded-lg flex flex-col gap-y-4 p-8"
      >
        <h3 className="text-xl font-bold text-center mb-4">Export Media</h3>
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm text-gray-600 w-14">
            Format:{' '}
          </label>
          <select
            name=""
            id=""
            className="grow w-full sm:w-auto border border-gray-200 rounded-lg px-2 py-1 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">WAV</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm text-gray-600 w-14">
            Quality:{' '}
          </label>
          <RangeController
            min={50}
            max={100}
            value={100}
            className="grow"
            updateValue={() => {}}
            disabled={true}
          />
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm text-gray-600 w-14">
            Name:
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="File name"
            className="grow w-full sm:w-auto border border-gray-200 rounded-lg px-2 py-1 outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm text-gray-600">
            Normalize audio
          </label>
          <div className="grow flex items-center justify-end">
            <div className="w-6 h-6 rounded-full border border-gray-200 p-1 cursor-pointer">
              <div className="w-full h-full rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>
        <button className="w-full bg-blue-500 text-white rounded-lg py-2 mt-4 cursor-pointer hover:bg-blue-600 transition-all duration-300">
          Export
        </button>
        <button
          onClick={closeExportWindow}
          className="w-full bg-gray-200 text-gray-600 rounded-lg py-2 cursor-pointer hover:bg-gray-300 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
