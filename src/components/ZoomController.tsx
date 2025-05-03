import { CiZoomIn, CiZoomOut } from 'react-icons/ci';
import RangeController from './utils/RangeController';
import { Dispatch, SetStateAction, useCallback } from 'react';

interface InputProps {
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
}

export default function ZoomController({ zoom, setZoom }: InputProps) {
  const minZoom = 100;
  const maxZoom = 200;
  const zoomDiff = 10;

  const updateZoom = useCallback(
    (value: number) => {
      if (value >= minZoom && value <= maxZoom) {
        setZoom(value);
      }
    },
    [setZoom, minZoom, maxZoom],
  );

  const incrementZoom = () => {
    setZoom(Math.min(zoom + zoomDiff, maxZoom));
  };

  const decrementZoom = () => {
    setZoom(Math.max(zoom - zoomDiff, minZoom));
  };

  return (
    <div className="flex items-center gap-x-4">
      <button
        title="Zoom In"
        className="rounded-full flex items-center justify-center cursor-pointer hover:text-blue-500"
        onClick={incrementZoom}
      >
        <CiZoomIn className="text-2xl" />
      </button>
      <RangeController
        min={minZoom}
        max={maxZoom}
        value={zoom}
        updateValue={updateZoom}
      />
      <button
        title="Zoom Out"
        className="rounded-full flex items-center justify-center cursor-pointer hover:text-blue-500"
        onClick={decrementZoom}
      >
        <CiZoomOut className="text-2xl" />
      </button>
    </div>
  );
}
