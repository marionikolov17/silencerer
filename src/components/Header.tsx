'use client';

import Link from 'next/link';
import { PiArrowBendUpLeftBold, PiArrowBendUpRightBold } from 'react-icons/pi';
import { GithubSvg, LinkedInSvg } from './constants/tech-icons';
interface InputProps {
  openExportWindow: () => void;
}

export default function Header({ openExportWindow }: InputProps) {
  return (
    <div className="w-full h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-x-2">
        <h1 className="text-base sm:text-lg font-bold">Silencerer.com</h1>
        <button
          className="ms-4 sm:ms-8 p-2 rounded-full cursor-pointer hover:bg-gray-200 hidden"
          title="Undo"
        >
          <PiArrowBendUpLeftBold className="text-xl text-gray-500" />
        </button>
        <button
          className="sm:ms-2 p-2 rounded-full cursor-pointer hover:bg-gray-200 hidden"
          title="Redo"
        >
          <PiArrowBendUpRightBold className="text-xl text-gray-500" />
        </button>
        <Link
          href="https://github.com/marionikolov17/silencerer"
          className="ms-2"
        >
          <GithubSvg className="w-6 h-6 text-gray-300 hover:text-blue-500 transition-all duration-300" />
        </Link>
        <Link
          href="https://www.linkedin.com/in/marionikolovdev/"
          className="ms-1"
        >
          <LinkedInSvg className="w-6 h-6 text-gray-300 hover:text-blue-500 transition-all duration-300" />
        </Link>
      </div>
      <div className="flex items-center gap-x-2">
        <button
          className="bg-orange-500 text-white text-sm px-8 py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition-all duration-300"
          title="Export Media"
          onClick={openExportWindow}
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
