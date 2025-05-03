import { CiZoomIn, CiZoomOut } from 'react-icons/ci';
import RangeController from './utils/RangeController';

export default function ZoomController() {
  return (
    <div className="flex items-center gap-x-4">
      <button
        title="Zoom In"
        className="rounded-full flex items-center justify-center cursor-pointer hover:text-blue-500"
      >
        <CiZoomIn className="text-2xl" />
      </button>
      <RangeController min={0} max={100} updateValue={() => {}} />
      <button
        title="Zoom Out"
        className="rounded-full flex items-center justify-center cursor-pointer hover:text-blue-500"
      >
        <CiZoomOut className="text-2xl" />
      </button>
    </div>
  );
}
