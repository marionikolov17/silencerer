'use client';

import { PiArrowBendUpLeftBold, PiArrowBendUpRightBold } from 'react-icons/pi';

export default function Header() {
  return (
    <div className="w-full h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-x-2">
        <h1 className="text-base sm:text-lg font-bold">Silencerer.com</h1>
        <button
          className="ms-4sm:ms-8 p-2 rounded-full cursor-pointer hover:bg-gray-200"
          title="Undo"
        >
          <PiArrowBendUpLeftBold className="text-xl text-gray-500" />
        </button>
        <button
          className="sm:ms-2 p-2 rounded-full cursor-pointer hover:bg-gray-200"
          title="Redo"
        >
          <PiArrowBendUpRightBold className="text-xl text-gray-500" />
        </button>
      </div>
      <div className="flex items-center gap-x-2">
        <button
          className="bg-orange-500 text-white text-sm px-8 py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition-all duration-300"
          title="Export Media"
        >
          Export
        </button>
        <button
          className="hidden xl:flex bg-blue-500 text-white text-sm px-8 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:hover:bg-blue-300"
          title="Save Project (disabled)"
          disabled
        >
          Save Project
        </button>
      </div>
    </div>
  );
}
