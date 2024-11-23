import React, { useCallback, useRef } from 'react';
import { Send, Image as ImageIcon, Loader } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: string[]) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = React.useState('');
  const [isCapturing, setIsCapturing] = React.useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const initializeScreenCapture = async () => {
    if (!streamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: 'monitor',
            cursor: 'always'
          },
          audio: false,
          systemAudio: 'exclude'
        });
        streamRef.current = stream;

        // Add track ended listener to clean up when user stops sharing
        stream.getVideoTracks()[0].addEventListener('ended', () => {
          streamRef.current = null;
        });
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            onSendMessage('Screen capture permission was denied.');
          } else {
            onSendMessage('Failed to initialize screen capture. Please try again.');
          }
        }
        console.error('Error initializing screen capture:', err);
        return false;
      }
    }
    return true;
  };

  const captureScreen = useCallback(async () => {
    try {
      setIsCapturing(true);

      // Initialize or reuse existing stream
      const initialized = await initializeScreenCapture();
      if (!initialized || !streamRef.current) return;

      const video = document.createElement('video');
      video.srcObject = streamRef.current;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);

      const screenshot = canvas.toDataURL('image/png');
      onSendMessage('Screenshot captured:', [screenshot]);

      // Don't stop the stream, just pause the video
      video.pause();
    } catch (err) {
      console.error('Error capturing screen:', err);
      onSendMessage('Failed to capture screen. Please try again.');
      // Clean up the stream reference if there's an error
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    } finally {
      setIsCapturing(false);
    }
  }, [onSendMessage]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-4 border-t bg-white">
      {isCapturing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center gap-2">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Capturing screen...</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={captureScreen}
            disabled={isCapturing}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              isCapturing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Capture screenshot"
          >
            <ImageIcon className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 text-blue-500 hover:text-blue-700 transition-colors disabled:text-gray-300"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;