import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ScreenshotViewerProps {
  src: string;
}

const ScreenshotViewer: React.FC<ScreenshotViewerProps> = ({ src }) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 flex gap-1 bg-black/50 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={handleZoomOut}
          className="p-1 text-white hover:bg-white/20 rounded"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-1 text-white hover:bg-white/20 rounded"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-1 text-white hover:bg-white/20 rounded"
          title="Toggle fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      <div className={`relative overflow-auto ${isFullscreen ? 'h-screen' : 'max-h-[40vh]'}`}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
          <img
            src={src}
            alt="Screenshot"
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}

export default ScreenshotViewer;