import React, { useEffect, useRef } from 'react';

interface VideoFeedProps {
  stream: MediaStream | null;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) return null;

  return (
    <div className="border-t bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Screen Preview</h2>
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full max-h-32 object-contain bg-black rounded-lg"
        />
      </div>
    </div>
  );
};

export default VideoFeed;